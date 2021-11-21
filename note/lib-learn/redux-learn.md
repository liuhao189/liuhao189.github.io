# Redux学习

## 基本用法

Redux是一个有用的架构，但不是非用不可，事实上，大多数情况，只用react就够了。

    曾经有人说：如果你不知道是否需要Redux，那就是不需要它。

    Redux的创造者补充说：只有遇到React实在解决不了的问题，你才需要Redux。

如果你的UI层非常简单，没有很多互动，Redux就是不必要的，用了反而增加复杂度。

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

Redux提供createStore这个函数，用来生成Store。

```js
import {
    createStore
} from 'redux';
const store = createStore(fn);
```

### State

Store对象包含所有数据，如果想得到某个时点的数据，就要对Store生成快照。这种时点的数据集合，就叫做State。

```js
import {
    createStore
} from 'redux';
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
import {
    createStore
} from 'redux';
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
const reducer = function(state, action) {
    // ...
    return new_state;
}
```

实际应用中，Reducer函数不用像上面这样手动调用，store.dispatch方法会触发Reducer的自动执行。为此，Store需要知道Reducer函数，做法就是生成Store的时候，将Reducer传入createStore方法。

```js
import {
    createStore
} from 'redux';
const store = createStore(reducer);
```

为什么叫Reducer呢？因为它可以作为数组reduce方法的参数。

```js
const actions = [{
        type: 'ADD',
        payload: 0
    },
    {
        type: 'ADD',
        payload: 1
    },
    {
        type: 'ADD',
        payload: 2
    }
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
    return Object.assign({}, state, {
        thingToChange
    });
    // 或者
    return {
        ...state,
        ...newState
    };
}

// State 是一个数组
function reducer(state, action) {
    return [...state, newItem];
}
```

### store.subscribe

Store允许使用store.subscribe方法设置监听函数，一旦State发生变化，就自动执行这个函数。

```js
import {
    createStore
} from 'redux';
const store = createStore(reducer);

store.subscribe(listener);
```

只要把View的更新函数放入listener，就会实现View的自动渲染。

store.subscribe方法返回一个函数，调用这个函数可以解除监听。

```js
let unsubscribe = store.subscribe(() =>
    console.log(store.getState())
);

unsubscribe();
```

## Store的实现

上一节介绍了Redux涉及的概念，可以发现Store提供了三个方法。

```js
store.getState();
store.dispatch();
store.subscribe();
```

```js
import {
    createStore
} from 'redux';
let {
    subscribe,
    dispatch,
    getState
} = createStore(reducer, initState);
```

createStore还提供了第二个参数，表示整个应用的状态初始值。如果提供了这个参数，它会覆盖Reducer函数的默认初始值。

```js
const createStore = (reducer) => {

    let state;
    let listeners = [];

    const getState = () => state;

    const dispatch = (action) => {
        state = reducer(state, action);
        listeners.forEach(listener => listener());
    }

    const subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        }
    }

    dispatch({});

    return {
        getState,
        dispatch,
        subscribe
    };
}
```

## Reducer的拆分

Reducer函数负责生成整个state。由于整个应用只有一个State对象，包含所有数据，对于大型应用来说，这个State必然十分庞大，导致了Reducer函数也十分庞大。

```js
const chatReducer = (state = defaultState, action = {}) => {
    const {
        type,
        payload
    } = action;
    switch (type) {
        case ADD_CHAT:
            return Object.assign({}, state, {
                chatLog: state.chatLog.concat(payload)
            });
        case CHANGE_STATUS:
            return Object.assign({}, state, {
                statusMessage: payload
            });
        case CHANGE_USERNAME:
            return Object.assign({}, state, {
                userName: payload
            });
        default:
            return state;
    }
};
```

三种Action分别改变State的三个属性，这三个属性之间没有联系，这提示我们可以把Reducer函数拆分，不同的函数负责处理不同属性，最终合并成一个大的Reducer即可。

