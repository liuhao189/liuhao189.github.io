# Dexie复杂查询的算法

## WhereClause.anyOf

```js
table.where(indexOrPrimKey).anyof(array) 
table.where(indexOrPrimKey).anyOf(key1,key2,keyN,...)
```

## 参数

indexOrPrimKey:string，索引名或主键名。
array：要查找的key的数组。
key1，key2，keyN：要查找的key。

## 返回

返回Collection。

## 实现细节

这个方法是在标准indexedDB-API之上的扩展，详细的实现方式在这篇文章有介绍。https://www.codeproject.com/Articles/744986/How-to-do-some-magic-with-indexedDB


# 如何使用IndexedDB来做一些复杂查询

## 介绍

使用原生的IndexedDB的API，可以执行不区分大小写的搜索，逻辑OR操作，键数组匹配等。本文主要介绍indexedDB一些隐藏的功能。我在写Dexie.js时，发现了IDBCursor的一些隐藏能力。我将这些算法称为Dexie算法，本文将揭示它们是如何工作的。

## 背景

IndexedDB是您在浏览器中需要本地存储大量数据使用的最合适的API。

### IndexedDB的优点

IndexedDB是一个NOSQL的数据库，支持事务，读写锁和索引。它的事务支持使其可以在所有Web场景中使用。例如页面重新加载，打开多个Tab。

Tables称为Object Stores，包含JS对象而不是记录。在Object-Store中你可以添加JS对象，区别于SQL的是，你不必事先声明Table的列名称及其属性。如果你想要通过非主键列搜索对象，你需要设置该列为索引。

由于它简化了索引API，浏览器厂商可以从头开始实现它。事务，数据库版本和初始化是IndexedDB令人印象最深刻的地方，它经过深思熟虑和设计。

### IndexedDB的限制

相比SQL数据库，有很多限制，比如：没有外键，没有存储过程，没有视图等。但是最重要的限制是查询的支持少。

IndexedDB原生只支持：

1、IDBKeyRange.only，全匹配，大小写敏感。
2、IDBKeyRange.bound，找到range范围内的所有数据。
3、IDBKeyRange.upperBound，找到比给定key小的所有数据。
4、IDBKeyRange.lowerBound，找到比给定key大的所有数据。

无法做到以下的查询方式：
1、大小写敏感的搜索。
2、类似SQL IN ('a','b','c','d')的搜索。
3、查询包含字符子串的数据，类似SQL LIKE。
4、逻辑上的OR 和 AND。

## 如何实现 any of([a,b,c])

遍历IndexedDB的Object-Store中的所有数据，可以调用IDBObjectStore或IDBIndex实例上的openCursor方法。

```js
let transcation = db.transcation(['friends']);
let index = trans.objectSTore("friends").index("name");
let cursorReq = index.openCursor();

cursorReq.onsuccess = function(e) {
    let cursor = e.target.result;
    if(cursor) {
        console.log(JSON.stringify(cursor.value));
        cursor.continue();    
    } else {
        // 遍历完成 
    }
}
```

cursor.continue可以指定要前进到的下一个键的值。如果调用下面的代码

```js
cursor.continue('David');
```

下一次onsuccess时cursor会指向David的记录。该API要求游标必须以索引相同的排列顺序定位在等于或大于指定键的第一条记录上。

