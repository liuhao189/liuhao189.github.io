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

一个典型的action生成器，传入一些参数，然后返回一个包含type和payload的对象。

```js
function addTodo(text) {
  return {
    type: 'ADD_TODO',
    payload: { text },
  }
}
```

### 使用createAction来定义Action生成器

```js
const addTodo = createAction('ADD_TODO')
addTodo({ text: 'Buy milk' })
// {type : "ADD_TODO", payload : {text : "Buy milk"}})
```

### 使用Action Creators作为Action Types

Redux的reducers需要根据action type来决定如何更新状态。

CreateAction重写了被创建的Action生成器的toString方法，同时定义了type属性，两者均返回action type的字符串。

```js
const actionCreator = createAction('SOME_ACTION_TYPE')

console.log(actionCreator.toString())
// "SOME_ACTION_TYPE"

console.log(actionCreator.type)
// "SOME_ACTION_TYPE"

const reducer = createReducer({}, (builder) => {
  // actionCreator.toString() will automatically be called here
  // also, if you use TypeScript, the action type will be correctly inferred
  builder.addCase(actionCreator, (state, action) => {})

  // Or, you can reference the .type field:
  // if using TypeScript, the action type cannot be inferred that way
  builder.addCase(actionCreator.type, (state, action) => {})
})
```

TypeScript中，TypeScript的编译器当function作为Object的key时，不支持隐式调用toString。你需要手动转型 actionCreator as string或使用actionCreator.type。

## 创建slice state

Redux state可以按切片组织，然后使用combineReducers来合并切片。

```js
import { combineReducers } from 'redux'
import usersReducer from './usersReducer'
import postsReducer from './postsReducer'

const rootReducer = combineReducers({
  users: usersReducer,
  posts: postsReducer,
})
```

Slice Reducers：

1、管理一部分状态，包括初始化状态。

2、定义状态如何更新。

3、定义哪些类型可以更新状态。

通常的做法是将切片的reducer方法定义在一个文件中。action creator定义在第二个文件。因为这两个文件都需要引入Action types(通常在第三个文件定义)。

```js
// postsConstants.js
const CREATE_POST = 'CREATE_POST'
const UPDATE_POST = 'UPDATE_POST'
const DELETE_POST = 'DELETE_POST'

// postsActions.js
import { CREATE_POST, UPDATE_POST, DELETE_POST } from './postConstants'

export function addPost(id, title) {
  return {
    type: CREATE_POST,
    payload: { id, title },
  }
}

// postsReducer.js
import { CREATE_POST, UPDATE_POST, DELETE_POST } from './postConstants'

const initialState = []

export default function postsReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_POST: {
      // omit implementation
    }
    default:
      return state
  }
}
```
思考：

1、真正需要的是reducer函数。

2、我们需要在两个地方写action type。

3、action creator是好的，但不是必须的。

4、我们把这些东西写入多个文件的唯一原因是我们按照代码的内容来做代码分离。

也可以采用单文件模块，将所有相关的代码写入一个文件。

```js
// postsDuck.js
const CREATE_POST = 'CREATE_POST'
const UPDATE_POST = 'UPDATE_POST'
const DELETE_POST = 'DELETE_POST'

export function addPost(id, title) {
  return {
    type: CREATE_POST,
    payload: { id, title },
  }
}

const initialState = []

export default function postsReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_POST: {
      // Omit actual code
      break
    }
    default:
      return state
  }
}
```

思考：避免了Action types常量的引入。但是我们依然需要手写action types和action creators。

### 在Object中定义函数

JS中有多种方式可以在Object中定义函数。

```js
const keyName = "ADD_TODO4";

const reducerObject = {
    // Explicit quotes for the key name, arrow function for the reducer
    "ADD_TODO1" : (state, action) => { }

    // Bare key with no quotes, function keyword
    ADD_TODO2 : function(state, action){  }

    // Object literal function shorthand
    ADD_TODO3(state, action) { }

    // Computed property
    [keyName] : (state, action) => { }
}
```

### createSlice

为了简化上述过程，redux toolkit包含了一个叫createSlice的函数来自动生成Action types和Action creators。

