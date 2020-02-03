# Web Components 入门实例教程

# 前言

组件是前端的发展方向，现在流行的 React 和 Vue 都是组件框架。

谷歌公司由于掌握了 Chrome 浏览器，一直在推动浏览器的原生组件，即Web Components API。原生组件简单直接，符合直觉，不用加载任何外部模块，代码量小。目前还在不断发展，但已经可用于生产环境。

## 自定义元素

自定义的 HTML 标签，称为自定义元素。根据规范，自定义元素的名称必须包含连词线，用与区别原生的 HTML 元素。

``` html
<user-card></user-card>
```

## customElements.define

自定义元素需要使用 JS 定义一个类，所有自定义标签都是这个类的实例。

## 自定义元素的内容

``` js
    class UserCard extends HTMLElement {
        constructor() {
            super();
            let shadow = this.attachShadow({
                mode: 'open'
            });
            //
            let img = document.createElement('img');
            img.src = 'https://semantic-ui.com/images/avatar2/large/kristy.png';
            img.classList.add('image');
            //
            let container = document.createElement('div');
            container.classList.add('container');
            //
            let name = document.createElement('p');
            name.classList.add('name');
            name.innerText = 'User Name';
            //
            let email = document.createElement('p');
            email.classList.add('email');
            email.innerText = 'xxx@xxx.cn';
            container.append(name, email);
            shadow.append(img, container);
        }
    }
    window.customElements.define('user-card', UserCard);
```

## template标签

使用 JS 写 DOM 很麻烦，Web Components API 提供了 template 标签，可以在它里面使用 HTML 定义 DOM。

获取 template 节点以后，克隆了它的所有子元素，这是因为可能有多个自定义元素的实例，这个模板还要留给其它实例使用，所以不能直接移动它的子元素。

``` html
<template id="userCardTemplate">
    <img src="https://semantic-ui.com/images/avatar2/large/kristy.png" />
    <div class="container">
        <p class="name">User Name</p>
        <p class="email">xxx@xxx.com</p>
        <button class="button">Follow</button>
    </div>
</template>
<script>
    class UserCard extends HTMLElement {
        constructor() {
            super();
            let shadow = this.attachShadow({
                mode: 'open'
            });
            let templateElm = document.getElementById('userCardTemplate');
            let content = templateElm.content.cloneNode(true);
            shadow.append(content);
        }
    }
    window.customElements.define('user-card', UserCard);
</script>
```

## 添加样式

template中的:host 伪类，指代自定义元素本身。

``` html
<template id="userCardTemplate">
    <style>
        :host {
            display: flex;
            width: 450px;
            height: 200px;
            background-color: #d4d4d4;
            border: 1px solid #d5d5d5;
            box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
            border-radius: 3px;
        }

        .image {
            flex: 0 0 auto;
            width: 200px;
            height: 200px;
        }

        .container {
            padding-left: 20px;
        }
    </style>
    <img src="https://semantic-ui.com/images/avatar2/large/kristy.png" class="image" />
    <div class="container">
        <p class="name">User Name</p>
        <p class="email">xxx@xxx.com</p>
        <button class="button">Follow</button>
    </div>
</template>
```

## 自定义元素的参数

可以使用 getAttribute 获取参数。注意 getAttribute需要在 connectCallback 后调用。

``` html
  <script>
      class UserCard extends HTMLElement {
          constructor() {
              super();
              let shadow = this.attachShadow({
                  mode: 'closed'
              });
              let templateElm = document.getElementById('userCardTemplate');
              let content = templateElm.content.cloneNode(true);
              shadow.append(content);
          }
          updateContent() {
              let content = this.shadowRoot;
              content.querySelector('img').setAttribute('src', this.getAttribute('image') || 'img/default.png');
              content.querySelector('.container>.name').innerText = this.getAttribute('name');
              content.querySelector('.container>.email').innerText = this.getAttribute('email');
          }
          connectedCallback() {
              this.updateContent();
          }
      }
      window.customElements.define('user-card', UserCard);
  </script>
  <div>
      <user-card image="https://semantic-ui.com/images/avatar2/large/kristy.png" name="xxx" email="xx@xxx.com"></user-card>
  </div>
```

