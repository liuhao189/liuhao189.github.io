# Electron-BrowserWindow

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

24、paintWhenInitiallyHidden:boolean，当show为false并且渲染器刚刚被创建时，它是否应绘制。默认为true。

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

46、webPreferences：属性比较多。

47、webPreferences.devTools:boolean，是否开启DevTools，如果设置为false，则无法使用win.webContents.openDevTools打开DevTools，默认true。

48、webPreferences.nodeIntegration:boolean，是否启用node集成。默认false。

49、webPreferences.nodeIntegrationInWorker:boolean，是否在Web Worker中启用Node集成。默认false。

50、webPreferences.nodeIntegrationInSubFrames:boolean，是否允许子页面iframe或子窗口中集成Node，预加载的脚本会被注入到每一个iframe，可以使用process.isMainFrame来判断当前是否在主框架中。

51、webPreferences.preload:string，页面运行其它脚本之前预先加载指定的脚本，无论页面是否集成Node，此脚本都可以访问所有Node API。当Node integration关闭时，预加载的脚本将从全局范围重新引入node的全局引用标志。

52、webPreferences.sandbox:boolean，如果设置该参数，沙箱的渲染器将与窗口关联，使它与Chromium OS-level的沙箱兼容，并禁用Node.js引擎。且预加载的脚本的API也有限制。

53、webPreferences.session，设置页面的session，可以用partition选项来代替。同时设置了session和partition字符串，session的优先级更高。

54、webPreferences.partition，通过session的partition字符串来设置界面session。

55、webPreferences.zoomFactor:number，默认值1.0，页面的缩放系数。

56、webPreferences.javascript:boolean，是否启用JS，默认true。

57、webPreferences.webSecurity:boolean，设置false，禁用同源策略，默认为true。

58、allowRunningInsecureContent:boolean，默认false，允许一个https页面运行来自http url的JS，CSS或plugins。

59、images:boolean，是否允许记载图片，默认true。

60、imageAnimationPolicy:string，指定如何运行图像动画。可以是animate，animateOnce或noAnimation，默认值为animate。

61、textAreasAreResizable，默认true。

62、webgl:boolean，默认true，是否启用WebGL。

63、plugins:boolean，是否启用plugins，默认false。

64、experimentalFeatures，默认false。

65、scrollBounce，默认false，在macOS上启用弹力动画。

66、enableBlinkFeaturesString，逗号分隔的需要启用的特性列表。

67、disableBlinkFeatures，逗号分隔的需要禁用的特性列表。

68、defaultFontFamily:{standard:string,serif,sansSerif,monospace,cursive,fantasy}。

69、defaultFontSize，默认为16。

70、defaultMonospaceFontSize，默认为13。

71、minimumFontSize，默认为0。

72、defaultEncoding，默认为ISO-8859-1。

73、backgroundThrottling:boolean，是否页面不展示时限制动画和计时器。默认true。

74、offscreen，是否绘制和渲染可视区域外的窗口，默认值为false。

75、contextIsolation:boolean，默认true。是否在独立的JS环境中运行Electron API和指定的preload脚本。

预加载脚本所运行的上下文环境只能访问其自身专用的docuemnt和window属性，其自身一系列内置的JS对象。这写对于已加载的JS是不可见的。

Electron API只在预加载脚本中可用，在已加载脚本中不可用。该选项使用的是与Chrome内容脚本相同的技术。可以在devTools的Electron Isolated Context条目来访问这个上下文。

76、nativeWindowOpen，是否使用原生的window.open，默认true。

77、webviewTag，是否启用webview tag标签，默认false。注意，webview配置的preload脚本在执行时会启用nodeIntegration，应确保远程或不受信任的内容无法创建恶意的preload脚本。可以使用webContents上的will-attach-webview事件对preload脚本进行剥离，并验证和更改webview的初始设置。

注意，webviewTag不建议使用。

78、additionalArguments，当前应用程序的渲染器进程中process.argv的字符串列表。主要用于传递少部分数据到渲染器进程。

