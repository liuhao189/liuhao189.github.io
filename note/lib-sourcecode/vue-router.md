# Vue-Router原理

## 前端路由

单页应用中，页面的跳转是无刷新的，为了实现这种效果，需要使用前端路由。

类似于服务器端路由，前端路由实现起来大概就是匹配不同的url路径，进行解析，然后动态渲染出区域的HTML内容。

### hash模式

URL的#后面的值的变化，并不会导致浏览器向服务器发出请求，也就不会刷新页面。每次hash值的变化，还会触发hashchange这个事件。

### history模式

14年后，因为HTML5标准发布，多了两个API，pushState和replaceState，通过这两个API可以改变url地址且不会发送请求。同时还有popState事件，通过这些就能用另一种方式来实现前端路由。

跟hash模式不同，history模式需要服务器配合，将前端路由覆盖的请求都返回单页的html文档。

## Vue-Router的使用

使用代码：

```js
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [...]
})

new Vue({
  router
  ...
})
```

首先，使用了Vue.use安装了VueRouter这个插件。然后new VueRouter来实例化一个VueRouter对象。最后，将实例化的对象router添加到根Vue组件的options中。

## Vue-router实现之install方法

Vue通过use方法，加载VueRouter中的install方法。下面来看一下具体的执行过程。

```js
export let _Vue
export function install (Vue) {
  //首先判断是否在当前Vue对象中安装过，if 安装过，直接返回
  if (install.installed && _Vue === Vue) return
  install.installed = true

  _Vue = Vue

  const isDef = v => v !== undefined

  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode
    // 通过registerRouteInstance方法来实现对router-view的挂载操作
    // 因为只有router-view定义了data.registerRouteInstance函数
    // registerRouteInstance主要用来执行render操作。
    // data.registerRouteInstance = (vm, val) => {
    // ...
    //    return h(component, data, children)
    //  }
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }

  Vue.mixin({
    beforeCreate () {
      // 如果定义了router属性，说明是根组件
      if (isDef(this.$options.router)) {
        this._routerRoot = this
        this._router = this.$options.router
        //执行router的init方法
        this._router.init(this)
        //为Vue根组件设置_route属性
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        //不是根组件则直接取父组件的_routerRoot
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })
  // 设置代理 当访问$router时，代理到this._routerRoot._router
  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })
  // 设置代理，当访问$route时，代理到 this._routerRoot._route
  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })
  //注册RouterView和RouterLink组件
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

  // Vue钩子合并策略 同created
  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}
```
整体上install方法：

1、判断是否安装过Vue-Router，安装过，直接返回。

2、Vue.mixin beforeCreate(主要设置_routerRoot和_route，根组件时初始化router)和destoryed生命周期。

3、定义Vue.prototype上的$router和$route属性，返回上面定义的_routerRoot和_route。

4、注册RouterView和RouteLink组件。

5、设置Router添加的生命周期的合并策略，和created一样，最终可能是个数组。

## vue-router实现之new Router(options)

VueRouter实例化代码：

```js
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/foo', name: 'foo', component: Foo },
    { path: '/bar/:id', name: 'bar', component: Bar }
  ]
})
```

VueRouter类的构造方法：

```js
export default class VueRouter {
  //...
  constructor (options: RouterOptions = {}) {
    this.app = null
    this.apps = []
    this.options = options
    this.beforeHooks = []
    this.resolveHooks = []
    this.afterHooks = []
    this.matcher = createMatcher(options.routes || [], this)

    //默认为hash mode
    let mode = options.mode || 'hash'
    // 如果指定为history，但是浏览器不支持pushState，且options.fallback为true，则fallback到hash
    this.fallback =
      mode === 'history' && !supportsPushState && options.fallback !== false
    if (this.fallback) {
      mode = 'hash'
    }
    // 不在浏览器中，mode为abstract
    if (!inBrowser) {
      mode = 'abstract'
    }
    this.mode = mode

    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base)
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          assert(false, `invalid mode: ${mode}`)
        }
    }
  }
  // ...
}
```
上一个章节提到，VueRouter的install方法会调用VueRouter.init方法

