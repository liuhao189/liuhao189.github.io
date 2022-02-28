# Electron-App

主要控制应用程序的生命周期。

## 事件

will-finish-launching，Windows和Linux中，与ready事件是相同的，MacOS中，这个事件相当于NSApplication的applicationWillFinishLaunching提示。大多数情况下，你需要在ready事件中处理所有事务。

ready(ev,launchInfo)，在MacOS中，launchInfo中有NSUserNotification的userInfo，或者UNNotificationResponse的信息。

window-all-closed，所有的窗口都关闭时触发。如果没有监听所有窗口，默认的行为是退出程序，但如果你监听了此事件，可以控制是否退出。

如果用户按下Cmd+Q，或调用app.quit，Electron会关闭所有窗口然后触发will-quit事件，在这种情况下window-all-closed事件不会被触发。

before-quit，在程序关闭窗口前发信号。调用event.preventDefault阻止终止应用程序的默认行为。

如果由autoUpdater.quitAndInstall退出应用程序，那么在所有窗口触发closed之后才会触发before-quit并关闭所有窗口。

在windows上，因系统关机，重启或用户注销而关闭，这个事件不会触发。

will-quit，所有窗口关闭后触发，同时应用程序将退出。调用event.preventDefault将阻止终止应用程序的默认行为。

quit(event,exitCode)，应用程序退出时发出。注：在Windows中，因系统关机，重启或用户注销而关闭，那么这个事件不会被触发。

open-file(ev,path)，MacOS，用户想要在应用中打开一个文件时发出。应用已打开，并且系统再次使用应用打开文件时发出。也会在一个文件被拖到dock并且还没有运行的时候发出。

如果你想处理这个事件，应该调用event.preventDefault()。

Windows中需要解析process.argv来获取文件路径。

open-url(ev,url)，MacOS，当用户想要在应用中打开一个 URL 时发出。

activate(ev,hasVisibleWindows:boolean)，MacOS，应用被激活时发出。各种操作都可以触发此事件, 例如首次启动应用程序、尝试在应用程序已运行时或单击应用程序的坞站或任务栏图标时重新激活它。

did-groupe-active，continue-activity，will-continue-activity，continue-activity-error，activity-was-continued，update-activity-state，MacOS。

new-window-for-tab，MacOS，用户点击原生的macOS新标签按钮时触发。

browser-window-blur，browser-window-focus，(ev,window)。

browser-window-created(ev,window)，web-contents-created(ev,webContents)。

certificate-error(ev,webContents,url,error,cert,callback:(isTrusted:boolean),isMainFrame)，对url的证书验证失败的时候发出。需要信任，需要调用event.preventDefault并且调用callback(true)。

select-client-certificate(ev,webContents,url,certList,callback(cert))，当一个客户证书被请求的时候发出，需要调用event.preventDefault来阻止系统默认使用第一个证书。

login(ev,webContents,authInfo:{url:string},authInfo:{isProxy,scheme,host,port,realm},callback:(username,password))，当 webContents 要进行基本身份验证时触发。默认行为是取消所有身份验证。

gpu-info-update(ev)，GPU信息更新时触发。

render-process-gone(ev,webContents,details:{reason:'clean-exit'|'abnormal-exit'|'killed'|'crashed'|'oom'|'launch-failed'|'integraity-failure',exitCode})，渲染器进程意外消失时触发，这种情况通常因为进程崩溃或被杀死。

