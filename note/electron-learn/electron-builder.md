# electron-builder

一个完整的打包和编译可发布的Electron-App的工具。开箱就支持macOS，Windows和Linux，并支持自动更新。

功能：

1、npm包管理：

原生模块依赖重编译，Electron是支持Node.js的原生模块的，但是Electron跟Node.js可能会有不同的ABI(Application binary interface)。你使用的原生模块需要重新编译。

devDependencies不会被包含（你不用显式忽略)；

支持两个package.json结构，从Version 8开始，electron-builder只编译线上的依赖，所以可以不用两个package.json的结构。

2、支持在CI服务器或开发机器上代码签名。

MacOS和Windows上的代码签名是支持的。Windows支持两种方式SHA1&SHA256。

在Macos的开发机上，将自动使用keychain中有效且适当的身份。

3、支持自定更新。

4、众多的打包格式：所有平台：7z，zip，tar.xz，tar.lz，tar.gz，tar.bz2，dir(未打包目录)。

macOS：dmg，pkg，mas，mas-dev。

Linux：appImage,snap,deb,rmp,fressbsd,pacman,p5p,apk。

Windows：nsis，nsis-web,portable,Appx。

5、发布到Github Releases，Amazon S3，DiitalOcean Spaces and Bintray。

6、高级构建：

构建一个已打包app的分发模式；

单独的构建步骤；

构建和发布并行，在CI服务器上使用硬链接来避免IO和硬盘空间损耗；

支持electron-compile。

7、支持docker，拥有docker镜像，可以在任何平台上构建Linux或Windows包。

8、支持Proton Native。

9、懒下载所有需要的工具文件，而不是在初始化时。eg：windows上的code sign来生成appx。

## 安装

```js
npm i electron-builder --dev
```
 
## 快速设置

1、确保package.json中有必要的字段。name，description, version and author。

2、在package.json中添加build配置。

```js
"build": {
  "appId": "com.apple.liuhaoLearnElectron",
  "mac": {
    "category": "public.app-category.developer-tools"
  }
}
```

3、添加图标。

4、在package.json中添加scripts。

## 代码中使用

node_modules/electron-builder/out/index.d.ts提供了TS类型的声明。

## Debug

设置DEBUG环境遍历可以debug electron-builder的构建流程。

```bash
# mac & linux
DEBUG=electron-builder
# windows cmd
set DEBUG=electron-builder
# windows powershell
$env:DEBUG=electron-builder
```


## 参考文档

https://www.electron.build/