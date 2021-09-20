# VSCode使用教程

## 概览

VSCode是一个跨平台（Windows，MacOS和Linux）的，免费的，轻量但是功能丰富的源代码编辑器。

VSCode原生支持JS，TS的开发，通过插件可以支持其它语言(C++，C#，Java，Python，PHP，GO等编程语言)和其它运行时(.NET，Unity等)。

## 版本&&附加功能

VSCode团队每个月发布一个新版本，大部分平台支持自动更新。

如果想禁用自动更新，需要在软件设置里将update.mode从default设置到none。

```json
"update:mode":"none"
```
### insiders

如果你想早点尝试新功能或帮助开发团队测试bugs，你可以安装VSCode insiders的版本。insiders版本和稳定版可以同时存在于同一个机器上，不会互相影响。

### 便携模式

VSCode支持便携模式安装，这个模式下，VSCode会将产生的数据存放到本地文件夹。这样VSCode就可以放到可移动存储介质中，然后在不同的机器上运行。便携模式同时支持自定义插件安装目录。

如果你想下载便携模式版本，需要在[下载页](https://code.visualstudio.com/download)中选择zip的压缩包。

### 附加功能

VSCode不像传统的IDE，一安装就包括很多功能。VSCode通过安装插件的方式来支持额外的功能。

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

VSCode的插件里面几乎有所有的框架和语言的代码片段，这会极大提高开发效率。同时也可以很方便的自定义Snippets。

#### ts-check

在一个JS文件的第一行增加“//@ts-check”可以应用ts的检查功能。相反的“@ts-nocheck”可以不检查该文件。

要在项目或工作区级别增加全局检测配置，需要在.vscode/settings.json里面增加如下配置。

```json
{
    "javascript.implicitProjectConfig.checkJs": true
}
```

#### 命令面板

Shift+Cmd+P可以打开命令面板，命令面板根据你的当前情况显示可用的所有命令。

#### .vscode文件夹

工作区级别的设置全都在.vscode文件夹里。eg：tasks.json定义运行的task，launch.json定义debugger的操作。

#### 自定义配置

在左侧导航栏不显示某些文件夹或文件，使用files.exclude。一般用于不展示变化低频的文件夹，方便查找文件夹。

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

#### 其它

在不存在的文件链接上按住Ctrl并Click，会弹出新建文件弹框。

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

## UI基本Layout

主要包括Editor，SideBar，StatusBar，ActivityBar，Panels。

小技巧：

Alt + Click file会在新的编辑器中打开该文件。

通过设置workbench.editor.openSideBySideDirection，可以在下方打开新编辑器。

### Minimap

Minimap展示源代码的高级别的概览。

可以通过editor.minimap.side设置minimap显示的位置，通过editor.minimap.enabled设置是否启用minimap。


### Breadcrumbs

编辑器上面有一个导航条。如果该语言支持symbol，symbol的路径会展示在导航条。

可以在views>Show Breadcrumbs来显示和隐藏导航条。

### 文件浏览器

默认，VSCode会忽略一些文件夹。eg：.git。用户可以使用files.exclude来配置忽略文件和文件夹。

按照Cmd/Ctrl+点击可以选中多个文件，右键可以对比文件。

在文件浏览器focus的状态下，输入字符可以搜索文件或文件夹。

### 命令面板

命令面板包含几乎所有VSCode的功能。Cmd/Ctrl+P即可。

### Zen模式

Zen模式会隐藏除了代码编辑器以外的所有UI，让你集中精力在代码上。按两次esc键，可以退出Zen模式。

### 预览模式

当你单机或选择一个文件时，VSCode默认会以预览模式打开该文件。预览模式不会打开一个新的Tab。

当你编辑过文件，或双击打开该文件时候，会以编辑模式打开。

可以通过下面的配置禁用预览模式。

```js
"workbench.editor.enablePreview": true
```

## 用户和工作区设置

VSCode的扩展可以添加它们自己的配置，扩展添加的配置在Extenstions类目下。

## 键盘快捷键

Alt+Z切换自动换行。

快捷键的设置保存在keybindings.json文件中。

快捷键的数据结构：key，描述按键；command：描述要执行的任务。when(可选的)，描述快捷键生效条件。

快捷键处理顺序是从底部到头部的，如果找到一个key和when都符合的规则，就执行该规则的command，不再继续查找。

在打开keybindings.json时，按Cmd+K Cmd+K可以打开快捷键编辑弹框。


### 移除快捷键

在command的开头添加-即可移除该快捷键。

```json
    {
        "key": "cmd+r cmd+y",
        "command": "-workbench.action.tasks.runTask",
        "args": "listFile"
    }
```

### 命令参数

命令可以通过args传递参数对象。

### when

when有四种运算符，==，!=，||，&&。

可选条件：

editorFocus

editorTextFocus

textInputFocus

inputFocus

editorHasSelection

editorHasMultipleSelections

editorReadonly

editorLangId，eg："editorLangId == typescript"

OS相关：

isLinux，isMac，isWindows，isWeb

Mode相关

isDebugMode，debugType（debugType==node），isSnippetMode，isQuickOpen。

Resource相关：

resourceSchema(eg：resourceSchema==file)，resourceFilename（resourceFileName == gulpfile.js），resourceExtname（resourceExtname==.js），resourceLangId(resourceLangId==markdown)，isFileSystemResource，resource（full uri）。

可以使用任何的config的配置项，需要添加“config”的前缀。

```json
"when":"config.editor.minimap.enabled"
```

key-value的属性时候，可以使用~字符串，代表以此开始。

```json
"when": "resourceFilename = ~/docker/"
```

## 语言包

VSCode默认只带英文语言包，其它语言需要安装语言包扩展。

语言包的配置会写到argv.json文件中。

以下命令可以以某个语言打开VSCode。

```bash
code . --locale=en
```

## 隐私

### 关闭数据上报

如果你不想上报你自己的使用数据，可以在配置文件中更改"telemetry.enableTelemetry"为false。

```json
"telemetry.enableTelemetry": false
```

如果你不想上报你的崩溃信息，可以在配置文件中将"telemetry.enableCrashReporter"改为false。

```json
"templetry.enableCrashReporter": false
```

扩展的数据上报，不会使用上述配置。

### 查看日志数据

output面板中选择日志类筛选框即可。也可以在telemetry.log中查看日志。

# 用户指导

## 基本编辑

### Hot Exit

VSCode在你正常退出时，会记住没有保存的文件内容。正常的退出为file > exit。

### 查找

默认查找弹框出现时，会将你光标下的词填充到查找框中。可以使用“editor.find.seedSearchStringFromSelection”来禁用此行为。

选中查找框的“汉堡包”的图标，会在选中的区域内搜索。可以通过“editor.find.autoFindInSelection”来默认从选中区域搜索。

跨文件搜索快捷键，Shift+Cmd+F。

跨文件搜索时，排除和包括的文件可以使用glob配置。

*匹配一个或多个字符，? 匹配一个字符，**，匹配多个路径分隔符，{}，条件分组，eg:{**/*.html, **/*.txt}, []声明一个字符集合，eg:example.[0-9]

### 代码区域

为了代码可读性，我们可以自己添加region。

CSS/LESS/SCSS中使用/* #region */ 和 /* #endregion */

markdown中使用<!-- #region one -->和 <!-- #endregion -->

typescript和javascript中使用 //#region 和 //#endregion

## 扩展

扩展详情页展示：

1、扩展提供的功能，命令，配置，键盘快捷键，语言支持，调试器等。

2、readme.md && changelog.md，扩展介绍和变更记录。

3、依赖，是否依赖其它扩展。。。

如果是扩展包，详情页会展示该扩展包包括的扩展。

默认情况下，VSCode会自动检查和更新插件。

你可以用下面的配置禁用这些。

``` json
"extensions.autoUpdate": false,
"extensions.autoCheckUpdates": false
```

### 从VSIX安装扩展

可以从VSIX本地文件安装扩展。

``` bash
code --install-extension my-extension.vsix
```

### 工作区建议的插件

在一个单文件夹工作区，可以在.vscode文件夹下创建一个extensions.json文件。

``` json
{
    "recommendations": [
        "ms-python.python"
    ]
}
```

### 不展示建议的扩展

可以使用以下配置不展示建议的扩展。

``` json
"extensions.showRecommendationsOnlyOnDemand": true,
"extensions.ignoreRecommendations": true
```

## 智能感知

智能感知包含了很多功能，包括代码补全，参数信息，hover或转到定义信息，成员列表等。

VSCode默认支持：JS，TS，JSON，HTML，CSS，SCSS和LESS的智能感知。

通过安装扩展可以支持：Python，C/C++，C#，JAVA，GO，PHP，Ruby，Rust等编程语言。

### 智能感知功能细节

智能感知功能是通过相应的语言服务来实现的。

一个语言服务基于语言语义和分析源代码来提供智能补全服务。

### 自定义智能感知

智能感知使用config配置来控制其行为。

#### Tab补全

Tab补全功能，只需按tab键，VSCode会将最好的建议插入到代码里。

此功能默认是关闭的。

``` json
"editor.tabCompletion": "off",
"editor.tabCompletion": "on",
"editor.tabCompletion": "onlySnippets"
```

#### 就近原则

提示的顺序会按照变量定义的顺序来排序。eg：loop，function，file。

配置使用editor.suggest.localityBonus。默认为false。

``` js
let id = 1;

function loadInfo(infoId) {
    let info = {};
    //type i shoule info,infoId,id
}
```

#### 选中的建议

配置是：editor.suggestSelection。可选值为first，recentlyUsed，recentlyUsedByPrefix。

#### 代码片段建议

默认代码片段的建议也会出现在列表里。

配置为：editor.snippetSuggestions，可选值为none，top，bottom，inline(默认)。

#### 智能提示不起作用

如果你发现智能提示不起作用，一般是因为语言服务没有运行。可以按如下步骤尝试解决：重启VSCode；重新安装语言服务；在github上开issue。

### 代码导航

在快速打开弹框中，按住Ctrl+Tab，会在同一个编辑器组中打开前几个文件。

Ctrl+_或 Ctrl+Shift+_ 可以在光标位置之间导航。

#### 导航条

自定义配置：

``` json
// "on", "off" "last"
"breadcrumbs.filePath":"on",
"breadcrumbs.symbolPath":"on",
"breadcrumbs.icons":false
```

### 重构

#### 提取方法

一个常见的重构操作是避免重复代码，这需要将通用代码逻辑提取到一个方法。

操作：选中重复代码，选择在不同的scope里生成新方法。

``` js
//before
function one(msg) {
    console.log(msg);
    console.warn(msg);
    console.error(msg);
    console.debug(msg);
}
//after
function one(msg) {
    newFunction(msg);
}

function newFunction(msg) {
    console.log(msg);
    console.warn(msg);
    console.error(msg);
    console.debug(msg);
}
```

#### symbol重命名

一些语言仅支持在文件内的symbol变更，一些语言支持跨文件的更改symbol的名称。键盘快捷键为F2。

### 调试

调试主要的配置在.vscode/launch.json中。

``` json
    {
        "type": "node",
        "request": "launch",
        "name": "服务器应用程序",
        "program": "${workspaceFolder}/demo/debugger/app.js",
        "skipFiles": [
            "<node_internals>/**"
        ]
    }
```

#### 高级断点

可以在调试菜单中，创建条件断点，内联断点，函数断点和记录点。

#### launch配置

按F5，VSCode会尝试调试当前文件。

VSCode中，主要有两种调试模式。分别是Launch和Attach。

Launch聚焦于如何在debug模式下启动你的应用。

Attach聚焦于如何把VSCode的调试器连接到已启动的实例中。

launch配置的智能感知依赖于type属性的值。

通用配置：

1、request，现阶段支持launch和attach。

2、name

3、presentation，可选值：order，group，hidden。

4、preLaunchTask，launch前要执行的task名称。

5、postDebugTask，创建新的调试会话后调用的task名称。

常见配置：

1、program，运行的程序和文件

2、args，运行program时传递的参数。

3、env，运行环境。

4、cwd，当前工作目录，一般为了找到依赖。

5、port，attach时使用的端口号。

6、stopOnEntry

7、console，console的类型，internalConsole，intergratedTerminal，externalTerminal。

#### 复合调试配置

复合调试配置可以一次启动多个调试会话。

preLaunchTask配置的task会在launch之前执行。

``` json
    "compounds": [
        {
            "name": "Server/Client",
            "configurations": [
                "Server",
                "Client"
            ],
            "preLaunchTask": "listFile"
        }
    ]
```

#### 调试条

位置配置：

``` json
//可选值："floating","docked","hidden"
"debug.toolBarLocation":"floating"
```

#### 记录点

记录点可以以非代码侵入的方式打印一些信息，{}内的内容会当做表达式被执行。

``` js
const msg = 'Hello World';
//add log point below
let logPointStr = 'Message：{msg}'
```

#### 内置变量

VSCode支持在配置中变量插值的功能。

常用变量：

1、${workspaceFolder}，当前工作区的根目录

2、${file}，当前打开的文件

3、${env: Name}，环境变量Name的值。

其它变量：[其它变量](https://code.visualstudio.com/docs/editor/variables-reference)

#### 特定平台的配置

支持：windows，linux，osx。

``` json
    "args": [
        "--windows"
    ],
    "osx": {
        "args": [
            "--osx"
        ]
    }
```

#### 用户设置中的launch

可以在用户设置中添加launch字段，如果在工作区中包含了launch.json文件，那么用户设置中的launch字段会被忽略。

## 集成的终端

快捷键Ctrl+`可以打开终端。

快捷键Shift+Cmd+C可以打开外部的终端。

### 配置

在Linux和macOS上，默认使用$SHELL。

在较新版本windows上，使用PowerShell；较旧版本windows上，使用cmd。

可以通过"terminal.integrated.shell.*"和"terminal.integrated.shellArgs.*"来配置。

为了安全考虑，上一行的配置只能在用户级别配置。

### 运行选择的文本

可以Cmd+Shift+P打开命令面板，然后选择runSelectedText。

``` bash
echo 'Hello World!';
```

### 渲染方式

默认，集成终端使用多个cavas元素渲染的，在变化频率高时，性能高。在一些不常见的情况下，Electron&&Chromium渲染DOM更快。

如果你感觉到性能问题，可以使用"terminal.integrated.rendererType":"dom"配置来使用DOM渲染。

``` json
//canvas dom experimentalWebgl
"terminal.integrated.rendererType" :"dom"
```

另一个提升性能的小技巧是忽略GPU的黑名单。

``` bash
code --ignore-gpu-blacklist
```

## 多文件夹工作区

可以在File -> Add Folder to Workspace来添加新的文件夹。

可以另存为工作区文件。工作区文件以.code-workspace为后缀，文件内容为json格式。

``` json
{
	"folders": [
		{
			"path": "/Users/xxx/Desktop/github/xxx.github.io"
		},
		{
			"path": "/Users/xxx/Desktop/github/sourcecode"
		}
	],
	"settings": {
		"javascript.implicitProjectConfig.checkJs": false,
		"files.associations": {
			".database": "json"
		},
		"workbench.editor.openSideBySideDirection": "right",
		"workbench.editor.showTabs": true,
		"workbench.editor.enablePreview": true,
		"extensions.showRecommendationsOnlyOnDemand": true,
		"extensions.ignoreRecommendations": true,
		"breadcrumbs.filePath": "last",
		"breadcrumbs.icons": false,
		"breadcrumbs.symbolPath": "last",åå
		"breadcrumbs.enabled": false
	}
}
```

在folders的数组中，你可以自己添加name属性。

工作区文件也可以添加工作区级别的setting。

多文件工作区中，为了避免设置冲突，涉及到编辑器级别的设置不会读取文件夹内的.vscode/setting.json文件。

当你创建多文件工作区时，VSCode会根据你的第一个单文件夹工作区的设置来生成多文件夹工作区的配置部分。

## Tasks

Task主要用于完成自动化任务。eg：lint，build，package，test，deploy。

### 自动检测

VSCode会在工作区内自动检测gulp，grunt，npm，ts，Jake的命令。后期会增加Maven和C#。

### 自定义任务

并不是所有的Task会被自动检测出来，一些情况下需要自定义Task。

任务字段：

1、label，task名称。

2、type，可以是shell，也可以process。

3、command，实际执行的命令。

4、group，任务分组。

5、presentation，任务输出和执行的设置。

6、options，cwd，env，shell。

7、runOptions，运行配置。

## Snippets

代码片段是可以使输入重复代码更加高效。eg：loop或条件语句。

代码片段语法大致跟[TextMate sinppet syntax](https://macromates.com/manual/en/snippets)语法类似，除了不支持插值shell命令和\u。

### 创建snippets

创建snippets不用装插件，也不用写代码。

创建以.code-snippets为后缀的文件名。

``` js
{
    "For loop": {
        "scope": "javascript,typescript",
        "prefix": [
            "for",
            "for-const"
        ],
        "body": [
            "for (const ${2:element} of ${1:array}) {",
            "\t$0",
            "}"
        ],
        "description": "A for loop"
    }
}
```

$num是占位符，从$1开始，$0是最后一个。${num:array}，array为默认名称。

#### Snippet的作用范围

单语言的用户自定义snippet可以以该语言为名称命名。eg：javascript.json

多语言或用户自定义全局的snippet需要以.code-snippets为后缀，然后指定scope属性。

项目范围：在.vscode文件夹下，新建一个以.code-snippets为后缀的文件，可以指定scope属性。

#### Snippet语法

body属性中有特定的方法来控制cursor和插入的文字。

tabStops，$1，$2这种。

placeholders，${1:foo}这种。

choice，${1|one, two, three|}这种。

variables，$name或${name:default}这种。变量包含编辑器相关，时间相关，语言相关(语言行注释，块注释)。

``` json
{
	"For loop": {
		"scope": "javascript,typescript",
		"prefix": [
			"for",
			"for-const"
		],
		"body": [
			"for (const ${2|element,item,part|} of ${1:array}) {",
			"\t$0",
			"\tconsole.log('$TM_FILENAME');",
			"\tconsole.log('$TM_DIRECTORY');",
			"\tconsole.log('$TM_FILEPATH');",
			"\tconsole.log('$WORKSPACE_NAME');",
			"}"
		],
		"description": "A for loop"
    },

    "Comment Here": {
        "prefix":["comment"],
        "body":[
            "$BLOCK_COMMENT_START Hello World $BLOCK_COMMENT_END"
        ],
        "description": "block comment here"
    }
}
```

变量转换，变量转换允许你在变量插入之前进行处理。

定义变量转换分三步：

1、一个正则捕获文字。

2、引用正则匹配组中的文字。

3、传递给正则的选项。

```json
    "${TM_FILENAME/(.*)\\..+$/This is  $1/ig}"
```

#### snippets绑定快捷键

```json
    {
        "key": "cmd+p cmd+i",
        "command": "-editor.action.insertSnippet",
        "when": "editorTextFocus",
        "args": {
             //"snippet": "console.log($1)$0",
             "name": "Comment Here" //snippet or name
        }
    }
```

#### Emment

使用自定义的Emment sinppets需要定义在一个snippets.json文件中。


#### 命令行

如果你想要快速打开一个文件，一个文件夹，可以执行code命令。

```bash
# -n 新开一个窗口 -w 等待窗口关闭后再返回 -d 打开对比框
code index.html index2.html
code .
code -d index.html index2.html
code -n -w
```
打开多个文件夹会创建一个工作区。

使用-g参数，可以打开文件，并跳转到指定的行和字符。eg：code hello.go:2:5 -g


#### 命令行管理插件

主要是安装，卸载，禁用，展示版本，启用计划的API等。

#### 使用URLS打开VSCode

打开文件，并导航到特定的字符位置。vscode://file/users/liuhao/desktop/temp:10:6。