```js
const postsSlice = createSlice({
  name: 'posts',
  initialState: [],
  reducers: {
    createPost(state, action) {},
    updatePost(state, action) {},
    deletePost(state, action) {},
  },
})

console.log(postsSlice)
/*
{
    name: 'posts',
    actions : {
        createPost,
        updatePost,
        deletePost,
    },
    reducer
}
*/

const { createPost } = postsSlice.actions

console.log(createPost({ id: 123, title: 'Hello World' }))
// {type : "posts/createPost", payload : {id : 123, title : "Hello World"}}
```

createSlice会遍历reducers字段中的所有key，然后将按`${name}/${key}`的格式生成action creator。


### 导出和使用Slices

你定义slice，大多数情况下，你需要导出它的action creators和reducers。

```js
const postsSlice = createSlice({
  name: 'posts',
  initialState: [],
  reducers: {
    createPost(state, action) {},
    updatePost(state, action) {},
    deletePost(state, action) {},
  },
})

// Extract the action creators object and the reducer
const { actions, reducer } = postsSlice
// Extract and export each action creator by name
export const { createPost, updatePost, deletePost } = actions
// Export the reducer, either as a default or named export
export default reducer
```

Redux的Action type并不是某个切片单独享有的。概念上，每个切片的reducer拥有自己的一部分数据，但是它应该监听任何action type然后更新自己的状态。eg：用户退出登录事件，多个slice都需要清空数据。

JS模块有循环引用的问题，这会导致import的结果为undefined。这种可能在定义在两个文件中的Slices都想要响应在另一个文件中定义的Action。

循环依赖的情况下，我们需要重构代码来避免循环依赖。一般会抽离共同的代码到一个单独的文件。在那一个文件中，你可以定义通用的action types。然后使用extraReducers参数。


### 异步逻辑和数据获取

#### 使用中间件来启用异步逻辑

Redux本身不知道任何异步逻辑，它只知道怎么样同步dispatch actions，更新state，当数据变化时通知UI。

但是中间件可以做这些事：

1、当action dispatch时，执行额外的逻辑。

2、暂停、修改，延迟，替换或者停止dispatch。

3、写能访问dispatch和getState的额外代码。

4、让dispatch可以接受更多类型的数据。eg：function，promise等。

最常见的使用中间件的原因是允许异步的数据逻辑和store进行交互。

有三个常见的中间件可以使用：1、redux-thunk；2、redux-sage；3、redux-observable。

#### 在slice中定义异步逻辑

createSlice中并不能直接定义thunk方法。

```js
const usersSlice = createSlice({
  name:'users',
  initialState: {
    loading: 'idle',
    users: []
  },
  reducers: {
    usersLoading(state, action){
      if(state.loading==='idle') {
        state.loading ='pending';
      }
    },
    userReceived(state, action) {
      if(state.loading ==='pending') {
        state.loading = 'idle';
        state.users = action.payload;
      }
    }
  }
});

export const { usersLoading, userReceived } = usersSlice.actions;

const fetchUsers = async ()=> {
   dispatch(usersLoading());
   const response = await usersAPI.fetchAll();
   dispatch(usersReceived(response.data));
}
```

#### Redux数据获取模式

1、首先，第一个action指出正在处理中的状态。

2、然后，异步取数逻辑开始执行。

3、根据的返回的请求结果，来dispatch成功的action或是失败的action，并重置处理中的状态。

```js
const getRepoDetailsStarted = () => ({
  type: "repoDetails/fetchStarted"
})
const getRepoDetailsSuccess = (repoDetails) => ({
  type: "repoDetails/fetchSucceeded",
  payload: repoDetails
})
const getRepoDetailsFailed = (error) => ({
  type: "repoDetails/fetchFailed",
  error
})
const fetchIssuesCount = (org, repo) => async dispatch => {
  dispatch(getRepoDetailsStarted())
  try {
    const repoDetails = await getRepoDetails(org, repo)
    dispatch(getRepoDetailsSuccess(repoDetails))
  } catch (err) {
    dispatch(getRepoDetailsFailed(err.toString()))
  }
}
```

然而，写这段代码比较冗余，每一个请求都需要类似的代码。

