# 可视化搭建Web页面

可视化搭建Web页面，指的是通过GUI可视化交互的方式搭建出，之前需要通过代码开发出来的页面。可以让非专业前端研发人员搭建页面，大大提高页面生成效率。类似于Android Studio搭建Activity界面。

## 为什么需要可视化搭建

### C端活动

公司为了正常运行业务，往往需要一些营销，活动类的页面。这些页面一般生命周期短，发布频率高，需求之间重复多，页面比较简单。这些页面对于前端开发而言，重复劳动并不是一个最优解，所以我们需要拥有让非专业人员快速搭建这些页面的能力，这样我们更加专注于解决其它问题。

### 中后台系统

中后台系统需求复杂度低，至少90%的页面可以标准化。标准化之后就可以自动化。

如果中台体系由核心研发团队研发，能够给公司内包括前端，后端，测试，产品来使用，通过简单的图形化配置和低代码，不仅可以直接实现业务需求，还提供权限、环境、灰度、埋点、监控等能力。那必将大大降低前端开发的压力和负担，更好地支持公司其它更重要的业务发展。

## 现阶段的可视化搭建的分类

主要分为三类：

1、基于DOM元素的高自由度搭建。代表：百度h5，ih5，vvveb。

2、基于组件化的拖拽搭建。代表：鲁班h5，飞冰ice，bootcss。

3、基于业务化的拖拽搭建。代表：h5-dooring，云凤蝶，pipeline。

总体来说，存在两点问题：

1、交互逻辑需要侵入开发，无法自动生成

2、只能在受限，具体的业务场景下发挥作用

这两个问题导致我们生产设计出来的东西需要low code。low code就需要用户有一定编程经验。限制了大部分没有编程经验的用户。

## 架构设计

H5的可视化搭建系统，一般面向的是产品和运营。核心流程应该如下：

![核心使用流程](/note/assets/imgs/h5-gui-pm-create-pipeline.png)

根据上面的核心流程，我们需要抽象一下要实现的具体能力：

1、有较丰富的模板、组件来满足各种业务场景。

2、需要有易用的可视化编辑器，所见即所得。

3、需要有页面发布能力，支持编辑后页面随时发布上线。

### 应该怎么设计

#### 较丰富的模板 & 组件

这就要求:

1、编辑系统和组件解耦，组件只需要遵循编辑系统的规范即可。其具体开发过程和承载的逻辑与编辑系统无关。

2、编辑系统和前端框架解耦，在遵循编辑系统的约定下，可以选择不同的前端框架。

#### 需要有易用的可视化编辑器

编辑器的本质是对页面可变的数据进行编辑。不同组件，不同模板反映到可视化编辑器上就是不同的可配置项。

这就要求组件和模板定义自身的可配置的数据结构。JSON Schema可以很好的描述这些信息。

```js
{
    type: 'object',
    title: 'person',
    properties: {
        name: {
            type: 'string'
        }
    }
}
```

#### 需要有页面发布能力

页面发布能力需要我们对编辑的页面通过“模板+数据”的模式来编译生成最终的html页面，然后对外投放即可。

#### 保证线上稳定运行

我们要设计一套完善的线上页面稳定性机制以及相关的应急方案。页面我们可控的就是模板和组件，所以我们可以从这2个方面来设计稳定性方案。

![模板和组件线上稳定性](/note/assets/imgs/create-page-gui-service-wdx.png)

### 总结

基于以上诉求，可以抽象化为下面的架构：

![架构图](/note/assets/imgs/h5-gui-create-page-jgt.png)

## 前置知识准备

### 一些概念

#### 远程组件

业务团队可以基于自己的需求，向可视化系统新增自己业务的相关组件。这些组件会做为远程组件，动态加载到框架中。

#### LowCode

LowCode意思是用较少的Code可以实现同样的功能。可视化应用开发是一种常见的低代码开发方式。通过可视化开发，不同经验水平的开发人员能够通过图形用户界面，使用拖拽式组件和模型驱动逻辑来创建Web和移动应用。

#### 页面模板和全局组件

