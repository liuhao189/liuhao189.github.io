# Vue-Router原理

## 前端路由

单页应用中，页面的跳转是无刷新的，为了实现这种效果，需要使用前端路由。

类似于服务器端路由，前端路由实现起来大概就是匹配不同的url路径，进行解析，然后动态渲染出区域的HTML内容。

### hash模式

URL的#后面的值的变化，并不会导致浏览器向服务器发出请求，也就不会刷新页面。每次hash值的变化，还会触发hashchange这个事件。


### history模式

14年后，因为HTML5标准发布，多了两个API，pushState和replaceState，通过这两个API可以改变url地址且不会发送请求。
同时还有popState事件，通过这些就能用另一种方式来实现前端路由。

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

首先，使用了Vue.use安装了Vue-router这个插件。
然后new VueRouter来实例化一个VueRouter对象。
最后，将实例化的对象router添加到根Vue组件的options中。

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

2、Vue.mixin beforeCreate和destoryed生命周期。

3、定义vm.$router和vm.$route变量。

4、注册RouterView和RouteLink组件。

5、设置Router添加的生命周期的合并策略。

## vue-router实现之new Router(options)

代码使用方式：

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
  // ...
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
    // 如果指定为history，但是浏览器不支持pushState，且没有指定不可以fallback，则fallback到hash
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

  match (raw: RawLocation, current?: Route, redirectedFrom?: Location): Route {
    return this.matcher.match(raw, current, redirectedFrom)
  }

  get currentRoute (): ?Route {
    return this.history && this.history.current
  }
  // ...
}
```
上一个章节提到，VueRouter的install方法会调用VueRouter.init方法

VueRouter的实例方法init：

```js
init (app: any /* Vue component instance */) {
    //未安装，则给出错误提示
    process.env.NODE_ENV !== 'production' &&
      assert(
        install.installed,
        `not installed. Make sure to call \`Vue.use(VueRouter)\` ` +
          `before creating root instance.`
      )

    this.apps.push(app)

    // set up app destroyed handler
    // https://github.com/vuejs/vue-router/issues/2639
    app.$once('hook:destroyed', () => {
      // clean out app from this.apps array once destroyed
      const index = this.apps.indexOf(app)
      if (index > -1) this.apps.splice(index, 1)
      // ensure we still have a main app or null if no apps
      // we do not release the router so it can be reused
      if (this.app === app) this.app = this.apps[0] || null

      if (!this.app) this.history.teardown()
    })

    // main app previously initialized
    // return as we don't need to set up new history listener
    if (this.app) {
      return
    }

    this.app = app

    const history = this.history

    if (history instanceof HTML5History || history instanceof HashHistory) {
      const handleInitialScroll = routeOrError => {
        const from = history.current
        const expectScroll = this.options.scrollBehavior
        const supportsScroll = supportsPushState && expectScroll

        if (supportsScroll && 'fullPath' in routeOrError) {
          handleScroll(this, routeOrError, from, false)
        }
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

1、针对不支持history模式的降级处理

2、保证hash值是以/开头的。

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
    // catch redirect option https://github.com/vuejs/vue-router/issues/3201
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
        this.router.afterHooks.forEach(hook => {
          hook && hook(route, prev)
        })

        // fire ready cbs once
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
        if (err && !this.ready) {
          // Initial redirection should not mark the history as ready yet
          // because it's triggered by the redirection instead
          // https://github.com/vuejs/vue-router/issues/3225
          // https://github.com/vuejs/vue-router/issues/3331
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

// createRoute 方法源代码
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

//match源代码
  match (raw: RawLocation, current?: Route, redirectedFrom?: Location): Route {
    return this.matcher.match(raw, current, redirectedFrom)
  }
// matcher对象是通过createMatcher方法生成的
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
    // 如果是命名路由
    if (name) {
      const record = nameMap[name]
      if (process.env.NODE_ENV !== 'production') {
        warn(record, `Route with name '${name}' does not exist`)
      }
      if (!record) return _createRoute(null, location)
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
      //遍历pathList，找到合适的record，因此命名路由的record查找效率更高
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

  // ensure wildcard routes are always at the end
  for (let i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0])
      l--
      i--
    }
  }

  if (process.env.NODE_ENV === 'development') {
    // warn if routes do not include leading slashes
    const found = pathList
    // check for missing leading slash
      .filter(path => path && path.charAt(0) !== '*' && path.charAt(0) !== '/')

    if (found.length > 0) {
      const pathNames = found.map(path => `- ${path}`).join('\n')
      warn(false, `Non-nested routes must include a leading slash character. Fix the following routes: \n${pathNames}`)
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
    //  normalizePath 源码
    //   function normalizePath (
    //   path: string,
    //   parent?: RouteRecord,
    //   strict?: boolean
    // ): string {
    //   if (!strict) path = path.replace(/\/$/, '')
    //   if (path[0] === '/') return path
    //   if (parent == null) return path
    //   return cleanPath(`${parent.path}/${path}`)
    // }
   // 规范化path，非严格匹配模式，去掉最后的/，如果以 / 开头，直接返回 path，
   // 如果 parent为null或undefined，直接返回path，否则返回 `${parent.path}/${path}`
  const normalizedPath = normalizePath(path, parent, pathToRegexpOptions.strict)

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive
  }

  const record: RouteRecord = {
    path: normalizedPath,
    //
    // function compileRouteRegex (
    //   path: string,
    //   pathToRegexpOptions: PathToRegexpOptions
    // ): RouteRegExp {
    //   const regex = Regexp(path, [], pathToRegexpOptions)
    //   if (process.env.NODE_ENV !== 'production') {
    //     const keys: any = Object.create(null)
    //     regex.keys.forEach(key => {
    //       warn(
    //         !keys[key.name],
    //         `Duplicate param keys in route with path: "${path}"`
    //       )
    //       keys[key.name] = true
    //     })
    //   }
    //   return regex
    // }
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
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (process.env.NODE_ENV !== 'production') {
      if (
        route.name &&
        !route.redirect &&
        route.children.some(child => /^\/?$/.test(child.path))
      ) {
        warn(
          false,
          `Named Route '${route.name}' has a default child route. ` +
            `When navigating to this named route (:to="{name: '${
              route.name
            }'"), ` +
            `the default child route will not be rendered. Remove the name from ` +
            `this route and use the name of the default child route for named ` +
            `links instead.`
        )
      }
    }
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
      if (process.env.NODE_ENV !== 'production' && alias === path) {
        warn(
          false,
          `Found an alias with the same value as the path: "${path}". You have to remove that alias. It will be ignored in development.`
        )
        // skip in dev to make it work
        continue
      }

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
    } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
      warn(
        false,
        `Duplicate named routes definition: ` +
          `{ name: "${name}", path: "${record.path}" }`
      )
    }
  }
}
```

通过上面的代码，大概可以了解到pathList是整个path的完整路径的数据，pathMap是path为key，值为routeRecond的map,nameMap是key为name，值为routeRecord的数组。

match的主要功能是通过目标路径匹配定义的routeRecord数据，根据routeRecord来_createRoute。

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
      // changed after adding errors with
      // https://github.com/vuejs/vue-router/pull/3047 before that change,
      // redirect and aborted navigation would produce an err == null
      if (!isNavigationFailure(err) && isError(err)) {
        if (this.errorCbs.length) {
          this.errorCbs.forEach(cb => {
            cb(err)
          })
        } else {
          warn(false, 'uncaught error during route navigation:')
          console.error(err)
        }
      }
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
  //返回哪些需要更新，哪些需要激活，哪些需要卸载
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}
```

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
  // 
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

### resolveAsyncComponents

```js
export function resolveAsyncComponents (matched: Array<RouteRecord>): Function {
  // 
  return (to, from, next) => {
    let hasAsync = false
    let pending = 0
    let error = null

    flatMapComponents(matched, (def, _, match, key) => {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
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
主要用来处理异步组建的问题，通过判断路由上定义的组件是函数且没有cid来确定是否是异步组件，然后在得到真正的异步组件之前将其路由挂起。

### runQueue

runQueue主要是执行一些异步函数队列。

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

1、执行transitionTo函数，先得到需要跳转路由的match对象的route。

2、执行confirmTransition函数

3、confirmTransition函数内部判断是否需要跳转，如果不需要，则直接中断返回

4、confirmTransition判断如果需要跳转，则先得到钩子函数的任务队列queue。

5、通过runQueue函数来批次执行任务队列中的每个方法。

6、一直到整个队列执行完毕后，开始处理完成后的回调函数。

### 导航完成后回调

```js
    runQueue(queue, iterator, () => {
      // wait until async components are resolved before
      // extracting in-component enter guards
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

### onComplete参数

confirmTransition的onComplete参数的代码：

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
    //
   // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
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

## VueRouter之

## 参考文档

https://zhuanlan.zhihu.com/p/37730038