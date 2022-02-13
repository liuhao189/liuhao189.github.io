# Electron - 基础

## Dark Mode

本地界面包括文件选择器、窗口边框、对话框、上下文菜单等，任何UI来自操作系统而非应用的界面，默认是从操作系统自定选择主题。

CSS中可以使用[prefer-color-scheme]来指定暗黑模式下的展示。

## macOS设置

在MacOS 10.14中，Apple为所有MacOS电脑引入了一个全新的系统级黑暗模式。如果你的应用具有深色模式，可以使用nativeTheme API来跟随系统的设置。

## 示例

1、CSS文件使用prefers-color-scheme 媒体查询来设置body的样式。

2、preload.js中引入ipcRenderer来调用dark-mode:toggle相关的方法。

3、main.js主进程中，引入icpMain来接收消息，引入nativeTheme来完成主题设置和获取。

