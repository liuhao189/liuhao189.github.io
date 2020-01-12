# 微前端工程实现

## 前言

本文不论证做不做微前端，只谈如何实现微前端。

## 主应用和子应用

微前端在逻辑上需要将应用划分为主应用和子应用。

主应用功能包括：
1、注册子应用；
2、切换子应用（子应用生命周期以及子应用资源管理），沙盒机制；
4、公共展示区域（导航栏，header，footer，子应用占位元素等）；
5、子应用权限管理；
6、应用间共享的方法，数据，应用通信总线。

子应用功能主要是业务页面。

    子应用应该按照业务或功能划分，尽量做到子应用独立，子应用之间不要有太多交互。

## 项目改造

### 打包构建

主应用打包构建和传统SPA 差异不大。

子应用打包构建和传统 SPA 主要是产物的区别。

传统SPA，构建产物为 HTML 文件和资源文件（CSS，JS，IMG等）。

子应用，构建产物只是资源文件（CSS，JS，IMG等），子应用入口文件需要导出特定函数以供主应用调用。

子应用如果使用类似的库，可以考虑将此子应用们使用的通用类库转移到主应用中。eg：子应用都是Vue+ElementUI+Vuex+VueRouter，将这些类库以script tag的方式引入主应用，子应用Webpack配置externals。

    子应用可以既编译为传统SPA，又编译为“微前端子应用”。这样子应用可以被独立使用。

  

### 本地开发

主应用本地开发和传统SPA类似。

子应用本地开发可以本地起该子应用的页面，本地开发测试完成后，部署到相应环境进行集成测试。

    如果想本地直接集成测试，可以将主应用页面起来，然后替换当前子应用资源地址。

### 文档建设

为了让微前端应用运行得更好。应该定下应用应该遵循的的开发规则。

### 接口改造

有了主应用后，所有请求都是主应用域名发出去的。对于一些子应用的接口可能会存在跨域问题。

解决方案主要有两种：

1、子应用接口方支持CORS协议(nginx配置即可)；

2、主应用服务器进行nginx代理。

## 微前端应用管理系统

微前端应用管理系统主要包括以下功能：

1、应用环境管理，test，stage，prod

2、应用管理，主应用创建&&编辑，子应用创建&&编辑

3、主应用菜单管理，eg：包含哪些子应用，哪些子应用页面

4、子应用资源管理，子应用菜单管理

5、对外接口，eg：子应用更新资源接口，主应用获取子应用接口

## 拓展阅读

### 沙盒机制

沙盒机制主要为了防止应用之间的相互影响，相互影响主要是因为使用了应用的全局状态。eg：读取和设置同一个全局变量a。

为了解决应用之间的相互影响，可以从规范和技术两个方面去入手。

规范上：

规范上要求尽量避免读写全局状态，子应用销毁时增加清理代码。无法避免时读写全局状态时，增加子应用的命名空间。eg：名为a的子应用，需要将变量设置到global.a下。

技术上：

样式沙盒机制比较容易实现，移除style元素或增加media属性(当前设备不符合的media，达到禁用的目的，eg：min-width:1000000000px)。

JS代码相对来说比较难实现，比较场景的方法是初始化时保存全局状态快照，应用切换后将全局状态恢复到快照状态，重写引起全局状态变化的方法，应用销毁时依次调用清除方法。

``` js
//setInterval
const storage = {};
let originSetInterval = setInterval;
let newSetInterval = function() {
    let appName = getCurrentAppName();
    let timerId = originSetInterval.apply(window, arguments);
    if (!storage[appName]) {
        storage[appName] = {
            setIntervalTimers: []
        };
    }
    storage[appName].setIntervalTimers.push(timerId);
}
window.setInterval = newSetInterval;

function onAppUnMounted() {
    let appName = getCurrentAppName();
    if (storage[appName]) {
        let appStorage = storage[appName];
        if (appStorage.setIntervalTimers && appStorage.setIntervalTimers.length) {
            appStorage.setIntervalTimers.forEach(timeId => {
                clearInterval(timeId)
            })
        }
    }
}
```

