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

Observable是惰性推送多个数据的方式。

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

Pull和Push是两种不同的方式来描述数据生产者和数据消费者如何沟通。

什么是Pull？Pull是数据消费者决定什么时间来获取数据。JS方法的调用是Pull的方式来获取数据。ES2015引入了生成器函数和迭代器，另外一种pull的方式。调用iterator.next的代码是消费者。

1、Pull，数据生产者是被动的，在请求时才生产数据；数据消费者是主动的，决定何时调用数据。

2、Push，数据生产者按自己的节奏产生数据；数据消费者是被动的，随时准备接收数据。

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

EventEmitters会共享副作用，并且不管有没有订阅者，都会执行。订阅Observable类似于调用函数。Observables可以以同步或异步的方式来发送数据。

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

#### 运行Observables

new Observable(function subscribe(subscriber){...})里面的代码代表Observable的执行。

每一个订阅的观察者都会触发一次执行，没有观察者订阅则不执行。代码的执行可以随着时间的流逝以异步或同步的方式产生多个值。

执行中可以发送三种类型的值：

1、Next，发送Number，String，Object等。

2、Error，发送Error对象。

3、Complete，不发送任何值。

如果已经发送过Error或Complete通知，其它的任何东西都不会再发送。

```js
import { Observable } from 'rxjs';

const observable = new Observable(function subscribe(subscriber) {
  try {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    subscriber.complete();
  } catch (err) {
    subscriber.error(err); // delivers an error if it caught one
  }
});
```

#### 清理资源

因为Observavle的数据可能会有无限次，某些情况下，可能在接收到足够的数据后就需要终止Observable的执行。我们需要一个API来取消执行。

subscribe的方法会返回一个Subscription对象。

```js
const subscription = observable.subscribe(x => console.log(x));
```

你可以使用subscription.unsubscribe来取消进行的执行。

每一个Observable需要定义怎么清理那次执行的资源。你可以通过subscribe参数的返回值来指定一个自定义的unsubscribe方法。

```js
const observable = new Observable(function subscribe(subscriber) {
  // Keep track of the interval resource
  const intervalId = setInterval(() => {
    subscriber.next('hi');
  }, 1000);

  // Provide a way of canceling and disposing the interval resource
  return function unsubscribe() {
    clearInterval(intervalId);
  };
});
```

## Observer

一个Observer是一个Observable发送数据的消费者。Observer只是一些回调函数集合(next，error，complete)。

```js
const observer = {
  next: x => console.log('Observer got a next value: ' + x),
  error: err => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};

observable.subscribe(observer);
```

也可以只提供部分回调，如果只提供了部分回调，Observable的执行是正常的，只是一些类型的通知会被忽略。

```js
const observer = {
  next: x => console.log('Observer got a next value: ' + x),
  error: err => console.error('Observer got an error: ' + err),
};
```

调subscribe函数时，如果你只提供一个函数参数，subscribe会创建一个Observer对象，并将参数提供的函数作为新创建的Observer对象的next属性。

```js
observable.subscribe(x => console.log('Observer got a next value: ' + x));
```

## RxJS Operators

尽管Observable是基础，但是RxJS的操作符是最重要的。操作符是以声明方式轻松组合复杂异步代码的关键部分。

### 什么是操作符

操作符是方法。有两种类型的操作符：

####  Pipeable运算符

pipeable运算符是可以用observableInstance.pipe(operator())的方式调用的运算符。eg：filter，mergeMap等。

当调用时，它们不改变已经存在的Observable实例，而是返回一个订阅逻辑基于已存在的Observable的实例的新的Observable。

一个Pipeable运算符是一个纯函数，输入参数为一个Observable实例，返回另一个Observable。订阅输出的Observable也会订阅输入的Observable。

总结：只是一个转换，根据旧的Observable来生成新的Observeable。

#### 创建类运算符

可以独立调用来创建新的Observable实例的函数。eg：of(1，2，3)。

```js
import { of } from 'rxjs';
import { map,first } from 'rxjs/operators';

of(1, 2, 3)
  .pipe(map((x) => x * x), first())
  .subscribe((v) => console.log(`value: ${v}`));
// map返回新的Observable  
```

总结：根据一些常见的数据结构或场景来创建Observable。

### Piping

Pipeable运算符是函数，因此它们可能会嵌套使用。eg：op1(op2(op3(op4())))，会变得不容易阅读和理解。

