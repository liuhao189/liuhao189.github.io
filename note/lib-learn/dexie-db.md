# Dexie学习

dexie是IndexedDB的包装类库。Dexie主要解决原生IndexedDB存在的三个主要问题：

1、不明确的错误处理；2、弱查询能力；3、代码繁杂。

Dexie提供了一个整洁的数据库，具有深思熟虑的API设计，强大的错误处理，可扩展性，更改跟踪感知和扩展KeyRange的支持。

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


## 参考文档

https://dexie.org/docs/Tutorial/React