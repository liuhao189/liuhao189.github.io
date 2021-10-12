# JS中的数组在内存中的存储机制

JS中数组和其它编程语言的数组有一个显著区别，JS数组中可以存放不同的数据结构的对象，且数组长度可随时改变。

数组本应该是一个连续的内存分配，但是在JS中是不连续分配的，而是类似哈希映射的方式存取的。

现代浏览器为了优化其操作，对数组创建的时候内存分配进行了优化。

1、对于同构数组，也就是数组中元素类型一直，会创建连续的内存分配。

2、对于不同构数组，按照原来的方式创建。

3、如果插入了一个异构数据，那么就会重新解构，通过哈希映射的方式创建。

为了进一步优化功能的实现，JS中出现了ArrayBuffer，它可以创建连续的内存供编程人员使用。

## 数组Set值对比

```js
var LIMIT = 10000000;
var arr = new Array(LIMIT);
arr.push({
    a: 22
});
console.time("Array insertion time");
for (var i = 0; i < LIMIT; i++) {
    arr[i] = i;
}
console.timeEnd("Array insertion time");
//非同构数组，Array insertion time: 1.723s
```

```js
var LIMIT = 10000000;
var arr = new Array(LIMIT);
console.time("Array insertion time");
for (var i = 0; i < LIMIT; i++) {
    arr[i] = i;
}
console.timeEnd("Array insertion time");
//同构数组，Array insertion time: 13.094ms
```

以上代码执行环节为node v16.10.0，可以看到两者时间差了131倍。

## 数组读取值对比

```js
var LIMIT = 10000000;
var arr = new Array(LIMIT);
arr.push({
    a: 22
});
for (var i = 0; i < LIMIT; i++) {
    arr[i] = i;
}
var p;
console.time("Array read time");
for (var i = 0; i < LIMIT; i++) {
    //arr[i] = i;
    p = arr[i];
}
console.timeEnd("Array read time");
// 非同构数组，Array read time: 12.038ms
```

```js
var LIMIT = 10000000;
var arr = new Array(LIMIT);
for (var i = 0; i < LIMIT; i++) {
    arr[i] = i;
}
var p;
console.time("Array read time");
for (var i = 0; i < LIMIT; i++) {
    p = arr[i];
}
console.timeEnd("Array read time");
//同构数组，Array read time: 10.829ms
```

读取时间在同一个数量级，同构数组比非同构数组效率高16.6%左右。

## Array构造函数传递或不传递数组长度对比

```js
var LIMIT = 10000000;
var arr = new Array();
console.time("Array insert time");
for (var i = 0; i < LIMIT; i++) {
    arr[i] = i;
}
console.timeEnd("Array insert time");
//不传递数组长度，Array insert time: 229.001ms
```

```js
var LIMIT = 10000000;
var arr = new Array(LIMIT);
console.time("Array insert time");
for (var i = 0; i < LIMIT; i++) {
    arr[i] = i;
}
console.timeEnd("Array insert time");
//传递数组长度，Array insert time: 13.62ms
```

```js
var LIMIT = 10000000;
var arr = new Array(LIMIT);
console.time("Array insert time");
for (var i = 0; i < LIMIT; i++) {
    arr[i] = i;
}
arr.push(-1);
console.timeEnd("Array insert time");
//传递数组长度并改变了数组长度，Array insert time: 99.062ms
```

可以看到传递数组长度可以提高17倍的set性能。

如果设置长度后，后续在数组中又添加了新的元素，性能会降低7倍多。这个主要是因为数组扩容导致的。

## V8源码中的数组

从源码的注释中可以看出，JS数组有两种表现形式，fast和slow。

fast是快速的后备存储结构FixedArray，并且数组长度<=elements.length。

slow是缓慢的后备存储结构是一个以数字为键的HashTable。

### 快数组

快数组是一种线性的存储方式，新创建的空数组，默认的存储方式是快数组。快数组根据元素的增加和删除来动态调整存储空间大小，内部是通过扩容和收缩机制实现。

看源码得知new_capacity = old_capacity /2 + old_capacity + 16，也就是扩容后的新容量为旧容量的1.5倍+16，扩容后会将数组拷贝到新的内存空间中。

缩编，如果容量>=length的2倍+16，则进行收缩容量调整，否则用holes对象填充未被初始化的位置。

```c
int elements_to_trim = length + 1 == old_length ? (capacity - length)/2 : capacity-length
```
根据length+1是否等于old_length来判断将空出的空间全部收缩掉还是只收缩二分之一。

holes空洞对象指的是数组中分配了空间，但是没有存放元素的位置。

新建数组时，如果没有设置容量，V8会默认使用Fast Elements模式实现。

如果对数组设置了容量，但并没有进行内部元素的初始化，就会以Fast Holey Elements模式实现。

### 慢数组

慢数组是一种字典的内存形式，不用开辟大块连续的存储空间，节省了内存，但是维护HashTable，其效率会比数组慢。

### 快慢数组的区别

快数组：存储空间是连续的，需要开辟一大块内存使用，其中还有很多空洞，比较浪费内存；但是操作效率比较高

慢数组：内存是零散分配的，比较节省内存空间，缺点是遍历效率会差一些，特别是插入新元素。

### 快慢数组之间的转换

快转慢：

1、新容量 >= 3* 扩容后的容量 * 2，会转为慢数组。

2、当加入的index - capacity > 1024时，会转变为慢数组。eg：数组赋值时使用了远超当前数组的容量+1024时，为了空间的优化，会转换为慢数组。

```js
let a = [1, 2]
a[1030] = 1;
```

慢转快：

1、当慢数组的元素可存放在快数组中且长度小于2^31-1且仅可节省50%的空间，则会转变为快数组。

```js
let a = [1,2];
a[1030] = 1;
for (let i = 200; i < 1030; i++) {
    a[i] = i;
}
```

## 总结

总的来说，JS 的数组看似与传统数组不一样，其实只是 V8 在底层实现上做了一层封装，使用两种数据结构实现数组，通过时间和空间纬度的取舍，优化数组的性能。了解数组的底层实现，可以帮助我们写出执行效率更高的代码。


## 参考文档

https://www.voidcanvas.com/javascript-array-evolution-performance/

https://zhuanlan.zhihu.com/p/96959371
