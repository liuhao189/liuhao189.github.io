# RxJS学习笔记-2

## Filter运算符

### audit

在另一个Observable确定的持续时间内忽略源Observable发送的值，然后发送最近的数据。

```js
fromEvent(document, 'click').pipe(
    audit(ev => interval(1000)))
    .subscribe(x => {
        console.log(x);
    })
```

### auditTime

在指定的时间内忽略源Observable发送的值，然后发送源Observable最近的值。

```js
fromEvent(document, 'click').pipe(
    auditTime(1000))
    .subscribe(x => {
        console.log(x);
    })
```

### debounce

和debounceTime很像，但是发送数据的沉默时间由另一个Observable决定。

```js
fromEvent(document, 'click').pipe(
    scan(i => ++i, 1),
    debounce(i => interval(200 * i)))
    .subscribe(x => {
        console.log(x);
    })
```

### debounceTime

根据特定的时间来做防抖。

```js
fromEvent(document, 'click').pipe(
    scan(i => ++i, 1),
    debounceTime(1000))
    .subscribe(x => {
        console.log(x);
    })
```

### distinct

对源Observable发送的值做去重。

```js
from([1, 1, 2, 2, 1, 2, 3, 4, 5, 5, 6, 6]).pipe(
    distinct()
).subscribe(x => {
    console.log(x);
})
```

### elementAt

只发送特定的Index的数据。

```js
from([1, 2, 3]).pipe(elementAt(2)).subscribe(x => {
    console.log(x);
});
```