VueRouter的实例方法init：

```js
// app为根Vue组件
init (app: any /* Vue component instance */) {
    this.apps.push(app)
    // 如果this.app有值，说明init过，直接返回即可
    if (this.app) {
      return
    }

    this.app = app
    const history = this.history

    if (history instanceof HTML5History || history instanceof HashHistory) {

      const handleInitialScroll = routeOrError => {
        // 处理滚动位置的，暂时忽略
      }
      
      const setupListeners = routeOrError => {
        history.setupListeners()
        handleInitialScroll(routeOrError)
      }
      //
      history.transitionTo(
        history.getCurrentLocation(),
        setupListeners,
        setupListeners
      )
    }

    history.listen(route => {
      //route更新后，所有app._route都更新到新的route
      this.apps.forEach(app => {
        app._route = route
      })
    })
  }
```
init方法主要执行了history.transitionTo和history.listen方法来改变app._route。

## VueRouter实现之HashHistory

hash模式使用得比较多，让我们先来看下HashHistory的实现。

上文构造函数章节，我们得知mode为hash时，会执行下面的代码。

```js
// this为router实例，options.base为基础path，fallback为是否降级到hash模式
this.history = new HashHistory(this, options.base, this.fallback)
```

HashHistory构造方法：

```js
export class HashHistory extends History {
  constructor (router: Router, base: ?string, fallback: boolean) {
    // 基类构造器
    super(router, base)
    // check history fallback deeplinking 
    if (fallback && checkFallback(this.base)) {
      return
    }
    //保证hash以/开头
    ensureSlash()
  }
}

// 将history模式转换为hash模式
function checkFallback (base) {
  const location = getLocation(base)
  if (!/^\/#/.test(location)) {
    window.location.replace(cleanPath(base + '/#' + location))
    return true
  }
}

function ensureSlash (): boolean {
  const path = getHash()
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path)
  return false
}

function replaceHash (path) {
  if (supportsPushState) {
    replaceState(getUrl(path))
  } else {
    window.location.replace(getUrl(path))
  }
}

export function getHash (): string {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  let href = window.location.href
  const index = href.indexOf('#')
  // empty path
  if (index < 0) return ''
  href = href.slice(index + 1)
  return href
}
```
HashHistory构造函数初始化时：

1、针对不支持history模式的降级处理。

2、保证hash值是以/开头的。注意hash模式在支持pushState的浏览器中也是使用pushState改变的hash值。

### transitionTo方法

init方法中调用了history实例的transitionTo方法。

transitionTo方法源码：

```js
  transitionTo (
    location: RawLocation,
    onComplete?: Function,
    onAbort?: Function
  ) {
    let route
    try {
      //location为当前的hash值，this.current在构造函数中赋值为createRoute(null, { path: '/'})
      route = this.router.match(location, this.current)
      //match代码在下面
    } catch (e) {
      this.errorCbs.forEach(cb => {
        cb(e)
      })
      // Exception should still be thrown
      throw e
    }
    const prev = this.current
    this.confirmTransition(
      route,
      () => {
        this.updateRoute(route)
        onComplete && onComplete(route)
        this.ensureURL()
        //导航成功，执行afterHooks的回调
        this.router.afterHooks.forEach(hook => {
          hook && hook(route, prev)
        })

        // 第一次导航成功，调ready相关的回调
        if (!this.ready) {
          this.ready = true
          this.readyCbs.forEach(cb => {
            cb(route)
          })
        }
      },
      err => {
        if (onAbort) {
          onAbort(err)
        }
        //有错误，没有ready过，调readyError相关的回调
        if (err && !this.ready) {
          if (!isNavigationFailure(err, NavigationFailureType.redirected) || prev !== START) {
            this.ready = true
            this.readyErrorCbs.forEach(cb => {
              cb(err)
            })
          }
        }
      }
    )
  }
```

