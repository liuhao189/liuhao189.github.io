# React-Hooks原理剖析

React本身非常函数式的设计哲学，fn(data)=UI，并没有被当前组件模式很好地表达。

## Hooks实现准备

首先从零实现一个极简版本的React，一方面为接下来的Hooks实现做准备，另一方面，也更深入地理解React的基本原理。

## 虚拟DOM

为了实现差量更新以降低DOM操作成本和引入中间层方便扩展，React引入了虚拟DOM，让UI以一直虚拟的表现形式被保存在内存中，并通过ReactDOM等类库使之与真实的DOM同步。

```js
const Greet = ({name}) => {
  return (
    <div><h2>Hello, {name}</h2></div>
  )
}
//
{
  dom: divNode,
  element: {
    type: 'div',
    props: {}
  },
  children: [
    {
      dom:h2Node,
      element: {
        type: 'h2',
        props: {}
      },
      children: [
        {
          dom: textNode,
          element: {
            type: 'text',
            props: {
              nodeValue: 'Hello,xxx'
            }
          }
        }
      ]
    }
  ]
}
```

虚拟DOM和真实DOM类似，也是树形结构，每个节点有真实的DOM节点引用，组件元素数据以及子节点信息。

## TinyReact-V1

首先，实现createElement和createTextElement两个工厂函数，用以表达组件渲染所需的element信息。

```js
//
function createElement(type,props,...children){
  return {
    type,
    props,
    children: children.map(child => {
      return typeof child === 'object' ? child : createTextElement(child);
    })
  }
}
//
function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text
    }
  }
}
```

接下来，实现第一版render方法。

```js
function render(element, parentDom) {
  const { type, props, children = [] } = element;
  const dom = type ==='TEXT_ELEMENT' ? document.createTextNode(''): document.createElement(type);

  Object.keys(props).forEach(name=>{
    dom[name] = props[name];
  });

  children.forEech(child => {
    return render(child, dom);
  });

  parentDom.appchild(dom);
}
```

试试TinyReact的威力：

```js
  const App = ({
    name = 'World'
  } = {}) => {
    return TinyReact.createElement('div', {
        style: "background:salmon;padding:5rem;text-align:center"
      },
      TinyReact.createElement('h1', {}, "Hello" + name),
      TinyReact.createElement('div', {
        style: 'color:white'
      }, 'by TinyReact'));
  }

  window.addEventListener('load', () => {
    TinyReact.render(App(), document.getElementById('app'));
  })
```

## 调谐过程

TinyReact-V1以及可以轻松处理组件首次渲染，但是当我们再次调用render方法时，出现了两个问题：

1、TinyReact依然重新创建了一遍所有DOM节点，没有检查是否已有DOM节点可以复用。

2、创建的DOM节点又被加入到页面父节点中，导致了重复内容。

产生这些问题的原因是：没有通过对比新旧虚拟DOM之间的不同来进行真实的UI的差异化更新。

首先改造render方法，从而在下一次render的时候能够对比两次的差异：

```js
let rootInstance = null;

function render(element, container) {
  const prevInstance = rootInstance;
  const nextInstance = reconcile(container, prevInstance, element);
  rootInstance = nextInstance;
}
```

可以看到几个变化：

1、render中的原渲染逻辑被封装到reconcile函数中。

2、加入一个全局的rootInstance变量，保存着每次reconcile的结构，即一个完整的虚拟DOM实例。

3、调用reconcile时，会传入当前的rootInstance作为参照，完成调用后，将结果更新到rootInstance。

每次render过程就是调谐过程，这一过程会对比当前虚拟DOM实例和新传入的渲染内容直接的差异从而实现差量更新。

