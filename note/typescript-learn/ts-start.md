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

TypeError相关的错误在JS语言中比较常见。静态类型检查描述的是值的属性和方法，TS等静态类型系统告诉我们有哪些值的属性获取和方法调用不符合预期。

```ts
const message = 'hello!';
message();
// Error - Type 'String' has no call signatures.
```

### 非运行时-异常错误

TS报告的异常情况是根据ECMAScript规范+类型系统的要求来定义来的。eg：ECMAScript规范：调用未定义的属性返回undefined，调用不可调用的属性直接返回错误。

因为添加了类型系统，即使在某些情况下，代码是合格的JS代码，不会产生运行时错误，TS也会提示错误，目的是捕获更多的可能的错误。

```ts
const user = {
    name: "Daniel",
    age: 26
}

user.location;
// Error,ts会报不存在location属性。
// typos，拼写错误
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

### 使用类型信息的工具

根据代码的类型信息，IDE类的工具可以做智能提示，可以提供自动快速修复功能，重构代码、跳转到定义和实现、发现所有引用等功能。

### tsc-Typescript的编译器

```bash
npm i typescript -g
# 将tsc命令安装到全局，npx之类的工具可以运行本地安装的tsc命令
```

### 错误时也输出内容

TSC报告的错误只是基于它内置的数据，大多数时候，你比TSC更加了解现实情况。

某些情况下你需要即使有错误也要输出编译内容的情况，比如将JS库转为TS的过程中。

你可以指定noEmitOnError选项来避免输出。

```bash
tsc --noEmitOnError hello.ts
```

### 明确的类型

主要是在类型推断失效的情况下，添加显式地类型声明。

### 擦除类型

由于ECMAScript的规范没有定义类型声明，tsc编译后的js文件会抹去大部分类型信息。

### 向下兼容

主要是模板字符串转为字符串相加。因为模板字符串是较新的版本才有的功能。

我们可以使用target选项来让tsc编译为较新的版本的ES版本。

```bash
tsc --target es2015 hello.ts
# 会生成模板字符串的版本
```

### 严格性

不同的用户是为了不同的目的来使用TS的类型系统。一些用户选择更加宽松的检查，另外一些用户想尽可能地使用TS的类型。

推荐新的代码尽量使用严格的TS类型功能。tsc包含了一系列类型检查的选项。

strict:true会开启所有选项。两个主要选项是：noImplicitAny和strictNullChecks。

### noImplicitAny

表示TS不会尝试类型推断，只是把这些类型设置为any。

noImplicitAny:true意味着变量的类型隐式推断为any会报错。

### strictNullChecks

默认情况下，null和undefined可以赋值给任何类型，这可以让代码书写更方便。但是忘记处理null和undefined是很多bug的原因。

strictNullChecks:true意味着不可以赋值给其它类型。

## 常见类型

### 基础类型

string，number，boolean，这些和JS的typeof操作符返回的类型相同。

大写字母开头：String，Number和Boolean也是允许的。但是尽量不要那么做。

### Arrays

可以使用string[]或Array<string>，两者是等价的。

### any

当一个类型声明为any，你可以访问它的任意属性。在你不想写出长类型来适应TS时笔记有用。

你没有声明类型，且TS无法根据上下文来推断类型，编译器会默认变量为any类型。使用noImplicitAny可以取消这种情况。

### 变量上的类型声明

使用const，var，或let声明变量时，可以添加类型声明。推荐尽量使用TS推断的类型。

### 函数

TS允许你来指出函数的输入和输出类型。

和变量类型推断一样，你可以不显式定义函数的返回值类型，TS会自动推断。但是某些情况下，提供一个显式的类型还是有很多好处的。

eg：文档原因，避免意外的变更，个人喜好。
