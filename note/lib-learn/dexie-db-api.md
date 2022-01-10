# Dexie-DB-2

## 构建扩展

Dexie可以非常方便地添加扩展。

### 注册扩展

Dexie.addons数组包括了Dexie的扩展。一个扩展可以通过Dexie.addons.push(fn)来注册。

```js
import Dexie from 'dexie';

export function ForEachAddon(db) {
  db.Collection.prototype.forEach = db.Collection.prototype.each;
}

Dexie.addons.push(ForEachAddon);
```

### Dexie类所在的位置

Dexie类，像Collection，Table在Dexie构造函数内的闭包中创建的。为了扩展原型链，你必须用Dexie的实例。

### 覆盖已存在的方法

为了覆盖已存在的方法，你可以直接替换为你自己的方法。一个方便的工具函数是Dexie.override。

```js
db.Collection.prototype.each = Dexie.override(db.Collection.prototype.each, function(originalFn){
  return function() {
    let returnVal = originalFn.apply(this, arguments);
    // do something else
    return returnVal;
  }
})
```

### 受保护的方法

API目录没有列出Dexie受保护的方法和属性。但是你可以看源代码，发现很多以下划线_开始的方法和属性。

对于这些以_开始的方法和属性，Dexie并不保证完全的兼容。

### 什么时候使用prototype

对于Collection，WhereClause，Table，Transcation等内部类，使用prototype来添加方法。因为这样可以更快速得创建实例。

但是对于Dexie，不要使用prototype，因为一般Dexie是单例的，不会创建很多实例。

### 创建内部继承类

另外一种创建Dexie插件的方式是继承已有的类，并覆写一部分行为。eg：继承Table，并覆写db._tableFactory方法。

### 另外一种注册方式

你可以通过继承类的方式来扩展Dexie的功能。

```js
import Dexie from 'dexie';

class MyDerivedDexie extends Dexie {
  anotherProperty;
  
	anotherMethod() {
		// Do something here...
	}

  constructor (name, options) {
    super(name, options);
    this.anotherProperty = "other prop";
  }
}
```

## Collection

代表DB Objects的对象集合。注意，它并不包含任何对象，它只是包含如何执行DB-Query的信息。

当返回Promise的方法（toArray，keys，count，each）等调用时，Query才会执行。

### 创建

Collection的构造方法是私有的。WhereClause和一些Table的方法返回Collection的实例。

```js
let collection = db.friends.where('name').equalsIgnoreCase('david');

collection.each(function(friend){
   console.log(`Found：${friend.name} with name david`);
});
```

```js
db.friends.where('name').startsWithIgnoreCase('d').toArray((friends)=>{
  console.log(`Found ${friends.length} friends starting with d`);
})
```

```js
db.friends.where('age').above(25).offset(10).limit(10).toArray(friends=>{
  console.log(friends.map(JSON.stringify).join('\n'));
})
```

```js
db.friends.toCollection().count((count) => {
   console.log(`${count} friends in total`)
});
```

```js
db.friends.where('age').above(25).or('shoeSize').above(9).each(friend=>{
  console.log(`Found big friends ${friend.name}`);
})
```

### 方法

#### add

添加JS的过滤条件。

```js
collection.add(filter);
//filter:Function function(val){ return true/false; }
```

```js
db.friends.where('age').above(25).and((friend)=>{
  return friend.name === 'White'
}).toArray(friends=>{
  console.log(friends);
})
```

#### clone

拷贝查询条件。注意并不是拷贝数据库项目。

```js
db.transcation('r', db.friends, async function() {

  let collection = db.friends.where('age').above(75);

  let clone = collection.clone().reverse().limit(1);

  let allOldFriends = await collection.toArray();

  let oldestFriend = await clone.toArray();
}).catch(err => {
  console.error(err);
})
```

#### count

```js
collection.count(callback)
// callback:Function function(count) {} 
// callback返回Promise
```

##### 性能说明

如果在简单查询上执行，会调用IndexedDB的ObjectStore的count方法，这个执行速度会更快。

如果使用了高级查询，Dexie必须执行查询，然后遍历所有数据，然后返回count。

快速查询例子：

```js
table.count();
table.where(index).equals(value).count();
table.where(index).above(value).count();
table.where(index).below(value).count();
table.where(index).between(a,b).count();
table.where(index).startsWith(value).count()
```

这写例子快速的原因是，它们可以映射到基本的IDBKeyRange的only，lowerBound，upperBound和bound方法。

需要Dexie计算的例子：

```js
table.where(index).equalsIgnoreCase(value).count();
table.where(index).startsWithIgnoreCase(value).count();
table.where(index).anyOf(valueArray).count();
table.where(index).above(value).and(filterFn).count();
table.where(index).above(value1).or(index2).below(value2).count();
```

#### delete

删除查询到的所有数据。返回Promise的值表示删除的数据数量。

##### 错误处理

如果数据删除失败或回调中发生异常，整个操作会失败，事务会放弃。

如果你Catch了返回的Promise，事务不会被放弃，你会收到Dexie.MultiMofifyError的错误对象。

```js
{
  failures: [],//错误对象数组
  failedKeys: [], // key的数组，和failures顺序一致
  successCount: 0, // 成功删除的数量
}
```

如果你想log错误，并想让事务回滚，你必须在事务块中写操作代码，然后catch这个Transaction。

catch了这个操作，然后调用transaction.abort也是可以的。

```js
db.orders.where('state').anyOf('finished','discarded')
  .or('date').below(`2014-02-01`).delete()
  .then((deleteCount)=>{
    console.log(`Deleted ${deleteCount} items.`);
  })
```

```js
db.transaction('rw',db.orders, async () => {
  let deleteCount = await db.orders.where('state').anyOf('finished','discarded').delete();
  console.log(`Deleted ${deleteCount} items.`)
}).catch(err => {
  console.error(err)
})
```

##### 注意

Collection.delete和Collection.mofify(function(){delete this.value})的效果类似，但是要比后者快得多。