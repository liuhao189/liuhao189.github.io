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

userData，存储应用程序设置文件的文件夹，默认是appData文件夹应用的名称。

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

app.setName(name)。

app.getLocale()，使用Chromium的l10n_util库获取。如果要设置区域，需要在应用启动时使用命令行打开开关。

注意：打包应用程序时，必须指定locales文件夹。在Windows上，必须要等ready事件触发之后，才能调用该方法。

app.getLocaleCountryCode()，用户操作系统区域设置的双字母ISO-3166国家代码。该值取自本地操作系统API。

app.addRecentDocument(path)，MacOS & Windows，将此path添加到最近打开的文件列表中。此列表由操作系统管理。在Windows上，您可以从任务栏访问此列表。MacOS上，从Dock菜单访问。

app.clearRecentDocuments()，MacOS & Windows，清空最近打开的文档列表。

app.setAsDefaultProtocolClient(protocol,[,path,args])，将当前可执行文件设置为协议的默认处理程序。

参数说明：

protocol: 协议的名称，不包含://。

path，仅windows，Electron可执行文件的路径。

args，可选，仅Windows，传递给可执行文件的参数。

注意：在MacOS中，您只能注册添加到应用程序的info.plist中的协议，这个列表在运行时不能修改。一般在构建时写入。

在Windows Store环境下，必须在清单中声明协议。

app.removeAsDefaultProtocolClient(protocol[,path,args])。

app.getApplicationNameForProtocol(url):string，获得处理协议的应用程序名称，如果没有则返回空字符串。

注意：MacOS在~/Library/Preferences/com.apple.LaunchServices.plist中存储，Windows在注册表和LSCopyDefaultHandlerForURLScheme。

app.getApplicationInfoForProtocol(url):{icon,path,name}，仅Mac和Windows，返回应用程序信息。

app.setUserTasks(tasks)，仅Windows，添加tasks到Jump List的Tasks类别。任务栏扩展。

app.getJumpListSettings()，app.setJumpList()。

app.requestSingleInstanceLock()，此方法的返回值表示你的应用是否成功取得了锁。如果失败了，可以假设另一个应用程序已经取得了锁并仍在运行，你需要立即退出。并把参数发送给那个已经取得锁的进程。

MacOS中，当用户尝试在Finder中打开app的第二个实例，系统会通过发出open-file和open-url事件来强制执行单个实例，但是用户在命令行中启动应用程序时，系统的单实例机制会被绕过。

app.hasSingleInstanceLock()。

app.releaseSingleInstanceLock，释放requestSingleInstanceLock创建的锁。

app.setUserActivity(type[,userInfo][,webpageURL])，仅MacOS。

getCurrentActivityType，invalidateCurrentActivity，resignCurrentActivity，updateCurrentActivity。仅MacOS。

app.setAppUserModelId(id)，仅Windows，改变当前应用的Application User Model ID。

注意：Windows 7 及更高版本系统中任务栏广泛使用应用程序用户模型ID(AppUserModelIDs)，以将进程、文件和窗口与特定应用程序关联。在某些情况下，依赖系统分配给进程的内部    AppUserModelID就足够了。 但是，拥有多个进程的应用程序或在主机进程中运行的应用程序可能需要显式标识自身，以便它可以在单个任务栏按钮下将其他不同的窗口分组，并控制该应用程序跳转列表。

app.setActivationPolicy(policy:string)，仅MacOS。给定应用的激活策略。

app.importCertificate(options,callback)，仅Linux。

app.configureHostResolver(options)。

参数：

enableBuiltInResolver，内置解析器将尝试使用系统的DNS设置来进行DNS查询本身，MacOS默认开启，Windows系统和Linux些默认关闭。

secureDnsMode，配置 DNS-over-HTTP 模式。

secureDnsServers，一个 DNS-over-HTTP 服务器模板列表。

enableAdditionalDnsQueryTypes，控制着是否添加额外的 DNS 查询类型。

默认情况下，将按顺序排列：

1、DNS-over-HTTPS。

2、内置解析器。

