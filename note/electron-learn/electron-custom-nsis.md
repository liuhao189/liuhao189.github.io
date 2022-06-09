# NSIS自定义脚本

## 关于NSIS

在用户使用你的应用程序之前首先会体验到你的安装程序。慢慢悠悠或繁琐的安装是恼人的问题，一个快速友好的安装程序是展示你的软件产品品质的一部分。

NSIS(Nullsoft Scriptable Install System)是Windows下的一个工具，它允许程序员建立安装程序，它是开源的并且对可被任何使用者免费使用。

NSIS建立的安装程序能够安装、卸载、设定系统设置，解压档案等。因为它是基于脚本档案，你可以完全的控制安装程序的每一部分。脚本语言支持变量，函数，字符串操作，就像一个普通的程序语言一样。

即使有这么多的特性，NSIS仍然是最小的安装程序系统，在预设选项下，仅增加了34KB的开销。

## 主要功能

### 很小的额外开销

NSIS具有体积小，速度快和高效率的特点。其它程序需要几百KB和几MB，一个具有完整功能的NSIS安装程序仅占用34KB的额外开销。

### 兼容所有主流的Windows操作系统

支持主流的windows操作系统。

### 独特的压缩方法

你可以在ZLib，BZip2,LZMA完整的压缩方法中选择其一，新的LZMA压缩有比其它通用压缩方法更好的效果。

### 基于脚本

NSIS有强大的脚本语言，该脚本语言被设计来专门制作安装程序并可以帮助你执行任何安装任务的命令。可以容易的自定义逻辑和处理不同的升级，版本检测等。

### 支持多语言

安装程序中支持多语言，本身包含超过40种翻译。

### 许多特性和对目标系统的检测

脚本系统提供的命令可以在目标系统上使用。从简单的功能(建立文件夹，注册表编辑到文字，二进制档案修改，修改环境变量，重启系统)，使用提供的插件甚至可以使用Windows API。

### 插件系统

NSIS可以由插件来扩展，他们可以由C，C++，Delphi或其它语言来执行安装任务或扩展安装程序界面。使用这些插件只需要一行代码，插件也可以像其它安装资料一样被压缩且仅在你使用它们的功能的时候被包含进来。

### 支持网络安装

NSIS包含的一系列插件使你可以从网络下载文档，连接网络，对存在的文档打补丁。

### 风格不同的包

NSIS编译器有强大的预处理器，这使得你很容易得整合多个风格到单个安装程序，可以产生不同的版本。比如：精简版和完全版。

### 容易且人性化的易读档案格式

NSIS脚本格式和用于界面的格式是容易的、人性化的且易读的，可以使用你喜欢的编辑器来编辑你的档案。

## 特性列表

1、生成包含可执行安装程序的外壳。

2、支持ZLib，BZIP2和LZMA资料压缩，文件个别压缩。

3、支持卸载，生成安装程序和卸载程序。

4、可自定义的用户界面，对话，字型，背景，文字，检测标记，图档等。

5、典型和新式向导页面。

6、完整的多语言，支持一个安装程序有多个语言。自带超过35种语言翻译。

7、页面系统，可以新增标准向导页或自定义页面。

8、用户可选择安装组件，树形组件列表。

9、多个安装配置，通常最小，典型，完全和自定义配置。

10、安装程序自我验证使用CRC32校验和。

11、可以显示文字或RTF格式的许可协议。

12、可以通过注册表检测目标目录。

13、易用的插件系统，大多数插件可帮用户建立自定义对话，网络连接，HTTP下载，档案打补丁，调用Win32 API等。

14、安装程序可以达到2GB最高限制。

15、可选性的静默安装模式用于自动安装。

16、预处理器支持定义符号、宏、条件编辑，标准预设定义。

17、有意义的类似与PHP和汇编的编程体验，包含用户变量，堆栈，流程控制等。

