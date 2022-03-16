# Gatsby-插件和主题

Gatsby拥有丰富的插件生态，从CMS集成到图片优化。

## 怎样使用插件

gatsby的插件是npm的包，你可以使用npm安装它们。

eg：gatsby-transformer-json可以将json文件添加到gatsby的数据层。

```js
npm i gatsby-transformer-json
```

然后在gatsby-config中添加和配置options即可。

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

该类插件可以添加数据源，优化远程图片，在数据源之间创建外键。数据源插件将远程或本地的数据转换为gatsby的nodes。数据源插件可以将任何数据转换Gatsby可以处理的格式。

注意：如果你的数据在本地文件系统中，你一般不需要创建source插件。你可以使用gatsby-source-filesystem，然后使用transformer plugins即可。

插件行为：

1、向demo API Server发起请求。

2、将API的响应转换为Gatsby的node系统数据。

3、链接这些node的数据。

4、接受options来控制插件行为。

5、优化图片大小。


### 使用本地插件

可以使用require.resolve。

```js
module.exports = {
    plugins: [require.resolve('../source-plugin')]
}
```

也可以使用npm link或yarn worksapces。

```js
// 插件内gatsby-node.js来打印启动信息
exports.onPreInit = () => {
    console.log(`Loaded source-plugin`)
}
```

### 通过sourceNodes的createNode方法创建node

gatsby-node.js文件添加下面的代码。

```js
exports.sourceNodes = async ({ actions, createContentDigest, createNodeId, getNodesByType }) => {
    const { createNode } = actions;
    const data = {
        posts: [
            {
                id: 1,
                desc: 'Hello World'
            },
            {
                id: 2,
                desc: 'Second post'
            }
        ]
    }
    const POST_NODE_TYPE = 'Post';
    data.posts.forEach(post => {
        createNode(
            {
                ...post,
                id: createNodeId(`${POST_NODE_TYPE}-${post.id}`),
                parent: null,
                children: [],
                internal: {
                    type: POST_NODE_TYPE,
                    content: JSON.stringify(post),
                    contentDigest: createContentDigest(post)
                }
            }
        )
    })
}
```

你实现了gatsby的sourceNodes接口，gatsby启动时会执行该接口，并且把gatsby的和create nodes相关的帮助方法作为参数传递进去。

你需要提供node的必需字段，eg：nodeId，contentDigest(gatsby用来监控脏nodes的，或nodes变更)。

然后你遍历一些数据，调用createNode。

### 从远端获取数据

可以使用Node.js的内建http.get，axios，node-fetch等类库来获取服务器的数据。

### 从URL创建remoteFileNode

为了优化URL的图片，File nodes数据需要添加。然后你就可以安装gatsby-plugin-sharp和gatsby-transformer-sharp来处理图片文件。

gatsby-plugin-sharp和gatsby-transformer-sharp也会为gatsby-image添加需要的nodes数据。

需要实现一个onCreateNode接口，Node创建时会调用该接口。然后调用gatsby-source-filesystem的createRemoteFileNode方法，该方法会从远端下载文件并创建File Node。



## 参考文档