79、safeDialogs，是否启用浏览器样式的持续对话框保护，默认false。

80、safeDialogsMessage，安全对话框展示的消息。

81、disableDialogs，默认false。

82、navigateOnDragDrop，将文件或链接拖放到页面是否触发页面跳转，默认false。

83、autoplayPolicy，自动播放策略，值可以是no-user-gesture-required，user-gesture-required，document-user-activation-required。 默认是no-user-gesture-required。

84、disableHtmlFullscreenWindowResize:boolean，默认值false。

85、accessibleTitle，提供给屏幕阅读器等辅助工具的替代标题字符串，对用户不直接可见。

86、spellcheck，是否启用拼写检查器，默认true。

87、enableWebSQL，默认true，是否启用WebSQL api。

88、v8CacheOptions:string，强制blink使用V8代码缓存策略。

none，禁用代码缓存。

code，基于启发式代码缓存。

bypassHeatCheck，绕过启发式代码缓存，但使用懒编译。

bypassHeatCheckAndEagerCompile，编译是及时的，默认策略是code。

89、enablePreferredSizeMode，是否启用首选大小模式。首选大小是包含文档布局所需的最小大小，默认false。

90、titleBarOverlay:boolean|object，当使用无框窗口配置。默认为false。

当使用minWidth/maxWidth/minHeight/maxHeight设置最小或最大窗口时，它只限制用户，它不会阻止你将不符合大小限制的值传递给setBounds和setSize或BrowserWindow的构造函数。

type的选项与平台相关：

Linux上，可能为desktop，dock，toolbar，splash，notification。

MaxOS上，可能的类型为desktop，textured。

Windows上，可能的的类型为toolbar。

## 实例事件

注意：某些事件仅在特定的操作系统上可用，这些方法会被标记出来。

1、page-title-updated，(event,title,explicitSet)，调用event.preventDefault()将阻止更改标题。

2、close，(event)，在窗口要关闭的时候触发。它在DOM的beforeunload和unload事件之前触发。调用event.preventDefault将阻止这个操作。在beforeunload的事件处理函数中，返回undefined之外的任何值都将取消关闭。

3、closed，在窗口关闭时触发，应当移除相应窗口的引用对象，避免再次使用它。

4、session-end，因为强制关机，机器重启，会话注销而导致窗口会话结束时触发。只在Windows中有。

5、unresponsive，网页变得未响应时触发。

6、responsive，未响应的页面变成响应式时触发。

7、blur，窗口失去焦点。

8、focus，窗口得到焦点。初始化时会有该事件。

9、show，初始化时会有该事件。

10、hide。

11、ready-to-show，当页面已经渲染完成并且窗口可以被显示时触发。使用此事件，渲染器会认为是可见的绘制，即使show是false。如果使用paintWhenInitiallyHidden:false，此事件将永远不会被触发。

12、maximize，unmaximize，minimize，最大化最小化事件。

13、restore，从最小化状态恢复时触发。

14、will-resize，MacOS和Windows。(event,newBounds,details:{edge:string,bottom|left|right|....})，调整窗口大小前触发，调用event.preventDefault阻止窗口大小调整。仅在手动调整窗口大小时触发，通过setBounds和setSize调整窗口将不会触发此事件。

egde的值和平台有关：Windows平台可用8个角(bottom，top，left，right)，MacOS上可用值为bottom和right。

15、resize，MacOS和Windows，调整窗口大小后触发。

16、resized，MacOS和Windows，窗口完成调整大小后触发一次。通常在手动setBounds和setSize后调整窗口大小后触发。

17、will-move，MacOS和Windows，(event,newBounds)，窗口移动前触发，在Windows上，调用event.preventDefault将阻止窗口移动。

通过API setBounds/setSize调整窗口大小不会触发此事件。

18、move，窗口移动到新位置时触发。

19、moved，MacOS和Windows，MacOS上，是move的别名。

20、enter-full-screen，leave-full-screen。

