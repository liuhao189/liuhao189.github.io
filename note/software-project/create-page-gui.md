# 可视化搭建

可视化搭建字面意思是通过GUI可视化交互搭建出之前通过代码开发出来的界面。

eg：Android Studio，dreamweaver

## 为什么需要可视化搭建

### C端活动

公司为了运营业务，往往需要一些营销，活动类的页面。这些页面一般活动周期短，发布频率高，需求重复多。

这些页面对于开发而言，重复劳动并不是一个最优解，我们需要快捷搭建这些页面的能力。

### 中后台系统

对于中后台系统需求复杂度低，至少90%的页面可以标准化。标准化之后就可以自动化。

如果中台体系由核心团队研发，能够给公司内包括前端，后端，测试，产品来使用，通过简单的图形化配置和低代码，不仅可以直接实现业务需求，还提供权限、环境、灰度、埋点、监控等能力。那必将大大缩减前端开发的压力和负担，更好地支持公司业务。

## 现阶段的可视化搭建的分类

主要分为三类：

1、基于DOM元素的高自由度搭建。代表：百度h5，ih5，vvveb。

2、基于组件化的拖拽搭建。代表：鲁班h5，飞冰ice，bootcss。

3、基于业务化的拖拽搭建。代表：h5-dooring，云凤蝶，pipeline。

总体来说，存在两点问题：

1、交互逻辑需要侵入开发，无法自动生成

2、只能在受限，具体的业务场景下发挥作用

这两个问题导致我们生产设计出来的东西需要low code。low code面向的用户肯定是有一定编程经验的人。

## 架构设计

H5的可视化搭建系统，一般面向的是产品和运营。核心流程应该如下：

![核心使用流程](/note/assets/imgs/h5-gui-pm-create-pipeline.png)

根据上面的核心流程，我们需要抽象一下要实现的具体能力：

1、需要有丰富的模板、组件玩法满足各种业务场景。

2、需要有易用的可视化编辑器，所见即所得。

3、需要有页面发布能力，支持编辑后页面随时发布上线。

### 应该怎么设计

#### 需要有丰富的模板 & 组件

这就要求:

1、编辑系统和组件解耦，组件只需要遵循编辑系统的组织约定，其具体开发过程和承载的逻辑与编辑系统无关。支持自由拓展组件。

2、编辑系统和前端框架解耦，在遵循编辑系统的约定下，可以选择不同的前端框架。

#### 需要有易用的可视化编辑器

编辑器的本质是对页面可变的数据编辑。不同组件，不同模板反映到可视化编辑器上就是不同的配置项。

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

页面发布能力需要我们对编辑的页面通过page = fn(view, data)这样的模式来编译最终的页面。然后对外投放。

#### 保证线上稳定运行

我们要设计一套完善的线上页面稳定性机制以及相关的应急方案。页面我们可控的就是模板和组件，所以我们可以从这2个方面来设计稳定性方案。

![模板和组件线上稳定性](/note/assets/imgs/create-page-gui-service-wdx.png)

### 总结

基于以上诉求，可以抽象化为下面的架构：

![架构图](/note/assets/imgs/h5-gui-create-page-jgt.png)

## 前置知识准备

### 一些概念

#### 远程组件

业务团队可以基于自己的特殊需求，向可视化系统新增自己的组件。这些组件会做为远程组件，加载到框架中。

#### lowCode

低代码开发是一种可视化应用开发方法，通过低代码开发，不同经验水平的开发人员能够通过图形用户界面，使用拖拽式组件和模型驱动逻辑来创建Web和移动应用。

#### 页面模板和全局组件

页面模板是对同一类页面的抽象，可以通过模板来衍生出各种形式的页面，模板中可以涵盖各种类型的组件，我们称这些组件为模板组件。模板组件是无法跨模板共享的。

全局组件是远程组件的实现方式，可以用来跨多模板共享。一些通用的模板组件，可以被抽离成一系列全局组件。

#### Vue3

接下来我们介绍的搭建系统主要是基于Vue3的。

#### 组件库

基于上面的框架选项，我们采用的是支持Vue3的组件库antd 2x。

#### Egg

要做编辑，发布，数据存储工作，离不开服务器端。我们选择用前端较为熟悉的nodejs作为我们的服务器开发语言。

Egg按照约定进行开发，奉行『约定优于配置』，团队协作成本低。 基于以上和社区的评价，选择 Egg 作为我们的后端框架。

