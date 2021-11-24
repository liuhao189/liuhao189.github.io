# @reduxjs/toolkit

Redux Toolkit的目标要成为书写redux逻辑的标准。

主要为了解决三个问题：

1、配置Redux Store太复杂。

2、必须依赖很多其它包，才能让Redux工作。

3、Redux需要太多的模板代码。

Redux Toolkit可以应用于大多数常见的场景。同时也提供一些很有用的工具函数来简化你的应用代码。

Redux Toolkit同时包括一个可选的，数据获取和缓存功能的包RTK Query。它包含在包里，但是是单独的入口点。

## 安装

### 已存在的项目

npm包的方式：

```bash
npm i @reduxjs/toolkit
```

也可以使用UMD的方式，UMD的方式会定义window.RTK的全局变量。

## API

Redux Toolkit包含下面的API：

1、configureStore：对createStore进行了包装。提供更简单的配置项，预设了默认值；自动混合slice reducers；自动添加了redux-thunk的中间件；enable Redux DevTools的扩展。

2、createReducer：允许你提供{[actionType]:reduce function}的对象，而不是switch语句；它使用immer库来让你可以简单地更新状态。eg: state.todo[3].completed = true。

3、createAction：生成指定类型的action生成器函数。这些生成器函数有toString方法定义。

4、createSlice：接受reducer函数，slice名称和一个初始状态值，然后自动生成切片的reducer，action creators和action types。

5、createAsyncThunk：接受一个action type字符串和一个返回Promise的方法，返回一个根据Promise的pending/fulfilled/rejected来dispatch不同的action。

6、createEntiyAdapter：生成一组可重用的reducers和selectors来管理store里面的数据。

7、createSelector工具函数，为了方便使用，从Reselect类库中导出的。

## Usage Guide

Redux核心设计得比较灵活，你可以决定如何处理所有事.eg：store setup，state，reducers。

在某些场景下，灵活性是好的，但是在一般的场景下，我们只想要简单便捷的方式来使用Redux（好的默认值）。

或者你在写一些大型程序，你发现你在写很多模式类似的代码，你可能想要有些方法可以不再让你手动写代码。

Redux Toolkit的目的是简化一般场景下的Redux的使用，它可以简化很多Redux相关的代码书写。

Redux Toolkit导出了若干个单独的函数，同时添加了常用的包（Reselect Redux-Thunk）。

## 设置Store

每一个Redux app需要创建一个Redux Store。这通常包含若干个步骤：

1、创建root reducer方法。

2、设置中间件，一般至少需要包含一个处理异步逻辑的中间件。

3、配置Redux DevTools扩展。

4、根据当前运行环境(development or production)来更改一些代码逻辑。

### 手动设置Store

```js
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

import monitorReducersEnhancer from './enhancers/monitorReducers'
import loggerMiddleware from './middleware/logger'
import rootReducer from './reducers'

export default function configureStore(preloadedState) {
  const middlewares = [loggerMiddleware, thunkMiddleware]
  const middlewareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [middlewareEnhancer, monitorReducersEnhancer]
  const composedEnhancers = composeWithDevTools(...enhancers)

  const store = createStore(rootReducer, preloadedState, composedEnhancers)

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))
  }

  return store
}
```

createStore需要基于位置的参数(rootReducer,preloadedState,enhancer)，某些情况下会忘记哪些参数是哪个。

设置middleware和enhancers的代码比较难理解。Redux DevTools插件文档建议你使用手写代码来检测全局命名空间来判断插件是否被启用。

### configureStore简化Store的设置

configureStore的优点：

1、有一个命名的参数，更加易读。

2、让你提供数组来存放中间件和增强。

3、自动启用Redux DevTools。

4、内置了一些插件。redux-thunk是最常用的用来处理同步和异步的场景。在开发阶段，中间件检查场景的错误。eg：使state发生变化，使用非序列化数据。


```js
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers'

const store = configureStore({
  reducer: rootReducer,
})

export default store
```

你可以传递一个Object来包括若干个slice reducers。configureStore会调用combineReducers来合并slice reducers。

```js
import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './usersReducer'
import postsReducer from './postsReducer'

const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
  },
})

export default store
```

```js
export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(loggerMiddleware),
    preloadedState,
    enhancers: [monitorReducersEnhancer],
  })

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))
  }

  return store
}
```

如果你想要你的自定义中间件加预设的中间件，可以传递给middleware一个函数。


## 书写Reducer

Reducer是redux中最重要的概念。一个典型的Reducer需要：

1、根据action的type字段来做出相应的操作。

2、只修改state中自己需要修改的部分的副本，然后更新state。

常见的手段是使用switch语句，当type多时，代码很复杂，可读性很差。另外一个痛点是，reducers为了保持state的不变性，需要自己拷贝state，更新嵌套的内容很难且很容易出错。

### 通过createReducer来简化创建Reducers

随着查找表的流行，Redux Toolkit包含了一个createReducer来方便根据查找表来创建reducer。

除此以外，还使用了Immer库来使你可以原地更新。

```js
function todosReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO': {
      return state.concat(action.payload)
    }
    case 'TOGGLE_TODO': {
      const { index } = action.payload
      return state.map((todo, i) => {
        if (i !== index) return todo

        return {
          ...todo,
          completed: !todo.completed,
        }
      })
    }
    case 'REMOVE_TODO': {
      return state.filter((todo, i) => i !== action.payload.index)
    }
    default:
      return state
  }
}
```

使用createReducer的代码。

```js
const todosReducer = createReducer([], (builder) => {
  builder
    .addCase('ADD_TODO', (state, action) => {
      // "mutate" the array by calling push()
      state.push(action.payload)
    })
    .addCase('TOGGLE_TODO', (state, action) => {
      const todo = state[action.payload.index]
      // "mutate" the object by overwriting a field
      todo.completed = !todo.completed
    })
    .addCase('REMOVE_TODO', (state, action) => {
      // Can still return an immutably-updated value if we want to
      return state.filter((todo, i) => i !== action.payload.index)
    })
})
```

使用createReducer的注意事项：

1、突变的代码只能在createReducer方法内使用。

2、Immer不允许你既返回一个新的state，又突变了状态。

## Action生成器

Redux鼓励你书写Action生成器来简化创建action对象的过程。

一个典型的action生成器。

```js
function addTodo(text) {
  return {
    type: 'ADD_TODO',
    payload: { text },
  }
}
```


## 参考文档

https://redux-toolkit.js.org/usage/usage-guide