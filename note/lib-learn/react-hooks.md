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


# Hooks概览

## State Hook

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
```

useState就是一个Hook，通过在函数组件里调用它来给组件添加一些内部State。React会在重复渲染时保留这个state。

useState的唯一参数就是初始state，返回的值当前状态和一个让你更新它的函数。

### 声明多个State

```ts
const Example : React.FC = () => {
    //multi state
    const [age, setAge] = useState(18);
    const [fruit, setFruit] = useState('banana');
    const [todos, setTodos] = useState([{ text: 'Learn Hooks'}])
    //
}
```

当你调用多次useState的时候，你需要能保证每次渲染时它们的调用顺序是不变的。

### 什么是Hook？

Hook是一些可以让你在函数组件里钩入React State及生命周期等特性的函数。

## Effect Hook

useEffect就是一个Effect Hook，给函数组件增加了操作副作用的能力。它跟class组件中的componentDidMount，componentDidUpdate和componentWillUnmount具有相同的用途，只不过被合并成了一个API。

```ts
    useEffect(() => {
        document.title = `You clicked ${count} times`;
    })
```

当你调用useEffect时，就是在告诉React在完成对DOM的更改后运行你的副作用函数。默认情况下，React会在每次渲染后调用副作用函数。

副作用函数还可以返回一个函数来指定如何清除副作用。React函数会在组件销毁时，调用清除副作用的函数。

```ts
 useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

通过使用useEffect Hook，你可以把组件内相关的副作用组织在一起（创建订阅和取消订阅），而不是把它们拆分到不同的生命周期函数里。

## Hook使用规则

1、只能在函数最外层调用Hook，不要在循环、条件判断或者子函数中调用。

2、只能在React的函数组件中调用Hook。不要在其它JS函数中调用。

React官方提高了linter插件来自动检测这些规则，这些规则是为了让Hook正常工作。

## 自定义Hook

通过自定义Hook，可以将组件的逻辑提取到可重用的函数中。

我们希望FriendStatus和FriendListItem之间共享逻辑。

### 提取自动以Hook

想要在两个函数之间共享逻辑时，我们会把它提取到第三个函数中。而组件和Hook都是函数，所以也同样使用这种方式。

自定义Hook是一个函数，其名称以use开头，函数内部可以调用其它的Hook。

```js
import { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

自定义Hook不需要具有特殊标识。我们可以自由地决定它的参数是什么，以及它应该返回什么。

```js
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

### useYourImagination

自定义Hook解决了以前在React组件中无法灵活共享逻辑的问题。你可以创建涵盖各种场景的自定义Hook，eg：表单处理、动画、订阅声明、计时器。

尽量避免过早地增加抽象逻辑，既然函数组件能够做得更多，那么代码库中函数组件的代码行数可能会剧增，这属于正常现象。


### useReducer类Hook

useReducer的Hook，使用reducer的方式来管理组件的内部state。

```js
function useReducer(reducer, initialState) {
    const [state, setStae] = useState(initialState);

    function dispatch(action) {
        const nextState = reducer(state, action);
        setStae(nextState);
    }

    return [state, dispatch];
}
```

在复杂组件中使用reducer管理内部state的需求很常见，React已经将useReducer的Hook内置到React中。

## Hook API索引

### 基础Hook

#### useState

```js
const [state, setState] = useState(initialState); 
```

setState函数用于更新state，它接收一个新的state值并将组件的一次重新渲染加入队列。

函数式更新，如果新的state需要通过使用先前的state计算得出，那么可以将函数传递给setState。如果更新函数的返回值和当前state完全相同，则随后的重新渲染会被跳过。

```js
const Example: React.FC = () => {
    const initialCount = 0;
    const [count, setCount] = useState<number>(initialCount);

    return (
        <div>
            <p>Count:{count}</p>
            <button onClick={() => {
                setCount(initialCount);
            }}>reset</button>
            <button onClick={() => {
                setCount((prevCount) => {
                    return prevCount + 1;
                })
            }}>+</button>
            <button onClick={() => {
                setCount(prevCount => prevCount - 1);
            }}>-</button>
        </div>
    )
}
```

注意：useState不会自动合并更新对象，可以使用函数式的setState结合展开运算符来达到合并更新对象的效果。

#### 懒惰初始state

ininialState参数可以传入一个函数，在函数中计算并返回初始的state，此函数只在初始渲染时被调用。

```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

#### 跳过state更新

传入相同的State时，React将跳过子组件的渲染及Effect的执行。React使用Object.js比较算法来比较state。

### useEffect

该Hook接收一个命令式、且可能有副作用代码的函数。在函数组件主体内，改变DOM，添加订阅，设置定时器，记录日志以及执行其它包含副作用的操作都是不被允许的。因为这可能产生莫名其妙的bug并破坏UI的一致性。

默认情况下，effect将在每轮渲染结束后执行，你可以选择让它只在某些值改变的时候才执行。

```js
useEffect(didUpdate)
```

#### 清除effect

通常，组件卸载时需要清除effect创建的诸如订阅或计时器id等资源。

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // 清除订阅
    subscription.unsubscribe();
  };
});
```
为了防止内存泄漏，清除函数会在组件卸载前执行。如果组件存在多次渲染，在执行下一个effect之前，上一个effect就已被清除。

