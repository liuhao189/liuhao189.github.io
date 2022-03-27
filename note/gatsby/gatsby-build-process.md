# Gatsby-Build-Process

Gatsby的核心理念之一是使用React DOM的服务器端渲染API来生成静态HTML内容。另外一个核心特性是静态HTML内容可以被客户端JS通过React hydration来增强。

## 构建和渲染静态资源

执行gatsby build会启动一个Node进程来处理你的应用。所有的依赖在构建时被收集，然后写到public文件夹。

你可以自定义Gatsby的配置来修改babel、webpack，html的生成逻辑。

## ReactDOM.hybrate

hybrate会被Gatsby内部调用。React官方文档说：hybrate的作用和render类似，hybrate用于一个DOM容器，该DOM容器的内容由ReactDOMServer生成。

这意味着浏览器会处理Server处理不了的内容，然后渲染到页面中。因为数据和页面结构都已经确定，不用再去另外的服务器请求数据。

## React reconciler

ReactDOM hybrate内容后，React reconciler开始负责根据state或props的变化来更新UI。

# Gatsby构建步骤

## 构建时和运行时

构建时：使用Sever来构建页面相关的文件，Browser API不可用。

运行时：主要是在浏览器中运行。

gatsby develop命令不会执行gatsby build会执行的一些构建步骤。

gatsby develop会启动一个开发服务器，你可以使用开发服务器在浏览器中预览你的页面。

当你使用使用gatsby build时，没有浏览器可用，所以你需要一些检测来避免直接调用浏览器的API。

## 了解gatsby develop

主要在背后启动一个Server，提供热加载和Gatsby的数据浏览页面等功能。主要用于开发调试。

```bash
success open and validate gatsby-configs - 0.051 s
success load plugins - 0.591 s
success onPreInit - 0.015 s
success initialize cache - 0.019 s 
success copy gatsby files - 0.076 s
success onPreBootstrap - 0.021 s

success source and transform nodes - 0.082 s
success Add explicit types - 0.018 s
success Add inferred types - 0.106 s
success Processing types - 0.080 s
success building schema - 0.266 s

success createPages - 0.014 s
success createPagesStatefully - 0.067 s
success onPreExtractQueries - 0.017 s
success update schema - 0.034 s
success extract queries from components - 0.222 s
success write out requires - 0.044 s
success write out redirect data - 0.014 s
success Build manifest and related icons - 0.110 s
success onPostBootstrap - 0.130 s
#
info bootstrap finished - 3.674 s
#
success run static queries - 0.057 s — 3/3 89.08 queries/second
success run page queries - 0.026s - 3/3 114.85/s
success start webpack server - 1.707 s — 1/1 6.06 pages/second
```

## 了解gatsby build

gatsby build会整体构建你的应用。会使用一些代码构建优化手段，将应用配置，数据代码打包；创建所有静态HTML页面。

```bash
success open and validate gatsby-configs - 0.062 s
success load plugins - 0.915 s
success onPreInit - 0.021 s
success delete html and css files from previous builds - 0.030 s
#
success initialize cache - 0.034 s
success copy gatsby files - 0.099 s
success onPreBootstrap - 0.034 s
success source and transform nodes - 0.121 s
success Add explicit types - 0.025 s
success Add inferred types - 0.144 s
success Processing types - 0.110 s
success building schema - 0.365 s
success createPages - 0.016 s
success createPagesStatefully - 0.079 s
success onPreExtractQueries - 0.025 s
success update schema - 0.041 s
success extract queries from components - 0.333 s
success write out requires - 0.020 s
success write out redirect data - 0.019 s
success Build manifest and related icons - 0.141 s
success onPostBootstrap - 0.164 s
#
info bootstrap finished - 6.932 s
#
success run static queries - 0.166 s — 3/3 20.90 queries/second
success Generating image thumbnails — 6/6 - 1.059 s
success Building production JavaScript and CSS bundles - 8.050 s
success Rewriting compilation hashes - 0.021 s
success run page queries - 0.034 s — 4/4 441.23 queries/second
 #
success Building static HTML for pages - 0.852 s — 4/4 23.89 pages/second
info Done building in 16.143999152 sec
```

## develop和build的差异

在“info bootstarp finished”之前都是一样的。gatsby build执行了额外的任务。

下面是差异的代码：

