# Promise实现原理

Promise规范有很多，有Promise/A，Promise/B，Promise/D以及Promise/A+。ES6中采用了Promise/A+规范。

说到底，Promise还是使用回调函数，只不过是把回调封装在内部，使用上一致通过then方法的链式调用，使得多层的回调嵌套看起来变成了一层的，书写和理解上会更直观和简洁一些。

## 基础版本

```js
class Promise {
    _callbacks = [];

    constructor(fn) {
        fn(this._resolve.bind(this));
    }

    then(onFullfilled) {
        this._callbacks.push(onFullfilled);
        return this;
    }

    _resolve(value) {
        this._callbacks.forEach(fn => {
            fn(value);
        })
    }
}
```

## 加入延迟机制 & 增加状态

上面Promise的实现存在一个问题，如果在then方法注册之前resolve就执行了，onFullfilled就不会执行了。Promise/A+规范明确要求回调通过异步方式执行，用以保证一致可靠的执行顺序。

Promise/A+规范明确规定了，pending可以转化为fulfilled或rejected并且只转化一次。

```js
class Promise {
    _callbacks = [];
    _value = null;
    _state = `pending`;

    constructor(fn) {
        fn(this._resolve.bind(this));
    }

    then(onFullfilled) {
        if (this._state === 'pending') {
            this._callbacks.push(onFullfilled);
        } else {
            onFullfilled(this._value);
        }
        return this;
    }

    _resolve(value) {
        if (this._state !== 'pending') {
            return;
        }
        this._value = value;
        this._state = `fulfilled`;
        this._callbacks.forEach(fn => {
            fn(value);
        });
    }
}
```

## Promise链式调用

真正的链式Promise是指在当前Promise达到fulfilled状态后，即开始进行下一个Promise。

```js
class Promise {
    _callbacks = [];
    _value = null;
    _state = `pending`;

    constructor(fn) {
        fn(this._resolve.bind(this));
    }

    then(onFullfilled) {
        return new Promise((resolve) => {
            this._handle({
                onFullfilled: onFullfilled || null,
                resolve: resolve
            })
        })
    }

    _handle(cb) {
        if (this._state === 'pending') {
            this._callbacks.push(cb);
            return;
        }

        if (!cb.onFulfilled) {
            cb.resolve(this._value);
            return;
        }

        let ret = cb.onFullfilled(this._value);
        callback.resolve(ret);
    }

    _resolve(value) {
        if (this._state !== 'pending') {
            return;
        }
        if (value && (typeof value === 'object' && typeof value.then === 'function')) {
            let then = value.then;
            then.call(value, this._resolve.bind(this));
            return;
        }
        this._value = value;
        this._state = `fulfilled`;
        this._callbacks.forEach(cb => {
            this._handle(cb)
        });
    }
}
```

then方法中，创建并返回了新的Promise实例，这是链式调用的根本。

then方法传入的形参onFullfilled以及新创建的Promise实例时传入的resolve放在一起，被push到callbask队列中，这是衔接当前Promise和后邻Promise的关键所在。

根据规范，onFullfilled可以是空的，为空时不调用onFulfilled。

链式调用的真正的意义：执行当前Promise的onFulfilled时，返回值通过调用第二个Promise的resolve方法，传递给第二个Promise value值。

如果_resolve的值是一个Promise呢？

```js
_resolve(value) {
    if (value && (typeof value === 'object' && typeof value.then === 'function')) {
        let then = value.then;
        then.call(value, this._resolve.bind(this));
        return;
    }

    this._value = 'fulfilled';
    this._value = value;
    this._callbacks.forEach(cb => this._handle(cb));
}
```

需要对resolve中的值作一个特殊的判断，如果_resolve的值是一个Promise实例，那么就把当前Promise实例的状态改变接口重新注册到resolve的值对应的Promise的onFulfilled中，以此来实现，当前Promise实例的状态要依赖resolve的值的Promise实例的状态。

## 错误处理

