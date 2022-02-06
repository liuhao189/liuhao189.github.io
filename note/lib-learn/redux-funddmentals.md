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

React中：直接改变state可能导致奇怪的bug，同时使组件难以优化。

提高组件性能的通用手法是使组件变纯，组件的重新渲染只是当它的props改变，而不是每次父组件重新渲染时。

不可变性对纯函数很重要：默认情况下，React组件在父组件重渲染时，或使用setState时会重新渲染。

继承了React.PureComponent的组件只在它的props改变或setState时，重新渲染，是常见的性能优化手段。

JS的对象和数组直接使用===，判断的是引用相等。

为什么不遍历检查相等？根据对象的大小，遍历检查的时间差异很大。而引用相等判断会在常量时间内完成。

React的setState方法会浅拷贝state，然后和参数合并来生成新的state。

##### 常见场景

改变对象：利用展开运算符，多层对象需要多层展开。

```js
{
  ...state,
  prop: state.age++,
}
```

插入数组：利用展开运算符。

```js
[
  newItem,
  ...state
]
```

数组中item变更：map方法返回新数组即可。

数组中插入item：先slice拷贝，然后splice。

数组中删除item：使用filter即可。

##### 使用Immer类库更新

Immer让你可以用常见的手法来更新对象。Immer会帮你处理为不可变更新。

```bash
npm i immer
```

然后引入produce方法。

```js
function immerifiedReducer(state, action) {
  const key = 'ravenclaw';

  return produce(state, draft => {
    draft.houses[key].points += 3;
  });
}
```

produce方法返回了一个柯里化的方法，所以setState的函数版本可以直接传递一个参数。

```js
this.setState(produce(draft => {
  draft.count += 1;
}));
```

Immer：数据中未更改的部分不需要复制，而是在内存中与相同状态的旧版本共存。使用Immer时，会对草稿对象进行更改，该对象会记录更改并负责创建必要的副本。

##### Immer的原理

草稿是当前状态的代理，Immer会将你对草稿的操作记录下来，一旦你的更新方法运行结束，Immer会根据操作记录和old state来生成nextState。


### Redux的专业术语

#### Actions

普通的JS对象，type字段表示类型。可以理解为应用中发生的事件。

type一般是domain/eventName格式的，额外的信息存储在payload中。

#### Reducers

Reducer是一个接受当前状态和一个action对象的函数，返回新的状态。(state,action) => newState。可以理解为事件处理器。

Reducer需要是纯函数，只基于state和action计算newState，不允许改变已有的state，只能做不可变的更新。不能有异步逻辑和副作用。

#### Store

集中式的状态存储的地方，有getState方法可以获取当前数据。

#### Dispatch

store有一个dispatch方法，只有调用该方法才能更新state。可以理解为事件生成器。

#### Selectors

Selectors是知道如何从store中提取特定信息的函数。可以减少重复的提取state的逻辑。

### 核心概念和原则

#### 数据的唯一来源

应用的全部状态应该存储到全局唯一的store中。

#### 状态是只读的

只能使用dispatch action来更新数据。UI不会直接写数据，action是普通的JS对象，可以被logged，序列化存储，方便调试和测试。

#### 用纯reducer函数用来更新

更好理解。

#### Redux应用的数据流

初始化：

1、Redux Store使用root reducer方法来初始化。并生成初始state。

2、UI组件根据当前的状态渲染，同时订阅了store的更新事件。

更新：

1、app中发生了事件，app dispatch了action到Store。

2、store执行reducer函数，reducer函数根据当前状态和action来计算newState。

3、store通知UI状态更新。UI组件检查自身关注的状态是否改变。

## 第三部分，State，Action和Reducer

### 设计State的值

React和Redux的核心原则之一是UI应该基于你的状态。

核心的是：todoList和当前的filter选项。todoItem包含name，completed status，id，color分类。Filter包含color和status。

todos是应用级别的state，然而filter选型是UI级别的state。

### 设计state结构

Redux中，我们的状态一般使用普通的JS对象和数组来构成。

### 设计Actions

描述当前发送了什么事件的action。

1、add，toggle，select color，delete，mark all completed，clear all。。。

### 写Reducers

Redux App只有一个reducer函数，即root reducer。

Redux的目标之一是让你的代码可预测，当一个函数的输出只由输入参数决定，代码的工作方式和相关的测试会很容易。

### 分开Reducers

Redux的reducers一般按照它们更新的state的部分来分开维护。

我们推荐基于功能来组织你的redux代码。同功能模块的redux代码经常分离到一个以slice结尾的文件中。

