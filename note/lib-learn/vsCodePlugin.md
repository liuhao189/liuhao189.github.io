# VSCode插件

## 概述

VSCode创建之初，就非常重视插件。几乎所有的功能都可以通过插件自定义。实际上，许多VSCode的核心功能都是通过插件实现的。

## 插件能做什么

改变 VS Code 的外观；
增加自定义组件和视图；
创建一个展示信息的 Webpage；
支持一个新编程语言；
支持特定的运行时调试。

## 第一个插件

插件开发依赖Node.js和Git，请先安装Node.js和Git。

```js
npm i -g yo generator-code
```
安装完成后使用 yo code 即可生成 VSCode 插件的脚手架。

```
yo code
```

在新生成的编辑器内部，按F5键，VSCode 会新起一个“插件开发模式”的VSCode窗口运行你的插件。

打开命令面板，执行 Hello World 命令，然后可以看到 Hello World 的通知弹框。

### 插件剖析

这个插件干了三件事：

1、package.json 里声明激活事件为“onCommand:extension.helloWorld”。

```json
	"activationEvents": [
		"onCommand:extension.helloWorld"
	],
```
注意，激活事件可以定义多个。多种条件下均可以激活插件。

2、package.json 里面contributes.commands里定义“extension.helloWorld”。

```json
"contributes": {
		"commands": [
			{
				"command": "extension.helloWorld",
				"title": "Hello World"
			}
		]
	}
```
插件想 VSCode 注入了什么。可以注入配置，命令，菜单，快捷键，视图等。

3、使用 commands.registerCommand(VSCode API 提供的一个方法)去注册一个方法去响应命令执行。

```ts
let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		vscode.window.showErrorMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
```

### 插件描述文件

每一个插件必须有 package.json 文件，package.json 作为插件的描述文件。

package.json 中可以有VS Code 独有的字段。eg：publisher，activationEvents ，contributes。

比较重要的字段：

1、name&&publisher，VS Code 使用<publisher>.<name>作为插件的唯一id。

2、main，插件的入口文件。

3、activationEvents&&contributes，激活事件和注入功能点列表。

4、engines.vscode，最低的 VS Code API 版本。

### 插件入口文件

插件入口文件需要导出两个方法，active 和 deactivate 方法。

## 发布插件

你写了一个高质量的插件，你可以将其发布到 VS Code 插件商店。

你也可以将插件打包为 VSIX 格式的安装包，然后线下分发。

提示：VSIX 后缀可以改为 zip，可以解压缩查看文件信息。


### vsce

vsce 是 Visual Studio Code Extentions 的简称，是一个打包、发布和管理VS Code 插件的一个命令行工具。

```bash
npm i -g vsce
cd my-extension
vsce package
vsce publish
```
vsce还有其它功能，可以使用 vsce --help 查看。比如搜索，下架插件等。

### 发布插件注意事项

Note：因为安全因素，vsce 不会发布用户提供的 SVG 图片。

发布插件会检查：

1、package.json 的 icon 不能是 SVG 图片。

2、package.json 的badges 只能来自于可信 badge 提供商。[可信badge 提供商列表](https://code.visualstudio.com/api/references/extension-manifest#approved-badges)

3、README.md 和 CHANGELOG.md 中的图片必须是 https链接。如果图片是 SVG 格式，必须来自于 可信badge提供商。

VS Code 应用商店使用 Azure DevOps服务。vsce 使用[personal Access Tokens](https://docs.microsoft.com/azure/devops/integrate/get-started/authentication/pats) 来发布插件。 

### 插件安装地址

要装载插件，你需要将文件 copy 到.vscode/extensions 文件夹。

不同的平台上，.vscode/extensions 的文件夹位置不同。windows为%USERPROFILE%\.vscode\extensions，MAC 和 linux 为~\.vscode\extensions。

### 插件兼容性

插件的兼容性使用 package.json 中的 engines.vscode 字段表示。


## 插件能力

### 基础能力

基本包括：

1、注册命令、配置、快捷键或右键菜单。

2、存储工作区维度或全局维度的数据。

3、显示通知消息。

4、使用快速输入弹框收集用户输入。

5、打开系统文件选择器选择文件。

6、使用Progress API 来展示长时间运行的任务。

### 主题能力

包括：

1、改变源代码颜色

2、改变 VS Code UI 的颜色

3、移植已有的 textMate 主题。

4、添加自定义文件 icon。

### 声明语言能力

该类型插件为编程语言的基本编辑提供支持。eg：缩进，换行，高亮展示等。这些功能都是声明式的，不用写任何代码、。

能力包括：

1、将通用 JS 片段打包到插件中

2、告诉 VS Code 一个新的编程语言。

3、添加或替换一个编程语言的语法。

4、使用语法注入器向一个已存在的语法中注入语法。

5、移植已有的 TextMate 语法到 VS Code。

### 添加语言特性

该类插件可以添加丰富的功能。eg：hovers，转到定义，诊断错误，智能提示、代码历史记录等。

这些功能都在 vscode.languages.* API 下。

举例：

1、hover展示API使用方法的示例。

2、使用diagnostics报告拼写或lint错误。

3、注册一个新的HTML的代码格式

4、提供丰富的，上下文感知的智能提示。

### 工作台插件

工作台插件更改VS Code的工作台 UI，或者创建自己的文件浏览组件。也可以使用 webview API 创建展示页面。

举例：

1、自定义右键菜单到文件浏览器。

2、在侧边栏创建一个新的，交互式的 Treeview。

3、定义一个新的活动条。

4、在状态栏展示信息。

5、使用 WebView API 来渲染自定义内容。

6、扩展源代码管理功能。


### 调试

调试功能插件可以连接代码运行时和 VS Code 的调试 UI。

插件想法：

1、通过实行Debug Adapter，连接 VS Code 的调试 UI和语言运行时。

2、增加语言调试支持。

3、在调试配置属性时提供丰富的智能提示和 Hover信息。

4、提供调试配置片段。

另一方面，VS Code 提供了一组调试插件。在 VS Code debugger 基础之上，你可以书写插件提高用户调试体验。

1、基于动态 debug 配置开始调试会话。

2、跟踪调试会话的生命周期。

3、程序化管理断点。

### 插件限制

为了保证插件不会影响 VS Code 的性能和稳定性，插件没有权限访问 VS Code UI 的 DOM。