之前为了讲解原理，只是实现了onFulfilled，对于Promise来说，除了成功，还有失败，在失败时，要标记Promise的状态为rejected，并执行注册的onRejected。

```js
class Promise {
    _callbacks = [];
    _value = null;
    _state = `pending`;

    constructor(fn) {
        fn(this._resolve.bind(this), this._reject.bind(this));
    }

    then(onFullfilled, onRejected) {
        return new Promise((resolve, reject) => {
            this._handle({
                onFullfilled: onFullfilled || null,
                onRejected: onRejected || null,
                resolve: resolve
                reject: reject
            })
        })
    }

    _handle(cb) {
        if (this._state === 'pending') {
            this._callbacks.push(cb);
            return;
        }

        if (this._state === 'fulfilled') {
            if (!cb.onFulfilled) {
                cb.resolve(this._value);
                return;
            }
            let ret;
            try {
                ret = cb.onFullfilled(this._value);
                cb.resolve(ret);
            } catch (ex) {
                cb.reject(ex);
            }
        } else {
            if (!cb.onRejected) {
                cb.resolve(this._value);
                return;
            }
            let ret;
            try {
                ret = cb.onRejected(this._value);
                cb.resolve(ret);
            } catch (ex) {
                cb.reject(ex);
            }
        }
    }

    _resolve(value) {
        if (this._state !== 'pending') {
            return;
        }
        if (value && (typeof value === 'object' && typeof value.then === 'function')) {
            let then = value.then;
            then.call(value, this._resolve.bind(this), this._reject.bind(this));
            return;
        }
        this._value = value;
        this._state = `fulfilled`;
        this._callbacks.forEach(cb => {
            this._handle(cb)
        });
    }

    _reject(err) {
        if (this._state !== 'pending') {
            return;
        }

        this._value = err;
        this._state = 'rejected';
        this._callbacks.forEach(cb => {
            this._handle(cb);
        })
    }
}
```

## 异常处理

在执行onFulfilled或onRejected时，出现了异常，应该使用try-catch捕获错误，然后将相应的Promise状态设置为rejected状态。

```js
_handle(cb) {
    if (this._state === 'pending') {
        this._callbacks.push(cb);
        return;
    }

    if (this._state === 'fulfilled') {
        if (!cb.onFulfilled) {
            cb.resolve(this._value);
            return;
        }
        let ret;
        try {
            ret = cb.onFullfilled(this._value);
            cb.resolve(ret);
        } catch (ex) {
            cb.reject(ex);
        }
    } else {
        if (!cb.onRejected) {
            cb.resolve(this._value);
            return;
        }
        let ret;
        try {
            ret = cb.onRejected(this._value);
            cb.resolve(ret);
        } catch (ex) {
            cb.reject(ex);
        }
    }
}

catch (onError) {
    return this.then(null, onError)
}
```

## Finally方法

finally用于不管Promise最后的状态如何，都要执行某些操作。根据规范，finally的参数调用没有参数；finally的参数返回一个Promise时，会改变finally返回的Promise的值状态。

```js
finally(onDone) {
    if (typeof onDone !== 'function') {
        return this.then();
    }

    let Promise = this.constructor;
    return this.then(val => {
        return Promise.resolve(onDone()).then(() => val);
    }, reason => {
        return Promise.resolve(onDone()).then(() => {
            throw reason
        })
    })
}
```

## 总结原理

Promise一般用于异步操作，和一个promise进行交互的主要方式是通过它的then，catch和finally方法。新建Promise实例时，需要传一个函数参数，Promise的构造函数会将内部的resolve和reject作为参数同步调用传递的函数。Promise内部有一个状态变量来标识自身的状态，状态初始值为pending，通过调用resolve方法可以将状态由pending变为fulfilled，通过调用reject方法可以将状态由pending变为rejected。Promise的then和catch主要是将相关的函数添加到Promise的回调方法的数组中，当状态变化时，Promise内部会执行相应的回调。Promise的链式调用主要是通过then方法返回一个新的Promise实例来实现的。


## 参考文档

https://zhuanlan.zhihu.com/p/102017798