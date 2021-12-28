# DexieDB学习

dexie是IndexedDB的包装类库。Dexie主要解决原生IndexedDB存在的三个主要问题：

1、不明确的错误处理；2、弱查询能力；3、代码繁杂。

Dexie提供了一个整洁的数据库，具有深思熟虑的API设计，强大的错误处理，可扩展性，更改跟踪感知，同时扩展KeyRange的支持。

```js
// ES7的写法
import Dexie from 'dexie';
import type { Table } from 'dexie';

const db = new Dexie('FriendDataBase');

db.version(1).stores({
  friends: "++id,name,age"
});
//@ts-ignore
const friendsTable = db.friends as Table;

db.transaction('rw', friendsTable, async () => {
  let joseCount = await friendsTable.where({ name: 'Jose' }).count();
  let hasJose = joseCount > 0;
  if (!hasJose) {
    const id = await friendsTable.add({ name: 'Jose', age: 21 });
    console.log(`Added friend with id ${id}`);
  }

  const youngFriends = await friendsTable.where('age').below(25).toArray();
  console.log(`My young friends：`, youngFriends);
});
```

```js
// Class的写法
import Dexie, { Table } from 'dexie';

interface Friend {
  id?: number;
  name?: string;
  age?: number;
}

class FriendDataBase extends Dexie {
  public friends: Dexie.Table<Friend, number>;

  public constructor() {
    super('FriendDataBase');
    this.version(1).stores({
      friends: '++id,name,age'
    });
    this.friends = this.table('friends');
  }
}

const db = new FriendDataBase();

db.transaction('rw', db.friends, async () => {
  if ((await db.friends.where({ name: 'Josephine' }).count()) === 0) {
    const id = await db.friends.add({ name: "Josephine", age: 21 });
    alert(`Addded friend with id ${id}`);
  }
  const youngFriends = await db.friends.where("age").below(25).toArray();
  console.log(`My young friends：`, youngFriends);
}).catch(err => {
  console.error(err);
})
```

## Dexie Doc

Dexie V3.2及以后的版本，原生是支持响应式的。在V3.2版本中，我们引入了实时查询的功能。如果数据库里数据改变了，一个二叉范围树算法会高效地计算出这些改变会影响到的查询。

如果影响到了查询，会执行用户指定的回调，用户可以在指定的回调中重新渲染组件。

### 安装Dexie

```bash
npm i dexie 
```

### 创建db

应用一般只有会一个Dexie实例，这也是你声明你需要的表及其索引的地方。Dexie实例是单例的，一般不需要懒创建它。在db的模块中导出db实例，以供其它模块使用。

```js
import Dexie from 'dexie';

export interface Friend {
  id?: number;
  name: string;
  age: number;
}

export class MyDexie extends Dexie {
  friends: Dexie.Table<Friend, number>;

  constructor() {
    super('MyDataBae');
    this.version(1).stores({
      friends: '++id,name,age'
    });
    this.friends = this.table('friends');
  }
}

export const db = new MyDexie();
```

### 添加数据

添加数据到DB可以调用Table.add，Table.put，Table.update和Collection.modify。

```js
window.addEventListener('load', () => {
  const btnAdd = document.querySelector('#btnAdd');
  btnAdd?.addEventListener('click', async () => {
    try {
      const txtName = document.querySelector('#txtName') as HTMLInputElement;
      const txtAge = document.querySelector('#txtAge') as HTMLInputElement;
      if (!txtName?.value || !txtAge?.value) {
        alert(`请输入姓名和年龄！`)
        return;
      }
      //@ts-ignore
      let db = window.myDB;
      const addId = await db.friends.add({ name: txtName.value, age: Number.parseInt(txtAge?.value) });
      console.log(`New Friend Id is ${addId}`);
    }
    catch (ex) {
      console.error(ex);
    }
  })

})
```

### 查询数据

```js
function queryAllFriends() {
  window.myDB.friends.toArray().then(res => { console.log(res); })
}
```

### 带参数查询数据

where指定字段，然后指定条件。

