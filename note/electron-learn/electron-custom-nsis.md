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

在一个普通的安装包里用户需要安装许多东西。eg：NSIS安装包里你可以选择安装源码、附加插件、脚本样例或其它。里面的每个组件都有它自己的代码块，当用户选择了安装该组件，那么安装程序就会执行对应的代码。

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

## 调试脚本

如果你想实现更多的功能，那么你的脚本就会变得更复杂。这将会增加出错的可能性。使用MessageBoxes或DetailPrint来显示变量的内容，所有变量使用DumpState插件来勾画总体大纲。

## 编译器命令

编译器命令在你编译时在你的电脑上执行。他们可以用于条件编译、包含头文件、运行一个应用程序、改变工作目录和更多。最常见的用法是，定义编译时的常量。例如：定义你的产品版本号并在你的脚本里使用。

```bash
!define VERSION "1.0.3"
Name "My Program ${VERSION}"
OutFile "My Program Installer - ${VERSION}.exe"
```

另一种场景的命令是宏。宏用于在编译时插入代码，依赖于定义并使用定义的值。宏的命令在编译时会插入，这样你只需要写一个通用的代码并只需要作为小的更改就可以多次使用。

```bash
!marcro MyFunc UN
Function ${UN}DoRegStuff
  Call ${UN}DoRegStuff
  ReadRegStr $0 HKLM Software\MyProgram Key
  DetailPrint $0
FunctionEnd
!marcroend
!insertmacro MyFunc ""
!insertmacro MyFunc "un."
```

宏帮助你避免在安装部分和卸载部分写重复的代码。上面的!insertmarcro插入了两个函数，一个用于MyFunc用于安装部分，另一个是un.MyFunc用于卸载部分。

## 编译器

建立了你的脚本后所要做的第二件事是编译你的脚本。MakeNSIS.exe就是NSIS编译器，它会载入你的脚本，解析并建立你的安装程序。

要编译你的.nsi文件，可以点击右键并选择「Compile NSI」，这样将会使用MakeNSISw来引导并调用MakeNSIS来编译你的脚本。

编译器会检查你的脚本并给出警告或错误。也可以在Linux、BSD或Mac OS X上编译安装程序。

## 新用户界面

一个流行的NSIS用户界面就是新式用户界面，它有着像最近的windows版本一样的界面。它的特点在于有白色的顶部来描述目前步骤、在组件选择页面有一个描述区域、一个欢迎页面、一个安装结束页面并允许用户选择额进行安装的应用程序或是重启电脑及更多功能。

## 插件

NSIS支持从脚本里调用插件，插件是由一些C、C++、Delphi或其它程序语言写的DLL文件，可以提供基于NSIS的更多增强型代码。

一个插件的调用像这样：DLL名::函数名 "参数1" "参数2" "参数3"

NSIS可识别的插件会列表出编译器输出的顶部。NSIS会在NSIS目录下的Plugins目录里寻找插件并且会列出所有可用的函数。你也可以使用!addPluginDir来告诉NSIS在另外的目录里寻找插件。

NSIS已有很多插件，InstallOptions是一个受欢迎的插件，它允许你建立自定义的页面，并与NSIS页面命令结合。

## MakeNSIS的使用

NSIS的安装程序通过MakeNSIS程序来把.nsi脚本编译成可执行的安装程序。NSIS开发工具包已安装在你的电脑里，你只需要在资源管理器的.nsi档案上点击右键即可。

命令行里使用MakeNSIS，MakeNSIS命令的语法为：

```bash
makensis 选项 script.nsi - [...]
```

### 选项

/LICENSE，显示一个许可页面

/V，后面跟随0-4数字设定了输出。0，无输出，1，仅错误，2、警告和错误，3、信息、警告和错误；4、全部输出。

/O，后面跟随的文件告诉编译器输出记录到文件而不是屏幕。

/PAUSE，使得makensis在退出前暂停。

/NOCONFIG，禁止包含\nsiconf.nsh，没有这个参数的话，安装程序预设从nsiconf.nsi读取设定。

/CMDHELP，输出基本的命令用户信息，或所有命令。

/HDRINFO，输出Makensis编译的选项讯息。

/NOCD，禁止把目前目录更改到.nsi文件。

使用/D或将符号新增到全局定义列表。请看!define。

使用/X将会执行你随后指定的代码，/X AutoCloseWindow false。

对脚本名指定一个破折号-将会通知Makensis把标准输入作为源来使用。

### 注意事项

参数是按照次序来处理的，makensis /Ddef script.nsi和makensis script.nsi /Ddef是不同的。

如果指定了多个脚本，他们将会被连接起来作为一个脚本来处理。

## 例子

```bash
# 基本用法
makensis.exe myscript.nsi
# 安静模式
makensis.exe /V1 myscript.nsi
# 强行设定压缩器
makensis.exe /X"SetCompressor /FINAL lama" myscript.nsi
# 改变脚本的行为
makensis.exe /DUSE_UPX /DVERSION=1.337 /DNO_IMAGES myscript.nsi
```

## 安装程序的使用

生成的安装程序和卸载程序接受一些命令行的参数，这些参数可以让用户在安装过中对安装程序做部分控制。