下面代码执行时，返回了route。

```js
route = this.router.match(location, this.current)
```

this.current是什么？别急，让我们看一下this.current的赋值语句。

```js
  // the starting route that represents the initial state
  export const START = createRoute(null, {
    path: '/'
  })

  constructor (router: Router, base: ?string) {
    // start with a route object that stands for "nowhere"
    this.current = START
  }
```

可以看到this.current是在History构造的时候赋值为一个代表初始route的对象。这个route对象是通过createRoute创建的。

```js
export function createRoute (
  record: ?RouteRecord,
  location: Location,
  redirectedFrom?: ?Location,
  router?: VueRouter
): Route {
  const stringifyQuery = router && router.options.stringifyQuery

  let query: any = location.query || {}
  try {
    //深度赋值，以免被修改
    query = clone(query)
  } catch (e) {}

  const route: Route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery),
    matched: record ? formatMatch(record) : []
  }
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery)
  }
  //冻结route对象
  return Object.freeze(route)
}
```

可以看到createRoute主要根据record（vue路由我们定义的对象扩展出来的对象）和location（根据location的解析结构）对象构造出来的route对象。

接着我们看下this.router.match方法，该方法应该返回现在匹配的route。

```js
  match (raw: RawLocation, current?: Route, redirectedFrom?: Location): Route {
    return this.matcher.match(raw, current, redirectedFrom)
  }
```
可以看到router.match主要是转调this.matcher的match方法。

matcher对象是通过createMatcher方法生成的，下面看下createMatcher的源码。

```js
export function createMatcher (
  routes: Array<RouteConfig>,
  router: VueRouter
): Matcher {
  // ...
  function match (
    raw: RawLocation,
    currentRoute?: Route,
    redirectedFrom?: Location
  ): Route {
    //解析当前url，得到hash，path，query和name等信息
    const location = normalizeLocation(raw, currentRoute, false, router)
    const { name } = location
    // location有name，这种情况是从currentRoute来的，不能从url里解析出name
    if (name) {
      const record = nameMap[name]
      if (!record) return _createRoute(null, location)

      // 找到必须的params names
      const paramNames = record.regex.keys
        .filter(key => !key.optional)
        .map(key => key.name)

      if (typeof location.params !== 'object') {
        location.params = {}
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (const key in currentRoute.params) {
          // 复制currentRoute中的params参数(如果不在location.params)中
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key]
          }
        }
      }

      location.path = fillParams(record.path, location.params, `named route "${name}"`)
      return _createRoute(record, location, redirectedFrom)
    } else if (location.path) {
      //
      location.params = {}
      //遍历pathList，找到合适的的record，如果matchRoute，则直接根据record和location创建路由
      for (let i = 0; i < pathList.length; i++) {
        const path = pathList[i]
        const record = pathMap[path]
        if (matchRoute(record.regex, location.path, location.params)) {
          return _createRoute(record, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }
  // ...
}
```

这里可能需要理解一下pathList，pathMap和nameMap这几个变量，它们是通过createRouteMap来创建的。