#### effect的执行时机

在浏览器完成布局与绘制之后，传给useEffect的函数会延迟调用。然而，并非所有effect都可以被延迟执行。eg：浏览器执行下一次绘制前，用户可见的DOM更新就必须同步执行。

为此，React提供了useLayoutEffect Hook来处理这类effect。与useEffect的结构相同，区别只是调用时机不同。

虽然useEffect会在浏览器绘制后延迟执行，但会保证在任何新的渲染前执行。React将在组件更新前刷新上一轮渲染的effect。

#### effect的条件执行

默认情况下，effect会在每轮组件渲染完成后执行。

传递给useEffect的第二个参数，是effect所依赖的值数组。

```js
useEffect(()=>{
    const subscription = props.source.subscribe();
    return () => {
        subscription.unsubscribe();
    }
},[props.source])
```

如果你要使用此优化方式，请确保数组中包含了所有外部作用域中会发生变化且在effect中使用的变量，否则你的代码会引用到先前渲染中的旧变量。

如果想只运行一次effect，仅在组件挂载和卸载时执行，可以传递一个空数组，表示不依赖于props或state中的任何值。

如果传入了空数组，effect内部的props和state就会一直持有其初始值。


### useContext

```js
const value = useContext(MyContext)
```

接收一个context对象并返回该context的当前值。当前的context值由上层组件中距离当前组件最近的<MyContext.Provider>的value prop决定。

调用了useContext的组件总会在context值变化时重新渲染。

```ts
const ThemeContext = React.createContext(themes.light);

const ThemedButton: React.FC = () => {
    const theme = useContext(ThemeContext);

    return (
        <button style={{
            background: theme.background, color: theme.foreground
        }}> I am styled by theme context!</button >
    )
}

const ToolBar: React.FC = () => {
    return (
        <div>
            <ThemedButton></ThemedButton>
        </div>
    )
}

const App: React.FC = () => {
    return (
        <ThemeContext.Provider value={themes.light}>
            <ToolBar></ToolBar>
        </ThemeContext.Provider>
    )
}
```

### 额外的Hook

### useReducer

useState的替代方案，它接收一个形如(state,action)=>newState的reducer，并返回当前的state以及其配套的dispatch方法。

某些场景下，useReducer会比useState更适用。eg：state逻辑较复杂且包含多个子值，或者下一个state依赖于之前的state等。

```js
const initialCount = { count: 0 }

function reducer(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return {
                count: state.count + 1
            }
        case 'DECREMENT':
            return {
                count: state.count - 1
            };
        default: throw new Error()
    }
}

const App: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, initialCount);
    return (
        <>
            Count: {state.count}
            <button onClick={() => {
                dispatch({ type: 'INCREMENT' })
            }}>INCREMENT</button>
            <button onClick={
                () => {
                    dispatch({ type: 'DECREMENT' });
                }
            }>DECREMENT</button>
        </>
    )
}
```

指定初始state，有两种不同初始化useReducer state的方式：

1、最简单的方法，将state作为第二个参数传入。

2、惰性初始化，需要将init函数作为useReducer的第三个参数传入，这样初始state将被设置为init(initialArg)。可以将用于计算state的逻辑提取到reducer外部，方便复用。

```js
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

### useCallback

返回一个memoized回调函数。把内联回调函数及依赖项数组作为参数传入useCallback，它将返回该回调函数的memoized版本，该回调函数仅在某个依赖项改变时才会更新。

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

useCallback(fn,deps) 相当于 useMemo(()=>fn,deps)。

### useMemo

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```
把创建函数和依赖项数组作为参数传入useMemo，它仅会在某个依赖项改变时才重新计算memoized值。这种优化有助于避免每次渲染都进行高开销的计算。

注意：useMemo的函数会在渲染期间执行，请不要在这个函数内部执行与渲染无关的操作。

你可以把useMemo作为性能优化的手段，但不要把它当成语义上的保证。将来，React可能会选择遗忘一些memorized的值，并在下次渲染时重新计算它们。

```js
const App: React.FC = () => {
    const [numA, setNumA] = useState<number>(1);
    const [numB, setNumB] = useState<number>(2);

    const memoSum = useMemo(() => {
        console.log('useMemo', new Date().getTime())
        return numB + numA;
    }, [numA, numB]);

    return (
        <>
            <p>Sum is {memoSum}</p>
            <button onClick={() => {
                setNumA(numA + 1)
            }}>Increment</button>
        </>
    )
}
```

### useRef

```js
const refContainer = useRef(initialValue);
```

useRef返回一个可变的ref对象，其.current属性被初始化为传入的参数。返回的ref对象在组件的整个生命周期内保持不变。

一个常见的用例便是命令式地访问子组件。

```js
const App: React.FC = () => {
    const inputEl = useRef<HTMLInputElement>(null);

    const onBtnClick = () => {
        inputEl?.current?.focus();
    }

    return (
        <>
            <input ref={inputEl} type="text"></input>
            <button onClick={onBtnClick}>Foucus the input</button>
        </>
    )
}
```

