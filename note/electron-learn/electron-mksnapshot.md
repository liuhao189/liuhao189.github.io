# Electron-mksnapshot

下载与Electron兼容的mksnapshot二进制文件来生成V8-snapshot的npm包。

这个npm包的主版本跟随Electron的主版本。如果你使用Electron@17.0.x，你需要使用electron-mksnapshot@17.0.x。


## 使用

```bash
# install
npm install electron-mksnapshot --save-dev
# use
mksnapshot.js file.js --out_dir OUTPUT_DIR
```

mksnapshot会生成snapshot_blob.bin和v8_context_snapshots.bin文件。这两个文件都需要拷贝到Electron的特定目录中。

mksnapshot的命令行参数支持除--start_blob外的参数，可以执行mksnapshot --help来查看。

## 自定义镜像

你可以设置ELECTRON_MIRROT或NPM_CONFIG_ELECTRON_MIRROR的环境变量来定义下载mksnapshot的地址。

```bash
# for china
ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"
# for local
ELECTRON_MIRROR="http://localhost:8080/"
```

## 自定义下载的版本

可以使用ELECTRON_CUSTOM_VERSION环境变量来设置需要下载的版本。

```bash
# install mksnapshot for electron v8.3.0
ELECTRON_CUSTOM_VERSION=8.3.0 npm install
```

## 生成ARM硬件的快照

如果你需要生成面向Linux_arm32，Linux_arm64，win32_arm64的snapshots，你需要在Intel X64平台上安装一个跨架构的mksnapshot。

Linux_arm64 & windows_arm64 & macOS_arm64

```bash
# Intel x64 Linux OS run
npm config set arch arm64
npm install --save-dev electron-mksnapshot
```

Linux_arm71(32位arm)

```bash
# Intel X64 Linux OS
npm config set arch arm71
npm install --save-dev electron-mksnapshot
```



## 参考文档

https://www.npmjs.com/package/electron-mksnapshot