```js
function reconcile(parentDom, instance, element) {
  if(instance === null) {
    const newInstance = instantiate(element);
    parentDom.appendChild(newInstance.dom);
    return newInstance;
  } else if(element === null) {
    parentDom.removeChild(instance.dom);
    return null;
  } else if(instance.element.type === element.type) {
    updateDomPeoperties(instance.dom, instance.element.props, element.props);
    instance.childInstances = reconcileChildren(instance, element);
    instance.element = element;
    return instance;
  } else {
    const newInstance = instantiate(element);
    parentDom.replaceChild(newInstance.dom, instance.dom);
    retuen newInstance;
  }
}
```

处理了四种情况：

1、如果之前没有虚拟DOM节点实例，则创建一个实例，并添加到DOM中，第一次执行render时的逻辑。

2、已经有虚拟DOM节点实例，本次渲染传入的element数据为空，意味着新UI中不再需要该节点，从DOM中删除之前的DOM节点，并返回空结果。

3、当前虚拟DOM实例和新的Element类型是一致的，说明节点类型没有变化，只检查是否有对应的节点属性变更，并递归处理所有子节点实例。

4、虚拟DOM实例和新的element类型不一致，则创建新实例并进行替换。

## 函数组件

准备工作的最后一步是支持函数组件，它是Hooks的主要使用场景。

需要改进的地方有两处，首次渲染函数组件时，在instantiate方法内创建对应虚拟DOM节点实例的逻辑：

```js
function instantiate(element) {
  const { type, props, children = [] } = element;

  if(typeof type === 'function') {
    const childElement = type(props);
    const childInstance = instantiate(childElement);
    return {
      dom: childInstance.dom,
      element,
      childInstance
    }
  }
}
```

与处理普通DOM节点主要不同在于：

1、需要执行函数组件，type(props)，进而获得最终的element。

2、函数组件对应的虚拟DOM节点只会有一个子节点实例，而普通的DOM节点可以有多个。

另外移除reconcile调谐函数需要更新函数组件对应虚拟DOM节点实例的分支：

```js
function reconcile(parentDom, instance, element) {
  if(...){
    //....
  } else {
    const childElement = element.type(element.props);
    const oldInstance = instance.childInstance;
    const childInstance = reconcile(parentDom,oldChildInstance, childElement);
    instance.dom = childInstance.dom;
    instance.element = element;
    instance.childInstance = childInstance;
    return instance;
  }
}
```

这样，TinyReact-V3已经可以处理函数组件。


## 实现第一个hook:useState

useState可谓是最为常用的Hook。

```js
function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

特点：1、接受一个初始值；2、返回一个tuple，第一个元素为state最新的值，第二个元素为更新函数；3、函数组件多次执行时，仍然能够返回之前的state值。

能够满足这些条件，尤其是第三个条件，看起来只要在和组件有深度绑定的虚拟DOM上进行修改即可。

```js
{
  dom,
  element,
  childInstance,
  // add state to store state accross multiple executions
  state,
}
```

在组件对应的虚拟DOM节点实例，加入一个state字段来保存当前状态数据。

经过分析TinyReact，需要在每次执行函数组件之前进行state数据的准备工作。

```js
let wipInstance = null;
let wipState = undefined;

function instantiate(element){
  const {type, props, children = []} = element;
  if(typeof type === 'function'){
    wipInstance = {};
    wipState = undefined;
    const childElement = type(props);
    // ...
    wipInstance.state = wipState;
    return wipInstance;
  }
}

