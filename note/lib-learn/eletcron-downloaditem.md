# DownloadItem类

控制远程资源的文件下载。

Process:Main。此类不从electron模块导出，它只能作为Electron API中其它方法的返回值。

DownloadItem是一个EventEmitter事件触发器，在Electron中代表一个下载项。它用于will-download事件以及Session类，并且允许用户控制下载项目。

## 实例事件

事件名：'updated'，回调参数：(event,state:'progressing'-进行中|'interruped'-已中断，可以恢复)。

当下载正在执行但还没完成的时候发出。

事件名：'done'，回调参数(event,state:'completed'|'cancelled'-使用cancel方法取消下载|'interrupted'-下载已经中断，无法恢复)。

## 实例方法

setSavePath(path)，该API仅能在will-download方法的回调中使用。如果path不存在，Electron将尝试递归创建目录。如果不设置，Electron将弹出保存对话框。

getSavePath()，下载项保存路径。

setSaveDialogOptions(options)，设置保存文件对话框选项。这个对象与dialog.showDialog的options参数有相同属性。仅在will-download方法回调中使用。

pause，暂停下载。

isPaused，是否已暂停下载。

resume，继续下载，注意：为了支持断点续传，必须要从支持范围请求的服务器下载，并且提供Last-Modified和ETag的头部值，否则resume将重新下载。

canResume，下载是否可以恢复。

cancel，取消下载操作。

getURL，下载项的源URL。

getMimeType，MIME类型的文件。

hasUserGesture，是否具有用户手势。

getFileName，下载项目的文件名。注意：如果用户在提示的下载保存对话框中更改文件名称，保存的文件的实际名称将会不同。

getTotalBytes，下载项目的总大小(以字节为单位)，大小未知，则返回0。

getReceivedBytes，下载项目的接收字节。

getContentDisposition，响应头中的Content-Disposition字段。

getState，progressing | completed | cancelled | interrupted。

getURLChain，项目的完整URL链，包括任何重定向。

getLastModifiedTime，返回Last-ModifiedTime。

getETag，返回ETag的值。

getStartTime，自下载开始时的UNIX以来的秒数。

## 实例属性

savePath，决定了下载项的保存文件路径。仅在will-download回调函数中可用。

## 参考文档

https://www.electronjs.org/zh/docs/latest/api/download-item