# React-Hooks学习

Hook是React16.8的新增特性，它可以让你在不编写class的情况下使用state以及其它React特性。

```ts
import React, { useState } from 'react';

const Example: React.FC = () => {
    const [count, setCount] = useState<number>(0);

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => {
                setCount(count + 1);
            }}>Click me</button>
        </div>
    )

}

export default Example;
```

## 没有破坏性更新

1、完全可选的，无需重写任何已有代码就可以在组件中尝试Hook。

2、100%向后兼容的。Hook不包含任何破坏性改动。

另外没有任何计划从React中移除class。Hook不会影响你对React概念的理解。Hook为已知的React概念提供了更直接的API，props，state，context，refs以及生命周期。

## Hook添加动机

### 在组件之间复用状态逻辑很难

React没有提供将可复用性行为附加到组件的途径。如果你使用过React一段时间，你也许会熟悉一些解决此类问题的方案。eg：render props和高阶组件。

但是这类方案需要重新组织你的组件结构，这可能会很麻烦，使你的代码难以理解。React需要共享状态逻辑提供更好的原生途径。

Hook从组件中提取状态逻辑，使得这些逻辑可以单独测试并复用。Hook使你在无需修改组件结构的情况下复用状态逻辑。

### 复杂组件变得难以理解

复杂组件逐渐被状态逻辑和副作用充斥。每个生命周期常常包含一些不相干的逻辑。

eg：componentDidMount和componentDidUpdate中获取数据。同一个componentWillUnmount中可能包含其它逻辑，如设置事件监听，而之后需要在componentWillUnmount中清除。

相互关联且需要对照修改的代码被进行拆分，而完全不相关的代码却在同一个方法中组合在一起。很容易产生bug。

在多数情况下，不可能将组件拆分为更小的粒度，因为状态逻辑无处不在。

为了解决这个问题，Hook将组件中相互关联的部分拆分成更小的函数，而非强制按照生命周期划分。

### 难以理解的class

除了代码复用和代码管理会遇到困难外，我们还发现class是学习React的一大屏障。必须去理解JS中this的工作方式。

另外，我们希望React在接下来的五年里也能与时俱进，组件预编译会带来巨大的潜力，尤其是在它不局限于模板的时候。

但是class组件给目前的工具带来了一些问题。eg：class不能很好的压缩，热重载出现不稳定。

Hook使你在非class的情况下可以使用更多的React特性。

## 渐进升级策略

没有计划从React中移除class。

