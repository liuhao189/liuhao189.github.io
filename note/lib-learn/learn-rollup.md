# Rollup打包器

Rollup是一个JS模块打包器，可以将小块代码编译程大块复杂的代码。eg：libray或应用程序。

Rollup对代码模块使用新的标准化格式，这主要指的是ES6模块。

## 快速入门指南

```bash
npm i rollup -g
rollup -v
```
Rollup可以通过命令行接口配合配置文件来调用，也可以使用JS API来调用。

```bash
# iife
rollup main.js --file bundle.js --format iife
# cjs
rollup main.js --file bundle.js --format cjs
# umd umd需要一个名字
rollup main.js --file bundle.js --format umd --name 'myBundle'
```

## 为什么使用

将项目拆分成小的单独文件，这样开发软件通常会很简单，因为这通常会消除无法预知的相互影响，以及显著降低了所要解决的问题的复杂度。

## Tree-shaking

除了使用ES6模块之外，Rollup还静态分析代码中的import，并将排除任何未实际使用的代码。这允许您架构于现有工具和模块之上，而不会增加额外的依赖或使项目的大小膨胀。

显式得import和export语句的方式，它远比在编译后的输出代码中，简单地运行自动minifier检测未使用的变量更有效。

## 兼容性

Rollup可以通过插件导入已存在的CommonJS模块。

## 发布ES6模块

为了确保你的ES6模块可以直接与运行在CommonJS中的工具使用。你可以使用Rollup编译为UMD或CommonJS格式。

然后在package.json文件的main属性中指向当前编译的版本。如果你的package.json中有module字段，Rollup和Webpack2这样的ES6感知工具将会直接导入ES6模块版本。

## 命令行接口

一般场景下，直接使用rollup的命令行命令即可。你可以提供一个rollup config文件来简化命令行的使用。config 文件也可以更好的支持高级功能。

一般配置文件在项目根目录，命名为rollup.config.js。在后台，rollup在使用rollup.config.js之前将其编译为CommonJS的格式。

如果你想直接使用CommonJS的方式来书写rollup.config.js，你可以将文件名改为rollup.config.cjs。

在NodeJS 13++的版本上，可以命名为rollup.config.mjs，也可以避免rollup编译，来直接使用ES module的版本。

你可以使用其它语言来书写rollup.config文件。eg：typescript。

```bash
# 需要先安装 @rollup/plugin-typescript
rollup --config rollup.config.ts --configPlugin typescript
```

## 配置文件

### 核心功能

1、external：string | RegExp | (id:string,parentId:string,isResolved:boolean) => boolean。

id应该是：1、外部依赖的名字，import语句中的名字。2、resolved ID，类似文件的绝对路径。

```js
// rollup.config.js
import path from 'path';

export default {
  //...,
  external: [
    'some-externally-required-library',
    path.resolve( __dirname, 'src/some-local-file-that-should-not-be-bundled.js' ),
    /node_modules/
  ]
};
```

注意，如果你想通过/node_modules/过滤掉import的包，eg：import { rollup } from 'rollup'。你首先需要安装@rollup/plugin-node-resolve。

命令行中指定参数时：

```bash
rollup -i src/main.js ... -e foo,bar,baz
```

function(id,parent,isResolved)，id是模块id，parent是import模块的模块id，isResolved是否resolved。

当创建iife或umd格式的包时，你需要在output.global中提供global变量名来替换引用的地方。

当使用相对路径import包时，rollup会内部解析为绝对路径，所以不同的import可以合并到一个import。

```js
// input
// src/main.js (entry point)
import x from '../external.js';
import './nested/nested.js';
console.log(x);

// src/nested/nested.js
// the import would point to the same file if it existed
import x from '../../external.js';
console.log(x);

// output
// the different imports are merged
import x from '../external.js';

console.log(x);

console.log(x);
```

