# Typescript-Two

## 缩小类型范围

TS使用静态类型分析运行时值，它在JS的运行时控制流(if/else，条件三元，循环，真实性检查)上覆盖类型分析，这些都会影响类型。

在代码的if检测中，TS看到typeof padding === 'number'，TS会将这些代码认为类型守护。

```ts
function padLeft(padding:number|string,input:string){
  if(typeof padding === 'numbr') {
    // number now
    return ' '.repeat(padding) + input;
  } 
  // string now
  return padding + input;
}
```

## typeof类型守护

JS支持typeof运算符来返回值的基本类型。

TS期望返回的数值集合：string，number，bigint，boolean，symbol，undefined，object，function。


## 真值缩小范围

在JS中，if会强制转换条件为boolean。

false值：0，NaN，""，0n，null，undefined。

可以使用Boolean函数或!!来强制转换。

```ts
function printAll(strs: string | string[] | null) {
  if(strs && typeof strs === 'object') {
    //string[]
  }else if (typeof strs === 'string') {
    //string
  }
}
//也可以使用!来过滤false值
function multiplyAll(values: number[] | undefined, factor: number) {
    if (!values) {
        return values;
    } else {
        return values.map(x => x * factor)
    }
}
```

## 相等缩小类型范围

TS也使用switch，===，!==和!=来缩小类型。

```ts
function example(x: string | number, y: string | boolean) {
    if (x === y) {
        // x and y should be string
        x.toLocaleLowerCase();
        y.toLocaleLowerCase();
    } else {
        // x string | number;
        // y string | boolean;
        console.log(x);
    }
}
```

JS的==和!=也可以类型范围。一个变量==null，null和undefined都会返回true，一个变量!=null，只要不是null和undefined都可以。

```ts
interface Container {
    value: number | null | undefined;
}
//
function multiplyValue(container: Container, factor: number) {
    if (container.value != null) {
        // container.value should be number
        console.log(container.value * factor);
    }
}
```

## in缩小类型范围

```ts
interface Fish { swim: () => void };
interface Bird { fly: () => void };

function move(animal: Fish | Bird) {
    if ('swim' in animal) {
        // animal should be Fish
        return animal.swim();
    }
    // animal should be Bird
    animal.fly();
}
```

## instanceof缩小类型范围

x instanceof Foo检查x的原型链中是否包含Foo.prototype。

```ts
function logValue(val: Date | string) {
    if (val instanceof Date) {
        // val should be Date
        console.log(val.toUTCString());
    } else {
        // val should be string
        console.log(val.toUpperCase())
    }
}
```

## 赋值缩小类型范围

主要根据右侧的值类型来缩小左边的类型范围。

```ts
//由于声明类型为string|number，所以后续的赋值是没问题的。
let x = Math.random() < 0.5 ? 10 : "Hello World!";

x = 1;
// after x should be number;

x = "goodbye";
// after x should be string
```

## 控制流分析

这种基于代码可访问性的代码分析称为控制流分析，TS在遇到类型保护和赋值时使用此控制流分析来缩小类型范围。当分析一个变量时，根据控制流可以观察到该变量在每个点上具有不同的类型。

## 自定义类型守护

有时我们想直接在我们的代码中控制类型。实现用户定义的类型守护，需要在函数的返回类型中添加类型断言信息。

```ts
function isFish(pet: Fish | Bird): pet is Fish {
    return (pet as Fish).swim !== undefined;
}

function move2(animal: Fish | Bird) {
    if (isFish(animal)) {
        // animal should be Fish
        return animal.swim();
    }
    // animal should be Bird
    animal.fly();
}
```

## 复杂类型联合体

```ts
interface Shape {
    kind: "circle" | "square";
    radius?: number;
    sideLength?: number;
}
// 下面的Shape定义会好于上面的Shape定义，因为提供了更多的信息
interface Circle {
    kind: 'circle';
    radius: number;
}

interface Square {
    kind: 'square';
    sideLength: number;
}

type Shape = Circle | Square;

function caclArea(shape: Shape): number {
    if (shape.kind === 'circle') {
        // shape should be Circle
        return (shape.radius ** 2) * Math.PI
    } else {
       // shape shold be Square
        return shape.sideLength ** 2;
    }
}
```

当联合体中的每个类型都包含具有文本类型的公共属性时，TS会将其视为区分的联合，可以缩小类型范围。


## never类型

当缩窄类型时，你可能移除所有可能得类型，在这些场景中，TS会使用never类型来表示不存在的状态。

## 穷举检查

never类型可以分配给每个类型，但是，没有类型可以分配给never。

```ts
type Shape = Circle | Square;
function getArea(shape: Shape) {
    switch(shape.kink) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.sideLength ** 2;
        default: 
            const _exhaustiveCheck:never = shape;
            return _exhaustiveCheck;
    }
}
```

# 函数

## 函数类型表达式

```js
function greeter(fn:(a:string)=>void) {
    fn("Hello World")
}
```

(a:string)=>void表示函数接收一个参数，没有返回值。如果参数类型没有指定，参数会隐式设为any类型。

当然也可以使用type别名来定义。

```js
type GreetFunction = (a: string) => void;
function greeter(fn: GreetFunction) {
    fn("Hello World");
}
```

## 带属性函数签名

在JS中，函数也可以拥有属性。但是，函数类型表达式语法不允许声明属性。如果你想描述有属性的函数，你可以写一个调用签名对象。

```js
type DescribableFunction = {
    desc: string;
    (a: number): boolean;
}

function doSomeThing(fn: DescribableFunction) {
    return `${fn.desc} + ${fn(6)}`
}
```

## 构造函数签名

在函数签名使用new关键字即可。

```ts
type SomeConstructor = {
    new(s: string): SomeConstructor;
}

function fn(ctor: SomeConstructor) {
    return new ctor('Hello')
}
```

## 泛型函数

考虑一个方法，返回数组的第一个元素。

```ts
function firstElement(arr: any[]) {
    return arr[0];
}
```

上面的代码会丢失类型信息。返回的类型和参数类型相关，这种时候需要使用泛型。

```ts
function firstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}

const str = firstElement(['one']);
const num = firstElement([6]);
```

给函数添加一个类型参数，可以在多个地方使用该类型参数。我们可以在函数输入和输出之间构建联系。

多个类型参数

```ts
function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
    return arr.map(func);
}

const parsed = map([1, 2, 3], n => n * 2);
```

## 类型约束





## 参考文档

https://www.typescriptlang.org/docs/handbook/2/narrowing.html