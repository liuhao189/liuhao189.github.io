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

主键key是默认索引的属性。主键也可以指定诶下一层对象的属性。eg：{foo:{bar:'baz'}}，foo.bar也可以指定为主键。

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




## 参考文档

http://www.ruanyifeng.com/blog/2018/07/indexeddb.html