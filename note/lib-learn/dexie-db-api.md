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

注意：each是在readonly的事务中执行的，如果你要在回调中修改数据。请使用Collection.modify方法。

当然，你也可以将你的代码包裹在一个ReadWrite事务中。

如果遍历结束，返回的Promise会返回undefined。如果遍历失败，返回的Promise会rejected。

##### Notes

1、这个操作会隐式得在Readonly的事务中执行，除非代码已经包裹在一个其它事务中。

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

#### primaryKeys

取出Collection中的所有主键。

```js
// callback: Function(keysArr){} optional
collection.primaryKeys(callback)
```

##### 性能注意点

和Collection.keys方法类似，这个操作比Collection.toArray方法快。

如果可以，这个方法会使用IDBObjectStore.getAllKeys()/IDBIndex.getAllKeys()来获得所有key值。

上述情况只能在没有使用reversed，没有offset，filter只使用below，above，between，equals，startsWith或Table.orderBy方法。

```js
db.transaction('r', db.friends, async ()=> {
  const results = await Promise.all([
    db.friends.where('firstName').startsWith('Ali').primaryKeys(),
    db.friends.where('lastName').startsWith('Svens').primaryKeys(),
    db.friends.where('age').between(18,65).primaryKeys(),
  ]);

  const intersection = results.reduce((ids1,ids2)=>{
    const set = new Set(ids1);
    return ids2.filter(id=> set.has(id));
  })
});
```

#### raw

```js
// return the collection instance
collection.raw()
```

##### 注意

使结果操作忽略所有Table.hook('reading')的订阅。eg：不会map object到它们的mapped class。

#### reverse

```js
//return collection.reverse()
collection.reverse()
```

##### 注意

reverse会反序collection中的数组，和desc方法有相同的功能。是用来代替desc功能的。

#### sortBy

```js
// keyPath: string
// callback: function(array){}
// return Promise
collection.sortBy(keyPath,callback?)
```

##### 注意事项

在Collection中的Items会默认按where子句中的index或primary键排序。如果使用了or，collection不会自动排序了。

```js
db.friends.where('age').above(25).reverse().sortBy('name');
```

#### toArray

执行查询，并将结果使用where子句中使用的index来排序。

```js
//callback: optional Funciton function(arr) {}
// return Promise
collection.toArray(callback)
```

#### uniqueKeys

```js
// callback optional function(keysArray){}
// return Promise
collection.uniqueKeys(callback)
```

```js
db.friends.orderBy('name').uniqueKeys(function(keyaArr){})
```

#### until

直到给定的filter返回true之后，忽略所有的items。

```js
// filterFn，function(item){} 当返回true时，会停止遍历
// bInclueStopEntry: boolean，是否包含停止的item
collection.until(filterFn,bInclueStopEntry);
```

##### 注意

和limit类似，但是让你指定一个函数来告知何时停止。

```js
let cancelled = false;

function getLogs(){
  cancelled = false;
  return db.logEntries.where('date').between(yesterday,today).until(()=>cancelled).toArray();
}

function calcel() {
  cancelled = true;
}
```

## Table API

属性：

1、name。

2、schema。

事件：

1、hook('creating')，创建新数据时。

2、hook('reading')，从DB中读取，将要发给调用者时。

3、hook('updating')，从DB中更新数据时。

4、hook('deleting')，从DB中删除数据时。

方法：

1、add，添加单条数据。

2、bulkAdd，添加多条数据，传数组，为大量数据添加做了优化。

3、bulkDelete，传递keys，为大量数据删除做了优化。

4、bulkPut，传递数组，为大量数据更新做了优化。

5、clear，删除所有数据。

6、count，返回数据条数。

7、defineClass，映射到JS的构造类。

8、delete，删除数据，传递key。

9、each，遍历表中的数据项。

10、filter，JS过滤器应用到所有条目。

11、get，通过主键读取对象。

12、limit，按主键排序返回Collection，限制N条。

13、mapToClass，映射到JS的构造类。

14、orderBy，通过给定的索引排序。返回Collection。

15、offset，返回一个Collection，前N条忽略。

16、put，更新或插入数据。

17、reverse，返回Collection，按主键倒序排。

18、toArray，返回所有数据的数组。

19、toCollection，返回所有数据的Collection。

20、update，已存在的对象去更新。

21、where，通过查询来得到数据。

## Table.where

```js
table.where(keyPathArray);
table.where({keyPath1:value1,keyPath2:value2,...});
```

参数说明：

indexOrPrimaryKey:string，索引或主键名，:id表示主键。

keyPathArray，需要索引的keyPaths，需要是复合索引或主键。

{keyPath1:val1,keyPath2:val2,...}，要筛选的条件。

如果提供了string，或string数组，返回一个基于给定索引键或主键的where分句。返回的where分句可以用来声明如何从数据中取数据的方式。

