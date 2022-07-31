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

![write-perf](/note/assets/imgs/absurd-sql/writes-perf.png)

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

虽然这好像结果非常有前途，但原生的SQLLite的性能比它快1一个数量级或2个数量级。

如果你读取了一堆数据，当前的性能表现不足以支撑真实应用，但是有一种简单的方法来修复它，使用SQLite缓存。

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

## 怎么工作的

有一些技巧可以获得这种性能表现。

如果SQLLite进行一堆顺序读取，它应该打开一个游标并循环访问数据。它不应该为每次读取打开一个新事务。

另一个目标是保持尽可能小的状态。我们在需要时直接从SQLLite文件中读取，并利用IndexedDB的事务语义进行锁定。我们存储的唯一状态是文件的大小。

## 最大的问题，同步API

最大的问题是，SQLLite执行读或写时，API都是同步的。但是访问IndexedDB总是异步的。

我们创建了一个worker线程，然后给它一个SharedArrayBuffer，然后使用Atomics API来和buffer沟通。eg：先向sharedBuffer中写入读数据请求信息，worker读取读数据请求，然后将结果写回去。

真实的魔法是Atomics.wait接口，当你调用它，它会完全阻塞JS直到条件满足。你可以将其用于等待SharedArrayBuffer中某些数据，这可以将async的读写转为同步的读写。主线程调用它来等待worker线程的读取结果。

## 长生命周期的IndexedDB事务

IndexedDB有一个可怕的行为，一旦事件循环完成处理，它就会自动提交事务。创建事务非常慢，这非常影响性能。Atomics.wait很厉害，我们使用它来阻塞worker进程，这会保持事务可用。

## 使用Cursor遍历

我们可以检测何时发生顺序读取并打开游标，这有一些权衡，因为在某些浏览器上，打开游标非常慢，但游标中迭代数据比get请求快很多。我们会智能检测何时发生多个顺序读取，并自动切换到使用游标。

## 文件锁定和事务

这可能是最重要的事，因为如果没有，你的数据库会损坏，对于损坏的数据库，性能无关紧要。

### 原子提交

首先需要了解SQLLite所做的假设，我们需要100%满足这些假设，否则数据库会有损坏的风险。

作者对源代码进行了大量研究，以了解要求：

1、SQLLite使用日志并进行两次写入，第一次在日志中写入，然后写入普通文件。

2、在你写入数据时，你无法避免诸如断电之类的事情。因为SQLLite进行两次读写，它总是至少有一个文件处于正确状态。如果db文件已部分写入，则它具有热日志，只需重新应用该日志即可。如果日记是部分写的，它只是忽略它。这可实现原子提交，全部或什么也没有。

3、这一切取决于fsync正常工作，调用fsync后，它假定所有写入都已成功写入磁盘。

我们必须满足的第一个要求是提供一个原子方式清除写入缓存的fsync方法。因为我们使用IndexedDB，我们不用担心该问题。IndexedDB提供了事务。我们甚至不需要日志文件，我们可以配置journal_mode=OFF，但是ROLLBACK需要日志文件。

所以我们可以配置journal_mode=MEMORY，这会将日志保存在内存中，这比写硬盘快很多。

### 文件锁

SQLLite使用咨询锁来协调数据库连接。

这非常重要，我们需要以SQLLite期望的方式锁定数据，否则连接可能会相互覆盖。尽管我们依赖于IndexedDB事务，但这并不意味着它们的顺序正确。

IndexedDB只读事务可以并行运行，而读写事务一次只能运行一个。

唯一的问题是，另一个线程可能在我们请求读写锁和获取它之间写下了数据。SQLLite已经为我们提供了这些信息，一旦我们获得了一个读写事务，我们可以从文件中读取一些字节，这些字节代表SQLLite的更改计数器。如果该计数器与我们请求写入时的计数器相同，则写入是安全的。

## 不带SharedArrayBuffer的Fallback模式

除了safari，大多数较新的浏览器都支持SharedArrayBuffer。为了支持不支持SharedArrayBuffer的浏览器，作者提供了fallback-mode。

此模式下，它会在一开始就将所有数据读取，所以可以同步读取数据。写入困难一些，它会假设所有写入都成功。

较大的问题是，如果数据库写入不成功，整个数据库状态都会是错的。

最终结果是，如果您在safari中打开了两个选项卡，则只有其中的一个可以实际执行写入。如果它们都尝试这样做，则其中一个将检测到抹一些内容已从其下方更改，并且永远不会写入数据库。它将继续在内存中工作，当你刷新时，更改将丢失。

发生这种情况时，应该应通知用户，以便他们不会丢失数据。

## 参考文档

https://jlongster.com/future-sql-web