页面模板是对同一类页面的抽象，可以通过模板来衍生出各种形式的页面，模板中可以涵盖各种类型的组件，我们称这些组件为模板组件。模板组件是无法跨模板共享的。

全局组件是远程组件的实现方式，可以用来跨多模板共享。一些通用的模板组件，可以被抽离成一系列全局组件。

#### Vue3

接下来我们介绍的搭建系统主要是基于Vue3的。

#### 组件库选择

基于上面的框架选项，我们采用的是支持Vue3，且生态比较丰富的组件库antd 2x。

#### Egg

要做编辑，发布，数据存储工作，离不开服务器端。我们选择用前端较为熟悉的nodejs作为我们的服务器开发语言。

Egg按照约定进行开发，奉行『约定优于配置』，团队协作成本低，社区的评价比较高，基于以上原因，我们选择Egg作为我们的后端框架。

## 模板设计

可视化编辑系统中的模板需要由业务开发同学来不断建设和丰富模板库。为了兼容不同的业务线和技术栈，需要设计一套与框架无关的模板页面体系。

无论使用React、Angular、Vue还是小程序。可视化搭建系统都可以适配，因为底层使用了一种通用的描述语言来描述页面的结构、表现、行为等属性。

![模板和编辑器消息通信](/note/assets/imgs/h5-gui-create-template-editor-comm.png)

### 初始化模板页面

假设，某个团队用的h5技术栈是基于Vue2.x的，我们可以基于vue-cli来生成项目。

```bash
# 需要先全局安装vue-cli
vue create my-template
```

可视化系统需要按组件的维度对页面布局进行调整，所以需要对模板的编写方式进行约束，要按组件开发的方式来指定目录结构。

### 示例

我们需要一个头部放Banner图片，下面是一个包含用户名，手机号和地址的表单，最后是一个提交的button。

首先拆分组件：1、banner组件；2、表单组件。

### banner组件的props schema设计

通过需求分析，我们知道banner的图片地址和banner的跳转地址是需要通过配置来获取的。

```html
<template>
    <div class="my-banner">
        <a :href="info.link">
            <img :src="info.src" style="width: 100%" alt="info.name" />
        </a>
    </div>
</template>

<script>
    export default {
        name: "my-banner",
        props: {
            info: {
                type: Object,
                default: () => {
                    return {};
                },
            },
        },
    };
</script>
```

虽然我们的组件有props，但是编辑器不知道props具体的格式和字段类型。

理想的配置数据格式为JSON，因为其格式灵活，前端友好，理想的配置数据描述格式为JSON Schema，因为它使用广泛。

接下来我们按照JSON schema的规范来表述一下我们的banner组件props。

在banner组件同级目录新建一个package.json文件来描述banner组件的可配置项。

```json
{
    "type": "object",
    "properties": {
        "src": {
            "title": "图片地址",
            "type": "string",
            "format": "image"
        },
        "link": {
            "title": "跳转链接",
            "type": "string",
            "format": "url"
        }
    },
    "required": [
        "src"
    ]
}
```

Form组件的也类似。

```json
{
    "type": "object",
    "properties": {
      "btnText": {
        "title": "按钮文字",
        "type": "string"
      },
      "action": {
        "title": "接口地址",
        "type": "string",
        "format": "url"
      }
    },
    "required": [
      "btnText"
    ]
}
```
## 模板通信设计

我们需要告诉编辑器有哪些组件，以及这些组件的基本信息。

大概有：

1、有哪些组件，需要对用户展示当前模板有哪些组件可用。

2、组件的基础信息，缩略图，名字，描述，可编辑内容等。

### 有哪些组件

可以去从服务器去获取当前模板页面支持的所有组件。服务器获取的方案需要有组件注册，保存，关联模板页面的能力。

本文为了简单起见，先将所有组件写到同一个git仓库中。按照之前的约定，所有的组件都写到了components目录下，无非是读取components目录下的组件信息，进行展示即可。

前端获取目录结构信息，可以利用webpack提供的require.context的功能。

