# Electron使用sqlite3

## 安装

```bash
npm i sqlite3
```

## 预编译二进制文件

sqlite3 v5使用Node-API重写，所以不用为特定的Node版本编译。sqlite3的编译产物可以在Node-API V3和Node-API V6上使用。

Node V10+的支持预构建的二进制文件，模块使用node-pre-gyp来下载当前平台支持的二进制包。如果你的环境找不到合适的二进制文件，会使用node-gyp来构建当前环境支持的二进制文件。

```js
import * as sqlite3 from 'sqlite3';
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run(`CREATE TABLE lorem (info text)`);
    console.time('Insert');
    const stmt = db.prepare("INSERT INTO lorem VALUES(?)");
    for (let i = 0; i < 10000; ++i) {
        stmt.run(`Ipsum ` + i);
    }
    stmt.finalize();
    console.timeEnd('Insert');

    console.time('Query')
    db.each("SELECT rowid AS id, info FROM lorem WHERE rowid=10", (err, row) => {
        console.log(row.id + ': ' + row.info);
        if (row.id === 10) {
            console.timeEnd('Query');
        }
    });
});
```

## API

### new sqlite3.DataBase

new sqlite3.Database(filename[,mode][,callback])返回一个数据库对象并自动打开数据库，没有其它的方法可以打开数据库。

filename：":memory:"会生成匿名的内存数据库；空字符串会产生匿名的硬盘数据库，匿名的数据库在关闭数据库时，会丢失内容。

mode：可选，sqllite3.OPEN_READONLY，sqlite3.OPEN_READWRITE，sqlite3.OPEN_CREATE，sqlite3.OPEN_FULLMUTEX，sqllite3.OPEN_URI，sqlite3.OPEN_SHAREDCACHE，sqlite3.OPEN_PRIVATECACHE。默认值的为OPEN_READWRITE|OPEN_CREATE|OPEN_FULLMUTEX。

callback：可选，提供了，当DB打开成功或失败时，都会调用该回调方法。

打开成功时候，会触发open事件，打开失败时，会触发error事件。


