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
    }).upgrade(tx => {
      // modify可以更改
      return tx.table("friends").modify(friend => {
          friend.firstName = friend.name.split(' ')[0];
          friend.lastName = friend.name.split(' ')[1];
          friend.birthDate = new Date(new Date().getFullYear() - friend.age, 0);
          delete friend.name;
          delete friend.age;
      });
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

实现上，原始的DB对象通过Object.create的方法来浅拷贝到你绑定的类的实例上。

这个功能只适用于Table.get，Table.toArray，Table.each，Collection.toArray()，Collection.each()，Collection.first()，Collection.last()。

不适用于过滤的查询，Collection.filter，Collection.and，Collection.modify，Collection.Raw。

值得注意的是，它不适用于任何钩子函数。Table.hook('creating')，Table.hook('update')，Table.hook('reading')，Table.hook('deleting')。

### Add Items

```js
myDB.friends.add({id:1, firstName: 'White',lastName: 'If',yearOfBirth: 1999, tags: ['one','two','three']});
```

```js
myDB.friends.bulkAdd([{id:1,name:'BeiBianliu'},{id:2,name:'XiBianCao'}])
```

如果你有大量的对象要存储到ObjectStore中，使用bulkAdd会比add更快一些。

### Update Items

```js
await db.friends.put({id: 4, name: "Foo", age: 33});
```

```js
await db.friends.bulkPut([
    {id: 4, name: "Foo2", age: 34},
    {id: 5, name: "Bar2", age: 44}
]);
```

```js
await myDB.friends.update(1,{name:'Bar'})
```

```js
await myDB.friends.where('id').equals(1).modify({discount:0.5})
```

### Delete Items

```js
await db.friends.delete(4);
```

```js
await db.friends.bulkDelete([1,2,4]);
```

```js
await db.logEntries
    .where('timestamp').below(oneWeekAgo)
    .delete();
```


### QueryItems

```js
const someFriends = await db.friends
    .where("age").between(20, 25)
    .offset(150).limit(25)
    .toArray();
```

```js
await db.friends
    .where("name").equalsIgnoreCase("josephine")
    .each(friend => {
        console.log("Found Josephine", friend);
    });
```

```js
const abcFriends = await db.friends
    .where("name")
    .startsWithAnyOfIgnoreCase(["a", "b", "c"])
    .toArray();
```

```js
await db.friends
    .where('age')
    .inAnyRange([[0,18], [65, Infinity]])
    .modify({discount: 0.5});
```

```js
const friendsContainingLetterA = await db.friends
    .filter(friend => /a/i.test(friend.name))
    .toArray();
```

#### Joining

```js
var db = new Dexie('music');
db.version(1).stores({
    genres: '++id,name',
    albums: '++id,name,year,*tracks',
    bands: '++id,name,*albumIds,genreId'
});

async function getBandsStartingWithA () {

    const bands = await db.bands
        .where('name')
        .startsWith('A')
        .toArray();
    
    await Promise.all (bands.map (async band => {
      [band.genre, band.albums] = await Promise.all([
        db.genres.get (band.genreId),
        db.albums.where('id').anyOf(band.albumIds).toArray()
      ]);
    }));
    
    return bands;
}
```

### Ongoing Transcation

原子变更

```js
async function addComment(friendId, comment) {
    await db.friends
        .where('id')
        .equals(friendId)
        .modify(friend => {
            friend.comments.push(comment);
        });
}

async function spreadYourLove() {
    await db.transaction('rw', db.friends, async () => {
        const goodFriendKeys = await goodFriends().primaryKeys();
        await Promise.all(
            goodFriendKeys.map(id => addComment(id, "I like you!"))
        );
    });
}
```

上面的代码展示了如何复用transcation来执行多个操作。

## Working With Async APIS

Dexie.js使用了异步API，在同步API中，错误处理使用异常捕获机制。这非常方便，因为你无需在各处检查代码，只需要在更高层次上捕获异常即可。

异步API通常在操作完成时发出success和error事件。

IndexedDB同时使用了异常和错误事件来通知调用者，你需要同时使用try/catch和onerror来处理每一个请求。

Dexie.js使用Promise来处理错误。


## Promise-Specific Data(Zone)

Dexie Promise支持一种类似于本地线程存储的技术。这可以使一些静态属性绑定到执行中的Promise和它的子Promise中。

Dexie.js和它的transcation API重度依赖Transcation Zones，因为代码需要知道当前执行中的Transcation，而我们又不想把transcation传来传去。

### Promise.PSD

Dexie.Promise.PSD是一个自定义的Zone系统来维护进行中的DB Transcations。从Dexie 2.0.0-beta.4开始，Dexie的Zone系统可以支持await表达式。

```js
// Create a PSD scope
Dexie.Promise.newPSD (function () { 
    // Put something in it.
    Dexie.Promise.PSD.promiseSpecificVariable = 3; 
    // Create a promise that uses it
    new Dexie.Promise(function (resolve, reject) {
        setTimeout(resolve, 1000);
    }).then (function () {
        // This callback will get same PSD instance as was active when .then() was called
        assert (Dexie.Promise.PSD.promiseSpecificVariable == 3);
    });
});
```

与特定于线程的数据类似，特定于Promise的数据包含绑定到Promise流的静态数据。

#### 目的

在线程的世界里，特定于线程的数据可以被用来存储一些状态到当前执行的线程上。

授权引擎经常使用特定于线程的数据来保存授权规则，而不是将对象传来传去。

日志记录框架还依赖于线程特定的内容，因为用户可以不用传递userName等之类的数据来记录内容。

重入互斥锁是另一种重要模式，它使一个函数能够锁定互斥体，然后调用其它子函数，这些子函数也会锁定相同的互斥锁。

在Dexie中，PSD用于：

1、维护transaction scopes。

2、对事务启用可重用互斥锁。

3、在db.open完成之前，可以订阅db.ready事件。

## 异常处理

在Dexie中，只有Promise.catch可以捕获异常。

```js
db.transaction('rw',db.friends, ()=>{
  throw new Error('test error');
}).catch(err => {
  console.error(err);
})
```

### catch意味着异常处理

catch意味着异常已经处理，如果你想终止transcation，需要throw这个错误。

```js
db.transcation('rw',db.friends,()=>{
  db.friends.add({id:1,name:'Foo'}).catch(err=>{
    console.error("Failed to add Foo friend.");
    throw err;
  })
});
```

## 使用transactions

当你想处理多个操作时，你最好使用transcations。这样做，有以下好处：

1、如果在数据修改过程中发生了一些错误，你的修改会回滚。

2、不需要处理Promise异常了，你只需要处理transcation的异常。

3、你可以同步执行所有写入操作，而无需等待上一个完成才能开始下一个。

4、读操作可以在写操作的下一行执行，这是因为当前事务中存在被挂起的写操作时，其它操作都需要排队。

5、没有一个错误会错过。因为在catch字句里会捕捉所有的错误。

```js
db.transaction('rw', db.friends, db.pets, function () {
    // Any database error event that occur will abort transaction and
    // be sent to the catch() method below.
    // The exact same rule if any exception is thrown what so ever.
    return db.pets.add({name: 'Bamse', kind: 'cat'}).then(function (petId) {
        return db.friends.add({name: 'Kate', age: 89, pets: [petId]});
    });

}).catch(function (error) {
    // Log or display the error
    console.error (error.stack || error);
});
```

当使用Transcations时，你可以查询到刚刚add，put，update，delete和modify操作的数据，而不用等到更新操作结束。等待的操作框架会处理。

```js
db.transaction("rw", db.friends, function () {
    db.friends.add({ name: "Ulla Bella", age: 87, isCloseFriend: 0 });
    db.friends.add({ name: "Elna", age: 99, isCloseFriend: 1 });
    db.friends.where("age").above(65).each(function (friend) {
        console.log("Retired friend: " + friend.name);
    });
}).catch(function (error) {
    console.error(error);
});
```

## IndexedDB事务会自动提交

IndexedDB的事务，如果在某个事件循环中没有被使用，它就会被自动提交。

## 嵌套的IndexedDB事务

自动version 0.9.8以后，Dexie支持嵌套的事务。

```js
db.transaction('rw', db.friends, db.pets, function () {
    // MAIN transaction block
    db.transaction('rw', db.pets, function () {
       // SUB transaction block
    });
});
```

嵌套的事务的强大之处在于，使用事务的函数可以被更高级别的代码重用，该代码将其所有的调用转换为更大的事务。

# DexieDB的最佳实践

## 熟悉Promise

确保你了解Promise A+的基本规范。下面是测试代码：

```js
function doSomething() {
    // Important: Understand why we use 'return' here and what we actually return!
    return db.friends.where('name').startsWith('A').first().then(function (aFriend) {
        return aFriend.id; // Important: Understand what 'return' means here!
    }).then (function (aFriendsId) {
        // Important: Understand what it means to return another Promise here:
        return fetch ('https://blablabla/friends/' + aFriendsId);
    });
}
```
## 在catchPromise时要多思考

catch了错误，没有重新抛出错误是不好的实践。

```js
function somePromiseReturningFunc() {
    return db.friends.add({
        name: 'foo',
        age: 40
    }).catch (function (err) {
        console.log(err);
    });
}
```

下面的做法要比上面的好不少，这样调用者会得到相关的错误信息。

```js
function somePromiseReturningFunc() {
    return db.friends.add({
        name: 'foo',
        age: 40
    });
    // Don't catch! The caller wouldn't find out that an error occurred if you do!
    // We are returning a Promise, aren't we? Let caller catch it instead!
}
```

在transcation范围内，尤其如此。你catch了一个Promise，意味着你有优雅处理错误的方法。如果你没有，请不要catch它。

```js
function myDataOperations() {
    return db.transaction('rw', db.friends, db.pets, function(){
        return db.friends.add({name: 'foo'}).then(function(id){
            return db.pets.add({name: 'bar', daddy: id});
        }).then (function() {
            return db.pets.where('name').startsWith('b').toArray();
        }).then (function (pets) {
            //
        }); // Don't catch! Transaction SHOULD abort if error occur, shouldn't it?
    }); // Don't catch! Let the caller catch us instead! I mean we are returning a promise, aren't we?!
}
```

但是在事件处理器或顶层的Promise中，需要Catch。因为没有人会调用你，你需要处理这个错误，如果不你处理这个错误，这个错误就会到unhandlerejection事件中。

```js
somePromiseReturningFunc().catch(function (err) {
    $('#appErrorLabel').text(err);
    console.error(err.stack || err);
});
```

某些时候，你对某些错误有合适的处理方式，这种情况下，你可以catch这个错误。

```js
function getHillary() {
  return db.friends
    .where('[firstName+lastName]')
    .equals(['Hillary', 'Clinton'])
    .toArray()
    .catch('DataError', function (err) {
      // May fail in IE/Edge because it lacks support for compound keys.
      // Use a fallback method:
      return db.friends
        .where('firstName')
        .equals('Hillary')
        .and(function (friend) {
          return friend.lastName == 'Clinton';
        });
    });
}
```
如果只是为了log和debug，需要将错误err throw出去。

```js
function myFunc() {
    return Promise.resolve().then(function(){
        return db.friends.add({name: 'foo'});
    }).catch(function (err) {
        console.error("Failed to add foo!: " + err);
        throw err; // Re-throw the error to abort flow!
    }).then(function(id){
        return db.pets.add({name: 'bar', daddy: id});
    }).catch(function (err) {
        console.error("Failed to add bar!: " + err);
        throw err; // Re-throw the error!
    }).then (function() {
        ...
    });
};
```

## 在事务中不要使用其它异步API

IndexedDB的事务，如果在一个事件循环中没有被使用，就会自动提交。这意味着你不要在你事务中调用其它异步API。

如果你想要调用一个耗时短的Async-API，你需要使用Dexie.waitFor来保持事务。

```js
Dexie.waitFor(promise, timeout=60000)
```

## 在事务中使用全局的Promise

确保在事务中使用全局对象的Promise(window.Promise)。如果使用polyfill，确保在页面初始化时设置window.Promise。

估计Dexie在内部重写了一部分Promise的逻辑。使用Dexie.Promise也是可以的。

```js
db.transaction(..., ()=>{
    Dexie.Promise.all()
    Dexie.Promise.race()
    new Dexie.Promise((resolve, reject) => { ... })
})
```

## 当你有多个操作时，使用transcation。

使用事务的益处：

1、稳健性，任何错误发生，事务会回滚。

2、简洁的代码，你可以顺序写所有操作，它们在事务中排队。

3、一行代码即可catch所有错误。

4、在事务块中的代码，DB的操作可以不用处理异常。

5、更快的执行速度。

```js
db.transaction("rw", db.friends, db.pets, function() {
    db.friends.add({name: "Måns", isCloseFriend: 1}); // unhandled promise = ok!
    db.friends.add({name: "Nils", isCloseFriend: 1}); // unhandled promise = ok!
    db.friends.add({name: "Jon", isCloseFriend: 1});  // unhandled promise = ok!
    db.pets.add({name: "Josephina", kind: "dog"});    // unhandled promise = ok!
    // If any of the promises above fails, transaction will abort and it's promise
    // reject.

    // Since we are in a transaction, we can query the table right away and
    // still get the results of the write operations above.
    var promise = db.friends.where("isCloseFriend").equals(1).toArray();

    // Make the transaction resolve with the last promise result
    return promise;

}).then(function (closeFriends) {

    // Transaction complete.
    console.log("My close friends: " + JSON.stringify(closeFriends));

}).catch(function (error) {

    // Log or display the error.
    console.error(error);
    // Notice that when using a transaction, it's enough to catch
    // the transaction Promise instead of each db operation promise.
});
```

## 如果事务要被放弃，重新抛出错误

如果只是为了log和debug的目的，需要重新抛出错误。也可以返回retuen Promise.reject(err)

## 可选的，声明方法

当你使用db.version(1).stores({...})声明ObjectStores时，你只是声明了索引，并不是所有属性。

较好的实践是对于持久化的类，有一个更详细的class声明。这可以让IDE自动提示代码。

有两个不同的方法：

1、mapToClass，将已有的类映射到objectStore。

2、defineClass，让Dexie声明一个类。

```js
import Dexie from 'dexie';

class MyDB extends Dexie {
  folders!: Dexie.Table<Folder>;

  constructor() {
    super('MyAppDB');
    this.version(1).stores({
      folders: '++id,&path'
    });
    this.folders = this.table('folders');
  }
}

const myDB = new MyDB();
class Folder {
  path!: string
  desc!: string;

  save() {
    return myDB.folders.put(this);
  }
}

myDB.folders.mapToClass(Folder);
```

```js
const myDB = new MyDB();
//@ts-ignore
const Folder = myDB.folders.defineClass({
  id: Number,
  path: String,
  desc: String
});

Folder.prototype.save = function () {
  //@ts-ignore
  return myDB.folders.put(this);
}
```


## 参考文档

https://dexie.org/docs/Tutorial/React

https://dexie.org/docs/API-Reference#quick-reference

https://dexie.org/docs/Tutorial/Best-Practices