```js
function getComponents() {
  const componentConfig = [];
  const requireConfig = require.context(
    './components',
    true,
    /package.json$/
  );
  requireConfig.keys().forEach(fileName => {
    const config = requireConfig(fileName);
    componentConfig.push(config);
  });

  return componentConfig;
}
```

### 组件的基础信息

可以把我们的基础信息都放到当前组件目录的package.json文件中。

添加组件名，组件描述，组件缩略图后的banner的package.json。

```json
{
    "name": "my-banner",
    "description": "my-banner组件",
    "snapshot": "https://cdn.xxx.com/banner.png",
    "schema": {
      "type": "object",
      "properties": {
        "src": {
          "title": "图片地址",
          "type": "string",
          "format": "image"
        },
        "link": {
          "title": "跳转链接",
          "type": "string",
          "format": "url"
        }
      },
      "required": [
        "src"
      ]
    }
}
```

### 如何告知

因为模板和编辑器已经解耦，所以要想要模板可以在编辑器后台展示，最常用，轻便的办法就是通过iframe的形式内嵌模板页面。那么通信问题就转化为2个iframe之间的通信问题，所以，使用postMessage。

```js
export function postMsgToParent (message) {
  window.parent.postMessage(
    message,
    '*'
  );
}
// 通知父容器
postMsgToParent({
  type: 'returnComponentConfig',
  data: {
    components: this.componentConfig, // 当前模板信息
    // ...
  }
});
```

## 模板动态化交互

上一个章节介绍，模板使用postMessage和编辑器进行通信。编辑器传递用户对模板编辑后的信息，模板需要对消息进行实时响应，并渲染到模板页面。

### 动态组件

要对模板的顺序进行编排，就需要对我们将展示的数据结构设计成数组，数组中包含了对模板可展示数据的基础描述。

```js
{
  "userSelectComponents": [
  	{
      "name": "my-banner",
      "props": {
      	"src": "",
        "link": ""
      }
    },
    {
      "name": "my-form",
      "props": {
      	"btnText": "",
        "action": ""
      }
    }
  ]
}
```

对结构进行可视化渲染。可以用Vue提供的动态组件来进行页面的布局渲染。

```html
<div
  :id="`my-render-id-_component_${index}`"
  :key="index"
  v-for="(component, index) in components"
>
  <div
    :is="component.name"
    :key="component + index"
    :info="component.props"
    :config="component.config"
  />
</div>
```
### 接收消息

```js
export default {
  created() {
     window.addEventListener('message', (e) => {
      // 不接受消息源来自于当前窗口的消息
      if (e.source === window || e.data === 'loaded') {
        return;
      }
      this[e.data.type](e.data.data);
    });
  },
  methods: {
    addComponent() {
      // todo add componet
    },
    changeProps(payload) {
      this.$set(this.components[this.currentIndex], 'props', payload);
    },
  }
}
```

可以通过postMessage里面携带的type来动态调用相关函数，由函数来实现动态编辑的效果。

可以设计一套通用的消息处理层来对处理消息。消息处理层包含和编辑器后台的消息通信机制和基础模板渲染。

```html
<my-component>
  <my-banner :obj="{
    src: require('./assets/banner.jpg'),
    link: 'https://my.com',
  }" />
  <my-form />
</my-component>
```

### 架构图

![模板和编辑器交互架构图](/note/assets/imgs/h5-create-gui-page-template-comm.png)

## 稳定性-模板的更新策略

模板的开发不是一次性的，随着业务的变更和调整，我们的模板也需要做出相应的适配和二次开发。

如果线上模板只有一套，根据数据源不同来进行不同的渲染，当模板升级时，线上页面也随之升级了。

但是如果新升级的模板有兼容性问题，可能会导致旧数据+新模板的组合，造成线上故障。

### 解耦页面和模板

![解耦页面和模板](/note/assets/imgs/h5-gui-create-copy-template.png)

1、编辑器对模板页面进行数据结构生成 & 发布。

2、从表单模板中clone一份模板，和源模板代码解耦。

3、发布clone后的模板。

这样模板升级就不影响线上页面。

## 全局组件设计

如果多个模板都用到了同一个banner组件，而且功能基本一致。这时我们需要抽象出全局的banner组件。

