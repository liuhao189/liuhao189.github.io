# Clipboard && contentTracing

在系统剪贴板上执行复制和粘贴操作。

进程：Main和Render。

在Linux上，还有一个selection粘贴板，想要操作该剪切板，你需要为每个函数传递selection参数。

```js
const { clipboard } = require('electron');
clipboard.writeText('Example String','selection');
console.log(clipboard.readText('selectron'));
```

## 方法

### readText

clipboard.readText([type])，type可选，可以是selection或clipboard（仅linux可用）。默认为clipboard。

返回string，剪贴板中的内容为纯文本。

### writeText(text[,type])

将text作为纯文本写入剪贴板。

### readHTML

readHTML([type])，返回string，剪贴板中作为标记的内容。

### writeHTML

writeHTML(markup[,type])，eg：writeHTML('<b>Hi</b>')

### readImage

readImage([type])，返回NativeImage。

### writeImage

writeImage(image[,type])，将NativeImage写入剪贴板。

### readRTF

readRtg([type])，返回RTF内容。

### writeRTF

writeRTF(text[,type])，写入RTF格式的text。


### readBookMark

MacOS && Windows可用，返回{title:string,url:string}，windows上title值永远为空。

### writeBookMark

MacOS && Windows可用，writeBookMark(title,url[,type])，windows上title值永远为空。

注意：windows上大多数应用程序不支持粘贴书签。

### readFindText & writeFindText

MacOS，操作查找剪贴板。

### clear

clear([type])，清除剪贴板内容。

### availableFormats
åå
availableFormats([type])，返回剪贴板支持的格式。

### has

has(format[,type])，剪贴板是否支持指定的format。

# ContentTracing

从Chromium收集追踪数据以找到性能瓶颈和慢操作。

进程：主进程。

此模块不包含Web界面。若要查看记录的轨迹，请使用跟踪查看器。

注意：在应用的ready事件触发之前，不应该使用该模块。

```js
const { app, contentTracing } = require('electron')

app.whenReady().then(() => {
  (async () => {
    await contentTracing.startRecording({
      included_categories: ['*']
    })
    console.log('Tracing started')
    await new Promise(resolve => setTimeout(resolve, 5000))
    const path = await contentTracing.stopRecording()
    console.log('追踪数据记录到： ' + path)
  })()
})
```

返回的path的内容为一堆JSON数据。

## 方法

contentTracing.getCategories()，返回Promise<string[]>。

注意：electron添加了一个名为electron的非默认追踪类别，此类别用于捕捉Electron特定的追踪事件。

contentTracing.startRecording(options)，返回Promise<void>，当所有的子进程都确认了startRecording请求后resolve。

options: 

recording_mode：string，可选，值可以是record-until-full，record-continously，record-as-much-as-possible，trace-to-console。默认值为record-until-full。

trace_buffer_size_in_kb，number，可选，追踪记录缓冲区的最大容量，以kb为单位，默认大小为100MB。

trace_buffer_size_in_events，number，可选，追踪记录缓冲区的最大事件数量。

enable_argument_filter，boolean，可选，true为筛选结果是根据手动设置的列表来进行条件筛选。

include_categories，string[]，可选，要排除的追踪列类别列表，可以包含glob-like匹配模式，在类别末尾使用*。

include_process_ids，number[]，可选，追踪要包含的进程ID列表。不指定，则追踪所有进程。

histogram_names，string[]，可选，与追踪一同报告的直方图的名称列表。

memory_dump_config，Record<string,any>，可选，如果启动了disabled-by-default-memory-infra类别，则包含用于数据收集的可选附加配置。

一旦收到EnableRecording请求，记录立即在本地开始进行，并在子进程上异步执行。如果一个记录已经运行了，promise将立即resolve，因为一次只能进行一个跟踪操作。

contentTracing.stopRecording([resultFilePath])，resultFilePath:string，可选，返回Promise<string>，一旦所有子进程都确认了stopRecording请求，会resolve一个包含了追踪数据的文件路径。

子进程通常缓存跟踪数据，并且很少清空或发送跟踪数据回主进程，因为通过IPC发送跟踪数据可能是一个开销巨大的操作。为了结束追踪，Chromium异步地要求所有子进程刷新所有挂起的跟踪数据，追踪数据将被写入resultFilePath。

contentTracing.getTraceBufferUsage():Promise<{value:numnber,percentage:number}>，获取追踪缓存区间在进程间的最大使用量。

# DesktopCapturer

进程：主进程。

访问关于使用naviagtor.mediaDevices.getUserMedia API获取的可以用来从桌面捕捉音频和视频的媒体源的信息。

```ts
//主进程
async function sendDeskTopSource(win: BrowserWindow) {
  let sources = await desktopCapturer.getSources({ types: ['window', 'screen'] });
  for (let source of sources) {
    win.webContents.send(`SET_SOURCE`, source.id);
  }
}
//渲染进程
import { ipcRenderer } from 'electron';

ipcRenderer.on('SET_SOURCE', async (event, sourceId) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                //@ts-ignore
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId,
                    minWidth: 1280,
                    maxWidth: 1280,
                    minHeight: 720,
                    maxHeight: 720
                }
            }
        });
        if (stream) {
            handleStream(stream);
        }
    } catch (ex) {
        console.error(ex)
    }
});

function handleStream(stream: MediaStream) {
    const video = document.querySelector('video') as HTMLVideoElement;
    video.srcObject = stream;
    video.onloadedmetadata = () => video.play();
}
```

为了从desktopCapturer提供的源捕获视频，传递给navigator.mediaDevices.getUserMedia的约束条件包括ChromeMediaSource:'desktop'和audio:false。

为了同时捕获桌面的音视频，传递给navigator.mediaDevcies.getUserMedia的约束条件需包括ChromeMediaSource:'desktop'，audio和video。但不应该包括ChromeMediaSourceId约束。

```ts
const constraints = {
  audio: {
    mandatory: {
      chromeMediaSource: 'desktop'
    }
  },
  video: {
    mandatory: {
      chromeMediaSource: 'desktop'
    }
  }
}
```

## 方法

### getSources(options)

options:

types:string[]，列出要捕获的桌面源类型的字符串数组，可用类型为screen和window。

thumbnailSize:Size，媒体源缩略图应缩放到的尺寸大小，默认是150* 150，不需要缩略图时，设置宽度或高度为0，这将用于节省获取每个窗口和屏幕内容时的时间。

fetchWindowsIcon:boolean，设置为true以启用提取窗口体表。默认为false。

返回：Promise<DesktopCapturerSource[]>，每一个DesktopCapturerSource代表一个屏幕或一个可以被捕获的独立窗口。

注意：在MacOS10.15以上的版本，捕获屏幕内容需要用户同意，可通过systemPreferences.getMediaAccessStatus检测是否授权。

注意：由于存在基本限制，navigator.mediaDevices.getUserMedia无法在MacOS上进行音频捕获，因为要访问系统音频的应用需要一个签名内拓展，Chromium以及Electron扩展不提供这个。通过使用另一个MacOS应用捕获系统音频并将其通过虚拟音频输入设备来规避此限制是可能的。然后可以用navigator.mediaDevices.getUserMedia查询该虚拟设备。