18、安装程序有它们自己的VM，使你书写的代码可以支持：文件解压；文件、目录复制、重命名、删除、搜寻；调用插件DLL；DLL/Active控件注册、反注册；可执行外部程序，外部执行并带有等待选项；建立快捷方式；注册表读取、设定、搜寻、删除；INI档案读取、写入；惯用文字档案读取、写入；强大的字符和整数处理；基于类名和标题判断视窗；用户界面操作字型、文字设定；发送windows消息；通过消息框或自定义页面与用户交流；分支，比较等等；错误检测；支持重启，包括重启后删除或重命名档案；安装程序行为命令，比如显示、隐藏、等待等等；在脚本可以使用用户函数；对用户的动作回调函数。

## 基础

你下载或购买的软件，大多带有安装程序。安装程序能复制及更新档案，写入注册表键值、写入设定信息，建立快捷方式等。用户所做的仅仅是补充一些必要信息。

NSIS是开发者建立安装程序的工具，NSIS允许你建立任何事情，从最基本的复制档案的安装程序，到含有注册表主键、设定环境变量。从网络下载最新版本、定制配置档案等大量复杂任务的安装程序。NSIS具有极高的灵活性，而其脚本语言也易于学习。

### 脚本档案

要建立NSIS安装程序，首先要写一个NSIS脚本，NSIS脚本仅仅是一个包含了特殊语法的文字档案。

NSIS脚本里每一行都作为一个命令处理，如果这一行太长的话可以使用\来分隔，编译器会自动把下一行接到上一行来作为完整的一行，而不是看作新的行。

如果在字符串里需要使用双引号，应该使用$\"来避免误解，或者使用另外的不引起歧义的引号`或'。

脚本文件后缀为.nsi，头文件为.nsh，头档案可以通过把它划分为一个或多个代码块来帮你编排脚本。也可以在头文件里加入功能函数或宏，并且在多个安装程序里包含头文件，这样可以更容易升级你的程序。

把一个头文件包含在你的脚本里可以使用!include，这样就可以仅使用名字包含位于NSIS目录下的Include目录下的头文件。

```bash
!include Secttions.nsh
```
### 脚本结构

一个NSIS脚本应该包括安装程序属性，区段、函数。你也可以使用编译器命令在编译的时候进行指定。所必须的是OutFile指令(输出目录)和一个区段。

#### 安装程序属性

安装程序属性确定你的安装程序的性能、外观和习惯。这些命令大多数在运行时仅被设定并且不能更改，其它基本的指令为Name和InstallDir。

AddBrandingImage，AllowRootDirInstall，AutoCloseWindow，BGFont，BGGradient，BrandingText，Caption，ChangeUI，CheckBitmap，CompletedText，ComponentText，CRCCheck，DetailsButtonText，DirText，

#### 页面

一个非静默安装的程序需要向导页面来指导用户进行安装，你可以通过Page命令或更高级的PageEx，来设定哪个页面显示。一个典型的设定像这样。

```bash
Page license
Page components
Page directrory
Page instfiles
UninstPage uninstConfirm
UninstPage instfiles
```

#### 区段

在一个普通的安装包里用户需要安装许多东西。eg：NSIS分配安装包里你可以选择安装源码、附加插件、脚本样例或其它。里面的每个组件都有它自己的代码块，当用户选择了安装该组件，那么安装程序就会执行对应的代码。

在脚本里，这些代码称为区段。每个可见的区段都可以作为一个组件给用户选择是否安装。你可以只使用一个区段来构建安装包，如果你想要使用组件页来让用户选择可选的组件，那么你就需要使用多个区段。

卸载程序也可以有多个区段，卸载程序区段名前要加上前缀un.。

```bash
Section "Installer Section"
SectionEnd

Section "un.Uninstaller Section"
SectionEnd
```

使用在段里的指令和安装程序属性指令不一样，他们在用户电脑运行环境里执行。这些指令可以解压文件，读取和写入注册表，ini档案或普通文件，建立目录，建立快捷方式和更多功能。你可以在指令找到更多。


```bash
Section "My Program"
   SetOutPath $INSTDIR
   File "My Program.exe"
   File "Readme.txt"
SectionEnd
```

#### 函数

函数和区段类似，也包含代码。区段和函数所不同的是他们被调用的形式，一共有两种函数类型，用户函数和回调函数。

