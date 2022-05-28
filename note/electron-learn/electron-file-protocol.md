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

如果你想处理这个事件，你应该调用event.preventDefault()。在windows系统上，你需要自己解析process.argv来获取文件路径。

```ts
app.on('open-file', (ev,path) => {
  //如果你想要处理该事件，需要调用该方法
  ev.preventDefault();
  console.log(path)
});
```



## 参考文档

https://zhuanlan.zhihu.com/p/511443154