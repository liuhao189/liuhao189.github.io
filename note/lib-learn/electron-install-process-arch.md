# Electron-安装和进程模型

## 安装指导

要安装预编译的Electron二进制文件，请使用npm。

```js
npm i electron --save-dev
```

### 临时运行electron

如果你不想再本地工程上使用npm install同时又没有其它选择时，你可以使用npm捆绑的npx命令来运行。

```js
npx electron .
```

上面的命令会在当前工作目录下运行Electron，需要注意的是，你的英语中的任何依赖将不会被安装。

### 下载其它位版本

如果想下载其它位版本，可以设置npm_config_arch环境变量，或使用--arch标记。

```js
npm i --arch=ia32 electron
```

此外，还可以使用--platform来指定开发平台。

```js
npm i --platform=win32 electron
```

### 代理

如果你需要使用HTTP代理，需要设置ELECTRON_GET_USER_PROXY变量。

### 自定义镜像和缓存

安装过程中，electron模块会通过electron-download为您的平台下载Electron的预编译二进制文件。这将访问Github的发布下载页面(https://github.com/electron/electron/releases/tag/v$VERSION)来完成。

如果您无法访问github，或者您需要自定义构建，则可以通过提供镜像或现有的缓存目录来实现。

#### 镜像

可以使用环境变量来覆盖基本的URL，查找Electron二进制文件的路径拼接规则如下。

```js
url = ELECTRON_MIRROR + ELECTRON_CUSTOM_DIR + '/' + ELECTRON_CUSTOM_FILENAME
// 使用中国的镜像
ELECTRON_MIRROR="https://cdn.npm.taobao.org/dist/electron/"
ELECTRON_CUSTOM_DIR="{{ version }}"
```

默认情况下，ELECTRON_CUSTOM_DIR被设置为v$VERSION，要更改格式，请使用{{version}}占位符。

如果您的镜像在官方Electron版本中提供不同校验和，你可能必须将ELECTRON_USE_REMOTE_CHECKSUMS设置为1，这将为Electron使用远程SHASUMS256.txt文件来验证校验。

#### 缓存

electron-download会将下载的二进制文件缓存到本地目录中，不会增加后续网络负担。你可以使用该缓存文件夹来提供Electron的定制版本，或者避免进行网络连接。

Linux：$XDG_CACHE_HOME，~/.cache/electron。
MacOS：~/Library/Caches/electron/
Windows：$LOCALAPPDATA/electron/Cache，~/AppData/Local/electron/Cache。

可以使用electron_config_cache环境变量来覆盖本地缓存位置。

缓存中包含了以文本文件形式存储的带有校验和的版本官方zio文件。

```bash
65a861ed1c947e25d9f47192ec3f17fe4a89e4d3085666f18624f58d3ffe5110
    electron-v17.0.0-darwin-x64.zip
```

### 跳过二进制包下载

在底层，Electron的JS API绑定了包含默认实现的二进制文件。由于二进制文件对于任何Electron应用的功能都至关重要，每次你从npm install electron时，默认情况下都会在postInstall步骤中下载该二进制文件。

但是，如果你想要安装你的项目依赖，但又不需要使用Electron功能，可以设置ELECTRON_SKIP_BINARY_DOWNLOAD环境变量来阻止二进制文件被下载。

```js
ELECRON_SKIP_BINARY_DOWNOAD=1 npm install
```

### 故障排查

在运行npm install electron时，有些用户会偶尔遇到安装问题。大多数情况下，这些错误都是由网络问题导致。

像ELIFECYCLE、EAI_AGAIN、ECONNRESET和ETIMEOUT等错误都是此类网络问题的标志。最佳的解决方案是尝试切换网络，然后再试一次。

如果安装失败并报EACCESS，需要修复npm权限。如果持续出现该错误，可以执行下面的命令。

```bash
sudo npm install electron --unsafe-perm=true
```

在较慢的网络上，最好使用--verbose标志来显示下载进度。

```js
npm install --verbose electron
```

如果需要强制重新下载文件，需要将force_no_cache环境变量设置为true。

## 进程模型