### 公共选项

/NCRC，禁止CRC检测，除非在脚本里强制使用了CRCCheck。

/S，静默运行安装程序或卸载程序。

/D，指定预设的安装目录，可以越过InstallDir和InstallDirRegKey，这个参数必须是最后一个参数并且不能带任何引号即使路径带有空格。

### 卸载程序特殊选项

_?=指定的$INSTDIR，这也会阻止卸载程序把它自己复制到临时文件夹再运行。

### 例子

```bash
installer.exe /NCRC
installer.exe /S
installer.exe /D=C:\Program Files\NSIS
installer.exe /NCRC /S /D=C:\Program Files\NSIS
uninstaller.exe /s _?=C:\Program Files\NSIS
#静默卸载旧版本，并等待它完成后才继续
ExecWait '"$INSTDIR\uninstaller.exe" /S _?=$INSTDIR'
```

## 脚本档案的格式

一个NSIS脚本文件.nsi就是一个包含了脚本代码的文本文件。

### 命令

行为命令 「参数」 这样的格式。

### 注释

以「;」或「#」开始的行为注释。可在命令后添加注释。也可以使用C规范的注释来注释一行或多行。

```bash
;注释
#注释
/*
注释
*/
command commandParam ;注释
```

### 插件

要调用一个插件，使用插件::命令 [参数]。

```bash
nsExec::Exec "我的文件"
```
### 数字

数字参数，十进制，十六进制(0x开头)，或八进制(00)。颜色设定为HTML-RGB的形式，但没有#。

```bash
IntCmp 1 0x1 lbl_equal
SetCtlColors $HWND CCCCCC
```

### 字符串

字符串需要用引号括起来。可以使用$\来省略引号的解析。

```bash
MessageBox MB_OK "我会很开心"
MessageBox MB_OK '他对我说“你好!”'
MessageBox MB_OK `然后他对我说“我不好”`
MessageBox MB_OK "$\"智者名言$\""
```

在字符串里使用Enter、换行、Tab等，请使用$\r,$\n,$\t等。

### 变量

用户变量应该实现声明，并且不区分大小写。

```bash
Var MYVAR
StrCpy $MYVAR "变量值"
```

### 长命令

要把命令扩充为多行，需要在行尾使用反斜杠\。

```bash
CreateShortCur "$PROGRAMS\NSIS\ZIP2EXE project workspace.lnk" \
   "$INSTDIR\source\zip2exe\zip2exe.dsw"
```

### 配置档案

如果在makensis.exe同目录下存在nsiconf.nsh，它里面的代码将会被包含在任何脚本里。除非使用/NOCONFIG命令参数。


## 标记

标记是Goto指令的的目标，或各种分支指令的目标。标记必须存在于一个区段或函数里，标记是局限于该范围里的。

声明一个标记，标记不能以-、+、!、$或0-0开头。一个标记以.开头表示这是一个全局的标记。

```bash
MyLabel:
```

## 相对跳转

相对于被调用的地方，在任何你可用到标记的地方你都可以相对跳转。+1转移到下一条指令，+2会跳过一条指令并且从目前指令转到第二条指令。-2，+10依次类推。

一条指令就是在安装程序时可以被执行的所有命令。MesageBox，Goto、GetDLLVersion、FileRead、SetShellVarContext都是指令。AddSize、Section、SectrionGroup、SectionEnd、SetOverwrite，Name，SetFont、LanguageString都不是指令，因为它们在编译时就被执行。

```bash
Goto +2
  MessageBox MB_OK "看不到这条消息"
MessageBox MB_OK "上一条信息被略过，这条讯息被展示"
```

## 页面

每个NSIS都有一个页面设定，每个页面可以是一个NSIS内建页面或由一个用户函数建立的自定义页面。

使用这些脚本你可以控制这些页面的次序、外观、作用。可以略过页面、颜色绘为白色、强制用户停留在某个页面直到特定条件成立、显示一个说明文件页面、给输入显示一个自定义页面或者更多的功能。

两个基本的命令：Page和UninstPage，前一个为新增一个页面到安装程序，后一个为新增一个页面到卸载程序。PageEx命令在它们前面可以新增一个页面且包括一些选项。

### 次序

页面的次序由Page，UninstPage或PageEx出现在脚本里的次序决定。

```bash
Page license
Page components
Page directrory
Page instfiles
UnistPage unistConfirm
UnistPage instfiles
```

为了向后兼容，如果没有使用到安装程序页面命令，一些预设的程序页面会被新增。


### 页面选项

每个页面都有它自己唯一的信息设定外观和作用。

下面列表列出了某个页面类型受到什么样的命令的影响。

许可页面：LicenseText，LicenseData，LicenseForceSelection。

组件选择页面：ComponentText。

目录选择页面：DirText，DirVar(仅PageEx可用)，DirVerify

卸载安装记录页面：DetailsButtonText，CompletedText。

卸载确认页面：DirVar(仅PageEx可用)，UninstallText。



## 参考文档

https://omega.idv.tw/nsis/Contents.html

https://nsis.sourceforge.io/Wiki/