21、enter-html-full-screen,leave-html-full-screen。

22、always-on-top-changed，(ev,isAlwaysOnTop)。

23、app-command，Windows和Linux，(ev,command)请求一个应用程序命令时触发，典型的是键盘上的媒体键或浏览器命令，以及在Windows上的一些鼠标内置的后退按钮。

命令是小写的，且APPCOMMAMD_将删除，下划线替换为连字符。例如：APPCOMMAND_BROWSER_BACKWARD将被browser-backward。

24、scroll-touch-begin，scroll-touch-end，scroll-touch-edge，只在MacOS上有。

25、swipe，(ev,direction)，MacOS，三指滑动时触发，可能的方向是up，right，down，left。主要为了处理旧的MacOS风格的触摸板滑动。

26、rotate-gesture，MacOS，手势旋转，(ev,rotation)，处理在触摸板上的旋转。

27、sheet-begin，sheet-end，MacOS，窗口打开和关闭sheet时触发。

28、new-window-for-tab，MacOS，点击了系统的新标签按钮时触发。

29、system-context-menu，Windows，(ev,point)，点击你窗口的非客户端区域时触发。非客户端区域指的是窗口标题栏或无边框窗口中被你声明为-webkit-app-region:drag的任意区域。调用event.preventDefault()将阻止菜单显示。

## 静态方法

getAllWindows，返回BrowserWindow[]，所有创建的窗口的数组。

getFocusedWindow，此应用程序中当前获得焦点的窗口，如果无就返回null。

fromWebContents，返回拥有给定webContents的窗口，否则如果内容不属于一个窗口，返回null。

fromBrowserView，拥有给定BrowserView的窗口，如果给定的视图没有附加到任何窗口，返回null。

fromId，带有给定id的窗口。

其实底层就维护了Windows数组，然后做筛选。

## 实例属性

win.webContents，只读，此窗口拥有的webContents对象，所有与网页相关的事件和操作都将通过它完成。

win.id，只读，一个Integer属性代表了窗口的唯一ID。

win.autoHideMenuBar，决定窗口菜单栏是否自动隐藏。

win.simpleFullScreen，决定窗口是否处于pre-lion全屏模式。

win.fullscreen，决定窗口是否处于全屏模式。

win.focusable，MacOS和Windows，是否可以被选中。

win.visibleOnAllWorkspaces，是否在所有工作区可见。Windows上始终返回false。

win.shadow，是否显示阴影。

win.menuBarVisible，Windows和Linux，决定菜单栏是否可见。

win.kiosk，是否处于kiosk模式。

win.documentEdited，MacOS，窗口文档是否已被编辑。

win.representedFileName，MacOS，用于确定窗口代表的文件的路径名，显示在窗口的标题栏中。

win.title，用于确定原生窗口的标题。

win.minimizable，是否可被用户手动最小化。Linux上，Setter不会进行任何操作。

win.maximizable，是否可被用户手动最大化。Linux上，Setter不会进行任何操作。

win.fullScreenable，是否可全屏。

win.resizable。

win.closable，Linux上，setter不会进行任何操作。

win.movable，Linux上不会进行任何操作。

win.excludedFromShownWindowsMenu，MacOS，是否从应用程序菜单排除。

win.accessibleTitle，屏幕阅读器等辅助设备提供的替代标题。

## 实例方法

1、destory，强制关闭窗口。除了closed之外，close，unload和beforeunload都不会触发。

2、close，与用户手动单击窗口的关闭按钮效果相同。网页可能会取消这个操作。

3、focus，聚焦于窗口。

4、blur，取消窗口的聚焦。

5、isFocused。

6、isDestroyed。

7、show，显示并聚焦窗口。

8、showInactive，显示并不聚焦于窗口。

9、hide。

10、isVisible。

11、isModal。

12、maximize，unmaximize，isMaximized，minimize，restore，isMinimized。

13、setFullScreen，isFullScreen，setSimpleFullScreen(MacOS)，isSimpleFullScreen(MacOS)。