function reconcile(parentDom, instance, element) {
  //...
  else {
    wipInstance = instance;
    wipState = instance.state;
    const childElement = element.type(element.props);
    //...
    instance.state = wipState;
    return instance;
  }
}
```

1、添加两个全局变量，wipInstance保存当前正在处理的虚拟DOM实例，wipState保存当前虚拟DOM实例的state数据，以便在useState中直接读取。

2、在instancetiate方法中首次渲染函数组件时，将wipInstance指向新创建的对象，并初始化wipState。

3、在reconcile方法中更新渲染函数组件时，将wipInstance指向已创建的虚拟DOM实例，wipState保存该实例的state数据。

上述保证了wipInstance和wipState在执行函数组件之前已经指向了正确的数据，且由于是全局变量(模块级变量，仅在TinyReact内部共享)，它们可以被其它TinyReact方法直接读取的。

```js
function useState(initialState) {
  wipState = typeof wipState === 'undefined' ? initialState: wipState;
  const instance = wipInstance;
  setState = (newState) => {
    instance.state = newState;
    reconcile(instance.dom.parentNode, instance, instance.element);
  }
  return [wipState, setState];
}
```

逻辑非常简明扼要，主要有两方面：

1、更新wipState，在初始化时赋值未initialState。

2、创建setState方法，接受一个参数作为新指定的state，先将其更新到虚拟DOM实例的state字段，然后执行reconcile方法触发UI更新。

3、将最新的state和setState方法组合为二元tuple返回。

这段逻辑也解释了React Hooks名字的寓意：Hook是React内部引擎扩展到函数组件一个钩子，通过这个钩子，函数组件可以读写内部引擎保存的信息，且该信息在其多次执行时保持一致。

### 多状态支持

上述实现存在一个非常明显的问题，只能保存一个state。

为了让TinyReact更加切合实际，需要进一步添加多状态的支持，实现方式多种多样。

1、将虚拟DOM节点实例的state替换为hooks数组。

2、将虚拟DOM节点实例的state替换为hookHash对象，key通过useState(key,initialState)来指定。

3、将虚拟DOM节点实例的hooks或者hookHash对象作为函数组件的第二个参数传入，这样组件内部可以随意读写任意状态。

React团队经过研究权衡，最终采用了第一种方式，虽然有顺序相关等缺点，但是心智成本低，不需要指定key，不需要额外的参数，而且顺序相关的缺点乐意通过lint解决。

```js
let wipInstance = null;
let wipHookIndex = 0;

function instantiate(element) {
  if(typeof type === 'function') {
    wipInstance = {};
    wipHookIndex = 0;
    const childElement = type(props);
    //...
  }
}

