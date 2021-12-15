# IndexedDB 学习笔记

随着浏览器的功能不断增强，越来越多的网站开始考虑，将大量数据存储到客户端，以降低服务器压力和提高响应速度。

现有的浏览器的存储方案，都不适合存储大量数据。

1、Cookie的大小不超过4KB，且每次请求都发送会服务器。

2、LocalStorage在2.5MB到10MB之间，而且不提供搜索功能，不能建立自定义索引。

IndexedDB是浏览器提供的本地数据库，可以被网页创建和操作。IndexedDB允许存储大量数据，提供查找接口，还能创建索引。

就数据库类型而言，IndexedDB不属于关系型数据库，不支持SQL查询，更接近NoSQL数据库。

## IndexedDB特点

1、键值对存储。IndexedDB内部采用对象仓库存放数据。所有类型的数据都可以直接存入，包括JS对象。数据以键值对的形式保存，每一个数据记录都有对应的主键。

2、异步。IndexedDB操作时不会锁死浏览器，用户依然可以进行其它操作。这与LocalStorage形成对比。异步设计是为了防止大量数据的读写，拖慢网页的表现。

3、支持事务，IndexedDB支持事务，一系列操作中，只要有一步失败，整个事务就都被取消，数据库回滚到事务发生之前的状态。

4、同源限制，IndexedDB受到同源限制。

5、存储空间大，IndexedDB的存储空间比LocalStorage大得多，一般来说不少于250MB，甚至没有上限。

6、支持二进制存储。IndexedDB不仅可以存储字符串，还可以存储二进制数据(ArrayBuffer对象和Blob对象)。

## 基本概念

### 数据库

数据库是一系列相关数据的容器，每个域名可以新建任意多个数据库。IndexedDB数据库有版本的概念，同一时刻，只能有一个版本的数据库存在。如果要修改数据库结构，新增或删除表，索引或主键，只能通过升级数据库版本完成。

### 对象仓库

每个数据库包含若干个对象仓库，它类似于关系型数据库的表格。

### 数据记录

对象仓库保存的是数据记录，每条记录类似于关系型数据库的行，但是只有主键和数据体两部分。主键用来建立默认的索引，必须是不同的，否则会报错。主键可以是数据记录里的一个属性，也可以指定为一个递增的整数编号。

数据体可以是任意数据类型，不限于对象。

### 索引

为了加速数据的检索，可以在对象仓库里面，为不同的属性建立索引。

### 事务

数据记录的读写和删改，都要通过事务完成。事务对象提供error，abort和complete三个事件，用来监听操作结果。

## 操作流程

### 打开数据库

使用IndexedDB的第一步是打开数据库，使用indexedDB.open方法。

```js
let request = window.indexedDB.open(databaseName,version)
// 如果指定的数据库不存在，则创建，默认版本号为1
```

返回一个IDBRequest对象，这个对象通过三种事件error，success，upgradeneeed，处理打开数据库的操作结果。

```js
request.onerror = function (event) {
  console.log('数据库打开报错');
};
```

```js
var db;
request.onsuccess = function (event) {
  db = request.result;
  console.log('数据库打开成功');
};
```

```js
var db;
request.onupgradeneeded = function (event) {
  db = event.target.result;
}
```

### 新建数据库

新建数据库和打开数据库是同一个操作。如果指定的数据库不存在，就会新建。不同之处在于，后续的操作主要在upgradeneeded事件的监听函数里面完成。

新建数据库以后，第一件事就是新建对象仓库。

```js
request.onupgradeneeded = function (event) {
  db = event.target.result;
  var objectStore;
  if (!db.objectStoreNames.contains('person')) {
    objectStore = db.createObjectStore('person', { keyPath: 'id' });
  }
}
```

主键key是默认索引的属性。主键也可以指定为下一层对象的属性。eg：{foo:{bar:'baz'}}，foo.bar也可以指定为主键。

如果数据记录里面没有合适的作为主键的属性。可以让IndexedDB自动生成主键。

```js
var objectStore = db.createObjectStore(
  'person',
  { autoIncrement: true }
);
```

新建对象仓库以后，下一步可以新建索引。

```js
request.onupgradeneeded = function(event) {
  db = event.target.result;
  var objectStore = db.createObjectStore('person', { keyPath: 'id' });
  objectStore.createIndex('name', 'name', { unique: false });
  objectStore.createIndex('email', 'email', { unique: true });
}
```

### 新增数据

新增数据指的是向数据库对象仓库写入数据记录，这需要通过事务完成。

```js
function add() {
  var request = db.transaction(['person'], 'readwrite')
    .objectStore('person')
    .add({ id: 1, name: '张三', age: 24, email: 'zhangsan@example.com' });

  request.onsuccess = function (event) {
    console.log('数据写入成功');
  };

  request.onerror = function (event) {
    console.log('数据写入失败');
  }
}

add();
```

