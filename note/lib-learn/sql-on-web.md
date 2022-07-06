# SQL on Web

更新时间：2022-07-06

absurd-sql，它是Web上SQLite的持久化层。这篇文章主要解释Web存储API的荒谬之处，展示SQLLite如何提供10倍的性能改进，解释使其工作的很酷的技巧，并借宿其健壮的锁和事务的语义。

## IndexedDB

如果你现在开发一个Web-App，你很可能选择IndexedDB来存储数据，它是现在跨浏览器的，类DB存储的唯一选择。

如果你的Web-App数据多且复杂，你会很快发现这是一个糟糕的数据库。

1、首先，IndexedDB速度慢，而且Chrome浏览器的实现在主要的浏览器中表现最差。简单的操作需要10ms，而SqlLite只需要0.01ms。

2、如果要在IndexedDB中查询数据，比较繁琐。它提供的唯一函数是count，其余的API通过Range返回对象数组，你必须通过Index并以特定方式构建数据来构建自己的查询。

3、不能在任何时间点添加一个新的对象存储，只能在打开数据库时执行此操作，并且这样会强制其它选项卡终止其数据库连接。

4、可能IndexedDB提供低纬度API，你应该找一个库来提供更好的支持。但是这些库，会使得性能变得更糟。


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

有一个叫 Storage Foundation API的新提案，作者和提案的作者们联系了，作者在持续关注该提案的进展，目前该提案缺失了某些关键的东西，eg：锁。

未来性能可能会再提高1到2个数量级，当这种情况发生时，你只需要更换几行代码即可。



## 参考文档

https://jlongster.com/future-sql-web