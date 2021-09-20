# single-spa学习笔记

# JS微前端框架

single-spa是一个可以将多个前端应用整合到一个前端应用的框架。有以下收益：

1、不刷新的情况下使用多种框架(React、AngularJS、Angular、Vue... )

2、单独部署你的前端应用

3、单独升级你的前端应用

4、代码懒加载

## Examples

[simple-single-spa-webpack-example](https://github.com/joeldenning/simple-single-spa-webpack-example)

## 架构概览

single-spa受到现代组件系统启发，整个应用有自己单独的生命周期。考虑到JS的框架众多，single-spa可以让您使用任何框架。

Applications，每一个都是一整个 SPA。每个应用需要对url 改变进反应，同时暴露bootstrap，mount 和 unmount 生命周期方法。传统的 SPA 和 single-spa 的 SPA 的主要区别在于：single-spa 的 spa 必须和其它应用共存；single-spa的应用没有自己的HTML页面。

single-spa主页面，包括 HTML页面和注册应用的JS脚本。每一个应用注册三种类型：名称；加载应用代码的函数；应用是否是活跃状态的函数。

single-spa 可以工作在几乎构建框架和应用框架上。可以使用 npm安装，可以使用script标签引用。

## single-spa配置

single-spa配置有两部分构成：1、被所有single-spa-application公用的HTML文件。2、通过注册的singleSpa.registerApplication()。

### index.html文件

index.html一般没有divs和buttons，只注册resgiterApplication。

### 注册应用

为了让single-spa知道什么时候初始化，加载，mount 和 unmount，你必须注册应用程序。

第二个参数loadingFunction需要是一个返回的 promise 的函数，或者直接返回 app 对象。

第三个参数activityFunction必须是一个同步函数，该函数返回布尔值，第一个参数为window.location。

``` js
//registerApplication(name,howToLoad,activityFunction)
singleSpa.registerApplication('app1', loadingFunction, activityFunction)
```

single-spa是一个的顶层的 Router。相应的 URL 激活不同的子应用。

single-spa 会在以下场景调用 activityFunction：

1、hashchange、popstate事件

2、pushstate、replaceState被调用

3、triggerAppChange 被调用

4、checkActivityFunctions 被调用

### singleSpa.start()

start是为了给用户更精细的控制。start 调用之前子应用会被下载，但是不会被 bootstrap，mounted和 unmounted。

### 子应用

子应用就是传统的SPA应用，只是没有HTML页面。

### 子应用生命周期

生命周期必须包括bootstrap、mount和unmount。unload 是可选的。

每一个生命周期方法必须返回Promise。

如果生命周期属性是一个返回 Promise 的函数数组，函数会被依次调用。

如果 single-spa 没有被启动，应用会被下载，但是不会被 bootstrapped、mounted 和 unmounted。

### 子应用生命周期参数

包含一个 props 对象，该对象包含name，singleSpa，mountParcel，customerProps属性。

``` js
function bootstrap(props) {
    const {
        name,
        singleSpa,
        mountParcel,
        customProps
    } = props;
    return Promise.resolve();
}
```

name，子应用名称。

singleSpa，singleSpa的引用。

mountParcel，mountParcel function。

customProps，在registerApplication的第四个参数中传递的自定义属性。

### 生命周期方法执行时间

子应用是懒加载的。如果要在 load 时执行代码，只需写在应用主入口即可。

```js
console.log('application A loading....');
//....
```

#### Bootstrap

bootstrap只会被调用一次，在 mount之前。

#### Mount

子应用的 activity function 返回 true，但当前应用没有mount，该方法会被执行。

#### UnMount

子应用的 activity function 返回 false，但当前应用已mount，该方法会被执行。

#### unLoad

unload是一个可选的生命周期函数。显式调用 unloadApplication 会调用 unload 生命周期函数。

一旦调用unloadApplication，应用的状态会变为 NOT_LOADED，应用激活时会re-bootstrap。

#### timeouts

默认，子应用应用全局的 dieOnTimeout 配置。也可以通过导出 timeouts 对象以设置子应用维度的超时时间。

```js
export const timeouts = {
  bootstrap: {
    mills: 5000,
    dieOnTimeout:
  }
}
```

#### 应用间切换

你可以通过 bootstrap, mount和 unmount 生命周期方法来设置应用间切换动画。

### 应用分割

逻辑上来区分子应用，使得不同的开发团队尽可能独立的工作。

大多数应用微前端的团队将代码放到不同的代码仓库，每个代码仓库有自己单独的构建，发布操作。

### 三种代码组织方式

1、最简单的方式是使用一个代码仓库，一个 build。

优点：设置简单、基础代码复用方便；

缺点：对于子应用不够灵活；build 时间长；不能单独部署。

2、NPM包，子应用打包进 npm 包中，主应用引用各个子应用的npm 包。子应用更新时，需要重新安装，编译和部署。

优点：npm install比较容易设置；每个应用可以单独发布

缺点：主应用更新子应用比较繁琐；设置环境较复杂。

3、动态子应用加载

需要创建一个 manifest 文件用来描述子程序的基本信息。子应用每次更新时需要更新这个 manifest 文件。

### Parcels

一个 single-spa parcel 是一个框架无关的组件。parcel 必须手动调用方法加载。

parcel是主应用维度的。一个 Parcel Config只是一个包含三四个生命周期的对象。

## Applications API

single-spa 导出各个方法和变量。

```js
import {registerApplication, start} from 'single-spa';
//or
import * as singleSpa from 'single-spa';
```

### registerApplication

注册应用的 API，主应用注册子应用的方法。

```js
registerApplication(appName, applicationOrLoadingFn, activityFn, customerProps)
```

### start

主应用调用，在 start 调用之前，子应用会被下载，但是不会被 bootstrap，mount，unmounted。

### triggerAppChange

返回一个 Promise，主要用于测试。

### navigateToUrl

不同的应用之间的跳转。

参数：navigationObj: string | context | DOMEvent

url字符串；有href属性的对象；有 href 的标签上添加 onClick='singleSpaNavigate'方法。

### getMountedApps

参数：无

返回值：appNames: string[]

### getAppNames

参数：无

返回值：appNames: string []

### getAppStatus

参数：appName

返回值：appStatus，NOT_LOADED、LOADING_SOURCE_CODE、NOT_BOOTSTRAPPED、BOOTSTRAPPING、NOT_MOUNTED、MOUNTING、MOUNTED、UNMOUNTING、UNLOADING、SKIP_BECAUSE_BROKEN、LOAD_ERROR。

LOAD_ERROR后，重新进入该路由会重新下载。

### unloadApplication

unloadApplication 会把子应用状态设置为 NOT_LOADED 状态，下次进入时会 bootstrap 该子应用。

参数：appName，options:{waitForUnmount:true}

返回值：Promise

函数执行路径：

1、调用应用的 unload 生命周期函数。

2、把应用状态设置为 NOT_LOADED

3、触发reroute，single-spa可能会重新mount该子应用。

### checkActivityFunctions

会调用每个子应用的 activity function。

参数：mockWindowLocation: string|Object，代表windoww.location的字符串。

返回：appNames，location 下应该活跃的应用。