```js
const chatReducer = (state = defaultState, action = {}) => {
    return {
        chatLog: chatLog(state.chatLog, action),
        statusMessage: statusMessage(state.statusMessage, action),
        userName: userName(state.userName, action)
    }
};
```

这样拆分，Reducer就易读易写多了。而且和组件结构相吻合。Redux提供了一个combineReducers方法，用于合并各个Reducer函数。

```js
import {
    combineReducers
} from 'redux';

const chatReducer = combineReducers({
    chatLog,
    statusMessage,
    userName
})

export default todoApp;
```

上面那种写法有个前提，那就是State的属性名必须与子Reducer同名。如果不同名，需要使用下面的写法。

```js
const reducer = combineReducers({
    a: doSomethingWithA,
    b: processB,
    c: c
})

// 等同于
function reducer(state = {}, action) {
    return {
        a: doSomethingWithA(state.a, action),
        b: processB(state.b, action),
        c: c(state.c, action)
    }
}
```

总之，combineReducers做的就是产生一个整体的Reducer函数。

combineReducers的简单实现。

```js
const combineReducers = reducers => {
    return (state = {}, action) => {
        return Object.keys(reducers).reduce(
            (nextState, key) => {
                nextState[key] = reducers[key](state[key], action);
                return nextState;
            }, {}
        );
    };
};
```

## 工作流程

![Redux workflow](/note/assets/imgs/redux-flow.jpg)

首先，用户发出Action，然后Store自动调用Reducer，并且传入两个参数State和Action。Reducer会返回新的State。

State一旦有变化，Store就会调用监听函数。listener通过store.getState()得到当前状态。如果使用的是React，这时可以触发重新渲染View。

## 中间件和异步操作

Redux的基本做法：用户发出action，reducer函数算出新的state，view重新渲染。

怎样才能Reducer在异步操作结束后自动执行呢？这就要用到新的工具：中间件。

### 中间件的概念

为了理解中间件，让我们站在框架作者的角度思考问题，如果要添加功能，你会在哪个环节添加？

1、reducer纯函数，只承担计算State的功能，不合适承担其它功能，也承担不了。

2、View，与state一一对应，可以看做state的视图层，也不适合承担其它功能。

3、Action，存放数据的对象，即消息的载体，只能被别人操作，自己不能进行任何操作。

想来想去，只有发送Action的这个步骤，store.dispatch方法，可以添加功能。

```js
let next = store.dispatch
store.dispatch = funciton dispatchAndLog(action) {
    console.log(`dispatching`, aciton);
    next(action);
    console.log(`next state`, store.getState());
}
```

中间件是一个函数，对store.disatch方法进行改造。在发出action和执行reducer这两步之间，添加其它功能。

### 中间件的用法

常用的中间件都有现成的，只要引用别人写好的模块即可。

```js
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
const logger = createLogger();

const store = createStore(
  reducer,
  applyMiddleware(logger)
);
```

redux-logger提供一个生成器createLogger，可以生成中间件logger。然后，将它放在applyMiddleware方法之中，传入createStore方法，就完成了store.dispatch的功能增强。

中间件的次序有讲究，有的中间件有次序要求，使用前要查一下文档。

### applyMiddlewares

它是Redux的原生方法，作用是将所有中间件组合成一个数组依次执行。

```js
export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState, enhancer) => {
    var store = createStore(reducer, preloadedState, enhancer);
    var dispatch = store.dispatch;
    var chain = [];

    var middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    };
    chain = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);

    return {...store, dispatch}
  }
}
```

所有中间件被放入一个数组chain，然后嵌套执行，最后执行store.dispatch。中间件可以拿到getState和dispatch这两个方法。

### 异步操作的基本思路

理解了中间件以后，就可以处理异步操作了。

同步操作只要发出一种action即可，异步操作的差别是它要发出三种Action。

1、操作发起的Action。

2、操作成功的Action。

3、操作失败的Action。

```js
{ type: 'FETCH_POSTS' }
{ type: 'FETCH_POSTS', status: 'error', error: 'Oops' }
{ type: 'FETCH_POSTS', status: 'success', response: { ... } }
```

