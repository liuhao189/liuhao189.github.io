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

19、skipTaskbar，是否在任务栏中显示窗口，默认为false。

20、kiosk，窗口书否进入kiosk模式，默认为false。

21、title，默认窗口标题，默认为Electron，如果由loadURL加载的HTML文件含有标签title，此属性将忽略。

22、icon，NativeImage|String，在windows上推荐使用ico图标来获得最佳的视觉效果。

23、show，窗口是否在创建时展示。

24、paintWhenInitiallyHidden:boolean，当show为false并且渲染器刚刚被创建时，它是否应激活。默认为true。

25、frame，boolean，设置为false时创建一个无边框窗口，默认为true。

26、parent，指定父窗口，默认值为null。

27、modal，默认false。

28、acceptFirstMouse，单击非活动窗口是否同时触发点击进入里面的网页内容，macOS上为false。

29、disableAutoHideCursor，默认false，打字时隐藏光标。

30、autoHideMenuBar，默认false，自动隐藏菜单栏。除非按Alt键。

31、enableLargerThanScreen，默认false，仅适用于MacOS，因为其它操作系统默认允许大于屏幕的窗口。

32、backgroundColor，十六进制值，#66CD00，设置transparent为true方可支持alpha属性。

33、hasShadow，默认为true，窗口是否有阴影。

34、opacity，设置窗口初始的不透明度，目前仅支持window和macos。

35、darkTheme，强制窗口使用深色模式。默认为false。只在部分GTL+3桌面环境有效。

36、transparent，默认为false。

37、type:string，默认为普通窗口，更多类型见下文。

38、visualEffectSize:string，指定外观应如何反映macOS上的窗口活动状态，必须与vibrance属性一起使用。

允许的值：followWindow，窗口处于激活状态时，后台应自动显示为激活状态。反之亦然。默认为该值。

active，后台应一直显示为激活状态。

inactive，后台应一直显示为未激活状态。

39、titleBarStyle，可选值macOS或Windows，默认为default，分别返回macos和windows的标准标题栏。

hidden，maxos窗口将一直拥有左上角标准控制器。windows上，与titleBarOverlay:true一起使用时，它将激活窗口空间叠加。否则不会显示窗口控件。

hiddenInset，隐藏标题栏，显示小的控制按钮在窗口边缘。

customButtonOnHover，仅在macOS上，才会出现隐藏的标题栏和全尺寸的内容窗口，当在窗口左上角hover时，显示小的控制按钮。

40、trafficLightPosition，控制按钮在无边框窗口中的位置。

41、roundedCorners，默认true，无框窗口在MacOS上是否圆角。

42、thickFrame，对windows上的无框窗口使用WS_THICKFRAME样式，会增加标准窗口框架。默认true，设置为false移除窗口的阴影和动画。

43、vibrancy，动态效果，仅macOS有效。

44、zoomToPageWidth，，默认false，控制macOS上，为true，窗口放大到页面的宽度，为false，放大到屏幕的宽度。

45、tabbingIdentifier，macOS的 10.12+上可使窗口在原生选项卡中打开，具有相同标识符的窗口将组合在一起。还会在窗口的标签栏中添加一个新选项卡按钮，允许app和窗口接收new-window-for-tab事件。

46、webPreferences