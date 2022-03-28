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

TS有的类型：boolean，bigint，null，number，string，symbol，undefined，any(允许任何类型)，unknown(使用时需要提前声明)，never(不会发生的类型)，void(函数返回undefined)。

你可以使用Interface和Type来声明类型，你应该首选interface。

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

TS的核心原则聚焦于值拥有的类型。这在某些时候叫鸭式类型或结构类型。

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





