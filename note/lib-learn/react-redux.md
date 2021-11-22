# React-Redux官方文档学习

React-Redux是React官方库，它可以让React组件从Redux Store中读取数据，dispatch Action到store中去更新数据。

为了使用React Hooks，React Redux7.1+需要React 16.8.3或以后的版本。

## 安装

### 使用Create React App

推荐的使用方式是使用Create React App来使用。

```bash
# redux + plain js template
npx create-react-app my-app --template redux
# redux + ts template
npx create-react-app my-app --template redux-typescript
```

### 已经存在的React项目

```bash
# If you use npm
npm install react-redux
# if you use yarn
yarn add react-redux
```

如果你使用TypeScript，React Redux的类型信息被维护在另外的地方，但是会作为react-redux的依赖包。所以当你安装react-redux时，会自动安装。

```bash
npm install @types/react-redux
```

## API概述

### Hooks

React-Redux提供了一组自定义的React Hook来让你的组件和Store交互。

useAppSelector可以从Store中读取一个信息并订阅更新。

useDispatch可以返回dispatch来让你更新Store的信息。

## Quick Start

一般我们会使用Redux Toolkit和React Redux来构建应用。

### 安装Redux toolkit 和 React-redux

```js
yarn add @reduxjs/toolkit
```

### 创建一个Redux Store

创建一个文件src/app/store.js。

```js
import { configureStore } from '@reduxjs/toolkit';

export default configureStore({
    reducer: {}
})
```

这会创建一个Redux Store，并且会自动配置Redux DevTools的扩展插件。该插件可以让你在开发阶段更好的检查Store的内容。

### 将Store提供给React

将Porvider组件包裹App的组件，同时将store做为Provider组件的属性。

```js
import store from './store';
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <Example />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);
```

### 创建State Slice

创建一个src/features/counter/counterSlice.js，在那个文件中，引入createSlice函数。

创建Slice需要一个字符串的名字，初始的状态值，一个或多个reducer函数来表明状态如何更新。

一旦Slice被创建，我们可以到处生成的Redux Action creators和reducer function。

```js
import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice(
    {
        name: 'counter',
        initialState: {
            value: 0
        },
        reducers: {
            increment: (state) => {
                // Redux Toolkit允许我们直接变更state的值。这并不会真的改变state的值。
                // 因为它使用Immer的类库，该类库会检查变更，并生成一个新的State
                state.value += 1;
            },
            decrement: (state) => {
                state.value -= 1;
            },
            incrementByMount: (state, action) => {
                state.value += action.payload;
            }
        }
    }
);

//Action creator会生成
export const { increment, decrement, incrementByMount } = counterSlice.actions;

export default counterSlice.reducer;
```

### 添加Slice到Store中

通过在reducers参数里定义一个属性，我们可以指定store来使用这个slice reducer来处理该属性下的State的更新。

```js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counters/counter-slice';

const store = configureStore({
    reducer: {
        counter: counterReducer,
    }
})
```

### 在组件中使用State和Actions

useSelector来读取store中的数据。

useDispatch来dispatch actions。

```js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './counter-slice';

const Counter: React.FC = () => {
    const count = useSelector((state: any) => state?.counter?.value);
    const dispatch = useDispatch();

    return (
        <div>
            <div>
                <button aria-label="Increment value" onClick={() => {
                    dispatch(increment())
                }}>
                    Increment
                </button>
                <span>{count}</span>
                <button aria-label="Decrement value" onClick={() => {
                    dispatch(decrement())
                }}>
                    Decrement
                </button>
            </div>
        </div>
    )
}

export default Counter;
```

正确的Redux Action会被dispatch到store。Counter slice reduce会看到action并更新slice的state。

Counter组件会监听到state变化，并重新渲染。

## 总结

1、configureStore来创建一个Redux Store。接收一个包含reducer属性的对象。

2、Provider组件来包装根组件。<Provider store={store}><App/></Provider>。

3、createSlice来创建一个Redux Slice Reducer。createSlice的参数包括，name，初始状态，reducer函数。

4、在React组件中使用useSelector和useDispatch hook。useSelector来读取属性，useDispatch来获得dispatch方法。

## 在TypeScript中使用