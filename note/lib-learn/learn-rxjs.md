# RxJS学习笔记

rxjs是一个使用可观察序列来处理异步和基于事件的程序的一个类库。它提供一个核心的类型Observable，辅助类型(Observer，Schedulers，Subjects)和运算符(map, filter, reduce, every等)。

## 基本概念

1、Observable，代表未来的值或事件的调用集合。

2、Observer，是一个知道如何处理Observable投递的值的回调函数的列表。

3、Subscription，表示Observable的执行，主要用于取消执行。

4、Operators，是纯函数，支持函数式编程风格来处理数据。

5、Subject，等效于事件发射器，是多播一个值或事件到多个观察者的唯一方式。

6、Schedulers，集中式调度器来控制并发性，允许我们在计算发生时进行协调。

## 第一个示例

```js
fromEvent(document, 'click').subscribe((ev) => {
    console.log(`Clicked at ${new Date().toString()}`);
})
```

## 纯函数产生值

RxJS的强大之处在于可使用纯函数来产生值。这意味着你的代码更少出错。 

当然你也可以使用不纯的函数，但是状态会很混乱。

```js
let count = 0;
document.addEventListener('click', () => console.log(`Clicked ${++count} times`));
```

使用RxJS可以隔离状态。

```js
fromEvent(document, 'click')
    .pipe(scan(count => count + 1, 0))
    .subscribe((count) => {
        console.log(`Clicked ${count} times`);
    });
```

scan运算符的工作方式和数组的reduce类似。回调的返回值会作为下一个回调的参数。

## Flow

RxJS具有一系列的运算符来帮你控制事件在Observerable的流动。

```js
//旧方式来限制点击频率
let count = 0;
let rate = 1000;
let lastClick = Date.now() - rate;
document.addEventListener('click', () => {
  if (Date.now() - lastClick >= rate) {
    console.log(`Clicked ${++count} times`);
    lastClick = Date.now();
  }
});
```

使用RxJS：

```js
fromEvent(document, 'click')
    .pipe(throttleTime(1000), scan(count => count + 1, 0)).subscribe(count => {
        console.log(`Clicked ${count} times!`)
    })
```

其它的流的处理运算符有filter，delay，debounceTime，take，takeUntil，distinct，distinctUntilChanged等。

## Values

你可以转换经过Observables的值。

```js
let count = 0;
const rate = 1000;
let lastClick = Date.now() - rate;
document.addEventListener('click', event => {
  if (Date.now() - lastClick >= rate) {
    count += event.clientX;
    console.log(count);
    lastClick = Date.now();
  }
});
```

使用RxJS：

```js
fromEvent(document, 'click').pipe(
    throttleTime(1000),
    map((ev: any) => ev.clientX),
    scan((count, clientX) => count + clientX, 0)
).subscribe(count => {
    console.log(`Count is ${count}`)
})
```

其它的值生运算符，pluck，pairwise，sample等。

## Observable

Observable是懒推送多个数据的方式。

1、Pull，单个数据使用Function，多个数据使用Iterator。

2、Push，单个数据使用Promise，多个数据使用Observable。

```js
const observable = new Observable(subscriber => {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);

    setTimeout(() => {
        subscriber.next(4);
        subscriber.complete();
    }, 1000);
})

console.log('Just before subscribe');

observable.subscribe({
    next(x) { console.log(`Get value ${x}`); },

    error(err) {
        console.log(`something wrong occurred: `, err)
    },
    complete() {
        console.log('done');
    }
});
```

### pull VS push

Pull和Push是两种不同的协议来描述数据生产者和数据消费者如何沟通。

什么是Pull？Pull是数据消费者决定什么时间来获取数据。JS方法的调用是Pull的方式来获取数据。ES2015引入了生成器函数和迭代器，另外一种pull的方式。调用iterator.next的代码是消费者。

1、Pull，数据生产者是被动的，在请求时才生产数据；数据消费者是主动的，决定何时调用数据。

2、Push，数据生产者按自己的节奏产生数据；数据消费者是被动的，准备接受数据。

什么是Push? 数据生产者决定何时发送数据到数据消费者。消费者不知道它什么时候收到数据。Promise是最常见的实现Push的方式。RxJS引进了Observable，一种新的Push的方式。一个Observable可以产生多个值，然后push这些值到Observers。

### Observables的概念

与主流说法不同，Observables既不像EventEmitters，也不像多个值的Promise。

```js
function foo() {
  console.log('Hello');
  return 42;
}

const x = foo.call(); // same as foo()
console.log(x);
const y = foo.call(); // same as foo()
console.log(y);
```

使用RxJS来写，会写成下面的代码。

```js
import { Observable } from 'rxjs';
 
const foo = new Observable(subscriber => {
  console.log('Hello');
  subscriber.next(42);
});
 
foo.subscribe(x => {
  console.log(x);
});
foo.subscribe(y => {
  console.log(y);
});
```

函数和Observables都是懒惰计算的。如果你不调用subscribe，它就不会计算。函数调用和Observable的订阅都是独立的操作。

EventEmitters会共享副作用，并且不管有没有订阅者，都会执行。

订阅Observable类似于调用函数。

Observables可以以同步或异步的方式来发送数据。

Observables和函数的最大区别是，Observables可以随着时间的推移发送多个数据。


### Observable的解剖

Observables可使用new Observable或生成器运算符来创建，被Observer订阅，使用next/error/complete来通知Observer。

Observables的核心概念：

1、创建Observables；2、订阅Observables；3、执行Observable；4、清理Observables的执行。

#### 创建Observable

Observable的构造函数接受一个参数，subscribe方法。

```js
import { Observable } from 'rxjs';

const observable = new Observable(function subscribe(subscriber) {
  const id = setInterval(() => {
    subscriber.next('hi')
  }, 1000);
});
```

通常，observables是被创建类方法创建的，eg：of，from，interval等。

#### 订阅Observable

observable.subscribe和observable的构造函数的参数名subscribe有相同的名字，并不是巧合。在库中，它们是不同的，但是你可以将它们认为在概念上相等。

每一次observable.subscribe的调用，构造函数中subscribe的参数方法会重新执行，来设置单独的执行环境。


```js
observable.subscribe(x => console.log(x));
```

这个addEventListener和removeEventListener有很大不同。

订阅动作可以开始Observable的执行，然后发送数据或事件到那次执行的Observer。



## 参考文档

1、https://rxjs.dev/guide/overview
