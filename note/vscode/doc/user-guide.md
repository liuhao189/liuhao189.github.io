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