14、isNormal，未最大化，未最小化，不在全屏模式下。

15、setAspectRatio(aspectRatio[, extraSize])，窗口保持长宽比，额外的大小允许开发人员有空间。

extraSize是额外的大小，类似于padding之类的。当使用win.setSize时，宽高比不会被采用。

16、setBackgroundColor。

17、previewFile(path[,displayName])，MacOS，使用QuickLook预览的文件的绝对路径，因为QuickLook使用了路径上的文件名和文件扩展名来决定要打开的文件的内容类型。displayName，展示的文件名称。

18、closeFilePreview，关闭当前的QuickLook面板。

19、setBounds(bounds[,animate])，animate仅MacOS支持。

20、getBounds，getBackgroundColor。

21、setContentBounds(bounds[,animate])，仅MacOS支持animate。

22、getContentBounds，getNormalBounds。

23、setEnabled，isEnabled，禁用或启用窗口。

24、setSize(width,height[,animate])，仅MacOS支持animate。如果不满足约束的尺寸，将对齐到约束的尺寸。

25、getSize。

26、setContentSize(width,height[,animate])，仅MacOS支持animate。

27、getContentSize。

28、setMinimumSize(width,height)，getMinimumSize。

29、setMaximumSize(width, height)，getMaximumSize。

30、setResizable，isResizable，setMovable:MacOS&Windows，isMovable:MacOS&Windows，setMinimizable:MacOS&Windows，isMinimizable:MacOS&Windows，setMaximizable:MacOS&Windows。

31、setFullScreenable，isFullScreenable,最大化按钮是切换全屏还是最大化窗口。

32、setClosable，isClosable，MacOS&Window，是否可以手动关闭窗口。

33、setAlwaysOnTop(flag[,level][,relativeLevel])。

flag:boolean；level，MacOS&Windows，值包括normal，floating，pop-off-menu，modal-panel，main-menu，status，pop-up-menu，screen-saver。

flag为true时，默认为floating，flag为false时，level默认为normal。从floating到status，会被放置于Dock和Windows任务栏下方，从pop-up-menu到更高级别，窗口显示在Dock上方或windows任务栏上方。

relativeLevel，MacOS，相对给定级别的层数。默认值为0，Apple不鼓励在屏幕保护程序之上设置高于1的级别。

34、isAlwaysOnTop。

35、moveAbove(mediaSourceId)，如果mediaSourceId不是window类型，或者如果窗口不存在，此方法会报错。

36、moveTop()，将窗口移至顶部。

37、center()，窗口移动到屏幕中央。

38、setPosition(x,y[,animate])，窗口移动到x和y。

39、getPosition。

40、setTitle。

41、getTitle。

42、setSheetOffset(offsetY[,offsetX])，MacOS可用。

43、flashFrame(flag:boolean)，启动或停止闪烁窗口，已吸引用户注意。

44、setSkipTaskBar(skip:boolean)，窗口不显示在任务栏中。

45、setKiosh(flag:boolean)。

46、isTabletMode()，Windows，是否处于Win10平板模式。

47、getMedisSourceId()，DesktopCapturerSource的id格式的窗口id。eg：window:1424:0。

48、getNativeWindowHandle，返回Buffer，Windows上未HWND，macOS为NSView*，Linux为Window(unsigned long)。

49、hookWindowMessage(message:int,callbacl:(wParam,lParam))，仅Windows，勾住窗口消息。

50、isWindowMessageHooked(message)，仅Windows。

51、unhookWindowMessage(message)，仅Windows。

52、unhookAllWindowMessages()，仅Windows。

53、setRepresentedFilename(fileName)，仅MacOS。

54、getRepresentedFilename，仅MacOS。

55、setDocumentEdited，isDocumentEdited，窗口文档是否可以编辑。设置为true则图标变成灰色。

56、focusOnWebView，blurWebView。

