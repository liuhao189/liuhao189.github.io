# 可视化搭建Web页面其二

上文提到要创建CLI工具来提高开发者开发效率。

## 如何开始

从头开始介绍如何开始创建一个node-cli来面向模板和组件开发者，减少重复劳动，提高工作效率。

```bash
mkdir my-cli
cd my-cli
npm init -y # 初始化package.json
```

接下来我们需要增加一个命令入口，指向可执行文件。需要在package.json文件中指明bin来配置入口。

```bash
#!/usr/bin/env node
```

#!这个符号通常出现在Unix系统中，用于指明这个脚本文件的解释程序。增加上面那一行代码主要是为了指定用node执行脚本文件。

## 常用模块

1、chalk，终端显示颜色。

2、commander提供了命令行输入和参数解析。

3、inquirer交互式命令行工具，用来收集用户填入表单。

4、ora终端加载动画效果。

5、shelljs，代码中编写shell命令实现功能。

6、puppeteer启动无头浏览器生成网站缩略图。

7、download-git-repo，用来下载远程模板。

## create模板、组件

我们希望通过下面的命令来实现一个创建模板的功能，用于初始化模板脚手架。

```js
my-cli create my-template-test
```

主要是使用inquirer来收集用户填入的表单，然后使用download-git-repo库来下载相应的git仓库代码即可。

## publish模板、组件

```js
my-cli release
```

模板开发完毕后，需要将模板提交到编辑器后台管理系统中，用于运营选择我们的模板。这里其实干了两件事，第一步先生成开发好的模板的缩略图；第二步将我们的componet.config.js文件提交到服务器端。

组件发布也类似，主要使用puppeteer生成截图。

## 初始化配置文件

```js
my-cli init-config
```

检测当前目录下是否存在component.config.js文件，不存在则直接按模板和用户输入生成即可。


## CLI文件夹结构

```bash
my-cli
├─package.json
├─tpl
|  ├─component.config.js
|  └-page.config.js
├─lib
├─commands
|    ├─generator.js
|    ├─release.js
|    └init-config.js
├─bin
|  └index.js
```

index.js是主入口文件，commands专门放主要的命名功能逻辑，lib比较细的功能实现，tpl放置文件模板。

## 可视化编辑区实现

我们编辑器对模板的展示采用的是iframe的方式，之前我们提采用iframe的方式是为了模板和编辑器解耦。我们也可以通过监听postMessage的方式来实现消息接收。

### 选择组件

可视化编辑器要实现的第一个功能就是对页面组件进行选择性编辑。首先看一下竞对的交互：选中组件后进行高亮，之后进行拖拽排序。

选中组件后高亮按照设计模式来说，应该是编辑器实现的功能。这就涉及到了父iframe操作子iframe的问题。只需要页面和编辑器设置相同的主域名，便可以进行跨iframe的操作。

```js
const eventInit = () => {
  // 获取子 iframe 的 dom
  const componentsPND = document.getElementById('frame').contentWindow.document.getElementById('slider-view');
  // 为页面组件绑定 click 事件
  componentsPND.addEventListener('click', (e) => {
    let node = e.target;
    // 遍历元素，找到以 'coco-render-id-_component_'  作为 id 的组件元素，计算高度和位置
    while(node.tagName !== 'HTML') {
      let currentId = node?.getAttribute('id') || '';
      if (currentId.indexOf('coco-render-id-_component_') >= 0) {
        const top = getElementTop(node);
        const { height } = getComputedStyle(node);
        restStyle(height, top, 'activeStyle');
      }
      node = node.parentNode;
    }
  });
  // 为页面组件绑定 mouseover 事件
  componentsPND.addEventListener('mouseover', (e) => {
    let node = e.target;
    // 遍历元素，找到以 'coco-render-id-_component_'  作为 id 的组件元素，计算高度和位置
    while(node.tagName !== 'HTML') {
      let currentId = node?.getAttribute('id') || '';
      if (currentId.indexOf('kaer-render-id-_component_') >= 0) {
        try {
          const top = getElementTop(node);
          const { height } = getComputedStyle(node);
          restStyle(height, top, 'hoverStyle');
        } catch (e) {
          // ignore
        }

      }
      node = node.parentNode;
    }
  });
}
```

### 调整组件顺序

按照云凤碟的交互实现方式，在可视化编辑区右侧挂上编辑操作按钮。主要是更改组件在数组中的顺序即可。

### 添加组件

添加组件，通过拖拽的方式动态添加到编辑区。主要通过HTML的拖放API。

## 可视区编辑器mock & 预览

### 模板页面mock

为了让页面模板在编辑时走mock，在非编辑环境下走真实网络请求，这就要求模板页面根据当前被内置的环境判断请求是否走mock。

### 模板页面预览

mock虽然解决了我们编辑器编辑的问题，但用户配置完页面信息后，如何验证配置的信息是否正确呢？需要加一个预览的功能，来检测配置项。

