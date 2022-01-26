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