本质上，useRef就像是可以在其.current属性中保存一个可变值的盒子。你应该熟悉ref这一种访问DOM的主要方式。

useRef会在每次渲染时返回同一个ref对象。但是请记住：当ref对象内容发生变化时，useRef并不会通知你，变更.current属性不会引发组件重新渲染。如果想要在React绑定或解绑DOM节点的ref时运行某些代码，则需要使用回调ref来实现。

### useImperativeHandle

useImperativeHandle可以让你在使用ref时自定义暴露给父组件的实例值。在大多数情况下，应当避免使用ref这样的命令式代码。useImperativeHandle应当与forwardRef一起使用。

```js
const FancyInput = React.forwardRef((props, instanceRef) => {
    const inputRef = useRef<any>();
    useImperativeHandle(instanceRef, () => {
        return {
            focus: () => {
                inputRef.current?.focus();
            }
        }
    })
    return (
        <>
            <input ref={inputRef} type="text" />
        </>
    )
});

const App: React.FC = () => {
    let inputRef = useRef();

    const foucusInput = () => {
        let inputEl = inputRef.current as any;
        if (inputEl && typeof inputEl.focus === 'function') {
            inputEl.focus();
        }
    }

    return (
        <>
            <div>
                <FancyInput ref={inputRef} ></FancyInput>
                <button onClick={foucusInput}>Focus</button>
            </div>
        </>
    )
}
```

### useLayoutEffect

函数签名与useEffect相同，但它会在所有的DOM变更之后同步调用effect。可以使用它来读取DOM布局并同步触发重渲染。

### useDebugValue

useDebugValue(value)可用于在React开发者工具中显示自定义Hook的标签。

延迟格式化debug值，某些情况下，格式化值的显示可能是一项开销很大的操作。

```js
useDebugValue(date, date => date.toDateString());
```

useDebugValue第二个参数为格式化函数，该函数只有在Hook被检查时才会被调用。


## Hooks FAQ

### 哪个版本的React包含了Hook

从16.8.0开始，React在以下的模块中包含了React Hook的稳定实现。要启用Hook，所有React相关的package都必须升级到16.8.0或更高版本。

React Native 0.59及以上版本支持Hook。

### 需要重写所有的class组件吗？

不需要。没有计划从React中移除class。

### hook能做而class做不到的？

Hook提供了强大的富有表现力的方式来在组件之间复用功能。

### 我的React知识还有多少是仍然有用的？

Hook是使用你已经知道的React特性的一种更直接的方式。eg：state，生命周期，context以及refs。

它们并没有从根本上改变React的工作方式，你对组件，props以及自顶向下的数据流的知识并没有改变。

### 我应该使用Hook，class，还是两者混用？

鼓励你在写新组件的时候开始尝试Hook。请确保你的团队中的每个人都愿意使用它们并且熟知这份文档的内容。

### Hook能覆盖class的所有使用场景？

我们给Hook设定的目标是尽早覆盖class的所有使用场景。目前暂时没有对应不常用的getSnapshotBeforeUpdate，getDerivedStateFromError和componentDidCatch生命周期的Hook等价写法，但我们计划尽早把它们加进来。

### Hook会代替render props和高阶组件吗？

通常，render props和高阶组件只渲染一个子节点。我们认为让Hook来服务这个使用场景更加简单。这两种模式仍有用武之地。

### Hook对于Redux connect()和React Router等流行的API来说，意味着什么？

你可以继续使用之前使用的API，它们仍然会继续有效。

React Redux从V7.1.0开始支持Hook API并暴露useDispatch和useSelector等hook。

React Router从V5.1开始支持hook。

### Hook能和静态类型一起用吗？

Hook在设计阶段就考虑了静态类型的问题，因为它们是函数，最新版本的Flow和TypeScript React定义已经包含了React Hook的支持。

### 如何测试使用了Hook的组件？

在React看来，一个使用了Hook的组件只不过是一个常规的组件。如果你的测试方案不依赖于React的内部实现，测试带Hook的组件应该和你通常测试组件的方式没什么差别。

### lint规则具体强制了哪些内容？

它假设任何以 「use」 开头并紧跟着一个大写字母的函数就是一个 Hook。

强制了以下内容：

1、对 Hook 的调用要么在一个大驼峰法命名的函数（视作一个组件）内部，要么在另一个 useSomething 函数（视作一个自定义 Hook）中。

2、Hook 在每次渲染时都按照相同的顺序被调用。

## 从Class迁移到Hook

### 生命周期方法要如何对应到Hook？

1、constructor，函数不需要构造函数。可以通过调用useState来初始化state。

2、getDerivedStateFromProps，改为在渲染时安排一次更新。

3、shouldComponentUpdate，React.memo。

4、render，这就是函数组件体本身。

5、componentDidMount，componentDidUpdate，componentWillUnmount统一使用useEffect Hook。

6、getSnapshotBeforeUpdate，componentDidCatch以及getDerivedStateFromError，目前没有这些方法对应的Hook等价写法。