如果提供了一个包含筛选条件的对象，返回一个Collection。如果提供一个筛选条件，keyPath需要是索引的键。如果提供多个筛选条件，推荐使用复合索引，如果没有复合索引，至少一个keyPath关联到一个简单索引。如果Dexie,debug=true，并且没有包含所有keyPath的复合索引，会使用console.warn打印警告信息。

```js
const friends = await db.friends.where("name").equalsIgnoreCase('david').toArray();
for(const friend of friends) {
  console.log(`Found ` + friend.name);
}
// 两个条件，需要复合索引。这种方式也是效率比较高的方式，因为用到了索引。
const davids = await db.friends.where(['name','age']).between(['Diavid',23],['Diavid',43],true ,true).toArray();
//
const david43 = await db.friends.where({name:'David',age:43}).first();
//和下面的方式等效
const david43 = await db.friends.get({name: 'David',age:43})
```

## db.transaction

```js
db.transaction(mode,tables,tx=>{
  // Transcation Scope
}).then(result=>{
  //Transcation Committed
}).catch(err=>{
  //Transaction Failed
})
```
mode: rw(read-write)，r(readonly)，rw!(开启独立事务)，rw?(和正在进行的事务不兼容才开启独立事务)，r!(开启独立只读事务)，r?(和正在进行的事务不兼容才开启独立只读事务)。

tables: Table实例或table-names，可以提供table数组。

callback：在transcation内执行的函数。

tx参数：transcation的实例。

### 复用父级事务

当进入一个嵌套的事务，Dexie首先检查当前进行中的事务是否和要创建的事务的兼容性。嵌套的事务的store-names需要在父事务中呈现，如果嵌套的是rw模式，父事务也需要是rw模式。

如果两个事务不兼容，默认的表现是嵌套的和父级的事务都会reject-promise。

如果你的代码想要独立的事务（同进行中的事务独立），你可以添加!或?到模式的结尾。

```js
db.transcation('rw!',db.Table,()=>{
  // 创建独立的事务
});
db.transcation('rw?',db.Table,()=>{
  // 如果兼容，使用已存在的事务，否则，创建独立的事务
})
```

!总是创建独立的顶层事务。

?兼容则使用正在进行中的事务，否则创建一个顶层事务。

### 使用!后缀的例子

设想：你有一个Logger组件，该组件是独立的，只和db和logentries table有关，Logger组件的使用者不需要关心底层实现。在这些场景下，推荐使用!后缀。

```js
class LoggerClass {
    log(msg) {
        return db.transaction('rw!', db.logger, function () {
            db.logger.add({ messgae: msg, date: new Date().getTime() });
        });
    }
}
const logger = new LoggerClass();
db.transaction('rw', db.friends, () => {
    logger.log(`Now adding hillary...`);
    return db.friends.add({ name: 'Liu', age: 32, tags: ['Boy'] }).then(() => {
        logger.log("Hillary was added!");
    });
}).then(() => {
    logger.log(`Transcation successfully commited!`);
});
```

由于logger组件需要独立工作，不关心是否有活跃的事务。

注意：这只是一个理论示例，在真实的场景中，建议使用专用的Dexie实例进行日志记录，而不是将其作为表。在这种情况下，你不必使用!后缀，因为只有logger组件才能知道数据库，永远不会有该数据库的持续事务。

### 嵌套事务的实现细节

嵌套事务在IndexedDB中没有现成的支持，Dexie通过在新的Dexie Transcation对象中重用IDBTranscation来模拟嵌套事务。嵌套事务将阻止对父事务执行的任何操作，直到嵌套事务提交。当没有更多的持续请求时，嵌套事务将提交。

嵌套事务的提交仅意味着事务Promise将resolve，并且主事务上任何挂起的操作都可以恢复。在提交后父事务中发生的错误仍将终止整个事务，包括嵌套事务。

### 并行事务

Dexie.currentTranscation是一个Promise-Local静态属性，它确保始终返回绑定到启动操作的事务范围的事务实例。

一旦你进入了一个事务，任何DB操作都将复用同一个事务。如果你想要再创建一个顶层的事务，可以使用!后缀或使用Dexie.ignoreTranscation()。

```js
db.transaction('rw', db.friends, () => {
  db.transaction('r!', db.pets, () => {
    //使用了!，并行事务
  });
  // Dexie.ignoreTranscation也可以创建并行的事务。
  Dexie.ignoreTransaction(() => {
    db.pets.toArray((res) => {
      console.log(res);
    })
  });
});
```

默认情况下，数据库操作是并行启动的，除非您等待上一个操作完成。

```js
function logCars() {
    return db.transaction('r', db.cars, () => {
        db.cars.where('brand').equals('Wu-Ling').each(car => {
            console.log(car);
        });
        db.cars.where('brand').equals('Jin-Bei').each(car => {
            console.log(car);
        });
    });
}
console.time('Into-Car');
db.transaction('rw', db.cars, () => {
    return db.cars.bulkAdd([{ brand: 'Wu-Ling' }, { brand: 'Jin-Bei' }]);
}).then(res => {
    console.timeEnd(`Into-Car`);
    logCars();
});
```