所以如果我们想找到姓名在['David'，'Daniel'，'Zlatan']中的所有人，我们首先需要sort该数组为['Daniel'，David'，'Zlatan']。然后做：

1、call  cursor.continue('Daniel')
2、onsuccess，检查cursor.key=='Daniel'，如果是，将cursor.value包含到结果中，调用cursor.continue()。
3、call cursor.continue('David')
4、....
5、call cursor.continue('Zlatan')
6、onsuccess，如果cursor.key=='Zlatan'，包含cursor.value到结果中，并调用cursor.continue。如果不等于Zlatan，我们可以结束遍历并返回了。

```js
function equalsAnyOf(keysToFind, onfound, onfinish) {
    let set = keysToFind.sort();
    let i = 0;
    let cursorReq = index.openCursor();
    cursorReq.onsuccess = function(ev) {
        let cursor = ev.target.result;
        if(!cursor) { onfinish();return;}
        let key = cursor.key;
        while(key > set[i]) {
            ++i;
            if(i===set.length){
                onfinish();
                return;            
            }        
        }
        if(key === set[i]) {
            onfound(cursor.value);
            cursor.continue();        
        } else {
           cursor.continue(set[i]);                    
        }                            
    }
}
```

## 大小写不敏感的搜索实现

大小写不敏感的搜索是很多人期望数据库支持的功能。Dexie.js使用与IDBCursor.continue(key)的类似方式来实现该功能。

如果我们想在friends表中查找大小写不敏感的david。最简单的方式是，创建一个包含所有大小写可能的david的数组，让使用上述SQL IN的方式查找即可。组合的数量会随着正在查找的值的长度指数级增长。这里有一个技巧，由于cursor.continue将按排列顺序落在下一条记录上。这可以揭示当落在不匹配的键上时，我们可以跳过哪些组合。

具体的算法：先找到可能的最小的'David'的值，应该是DAVID(大写的在前面)。如果DB中没有'DAVID'，首先检查我们找到的值，然后从该值中，得出下一个要搜索的DAVId变体。

```js
function findIgnoreCaseAlgorithm(needle, onfound, onfinish) {
    let upperNeedle = needle.toUpperCase();
    let lowerNeedle = needle.toLowerCase();
    let cursorReq = index.openCursor();
    cursorReq.onsuccess=(event)=> {
        let cursor = event.target.result;
        if(!cursor) {
            // no more data
            onfinish();
            return;
        }

        let key = cursor.key;
        if(typeof(key) !== 'string') {
            cursor.continue();
            return;
        }

        let lowerKey = key.toLowerCase();
        if(lowerKey === lowerNeedle) {
            onfound(cursor.value);
            cursor.continue();
        } else {
            let nextNeedle = nextCasing(key, lowerKey, upperNeedle, lowerNeedle);
            if(nextNeedle) {
                cursor.continue(nextNeedle)
            } else {
                onfinish();
            }
        }
    }
}
```

## 以X开头的字符串的搜索

```js
db.friends.where('name').startsWithIgnoreCase('da')
```

和上面大小写不敏搜索的实现方式类似，只是将if(lowerKey===lowerNeedle){...}改为if(lowerKey.indexOf(lowerNeedle)===0){...}。

## 逻辑OR的实现方式

IndexedDB可以实现并行的查询，我们可以并行发起多个查询，只有一件事需要关注，那就是数据去重。

```js
db.friends.where('name').equalsIgnoreCase('david').or('shoeSize').above(40).toArray(fn);
```

```js
function logical_or(index1, keyRange1, index2, keyRange2, onfound, onfinish) {
    let cursorReq1 = index1.openCursor(keyRange1);
    let cursorReq2 = index2.openCursor(keyRange2);
    assert(index1.objectStore===index2.objectStore);

    let primKey = index1.objectSTore.keyPath;
    let set = {};
    let resolved = 0;

    function complete() {
        if(++resolved ===2) onfinish();
    }

    function union(item) {
        let key = JSON.stringify(item[primKey]);
        if(!set.hasOwnPerperty(key)) {
            set[key] = true;
            onfound(item);
        }
    }

    cursorReq1.onsuccess = (ev) => {
        let cursor = event.target.result;
        if (cursor) {
            union(cursor.value);
        } else {
            complete();
        }
    }

     cursorReq2.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            union(cursor.value);
        } else {
            complete();
        }
    }
}
```

当使用并行的OR操作时，结果的顺序可能不符合要求，需要在返回前sort一下结果数组。


## 逻辑AND

逻辑AND可以通过IndexedDB的复合索引来实现。

```js
store.createIndex('nameAndShoeSize',['name','shoeSize']);
```

在IndexedDB中并没有任何技巧来模拟逻辑AND，只能使用JS filter方法。只要你选择地第一个过滤器可以过滤掉大多数数据，性能表现也没那么差。

```js
db.friends.where('name').equalsIgnoreCase('david').and(function(friend){ return friend.shoeSize > 40 }).
    .toArray((res)=> {
        console.log(res);
    });
```




## 参考文档

https://www.codeproject.com/Articles/744986/How-to-do-some-magic-with-indexedDB