57、capturePage([rect])，捕获的区域，返回Promise<NativeImage>，完成后返回一个NativeImage。

58、loadURL(url[,options])，options:{httpReferrer,userAgent,extraHeaders，postData,baseUrlForDataURL}。

当页面加载完成(did-finish-load)后promise将resolve。如果页面加载失败(did-fail-load)，则reject。与WebContents.loadURL相同。

URL可以是远程地址，也可以是file:// 协议的本地HTML文件的路径。为了确保文件网址格式正确，建议使用Node的url.format方法。

59、loadFile(filePath,options?)，options:{query,search,hash}。filePath应该是与你的应用程序的根路径相关的HTML文件路径。

60、win.reload，同WebContents.reload。

61、win.setMenu，仅Windows和Linux。

62、win.hideMenu，仅Windows和Linux。

63、setProgressBar(progress,options?)，options仅Windows支持。

64、setOverlayIcon(overlay,desc)，仅Windows。右下角任务栏的显示图标。desc，提供给屏幕阅读器的描述文字。

65、setHasShadow，hasShadow。

66、setOpacity，getOpacity，仅MacOS和Windows。

67、setShape，实验性，仅Linux和Windows。

68、setThumbarButtons(buttons)，仅Windows，将指定的一组按钮添加到菜单栏的缩略工具栏。

69、setThumbnailClip，仅Windows，将窗口的区域设置为任务栏悬停在窗口上方时显示的缩略图像。

70、setThumbnailToolTip，仅Windows。

71、setAppDetails(options)，仅Windows。设置窗口任务栏按钮的属性。

options: appId，窗口的App User Model ID，必须设置；appIconPath；appIconIndex，relaunchCommand，relaunchDisplayName。

72、showDefinitionForSelection，仅MacOS，与WebContents.showDefinitionForSelection相同。

73、setIcon。仅Windows和Linux。

74、setWindowButtonVisibility，仅MacOS。

75、setAutoHideMenuBar，isMenuBarAutoHide。

76、setMenuBarVisibility，isMenuBarVisible，仅Windows和Linux。

77、setVisibleOnAllWorkspaces，isVisibleOnAllWorkspaces。

78、setIgnoreMouseEvents(ignore:boolean[,options:{forward:boolean}])，forward传递true，传递鼠标事件给Chromium，传递false，转发始终是禁用的。

忽略窗口内的所有鼠标事件。如果此窗口是focused，可以接收键盘事件。

79、setContentProtection，仅MacOS和Windows，防止窗口被其它应用捕捉。

在 macOS 上，它将 NSWindow 的 sharingType 设置为 NSWindowSharingNone。 在 Windows 上，它以参数为 WDA_EXCLUDEFROMCAPTURE 调用 SetWindowDisplayAffinity 。 对于 Windows 10 2004以上版，本窗口将完全从抓取中移除，在低版本 Windows 上其行为就像是 WDA_MONITOR 捕捉了黑色窗口。

80、setFocusable(focusable:boolean)，isFocusable，MacOS & Windows。

81、setParentWindow(parent:BrowserWindow|null)，getParentWindow()。

82、getChildWindows。

83、setAutoHideCursor，MacOS，输入时是否隐藏光标。

84、selectPreviousTab()，selectNextTab()，mergeAllWindows()，moveTabToNewWindow，toggleTabBar，MacOS，本地选项卡时，选择上一个选项卡。

85、addTabbedWindow，MacOS，该窗口添加到一个窗口作为选项卡，位于窗口实例的选项卡之后。

86、setVibrancy，MacOS，添加一个动态效果。

87、setTrafficLightPosition(position:Point)，getTrafficLightPosition，MacOS。

88、setTouchBar，MacOS。

89、setBrowserView，getBrowserView，addBrowserView，removeBrowserView，setTopBrowserView，getBrowserViews，实验性，将BrowserView附加到win，如果已经附加了其它BrowserView，那么它们将会被从窗口中移除。

BrowserView 相关的API目前为实验性质，可能会更改或删除。




