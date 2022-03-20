# Gataby-webpack

在创建自定义webpack配置之前，建议先看看是否有gatsby的plugin已完成类似的功能。如果没有，而且你的配置具有通用性，可以考虑将该功能写为插件并贡献给社区。

自定义webpack配置主要在gatsby-node的onCreateWebpackConfig中定义。

在Gatsby在创建webpack配置时，这个方法会被调用。你设置的webpack配置会使用webpack-merge和默认的webpack配置合并。

gatsby在整个构建中需要用数次用到webpack配置，gatsby在调用onCreateWebpackConfig时会传入stage作为build type。

stage的值：

1、develop，gatsby develop命令时，有hot reload和CSS内容注入页面。

2、develop-html，和develop相同，但是没有react-hmre在babel的配置中来渲染HTML组件。

3、build-javascript，prodction的JS和CSS构建，创建基于路由的JS包和common chunks。

4、build-html，production的静态HTML页面。

## resolve路径

import Header from '../../components/header'配置下面的resolve路径，可以改为import Header from 'components/header'。

```js
exports.onCreateWebpackConfig = ({stage, actions}) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname,'src'),'node_modules']
    }
  })
}
```

## 使用yarn来处理non-webpack工具

使用resolve路径只能解决webpack内的引用问题，不能应用于其它工具。eg：ESLint，TypeScript。

但是使用yarn，最好的方式是在package.json中设置你的引用。

```js
{
  "dependencies": {
    "hooks": "link:./src/hooks"
  }
}
```


## 修改Babel-loader

可以使用下面的方法来修改babel的配置。

```js
exports.onCreateWebpackConfig = ({ actions, loaders, getConfig }) => {
  const config = getConfig()
  config.module.rules = [
    // Omit the default rule where test === '\.jsx?$'
    ...config.module.rules.filter(
      rule => String(rule.test) !== String(/\.jsx?$/)
    ),
    // Recreate it with custom exclude filter
    {
      // Called without any arguments, `loaders.js()` will return an
      // object like:
      // {
      //   options: undefined,
      //   loader: '/path/to/node_modules/gatsby/dist/utils/babel-loader.js',
      // }
      // Unless you're replacing Babel with a different transpiler, you probably
      // want this so that Gatsby will apply its required Babel
      // presets/plugins.  This will also merge in your configuration from
      // `babel.config.js`.
      ...loaders.js(),
      test: /\.jsx?$/,
      // Exclude all node_modules from transpilation, except for 'swiper' and 'dom7'
      exclude: modulePath =>
        /node_modules/.test(modulePath) &&
        !/node_modules\/(swiper|dom7)/.test(modulePath),
    },
  ]
  // This will completely replace the webpack config with the modified object.
  actions.replaceWebpackConfig(config)
}
```