```js
export function createRouteMap (
  routes: Array<RouteConfig>,
  oldPathList?: Array<string>,
  oldPathMap?: Dictionary<RouteRecord>,
  oldNameMap?: Dictionary<RouteRecord>,
  parentRoute?: RouteRecord
): {
  pathList: Array<string>,
  pathMap: Dictionary<RouteRecord>,
  nameMap: Dictionary<RouteRecord>
} {
  // the path list is used to control path matching priority
  const pathList: Array<string> = oldPathList || []
  // $flow-disable-line
  const pathMap: Dictionary<RouteRecord> = oldPathMap || Object.create(null)
  // $flow-disable-line
  const nameMap: Dictionary<RouteRecord> = oldNameMap || Object.create(null)

  routes.forEach(route => {
    //定义的route传递给addRouteRecord
    addRouteRecord(pathList, pathMap, nameMap, route, parentRoute)
  })
  // 确保 * 号的放到最后匹配
  // ensure wildcard routes are always at the end
  for (let i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0])
      l--
      i--
    }
  }

  return {
    pathList,
    pathMap,
    nameMap
  }
}

// addRouteRecord源码 
function addRouteRecord (
  pathList: Array<string>,
  pathMap: Dictionary<RouteRecord>,
  nameMap: Dictionary<RouteRecord>,
  route: RouteConfig,
  parent?: RouteRecord,
  matchAs?: string
) {
  const { path, name } = route

  const pathToRegexpOptions: PathToRegexpOptions =
    route.pathToRegexpOptions || {}
   // 规范化path，主要构建`${parent.path}/${path}`的path
  const normalizedPath = normalizePath(path, parent, pathToRegexpOptions.strict)

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive
  }

  const record: RouteRecord = {
    path: normalizedPath,
    // 通过path-to-regexp构造一个正则
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    alias: route.alias
      ? typeof route.alias === 'string'
        ? [route.alias]
        : route.alias
      : [],
    instances: {},
    enteredCbs: {},
    name,
    parent,
    matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props:
      route.props == null
        ? {}
        : route.components
          ? route.props
          : { default: route.props }
  }

  if (route.children) {
    route.children.forEach(child => {
      const childMatchAs = matchAs
        ? cleanPath(`${matchAs}/${child.path}`)
        : undefined
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs)
    })
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path)
    pathMap[record.path] = record
  }

  if (route.alias !== undefined) {
    const aliases = Array.isArray(route.alias) ? route.alias : [route.alias]
    for (let i = 0; i < aliases.length; ++i) {
      const alias = aliases[i]

      const aliasRoute = {
        path: alias,
        children: route.children
      }
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      )
    }
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record
    }
  }
}
```

通过上面的代码，大概可以了解到pathList是整个path的完整路径的数据，pathMap是path为key，值为routeRecord的map,nameMap是key为name，值为routeRecord的map。

match的主要功能是通过目标路径匹配定义的routeRecord数据，根据routeRecord和location信息来_createRoute。

```js
  function _createRoute (
    record: ?RouteRecord,
    location: Location,
    redirectedFrom?: Location
  ): Route {
    // 如果跳转，直接跳转
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    // alias
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    //普通路由
    return createRoute(record, location, redirectedFrom, router)
  }
```

然后，我们再回到transitionTo，得到正确的route后，接下来看看confirmTransition操作。

### confirmTransition

```js
  confirmTransition (route: Route, onComplete: Function, onAbort?: Function) {
    const current = this.current
    this.pending = route
    const abort = err => {
      // .... 通用处理处理错误代码
      onAbort && onAbort(err)
    }

    const lastRouteIndex = route.matched.length - 1
    const lastCurrentIndex = current.matched.length - 1

    if (
      isSameRoute(route, current) &&
      // in the case the route map has been dynamically appended to
      lastRouteIndex === lastCurrentIndex &&
      route.matched[lastRouteIndex] === current.matched[lastCurrentIndex]
    ) {
      //相同的route，abort跳转
      this.ensureURL()
      return abort(createNavigationDuplicatedError(current, route))
    }

    const { updated, deactivated, activated } = resolveQueue(
      this.current.matched,
      route.matched
    )

    //切换route的hook队列
    const queue: Array<?NavigationGuard> = [].concat(
      // in-component leave guards
      extractLeaveGuards(deactivated),
      // global before hooks
      this.router.beforeHooks,
      // in-component update hooks
      extractUpdateHooks(updated),
      // in-config enter guards
      activated.map(m => m.beforeEnter),
      // async components
      resolveAsyncComponents(activated)
    )
    
    const iterator = (hook: NavigationGuard, next) => {
      if (this.pending !== route) {
        // 中间跳转到新的route
        return abort(createNavigationCancelledError(current, route))
      }
      try {
        hook(route, current, (to: any) => {
          if (to === false) {
            // next(false) -> abort navigation, ensure current URL
            this.ensureURL(true)
            abort(createNavigationAbortedError(current, route))
          } else if (isError(to)) {
            this.ensureURL(true)
            abort(to)
          } else if (
            typeof to === 'string' ||
            (typeof to === 'object' &&
              (typeof to.path === 'string' || typeof to.name === 'string'))
          ) {
            // next('/') or next({ path: '/' }) -> redirect
            abort(createNavigationRedirectedError(current, route))
            if (typeof to === 'object' && to.replace) {
              this.replace(to)
            } else {
              this.push(to)
            }
          } else {
            // confirm transition and pass on the value
            next(to)
          }
        })
      } catch (e) {
        abort(e)
      }
    }
    // 
    runQueue(queue, iterator, () => {
      // wait until async components are resolved before
      // extracting in-component enter guards
      const enterGuards = extractEnterGuards(activated)
      const queue = enterGuards.concat(this.router.resolveHooks)
      runQueue(queue, iterator, () => {
        if (this.pending !== route) {
          return abort(createNavigationCancelledError(current, route))
        }
        this.pending = null
        onComplete(route)
        if (this.router.app) {
          this.router.app.$nextTick(() => {
            handleRouteEntered(route)
          })
        }
      })
    })
  }
```

这里是一个很关键的方法，路由跳转需要依次执行resolveQueue，extractLeaveGuards，extractUpdateHooks，resolveAsyncComponents，runQueue等关键方法，我们先来看resolveQueue。

### resolveQueue

resolveQueue源码：

```js
function resolveQueue (
  current: Array<RouteRecord>,
  next: Array<RouteRecord>
): {
  updated: Array<RouteRecord>,
  activated: Array<RouteRecord>,
  deactivated: Array<RouteRecord>
} {
  let i
  const max = Math.max(current.length, next.length)
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }

  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}
```

resolveQueue主要是返回哪些组价需要更新，哪些组件需要创建，哪些组件需要销毁。

### extractLeaveGuards & extractUpdateHooks

```js
function extractLeaveGuards (deactivated: Array<RouteRecord>): Array<?Function> {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks (updated: Array<RouteRecord>): Array<?Function> {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

function extractGuards (
  records: Array<RouteRecord>,
  name: string,
  bind: Function,
  reverse?: boolean
): Array<?Function> {
  const guards = flatMapComponents(records, (def, instance, match, key) => {
    const guard = extractGuard(def, name)
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(guard => bind(guard, instance, match, key))
        : bind(guard, instance, match, key)
    }
  })
  return flatten(reverse ? guards.reverse() : guards)
}
// guard通过apply将this指定为vm对象
function bindGuard (guard: NavigationGuard, instance: ?_Vue): ?NavigationGuard {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}
```

主要是提取组件的beforeRouteLeave和beforeRouteUpdate相关的导航守卫。

### resolveAsyncComponents

```js
export function resolveAsyncComponents (matched: Array<RouteRecord>): Function {
  // 
  return (to, from, next) => {
    let hasAsync = false
    let pending = 0
    let error = null

    flatMapComponents(matched, (def, _, match, key) => {
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true
        pending++

        const resolve = once(resolvedDef => {
          if (isESModule(resolvedDef)) {
            resolvedDef = resolvedDef.default
          }
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef)
          match.components[key] = resolvedDef
          pending--
          if (pending <= 0) {
            next()
          }
        })

        const reject = once(reason => {
          const msg = `Failed to resolve async component ${key}: ${reason}`
          process.env.NODE_ENV !== 'production' && warn(false, msg)
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg)
            next(error)
          }
        })

        let res
        try {
          res = def(resolve, reject)
        } catch (e) {
          reject(e)
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject)
          } else {
            // new syntax in Vue 2.3
            const comp = res.component
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject)
            }
          }
        }
      }
    })

    if (!hasAsync) next()
  }
}
```
主要用来处理异步组建的问题，通过判断路由上定义的组件是否是异步组件，然后在得到真正的异步组件之前将其路由挂起。

