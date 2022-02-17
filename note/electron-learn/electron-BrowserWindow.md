# BrowserWindow

进程：主进程。创建并控制浏览器窗口。

## 自定义窗口

BrowserWindow类暴露了各种方法来修改应用窗口的外观和行为。详细信息，请参考[自定义窗口](https://www.electronjs.org/zh/docs/latest/tutorial/window-customization)。

## 优雅地显示窗口

每次加载页面都是直接展示，用户突然就看到了，这体验很不好。可以用以下两种解决方案。

### 使用ready-to-show事件

在加载页面时，渲染进程第一次完成绘制时，如果窗口没有被显示，渲染进程会发出ready-to-show事件。

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

## 模态窗口

模态窗口是禁用父窗口的子窗口，创建模态窗口必须设置parent和modal选项。

```js
const { BrowserWindow } = require('electron')

const child = new BrowserWindow({ parent: top, modal: true, show: false })
child.loadURL('https://github.com')
child.once('ready-to-show', () => {
  child.show()
})
```

## 页面可见性

在所有平台上，可见性状态与窗口是否隐藏和最小化相关。

在macOS上，可见性状态还会跟踪窗口的遮挡状态，如果窗口被另一个窗口完全遮挡了，可见性为hidden。其它平台，只有win.hide()使窗口最小化或隐藏时才为hidden。

创建BrowserWindow时带有show:false的参数，最初的可见性状态将为visible，尽管窗口实际上是隐藏的。

如果backgroundThrottling被禁用，可见性状态将保持visible即使窗口被最小化，遮挡或隐藏。

推荐您在可见性状态为hidden时暂停消耗资源的操作以便减少电力消耗。

## 平台相关的提示

在macOS上，modal窗口将显示为附加到父窗口的工作表。

在macOS上，子窗口将保持与父窗口的相对位置，而在Windows或linux中，当父窗口移动时子窗口不会移动。

在Linux上，模态窗口的类型更改为dialog。

在Linux上，许多桌面环境不支持隐藏模态窗口。

## BrowserWindow类

创建并控制浏览器窗口，进程为主进程。BrowserWindow是一个EventEmitter。

new BrowserWindow(options)

options:

1、width，窗口的宽度，以像素为单位，默认800。

2、height，窗口的高度，以像素为单位，默认600。

3、x，相对于屏幕左侧的偏移量，默认窗口居中。

4、y，相对于屏幕顶端的偏移量，默认窗口居中。

注意：x,y需要成对出现才会起作用。

5、useContentSize:boolean，默认为false，width和height将设置为Web页面的尺寸(不包含边框)。

6、center:boolean，是否在屏幕居中。

7、minHeight，minWidth，窗口的最小高度。默认0。

8、maxWidth，maxHeight，默认不限。

9、resizeable:boolean，默认true。

10、movable:boolean，默认true，Linux上未实现。

11、minimizable，默认true，Linux上未实现。

12、maximizable，默认为true，Linux上未实现。

13、closable，默认true，Linux上未实现。

14、focusable，默认true，窗口是否可以聚焦，Windows中设置false意味着skipTaskbar:true，Liunx中设置false时窗口停止与vm交互，并且窗口将始终置顶。

15、alwaysOnTop，默认为false。

16、fullscreen，macOS上明确设置为false时将隐藏全屏按钮。

17、fullscreenable，窗口是否可以进入全屏状态，macOS上，最大化和全屏按钮是否可用。默认值为true。

18、simpleFullscreen，默认false，macOS上使用pre-Lion全屏。