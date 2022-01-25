# AntDesign Of React - 1

## 组件总览

antd为Web应用提供了丰富的基础UI组件，除了官方组件，Antd官方也提供[社区精选组件](https://ant.design/docs/react/recommendation-cn)作为必要的补充。

### 通用组件

Button，Icon和Tyography排版。

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