### runQueue

runQueue主要是执行异步函数队列。

```js
export function runQueue (queue: Array<?NavigationGuard>, fn: Function, cb: Function) {
  const step = index => {
    //全部执行完，执行回调
    if (index >= queue.length) {
      cb()
    } else {
      //如果队列有值
      if (queue[index]) {
        //fn 是 iterator函数
        fn(queue[index], () => {
          step(index + 1)
        })
      } else {
        step(index + 1)
      }
    }
  }
  step(0)
}
```

在confirmTransition中通过下面的方式来调度队列的执行：

```js
 runQueue(queue, iterator, () => { })
```

fn传递为iterator函数。iterator函数的执行：

```js
    const iterator = (hook: NavigationGuard, next) => {
     // 即将跳转的不是route，导航取消错误
      if (this.pending !== route) {
        return abort(createNavigationCancelledError(current, route))
      }
      try {
        // 导航守卫
        hook(route, current, (to: any) => {
          // 导航守卫 调用next(false)，中断当前的导航
          if (to === false) {
            // next(false) -> abort navigation, ensure current URL
            // 重置到from路由对应的URL地址
            this.ensureURL(true)
            abort(createNavigationAbortedError(current, route))
           // 导航守卫 调用next(new Error(`msg`))
          } else if (isError(to)) {
            this.ensureURL(true)
            abort(to)
          } else if (
            typeof to === 'string' ||
            (typeof to === 'object' &&
              (typeof to.path === 'string' || typeof to.name === 'string'))
          ) {
            // next('/') or next({ path: '/' }) -> redirect
            // 跳转到其它路由
            abort(createNavigationRedirectedError(current, route))
            if (typeof to === 'object' && to.replace) {
              this.replace(to)
            } else {
              this.push(to)
            }
          } else {
            // confirm transition and pass on the value
            // 一般情况下没有参数 next()，当前钩子处理完成，交给下一个钩子
            next(to)
          }
        })
      } catch (e) {
        //执行错误，直接取消导航
        abort(e)
      }
    }
```

整理一下现在的流程：

1、执行transitionTo函数，先得到需要跳转路由的匹配的route。

2、执行confirmTransition函数。

3、confirmTransition函数内部判断是否需要跳转，如果不需要，则直接中断返回。

4、confirmTransition判断如果需要跳转，则先得到钩子函数的任务队列queue。

5、通过runQueue函数来批次导航守卫们。

6、一直到整个队列执行完毕后，开始处理完成后的回调函数。

### 导航完成后回调

```js
    runQueue(queue, iterator, () => {
      // beforeRouteEnter钩子函数
      const enterGuards = extractEnterGuards(activated)
      // 获取beforeResolve钩子函数，并生成一个新的queue
      const queue = enterGuards.concat(this.router.resolveHooks)
      runQueue(queue, iterator, () => {
        if (this.pending !== route) {
          return abort(createNavigationCancelledError(current, route))
        }
        // 情况pending
        this.pending = null
        // 调用onComplete函数
        onComplete(route)
        if (this.router.app) {
          this.router.app.$nextTick(() => {
            // postEnterCbs所有回调
            handleRouteEntered(route)
          })
        }
      })
    })
```

主要是执行一些路由进入的导航守卫。

### confirmTransition的onComplete参数

