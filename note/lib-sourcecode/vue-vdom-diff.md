# Vue之VDOM

## 为什么引入vdom

根据Vue作者相关的说法，Vue2引入vdom的原因是添加了一层渲染过程中的抽象层，从而使得组件的抽象能力得到提升，并且可以适配DOM以外的渲染目标。另外一点，就是性能问题。

## vdom的基本实现思路

1、用JS表示DOM结构。

2、根据虚拟DOM树构建出真实的DOM树。

3、通过JS对象表示的虚拟的DOM计算出DOM需要做的最小变动。

## Vue vdom的实现

vue2的vdom是基于snabbdom。

### pactch方法

```js
return function patch (oldVnode, vnode, hydrating, removeOnly) {
    //新的节点是空，旧的节点不为空，则销毁旧节点
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue);
    } else {
      // 初始化渲染时oldVnode是根节点，真实的dom 所以是true
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
          // 省略
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        );

        // 省略
      }
    }
```
初始化时，oldVnode是根节点，是真实的dom，更新的时候，vnode并没有nodeType这个字段，所以isRealElement为false，如果判断是相同的结点，才进行patchVnode。

```js
// 主要是判断key 和 tag 是否相同
function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
```

如果是不同的元素，则认为是一个新的vnode，进入createElm方法，遵循了两个不同类型的元素将产生不同树的原则，只要发现两个元素的类型不同，直接删除旧的并创建一个新的，而不是去递归比较。

### patchVnode

```js
function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }

    var elm = vnode.elm = oldVnode.elm;
    // 省略
    var oldCh = oldVnode.children;
    var ch = vnode.children;
    // isPatchable主要判断vnode的tag是否是undefined，文本节点的tag就是undefined。
    if (isDef(data) && isPatchable(vnode)) {
    // 这里的 cbs.update 是更新属性的，从方法名也可以看出来。
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }

    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        // 新旧节点都存在，则调用updateChildren
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        // 新的text属性为空，就的存在text属性，设置为''
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        // 否则就的为空，新的不为空，直接添加
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        // 新的为空，旧的不为空，则删除就的
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        // 两个都为空，且旧的有text，则设置''
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      // text节点直接设置文本内容即可。
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }
```

### updateChildren

最核心的算法是updateChildren，这也是diff算法的核心部分。

```js
function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    {
      checkDuplicateKeys(newCh);
    }
    // 同级对比，先定义4个数组指针，分别指向旧vnode数组的开始，结束 和 新vnode数组的开始和结束
    // 如果旧vnode数组的开始指针指向的vnode和新vnode数组的开始指针指向的vnode相同，则两个开始指针指向++操作
    // 然后是结束指针执行类似的操作。
    // 然后是旧的开始和新的结束对比。
    // 然后是旧的结束和新的开始对比。
    // 最后是基于key的对比

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }
```

## vdom diff算法总结

vdom的diff算法本质上是两个树形结构的diff对比，传统上的树的对比的时间复杂度很高，为O(n^3)。考虑到在实际页面中，跨层级去做更新的场景比较少，所以Vue的diff算法只是同级比较，时间复杂度缩小为O(n)。

具体的算法，Vue2中参考了一个开源框架的diff算法。我大概说一下这个算法。首先判断两个节点是不是相同的vnode，主要是比较key和tag。如果不是，则删除旧的，创建新的，不再比较。如果是相同的vnode，则比较它们的children数组。

比较children时，首先定义4个指针分别指向新旧children数组的开始和结束。然后开始和开始比较，结束和结束比较，新的开始和旧的结束比较，旧的开始和新的结束比较，最后是key相关的元素移动和比较。

## 参考文档

https://zhuanlan.zhihu.com/p/23752826

https://zhuanlan.zhihu.com/p/46620505
