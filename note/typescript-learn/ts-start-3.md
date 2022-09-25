# 对象类型

对象是TS中组织和传递数据的基础。

```ts
// 匿名对象类型
function greet(person: { name: string, age: number }) {
    return "Hello " + person.name;
}
// 接口类型
interface Person {
    name: string;
    age: number;
}

function greet2(person: Person) {
    return "Hello " + person.name;
}
// type类型
type TPerson = {
    name: string;
    age: number;
}

function greet3(person: TPerson) {
    return "Hello " + person.name;
}
```

## 对象属性描述

对象的任一属性都可以指定一系列值：类型，属性是否是可选的，该属性是否可写。

### 可选属性

在属性名后添加?即可指定该属性是可选的。

```ts
interface PaintOptions {
    xPos?: number;
    yPos?: number;
}

function paintShape(opts: PaintOptions) {

}

paintShape({});
paintShape({ xPos: 1 })
```

可选属性作用：如果设置了该属性，最好有一个指定的类型。

TS还支持可选属性的默认值。下面代码可以指定不传该属性的默认值。

```ts
function paintShape({ xPos = 0, yPos = 0 }: PaintOptions) {

}
```

### readonly属性

属性可以标记为readonly，运行时不会有任何改变，只在TS类型检查时报错。

```ts
interface SomeType {
    readonly prop: string;
}

function doSomeThing(obj: SomeType) {
    console.log(`prop has the value ${obj.prop}`);

    obj.prop = 'hello';
    // Error obj.prop is read-only property
}
```

readonly并不是表示该属性的值不可变更，只是该属性值不能重新赋值。例如：对象内的属性可以修改。

```ts
interface Home {
    readonly resident: { name: string, age: number }
}

function visitForBrithday(home: Home) {
    home.resident.age++;
    //OK
    home.resident = {
        name: "New Name",
        age: 22,
    }
    // Error
}
```

在检查两种类型是否兼容时，TS不会考虑这两种类型是否为只读属性，因此，只读属性也可以通过别名进行更改。

```ts
interface Person {
    name: string;
    age: number;
}

interface ReadonlyPerson {
    readonly name: string;
    readonly age: number;
}

let writablePerson: Person = {
    name: "Person name",
    age: 42
}

let readonlyPerson: ReadonlyPerson = writablePerson;
writablePerson.age++;
console.log(readonlyPerson.age);
```

### 属性签名

某些时刻你不能提前知道属性的名称，但是你知道属性的类型。在这种情况下，可以使用属性签名。

```ts
interface StringArray {
    [index: number]: string;
}

const myArray: StringArray = {};
myArray[1] = 'hello'
//Error should be string
const item = myArray[0];
// item is string
```

注意：由于number的类型也会存储为字符串，所以如果[index:number]和[index:string]共存，则[index:number]的类型需要是[index:string]的子类（概念上）。

属性签名是描述字典结构的好方式。它也强制其它属性的类型。

```ts
interface NumberDictionary {
    [index: string]: number;
    length: number;
    name: string;// Error name should be number
}
// 如果属性签名是联合类型，就是OK的
interface NumberDictionary {
    [index: string]: number | string;
    length: number;
    name: string;
}
// 也可以指定为readonly
interface ReadonlyStringArray {
    readonly [index: number]: string;
}

let myAry: ReadonlyStringArray = {};

myAry[2] = 'Hello';
//Error ReadonlyStringArray should not reassign
```

## 类型扩展

通常比较好的办法是创造一个基础类型，然后从该基础类型继承，形成一个继承层次。例如：BasicAddress描述基础的地址。

```ts
interface BasicAddress {
    name?: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
}
```

某些情况下，地址有一个unit number。

```ts
interface AddressWithUnit {
    name?: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
    unit: string;
}
```

上述代码的缺点是，我们必须重复BasicAddress中的定义。这种情况下，extend基础接口即可。

```ts
interface AddressWithUnit extends BasicAddress {
    unit: string;
}
```

接口也可以多重继承。

```ts
interface Colorful {
    color: string;
}

interface Circle {
    radius: number;
}

interface ColorfulCircle extends Colorful, Circle {}
```

## 类型联合

接口允许我们扩展其它接口类型来生成新类型。&符号表示联合类型。

```ts

interface Colorful {
    color: string;
}

interface Circle {
    radius: number;
    color: number;
}

type ColorfulCircle = Colorful & Circle;

const a: ColorfulCircle = { color: 'red', radius: 10 }
```

## 接口 VS 联合

两者实现的功能的类似，优先interface。

## 泛型对象类型

想象一个可以装任意类型的盒子。

```ts
interface Box {
    contents: any;
}
```

也可以用unknown来代替，但是这样使用时需要额外的类型检查或类型转换。

```ts
interface Box {
    contents: unknown;
}

let x: Box = {
    contents: 'Hello World'
}

if (typeof x.contents === 'string') {
    console.log(x.contents.toLowerCase());
}

console.log((x.contents as string).toLowerCase())
```

我们可以通过泛型类更好地做到这一点。

```ts
interface Box<Type> {
    contents: Type;
}

const box: Box<string> = {
    contents: 'Hello World'
}

console.log(box.contents.toLowerCase());
```

## 数组类型

泛型对象经常被容器类型包含，容器类型一般不关心它存储的元素类型。

当我们写number[]或string[]时，它们只是Array<number>和Array<string>的简称。

现代的TS提供了其它泛型的数据结构。例如：Map<K,V>，Set<T>，Promise<T>。

### ReadonlyArray

表示只读的数组。

```ts
const arr: ReadonlyArray<string> = ['Hello'];
arr.push('World');
// Error  readonlyArray has no push method
```

## 元组类型

元组是另外一种类型的数组，元组知道数组内有多少个元素，也知道每个位置的元素类型。

```ts
type StringNumberPair = [string, number];

function doSomeThing(pair: StringNumberPair) {
  const a = pair[0];//a is string
  const b = pair[1];//b is number
}
```

元组类型在大量基于约定的API中比较有用，每一个元素的含义都是明确的。否则，最好使用object传递数据，因为object有属性名，可以更好地解释含义。

除了长度检查，元组类型跟下面的数组定义很类似。

```ts
interface StringNumberPairInterface {
  length: 2,
  0: string,
  1: number,
}

let pair: StringNumberPairInterface = ['1', 2];
```

元组可以有可选项，可选项只存在在最后一个元素，同时影响length。

```ts
type TwoOrThree = [number, number, number?];

function setCoordinate(coord: TwoOrThree) {
  const [x, y, z] = coord;
  console.log(coord.length); // property length: 2 | 3
}
```

元组也可以描述剩余元素。

```ts
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];
```

## 只读元组类型

```ts
function doSomeThing(pair: readonly [string, number]) {
  pair[0] = 'world';// Error
}
```


# 参考文档

https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties