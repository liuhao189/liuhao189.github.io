# 对象类型

对象是TS中组织和传递数据的基础。

```ts
function greet(person: { name: string, age: number }) {
    return "Hello " + person.name;
}

interface Person {
    name: string;
    age: number;
}

function greet2(person: Person) {
    return "Hello " + person.name;
}

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

在属性名后添加?即可指定这些属性是可选的。

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

某些时刻你提前不知道属性的名称，但是你知道属性的类型。在这种情况下，可以使用属性签名。

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

