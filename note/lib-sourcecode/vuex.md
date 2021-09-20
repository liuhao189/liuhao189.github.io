# Vuex原理

Vuex是一个专为Vue.js应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态。

## 最简单的使用

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

new Vue({
  el: '#app',
  store: store,
})
```

## Vuex之install方法

Vuex使用之前需要使用Vue.use来安装。我们首先看一看install方法。

```js
let Vue // bind on install

export function install (_Vue) {
  if (Vue && _Vue === Vue) {
    return
  }
  Vue = _Vue
  //主要是执行applyMixin
  applyMixin(Vue)
}
// applyMixin代码
export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])

  if (version >= 2) {
    //Vue大版本大于2，支持mixin
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // Vue 1.x的兼容代码，略过
    // ...
  }

  function vuexInit () {
    const options = this.$options
    // 只有根组件有store选项
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      //非根组件，直接返回parent的$store
      this.$store = options.parent.$store
    }
  }
}
```
install方法主要是将$store添加到Vue组件实例上。

## Vuex之实例化Store

Vue.use(Vuex)后，我们需要new Vuex.Store({...})。让我们看下Store的构造函数。

```js
export class Store {
  constructor (options = {}) {
    // ...

    const {
      plugins = [],
      strict = false
    } = options

    // 定义一些内部属性
    this._committing = false
    this._actions = Object.create(null)
    this._actionSubscribers = []
    this._mutations = Object.create(null)
    this._wrappedGetters = Object.create(null)
    this._modules = new ModuleCollection(options)
    this._modulesNamespaceMap = Object.create(null)
    this._subscribers = []
    this._watcherVM = new Vue()
    this._makeLocalGettersCache = Object.create(null)

    const store = this
    const { dispatch, commit } = this
    //绑定dispatch和commit的this为当前Store实例
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
      return commit.call(store, type, payload, options)
    }

    this.strict = strict
    const state = this._modules.root.state

    installModule(this, state, [], this._modules.root)
    resetStoreVM(this, state)

    plugins.forEach(plugin => plugin(this));
  }
}
```

首先定义一些内部变量，然后重新定义this.dispatch和this.commit，主要是把这两个方法bind到当前Store的实例上。

然后就是执行installModule和resetStoreVM方法，最后执行传入的plugins。

## installModule

```js
function installModule (store, rootState, path, module, hot) {
  const isRoot = !path.length
  const namespace = store._modules.getNamespace(path)

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module
  }

  // set state
  if (!isRoot && !hot) {
    //不是根目录
    const parentState = getNestedState(rootState, path.slice(0, -1))
    const moduleName = path[path.length - 1]
    store._withCommit(() => {
      // 使用Vue.set来设置为parentState[moduleName]
      Vue.set(parentState, moduleName, module.state)
    })
  }

  // 调用mutation和action时本模块的相关信息
  const local = module.context = makeLocalContext(store, namespace, path)

  //注册添加了namespace信息的Mutation方法
  module.forEachMutation((mutation, key) => {
    const namespacedType = namespace + key
    registerMutation(store, namespacedType, mutation, local)
  })
  //注册添加了namespace信息的Action方法
  module.forEachAction((action, key) => {
    const type = action.root ? key : namespace + key
    const handler = action.handler || action
    registerAction(store, type, handler, local)
  })
  //注册添加了namespace信息的getters方法
  module.forEachGetter((getter, key) => {
    const namespacedType = namespace + key
    registerGetter(store, namespacedType, getter, local)
  })
  //遍历子模块
  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child, hot)
  })
}
```

installModule方法主要在store上注册root模块的mutation，action，getters等方法，同时指定这些方法执行的this和相关参数。

最后是遍历root模块的子模块，递归调用installModule。

## resetStoreVM

```js
function resetStoreVM (store, state, hot) {
  
  store.getters = {}
  
  store._makeLocalGettersCache = Object.create(null)
  const wrappedGetters = store._wrappedGetters
  const computed = {}

  forEachValue(wrappedGetters, (fn, key) => {
    computed[key] = partial(fn, store)
    //懒惰求值
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true // for local getters
    })
  })
  //以上是把getters方法定义为store.getters[key]

  // 创建一个Vue对象来存储state和computed
  // 安静的创建，不报相关的警告信息
  const silent = Vue.config.silent
  Vue.config.silent = true
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
  Vue.config.silent = silent

  if (store.strict) {
    //在严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误。
    enableStrictMode(store)
  }
}
```
resetStoreVM主要把getters转为computed属性，同时初始化store._vm属性，就是一个data包含state且computed为getters的Vue组件实例。该Vue组件初始化时，会把state整个转为响应式对象。

## mapState等map类方法

```js
// normalizeNamespace 判断namespace为空的情况，做了相应的兼容
export const mapState = normalizeNamespace((namespace, states) => {
  const res = {}
  // 数组和对象格式转为数组形式
  normalizeMap(states).forEach(({ key, val }) => {
    res[key] = function mappedState () {
      let state = this.$store.state
      let getters = this.$store.getters
      if (namespace) {
        const module = getModuleByNamespace(this.$store, 'mapState', namespace)
        if (!module) {
          return
        }
        state = module.context.state
        getters = module.context.getters
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    }
  })
  return res
})
```
首先调了normalizeNamespace兼容了namespace为空的情况。然后就是遍历states，然后一个对象。

## 口述原理

1、Vuex上主要有两个属性，一个是install方法，一个是Store对象。

2、install方法的作用是将store实例挂载到所有组件上，也就是vm.$store可以访问到。

3、Store这个类拥有commit，dispatch这些方法，Store类里将用户传入的state包装成data，用户传入的getters包装为computed，作为new Vue的参数，从而实现了state值的响应式。