```js
async function queryWithAgeParams(minAge: number, maxAge: number): Promise<any> {
  try {
    const friends = await window.myDB.friends.where('age').between(minAge, maxAge).toArray();
    return friends;
  } catch (ex) {
    console.error(ex);
  }
}
```

## Quick Reference 

### 声明数据库

注意：不像SQL中那样，不用声明每一个字段值和类型。你只需要声明你想要添加索引的字段。

++代表，自动增加的key。&表示Unique，*表示MultiEntey索引，[A+B]表示混合索引。

```js
import Dexie from 'dexie';

interface Friend {
  name: string;
  age: number;
  id?: number;
}

class MyDexieDb extends Dexie {
  friends: Dexie.Table<Friend, number>;
  gameSessions: Dexie.Table<number, number>;
  constructor() {
    super('MyDataBase')
    this.version(1).stores({
      friends: '++id,name,age,*tags',
      gameSessions: 'id,score'
    });
    this.friends = this.table('friends');
    this.gameSessions = this.table('gameSessions');
  }
}
```

#### MultiEntry索引

MultiEntry的索引表示的是索引属性的值是数组值。每一个数组中的值会指向自身所在的相同的记录。

```js
class MyBookDb extends Dexie {
  constructor() {
    super('BookDB');
    this.version(1).stores({
      books: 'id,author,name,*categories'
    });
    this.books = this.table('books');
  }
  addBook(bookItem) {
    this.books.put(bookItem);
  }
  queryBookByCategory(category) {
    return this.books.where('categories').equals(category).toArray();
  }
}
const db = new MyBookDb();

db.addBook({
  id: 1,
  name: "Under the Demo",
  author: "Stephen King",
  categories: ['sci-fi', 'thriller']
});
db.queryBookByCategory('sci-fi').then(res => {
  console.log(`queryBookByCategory`, res);
});
```

当使用MultiEntry索引查询时，有一定的概率会得到多条相同的记录。这种情况下需要使用Collection.distinct来去除重复记录。

```js
//
queryBooksByMultiCategory(categoryArr: Array<string>) {
  return this.books.where('categories').anyOf(...categoryArr).distinct().toArray();
}
//
db.queryBooksByMultiCategory(['sci-fi', 'thriller']).then(res => {
  console.log(`queryBooksByMultiCategory`, res);
})
```

#### 联合索引

一个联合索引基于若干个keyPaths。它可以高效率地索引多个属性值。

```js
interface Person {
  id: number;
  firstName: string;
  lastName: string;
}

class MyPeopleDb extends Dexie {
  persons: Dexie.Table<Person, number>;
  constructor() {
    super('PeopleDB');
    this.version(2).stores({
      persons: 'id,[firstName+lastName]'
    });

    this.persons = this.table('persons');
  }

  addPerson(personItem: Person) {
    this.persons.put(personItem);
  }

  queryPersonByName(nameArr: Array<string>) {
    return this.persons.where('[firstName+lastName]').equals(nameArr).toArray();
  }
}

const db = new MyPeopleDb();
db.addPerson({
  id: 1,
  firstName: "White",
  lastName: "King",
});

db.addPerson({
  id: 2,
  firstName: "White",
  lastName: "Queen",
})
```

#### 联合索引查询

可以使用属性和属性值的对象来查询。

```js
db.persons.where({ firstName: 'White', lastName: 'Queen' }).toArray().then(res => {
  console.log(`res is `, res);
})
```

也可以直接直接使用索引名称来查询。

```js
db.persons.where('[firstName+lastName]').equals(['White', 'Queen']).toArray().then(res => {
  console.log(`res is `, res);
});
```

#### 联合索引是如何工作的？

联合索引在IndexedDB中存储为数组。

#### 只查询第一个属性值

可以只查询firstName='xxx'的所有记录。

```js
db.persons.where('[firstName+lastName]').between(['White', Dexie.minKey], ['White', Dexie.maxKey]).toArray().then((res) => {
  console.log(`res is `, res);
})
```

从Dexie3.x开始，联合索引开始添加虚拟索引，一般是联合索引的第一个字段。