```bash
success open and validate gatsby-configs - 0.051 s
success load plugins - 0.915 s
success onPreInit - 0.021 s
+ success delete html and css files from previous builds - 0.030 s
success initialize cache - 0.034 s
success copy gatsby files - 0.099 s
success onPreBootstrap - 0.034 s
success source and transform nodes - 0.121 s
success Add explicit types - 0.025 s
success Add inferred types - 0.144 s
success Processing types - 0.110 s
success building schema - 0.365 s
success createPages - 0.016 s
success createPagesStatefully - 0.079 s
success onPreExtractQueries - 0.025 s
success update schema - 0.041 s
success extract queries from components - 0.333 s
success write out requires - 0.020 s
success write out redirect data - 0.019 s
success Build manifest and related icons - 0.141 s
success onPostBootstrap - 0.130 s
⠀
info bootstrap finished - 3.674 s
⠀
success run static queries - 0.057 s — 3/3 89.08 queries/second
- success run page queries - 0.033 s — 5/5 347.81 queries/second
- success start webpack server - 1.707 s — 1/1 6.06 pages/second
+ success run page queries - 0.026s - 3/3 114.85/s
+ success Generating image thumbnails — 6/6 - 1.059 s
+ success Building production JavaScript and CSS bundles - 8.050 s
+ success Rewriting compilation hashes - 0.021 s
+ success Building static HTML for pages - 0.852 s — 4/4 23.89 pages/second
+ info Done building in 16.143999152 sec
```

在启动阶段只有一处不同：删除上一次构建的html和css，以避免冲突。

在build阶段：build不会启动devServer，而是去编译资源。

develop因为省略后面的步骤，可以增加热架加载的功能。也可以节省CPU的时间，以快速启动。

执行page Query的数量上也有差异：develop最多运行3个页面查询(index page, actual 404 和develop 404)，剩余的页面会请求时再查询。build会执行所有页面的数据。

cache也用于检测gatsby-*.js的文件和依赖项。可以使用gatsby clean命令来情况缓存。

## Gatsby build发生了什么？

代码在git仓库的build和bootstrap文件中。

Gatsby-Layer：

1、Content，一般存放在DB，Content-Management-Systems，files，外部API。所有数据源都可以链接到gatsby中。

2、Build，编译你的应用程序，拥有SSR，route based代码拆分等特性。在构建期间，数据会被读取并合并到GraphQL的结构中。

3、Data，通过GraphQL取到数据。data已在上一步聚合到一起，所以可以查询多个数据源的数据。

4、View，React组件构成的应用。你可以将任何上面步骤取到的数据注入到组件中。

在高层次上，gatsby build做的事：

1、你在gatsby-config.js中定义的plugins和你的gatsby-node.js文件定义了Node对象的来源。

2、从Node对象推断出schema。

3、页面是根据JS组件或安装的主题生成。

4、GraphQL查询为所有页面提供数据。

5、静态HTML文件生成，然后放到public文件夹。

## Bootstarp阶段

包括：

1、读取并验证getsby-configs。config验证。

2、加载插件。Gatsby使用Redux来管理内部的状态。

3、onPreInit，执行插件或配置文件的onPreInit的API方法。

4、从上个build删除html和css文件。

5、初始化缓存，检查package.json中的依赖，gatsby-config.js或gatsby-node.js文件是否改变。

6、拷贝应用的文件到.cache文件夹。

7、onPreBootstrap，执行插件或配置文件的onPreBootstrap的API方法。

8、数据源和转换nodes，执行sourceNodes的API方法。

9、添加明确的类型，添加gatsby定义的GraphQL相关的类型到nodes。

10、推断类型，其它未明确定义类型的node，gatsby会推断。

11、处理类型，组合各种类型来生成GraphQL的结构。

12、构建schema。

13、createPages，调用CreatePages API。插件可以处理onCreatePage事件来修改页面信息。

14、createPagesStatefully，和crteaPages类似，主要用于插件根据数据变化来创建和删除页面。

15、onPreExtractQueries，调用onPreExtractQueries的API。

16、更新schema。

17、提取组件的queries。

18、生成rquire代码。

19、生成redirect data的代码。

20、构建manifest和相关的icon。主要是gatsby-plugin-manifest插件。

21、onPostBootstrap-API的执行。

## build步骤

1、运行static-queries，在非页面组件中的static-queries会优先执行。

2、生成图片合各种尺寸图，主要是gatsby-plugin-sharp插件提供的。

3、生成prod的JS和CSS包。使用Webpack编译JS和CSS。

4、重写编译hash，编译hash主要作用是webpack拆分代码，保持缓存。

5、执行page-queries。

6、生成页面的static html文件。因为HTML是在Node的上下文中生成的，使用browser API的代码应该不执行。


## 成功的build后的产物

当gatsby build成功后，你可以直接部署public文件夹里的内容。构建包括了压缩的文件，转换好的图片，json文件，页面的HTML文件。

## 参考文档

https://www.gatsbyjs.com/docs/conceptual/overview-of-the-gatsby-build-process