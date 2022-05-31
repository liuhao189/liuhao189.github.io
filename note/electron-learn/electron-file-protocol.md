# Electron应用关联特定文件格式

首先使用electron-builder的fileAssociations配置。

```bash
fileAssociations:
  ext:
    - eml
  name: 'eml'
  description: 'use app to open'
  role: 'Viewer'
  icon: 'build/eml'
```

然后监听app的open-file事件。open-file事件通常在应用已经打开，并且系统再次使用该应用打开文件时发出。

open-file也会在一个文件被拖到dock并且还没有运行的时候发出。请确认在应用启动的时候(甚至在ready事件发出前)就对open-file事件进行监听。

如果你想处理这个事件，你应该调用event.preventDefault()。


```ts
app.on('open-file', (ev,path) => {
  //如果你想要处理该事件，需要调用该方法
  ev.preventDefault();
  console.log(path)
});
```

在windows系统上，你需要自己解析process.argv来获取文件路径。

如果应用已打开，文件路径会在second-instance中argv的最后一个参数传递过来。

```ts
app.on('second-instance', (ev, argv, workingDirectory, additionalData) => {
  // argv ["C:\\Users\\xxx\\AppData\\Local\\Programs\\learn-electron\\learn-electron.exe","--allow-file-access-from-files","C:\\Users\\xxxx\\Desktop\\one.eml"]
  writeLog({ event: 'second-instance', argv, workingDirectory, additionalData });
});

app.whenReady().then(async () => {
  // ["C:\\Users\\xxx\\AppData\\Local\\Programs\\learn-electron\\learn-electron.exe","C:\\Users\\xxx\\Desktop\\one.eml"]
  writeLog({ windows: process.argv });
});
```

# Windows上的发送至

sendTo里的快捷方式一部分是存放到文件夹中的快捷方式。你可以在C:\Users\<yourusername>\AppData\Roaming\Microsoft\Windows\SendTo中发现sendTo的快捷方式。


![windows发送至文件夹](/note/assets/imgs/electron-file-assoc/Windows_sendTo_folder.webp)



## 参考文档

https://zhuanlan.zhihu.com/p/511443154

https://developer.apple.com/design/human-interface-guidelines/macos/extensions/share-extensions/

https://www.ghacks.net/2022/04/25/add-custom-context-menu-items-to-windows-11s-file-explorer-menu/

https://github.com/ikas-mc/ContextMenuForWindows11/wiki/%E5%B8%AE%E5%8A%A9