为了解决这个问题，Observable有一个pipe方法来完成相同的事情，但是更容易阅读和理解。

```js
obs.pipe(op1(),op2(),op3(),op4());
//从左到右的顺序去执行。
```

总结：pipe方法只是方便理解和调用，按从左到右的顺序去调用。

### 创建运算符

创建运算符是一些用来创建Observable的函数。Observable有一些常见的逻辑，或和其它Observable联合。

```js
import { interval } from 'rxjs';

const observable = interval(1000 /* number of milliseconds */);
```

### 高阶Observables

Observable发送数据的常见类型为numbers或string，但也有一些情况需要返回Observable对象。

```js
const fileObservable = urlObservable.pipe(map((url) => http.get(url)));
```

conctaAll可以把Observable数组转换为普通的Observable。

```js
const fileObservable = urlObservable.pipe(
  map((url) => http.get(url)),
  concatAll()
);
```

concatAll运算符可以订阅所有的Observable，然后拷贝所有Observable发送的值直到Observable完成。

其它的可以打平Observable的运算符有：

1、mergeAll，订阅所有的Observable，当任何一个订阅的Observable发送值的时候，将值发送出去。

2、switchAll，订阅第一个Observable，当数据到来时，把数据发送出去。但是当下一个Observerable到来时，取消第一个Observerable的订阅。依次类推。

3、exhaust，订阅第一个Observable，当数据到来时，将数据发送出去。直到第一个Observable完成时，忽略掉所有新进的Observable。第一个Observable完成后，再订阅后面的Observable。

flat和map结合的运算符：1、flatMap；2、concatMap；3、mergeMap；4、switchMap；5、exhaustMap。


### 图解

要解释运算符如何工作，文字描述有时候不太好解释。好多运算符和时间有关，它们可能是实例延迟，取样，节流或防抖。


### 运算符种类

有多种用途的操作符，可以被分类为：创建，转换，过滤，joining，多播，错误处理，工具类等。

#### 创建类

1、ajax，创建一个http请求。

2、bindCallback，将callback转换为Observable。

3、bindNodeCallback，将node类的callback方法转换为Observable。

4、defer。懒创建Observable，只有订阅时才创建。

5、empty，创建一个不发送任何数据，并且立刻发送complete通知的Observable。已经弃用，使用of()即可。


```js
//新版本中empty已弃用，只要用of即可。
of().pipe(startWith(7)).subscribe((x) => { console.log(x) });
```

6、from，从数组，类数组，Promise实例，迭代器对象，或类Observable的对象创建。

```js
from([1, 2, 3]).pipe(map(x => { return x * x })).subscribe(x => { console.log(x) });
```

7、fromEvent，监听给定的target上的指定的event类型，然后发送这个事件。可以支持DOM，NodeJS EventEmitter，JQuery-like event，NodeJS List 或HTMLCollection。

```js
fromEvent(document, 'click')
```

8、fromEventPattern，参数为addHandler，和removeHandler。

9、generate，需要传入迭代器方法，输出判断方法，初始状态等数据。

```js
//参数数量过多，不如使用options方便。
generate<number>({
    initialState: 0,
    condition: x => x < 3,
    iterate: x => x + 1,
}).subscribe(x => {
    console.log(x);
})
```

10、interval，每隔多少毫秒发出一个数据。

11、of，依次发送参数列表的数据。

```js
of(1,2,3)
```

12、range，(start,count?,scheduler)，主要是生成数字。

```js
range(1, 10).subscribe(x => {
    console.log(x)
});
```

13、throwError，返回一个直接创建错误的Observable的实例。

```js
throwError(() => {
    return new Error(`This is error!`)
}).subscribe({
    error: (err) => {
        console.error(err);
    }
})
```

14、timer，创建一个等待一段时间然后complete的Observable。

```js
timer(1000)
```

15、iif，在订阅时检查一个boolean值，然后再两个Observable中选择。

```js
let isFirst = true;

iif(() => { return isFirst }, of(1), of(2)).subscribe(x => {
    console.log(x);
});
```

#### 合并创建类

主要是合并多个来源的的Observeable发送的数据。

1、combineLatest，合并多个Observable的数据。

```js
const firstTimer = timer(0, 1000);
const secondTimer = timer(500, 1000);

const subscription = combineLatest([firstTimer, secondTimer]).subscribe(val => {
    console.log(val)
})
```

发送数据时机：当任何一个Observable发送一个数据时，它就会取监听的所有Observable的最新值组成一个数组来发送数据。

