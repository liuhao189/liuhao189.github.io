# Dexie-Design

## Dexie

Dexie即是一个类，也是一个namespace。Dexie实例表示数据库连接。做为namespace，它名下导出了一系列方法，工具和类。

Dexie依赖于IndexedDB，IndexedDB是一个异步的数据库，所有操作都不会同步返回，所有操作的结果均返回Promise。

Dexie支持操作队列，你可以在定义DB后就使用它。如果open没有被调用，它会立刻调用open，然后执行操作队列中的操作。

你也不需要关心DB是否创建，Dexie会替你判断是否需要创建数据库或修改Table的属性。

## Table类

Table表示Object-Store。在Dexie的实例上，你可以直接访问Table的实例。

```js
const db = new Dexie('FriendAndPetsDB');
db.version(1).stores({
    friends:"++id,name,isCloseFriend",
    pets: "++id,name,kind"
});
db.open();
db.friends.add({name:"Ingemar", isCloseFriends:0 });
db.pets.add({name:"Josephina",kind:"dog",fur: "too long right now" });
```

Table是在你的Object Store上进行所有操作的入口，eg：查询，添加，更新，删除，清空或修改数据。

## Transactions

当你想要在DB上进行多个顺序操作时，你需要使用transcation。Transcation表示完整的ACID事务，当使用Transcation时会获得以下优势。

1、如果操作DB的过程中某一步失败了，每一个操作都会回滚。

2、你可以同步执行写入操作，不用等待上一个操作完成。

3、你可以在一个catch方法中捕捉所有错误和异常。

4、浏览器可能在任意时刻关闭，如果不使用事务，可能会导致数据库状态不对。

## Transcation生命周期

事务会自动提交。如果你执行setTimeout(cb,0)，事务就会自动提交。

在事件循环间保持transcation的唯一方式是在事务上执行DB操作，然后事务会存活到操作失败或成功。

Dexie.waitFor会一直保持事务存活，知道给定的Promise fulfilled。

事务没有commit方法，因为事务会自动提交，所以不需要。但是你可以abort事务。

## DB版本

如果只是添加新的索引，直接执行代码即可。

```js
db.version(1).stores({ friends:"++id,name" });
db.version(2).stores({ friends:"++id,name,shoeSize" });
```

如果要改变数据本身，例如将name分为firstName和lastName。

```js
const db = new Dexie('FriendsDB');
db.version(3).stores({friends:"++id,shoeSize,firstName,lastName"}).upgrage(tx => {
    return tx.table("friends").toCollection().modify(friend=>{
        friend.firstName = friend.name.split(' ')[0];
        friend.lastName = friend.name.split(' ')[1];
        delete friend.name;
    })
})
```

## 变更追踪

Dexie可以控制和监控每一个DB操作。Dexie提供create，update，delete的hook来让用户可以执行自定义操作。

## CRUD Hooks

CRUD Hooks可能很强大，可以通过这写Hooks来实现同步，观察者，自定义高级索引，外键，视图等。

## populate事件

某些情况下，你的DB需要初始化数据才能工作。数据需要在populate时添加。populate事件只会在DB创建时会触发。

```js
let db = new Dexie("MyTicketDB");
db.version(1).stores({
    tickets: '++id,headline,desc,statusId',
    statuses: '++id,name,openess'
});

db.on('populate',function(){
    db.statuses.add({id:1, name: "opened", openess: true});
})
```

## 参考文档

https://dexie.org/docs/Tutorial/Design