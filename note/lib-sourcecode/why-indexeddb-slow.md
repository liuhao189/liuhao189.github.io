# 为什么IndexedDB这么慢

现代Web存储的几种类型：

1、Cookie，每个HTTP请求都会发送，不能存储大量数据。

2、WebSQL，已过期，没有标准化过，将之设为标准很困难。

3、LocalStorage，同步API，存取数据会阻塞主线程，所以不能存取大量数据。

4、FileSystem-API，可以存放二进制文件，但目前只支持Chrome。

5、IndexedDB是一个支持索引的key-object的数据库。被广泛支持且稳定。

如果要存取大量数据，你只能选择IndexedDB。随着你的应用越来越复杂，数据越来越多，你会发现IndexedDB很慢，甚至比便宜服务器上的数据库更慢。

插入几百个documents需要若干秒，即使通过服务器接口也要比这个快得多。

## 事务和吞吐量

在抱怨之前，我们需要搞明白什么比较慢。在一些测试中，插入1000个文档到IndexedDB需要80ms，这速度并不慢。这个速度的关键点是这些文档在一个单一的事务中写入。

我改变了测试中的代码，每个文档写入都使用单独的事务，这需要2s。我把每个文档的大小变为100倍时，它仍然在相近的时间内完成。

这说明了限制IndexedDB性能的是事务处理，而不是数据量大小。

![single-transcation](/note/assets/imgs/indexeddb-so-slow/single-transaction.png)

为了提高你的IndexedDB的性能，你需要使用尽可能少的数据流转和事务。某些情况下，这很简单，使用批量写入方法即可。但其它情况下，可能很难控制。例如：页面需要响应用户的交互，另一个tab写入数据。这些事情都可能随机发生，你不能收集到所有数据，然后批量写入。

注意：Chrome的官方开发说（https://bugs.chromium.org/p/chromium/issues/detail?id=1025456#c15），他们会优化IndexedDB的读性能，而不是写入性能。

切换到WebSQL也不是一个好主意，因为WebSQL有更慢的事务。

## 批量Cursor

IndexedDB 2.0引入了getAll方法来提高性能。

我们想查询age大于25的人。Object-Store中需要创建[age,id]的索引。id的索引是必须的，因为age是不唯一的，我们需要一种方式来记录最后一批返回的数据的位置。

```js
myIndexedDBObjectStore.createIndex('age-index',['age','id']);
```

```js
const maxAge = 100;
let result = [];
const tx:IDBTranscation = db.transcation([storeName], 'readonly', TRANSCATION_SETRINGS);
const store = tx.objectStore(storeName);
const index = store.index('age-index');
let lastDoc;
let done = false;
while(done===false) {
    await new Promise((resolve,reject)=>{
        const range = IDBKeyRange.bound(
            [
                lastDoc ? lastDoc.age: -Infinity,
                lastDoc ? lastDoc.id : -Infinity
            ],
            [
                maxAge + 0.0000001,
                String.fromCharCode(65535)
            ],
            true,
            false
        );

        const openCursorRequest = index.getAll(range,bactchSize);
        openCursorRequest.onerror = err => reject(err);
        openCursorRequest.onsuccess = e => {
            const subResult = e.target.result;
            if(subResult.length === 0) {
                done = true;
            }else {
                result = result.concact(subResult);
            }
            resolve();
        }
    })
}

return result;
```

![batched-cursor](/note/assets/imgs/indexeddb-so-slow/batched-cursor.png);

## IndexedDB分片

数据库分库分表一般用于服务器的数据库。将数据分片到多个IndexedDB的stores，在只增加一些启动时间的情况下，可以大幅提高读写性能。

![part-db](/note/assets/imgs/indexeddb-so-slow/part-indexeddb.png);

测试结果显示，分区应该只在IDBObjectStore而不是Database上。

缺点是，获取10K个数据时间比不分片的慢，组合各个分片的数据到需要的查询也需要耗费时间。

## 自定义索引

索引可以显著得提高IndexedDB的查询性能。例子：如果想要查询大于25岁的文档，你需要创建age+id的索引。id的索引是为了批量游标获取数据。

为了提高性能，你可以创建一个自定义索引。ageIdCustomIndex。

```js
const idMaxLen = 20;
docData.ageIdCustomIndex = docData.age + docData.id.padStart(idMaxLeng,'');
store.put(docData);
```

![custom-index](/note/assets/imgs/indexeddb-so-slow/custom-index.png);

测试发现，使用自定义所以可以提高10%左右的性能。

## Relaxed持久化

在创建事务时，基于Chrommium的浏览器允许设置durability为relaxed。这个在存在大量小事务时，性能会有所不少提高，在一些大事务时，性能提升不明显。

## 事务的commit

通过主动提交事务，另一个小的性能可以提高。

```js
if(transaction.commit) {
    transaction.commit();
}
```
提升很小，但可以观测得到。

## 在IndexedDB之上构建内存层缓存

将所有的数据加载到内存中，所有的读写请求都发生在内存中，可以将性能提高100倍。只有在写入发送时，内存数据才写入到IndexedDB，在这种情况下，IndexedDB被用作文件，而不是数据库。

有一些类库实现了这个功能：1、LokiJS；2、Absurd-SQL；3、SQL.js；4、DuckDB Wasm。

### 内存缓存层的持久化

内存层的缺点是你没有直接使用IndexedDB，数据并不是每时每刻都保存的。

第一个点是尽快持久化，LokiJS有一个增量保存的逻辑。

另外一个点是在正确的时间点持久化，RxDB LokiJS存储在下列时间点持久化：1、当DB空闲时，也就是没有写入请求和查询请求时。2、当window触发beforeunload事件时。

### 内存缓存层的多Tab支持

理想的方案是使用SharedWorker。如果浏览器不支持SharedWorker，可以使用BroadcaseChannel API来跨Tab通信，并选举一个Tab为Leader。





## 参考文档

https://rxdb.info/slow-indexeddb.html