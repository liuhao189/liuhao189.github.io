# 用户指导

## 基本编辑

### Hot Exit

VSCode在你正常退出时，会记住没有保存的文件内容。正常的退出为file > exit。

### 查找

默认查找弹框出现时，会将你光标下的词填充到查找框中。可以使用“ediror.find.seedSearchStringFromSelection”来禁用此行为。


选中查找框的“汉堡包”的图标，会在选中的区域内搜索。可以通过“editor.find.autoFindInSelection”来默认从选中区域搜索。

跨文件搜索快捷键，Shift+Cmd+F。

跨文件搜索时，排除和包括的文件可以使用glob配置。

*匹配一个或多个字符，?匹配一个字符，**，匹配多个路径分隔符，{}，条件分组，eg:{**/*.html,**/*.txt},[]声明一个字符集合，eg:example.[0-9]

### 代码区域

为了代码可读性，我们可以自己添加region。

CSS/LESS/SCSS中使用/* #region */ 和 /* #endregion */

markdown中使用<!-- #region one -->和 <!-- #endregion -->

typescript和javascript中使用 //#region 和 //#endregion







