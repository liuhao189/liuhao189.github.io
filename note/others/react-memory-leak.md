# 如何在React-App中避免内存泄漏

根据维基百科，内存泄漏定义为应用程序不正确地管理内存，不再需要的内存没有及时释放；也可能是在内存中的对象不能被代码访问。

虽然，浏览器有垃圾回收机制，但是还有一些常见的错误会导致React应用出现内存泄漏，并在很大程序上降低应用的性能。

## React应用导致内存泄漏的原因

React应用中的内存泄漏主要是由于组件在卸载之前没有取消订阅。这些订阅可能是DOM事件监听器，WebSocket订阅，或者API请求。

```js
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyCompany = function() {
    const [ company, setCompany ] = useState(null);
    useEffect(() => {
        (async () {
             const { data } = await axios.get(
                 'https://random-data-api.com/api/company/random_company'
             );
             setCompany(data);
        })();
    }, []);

    return (
        <>
            <pre>{JSON.stringify(company, null, 3)}</pre>
            <Link to = '/anotherpage'>Another Interesting Page</Link>
        </>
    )
}
```

问题点：用户有一个比较慢的网络连接，用户决定去其它页面。当网络请求返回时，我们会在一个unmounted的方法中调用setState方法。

### 解决方法-AbortControllers

解决办法是在我们卸载组件时取消这个请求，来确保内存中不再有数据。

根据MDN的文档说明，AbortController表示一个控制对象，允许你取消一个或多个Web请求。

```js
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyCompany = function() {
    const [ company, setCompany ] = useState(null);

    useEffect(() => {
         let abortController;
        (async () {
             abortController = new AbortController();
             let signal = abortController.signal;
             const { data } = await axios.get(
                 'https://random-data-api.com/api/company/random_company',
                 { signal: signal }
             );
             setCompany(data);
        })();

        return () => abortController.abort();
    }, []);

    return (
        <>
            <pre>{JSON.stringify(company, null, 3)}</pre>
            <Link to = '/anotherpage'>Another Interesting Page</Link>
        </>
    )
}
```

注意：取消一个已经完成的请求不会报任何错误。在一个已经完成的请求上，abort不会进行任何操作。

## 异步调用的React警告

```js
//Can not perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
```

如果异步调用的state在组件卸载后更新状态，React-App会遇到内存泄漏问题。

## 修复错误方案

### 使用boolean值

```js
const [value, setValue] = useState('checking value...');
useEffect(() => {
  let isMounted = true;
  fetchValue().then(() => {
        if(isMounted ){
        setValue("done!"); // no more error
        } 
      });
    return () => {
      isMounted = false;
      };
}, []);
```

### 使用AbortController

上文提到的。

### 使用use-state-if-mounted hook

```js
const [value, setValue] = useStateIfMounted('checking value...');
//
useEffect(() => {
  fetchValue().then(() => {
      setValue("done!"); // no more error
    });
}, []);
```


## 参考文档

https://www.loginradius.com/blog/engineering/how-to-fix-memory-leaks-in-react/