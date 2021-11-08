# Redux学习

## 是否需要使用Redux

Redux是一个有用的架构，但不是非用不可，事实上，大多数情况，只用react就够了。

    曾经有人说：如果你不知道是否需要Redux，那就是不需要它。

    Redux的创造者补充说：只有遇到React实在解决不了的问题，你才需要Redux。

如果你的UI层非常简单，没有很多互动，Redux就是不必要的，用了反而增加复杂度。

1、用户的使用方式非常简单。

2、用户之间没有协作。

3、不需要与服务器大量交互，也没有使用WebSocket。

4、视图层View只从单一来源获取数据。

上面这些，都不需要使用Redux。

1、用户的使用方式复杂

2、不同身份的用户有不同的使用方式。

3、多个用户之间可以协作。

4、与服务器大量交互，或者使用了WebSocket。

5、View要从多个来源获取数据。

这些才是Redux的适用场景：多交互，多数据源。

从组件角度看：

1、某个组件的状态，需要共享。

2、某个状态需要在任何地方都可以拿到。

3、一个组件需要改变全局状态。

4、一个组件需要改变另一个组件的状态。

你需要一种机制，可以在同一个地方查询状态，改变状态，传播状态的变化的。

总结：如果你的应用没那么复杂，就没有必要使用它。另一方面，Redux只是Web架构的一种解决方案，也可以选择其它方案。

## 设计思想

Redux的设计思想很简单：

1、Web应用是一个状态机，视图与状态是一一对应的。

2、所有的状态，保存在一个对象里面。

## 基本概念和API

### Store

Store就是保存数据的地方，你可以把它看成一个容器。整个应用只能有一个Store。

Redux提高createStore这个函数，用来生成Store。

```js
import { createStore } from 'redux';
const store = createStore(fn);
```

### State

Store对象包含所有数据，如果想得到某个时点的数据，就要对Store生成快照。这种时点的数据集合，就叫做State。

```js
import { createStore } from 'redux';
const store = createStore(fn);
const state = store.getState(); 
```

Redux规定，一个State对应一个View，只要State相同，View就相同。

### Action

State的变化，会导致View的变化。用户只能接触到View，State的变化必须是View导致的。Action就是View发出的通知，表示State应该要发生变化了。

Action是一个对象，其中的type属性是必须的，表示Action的名称。其它属性可以自由设置。

```js
const action = {
    type: 'ADD_TODO',
    payload: 'Learn Redux'
}
```

Action表示当前发生的事情，改变State的唯一方法，就是使用Action。它会运送数据到Store。

### Action Creator

View要发送多少种消息，就会有多少种Action。可以定义一个函数来生成Action，这个函数就叫Action Creator。

```js
const ADD_TODO = '添加 TODO';

function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}

const action = addTodo('Learn Redux');
```

### Store.dispatch

Store.dispatch是View发出Action的唯一方法。

```js
import { createStore } from 'redux';
const store = createStore(fn);

store.dispatch({
  type: 'ADD_TODO',
  payload: 'Learn Redux'
});
```

接受一个Action对象作为参数，将它发送出去。


### Reducer

Store收到Action以后，必须给出一个新的State，这样View才会发生变化。这种State的计算过程就叫做Reducer。

Reducer是一个函数，它接受Action和当前State作为参数，返回一个新的State。

```js
const reducer = function (state, action) {
    // ...
    return new_state;
}
```

实际应用中，Reducer函数不用像上面这样手动调用，store.dispatch方法会触发Reducer的自动执行。为此，Store需要知道Reducer函数，做法就是生成Store的时候，将Reducer传入createStore方法。

```js
import { createStore } from 'redux';
const store = createStore(reducer);
```

为什么叫Reducer呢？因为它可以作为数组reduce方法的参数。

```js
const actions = [
  { type: 'ADD', payload: 0 },
  { type: 'ADD', payload: 1 },
  { type: 'ADD', payload: 2 }
];

const total = actions.reduce(reducer, 0); // 3
```

### 纯函数

Reducer函数最重要的特征，它是一个纯函数，也就是说，只要是同样的输入，必定得到同样的输出。

纯函数是函数式编程的概念，必须遵守以下一些约束：

1、不得改写参数。

2、不能调用系统IO的API。

3、不能调用Date.now或Math.random等不纯的方法，因为每次会得到不一样的结果。

由于Reducer是纯函数，所以Reducer不能改变State，必须返回一个全新的对象。

```js
// State 是一个对象
function reducer(state, action) {
  return Object.assign({}, state, { thingToChange });
  // 或者
  return { ...state, ...newState };
}

// State 是一个数组
function reducer(state, action) {
  return [...state, newItem];
}
```

### store.subscribe

Store允许使用store.subscribe方法设置监听函数，一旦State发生变化，就自动执行这个函数。

```js
import { createStore } from 'redux';
const store = createStore(reducer);

store.subscribe(listener);
```

只要把View的更新函数放入listener，就会实现View的自动渲染。

store.subscribe方法返回一个函数，调用这个函数可以接触监听。

```js
let unsubscribe = store.subscribe(() =>
  console.log(store.getState())
);

unsubscribe();
```

## Store的实现




## 参考文档

https://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html