写入数据需要一个事务，新建时必须指定表格名称和操作模式('只读'或'读写')。新建事务后，通过IDBTransaction.objectStore(name)，拿到IDBObjectStore对象，再通过表格对象的add方法，向表格中写入一条记录。

写入是一个异步事件，通过监听连接对象的success事件和error事件，了解是否写入成功。

### 读取数据

读取数据也是通过事务完成。

```js
function read() {
   var transaction = db.transaction(['person']);
   var objectStore = transaction.objectStore('person');
   var request = objectStore.get(1);

   request.onerror = function(event) {
     console.log('事务失败');
   };

   request.onsuccess = function( event) {
      if (request.result) {
        console.log('Name: ' + request.result.name);
        console.log('Age: ' + request.result.age);
        console.log('Email: ' + request.result.email);
      } else {
        console.log('未获得数据记录');
      }
   };
}

read();
```

objectStore.get方法用于读取数据，参数是主键的值。

### 遍历数据

遍历数据表格中的所有记录，要使用指针对象IDBCursor。

```js
function readAll() {
  var objectStore = db.transaction('person').objectStore('person');

   objectStore.openCursor().onsuccess = function (event) {
     var cursor = event.target.result;

     if (cursor) {
       console.log('Id: ' + cursor.key);
       console.log('Name: ' + cursor.value.name);
       console.log('Age: ' + cursor.value.age);
       console.log('Email: ' + cursor.value.email);
       cursor.continue();
    } else {
      console.log('没有更多数据了！');
    }
  };
}

readAll();
```

openCursor方法是一个异步操作，所以需要监听success事件。

### 更新数据

更新数据使用IDBObject.put方法。

```js
function update() {
  var request = db.transaction(['person'], 'readwrite')
    .objectStore('person')
    .put({ id: 1, name: '李四', age: 35, email: 'lisi@example.com' });

  request.onsuccess = function (event) {
    console.log('数据更新成功');
  };

  request.onerror = function (event) {
    console.log('数据更新失败');
  }
}

update();
```

### 删除数据

删除数据使用IDBObejctStore.delete方法用于删除记录。

```js
function remove() {
  var request = db.transaction(['person'], 'readwrite')
    .objectStore('person')
    .delete(1);

  request.onsuccess = function (event) {
    console.log('数据删除成功');
  };
}

remove();
```

### 使用索引

索引的意义在于，可以让你搜索任意字段，也就是说从任意字段拿到数据记录。如果不建立索引，默认只能搜索主键。

如果，新建表格的时候，对name字段建立了索引，就可以从name中找到对应的数据记录了。

```js
objectStore.createIndex('name', 'name', { unique: false });

var transaction = db.transaction(['person'], 'readonly');
var store = transaction.objectStore('person');
var index = store.index('name');
var request = index.get('李四');

request.onsuccess = function (e) {
  var result = e.target.result;
  if (result) {
    // ...
  } else {
    // ...
  }
}
```

# MDN的补充

IndexedDB是一种让你在用户的浏览器内持久化存储数据的方法。IndexedDB为Web Application提供了丰富的查询能力，使得我们的应用在在线和离线时都可以正常工作。

IndexedDB的API被设计为尽可能地减少多错误处理的需求，所以你可能不会看到很多的错误事件。

## 错误处理

错误处理遵循冒泡机制，错误事件都是针对产生这些错误的请求的，然后事件冒泡到事务，然后最终到达数据库对象。

如果你希望避免为所有的请求都增加错误处理程序，你可以仅对数据库对象添加一个错误处理程序。

## 更新数据库版本

数据库会保留之前版本数据库的对象仓库，不必重建这些对象仓库。但是你需要创建新的对象仓库，或删除不再需要的对象仓库。如果你需要修改一个已存在的对象仓库，必须先删除原来的对象仓库，你需要在删除原对象仓库之前保存所有的信息。

## 构建数据库

IndexedDB使用对象仓库而不是表，并且一个单独的数据库可以包含任意数量的对象存储空间。每当一个值被存储进一个对象存储空间，它会被一个键相关联。

键的方式：

1、不使用KeyPath和AutoIncrement，这种对象存储空间可以持有任意类型的值，但是当增加一个新值得时候，必须提供一个单独的键参数。

2、使用keyPath，不使用键生成器(AutoIncrement)，只能持有JS对象，这些对象必须具有一个和key path同名的属性。

3、不使用keyPath，使用键生成器(AutoIncrement)，这种对象存储空间可以持有任意类型的值，键会为我们自动生成。或者使用一个单独的键参数。

4、使用KeyPath和键生成器(AutoIncrement)，这种对象只能持有JS对象，通常一个键被生成的同时，生成的键的值被存储在对象中的和keypath同名的属性中。如果属性存在，这个属性的值被用作键而不会生成一个新的键。


