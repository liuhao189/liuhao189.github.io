# Typescript-One

TS只是在JS的基础上添加了类型系统。优点是可以在构建时发现更多错误，可以使用JS不支持的高级功能。

## 类型推断

根据赋值的值来推断变量的类型。

```js
let helloWorld = "Hello World";
//let helloWorld:string
```

## 类型声明

你可以在JS中使用许多设计模式。一些设计模式使得类型推断很难，在这种情况下，TS支持JS语言的声明文件和直接声明，你可以在声明文件中提供TS的类型声明。

```ts
interface User {
    name: string;
    id: number;
}

const user: User = {
    name: "hayes",
    id: 0
}

class UserAccount {
    name: string;
    id: number;

    constructor(name:string, id:number) {
        this.name = name;
        this.id = id;
    }
}
// class的实例
const user:User = new UserAccount('Murpht', 1);
//注释函数参数类型和返回值
function getAdminUser():User {
    //...
}

function deleteUser(user:User): boolean {
    //...
}
```

TS有的类型：boolean，bigint，null，number，string，symbol，undefined，any(允许任何类型)，unknown(使用时需要转换类型)，never(不会发生的类型)，void(函数返回undefined)。

你可以使用Interface和Type来声明类型，应该首选interface，除非是声明类型别名。

## 复合类型

将简单的类型们合成一个复合类型。

### Unions-联合体

```ts
//联合体常用于字符串或数字
type WindowStates = "open" | "closed" | "minimized";
type LockStates = "locked" | "unlocked";
type PositiveOddNumberUnderTen = 1 | 3 | 5 | 7 | 9;
//联合体也可用于不同的类型
function getLength(obj: string | string[]) {
    return obj.length;
}
// 使用typeof来判断参数类型
function wrapInArray(obj: string | string[]): string[] {
    if(typeof obj === 'string') {
        return [obj];
    }
    return obj;
}
```

## 泛型

泛型主要提供了类型变量。

```ts
type StringArray = Array<string>;
type NumberArray = Array<number>;
type ObjectWithNameArray = Array<{name:string}>;
//
interface BackPack<T> {
    add: (obj:T) => void;
    get: () => T
}
// 告诉TS，有一个backpack的变量，不用关心该变量来自何处
declare const backpack: Backpack<string>;
backpack.add('Hello');
```

## 结构类型

TS的核心原则聚焦于值拥有的类型，这在某些时候叫鸭式类型或结构类型。

结构类型中，如果两个对象拥有相同的属性，它们会被认为有相同的类型。

```ts
interface Point {
    x: number;
    y: number;
}

function logPoint(p:Point) {
    console.log(`${p.x},${p.y}`);
}

const point = { x: 12, y: 36 };
//TS对比了point的属性。
logPoint(point);
//结构类型匹配值匹配对象的属性子集
const point3 = {x: 12 ,y: 26, z: 89 };
logPoint(point3);
//class的匹配
class VirtualPoint {
    x: number;
    y: number;
    
    constructor(x:number,y:number) {
        this.x = x;
        this.y = y;
    }
}

const newVPoint = new VirtualPoint(13,56);
logPoint(newVPoint)
```

## 基础

### 静态类型检查

TypeError相关的错误在JS的语言中比较常见。静态类型检查描述的是值的类型和表现，TS等静态类型系统告诉我们有哪些值的类型和表现不符合预期。

```ts
const message = 'hello!';
message();
// Error - Type 'String' has no call signatures.
```

### 非运行异常错误

TS报告的异常情况是根据ECMAScript规范的定义来的。eg：调用未定义的属性返回undefined，调用不可调用的属性直接返回错误。

因为添加了类型系统，即使在某些情况下，代码是合格的JS代码，不会产生错误，TS也会提示错误，目的是捕获更多合法的错误。

```ts
const user = {
    name: "Daniel",
    age: 26
}

user.location;
// Error,不存在location属性
// typos
const announcement = "Hello World!";
// How quickly can you spot the typos?
announcement.toLocaleLowercase();
announcement.toLocalLowerCase();
// We probably meant to write this...
announcement.toLocaleLowerCase();
// 未调用方法
function flipCoin() {
  // Meant to be Math.random()
  return Math.random < 0.5;
Operator '<' cannot be applied to types '() => number' and 'number'.
}
//逻辑错误
const value = Math.random() < 0.5 ? "a" : "b";
if (value !== "a") {
  // ...
} else if (value === "b") {
This condition will always return 'false' since the types '"a"' and '"b"' have no overlap.
  // Oops, unreachable
}
```

### 类型工具

根据类型信息，可以做智能提示，可以提供自动快速修复功能，重构代码，跳转到定义和实现等功能，发现所有引用。

### tsc-Typescript的编译器

```bash
npm i typescript -g
# 将tsc命令安装到全局，npx之类的工具可以运行本地安装的tsc命令
```

### 错误时也输出内容

TSC报告的错误只是基于它内置的数据，大多数时候，你比TSC更加了解情况。

某些情况下你需要即使有错误也编译输出的情况，比如将JS库转为TS的过程中。

你可以指定noEmitOnError选项来避免输出。

```bash
tsc --noEmitOnError hello.ts
```







