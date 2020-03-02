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