用户函数可以从一个区段里或另一个函数使用call指令。用户函数不能直接执行而只能调用它。在函数内的代码都会被执行然后安装程序会继续执行Call指令后面的指令，除非你在函数里使用了退出指令。

回调函数可以在某些定义事件之前被调用比如当安装程序开始运行时。回调是可选的。eg：欢迎用户使用你的安装程序你可以定义一个名为.onInit的函数，NSIS编译器会由它的名字知道它是一个回调函数。

```bash
Function .onInit
  MessageBox MB_YESNO "即将安装我的程序，要继续吗？" IDYES gogogo
    Abort
  gogogo:
FunctionEnd
```

Abort有特殊含义。

回调函数：onGUIInit，onInit，onInstFailed，onInstSuccess，onGUIEnd，onMouseOverSection，onRebootFailed，onSelChange，onUserAbort，onVerifyInstDir，un.onGUIInit，un.onInit，un.onUninstFailed，un.onUninstSuccess，un.onGUIEnd，un.onRebootFailed，un.onUserAbort。

## 脚本的工作方式

### 变量

可以用Var命令来声明自己的变量，变量是全局的并且在任何区段或函数中使用。

```bash
Var BLA;
Section bla
  StrCpy $BLA "123";
  # now $BLA is "123"
SectionEnd
```

另外堆栈可以用来临时存储，使用Push和Pop命令来浏览堆栈。Push添加到堆栈，Pop移除一个值并设定该变量。

已注册变量：$0-$9，$R0-$R9。

$INSTDIR安装目录，可以使用Strcpy，ReadRegStr，ReadINIStr等等来更改，eg：在.onInit函数可以用来做高级的检测安装定位。
注意在卸载程序中，$INSTDIR为卸载程序所在的目录而不是安装程序中所指定的目录。

$OUTDIR，目前输出目录，通过SetOutPath设定或通过StrCpy，ReadRegStr，ReadINIStr等。

$CMDLINE，安装程序的命令行输入。eg：xxx.exe 参数 参数 参数。对于解析参数，参阅GetParameters，如果在命令行中指定了/D，那么/D后面的参数不会存储到$CMDLINE。

$LANGUAGE，目前使用的语言标识符。eg：英语是1033，可以在.onInit里更改。

对于公共代码，这里有20个已注册的变量($0,$R0)，想在公共代码里使用这些变量，可以把原始的值存储到堆栈并随后还原原始值。

```bash
Function bla
  Push $R0
  Push $R1
  # ...code... #
  Pop $R1
  Pop $R0
FunctionEnd
```

### 常量

常量通常用在InstallDir属性里。

需要注意的是，一些新的常量并不是在所有OS上都是正常的。

$PROGRAMFILES，通常为C:\Program Files但是运行时会检测。

$DESKTOP，windows桌面目录。预设为目前用户桌面。

$EXEDIR，安装程序运行时的位置。

${NSISDIR}，包含NSIS安装目录的一个标记，在编译时会检测，常用于你想调用一个在NSIS目录下的资源时，例如：图片，界面。

$WINDIR，windows目录，通常为c:\Windows。

$SYSDIR，Windows系统目录，通常为c:\Windows\system。

$TEMP，系统临时目录。通常为c:\windows\temp。

$STARTMENU，开始菜单目录，常用于新增一个开始选项，使用CreateShortCut。

$SMPROGRAMS，开始菜单程序目录。

$SMSTARTUP，开始菜单，启动目录。

$QUICKLAUNCH，快速启动目录。

$DOCUMENTS，文档目录。

$SENDTO，该目录包含了发送到菜单快捷项。

$RECENT，最近文件的快捷方式。

$FAVORITES，该目录包含了指向用户网络收藏夹、文件等的快捷方式。

$MUSIC，音乐。

$PICTURES，图片。

$VIDEOS，视频。

$NETHOOD，我的网络位置。

$FONTS，系统字型目录。

$TEMPLATES，文件模板目录。

$APPDATA，应用程序数据目录。





## 参考文档

https://omega.idv.tw/nsis/Contents.html

https://nsis.sourceforge.io/Wiki/