要实现全局组件的能力，最大的问题是需要将组件和模板解耦，组件将不再依赖于具体的模板而可以应用于任何模板。

### 构建目标

vue cli生成的项目可以将构建目标设为独立组件。我们可以将组件打包好的库代码动态注入到页面，再交给页面去渲染即可。

### 创建项目

```bash
vue create my-global-banner
```

调整目录

```bash
...
|-- examples      // 原 src目录，改成examples
|-- packages      // add packages 存放组件
...
```

修改vue.config.js

```js
const path = require('path');

module.exports = {
  // 修改 src 为 examples
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },

  chainWebpack: config => {
    config.module
      .rule('eslint')
      .exclude.add(path.resolve('dist'))
      .end()
      .exclude.add(path.resolve('examples/docs'))
      .end();
    config.module
      .rule('js')
      .include
      .add('/packages')
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        return options
      })
  }
}
```
编写banner组件

```js
// index.js
import Component from './index.vue';
import config from './package.json';

Component.install = function (Vue) {
  Vue.component(`${config.name}.${config.version}`, Component);
};

export {
  Component,
};
```
编译组件，主要是添加lib命令。

```json
  "lib": "vue-cli-service build --target lib --name my-global-banner --dest dist packages/index.js"
```

## 全局组件注册

### 注册组件

我们的组件已经是编译好的js umd和css文件，我们只需要js和css动态地挂到DOM上，再由DOM渲染加载即可。

```html
<template>
  <div
    v-if="component"
    :is="component"
    :obj="props"
  />
</template>
<script>
export default {
  data() {
    return {
      component: '',
    }
  },
  
 created() {
   // 动态添加组件，用于可视化编辑场景
    const {
      name,
      js,
      css,
      index,
    } = this.config;
    const component = window[name];
    if (!component) {
      const script = document.createElement('script');
      const link = document.createElement('link');
      script.src = js;
      link.href = css;
      link.rel= 'stylesheet';
      // 动态注入 js 和 css
      document.head.appendChild(link);
      document.body.appendChild(script);
      script.onload = () => {
        // 加载完成
        this.$emit('onRemoteComponentLoad', {
          ...window[name],
          index,
        });
        this.component = Vue.extend(window[name].Component);
      }
    } else  {
      // 非动态化添加，用于server构建场景
      this.$emit('onRemoteComponentLoad', {
        ...window[name],
        index,
      });
      // 先有 props 再挂组件，不然 props 是 null 可能会有错
      this.$nextTick(() => {
        this.component = Vue.extend(window[name].Component);
      });
    }
 }
}
</script>
```
如果全局组件内部运行出现了错误，那这部分的处理需要通过容器组件上添加errorCaptured这个官方钩子，来捕获子组件的错误或进行相应的处理。

```js
errorCaptured(err, vm, info) {
  // todo
  // 可以修改组件的状态
},
```

### 总结

通过动态注入js和css将组件的信息注册到window上，然后再从window中获取组件信息来注册组件，最后通过动态组件的方式挂到页面。

## 额外的问题

### 全局组件信息如何告知编辑器

需要设计一个事件通信规则，当组件js加载完成后，我们需要拿到window上组件的config。

```js
{
  // ....
  created() {
    // ... 
    this.$emit('onRemoteComponentLoad', {
      ...window[name], 
    });
  }
}
```

## 设计实现CLI

前面我们介绍过了模板和组件的相关设计，接下来面临的问题是：

1、如何保证后续模板的开发？

2、我们制定的模板、组件开发规范，如何保证不同开发者之间统一

3、模板开发完成后，如何统一进行部署和发布

4、模板的组件需要以缩略图的方式展示在编辑器组件中，如何生成缩略图

...

这些问题的本质是如何保障组件和模板的复用性和规范性。我们可以设计一套CLI架构来解决这个问题。就和vue-cli类似。

这些脚手架的目的在于减少低级重复劳动，专注业务提高开发效率，规范开发流程。

![CLI功能图](/note/assets/imgs/h5-create-page-cli-jg.png)

