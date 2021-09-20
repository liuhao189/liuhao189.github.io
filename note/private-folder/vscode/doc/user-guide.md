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