索引具有对存储的数据执行简单限制的能力。通过创建索引时候设置uniqe标记，索引可以确保不会有两个具有同样索引keyPath值的对象被存储。

键生成器生成的值从来不会减小，除非数据库操作结果被回滚。比如：数据库事务被中断。删除一条记录，甚至清空对象仓库里的所有记录都不会影响对象仓库的键生成器。

## 增加、读取和删除数据

需要开启一个事务才能对你创建的数据库进行操作。事务来自于数据库对象，你必须指定你想让这个事务跨越哪些对象仓库。事务提供了三种模式：1、readonly；2、readwrite；3、versionchange。

想要修改数据库模式或结构，包括新建或删除对象仓库或索引，只能在versionchange事务中才能实现。

可以通过使用合适的作用域和模式来加速数据库访问：

1、定义作用域时，只指定你用到的对象仓库。这样，你可以同时运行多个不包含互相重叠作用域的事务。

2、只在必要时指定readwrite事务。你可以同时执行多个readonly事务，哪怕它们的作用域有重叠。但对于在一个对象仓库上只能运行一个readwrite事务。

事务的生命周期：事务和事件循环的联系非常密切，如果你创建了一个事务但是没有使用它就返回给事件循环，那么事务将会失活。保持事务活跃的唯一方法就是在其上构建一个请求。

注意，如果事务成功了，你将有另外一个机会在回调中延长这个事务。如果你看到TRANSACTION_INACTIVE_ERR错误代码，那么你已经把某些事情搞乱了。

事务接收三种不同的DOM事件，error，abort和complete。error事件是冒泡机制，错误会中断它所处的事务，除非你第一时间调用了stopPropagation并执行了其它操作来处理错误，不然整个事务将会回滚。

在所有的事务完成后，事务的complete事件会被触发。如果你进行大量数据库操作，跟踪事务而不是具体的请求会使逻辑更加清晰。

### 读取值

简单的get方法，需要提供键来提取值。

### 使用游标

如果要遍历对象存储空间中的多个值，需要使用游标。openCursor函数需要几个参数，首先，你可以使用一个key range对象来限制被检索的项目的范围。第二，你可以指定希望进行迭代的方向。

游标本身是请求的result，如果想要继续前行，那么你必须调用游标上的continue()，当你达到数据的末尾时，result变为undefined。

查看游标的value属性会带来性能消耗，因为对象是被懒生成的。使用getAll，浏览器必须一次性创建所有的对象。如果想检索m键，游标要比getAll高效很多。当然如果你想获取一个由对象仓库中所有对象组成的数组，请使用getAll。

### 使用索引

索引如果使用get，总是会得到键值最小的那个。你可以在索引上打开两个不同类型的游标，一个常规游标(openCursor)映射索引属性到对象存储空间中的对象。一个键索引属性(openKeyCursor)被用来存储对象存储空间中的对象的键。

### 指定游标的范围和方向

如果你想要限定你在游标中看到的值的范围，你可以使用一个key range对象作为参数传给openCursor或openKeyCursor。

你可以构建一个只允许一个单一key的key range，或者一个具有下限或上限，或者一个既有上限又有下限。边界可以是闭合的，也可以是开放的。

```js
var singleKeyRange = IDBKeyRange.only("Donna");
// 包括Bill，大于Bill的所有值
var lowerBoundKeyRange = IDBKeyRange.lowerBound("Bill");
// 不包括Bill
var lowerBoundOpenKeyRange = IDBKeyRange.lowerBound("Bill", true);
// 不包括Donna
var upperBoundOpenKeyRange = IDBKeyRange.upperBound("Donna", true);
// 在Bill和Donna之间，不包括Donna
var boundKeyRange = IDBKeyRange.bound("Bill", "Donna", false, true);
```
有时候，你想要以倒序而不是正序来遍历，切换方向是通过传递prev到openCursor方法来实现的。

```js
objectStore.openCursor(boundKeyRange, "prev")
```

如果你只想改变遍历的方向，而不想对结果进行筛选，你只需要给第一个参数传入null。

```js
objectStore.openCursor(null, "prev")
```

如果你想要在游标在索引过程中过滤除重复的，你可以传入nextunique，或prevunique作为方向参数。

```js
index.openKeyCursor(null, IDBCursor.nextunique)
```

## 当一个webApp在另一个标签页中被打开时的版本变更

当你使用更高的版本号调用open方法时，其它所有打开的数据库必须显式地确认请求，你才能对数据库进行修改。