除了Action种类不同，异步操作的State也要进行改造，反映不同的操作状态。

```js
let state = {
  // ... 
  isFetching: true,
  didInvalidate: true,
  lastUpdated: 'xxxxxxx'
};
```

异步的思路：

1、操作开始时，送出一个Action，触发State更新为“正在操作”状态，View重新渲染。

2、操作结束后，再送出一个Action，触发State更新为“操作结束”状态，View再一次重新渲染。

### redux-thunk中间件

异步操作至少要送出两个Action，用户触发第一个Action，这个跟同步操作一样。如何才能在异步结束时，系统自动送出第二个Action呢？

```js
class AsyncApp extends Component {
  componentDidMount() {
    const { dispatch, selectedPost } = this.props
    dispatch(fetchPosts(selectedPost))
  }
  // ...
}
```

这里的fetchPosts的代码就是Action Creator。下面就是fetchPosts的代码，关键之处就在里面。

```js
const fetchPosts = postTitle => (dispatch, getState) => {
  dispatch(requestPosts(postTitle));
  return fetch(`/some/API/${postTitle}.json`)
    .then(response => response.json())
    .then(json => dispatch(receivePosts(postTitle, json)));
  };
};
```

这个函数执行后，先发出一个Action(requestPosts)，然后进行异步操作。拿到结果后，然后再发出一个Action(receivePosts)。

Action是由store.dispatch方法送出的，而store.dispatch方法正常情况下，参数只能是对象，不能是函数。这时，就需要使用中间件redux-thunk。

异步操作的第一种解决方案就是：写出一个返回函数的Action Creator，然后使用redux-thunk中间件改造store.dispatch。

### redux-promise中间件

另外一种异步操作的解决方案，就是让Action Creator返回一个Promise对象。这时需要使用redux-promise中间件。

这个中间件使得store.dispatch方法可以接受Promise对象作为参数。

这时，Action Creattor有两种写法。

1、返回值是一个Promise对象。

```js
const fetchPosts = 
  (dispatch, postTitle) => new Promise(function (resolve, reject) {
     dispatch(requestPosts(postTitle));
     return fetch(`/some/API/${postTitle}.json`)
       .then(response => {
         type: 'FETCH_POSTS',
         payload: response.json()
       });
});
```
2、Action对象的payload属性是一个Promise对象。这需要从redux-actions模块引入createAction方法。

```js
import { createAction } from 'redux-actions';

class AsyncApp extends Component {
  componentDidMount() {
    const { dispatch, selectedPost } = this.props
    // 发出同步 Action
    dispatch(requestPosts(selectedPost));
    // 发出异步 Action
    dispatch(createAction(
      'FETCH_POSTS', 
      fetch(`/some/API/${postTitle}.json`)
        .then(response => response.json())
    ));
  }
```

下面看一下redux-promise的源码，就会明白它内部是怎么操作的。

```js
export default function promiseMiddleware({ dispatch }) {
  return next => action => {
    if (!isFSA(action)) {
      return isPromise(action)
        ? action.then(dispatch)
        : next(action);
    }

    return isPromise(action.payload)
      ? action.payload.then(
          result => dispatch({ ...action, payload: result }),
          error => {
            dispatch({ ...action, payload: error, error: true });
            return Promise.reject(error);
          }
        )
      : next(action);
  };
}
```

## React-Redux

Redux的作者封装了一个React专用的库，React-Redux。React-Redux虽然提供了便利，但是需要掌握额外的API，并且要遵循它的组件拆分规范。

### UI组件

React-Redux将所有组件分成两大类：UI组件和容器组件。

UI组件有以下几个特征：

1、只负责UI的呈现，不带有任何业务逻辑。

2、没有状态，不使用useState或this.state这个变量。

3、所有的数据都由参数this.props提供。

4、不使用任何Redux的API。

因为不含有状态，UI组件又称为纯组件，它和纯函数一样，纯粹由参数决定它的值。

