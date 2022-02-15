# Electron-安全性&原生能力&你的责任

Web开发人员通常享有浏览器强大的安全特性，自己的代码风险相对较小，因为我们的网站在沙盒中被赋予了有限的权利。

当使用Electron时，JS可以访问文件系统，用户shell等，这允许您构建高质量的本机应用程序，但是内在的风险会增加。

考虑到这一点，请注意，展示任意来自不受信任源的内容都将会带来风险。最流行的Electron应用主要显示本地内容，即使是远程内容也是无Node的、受信任的，安全的内容。

## 报告安全性问题

主要参考https://github.com/electron/electron/blob/main/SECURITY.md。

## Chromium安全问题和升级

Eletcron和Chromimum基本上保持同步。https://www.electronjs.org/blog/12-week-cadence。

## 安全是所有人的共同责任

Electron的应用的安全性依赖于整个框架基础(Chromium和NodeJS)，Electron本身和所有相关NPM库的安全性，还依赖于你自己的代码的安全性。

你有责任遵循下列安全守则：

1、使用最新版的Electron框架搭建你的程序。

2、评估你的依赖项目，npm提供了五百万可重用的软件包，你应当承担起选择可信任的第三方库。

3、遵循安全编码规范，你的代码是你的程序的第一道防线。一般的网络漏洞，eg：XSS，对Electron将造成更大的影响。

## 隔离不信任的内容

每当你从不被信任的来源获取代码并在本地执行，其中就存在安全性问题。在开启Node集成的情况下，都不该加载并执行远程代码。

如果你想要显示远程内容，请使用webview tag或者BrowserView，并确保禁用nodeIntegration并启用contextIsolation。

## Electron安全警告

从Electron12开始，开发者将会在开发者控制台看到打印的警告和建议。这些警告仅在可执行文件名为Electron时才会为开发者展示。

也可以通过process.env或window对象上配置ELECTRON_ENABLE_SECURITY_WARNINGS或ELECTRON_DISABLE_SECURITY_WARNINGS来强制开启或关闭这些警告。

