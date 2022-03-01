# Electron-App

主要控制应用程序的生命周期。

## 事件

will-finish-launching，Windows和Linux中，与ready事件是相同的，MacOS中，这个事件相当于NSApplication的applicationWillFinishLaunching事件，大多数情况下，你需要在ready事件中处理所有事务。

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

child-process-gone(ev,details:{type:'utility'|'Zygote'|'Sandbox helper'|'GPU','Pepper Plugin'|'Pepper Plugin Broker'|'Unknown',reason:下列,exitCode:number,serviceName:string,name:string})

reason的枚举值：

clean-exit：以0为exitCode退出。

abnormal-exit：以非0退出进程。

killed：进程发送一个SIGTERM，否则是被外部杀死的。

crashed：进程崩溃。

oom：进程内存不足。

launch-failed：进程从未成功启动。

integrity-failure：窗口代码完整性检查失败。

name的含义：进程的名称，功能性示例：Audio Service，Content Decryption Module Servcie，Network Service，Video Capture。

子进程意外消失时触发，这种情况通常因为进程崩溃或被杀死，子进程不包括渲染器进程。

accessibility-support-changed(ev,accessibilitySupportEnabled)：Mac & Windows。

session-created(session)。

session-instance(ev,argv,workingDirectory)，当第二个实例被执行并且调用app.requestSingleInstanceLock时，这个事件在你的首个实例中触发。

argv是第二个实例的命令行参数的数组，workingDirectory是这个实例的当前工作目录。通常，应用程序会激活窗口并且取消最小化。

保证在app.ready事件发出后发出此事件。

desktop-capturer-get-source(ev,webContents)，在webContents的渲染器进程中调用deskopCapturer.getSources时触发，event.preventDefault将使它返回空的sources。

## 方法

app.quit，尝试关闭所有窗口，首先发出before-quit事件，如果所有窗口都成功关闭，将发出will-quit事件，并默认情况下应用程序将终止。

此方法会确保执行所有的beforeunload和unload事件处理程序，可以在beforeunload事件处理器返回false取消退出。

app.exit([exitCode])，使用exitCode立刻退出，所有窗口都将立刻关闭，before-quit和will-quit事件也不会被触发。

app.relaunch([options:{argv,execPath}])，当时实例退出，重启应用。注意：该方法在执行时不会退出当前的应用程序，需要在调用app.relaunch
后调用app.quit或者app.exit来让应用重启。

当 app.relaunch 被多次调用时,多个实例将在当前实例退出后启动。

app.isReady()。

app.whenReady():Promise<void>。

app.focus([options:{steal:MacOS}])，在 Linux 上，使第一个可见窗口获得焦点。 在 macOS上，将应用程序变成激活的app。 在 Windows上，使应用程序的第一个窗口获得焦点。

app.hide()，app.show()，仅MacOS。

app.setAppLogsPath(path?:日志存放的绝对路径)，设置或创建一个您的应用程序日志目录。然后可以通过app.getPath和app.setPath(pathName,newPath)进行操作。

调用app.setAppLogsPath没有指定path，在MacOS下会被设置为~/Library/Logs/YourAppName，在Linux和Windows下将被设置到userData目录中。

app.getAppPath()，返回应用程序所在目录。

app.getPath(name)，通过名称来获取路径。

name的枚举值：

home，用户的home主文件夹。

appData，每个用户的应用程序数据目录，Windows为%APPDATA%，Linux为$XDG_CONFIG_HOME或~/.config。

MacOS中为~/Library/Application Support目录。

userData，存储应用程序设置文件的文件夹，默认是appData文件夹附件应用的名称。

cache。

temp。

exe，当前的可执行文件。

module，libChromiumcontent库。

desktop，当前用户的桌面值。

documents，用户文档。

downloads，用户下载目录。

music，用户音乐目录。

pictures，用户图片目录。

videos，用户视频。

recent，最近文件的目录，仅Windows。

logs，应用程序的日志文件夹。

crashDumps，崩溃转储文件存储的目录。

如果app.getPaths('logs')调用之前没有先调用app.setAppLogsPath，将创建一个相当于调用app.setAppLogsPath却没有path参数的默认目录。

app.getFileIcon(path[,options:{size:'small'|'normal'|'large'}])，返回Promise<NativeImage>，完成后返回当前应用的图标。

读取文件的关联图标。Windows上会有两种图标：1、与某些文件扩展名相关联的图标，eg：.mp3,.png。2、文件本身就带图标，.exe，.dll和.ico。

在Linux和MacOS中，图标取决于和应用程序绑定的文件mime类型。

app.setPath(name,path)，重写name的路径为path。不存在的目录，会抛出Error。在这种情况下，目录应该以fs.mkdirSync或类似的方式创建。

默认情况下，网页的cookie和缓存将存储在userData目录下，如果要更改这个位置，你需要在app模块中的ready事件之前重写userData。

app.getVersion()，如果应用程序的package.json文件找不到版本号，返回当前包或可执行文件的版本。

app.getName()，应用程序的名称，package.json中的name。如果package.json存在productName字段，会优先返回该字段。