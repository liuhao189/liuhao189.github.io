# BrowserWindow

进程：主进程。创建并控制浏览器窗口。

## 自定义窗口

BrowserWindow类暴露了各种方法来修改应用窗口的外观和行为。详细信息，请参考[自定义窗口](https://www.electronjs.org/zh/docs/latest/tutorial/window-customization)。

## 优雅地显示窗口

每次加载页面都是直接展示，用户突然就看到了，这体验很不好。可以用以下两种解决方案。

### 使用ready-to-show事件

在加载页面时，渲染进程第一次完成绘制时，窗口没有被显示，渲染进程会发出ready-to-show事件。

```js
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    show: false
  });

  win.once('ready-to-show', () => {
    win.show();
  })
```

这个事件通常在did-finish-load事件之后发出，但是页面有许多远程资源时，它可能会在did-finish-load之前发出事件。

注意：此事件意味着渲染器会被认为是可见的并绘制，即使show是false。如果您使用paintWhenInitiallyHidden:false，此事件将不会触发。

### 设置backgroundColor属性

对于一个复杂的应用，ready-to-show可能发出的太晚，会让应用感觉缓慢。这种情况下，可以设置背景色。

```js
const { BrowserWindow } = require('electron')
const win = new BrowserWindow({ backgroundColor: '#2e2c29' })
win.loadURL('https://github.com')
```

## 父子窗口

通过使用parent选项，你可以创建子窗口。child窗口总是显示在top窗口顶部。

```js
const { BrowserWindow } = require('electron')
const top = new BrowserWindow()
const child = new BrowserWindow({ parent: top })
child.show()
top.show()
```