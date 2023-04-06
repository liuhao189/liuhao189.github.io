# sqlite3 npm包

## 安装

```bash
npm i sqllite3
```

## 功能

1、简单的查询和参数绑定接口。

2、完整的缓冲区/二进制支持。

3、额外的调试插件支持。

4、查询序列化接口。

5、支持插件。

6、大量的测试。

7、使用现代C++编写，针对内存泄露进行过专项测试。

8、底层使用SQLite V3.4.1，你也可以使用本地的SQLite。

## 提前编译的二进制文件

sqlite3 v5+使用Node-API重写，所以不用针对Node的版本进行编译。sqlite3目前针对Node-API V3和V6进行了编译。提前编译的二进制应该支持Node v10+的版本。

模块使用node-pre-gyp来下载预编译的二进制包，如果目标二进制包存在，将从Github Releases下载。

eg：napi-v6-darwin-unknown-arm64

目前，node-pre-gyp不能区分armv6和armv7，这些arch统一会被使用为arm，您可能还需要从源代码安装sqlite3。

如果你的当前环境没有预编译的二进制包，您需要使用node-gyp来编译sqlite3，为此您需要安装C++编译器和链接器。


```js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE lorem (info TEXT)");

    const stmt = db.prepare("INSERT INTO lorem VALUES (?)");

    for (let i = 0; i < 100; ++i) {
        stmt.run("Ipsum " + i);
    }

    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
        console.log(row.id + ": " + row.info)
    })
})
```

## API文档

new sqlite3.Database(filename[,mode] [,callback]);

返回一个数据库对象，并自动打开数据库。

filename，:memory:会使用一个匿名的内存数据库，空字符串会打开一个匿名的硬盘数据库。匿名的DB不会持久化，当数据库关闭时，它们的内容会消息。

mode，可选，一个或多个的模式。sqlite3.OPEN_READONLY，sqlite3.OPEN_READWRITE，sqlite3.OPEN_CREATE，sqlite3.OPEN_FULLMUTEX，sqlite3.OPEN_URI，sqlite3_OPENSHAREDCACHE，sqlite3.OPEN_PRIVATECACHE。默认为为OPEN_READWRITE| OPEN_CREATE | OPEN_FULLMUTEX。

callback，可选，db打开成功时或打开失败时会调用该方法。第一个参数是err，为null则成功。如果没有callback参数，db对象的error事件会触发，打开成功open事件会触发。


### Database实例方法

close([callback])，没有callback参数，出错会触发error事件，成功会触发open事件。

configure(option, value), trace，提供一个函数回调，当SQL语句执行时被调用；profile，提供一个函数调用，可以打印执行每条SQL语句的时间。busyTimeout，设置一个超时时间。

目前看可以使用trace和profile的事件来达到上面的功能。

```js
db.on('trace', (sql) => {
    console.log(`running sql ${sql}.`);
});
db.on('profile', (sql, time) => { 
    console.log(`runing sql ${sql} time is ${time}`);
});
```


