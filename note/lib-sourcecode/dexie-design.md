# Dexie-Design

## Dexie

Dexie即是一个类，也是一个namespace。Dexie实例表示数据库连接。做为namespace，它导出了一系列方法，工具和类。

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

1、如果修改DB失败，每一个操作都会回滚。

2、你可以同步执行写入操作，不用等待上一个完成。

3、你可以在一个catch方法中捕捉所有错误和异常。

4、浏览器可能在任意时刻关闭，如果不使用事务，可能会导致状态不对。

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

## Promise

Dexie中所有的异步方法都返回Promise，Dexie的实现中也有finally方法。这让Dexie API更易用，同时使得错误处理更加健壮。

Dexie同时提供一种简写方式，如果Promise返回数据，大多数这类方法，可以直接传入callback方法。

```js
db.friends.where('name').startsWithIgnoreCase('arnold').toArray((a)=>{
    console.log(a.length);
}).catch(err => {
    console.error(err);
});
```

### Catch特定的Exception

Dexie的Promise实现可以实现catch特定类的Error。

```js
db.friends.where('name').startsWithIgnoreCase('arnold').toArray(a=>{
    console.log(a.length);
}).catch(DOMError,(e)=>{
    //DOMError
}).catch(TypeError,(e)=>{
    //TypeError
}).catch(err=>{
    // unknown error type
});
```

## WhereClause

你可以从Table实例中通过两个方法来拿到数据：

1、Table.get，通过Primary key来取数据。

2、Table.where，高级查询。

```js
db.friends.get(2).then(friend=>{
    console.log(friend);
});
//
db.friends.where('shoeSize').above(37).count((count)=>{
    console.log(count);
});
//
db.friends.where('shoeSize').between(37,40).or('name').anyOf(['Arnold','Ingemar'])
    .and((friend)=>{ return friend.isCloseFriend; })
    .limit(10).each(friend => {
        console.log(friend);
    });
```

## AND 和 OR

原生的IndexedDB不支持逻辑AND和OR操作符。

Dexie通过执行两个不同的请求，然后合并请求结果来模拟OR操作符。or接受一个字符串参数，和where语句类似。

and方法接受一个filter函数。

逻辑OR不能通过过滤条件来实现，我们必须执行两个查询来获得数据。

逻辑AND最优的实现方式是使用前一个query查询过滤大多数数据，然后使用JS的filter来过滤剩下的数据。


## 参考文档

https://dexie.org/docs/Tutorial/Design