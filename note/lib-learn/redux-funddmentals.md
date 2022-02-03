# Redux基本原理

## 第一部分：Redux概述

What：Redux是一个使用叫actions的事件来管理和更新应用状态的类库。它作为整个应用程序状态的集中式存储，其规则确保状态只能以可预测的方式更新。

Why：Redux提供的模式和工具使您更容易理解应用程序中的状态更新的时间、地点、原因和方式，以及发生这些更改时应用程序需要做的逻辑处理。

When：Redux也有利弊，需要学习新概念，书写更多的代码，添加一些间接方法，并要求你遵循某些限制。是短期生产力和长期生产力之间的权衡。

在下列场景下更有用：

1、有大量的应用程序状态需要在应用程序的大量地方。

2、应用程序状态会高频更新。

3、更新状态的逻辑很复杂。

4、多人开发，中大型代码库。

### Redux类库和工具

Redux是一个独立的JS类库，通常它会和其它类库配合使用。React-redux是官方库。Redux-Toolkit是我们推荐的编写Redux逻辑需要使用的类库，包含了很多有用的函数。React-DevTools-Extension展示了状态的变更历史。

### Redux基本概念

#### Redux Store

Store包含了应用的全局状态。

Store的特点：

1、不可直接修改Store中的状态。

2、导致状态更新的唯一方法是创建一个普通的Action对象，该对象描述应用程序中发生的事情。然后将该Action Dispatch到Store中。

3、在Dispatch时，Store会运行root reducer函数，并让它根据old state和Action来计算new state。

4、最后，Store通知订阅者状态已经更新，因此UI可以用新数据更新。

UI的作用：在应用中，UI应该在屏幕上展示应用状态。

#### Data Flow

1、Action做为UI的响应被Dispatch出来。

2、Store执行Reducer函数来计算新状态，然后通知订阅者。

3、UI渲染收到状态变更通知展示新状态。

## 第二部分：概念和数据流转

### 背景概念

#### 状态管理

React管理counter的简单组件形式：自包含应用，包含了state，view和actions。

单向数据流：

1、状态描述应用在特定时间点的状态；

2、UI渲染基于state。

3、当一些事件发生，state根据发生了什么开始更新。

4、UI根据new state来重新渲染。

当多个组件需要共享和使用相同的状态时，简单性就会崩溃。有时，可以通过提升状态到父组件来解决，但这并不总是有帮助的。

通过定义和分离状态管理中涉及到的概念，并强制实施在视图和状态之间保持独立性的规则，我们为代码提供了更多的结构和可维护性。

#### 不可变性

JS的对象和数组都是不可变的，为了更新数据，需要拷贝已存在的对象和数组，然后更改拷贝后的数据。

我们可以使用对象和数组的展开运算符，或某些方法来返回拷贝对象。

Redux期望所有的更新都是不可变更新。

这意味着你需要不断地创造新值并替换旧值，而不是使用传统的变量。

GiveAwesomePowers(person)：对象的内部结构发生了变化，但对象引用没有发生变化。

纯函数概念：1、一个纯函数有相同的输入时，必须有相同的输出；2、一个纯函数不能有副作用。

副作用概念：1、修改函数输入参数；2、修改函数外的其它状态，eg：全局变量；3、调用API；4、console.log；5、Math.random。

JS数组的变异方法：push，pop，shift，unshift，sort，reverse，splice。

```js
//copy的方法
let  a = [1,2,3]
let copy1 = [...a];
let copy2 = a.slice();
let copy3 = a.concat();
```
giveAwesomePowers的纯函数版本，先拷贝person，然后再添加新属性。

React更喜欢不变性：在React中，不要直接改变state和props。

React中：直接改变state可以导致奇怪的bug，同时另组件难以优化。

提高组件性能的通用手法是使组件变纯，组件的重新渲染只是当它的props改变，而不是每次父组件重新渲染时。

不可变性对纯函数很重要：默认情况下，React组件在父组件重渲染时，或使用setState时会重新渲染。

继承了React.PureComponent的组件只在它的props改变或setState时，重新渲染，是常见的性能优化手段。


## 参考文档

https://redux.js.org/tutorials/fundamentals/part-1-overview

https://daveceddia.com/react-redux-immutability-guide/

https://daveceddia.com/why-not-modify-react-state-directly/