### Async和Await

Dexie支持原生的Async和Await，也支持TS编译的Async和Await。

```js
await db.transaction('rw',db.friends,async() => {
  let friendId = await db.friends.add({name: 'New Friend'});
  let petId = await db.pets.add({name: "New Pet", kind: "snake"})
})
```

## Dexie.on

### storagemutated

静态事件storagemutated是一个全局的底层事件，它会在写事务提交时触发。在同一个window，另一个window/Tab，web-worker，shared worker或service worker下，该事件都会触发。

开发者一般不需要关注该事件，本文档主要解释在IndexedDB中如何收到DB写入操作的通知。ObservabilitySet包含受影响的索引和主键。

该事件依赖于BroadcaseChannel API的支持。对于不支持的浏览器，需要自己添加message事件监听器来转发事件。

### populate

在db的生命周期中只触发一次，当db.open调用时DB不存在，object-store需要创建时。

当更新数据库时，populate事件不会被触发。populate事件在db.open成功提交之前执行，如果发生了异常，整个DB将不会创建，同时db.open会失败。

限制：当populate事件触发时，一个升级的事务正在执行。这意味着你不能调用任何异步APIS，否则升级事务会提交，DB会被创建。

如果你想通过ajax或其它异步请求的内容来创建DB，你需要使用ready事件。


### blocked

blocked在db升级被其它tab或window保持对DB的连接Block时触发。在该事件被触发之前，其它窗口会收到versionchange事件，只有其它窗口不关闭连接时，blocked事件才会触发。

默认情况下，Dexie会在接收到versionchange事件时，关闭数据库连接。如果其它窗口都使用Dexie，则一般不会出现block的情况。

```js
db.on('blcoked',()=>{
  alert(`Database upgrading was blocked by another window.Please close down any other tabs or windows that has this page open`)
})
```

## DBCore

DBCore是Dexie的中间件的一种实现方式，优于Hook API。这些是由于Hook API的原因：

1、它允许injector在方法转调中执行异步操作。

2、它允许injector在调用前和调用后执行操作。

3、它涵盖了更多的使用场景，例如创建事务时，允许自定义索引代理。

从Dexie 3.0开始，所有运行时的调用都通过DBCore来调用IndexedDB。Hooks API为了兼容Dexie2.0，也继续存在，但是Hook API的实现方式有所变化。内部通过DBCore的中间件实现。
并不是所有的代码都通过DBCore来调用IndexedDB，数据库升级处理，打开数据库等都是直接使用IndexedDB。

## Dexie.use 

```js
db.use({stack, name?, create});
// stack:string StackType,目前只支持，dbcore
// name string 中间件名称
// create:Function， 中间件，接受一个DBCore实例，应该返回一个修改的DBCore实例。
```

注意：你提供的create方法，接收一个DBCore，需要返回一个新的并且实现了DBCore接口的对象。

```js
db.use({
  stack: "dbcore", // The only stack supported so far.
  name: "MyMiddleware", // Optional name of your middleware
  create (downlevelDatabase) {
    // Return your own implementation of DBCore:
    return {
      // Copy default implementation.
      ...downlevelDatabase, 
      // Override table method
      table (tableName) {
        // Call default table method
        const downlevelTable = downlevelDatabase.table(tableName);
        // Derive your own table from it:
        return {
          // Copy default table implementation:
          ...downlevelTable,
          // Override the mutate method:
          mutate: req => {
            // Copy the request object
            const myRequest = {...req};
            // Do things before mutate, then
            // call downlevel mutate:
            return downlevelTable.mutate(myRequest).then(res => {
              // Do things after mutate
              const myResponse = {...res};
              // Then return your response:
              return myResponse;
            });
          }
        }
      }
    };
  }
});
```

本质上，所有的改变数据的操作都是面向批量的。bulkPut，bulkAdd，bulkDelete和deleteRange。目前这四个操作都通过mutate方法来实现。

```ts
export interface DBCore {
    stack: 'dbcore';
    //Transaction and Object Stores
    transcation(tables:string[], mode: 'readwritre'|'readonly'):DBCoreTranscation;
    //Utility methods
    cmp(a:any, b:any) : number;
    readonly MIN_KEY: any;
    readonly MAX_KEY: any;
    readonly schema: DBCoreSchema;
    table(name:string): DBCoreTable
}
//DBCoreTable
export interface DBCoreTable {
  readonly name: string;
  readonly schema: DBCoreTableSchema;

  mutate(req: DBCoreMutateRequest):Promise<DBCoreMutateResponse>;
  get(req:DBCoreGetRequest):Promise<any>;
  getMany(req:DBCoreGetManyRequest):Promise<any[]>;
  query(req:DBCoreOpenCursorRequest):Promise<DBCoreCursor|null>;
  count(req:DBCoreCountRequest):Promise<number>;
}
```



## 参考文档

https://dexie.org/docs/API-Reference#quick-reference

https://dexie.org/docs/Dexie/Dexie.transaction()#specify-reusage-of-parent-transaction