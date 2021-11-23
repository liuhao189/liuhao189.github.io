# @reduxjs/toolkit

Redux Tooolkit的目的是想成为书写redux逻辑的标准。

主要为了解决三个问题：

1、配置Redux Store太复杂。

2、必须依赖很多其它包，才能让Redux工作。

3、Redux需要太多的模板代码。

Redux Toolkit不能解决所有场景下的问题。但是可以应用于大多数常见的场景。同时也提供一些很有用的工具函数来简化你的应用代码。

Redux Toolkit同时包括一个数据获取和缓存功能的包RTK Query。它包含在包里，但是是单独的入口点，它是可选的。

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

Redux核心设计得比较灵活，它让你决定如何处理所有事.eg：store setup，state，reducers。

在某些场景下，灵活性是好的，但是在一般的场景下，我们只想要最简单的方式来使用Redux（好的默认值）。

或者你在写一些大型程序，你发现你在写很多模式类似的代码，你可能想要有些方法可以不再让你手动写代码。

Redux Toolkit的目的是简化一般场景下的Redux的使用，它可以简化很多Redux相关的代码书写。

Redux Toolkit导出了若干个单独的函数，同时添加了常用的包（Reselect Redux-Thunk）。


## 参考文档

https://redux-toolkit.js.org/usage/usage-guide