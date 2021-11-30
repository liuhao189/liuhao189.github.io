# RxJS学习笔记

rxjs是一个使用可观察序列来处理异步和基于事件的程序的一个类库。它提供一个核心的类型Observabele，辅助类型(Observer，Schedulers，Subjects)和运算符(map, filter, reduce, every等)。

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


## 参考文档

1、https://rxjs.dev/guide/overview
