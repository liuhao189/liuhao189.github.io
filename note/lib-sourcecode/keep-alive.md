# keep-alive的原理

## keep-alive的使用

keep-alive是Vue.js的一个内置组件，它能够将不活动的组件实例保存在内存中，而不是直接将其销毁，它是一个抽象组件，不会被渲染到DOM中，也不会出现在父组件链中。

提供了include与exclude两个属性，允许组件有条件地进行缓存。

```html
<keep-alive>
    <coma v-if="test"></coma>
    <comb v-else></comb>
</keep-alive>
<button @click="test=handleClick">请点击</button>
```

```js
export default {
    data () {
        return {
            test: true
        }
    },
    methods: {
        handleClick () {
            this.test = !this.test;
        }
    }
}
```

点击button的时候，coma和comb两个组件会发生切换，但是这两个组件的状态会被缓存起来。

### keep-alive props

keep-alive组件提供了include和exclude两个属性来允许组件有条件地进行缓存。

```js
<keep-alive include="a">
  <component></component>
</keep-alive>
```

### keep-alive生命钩子

keep-alive提供两个生命钩子，分别是activated与deactivated。

## 深入keep-alive组件实现

### create & destroyed钩子

created钩子会创建一个cache对象，用来作为缓存容器，保存vnode节点。

```js
  created () {
    // 创建缓存
    this.cache = Object.create(null)
    // 创建keys
    this.keys = []
  }
```

destroyed钩子则在组件被销毁时清除cache缓存中的所有组件实例。

```js
/* destroyed钩子中销毁所有cache中的组件实例 */
  destroyed () {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  }
```

### render方法

```js
 render () {
    const slot = this.$slots.default
    const vnode: VNode = getFirstComponentChild(slot)
    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      const name: ?string = getComponentName(componentOptions)
      const { include, exclude } = this
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      const { cache, keys } = this
      const key: ?string = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        keys.push(key)
      } else {
        // delay setting the cache until update
        this.vnodeToCache = vnode
        this.keyToCache = key
      }

      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
```

首先通过getFirstComponentChild获取第一个子组件，获取该组件的name(如果name为空，则会使用tag)。

接下来将name通过include和exclude属性进行匹配，匹配不成功，则直接返回vnode。

```js
/* 检测name是否匹配 */
function matches (pattern: string | RegExp, name: string): boolean {
  if (typeof pattern === 'string') {
    /* 字符串情况，如a,b,c */
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    /* 正则 */
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}
```

接下来的事情，如果key存在，直接将缓存的vnode的实例componentInstance(组件实例)覆盖到目前的vnode上面，否则将vnode存储在cache中。

### watch

接下来使用$watch方法来监控include和exclude的变化，然后执行pruneCache的方法。

```js
  mounted () {
    this.cacheVNode()
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },
```

```js
function pruneCache (keepAliveInstance: any, filter: Function) {
  const { cache, keys, _vnode } = keepAliveInstance
  for (const key in cache) {
    const entry: ?CacheEntry = cache[key]
    if (entry) {
      const name: ?string = entry.name
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}

function pruneCacheEntry (
  cache: CacheEntryMap,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const entry: ?CacheEntry = cache[key]
  if (entry && (!current || entry.tag !== current.tag)) {
    entry.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}
```

pruneCache主要是遍历cache中的key，如果不符合新的include或在exclude之内，则执行组件实例的销毁$destory方法来讲组件销毁。

## activate &&  deactivate hooks

代码主要在insert和destroy中。

```js
    // 插入时判断.data.keepAlive属性，然后去调用activateChildComponent
    insert: function insert (vnode) {
      var context = vnode.context;
      var componentInstance = vnode.componentInstance;
      if (!componentInstance._isMounted) {
        componentInstance._isMounted = true;
        callHook(componentInstance, 'mounted');
      }
      if (vnode.data.keepAlive) {
        if (context._isMounted) {
          // vue-router#1212
          // During updates, a kept-alive component's child components may
          // change, so directly walking the tree here may call activated hooks
          // on incorrect children. Instead we push them into a queue which will
          // be processed after the whole patch process ended.
          queueActivatedComponent(componentInstance);
        } else {
          activateChildComponent(componentInstance, true /* direct */);
        }
      }
    },
```

```js
  // 销毁时判断.data.keepAlive属性，然后调用deactivateChildComponent
  destroy: function destroy (vnode) {
      var componentInstance = vnode.componentInstance;
      if (!componentInstance._isDestroyed) {
        if (!vnode.data.keepAlive) {
          componentInstance.$destroy();
        } else {
          deactivateChildComponent(componentInstance, true /* direct */);
        }
      }
    }
```

```js
export function activateChildComponent (vm: Component, direct?: boolean) {
  if (direct) {
    vm._directInactive = false
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false
    for (let i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i])
    }
    callHook(vm, 'activated')
  }
}
//
export function deactivateChildComponent (vm: Component, direct?: boolean) {
  if (direct) {
    vm._directInactive = true
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true
    for (let i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i])
    }
    callHook(vm, 'deactivated')
  }
}
```

## 总结

Vue内部将DOM节点抽象成一个个的VNode节点，keep-alive组件的缓存基于VNode节点的componentInstance，将满足条件的组件在cache对象中缓存起来，在需要重新渲染的时候再将componentInstance从cache对象中取出来覆盖新的vnode节点。


## 参考文档

https://zhuanlan.zhihu.com/p/30979183
