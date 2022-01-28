# AntDesign Of React - 1

## 组件总览

antd为Web应用提供了丰富的基础UI组件，除了官方组件，Antd官方也提供[社区精选组件](https://ant.design/docs/react/recommendation-cn)作为必要的补充。

### 通用组件

Button，Icon和Typography排版。

### 布局

Divider分割线，Grid栅格，Layout布局，Space间距。

### 导航

Affix固钉，BreeadCrumb面包屑，Dropdown下拉菜单，Menu导航菜单，Pagination分页，PageHeader页头，Steps步骤条。

### 数据录入

AutoComplete，Checkbox，Cascader级联选择，DatePicker日期选择框，Form表单，InputNumber数字输入框，Input输入框，Metions提及，Rate评分，Radio单选框，Switch开关，Slider滑动输入条，Select选择器，TreeSelect树选择，Transfer穿梭框，TimePicker时间选择框，Upload上传。

### 数据展示

Avatar，Badge，Comment，Collapse，Carousel，Card，Calendar，Descrptions，Empty，Image，List，Popover，Statistic，Tree，Tooltip，Timeline，Tag，tabs
,Table。

### 反馈

Alert，Drawer，Modal，Message，Notification，Progress，Popconfirm，Result，Spin，Skeletion。

### 其它

Anchor，BackTop，ConfigProvider。

### 重要组件

EditableProTable，ProLayout，ProForm，ProTable，ProDescriptions，ProList。

## Button按钮

按钮用于开始一个即时操作。响应用户点击行为，触发相应的业务逻辑。

五种按钮：1、主按钮，用于主行动点，一个操作区域只有一个主行动点；2、默认按钮，没有主次之分的一组行动点；3、虚线按钮，常用于添加操作；4、文本按钮，用于最次级的行动点；5、链接按钮，一般用于链接，导航到该位置。

四种状态：1、危险，删除&移动&修改权限等危险操作，一般需二次确认；2、幽灵，背景色比较复杂的地方，首页或产品页；3、禁用，不可用的时候，一般需要文案解释；4、加载中，异步操作等待反馈的时候，也可避免多次提交。

图标按钮：当需要在Button内嵌入Icon时，可以设置icon属性，或者直接在Button内使用Icon组件。想控制icon具体的位置，只能直接使用Icon组件。

按钮尺寸：按钮有大、中、小三种尺寸。通过设置size为large，small。

加载中状态：添加loading属性即可让按钮处于加载状态。

不可用状态：添加disabled属性可让按钮处于不可用状态，同时按钮样式也会改变。

幽灵按钮：将按钮的内容反色，背景变为透明，常用在有色背景上。

多个按钮组合：按钮组合使用时，推荐使用1个主操作+n个次操作，3个以上操作时候将更多操作放到Dropdown.Button中组合使用。

block按钮：block属性将使按钮适合其父宽度。

危险按钮：在4.0以后，危险成为一种按钮属性而不是按钮类型。

API：block，danger，disabled，ghost，href，htmlType，icon，loading，shape，size，target，type，onClick。

此外还支持原生button的所有属性。

FAQ：如何移除两个汉字之间的空格？

根据Ant Design设计规范要求，我们会在按钮内只有两个汉字时自动添加空格，如果不需要此属性，可以设置ConfigProvider的autoInsertSpaceInButton为false。

## Icon图标

语义化的矢量图形，使用图标组件，你需要安装@ant-design/icons图标组件包。

基本用法：不同主题的icon组件名为图标加主题做为后缀，通过设置spin属性来实现动画旋转。

双色图标：可以通过设置twoToneColor属性设置主题色。

自定义图标：利用Icon组件封装一个可复用的自定义图标。可以通过component属性传入一个组件来渲染最终的图标。

使用iconfont：对于使用IconFont的用户，通过设置createFromIconFontCN方法参数对象中的scriptUrl字段，即可轻松使用已有项目中的图标。

使用多个iconfont：@ant-design/icons@4.1.0以后，scriptUrl可引用多个资源，用户可灵活的管理iconfont图标，如果资源的图标出现重名，会按照数组顺序进行覆盖。

API：className，设置图标的样式名；rotate图标旋转角度；spin，是否有旋转动画；style设置图标的样式；twoToneColor，仅使用双色图标，设置双色图标的主要颜色。

提供三种主题的图标（Outlined，Filled，TwoTone），不同主题的Icon组件为图标名加主题做为后缀。

### 自定义Icon

API：component，控制如何渲染图标，通常是一个渲染根组件为<svg>的React组件；rotate，图标旋转角度；spin，是否有旋转动画；style，设置图标的样式。

### 关于SVG图标

从3.9.0之后，我们使用了SVG图标替换了原先的font图标，从而带来了以下优势：

1、完全离线后使用，不需要从CDN下载字体文件。图标不会因为网络问题呈现方块，也无需字体文件本地部署。

2、在低端设备上SVG有更好的清晰度。

3、支持多色图标。可以使用style和classnName设置图标的大小和单色图标的颜色。

4、对于内建图标的更换可以提供更多的API，而不需要进行样式覆盖。

### 双色图标主色

可以通过getTwoToneColor和setTwoToneColor来全局设置图标主色。

### 自定义font图标

createFromIconfontCN方法，其本质是创建了一个使用use标签来渲染图标的组件。

方法参数为：{extraCommonProps: { [key string]:any }, scriptUrl:string|string[]}。

### 自定义SVG图标

如果使用webpack，可以通过配置@svgr/webpack来将svg图标作为React组件导入。

Icon中的compoent组件接受的属性：className，fill，height，style，width。

## Typography排版

文本的基本格式。

何时使用：当需要展示标题、段落、列表内容时使用，如文章/博客/日志的文本样式。当需要一些基于文本的基础操作时，如拷贝/省略/可编辑。

标题组件：展示不同级别的标题。默认level为1，可以设置1，2，3，4，5。

```js
<Title>h1，Ant Design.</Title>
<Title level={2}>h2</Title>
```

文本和超链接组件：内置不同样式的文本和超链接组件。

```js
<Text type="secondary">secondary</Text>
<Text mark>Mark</Text>
<Link href="https://ant.design" target="_blank">Link</Link>
```

可交互：提供可编辑和可复制等额外的交互能力。

```js
<Paragraph editable={{onChange:setEditableStr}}>{editableStr}</Paragraph>
<Paragraph copyable>Copy Text</Paragraph>
```

省略号：多行文本省略，可以通过tooltip属性配置省略展示内容。大量文本推荐使用expandable。

```js
<Paragraph ellipsis={ellipsis ? {rows:2,expandable:true,symbol:'more'}:false}>  </Paragraph>
```

省略中间：使用ellipsis={{suffix:...}}可以封装一个从中间省略内容的组件，适合于需要保留文本末位特征的内容。

添加后缀的省略：使用ellipsis的suffix属性指定。

### Text && Title && Paragraph

API：code，copyable，delete，disabled，editable，ellipsis，keyboard，mark，onClick，strong，italic，type文本类型，underline。

### Copyable

```js
{
  text: string, //拷贝到剪切板里的文本
  onCopy: function,// 拷贝成功的回调函数，
  icon: ReactNode, // 自定义拷贝图标
  tooltips: false | [ReactNode, ReactNode] // 自定义提示稳文案，默认为[复制，复制成功]
}
```

### editable

```ts
{
  icon: ReactNode,
  tooltip: boolean,
  editing: boolean, 
  maxLength: number,
  autoSize: boolean | {minRows:number, maxRows: number}, 
  onStart: function,
  onChange: function, // 文本域编辑时触发
  onCancel: function, //esc退出编辑状态时触发
  onEnd: function,
  triggerType: ('icon'|'text')[],
  enterIcon: ReactNode,
}
```

### ellipsis

```js
{
  rows: number,
  expandable: boolean,
  suffix: string, //自定义省略内容后缀
  symbol: ReactNode, //自定义展示描述文件，默认为 展开
  tooltip: boolean| ReactNode, 
  onExpand: function,
  onEllipsis:function,
}
```

