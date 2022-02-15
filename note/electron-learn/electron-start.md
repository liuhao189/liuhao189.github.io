# Electron-快速入门

## Electron是什么？

Electron是一个使用JS，HTML和CSS构建桌面应用程序的框架。嵌入Chromium和Node.js到二进制的Electron中，允许使用Web开发技术创建跨平台应用。

## Electron Fiddle运行实例

Electron Fiddle是由Electron开发并由其维护者支持的程序。建议将其作为一个学习工具来安装。可以在开发过程中对Electron的api进行实验或对特性进行原型化。

## 快速入门

### 环境要求

需要安装Node.js，推荐使用最新的LTS版本。

注意：Electron将Node.js嵌入到其二进制文件中，你应用运行时的Node.js版本与你系统中运行的Node.js版本无关。

### 创建应用

```bash
mkdir my-electron-app && cd my-electron-app
npm init
# 注意author与description可为任意值，应用打包时需要
npm  i electron --save-dev
```

然后添加start的脚本命令。

```js
scripts:{
    "start": "electron ."
}
```

### 运行主进程

任何Electron应用程序的入口都是main文件，这个文件控制了主进程，它运行在一个完整的Node.js环境，负责控制应用的生命周期，显示原生页面，执行特殊操作，管理渲染器进程。

首先，添加HTML文件。

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible"
            content="IE=edge">
        <meta name="viewport"
            content="width=device-width, initial-scale=1.0">
        <title>Electron Window</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <p>We are using Node.js <span id="nodeVersion"></span>，Chrpmium <span id="chromeVersion"></span> and electron
            <span id="electronVersion"></span></p>
    </body>
</html>
```
然后，创建main.js文件。

```js
const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    });
    win.loadFile('./index.html');
}

app.whenReady().then(() => {
    createWindow();
})
```

### 管理窗口的生命周期

虽然你现在可以打开一个浏览器窗口，但你需要一些额外的模板代码使其看起来更像是各平台原生的。一般而言，你可以使用进程全局的platform属性来专门为某些操作系统运行代码。

#### 关闭所有窗口时退出应用

在Windows和Linux上，关闭所有窗口通常会完全退出一个应用程序。在Mac上不会，所以需要特殊逻辑。

```js
app.on('window-all-closed', () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
})
```

#### 如果没有窗口则打开一个窗口

MacOS应用通常在没有打开任何窗口的情况下也继续运行，并且没有窗口可用的情况下激活应用时会打开新的窗口。

为了实现这一特性，需要监听app的activate事件，如果没有任何浏览器窗口是打开的，则调用createWindow方法。

因为窗口无法在ready事件前创建，你应当在你的应用初始化后仅监听activate事件。

```js
app.whenReady().then(() => {
    createWindow();
    //
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
})
```

#### 通过预加载脚本从渲染器访问Node.js

最后，要做的是输出Electron的版本号和它的依赖项到你的Web页面上。

在主进程通过Node的全局process对象访问这个信息是微不足道的。然而，不能直接在主进程中编辑DOM，因为它无法访问渲染器文档上下文。它们存在于完全不同的进程。

预加载脚本在渲染器进程加载之前加载，并有权限访问两个渲染器全局(window和document)和Node.js环境。

创建一个名为preload.js的新脚本如下：

```js
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) {
            element.innerText = text;
        }
    };

    for (const nameStr of ['node', 'chrome', 'electron']) {
        let id = nameStr + 'Version';
        replaceText(id, process.versions[nameStr]);
    }
});
```

要将此脚本附加到渲染器进程，需要在BrowserWindow构造器将预加载脚本传入webPerrerences.preload选项。

```js
const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, './preload.js')
    }
});
```

### 将功能添加到网页

由于渲染器运行在正常的Web环境中，因此您可以在index.html中添加任意script标签，来包括您想要的任何脚本。

```js
<script src="./renderer.js"></script>
```

renderer.js中包含的代码可以使用与典型前端开发相同的JS和工具。


# 参考文档

https://www.electronjs.org/zh/docs/latest/