```js
openReq.onblocked = function(event) {
  // 如果其他的一些页签加载了该数据库，在我们继续之前需要关闭它们
  alert("请关闭其他由该站点打开的页签！");
};

function useDatabase(db) {
  // 当由其他页签请求了版本变更时，确认添加了一个会被通知的事件处理程序。
  // 这里允许其他页签来更新数据库，如果不这样做，版本升级将不会发生知道用户关闭了这些页签。
  db.onversionchange = function(event) {
    db.close();
    alert("A new version of this page is ready. Please reload or close this tab!");
  };
  // 处理数据库
}
```

## 浏览器关闭警告

浏览器关闭，或包含数据库的磁盘被意外移除，或数据库存储的权限丢失，将发生以下问题：

1、受影响的数据库的所有事务会以AbortError错误中断。该影响和在每个事务中调用IDBTransaction.abort相同。

2、所有的事务完成后，数据库连接就会关闭。

3、最终，表示数据库连接的IDBDatabse对象收到一个close事件，你可以使用IDBDatabase.onclose事件句柄俩监听这些事件。

在firefox50，google chrome 31发行版之前的浏览器，事务会静默中断，并且close事件不会触发。

你应该始终使数据库在事务结束时处于一个稳定的状态。eg：你执行一个清空数据，然后写入数据的操作。为了避免数据丢失，应该在同一个事务中执行清空数据和写入数据。

不应该把数据库事务绑定到卸载事件上。如果卸载事务由浏览器关闭所触发，卸载事件处理函数中的任何事务都不会完成。由于数据库事务是异步的，可能在它们执行之前就会被中断。

# IndexedDB的关键特性

1、IndexedDB存储key-value键值对。value可以是复杂的结构化对象，key可以是这个对象的属性。

2、IndexedDB基于事务数据库模型构建。所有在IndexedDB中的操作都发生在事务的上下文中。

3、IndexedDB的API主要是异步的。

4、IndexedDB使用了大量的Request。Request是接收成功或失败的DOM事件的对象。Request的result的值类型取决于Request的类型。可能是Cursor，可能是DB，可能是普通的对象。

5、IndexedDB使用DOM事件来通知你，结果已经可用。success事件不会冒泡，也不能取消。error事件是冒泡的，可被取消。

6、IndexedDB是面向对象的。IndexedDB不是有很多表的关系型数据库。IndexedDB创建对象仓库，然后持久化JS对象到对象仓库中。每一个对象仓库有一系列的索引让查询和遍历更有效率。

7、IndexedDB不使用SQL。

8、IndexedDB使用上遵循同源策略。

## 限制

IndexedDB不能覆盖的一些场景。

1、国际化地排序。并不是所有语言都遵循相同的排序规则。新版本的浏览器开始部分支持该功能。

2、同步调用。API没有为服务器端的数据库使用场景设计同步API。

3、全文搜索。API并没有提供like类的操作符。

## 浏览器清空数据的场景

1、用户请求清空特定网站的数据。

2、无痕模式，在会话结束后会被清空。

3、存储空间配额不够。

4、数据格式不正确。

5、浏览器的破坏性更新。

## 关键术语

### databse

包括多个Object Stores，每一个Database包含name和version。

databse连接，open database创建的，一个给定的database可以同时有多个连接。

### index

一个索引是一个为查找另一个对象仓库中的记录专用的对象仓库。索引是一个持久化的key-value存储。value的值是另一个对象仓库的key值。

当引用的对象仓库的数据被插入，更新或删除时候，浏览器去自动去维护索引对象仓库。

### object store

保存键值对记录，以key值升序存储。在database内name必须唯一，可以指定一个键生成器或keyPath。

### request

读写数据库操作返回的请求。

### transaction

在一个数据库上原子性的数据读取和数据修改操作。

一个database连接可以同时有多个活动中的事务，只要这些写事务没有重合的scope。

事务的生命应该是短暂的，浏览器为了释放存储资源，会停止耗时长的事务。

你可以调用事务的abort方法来手动放弃事务，这样数据会回滚。

### version

每一个数据库在某一时刻只能有一个版本，数据库不能多版本共存。

## key and value

### in-line key

keypath方式指定的key。也可以使用key生成器来生成，然后设置到对象的keypath属性上。

### key

用来组织和检索数据，key在object store中必须唯一。

key的类型可以是string，date，float，二进制blob，数组。

### key generator & key path

key generator：一种按顺序生成新值的机制。

key path：从哪个属性提取key。

### value

可以包括JS里面的几乎所有对象。包括boolean，number，string，date，object，array，regexp，undefined和null。Blobs和files也可以存储。

## Range & scope

### cursor

一种根据key界限遍历多条记录的机制。Cursor有数据源记录遍历的Index或Store，记录当前Range中的位置，记录移动方向的属性。

### key range



## 参考文档

http://www.ruanyifeng.com/blog/2018/07/indexeddb.html

https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB

https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Basic_Terminology