### 容器组件

容器组件的特征恰恰相反。

1、负责管理数据和业务逻辑，不负责UI的呈现。

2、带有内部状态。

3、使用Redux的API。

总之：UI组件负责UI的呈现，容器组件负责管理数据和逻辑。

React-Redux规定，所有的UI组件都由用户提供，容器组件则由React-Redux自动生成。也就是说，用户负责视觉层，状态管理则是全部交给它。

### connect()

React-Redux提供connect方法，用于从UI组件生成容器组件。connect的意思，就是将这两种组件连起来。

```js
import { connect } from 'react-redux'
const VisibleTodoList = connect()(TodoList);
```

TodoList是UI组件，VisibleTodoList就是由React-Redux通过connect方法自动生成的容器组件。

为了定义业务逻辑，需要给出下面两方面的信息：

1、输入逻辑，外部的数据如何转换为UI组件的参数。

2、输出逻辑，用户发出的动作如何变为Action对象，从UI组件传出去。

```js
import { connect } from 'react-redux'

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)
```

mapStateToProps前者负责输入逻辑，即将state映射到UI组件的参数props。后者负责输出逻辑，即将用户对UI组件的操作映射成Action。

### mapStateToProps

mapStateToProps是一个函数，建立一个从外部的state对象到props对象的映射关系。执行后返回一个对象，里面的每一个键值对就是一个映射。

```js
const mapStateToProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
}
```

mapStateToProps会订阅Store，每当state更新的时候，就会自动执行。

mapStateToProps还可以使用第二个参数，代表容器组件的props对象。

```js
// 容器组件的代码
//    <FilterLink filter="SHOW_ALL">
//      All
//    </FilterLink>

const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
}
```

使用ownProps作为参数后，如果容器组件的参数发生变化，也会引发UI组件的重新渲染。

如果省略mapStateToProps参数，UI组件就不会订阅Store，就是说Store的更新不会引起UI组件的更新。

### mapDispatchToProps

mapDispatchToProps是connect函数的第二个参数。用来建立UI组件的参数到store.dispatch方法的映射。也就是说，它定义了哪些用户的操作应该当作Action，传给Store，它可以是一个函数，也可以是一个对象。

如果是一个函数，会得到dispatch和ownProps两个参数。

```js
const mapDispatchToProps = (
  dispatch,
  ownProps
) => {
  return {
    onClick: () => {
      dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter: ownProps.filter
      });
    }
  };
}
```

该对象的每个键值对都是一个映射，定义了UI组件的参数怎样发出Action。如果mapDispatchToProps是一个对象，它的每个键也是对应UI组件的同名参数。

```js
const mapDispatchToProps = {
  onClick: (filter) => {
    type: 'SET_VISIBILITY_FILTER',
    filter: filter
  };
}
```

键值应该是一个函数，会被当作Action Creator，返回的Action会有Redux自动发出。

### Provide组件

connect方法生成容器组件以后，需要让容器组件拿到state对象，才能生成UI组件的参数。

一种解决方案是将state对象作为参数，传入容器组件。但这样很麻烦，尤其是容器组件可能在很深的层级。

React-Redux提供Provider组件，可以让容器组件拿到state。

```js
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'
import App from './components/App'

let store = createStore(todoApp);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

Provider在根组件外面包了一层，这样一来，App的所有子组件就默认都可以拿到state了。

它的原理是React的context属性。

```js
class Provider extends Component {
  getChildContext() {
    return {
      store: this.props.store
    };
  }
  render() {
    return this.props.children;
  }
}

Provider.childContextTypes = {
  store: React.PropTypes.object
}
```

```js
class VisibleTodoList extends Component {
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  render() {
    const props = this.props;
    const { store } = this.context;
    const state = store.getState();
    // ...
  }
}

VisibleTodoList.contextTypes = {
  store: React.PropTypes.object
}
```

React-Redux自动生成的容器组件的代码，就类似上面这样，从而拿到store。


## 参考文档

https://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html