### 结合Reducers

combineReducers方法。

## 第四部分，Store

Store负责的部分：

1、将当前应用程序状态存储在内部。

2、允许使用store.getState来获取当前状态。

3、允许使用store.dispatch(action)来更新状态。

4、允许使用store.subscribe来注册回调函数。

5、允许使用store.subscribe返回的unsubscribe函数来注销回调。

### 创建Store

主要使用createStore方法来创建Store。createStore的第二个参数可以接受preloadedState。

```js
import { createStore } from 'redux';
```

### Redux Store的代码实现

store有state和reducer的属性存储。getState返回当前的state。subscribe保存一个监听函数数组。dispatch调用reducer，然后保存状态，最后依次调用监听器。

store在初始化时dispatch了一个action，来初始化reducer提供的状态。

store的API包含{dispatch, subscribe, getState}。

### 配置Store

Store允许使用插件来增强功能。插件可以提供自身版本的dispatch，getState和subscribe函数。

Redux里有一个compose方法来混合多个插件功能。

```js
const composedEnhancer = compose(sayHiDispatch, includeMeaningOfLife);
createStore(rootReducer, undefined, composedEnhancer);
```

### 中间件

插件的功能非常强大，因为插件可以重写dispatch，getState和subscribe。但是大多数情况下，我们只需要自定义我们的dispatch的表现。

Redux允许使用一种特殊的插件来自定义dispatch，这种特殊的插件叫做middleware。

### 使用中间件

主要使用applyMiddleware方法。

```js
import {createStore, applyMiddleware } from 'redux';
const middlewareEnhancer = applyMiddleware(print1, print2, print3);
const store = createStore(rootReducer, middlewareEnahancer)//如果没有初始化状态，插件可以是第二个参数。
```

Middleware围绕store的dispatch方法形成了一个pipeline。跟recuder不同的是，middleware可以包含副作用。

### 写自定义的中间件

Redux的middleware一般包含一系列的三层嵌套函数。

```js
function exampleMiddleware(storeAPI) {
  return function wrapDispatch(next) {
    return function handleAction(action) {
      //可以使用storeAPI.dispatch(action)来重启流水线
      //可以使用storeAPI.getState来获取状态
      //可以使用next(action)来执行流水线的下一个方法
      return next(action);
    }
  }
}
```

只有handleAction的函数代码在action被dispatch时被调用。

### Middleware的使用场景

middleWare可以做很多事情。

1、打印一些日志。

2、设置定时器。

3、调用async的API。

4、修改action。

5、暂停action或stop action。

中间件旨在包含具有副作用的逻辑。此外，中间件可以让dispatch接受不是普通对象的action。

### Redux DevTools

在安装浏览器Redux-DevTools插件后，我们需要在store中配置一个配套的插件才可以使用浏览器插件。

我们需要安装一个redux-devtools-extension的npm包，该npm包导出comoseWidthDevTools方法。

```js
import { composeWithDevTools } from 'redux-devtools-extension';
const composedEnhancer = composeWithDevTools(applyMiddleware(print1,print2));
const store = createStore(rootReducer, composedEnhancer);
```

## 第五部分，UI和React

React中的UI可以理解为state的函数，Redux包含状态并响应UI的交互动作。

### React-redux

官方的react的包为react-redux。

### 设计组件树

和设计state的结构类似，我们也需要根据需求来设计UI组件树。

### 使用useSelector来读取状态

useSelector接受一个选择函数。选择函数的输入参数为整个state，可以返回state的部分值，也可以返回计算的值。

```js
const selectTodos = state => state.todos;
//
const selectTotalCompletedTodos = state => {
  const completedTodos = state.todos.filter(todo => todo.completed);
  return completedTodos.length;
}
```

useSelector会订阅Redux Store的state改变事件。如果state改变，它会调用selector函数。如果selector函数的返回和上一次的值不同，useSelector会使我们的组件重新渲染。

注意：useSelector使用===来比较state是否改变。eg: map的数组每次都会触发重新渲染。

### 使用useDispatch

react-redux的useDispatch的结果为store的dispatch方法。

```js
const dispatch = useDispatch();
```

### 使用Provider来提供Store

我们需要告诉React-redux，我们使用是全局store。这通过<Provider>组件包裹<App>组件，然后将store设置为<Provider>的store属性。

### React-Redy模式

#### 全局状态、组件状态和表单




## 参考文档

https://redux.js.org/tutorials/fundamentals/part-1-overview

https://daveceddia.com/react-redux-immutability-guide/

https://daveceddia.com/why-not-modify-react-state-directly/