## 模板设计

可视化编辑系统中的模板需要由业务开发同学来不断建设和丰富模板库。为了兼容不同的业务线和技术栈，需要设计一套有相关约定且与框架无关的模板体系。

无论您使用 React、Angular 或 Vue，小程序 可视化搭建系统都可以适配，因为底层使用了一种通用的描述语言来描述页面的结构、表现、行为等属性。

![模板和比编辑器消息通信](/note/assets/imgs/h5-gui-create-template-editor-comm.png)

### 初始化模板页面

假设，某个团队用的h5技术栈是基于Vue2.x的，可以基于vue-cli来生成项目

```bash
vue create my-template
```

可视化系统需要按组件的维度对页面布局进行调整，所以需要对模板的编写方式进行约束，要按组件开发的方式来指定目录结构。

### 示例

我们需要一个头部放Banner图片，下面是一个表单手机用户名，手机号和地址的表单，最后是一个提交的button。

首先拆分组件：1、banner组件；2、表单组件。

### props schema设计

通过分析，我们知道banner的图片地址和banner的点击跳转地址是需要通过动态配置的。

然后我们写出下面的Banner组件的代码：

```html
<template>
    <div class="banner">
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

虽然我们将组件的props写出来了，但是编辑器不知道props具体的格式和字段类型。

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

我们需要告诉编辑器有哪些组件，以及这些组件的基本信息。大概包括下面的分类：

1、有哪些组件，需要对用户展示当前模板有哪些组件可用。

2、组件的基础信息，缩略图，名字，描述，可编辑内容等。

### 有哪些组件

按照之前的约定，所有的组件都写到了components目录下，无非是读取components目录下的组件信息，进行展示即可。

前端获取目录结构，可以利用webpack提供的require.context的功能。

```js
function getComponent() {
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

因为模板和编辑器后台已经解耦，所以要想模板可以在编辑器后台展示，最常用，轻便的办法就是通过iframe的形式内嵌模板页面。那么通信问题就转化为如何实现2个iframe直接的通信问题。按照惯例，使用postMessage。

```js
export function postMsgToParent (message) {
  window.parent.postMessage(
    message,
    '*'
  );
}
// 通知父容器
postMsgToParent({
  type: 'returnConfig',
  data: {
    components: this.componentConfig, // 当前模板信息
    // ...
  }
});
```

## 模板动态化交互

上一个章节介绍了模板如何接收编辑器传递过来的对模板编辑后的信息，并对消息进行实时响应。

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

可以通过postMessage来进行通信，但是具体要调用哪个模板里面的哪个功能，可以采用一种取巧的方式书写。

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
这样可以通过postMessage里面携带的type来动态调用相关函数，由函数来实现动态编辑的效果。

可以设计一套通用的消息处理抽象组件来对处理消息。比如叫做my-component。my-component就包含和编辑器后台的消息通信机制和基础模板渲染。

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

模板的开发不是一次性的，可能随着业务的变更和调整，我们的模板也需要做出相应的适配和二次开发。

如果线上模板只有一套，根据数据源不同来进行不同的渲染，当模板升级时，线上页面也随之升级了。

但是如果新升级的模板有兼容性问题，可能会导致旧数据+新模板的组合，造成线上问题。

### 解耦页面和模板

![解耦页面和模板](/note/assets/imgs/h5-gui-create-copy-template.png)

1、编辑器对模板页面进行数据结构生成&发布。

2、从表单模板中clone一份模板，和源解耦。

3、发布clone后的模板。

这样模板升级就不影响线上页面。

## 全局组件设计

如果多个模板都用到了同一个banner组件，而且功能基本一致。这时我们需要抽象出全局的banner组件。

要实现全局组件的能力，最大的问题是需要将组件和模板解耦，组件将不再依赖于具体的模板而可以应用于任何模板。

### 构建目标

我们知道Vue组件可以独立于编译器单独运行，而vue cli官网上也提到了可以针对单独组件做构建目标的区分。

我们可以将组件打包好的库代码动态注入到页面，再交给页面去渲染即可。

### 创建项目

```bash
vue create my-global-banner
```

调整目录

```bash
.
...
|-- examples      // 原 src目录，改成examples
|-- packages      // add packages 存放组件
...
. 
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
  "lib": "vue-cli-service build --target lib --name coco-global-banner --dest dist packages/index.js"
```

## 全局组件注册









