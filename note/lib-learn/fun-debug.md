# FunDebug监控类库

## JS

Fundebug的JS插件能够实时监控网页应用的错误，第一时间给您发送报警，帮助及时发现BUG，快速解决BUG。

### 插件特点

1、一行代码搞定

2、自动捕获未处理的错误

3、能够捕获3种不同的前端错误，JS执行错误，资源加载错误和HTTP请求错误。

4、出错场景完全可视化重现，相当于录屏。

5、支持通过SourceMap还原出错源代码。

6、记录出错前的鼠标点击、HTTP请求、页面跳转、console打印等用户行为，帮助您复现BUG。

7、支持收集try/catch捕获的错误。

8、兼容所有浏览器包括IE6到IE11。

9、兼容所有前端开发框架，eg：vue，react，angularJS，lonic 1，lonic2，cordova，gitbook等。

### 用户行为回溯

对于前端JS错误，Fundebug可以记录出错前的用户行为，比如点击、页面跳转、网络请求等，这些行为信息可以帮助您回溯错误出现的场景，从而更快速地定位错误。

#### 为什么记录用户行为

一直以来，我们是从错误本身来帮助用户定位和分析错误的。

1、抓取详细的错误信息，包括文件名，行列号，错误堆栈。

2、兼容各种浏览器和框架。

3、使用机器学习算法对错误进行智能聚合。

4、通过SourceMap还原真实的出错位置和出错代码。

但是，错误本身的信息是不能直接提供给开发者一个出错场景，也就是说，开发者有时并不清楚这个错误是在什么情况下出现的。

1、用户点击了哪些按钮？

2、用户访问了哪些页面？

3、用户发起了哪些网络请求？

这些简单的行为信息往往可以帮助开发者从业务逻辑的角度理解出错的场景，从而快速定位错误。

#### 如何记录用户行为

Fundebug专注于应用错误监控，因此只会记录出错前的用户行为，我们无意于监控用户的所有行为。目前，Fundebug只记录下列用户行为：1、点击；2、页面跳转；3、网络请求。

### 可视化重现出错场景

很多前端Bug，比如WexinJSBridge is not defined。它们到底有没有影响用户，除非是用户主动反馈，否则我们不得而知。

另一方面，研究表明debug的绝大部分时间是花在bug重现，而复现的关键就是高精度还原用户触发错误的环境，以及用户的操作。

如今，我们对JS监控插件再次进行重大升级，通过全面可视化重现出错场景，来方便开发者分析用户触发错误的方式。

Fundebug通过独特的技术将用户的使用过程录了下来，并完全可视化重现，算法经过优化，整个录制过程CPU的使用率非常低。和传统的视频相比，体积小了成百上千倍。Fundebug插件录制的用户使用过程，压缩后的体积只有几十KB。

另外，Fundebug的JS插件已经对密码等敏感数据进行了自动化过滤，并且，如果您在某个DOM节点配置了_fun-hide的class，那么该元素在插件进行录制前就会被预先删除掉来保证用户隐私安全。

### 接入插件

接入Fundebug插件非常简单，将fundebug.min.js放在head标签中就可以。

#### 直接引入

```html
<script
    src="https://js.fundebug.cn/fundebug.2.8.0.min.js"
    apikey="API-KEY"
    crossorigin="anonymous"
></script>
<!--最新版本，https://js.fundebug.cn/fundebug.latest.min.js-->
```

#### npm安装方式

推荐使用，因为fundebug使用了第三方CDN服务进行分发，我们无法保证其稳定性，另外，我们没有使用海外CDN服务。

### 录屏

我们拆分了录屏代码，如果需要使用录屏功能的话，需要单独接入录屏插件。

```js
require('fundebug-revideo')
//https://js.fundebug.cn/fundebug.revideo.0.7.1.min.js
```
录屏功能目前不支持flash，iframe以及canvas。

若您的网站非https，则录屏视频播放不正常。

若网站运行在子路径下，则需要配置domain方可正常使用。

### 属性配置

1、apiKey，区分项目的关键。

2、appVersion，应用版本。

3、releasestage，应用开发阶段。eg：development，test，production。

4、user，网站的用户，包含name和email两个属性。

5、metaData，其它定义的信息，开发者可以使用metaData收集所需要的信息。

6、callback，回调函数，其中参数为上报到fundebug服务器的错误数据，可以使用callback函数来查看错误数据，也可以将其发送到其它数据平台。

7、setHttpBody，为了保护隐私，Fundebug插件默认不会记录HTTP请求的body参数。

8、httpTimeout。

9、filters，通过配置filters属性，用户可以过滤掉一些不需要捕获的错误。

10、breadcrumbSize，用户行为数据的记录长度。包括用户点击，用户输入，网络请求，页面跳转，控制台日志等行为数据。

11、silent，暂时不需要使用Fundebug，可以选择配置安静模式，Fundebug不会收集错误信息。

12、silentDev，开发环境下不收集错误。

13、silentResource，不监控资源加载类错误。

14、silentHttp，不监控HTTP请求错误。

15、silentWebsocket。

16、silentVideo，新版本已经拆分了录屏功能，因此是否录屏取决于是否使用录屏插件。

17、silentBehavior，不需要记录用户行为。

18、silentConsole，不需要记录console对象的打印信息。

19、silentPerformance，不需要报错的时候附带页面性能指标。

20、silentPromise，不需要监控Promise错误。

21、sampleRate，采样率。

22、domain，网站的域名，子路径需要配置。

23、maxRevideoSizeInByte，最大可记录的大小，默认为150KB。

24、maxEventNumber，默认为10。

### API

init，init配置各种属性。

默认情况下，Fundebug插件能够自动捕获未处理的错误(uncaught error)。另外，开发者也可以通过使用Fundebug提供的API发送其它错误信息。

test，nofify，notifyError，leaveBreadcrumb(发送自定义的用户行为数据)。

### Vue框架使用

```bash
npm install fundebug-javascript fundebug-vue --save
```

```js
import * as fundebug from "fundebug-javascript";
import fundebugVue from "fundebug-vue";
fundebug.init({
    apikey: "API-KEY"
})
fundebugVue(fundebug, Vue);
```

fundebug-vue源码：

```js
// 导出的fundebugVue方法为
// 1、主要是设置了Vue.config.errorHandler处理器
// 2、得到componentName，propsData等信息上报到服务器
export default function(fundebug, Vue) {
    Vue.config.errorHandler = function(err, vm, info) {
        try {
            if (vm) {
                var componentName = formatComponentName(vm);
                var propsData = vm.$options && vm.$options.propsData;
                fundebug.notifyError(err, {
                    metaData: {
                        componentName: componentName,
                        propsData: propsData,
                        info: info
                    }
                });
            } else {
                fundebug.notifyError(err);
            }
        } catch (error) {
            // 无需出错处理
        }
    };
}
```

### 错误类型

Fundebug监控插件1.2.0+，可以监控5种类型的错误：

1、JS执行错误

2、资源加载错误

3、HTTP请求错误

4、unhandledrejection

5、Websocket连接错误

