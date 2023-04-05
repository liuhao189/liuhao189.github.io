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