# 可视化搭建Web页面其二

上文提到要创建CLI工具来提高开发者开发效率。

## 如何开始

从头开始介绍如何开始创建一个node-cli来面向模板和组件开发者，减少重复劳动，提高工作效率。

```bash
mkdir my-cli
cd my-cli
npm init -y # 初始化package.json
```

接下来我们需要增加一个命令入口，指向可执行文件。需要在package.json文件中指明bin来配置入口。

```bash
#!/usr/bin/env node
```

#!这个符号通常出现在Unix系统中，用于指明这个脚本文件的解释程序。增加上面那一行代码主要是为了指定用node执行脚本文件。

## 常用模块

1、chalk，终端显示颜色。

2、commander提供了命令行输入和参数解析。

3、inquirer交互式命令行工具，用来手机用户填入表单。

4、ora终端加载动画效果。

5、shelljs，代码中编写shell命令实现功能。

6、puppeteer启动无头浏览器生成网站缩略图。

7、download-git-repo，用来下载远程模板。

## create模板、组件

我们希望通过下面的命令来实现一个创建模板的功能，用于初始化模板脚手架。

```js
my-cli create my-template-test
```


