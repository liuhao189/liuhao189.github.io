# 用户指导

## 基本编辑

### Hot Exit

VSCode在你正常退出时，会记住没有保存的文件内容。正常的退出为file > exit。

### 查找

默认查找弹框出现时，会将你光标下的词填充到查找框中。可以使用“editor.find.seedSearchStringFromSelection”来禁用此行为。

选中查找框的“汉堡包”的图标，会在选中的区域内搜索。可以通过“editor.find.autoFindInSelection”来默认从选中区域搜索。

跨文件搜索快捷键，Shift+Cmd+F。

跨文件搜索时，排除和包括的文件可以使用glob配置。

*匹配一个或多个字符，?匹配一个字符，**，匹配多个路径分隔符，{}，条件分组，eg:{**/*.html,**/*.txt},[]声明一个字符集合，eg:example.[0-9]

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

```json
"extensions.autoUpdate": false,
"extensions.autoCheckUpdates": false
```
### 从VSIX安装扩展

可以从VSIX本地文件安装扩展。

```bash
code --install-extension my-extension.vsix
```

### 工作区建议的插件

在一个单文件夹工作区，可以在.vscode文件夹下创建一个extensions.json文件。

```json
{
    "recommendations": [
        "ms-python.python"
    ]
}
```

### 不展示建议的扩展

可以使用以下配置不展示建议的扩展。

```json
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

```json
"editor.tabCompletion": "off",
"editor.tabCompletion": "on",
"editor.tabCompletion": "onlySnippets"
```

#### 就近原则

提示的顺序会按照变量定义的顺序来排序。eg：loop，function，file。

配置使用editor.suggest.localityBonus。默认为false。

```js
let id = 1;
function loadInfo(infoId){
    let info={};
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

```json
// "on", "off" "last"
"breadcrumbs.filePath":"on",
"breadcrumbs.symbolPath":"on",
"breadcrumbs.icons":false
```

### 重构

#### 提取方法

一个常见的重构操作是避免重复代码，这需要将通用代码逻辑提取到一个方法。

操作：选中重复代码，选择在不同的scope里生成新方法。

```js
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

```json
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

```json
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

```json
//可选值："floating","docked","hidden"
"debug.toolBarLocation":"floating"
```

#### 记录点

记录点可以以非代码侵入的方式打印一些信息，{}内的内容会当做表达式被执行。

```js
const msg='Hello World';
//add log point below
let logPointStr='Message：{msg}'
```

#### 内置变量

VSCode支持在配置中变量插值的功能。

常用变量：

1、${workspaceFolder}，当前工作区的根目录

2、${file}，当前打开的文件

3、${env:Name}，环境变量Name的值。

其它变量：[其它变量](https://code.visualstudio.com/docs/editor/variables-reference)

#### 特定平台的配置

支持：windows，linux，osx。

```json
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


## 版本管理