```js
    () => {
    this.updateRoute(route)
    onComplete && onComplete(route)
    // 确保url更新
    this.ensureURL()
    // 执行router的afterHooks
    this.router.afterHooks.forEach(hook => {
        hook && hook(route, prev)
    })

    // fire ready cbs once
    if (!this.ready) {
        this.ready = true
        // 首次完成，执行readCbs
        this.readyCbs.forEach(cb => {
          cb(route)
        })
    }
 }
// updateRoute
  updateRoute (route: Route) {
    this.current = route
    this.cb && this.cb(route)
  }
```

至此，已经完成了route的更新，在install函数中设置了对route的数据劫持，变更route会通知相应的观察者。

路由变更完成后，会执行onComplete，这个就是前面的setupHashListener。

### setupHashListener

```js
    const setupListeners = routeOrError => {
      history.setupListeners()
      handleInitialScroll(routeOrError)
    }

    history.transitionTo(
    history.getCurrentLocation(),
    setupListeners,
    setupListeners
    )

  setupListeners () {
    if (this.listeners.length > 0) {
      return
    }

    const router = this.router
    //处理滚动
    const expectScroll = router.options.scrollBehavior
    const supportsScroll = supportsPushState && expectScroll

    if (supportsScroll) {
      this.listeners.push(setupScroll())
    }

    const handleRoutingEvent = () => {
      const current = this.current
      if (!ensureSlash()) {
        return
      }
      this.transitionTo(getHash(), route => {
         //处理滚动
        if (supportsScroll) {
          handleScroll(this.router, route, current, true)
        }
        if (!supportsPushState) {
          replaceHash(route.fullPath)
        }
      })
    }

    const eventType = supportsPushState ? 'popstate' : 'hashchange'
    window.addEventListener(
      eventType,
      handleRoutingEvent
    )
    this.listeners.push(() => {
      window.removeEventListener(eventType, handleRoutingEvent)
    })
  }
```
可以看到setupListeners主要做了2件事情，一个是对路由切换滚动位置的处理。另一个是对路由变动做了一次监听window.addEventlistener(supportsPushState ? 'popstate' : 'hashchange',() => {})。

## VueRouter之HTML5History

基本上代码运行流程跟HashHistory一致，暂不细聊。

## VueRouter之API

push，replace，go，back，forward之类的API。

```js

  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    // $flow-disable-line
    if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
      return new Promise((resolve, reject) => {
        this.history.push(location, resolve, reject)
      })
    } else {
      this.history.push(location, onComplete, onAbort)
    }
  }

  replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    // $flow-disable-line
    if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
      return new Promise((resolve, reject) => {
        this.history.replace(location, resolve, reject)
      })
    } else {
      this.history.replace(location, onComplete, onAbort)
    }
  }
  
  go (n: number) {
      this.history.go(n)
  }

  back () {
    this.go(-1)
  }

  forward () {
    this.go(1)
  }
```

push和replace，首先判断了传没成功回调和失败回调，没传转化为Promise。然后调用history的push和replace方法。

go，back，forward主要是调用history.go方法，不再过度解读。

### push & replace

```js
  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    const { current: fromRoute } = this
    this.transitionTo(
      location,
      route => {
        pushHash(route.fullPath)
        handleScroll(this.router, route, fromRoute, false)
        onComplete && onComplete(route)
      },
      onAbort
    )
  }
  //
  replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    const { current: fromRoute } = this
    this.transitionTo(
      location,
      route => {
        replaceHash(route.fullPath)
        handleScroll(this.router, route, fromRoute, false)
        onComplete && onComplete(route)
      },
      onAbort
    )
  }

  function pushHash (path) {
    if (supportsPushState) {
      pushState(getUrl(path))
    } else {
      window.location.hash = path
    }
  }

  function replaceHash (path) {
    if (supportsPushState) {
      replaceState(getUrl(path))
    } else {
      window.location.replace(getUrl(path))
    }
  }
```

push和replace直接调用transitionTo，参数为用户传递的location对象。

## VueRouter之路由变更监听

### 浏览器的跳转动作

hash的情况：