2、concat，监听第一个Observable，第一个Observable完成后，向下一个移动。

```js
const timerOne = interval(1000).pipe(take(4));
const seqOne = range(0, 10);
const result = concat(timerOne, seqOne);
result.subscribe(x => {
    console.log(x);
});
// 0 -1000ms-> 1 -1000ms-> 2 -1000ms-> 3 -immediate-> 1 ... 10
```

总结：合并多个Observable的输出。

3、frokJoin，接受一个数组或对象，返回一个Observable，发送的值格式是数组或对象，内容是参数Observable发送的数据。

等待所有的Observable完成，然后混合Observable发送的最后的值。如果参数是空数组，则立刻完成。

```js
forkJoin({
    foo: of(1, 2, 3, 4),
    bar: Promise.resolve(8),
    baz: timer(4000)
}).subscribe({
    next(x) {
        console.log(x)
    },
    complete() {
        console.log(`Complete now!`)
    }
});
// after 4 seconds:
// {foo: 4, bar: 8, baz: 0}
// Complete now!
```

4、merge，创建一个Observable，发送所有输入的Observable发出的所有值。

```js
const clicks = fromEvent(document, 'click');
const timer = interval(1000);
const clicksOrTimer = merge(clicks, timer);
clicksOrTimer.subscribe(x => console.log(x));
```

5、partition，把输入的Observable分为两个，一个发送符合条件的值的Observable，一个发送不符合条件的值Observable。

```js
const [evens$, odds$] = partition(of(1, 2, 3, 4, 5, 6), val => val % 2 === 0)

evens$.subscribe(x => {
    console.log(`evens: ${x}`);
});

odds$.subscribe(x => {
    console.log(`odds: ${x}`)
})
```

6、race，创建一个新的Observable来反映第一个发送数据的Observable。

```js
race(interval(1000).pipe(mapTo('fast one')), interval(2000).pipe(mapTo('medium one')), interval(3000).pipe(mapTo('slow one'))).subscribe(winner => {
    console.log(winner)
})
```

7、zip，多个Observable的值打包到一起。

```js
zip(of(27, 25), of('Foo', 'Bar', 'Beer'), of(true, true, false)).subscribe(x => {
    console.log(x);
})
```

#### 转变类运算符

1、buffer，缓存输入的Observable的值，直到输入的Observable关闭或另一个Observable发送数据。

```js
import { fromEvent, interval } from 'rxjs';
import { buffer } from 'rxjs/operators';

const clicks = fromEvent(document, 'click');
const intervalEvents = interval(1000);
const buffered = intervalEvents.pipe(buffer(clicks));
buffered.subscribe(x => console.log(x));
//只在click时，才发送interval的值。[0,1,2,3,4,5,6,...]
```

2、bufferCount，缓存输入的Observable的值，直到缓存大小达到bufferSize。

```js
import { fromEvent } from 'rxjs';
import { bufferCount } from 'rxjs/operators';

const clicks = fromEvent(document, 'click');
const buffered = clicks.pipe(bufferCount(2));
buffered.subscribe(x => console.log(x));
```

3、bufferTime，缓存输入的Observable的值，直到达到缓存时间。

```js
import { fromEvent } from 'rxjs';
import { bufferTime } from 'rxjs/operators';

const clicks = fromEvent(document, 'click');
const buffered = clicks.pipe(bufferTime(1000));
buffered.subscribe(x => console.log(x));
```

4、bufferToggle，输入参数两个Observable，一个open，一个close。缓存时间从open的Observable发送数据直到close的Observable发送数据为止。

```js
import { fromEvent, interval, EMPTY } from 'rxjs';
import { bufferToggle } from 'rxjs/operators';

const clicks = fromEvent(document, 'click');
const openings = interval(1000);
const buffered = clicks.pipe(bufferToggle(openings, i =>
  i % 2 ? interval(500) : EMPTY
));
buffered.subscribe(x => console.log(x));
```

5、bufferWhen，缓存输入的Observable的值，直到Close的Observable发送数据为止。

```js
import { fromEvent, interval } from 'rxjs';
import { bufferWhen } from 'rxjs/operators';

const clicks = fromEvent(document, 'click');
const buffered = clicks.pipe(bufferWhen(() =>
  interval(1000 + Math.random() * 4000)
));
buffered.subscribe(x => console.log(x));
```


## 参考文档

1、https://rxjs.dev/guide/overview
