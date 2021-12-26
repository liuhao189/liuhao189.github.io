# Dexie学习

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

添加数据到DB可以调用Table.add，Table.put，Table.update和Collection.mofify。

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

MultiEntry的索引表示的是索引属性的值是数组值。每一个数组中的值会指向那条记录。

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
    this.version(1).stores({
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

也可以使用db.persons.where({firstName:'fName',lastName:'lName'})来搜索。

#### 



## 参考文档

https://dexie.org/docs/Tutorial/React

https://dexie.org/docs/API-Reference#quick-reference