```js
db.persons.where('firstName').equals("White").toArray().then(res => {
  console.log(`res is `, res);
});
```

注意：只有联合索引的第一个字段可以单独使用。对于任何支持复合索引的BTree数据库，这都是相同的规则。

```js
db.persons.where('[firstName+lastName]').anyOf([['White', 'King'], ['White', 'Queen']]).toArray().then(res => {
  console.log(`res is `, res);
});
```

#### 联合主键

可以使用联合主键，只是该键不能自加。

```js
  constructor() {
      super('PeopleDB');
      this.version(2).stores({
          personsNew: '[firstName+lastName]'
      });
      this.persons = this.table('personsNew');
  }
```

#### 浏览器限制

IE，非Chromium的Edge，和低于10的Safari不支持联合索引，也不支持联合索引做主键。你可以声明联合索引，但在使用where('[x+y]')时会报错。

但是使用对象查询参数时，该查询可以在所有浏览器上运行。如果浏览器支持联合索引，则使用联合索引，如果浏览器不支持联合索引，则使用简单索引，如果这些都不支持，则使用全表扫描然后过滤即可。

```js
table.where({
   prop1: value1,
   prop2: value2,
   ...
})
```

#### 使用OrderBy

如果联合索引是'[firstName+lastName]'，table.orderBy会先按firstName，再按lastName进行排序。

排序算法不止在调用orderBy时生效，在使用where字句时也会生效。

```js
db.persons.where('[firstName+lastName]').between(['W', ''], ['Z', '']).toArray().then(res => {
  console.log(res);
});
```

如果某个对象缺少firstName或lastName，则不会出现在结果中。联合索引只包含两个字段均有合法值得对象。

如果你的应用需要按几种方式排序，你可以增加多个联合顺序不同的联合索引。

```js
db.version(x).stores({
    people: `
      ++id,
      [firstName+lastName],
      [lastName+firstName]`
});
```

### upgrade

```ts
class MyDB extends Dexie {
    constructor() {
        super('MyDB');
        this.version(1).stores({
            friends: '++id,name,age',
            gameSessions: 'id,score'
        });
        this.friends = this.table(`friends`);
        this.gameSessions = this.table(`gameSessions`);
    }
}
const myDB = new MyDB();
```

注意：只有存入数据后，indexedDB中才会出现表结构。

```js
class MyDB extends Dexie {
  friends: Dexie.Table<{ id?: number, name: string, age: number }, number>;
  gameSessions: Dexie.Table<{ id: number, score: number }, number>;

  constructor() {
    super('MyDB');
    this.version(2).stores({
      friends: '++id,[firstName+lastName],yearOfBirth,*tags',
      gameSessions: null
    });

    this.friends = this.table(`friends`);
    this.gameSessions = this.table(`gameSessions`);
  }
}

const myDB = new MyDB();
```

注意：只有存入新数据后，indexedDB才会变更表结构和索引。

### Class Binding

```js
class Friend {
  id!: number;
  firstName!: string;
  lastName!: string;
  yearOfBirth!: number;
  tags!: Array<string>;

  save() {
    return myDB.friends.put(this);
  }

  get age() {
    return (new Date().getFullYear() - this.yearOfBirth);
  }
}

myDB.friends.mapToClass(Friend);
```

调用该方法会使从friends取出的对象会成为你绑定的类的实例。所以原型链上的方法都可以使用。

在底层，原始的DB对象通过Object.create的方法来浅拷贝到你绑定的类的实例上。

这个功能只适用于Table.get，Table.toArray，Table.each，Collection.toArray()，Collection.each()，Collection.first()，Collection.last()。

不适用于过滤的查询，Collection.filter，Collection.and，Collection.modify，Collection.Raw。

值得注意的是，它不适用于任何钩子函数。Table.hook('creating')，Table.hook('update')，Table.hook(`reading`)，Table.hook(‘deleting’)。


## 参考文档

https://dexie.org/docs/Tutorial/React

https://dexie.org/docs/API-Reference#quick-reference