3、getaddrinfo。

必须在app.ready事件触发后调用。

app.disableHardwareAcceleration，只能在ready之前调用。

app.disableDomainBlockingFor3DAPIs，默认情况下，如果GPU进程崩溃，Chromium会禁用3D API直到每个域上重新启动。只能在ready之前调用。

app.getAppMetrics()，包含所有与应用相关的进程的内存和CPU的使用统计的 ProcessMetric 对象的数组。

app.getGPUFeatureStatus()，此信息仅在gpu-info-update事件触发后才可用。

app.getGPUInfo(infoType:'basic'|'complete'):Primise<info>，返回GPU的版本和驱动程序信息。

app.setBadgeCount([count])，app.getBadgeCount()，仅MacOS和Linux，计数器角标。

app.isUnityRunning()，仅Linux，是否为Unity启动器。

app.getLoginItemSettings([options:{path,args}])，仅MacOS和Windows。

返回值：Object：{openAtLogin，openAsHidden(仅MacOS)，wasOpenedAtLogin(仅MacOS)，wasOpenedAsHidden(MacOS)，restoreState(MacOS)，
executableWillLaunchAtLogin(Windows)，launchItems(Windows)}。

app.setLoginItemSettings(settings)，仅MacOS和Windows。

settings:{
    openAtLogin,
    openAsHidden，(仅MacOS)，
    path，args，enabled，name（仅Windows），
}

如果需要在Windows上使用Squirrel的autoUpdater，你需要将启动路径设置为Update.exe，并传递指定应用程序的名称的参数。

app.isAccessibilitySupportEnabled()，仅MacOS和Windows。

app.setAccessibilitySupportEnabled(enabled)，仅MacOS和Windows。该API必须在ready事件触发后调用，渲染访问权限树可能会严重影响应用性能。

app.showAboutPanel()，显示应用程序的关于面板选项。

app.setAbountPanelOptions(options)。options:{applicationName,applicationVersion,copyright,version,credits,authors,website,iconPath}。

在MacOS上会覆盖.plist文件中定义的值。

isEmojiPanelSupported，showEmojiPanel(仅MacOS和Windows)。

startAccessingSecurityScopedResource(bookmarkData)，MacOS。

bookmarkData: {
    bookmarkData:base64编码的安全作用域的书签数据
}

返回Stop的Function，该函数必须在你完成访问安全作用域文件后调用一次。如果忘记停止访问书签，内核资源将会泄露，并且你的应用将失去完全到达沙盒之外的能力，直到应用重启。

app.enableSandbox，在应用程序上启用完全沙盒模式。 这意味着所有渲染器都将以沙盒的方式运行，无论WebPreence中sandbox标志的值是什么。只能在应用程序ready之前调用。

app.isInApplicationsFolder()，MacOS，应用程序当前是否从系统应用程序文件夹运行。

app.moveToApplicationsFolder([options])，MacOS。

options:{
    conflictHandler(conflictType:'exists'|'existedAndRunning')，移动失败处理器
}返回移动是否成功。移动成功，你的应用将退出并重新启动。

注意：如果并非是用户造成的操作失败，这个方法会抛出错误。处理器返回的boolean返回false将确保不采取进一步行动，返回true将导致默认行为同时方法继续执行。

app.isSecureKeyboardEntryEnabled，setSecureKeyboardEntryEnabled，MacOS。

通过使用此API，可以防止密码和其它敏感信息等重要信息被其它进程截获。

## 属性

accessibilitySupportEnabled，MacOS和Windows。

applicationMenu，用户可以传递Menu来给此属性赋值。

badgeCount，仅Linux和MacOS。

commandLine，只读，允许您读取和操作Chromium使用的命令行参数。

dock，只读，仅MacOS，对应用图标进行操作。

isPackaged，只读。

name。

userAgentFallback，全局回退的用户代理字符串。当用户代理在webContents 或 session 级别没有被设置时，将使用此用户代理。

runningUnderARM64Translation，仅MacOS和Windows，当前是否正在使用ARM64运行环境。