## Shadow DOM

我们不希望用户能够看到 user-card 的内部代码，Web Component 允许内部代码隐藏起来，这叫做 Shadow DOM，即这部分 DOM 默认与外部 DOM 隔离，内部任何代码都无法影响外部。

自定义元素的 this.attachShadow 方法开启 Shadow DOM。参数{mode:"closed"}表示 Shadow DOM 是封闭的，不允许外部访问。

## 扩展阅读

### customerElement.define

第三个参数为可选参数，一个包含 extends 属性的配置对象，指定了所创建的元素继承自哪个内置元素，可以继承任何内置元素。

使用 is属性，必须指定 extends属性，且不能使用自定义标签方式。

``` html
 <script>
     class WordCount extends HTMLParagraphElement {
         constructor() {
             super();
             let shadow = this.attachShadow({
                 mode: 'open'
             });
             let p = document.createElement('p');
             p.innerText = "Hello,I am word-count!";
             shadow.append(p);
         }
     }
     window.customElements.define('word-count', WordCount, {
         extends: 'p'
     });
 </script>
 <div>
     <p is="word-count"></p>
 </div>
```

### 自定义元素使用方式

1、独立的元素，define 时第三个参数为空，可以直接把它们写成 HTML 标签的形式。eg：<cus-tag></cus-tag>或 document.createElement('cus-tag')。

2、继承自基本的 HTML 元素，define 时，必须指定所需扩展的元素，使用时，需要先写出基本的元素标签，并通过 is 属性指定 custome element 的名称。eg：<p is="cus-tag"></p>，document.createElement('p', {is:'cus-tag'})。

    createElement的第二个参数目前只支持一个包含 is 属性的对象。

### this.getAttribute

在 Chrome 的较新版本中，如果要获取自定义元素的属性，必须先使用该元素，然后再 define该元素。

### 生命周期回调函数

在 custome element 的构造函数中，可以指定多个不同的回调函数，它们将会在元素的不同生命时期被调用。

connectedCallback，当 custom element 首次被插入文档 DOM 时，被调用。

disconnectedCallback，当 custom element 从文档 DOM 中删除时，被调用。

apoptedCallbacck，当 custom element 被移动到新的文档时，被调用。

attributeChangedCallback，当 custom element 增加，删除不，修改自身属性时，被调用。

如果需要使用attributeChangedCallback 回调函数，必须监听这个属性，可以通过observedAttribites get 函数来实现。返回一个需要监听的属性数组。

``` html
<div>
    <custom-square l="100" c="red"></custom-square>
    <script>
        class CustomeSquare extends HTMLElement {
            constructor() {
                super();
                let shadow = this.attachShadow({
                    mode: 'open'
                });
                let div = document.createElement('div');
                let style = document.createElement('style');
                shadow.appendChild(div);
                shadow.appendChild(style);
            }

            updateStyle() {
                let shadow = this.shadowRoot;
                if (!shadow) return;
                let childNodes = shadow.childNodes;
                for (let i = 0; i < childNodes.length; ++i) {
                    if (childNodes[i].nodeName === 'STYLE') {
                        childNodes[i].textContent = `div{width:${this.getAttribute('l')}px;height:${this.getAttribute('l')}px;background-color:${this.getAttribute('c')};}` ;
                    }
                }
            }

            connectedCallback() {
                console.log('Custom square element added to page!');
                this.updateStyle();
            }

            attributeChangedCallback(name, oldVal, newVal) {
                console.log( `Attribute ${name} changed, from ${oldVal} to ${newVal}!` );
                this.updateStyle();
            }

            static get observedAttributes() {
                return ['l', 'c'];
            }
        }

        window.customElements.define('custom-square', CustomeSquare);
    </script>
</div>
```

# 参考文献

http://www.ruanyifeng.com/blog/2019/08/web_components.html

https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_custom_elements

