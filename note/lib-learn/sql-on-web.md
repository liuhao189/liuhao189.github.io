# SQL on Web

更新时间：2022-07-07

absurd-sql，它是Web上SQLite的持久化层。这篇文章主要解释Web存储API的荒谬之处，展示SQLLite如何提供10倍的性能改进，解释使其工作的很酷的技巧，并解释其健壮的锁和事务的实现。

## IndexedDB

如果你现在开发一个Web-App，你很可能选择IndexedDB来存储数据，它是现在跨浏览器的，类DB存储的唯一选择。

如果你的Web-App数据多且复杂，你会很快发现这是一个糟糕的数据库。

1、首先，IndexedDB速度慢，而且Chrome浏览器的实现在主要的浏览器中表现最差。简单的操作需要10ms，而SqlLite只需要0.01ms。

2、如果要在IndexedDB中查询数据，比较繁琐。它提供的唯一函数是count，其余的API通过Range返回对象数组，你必须通过Index并以特定方式构建数据来构建自己的查询。

3、不能在任何时间点添加一个新的对象存储，只能在打开数据库时执行此操作，并且这样会强制其它选项卡终止其数据库连接。

4、可能IndexedDB提供低维度API，你应该找一个库来提供更好的支持。但是这些库，会使得性能变得更糟。

## absurd-sql

SQL是构建应用的好方法，特别对于小型本地应用。absurd-sql是sql.js的持久化层的类库，允许SQLLite从IndexedDB中读取和写入数据。

absurd-sql的方案很滑稽。因为除了Chrome，IndexedDB都是用SQLLite实现的。

sql.js是一个可以在web上使用SQLLite的类库，它将SQLLite编译为WebAssembly。最大的问题是，你不能持久化任何数据，它会将这个数据库加载到DB中，然后只改变内存中的值。

absurd-sql解决了这个问题，它主要通过拦截SQLLite的读写请求，将这些请求转到读取和写入IndexedDB。作者编写了完整的文件系统层，它知道SQLLite如何读取和写入块，并且能够有效地正确执行操作。

使用sql.js是因为sql.js已经有一个很大的社区，sql.js也是目前最常见的在web上使用SQL的方式。

```js
//
import initSqlJs from '@jlongster/sql.js';
import { SQLiteFS } from 'absurd-sql';
import IndexedDBBackend from 'absurd-sql/dist/indexeddb-backend';
SQL = await initSqlJs();
sqlFS = new SQLLiteFS(SQL.FS, new IndexedDBBackend());
SQL.register_for_idb(sqlFS);
SQL.FS.mkdir('/sql');
SQL.FS.mount(sqlFS,{},'/sql')
let db = new SQL.Database('/sql/db.sqlite',{filename: true});
//
let stmt = db.prepare('INSERT INTO kv (key, value) VALUES (?, ?)');
stmt.run(['item-id-00001', 35725.29]);

let stmt = db.prepare('SELECT SUM(value) FROM kv');
stmt.step();
console.log(stmt.getAsObject());
```

## 不仅仅是另一个数据库

IndexedDB的问题是满足了两个需求：数据库和持久化。使用sql.js + absurd-sql，我们抽象出了存储层。下面会介绍absurd-sql比IndexedDB快多少，不要误会，我们距离原生的SQLLite性能还差很远。大概比原生慢50-100倍，因为我们无法执行快速数据写入，尽管慢50-100倍，一般的用户需求都可以满足。

IndexedDB只是absurd-sql的一个持久化层，作者也实现了webkitFileSystem持久化层，但目前还达不到IndexedDB的同等表现。

有一个叫 Storage Foundation API的新提案，作者和该提案的作者们联系了，作者在持续关注该提案的进展，目前该提案缺失了某些关键的东西，eg：锁。

未来性能可能会再提高1到2个数量级，当这种情况发生时，你只需要更换几行代码即可。

## 权衡

SQLite，即使在IndexedDB之上实现的，可以轻松在每一个性能维度击败IndexedDB。下面展示具体的性能测试。

### 读取速度

SELECT SUM(*) FROM kv，强制db读取表的所有数据。

![read-perf](/note/assets/imgs/absurd-sql/read-perf.png)


### 写入速度

INSERT INTO kv (key, value) VALUES ("large-uuid-string-0001", 53234.22)，使用bulk put。

![write-perf](/note/assets/imgs/absurd-sql/write-perf.png)

我设想的是100万条数据，absurd-sql可以处理它，写入需要4-6s，读取需要2-3s。而IndexedDB写入需要2-3分，读取需要1分左右。

IndexedDB随着数据量的增多，性能衰减不是线性的。


## 有什么收获

我们为此付出了什么代价？有一个缺点：你需要下载1MB(gzip后409KB)的WebAssembly文件，这是唯一的代价。

除了性能之外，你还获得了下述功能：

1、事务。

2、完整的查询系统。

3、视图。

4、通用的数据表表达式。

5、触发器。

6、全文搜索等。

## 如何实现的

当一件事看起来令人难以置信得好时，我喜欢坐下来仔细研究来确保我是否错过了什么。

原因是IndexedDB速度太慢。批量读取和批量写入能提供很大的性能提升。

## 速度不够快？加缓存

虽然这好像诶结果非常有前途，但原生的SQLLite的性能比它快1一个数量级或2个数量级。

如果你读取了一堆数据，当前的性能表现不足以支持真实应用，但是有一种简单的方法来修复它，使用SQLite缓存。

SQLLite自动使用2MB的页缓存，它会缓存每个读请求，写请求时会清空相应的读请求的缓存。真实的应用中很多读请求，很少写请求，这套机制工作得很好。

如果你需要处理大量数据，可以将缓存增加到10MB。增大页体积也可以减少读取操作。

## Page Size

打开demo网页，打开DevTools，你可以看到IndexedDB的数据。

![idb-data](/note/assets/imgs/absurd-sql/idb-data.png)

它之所以存储4096字节的数据，是因为SQLLite的默认页大小是4096。页大小越小，越需要更多的读取操作。

如果将页大小改到8192字节，可以减少读取的次数，这应该会进一步增加性能。

```js
let stmt = db.prepare(`
  PRAGMA page_size=8192;
  VACUUM;
`);
```

必须使用VACUUM使之生效。SQLLite会重新调整整个数据库的存储。absurd-sql也会自动改变IndexedDB的内容(改到8192)。



## 参考文档

https://jlongster.com/future-sql-web