```js
  const handleRoutingEvent = () => {
      const current = this.current
      if (!ensureSlash()) {
        return
      }
      this.transitionTo(getHash(), route => {
        if (supportsScroll) {
          handleScroll(this.router, route, current, true)
        }
        if (!supportsPushState) {
          replaceHash(route.fullPath)
        }
      })
    }
  //
  const eventType = supportsPushState ? 'popstate' : 'hashchange'
  window.addEventListener(
    eventType,
    handleRoutingEvent
  )
```
主要是监控popstate和hashchange事件，然后调用transitionTo进行跳转。

history模式的也类似于，只不过history模式下一定支持popstate，所以只监听popstate事件。

## VueRouter之RouterView

首先看一下源码：

```js
export default {
  name: 'RouterView',
  //无状态组件和无实例，使用一个简单的render函数返回虚拟节点使它们渲染的代价更小
  functional: true,
  //props只有一个name
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render (_, { props, children, parent, data }) {
    
    data.routerView = true
    const h = parent.$createElement
    const name = props.name
    const route = parent.$route
    const cache = parent._routerViewCache || (parent._routerViewCache = {})

    let depth = 0

    while (parent && parent._routerRoot !== parent) {
      const vnodeData = parent.$vnode ? parent.$vnode.data : {}
      if (vnodeData.routerView) {
        depth++
      }
      parent = parent.$parent
    }
    data.routerViewDepth = depth
    //routerViewDepth，当前routerView的层数

    //根据层级找到相关的组件配置
    const matched = route.matched[depth]
    const component = matched && matched.components[name]

    // render empty node if no matched route or no config component
    if (!matched || !component) {
      cache[name] = null
      return h()
    }

    // cache component
    cache[name] = { component }

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = (vm, val) => {
      // install时调用时是 this this，也就是vm，vm
      // destory时只传递了this，val为undefined
      const current = matched.instances[name]
      if (
        // 初始化时，且不等于current
        (val && current !== vm) ||
        // 注销时，等于current
        (!val && current === vm)
      ) {
        matched.instances[name] = val
      }
    }

    const configProps = matched.props && matched.props[name]
    // save route and configProps in cache
    if (configProps) {
      extend(cache[name], {
        route,
        configProps
      })
      // 路由里面的配置转换为attrs
      fillPropsinData(component, data, route, configProps)
    }

    return h(component, data, children)
  }
}
```

## VueRouter原理口述

一般大型单页应用都会采用前端路由系统，通过改变URL，在不重新请求页面的情况下，更新页面内部分区域的视图。

目前主要采用两种方式：1、hash模式，URL中#号后面的部分，改变会触发hashchange事件；2、另外一种是history模式，通过pushstate和replaceState来改变url，通过popstate事件来监听url变化。

VueRouter是Vue的路由插件，我大概讲一下它的原理。

在使用之前，需要先用Vue.use安装VueRouter插件，在安装的过程中，VueRouter会mixin，beforeCreate生命周期函数，在beforeCreate中会定义一些router相关属性到vm上，然后将_route定义为响应式的，同时判断如果父级组件是RouterView，会调用RouterView组件的方法来注册当前组件实例。后面是Vue.prototype上定义$router和$route。最后是注册全局的RouterVie和RouteLink组件。

在实例化VueRouter对象时，需要传递包含routes数组的选项，VueRouter会把这些定义的routes打平来构建pathList,pathMap和nameMap等对象以方便后期匹配查找。route的path会用path-to-regexp库转换为正则来匹配route的params。然后根据当前URL做初次导航，导航成功后。监听URL变化事件，URL变化时获取当前URL，然后去上文根据routes构造的数据结构中找到当前的route。

找到route后，会依次执行导航守卫函数，导航守卫函数全部通过后，导航到新的route，因为route已经定义为响应式的，所以会触发RouterView的重新渲染，RoterView会渲染route对应的组件。

## 参考文档

https://zhuanlan.zhihu.com/p/37730038