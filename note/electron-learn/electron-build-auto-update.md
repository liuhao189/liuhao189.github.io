# Electron-Builder的自动更新

## Publish

publish字段包括了一组控制如何发布构建产物和自动更新文件的配置。

类型可以是String|Object|Array<Object|String>，Object可以是Keygen，Generic Server，GitHub，S3，Spaces和Snap Store等选项。

顺序是重要的，第一个会被做为默认的自动更新服务器。可以在根目录或platform(mac，linux，win)或target(nsis，dmg)上指定该配置。

如果GH_TOKEN或GITHUB_TOKEN提供了，默认的是[{provider:"github"}]。

如果KEYGEN_TOKEN定义了，而GH_TOKEN和GITHUB_TOKEN没有定义，默认的是[{provider:"keygen"}]。

可以配置多个Providers。

```js
{
    "build": {
        "win" : {
            "publish": ["github","bitbucket"]
        }
    }
}
```

### 何时发布

CLI命令行参数可以指定发布时机。

```bash
# Publishing:
# --public,-p [choices:"onTag","onTagOrDraft","always","never"]
```

## 通用服务Options

```js
{
    "provider": "generic",//必须是generic
    "url": "https://www.xxx.com",//base_url
    "channel": "latest",//频道
    "useMultipleRangeRequest": boolean,//是否使用多个范围请求进行差异更新，如果url不包含s3.amazonaws.com默认为true。
    "publishAutoUpdate": true,//从PublishConfiguration继承来的属性，是否发布自动更新信息文件
    "requestHeaders": unknown, //自定义请求头
}
```

## 自动更新

### 自动更新target

1、macOS：DMG。

2、Linux：AppImage。

3、Windows：NSIS。

这些target都是默认就有的。

注意：如果使用NSIS-target，Windows上的简单的自动更新是支持的，但是不支持Squirrel.Windows。

### electron-updater和内置的autoUpater的差异

1、不需要专门的发布服务器。

2、代码签名验证不止在macOS上，也在windows上。

3、所需要的元数据和构建产物都会自动发布。

4、下载进度和分阶段部署(channel)在各个平台都支持。

5、原生支持不同的providers，包括通用HTTP服务器。

6、只需要两行代码就可使用。

### electron-updater

1、安装依赖，配置publish字段。

2、使用electron-updater的autoUpdater来代替electron.autoUpdater。

3、调用autoUpdater.checkForUpdatesAndNotify()，如果你需要自定义行为，监听electron-updater事件即可。

注意事项：

1、不需要调用setFeedURL，electron-builder会在resources里自动创建app-update.yml文件。

2、 Squirrel.Mac需要zip-target，否则latest-mac.yml不能创建，进而导致autoUpdater错误。mac的默认配置是dmg+zip，不用显式指定zip。

### 添加自定义请求头

```js
import { NsisUpdater } from "electron-updater";
// Or MacUpdater AppImageUpdater
export default class AppUpdater {
    constructor() {
        const options = {
            requestHeader: {
                // any request headers to include here
            },
            provider: 'generic',
            url: 'https://example.com/auto-updates'
        }
        const autoUpdater = new NsisUpdater(options);
        autoUpdater.addAuthHeader(`Bearer ${token}`);
        autoUpdater.checkForUpdatesAndNotify();
    }
}
```

### 调试

不用监听所有事件来搞清楚哪里出错。只需要设置logger属性就行。

electron-log是推荐的logger包。

```js
autoUpdater.logger = require('electron-logger');
autoUpdater.logger.traansports.file.level = 'info';

```

注意：为了在不打包应用程序的情况下开发/测试更新UI/UX，你需要一个名为dev-app-update的文件，项目根目录中的yml，来自electron-builder配置的发布设置相匹配。

但是这种方式不推荐，最好在安装的应用上测试auto-update。

### 兼容性

生成的元数据文件格式不断变化，但兼容性一致保持到版本1。新项目，建议将electronUpdaterCompatibility设置为>=2.16。

### 分阶段发布

主要是新版本应用逐渐放量。分段部署主要靠手工修改latest.yml/latest-mac.yml文件。

```js
version: 1.1.0
path: TestApp Setup 1.1.0.exe
sha512: Dj51I0q8aPQ3ioaz9LMqGYujAYRbDNblAQbodDRXAMxmY6hsHqEl3F6SvhfJj5oPhcqdX1ldsgEvfMNXGUXBIw
stagingPercentage: 10
```
如果某个版本有严重的问题，你需要增加版本号以让所有用户去更新。

### 生成的文件

win：latest.yml

mac：latest-mac.yml

linux: latest-linux.yml。

### 事件

1、error。

2、checking-for-update。

3、 update-available。

4、update-not-available。

5、download-progress。

6、update-downloaded。


## 参考文档

https://www.electron.build/configuration/publish

https://www.electron.build/auto-update