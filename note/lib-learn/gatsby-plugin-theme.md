# Gatsby-插件和主题

Gatsby有丰富的插件生态，从CMS集成到图片优化。

## 怎样使用插件

gatsby的插件是Node的包，所以你可以使用npm安装它们。

eg：gatsby-transformer-json可以将json文件添加到gatsby的数据层。

```js
npm i gatsby-transformer-json
```

然后在gatsby-config中添加和配置即可。

```js
plugins: [
    `gatsby-transformer-json`
]
```

plugin可以传递参数。注意options参数会被序列化为字符串，所以它们不能是函数。

```js
plugins: [
    {
        resolve: `gatsby-source-filesystem`,
        options: {
            path: `${__dirname}/src/data/`,
            name: 'data'
        }
    }
]
```

## 怎样创建通用插件

plugin一般是一个npm包。通用插件的理念更注重插件的组成，而不是根据功能选择特定的标签（source，transformer，local）。

### 初始化你的插件项目

```bash
npm init
```

在插件中创建一个gatsby-node.js文件，这可以让你使用gatsby node APIS。

```bash
# in plugin project
npm link
# in use project
npm link your-plugin-name
```

## 怎样创建source插件

该插件将数据源，优化远程图片，在数据源之间创建外键。

数据源插件将远程或本地的数据转换为gatsby的nodes。

数据源插件可以将任何数据转换Gatsby可以处理的格式。

注意：如果你的数据在本地文件系统中，你一般不需要创建source插件。你可以使用gatsby-source-filesystem，然后使用transformer plugins即可。

