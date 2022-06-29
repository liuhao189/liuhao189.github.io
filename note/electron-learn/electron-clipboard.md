# Clipboard

在系统剪贴板上执行复制和粘贴操作。

进程：Main和Render。

在Linux上，还有一个selection粘贴板，想要操作该剪切板，你需要为每个函数传递selection参数。

```js
const { clipboard } = require('electron');
clipboard.writeText('Example String','selection');
console.log(clipboard.readText('selectron'));
```

## 方法

### readText

clipboard.readText([type])，type可选，可以是selection或clipboard（仅linux可用）。默认为clipboard。

返回string，剪贴板中的内容为纯文本。

### writeText(text[,type])

将text作为纯文本写入剪贴板。

### readHTML

readHTML([type])，返回string，剪贴板中作为标记的内容。

### writeHTML

writeHTML(markup[,type])，eg：writeHTML('<b>Hi</b>')

### readImage

readImage([type])，返回NativeImage。

### writeImage

writeImage(image[,type])，将NativeImage写入剪贴板。

### readRTF

readRtg([type])，返回RTF内容。

### writeRTF

writeRTF(text[,type])，写入RTF格式的text。


### readBookMark

MacOS && Windows可用，返回{title:string,url:string}，windows上title值永远为空。

### writeBookMark

MacOS && Windows可用，writeBookMark(title,url[,type])，windows上title值永远为空。

注意：windows上大多数应用程序不支持粘贴书签。

### readFindText & writeFindText

MacOS，操作查找剪贴板。

### clear

clear([type])，清除剪贴板内容。

### availableFormats
åå
availableFormats([type])，返回剪贴板支持的格式。

### has

has(format[,type])，剪贴板是否支持指定的format。

