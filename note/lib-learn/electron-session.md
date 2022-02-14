# Electron-Session

管理浏览器会话、cookie、缓存、代理设置等。

session模块可用于创建新的session对象。也可以使用webContents的session属性或session模块访问现有页的session。

## 静态方法

session模块具有以下方法：

session.fromPartition(partition:string [,options: {cache:boolean}])，返回session实例。根据partition字符串产生的session实例。

当已存在一个Session具有相同的partition，它将被返回。否则一个新的Session实例根据options被创建。

如果partition以persist:开头，该页面将使用持续的session，并在所有页面生效，且使用同一个partition。

如果没有以persist:开头，页面将使用in-memory-session，如果没有设置partition，app将返回默认的session。

没有办法修改一个已存在的Session实例的options。

## 静态属性

defaultSession一个Session对象，该应用程序的默认session对象。

## Session类

Process:Main，获取和设置Session的属性，此类不从electron模块导出，它只能作为Electron API中其它方法的返回值。

## 参考文档

https://www.electronjs.org/zh/docs/latest/api/session