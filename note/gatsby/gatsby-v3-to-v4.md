# Gatsby v3 to v4

## 简介

Version 4的编译速度提升40%左右，引入了两个新的渲染选项。DSG和SSR。

在更强到V4之前，我们推荐升级到gatsby到最新的V3版本。

## 升级依赖

首先，你需要升级你的依赖到V4。依赖包括gatsby到v4.00+，也包含gatsby相关的依赖包。

然后更新社区的插件。

## 处理重大更新

### Node.js需要更新到14.15

这是因为底层的依赖lmdb-store需要Node的v14.15版本。

### sourceNodes阶段的某些API禁用

在sourceNodes生命周期中，禁止使用createFiledExtension，createTypes，addThirdPartySchema。

它们被移到createSchemaCustomization API中，或createResolvers API中。

这样做，可以让Gatsby安全地构建schema，同时在独立的线程中执行更快速地查询（不用处理source）。

### onPluginInit可以和其它生命周期API共享上下文

```ts
const stateCache = {}

const initializePlugin = async (args, pluginOptions) => {
  const res = await getRemoteGraphQLSchema()
  const graphqlSdl = await generateSdl(res)
  const typeMap = await generateTypeMap(res)

  stateCache['sdl'] = graphqlSdl
  stateCache['typeMap'] = typeMap
}

exports.onPreBootstrap = async (args, pluginOptions) => {
  await initializePlugin(args, pluginOptions)
}

exports.createResolvers = ({ createResolvers }, pluginOptions) => {
  const typeMap = stateCache['typeMap']

  createResolvers(generateResolvers(typeMap))
}

exports.createSchemaCustomization = ({ actions }, pluginOptions) => {
  const { createTypes } = actions

  const sdl = stateCache['sdl']

  createTypes(sdl)
}
```

为了在Gatsby4中更好地工作，在onPreBootstrap中的并行查询逻辑需要移动到onPluginInit。

```ts
// Rest of initializePlugin stays the same

exports.onPluginInit = async (args, pluginOptions) => {
  await initializePlugin(args, pluginOptions)
}

// Schema APIs stay the same
```

### 移除过期的flags

从gatsby-config中移除的Flags：QUERY_ON_DEMAND，LAZY_IMAGES，FUNCTIONS，DEV_WEBPACK_CACHE，PRESERVE_WEBPACK_CACHE。

这些功能已经是gatsby-core的一部分，不需要启用或禁用。

### 移除gatsby-admin

通过GATSBY_EXPERIMENTAL_ENABLE_ADMIN来使用的gataby-admin已被移除。我们没看到该功能的大量使用，我们也不会再投入精力去开发这个功能。

### 移除process.env.GATSBY_BUILD_STAGE

这个变量会被gatsby-preset-gatsby使用，如果你使用gatsby-preset-gatsby，你需要传递stage。

### 不支持windows的WSL1

lmdb-store不支持WSL1，建议升级到WSL2。

## 插件维护者相关

大多数情况下，你不需要做任何事来兼容gatsby v4。

为了消除警告信息，gatsby v4应该包含包含在peerDependencies中。

```json
{
  "peerDependencies": {
-   "gatsby": "^3.0.0",
+   "gatsby": "^4.0.0",
  }
}
// 两个版本都支持
{
  "peerDependencies": {
-   "gatsby": "^2.32.0",
+   "gatsby": "^3.0.0 || ^4.0.0",
  }
}
```

如果声明了engines，你需要更新下最低版本。

```json
{
  "engines": {
    "node": ">=14.15.0"
  }
}
```

### 不再支持数据中的循环引用

V3的状态持久化机制支持node中的循环引用，但是v4使用LMDB以后就不再支持了。

### 构造额外的文件

需要所有网站内容，插件和数据来生成DSG或SSR的bundles。当一个插件或你的gatsby-node.js 通过fs模块来引入了外部文件，gatsby的引擎不会包含那个文件，这种情况下，你可能会看到 ENOENT：no such file or directory的错误。






## 参考文档

https://www.gatsbyjs.com/docs/reference/release-notes/migrating-from-v3-to-v4/