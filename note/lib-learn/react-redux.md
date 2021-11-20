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