function reconcile(parentDom, instance, element) {
  //...
  wipInstance = instance;
  wipHookIndex = 0;
  const childElement = element.type(props);
  //...
}
```

修改的地方：

1、增加一个全局变量wipHookIndex，用以指向当前正在调用的hook索引，从而获得正确的hook状态数据。

2、在每次执行函数组件(mount或update)时，先要重置wipHookIndex。

继续修改useState。

```js
function useState(initialValue) {
  const instance = wipInstance;
  const hooks = wipInstance.hooks;
  const hookIndex = wipHookIndex;
  hooks[hookIndex] = hooks[hookIndex] || initialValue;

  const setState = (newState) => {
    hooks[hookIndex] = newState;
    reconcile(instance.dom.parentNode,instance, instance.element);
  }

  return [wipInstance.hooks[wipHookIndex++], setState];
}
```

return之前需要wipHookIndex++，从而保证下一个useState可以拿到正确状态。

## 更多Hooks

虚拟DOM实例的hooks属性既然是一个数组，那么它的每个元素存储的可以是状态数据，但也可以是其它类似callback等数据，只要保证顺序即可。它在本质上提供了函数组件在多次执行时可以共享的数据。

## useEffect

useEffect大概是除了useState外最为常用的Hook，它与组件生命周期息息相关，常被用来处理副作用相关的逻辑。

```js
function useEffect(callback,deps) {
  const oldDeps = wipInstance.hooks[wipHookIndex];
  const hasChangedDeps = oldDeps ? deps.some((el,i)=>{ return el!==oldDeps[i]  }): true;
  if(!deps || hasChangedDeps) {
    callback();
    wipInstance.hooks[wipHookIndex] = deps;
  }
  wipHookIndex++;
}
```

接受两个参数：callback是回调函数，用以处理副作用，deps为判断是否需要再次执行callback的依赖条件。

在虚拟DOM实例hooks对应元素存储的内容是上次执行时的deps信息，用以进行对比。

在函数组件初次渲染时，因为hooks对应元素为空，所以callback一定被执行。

更新时，会检查最新传入deps是否相同，如果有变更则执行callback。

一旦执行callback，会更新deps信息到hooks对应元素。

如果没有指定第二个参数deps，则每次都会执行callback。

相比官方的useState，我们并没有支持在callback中返回析构函数，能够在deps发生变更或删除函数组件时进行清理工作。

## useCallback

useCallback的目的是可以在函数组件多次执行时仍然返回同一个回调函数，主要目的是为了避免子组件每次新创建的回调函数而重新渲染，逻辑和useEffect非常相像。

```js
function useCallback(callback,deps) {
  const { hooks } = wipInstance;
  if(hooks[wipHookIndex] && deps) {
    const [oldCallback, oldDeps] = hooks[wipHookIndex];
    if(!deps.some((el,i) => el ! == oldDeps[i])) {
      wipHooksIndex ++;
      return oldCallback;
    }
  }

  hooks[wipHookIndex++] = [callback, deps];
  return callback;
}
```

有了useEffect的基础，上述逻辑并不复杂：

1、hooks对应元素存储的信息是一个二元tuple，与传入的两个参数一直。

2、首次执行时，存储到hooks对应元素然后返回callback。

3、更新执行时，通过对比新旧deps，如一致则返回之前的callback。

4、如未指定deps，则每次都返回最新的callback。

```js
const BigList = ({ onClick }) => (
  <ul>
    <li onClick={onClick}>Foo</li>
    <li onClick={onClick}>Bar</li>
    <li onClick={onClick}>Baz</li>
  </ul>
);
const CallbackExample = () => {
  const [count, setCount] = useState(0);
  const onClick = useCallback((event) => {
    console.log("click", count, event.currentTarget.textContent);
  }, []);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <BigList onClick={onClick} />
    </div>
  );
};
```

经过观察，可以发现在当前TinyReact实现中并没有降低无效渲染次数。原因在于TinyReact并没有在每次更新函数组件前进行props比较，而这一工作实际上有React.memo负责。

## useMemo

useMemo就像是useCallback的孪生兄弟，不同的是，它用来保存已经计算好的结果而不是回调函数。

```js
function useMemo(create, deps) {
  const { hooks } = wipInstance;
  if(hooks[wipHookIndex] && deps) {
    const [oldValue, oldDeps ] = hooks[wipHooksIndex];
    if(!deps.some((el,i)=>el!==oldDeps[i])) {
      wipHookIndex++;
      return oldValue;
    }
  }

  const newValue = create();
  hooks[wipHookIndex++] = [newValue,deps];
  return newValue;
}
```

除了Hooks对应元素保存的tuple中的第一个数据从callback变成了create计算得出的结果外，其它都是一样的。

```js
const fibonacci = (n) => {
  if (n === 0 || n === 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

const MemoExample = () => {
  const [count, setCount] = useState(0);
  const [input, setInput] = useState(10);
  const result = useMemo(() => {
    console.log("memo", input);
    return fibonacci(input);
  }, [input]);

  return (
    <div>
      <p>Fibonacci of input {input} is: {result}</p>
      <button onClick={() => setInput(input + 1)}>Change input</button>
      <button onClick={() => setCount(count + 1)}>Change state</button>
    </div>
  );
};
```

## 最后一个Hook，useRef

让我们来实现最后一个Hook，useRef，它主要用来保存一个可以在组件的整个生命周期内持续存在的ref对象，其current属性被初始化为initialValue，后续可以被修改。

```js
function useRef(initialValue) {
  const { hooks } = wipInstance;
  if(!hooks[wipHookIndex]) {
    hooks[wipHookIndex] = {current: initialValue}
  }
  return hooks[wipHookIndex++];
}
```

最简单的一个Hook，在虚拟DOM实例hooks对应位置存储的就是一个对象而已。



## 参考文档

https://zhuanlan.zhihu.com/p/372790745