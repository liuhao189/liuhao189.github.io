# VSCode使用教程

## 概览

VSCode是一个跨平台（Windows，MacOS和Linux）的，免费的，轻量但是功能丰富的源代码编辑器。

VSCode原生支持JS，TS和Node.js的开发，通过插件可以支持其它语言(C++，C#，Java，Python，PHP，GO等编程语言)和其它运行时(.NET，Unity等)。

## 版本&&附加功能

VSCode团队每个月发布一个新版本，大部分平台支持自动更新。

如果想禁用自动更新，需要在软件设置里将update.mode从default设置到none。

```json
"update:mode":"none"
```
### insiders

如果你想早点尝试新功能或帮助开发团队测试bugs，你可以安装VSCode insiders的版本。

insiders版本和稳定版可以同时存在于同一个机器上，不会互相影响。

### 便携模式

VSCode支持便携模式安装，这个模式下，VSCode会将产生的数据存放到本地文件夹。这样VSCode就可以放到可移动存储介质中，然后在不同的机器上运行。便携模式同时支持设置插件安装目录。

如果你想下载便携模式版本，需要在[下载页](https://code.visualstudio.com/download)中选择zip的压缩包。

### 附加功能

VSCode不像传统的IDE，一安装就包括很多功能。VSCode主要通过安装插件的方式来支持额外的功能。


## 开始使用

### 提示和小技巧

#### 快捷键

选区操作：cmd+shift+箭头可以选择光标前后上下的区域。
多光标操作：mac上按住alt键，然后点击空白处，可以增加多光标。Cmd+Alt+上下箭头可以在上下添加多光标。

复制到上一行：alt+shift+上箭头。
复制到下一行：alt+shift+下箭头。

移动行：alt+上下箭头

删除整行：Shift+Cmd+K。

注释为：Cmd+/。

重命名符号：F2即可，然后VSCode会将项目中所有引用的地方替换为重命名后的名字。

格式化文件：Shift + Alt +F，格式化全文。

格式化选中区域：Cmd+K 然后Cmd+F。

收缩所有代码块，Cmd+K，Cmd+0，展开所有代码区域Cmd+K，Cmd+J。

F8会在文件内的错误之间导航，并看到具体的错误信息。

Cmd+P可以快速打开文件。输入？可以查看帮助提示。按右箭头可以打开多个文件。

Shift+Cmd+M可以打开问题面板查看所有错误。

Cmd+B，展示或隐藏Sidebar。

Cmd+\为新开一个Tab页。

Cmd+num为激活某个Tab页。

#### 代码片段

VSCode的插件里面几乎有所有的框架和语言的代码片段，这会极大提高开发效率。

可以很方便的在定义Snippets。

#### ts-check

在一个JS文件的第一行增加“// @ts-check”可以应用ts的检查功能。相反的“@ts-nocheck”可以不检查该文件。

要在项目或工作区维度增加全局检测配置，需要在.vscode/settings.json里面增加如下配置。

```json
{
    "javascript.implicitProjectConfig.checkJs": false
}
```

#### 命令面板

Shift+Cmd+P可以打开命令面板，命令面板根据你的当前情况显示可用的所有命令。

#### .vscode文件夹

工区区维度的设置全都在.vscode文件夹里。eg：tasks.json定义运行的task，launch.json定义debugger的操作。

#### 自定义配置

在左侧导航栏不显示某些文件夹或文件，使用files.exclude。

```json
"files.exclude": {
    "**/dist/": true,
    "**/.npmrc": true
}
//
"search.exclude":{ 
    "**/node_modules": true
}
```
一些设置项因为安全因素，不能在工作区级别自定义设置，只能在用户级别设置。主要是shell执行的设置。

eg：git.path，terminal.integrated.shell.linux。。。。


语言级别设置，可以点击状态栏右侧的语言名字，然后在弹出的命令面板里设置当前语言级别的基础配置。

```json
    "[typescript]": {
        "editor.formatOnPaste": true,
        "editor.formatOnSave": true
    }
```

增加JSON校验功能。

#### 其它

在不存在的文件链接上按照Ctrl+Click，会弹出新建文件弹框。

Cmd+W，关闭当前打开的文件夹。

Ctrl+_：导航到之前的光标位置。

Ctrl+Shift+_：导航到之后的光标位置。

自定义文件后缀，一些自定义的文件后缀其实是json格式。

```json
    "files.associations": {
        ".database": "json"
    },
```

你可以按住Shift+Cmd+L，在当前选中的所有区域增加光标。Cmd+D，只会选中下一个。

按住Alt键，然后滚动，编辑器会快速滚动。

Cmd+P的搜索框中，输入@可以导航到文件的特定区域。也可以直接Cmd+T。

Ctrl+G可以导航到特定的行和列。

Cmd+U取消Cursor的位置变换。

Cmd+箭头上或箭头下可以导航到文件开始和结束的位置。

自定义snippets，在.vscode文件夹里新建一个以.code-snippets为后缀的文件。

```json
{
	"create component": {
		"prefix": "component",
		"body": [
			"class $1 extends React.Component {",
			"",
			"\trender() {",
			"\t\treturn($2);",
			"\t}",
			"",
			"}"
		],
		"scope": "javascript,typescript",
		"description": "define a new react component"
	}
}
```
调试，调试主要的配置在launch.json中。

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "启动程序",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/sw.js"
        }
    ]
}
```

#### Task


tasks主要定义在tasks.json文件夹中。

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "listFile",
            "type": "shell",
            "command": "ls -l",
            "group": "none"
        }
    ]
}
```
运行任务主要在终端>运行任务>选择任务名称。