## Vue3 Form render实现

需要对模板和组件暴露出来的可编辑props转换为表单以供用户编辑使用。

vue-form-render需要接受一个schema入参用于表单描述，再接受一个formData入参作为表单初始值，当表单变更时需要提供change事件通知前端更新数据，如果表单输入不合法，则需要通过validate事件告知前端。

```html
<formRender
  :schema="schema"
  :formData="formData"
  @on-change="change"
  @on-validate="validate"
/>
```

### formData处理

如果schema是个多级的对象，需要按照shema的规范类深度遍历formData对象。

```js
function resolve(schema, data, options = {}) {
  const {
    // 类型
    type
  } = schema;
  // 数据未初始化，给定默认值
  const value =
    typeof data === 'undefined' ? getDefaultValue(schema) : clone(data);

  if (type === 'object') {
    // 递归
    Object.keys(subs).forEach(name => {
      // ...
      resolve(subs[name], value[name], options);
    });
  }
  if (type === 'array') {
    // 递归
    value.forEach((item, idx) => {
      // ...
      resolve(subs[idx] || subs[0], item, options);
    });
  }
  return value;
}
//
function getDefaultValue(schame) {
  const { type } = schema;
  const defaultValue = {
    array: [],
    boolean: false,
    integer: '',
    null: null,
    number: '',
    object: {},
    string: '',
    range: null,
  };
  
  // ...
  
  return defaultValue[type];
}
```

### 表单渲染

最简单的方式是写很多功能组件，input，number，richText，radio，checkbox等，然后根据schema的type来确定用哪个组件。

```js
export default {
  setup() {
    return () => {
      const Field = widgets[mapping[`${props.schema.type}${props.schema.format ? `:${props.schema.format}` : ''}`]];
      return (
        <div className="vue-form-render">
          <Field
            schema={props.schema}
            formData={data}
            value={data}
            onChange={handleChange}
          />
        </div>
      )
    }
  }
}
```

### 校验输入

校验需要做的一方面是对数据格式的基础校验，一方面需要对用户自定义规则校验。eg：图片的地址需要经过url格式的校验。

```js
if (format === 'image') {
  const imagePattern =
    '([/|.|w|s|-])*.(?:jpg|gif|png|bmp|apng|webp|jpeg|json)';
  // image 里也可以填写网络链接
  const _isUrl = isUrl(value);
  const _isImg = new RegExp(imagePattern).test(value);
  if (usePattern) {
    // ignore
  } else if (value && !_isUrl && !_isImg) {
    return (message && message.image) || '请输入正确的图片格式';
  }
}

if (format === 'url') {
  if (usePattern) {
    // ignore
  } else if (value && !isUrl(value)) {
    return (message && message.url) || '请输入正确的url格式';
  }
}
```

## Server端编译实现

一部分可视化搭建系统中，没有涉及到编译这一块的内容，因为所有的数据都存储在云端，页面加载时再根据id来请求云端存储的数据。

这样存在一些问题：

1、用户体验问题，每次打开页面都会发起数据请求来获取页面配置数据。

2、增加服务器端压力，对于大促类型的活动，QPS是必须考虑的点，如果QPS过大则会影响服务端的负载。

3、额外的数据维护成本。

### Server端编译

我们知道模板的代码信息，其次我们知道页面配置的数据信息。根据这些信息，我们可以编译出页面。

#### 方式一：动态实时构建编译

当后台提交渲染请求时，我们的node服务：1、拉取对应模板；2、渲染数据；3、编译。

#### 方式二：动态非实时编译

方式一主要的弊端是发布时间长，以及间接修改了用户代码。如果我们将数据注入到编译后的静态文件，可以解决上述的问题。

```js
<script data-inject>
  window.__coco_config__ = { components: [] };
</script>
```

```html
<!-- remote-script-inject-start -->
<!-- remote-script-inject-end -->
```

```js
// 注入数据
const res = fs.readFileSync(`${temp_dest}/dist/index.html`, 'utf-8');
let target = res.replace(
  /(?<=<script data-inject>).*?(?=<\/script>)/,
  `window.__coco_config__= ${JSON.stringify({
    ...data,
    components: data.userSelectComponents,
    pageData: data.config,
  })}`
);
// 修改title
target = target.replace(/(?<=<title>).*?(?=<\/title>)/, data.config.projectName);
// ...
// 远程组件注入
target = target.replace(
  /(?<=<!-- remote-script-inject-start -->).*?(?=<!-- remote-script-inject-end -->)/,
  cssStyle + jsScripts
);
// 文件写入，编译完成
fs.writeFileSync(`${temp_dest}/dist/index.html`, target);
```

这样我们将所有的编辑数据和全局组件数据全部注入到window._coco_config_属性上，这样模板就不用再请求server端数据，也不用走Server端实时编译了。