createAsyncThunk对这段逻辑进行了抽象。

#### 使用createAsyncThunk来发起异步请求

createAsyncThunk简化了上述的步骤，你只需提供一个作为action前缀的字符串和一个payload creator回调来处理异步逻辑，并返回一个promise即可。

```js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userAPI } from './usersAPI';

const fetchUserById = createAsyncThunk('users/fetchByIdStatus', async (userId, thunkAPI) => {
  const response = await userAPI.fetchById(userId);
  return response.data;
})

const userSlice = createSlice({
  name: 'users',
  initialState: { entities: [], loading: 'idle'},
  reducers: {
    //...
  },
  extraReducers:(builder) => {
    builder.addCase(fetchUserById.fulfilled, (state,action)=>{
      state.entities.push(action.payload);
    })
  }
});

dispatch(fetchUserById(123));
```

thunk的Action creator接受的第一个参数，会传递给你的定义的Action Creator回调函数。

第二个参数为thunkAPI。

```js
interface ThunkAPI {
  dispatch: Function
  getState: Function
  extra?: any
  requestId: string // 请求id
  signal: AbortSignal 
}
```

### 管理标准化数据

大多数应用一般会处理嵌套的或相关联的数据。标准化数据的目的是高效得在你的state中组织数据。这通常是通过把数据集合存储为object来实现的。

#### 手动标准化

```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userAPI from './userAPI'

export const fetchUsers = createAsyncThunk('users/fetchAll', async () => {
  const response = await userAPI.fetchAll()
  return response.data
})

export const slice = createSlice({
  name: 'users',
  initialState: {
    ids: [],
    entities: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      // reduce the collection by the id property into a shape of { 1: { ...user }}
      const byId = action.payload.users.reduce((byId, user) => {
        byId[user.id] = user
        return byId
      }, {})
      state.entities = byId
      state.ids = Object.keys(byId)
    })
  },
})
```

虽然我们有能力写这样的代码，但是在大中型应用中，这样的代码比较重复和麻烦。

#### 使用normalizr库来标准化

normalizr是一个流行的库来规范化数据。

```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { normalize, schema } from 'normalizr'

import userAPI from './userAPI'

const userEntity = new schema.Entity('users')

export const fetchUsers = createAsyncThunk('users/fetchAll', async () => {
  const response = await userAPI.fetchAll()
  // Normalize the data before passing it to our reducer
  const normalized = normalize(response.data, [userEntity])
  return normalized.entities
})

export const slice = createSlice({
  name: 'users',
  initialState: {
    ids: [],
    entities: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.entities = action.payload.users
      state.ids = Object.keys(action.payload.users)
    })
  },
})
```

#### 通过createEntityAdapter来规范化

createEntityAdapter提供了标准的方式来将你的data存储到{ids:[],entrities:{}}的state结构里。

同时，它还生成一组reducer function和selectors来处理生成的数据。

```js
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import userAPI from './userAPI'

export const fetchUsers = createAsyncThunk('users/fetchAll', async () => {
  const response = await userAPI.fetchAll()
  // In this case, `response.data` would be:
  // [{id: 1, first_name: 'Example', last_name: 'User'}]
  return response.data
})

export const updateUser = createAsyncThunk('users/updateOne', async (arg) => {
  const response = await userAPI.updateUser(arg)
  // In this case, `response.data` would be:
  // { id: 1, first_name: 'Example', last_name: 'UpdatedLastName'}
  return response.data
})

export const usersAdapter = createEntityAdapter()

// By default, `createEntityAdapter` gives you `{ ids: [], entities: {} }`.
// If you want to track 'loading' or other keys, you would initialize them here:
// `getInitialState({ loading: false, activeRequestId: null })`
const initialState = usersAdapter.getInitialState()

export const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    removeUser: usersAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, usersAdapter.upsertMany)
    builder.addCase(updateUser.fulfilled, (state, { payload }) => {
      const { id, ...changes } = payload
      usersAdapter.updateOne(state, { id, changes })
    })
  },
})

const reducer = slice.reducer
export default reducer

export const { removeUser } = slice.actions
```




## 参考文档

https://redux-toolkit.js.org/usage/usage-guide