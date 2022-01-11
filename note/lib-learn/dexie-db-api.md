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

#### desc

按降序排列Collection中的数据。

```js
collection.desc();
```

注意：用sortBy或自然排序的句子，这个方法都会反序Collection中的数据，如果调用了两次，排序规则会到原来的顺序。


#### distinct

```js
collection.distince()
```

注意：返回按主键去重的结果，只有在联合主键索引的情况下才有用。

#### each

执行查询，然后遍历结果数组。

```js
//callback : function(item,cursor){}
collection.each(callback);
```

注意：each实在readonly的事务中执行的，如果你要在回调中修改数据。请使用Collection.modify方法。

当然，你也可以将你的代码包裹在一个ReadWrite事务中。

如果遍历结束，返回的Promise会返回undefined。如果遍历失败，返回的Promise会rejected。

##### Notes

1、这个操作会隐式得在Readonly的事务中执行，除非代码已经包裹在一个事务中。

2、callback不应该修改数据库，如果需要修改，使用Collection.modify。

3、callback的返回值会被忽略，所以返回Promise没有任何作用。

4、在大多数情况下，读取Table或Collection的值，使用Collection.toArray，Collection.primaryKeys，Collection.keys的性能会更好。

```js
const db = new Dexie('dbname')
db.version(1).stores({
  friends: `id,name,age`
});

db.friends.bulkPut([
  {id: 1, name: 'One', age: 33},
  {id: 2, name: 'Two', age: 44 },
  {id: 3, name: 'Three', age: 1}
]).then(()=>{
  console.log(`All my friends, ordered by id:`);
  return db.friends.each(item=> {
    console.log(item.name);
  });
}).then(()=>{
  console.log(`All my friends, ordered by age:`);
  return db.friends.orderBy('age').each(item => {
    console.log(item.name)
  })
}).then(()=>{
  console.log('Friends over 30 years old:');
  return db.friends.where('age').above(30).each(item => {
    console.log(item.name);
  })
}).catch(err=>{
  console.error(err);
})
```

#### eachKey

使用index或主键查询，然后遍历数据并调用方法。

```js
// callback: function(key,cursor){}
collection.eachKey(callback);
```

#### eachPrimaryKey

使用index查询，然后遍历数据并调用方法。

```js
// callback: function(primaryKey){}
collection.eachPrimaryKey(callback);
```

#### eachUniqueKey

使用index或主键查询，然后不同的key值才调用方法。

```js
// callback: funciton(key,cursor){}
collection.eachUniqueKey(callback);
```

```js
db.friends.orderBy('firstName').eachUniqueKey((firstName)=>{
  console.log(firstName);
})
```

#### filter

过滤查询到的数据。

```js
// fn: function(val){return true/false};
// return collection instance。
collection.filter(fn);
```

该方法和and的功能和用法均相同。

```js
db.friends.orderBy('age').filter((item)=>{
  return item.name === 'Foo';
})
```

#### first

返回第一个数据。

```js
// cb: optional funciton(item){}
// return: Promise
collection.first(cb);
```

注意：如果没有传递callback方法，返回的Promise会resolve 结果值。

如果传递了callback方法，返回的Promise会resolve callback的返回值。

#### keys

```js
// cb: optional function(keysArray){}
// return: Promise
collection.keys(cb);
```

##### 性能提示

跟Collection.primaryKeys类似，这个操作比Collection.toArray速度快。

原因有：

1、整个对象不用实例化。

2、底层数据库引擎不用读取数据值，只有索引值即可。

##### 注意

cb参数会收到查询用到索引的值。只能在索引上使用，不能使用在主键上。

```js
db.friends.orderBy('firstName').keys((firstNames)=>{
  alert(`My Friends are: ` + firstNames.join(','))
});

db.friends.orderBy('shoeSize').uniqueKeys(shoeSizes=>{
  alert(`My friends have the following shoe size: `, shoeSizes.join(','));
});
// keys(), uniqueKeys()，eachKey，eachUniqueKey不能在主键上调用。
db.friends.orderBy('id').keys();//will fial
```