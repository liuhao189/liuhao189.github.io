# 高楼扔鸡蛋问题

# 题目

若干层楼，若干个鸡蛋，算出最少的尝试次数，找到鸡蛋恰好摔不破的那层楼。

## 问题描述

面前有一栋从 1 到 N 共 N 层的楼，然后给你 K 个鸡蛋（K 至少为 1）。现在确定这栋楼存在楼层 0 <= F <= N，在这层楼将鸡蛋扔下去，鸡蛋恰好没摔碎（高于 F 的楼层都会碎，低于 F 的楼层都不会碎）。现在问你，最坏情况下，你至少要扔几次鸡蛋，才能确定这个楼层 F 呢？

## 分析

最坏的情况是结果发生在搜索区间穷尽时，如果不限制鸡蛋个数的话，二分思路显然可以得到最少尝试的次数。

对于动态规划问题：这个问题有什么状态，有什么选择，然后穷举？

状态很明显，就是当前拥有的鸡蛋数K和需要测试的楼层数N。随着测试的进行，鸡蛋个数可能减少，楼层的搜索范围会减小，这就是状态的变化。

选择其实就是去选择哪层楼扔鸡蛋。二分查找每次选择到楼层区间的中间去扔鸡蛋，线性扫描选择一层层向上测试。

```js
function dp(K,N){
    let res;
    for(let i=1;i<=N;++i){
        res=Math.min(res,iDropEgg);
    }
    return res;
}
```
第i层扔鸡蛋，可能出现两种情况，鸡蛋碎了，鸡蛋没碎。这时候状态转移就来了。

如果鸡蛋碎了，鸡蛋的个数K减1，搜索的区间从[1,N]变为[1,i-1]。

如果鸡蛋没碎，鸡蛋的个数K不变，搜索的区间从[1,N]变为[i+1,N]。

最坏情况下的扔鸡蛋次数，鸡蛋在第i层楼碎没碎，取决于哪种情况的结果更大。

```js
// K鸡蛋个数，N楼层数
let cache = {};
function eggDrop(K, N) {
    if (K === 1) return N;
    if (N === 0) return 0;
    let key = `Egg${K}Floor${N}`;
    if (cache[key] !== undefined) {
        return key;
    }
    let res = 0;
    for (let i = 1; i <= N; ++i) {
        res = min(res, max(
            eggDrop(K - 1, i - 1),
            eggDrop(K, N - i)+1)
        )
    }
    cache[key] = res;
    return res;
}
```
动态规划算法的时间复杂度就是子问题个数x函数本身的复杂度。时间复杂度是O(K*N^2)，空间复杂度O(KN)。

## 疑难解答

有读者不理解代码为什么用一个for循环遍历楼层[1...N]，这不是线性扫描，只是在做一次选择。

这个问题还有更好的解法，修改代码中的for循环为二分搜索，可以将时间复杂度将为O(K*N*logN)。

能用二分搜索是因为状态转移方程函数图像具有单调性，可以快速找到最值。

dp(K,N)数组的定义，K固定时，这个函数一定是单调递增的。

dp(K-1,i-1)和dp(K,N-i)这两个函数，其中i是从1到N单增的，如果固定K和N，这个两个函数看作关于i的函数，前者随着i的增加应该是单调递增的，后者随着i的增加应该是单调递减的。

```js
/**
 * 
 * @param {*} k  k个鸡蛋
 * @param {*} n  n层楼
 */
function dropEggs(k, n) {
    if (k === 1) return n;
    if (n === 0) return 0;
    let key = `Egg${k}Floor${n}`;
    if (mem[key] !== undefined) {
        return mem[key];
    }
    let res = 0;
    let left = 1, right = N;
    while (left <= right) {
        let mid = Number.parseInt(left + right / 2);
        let broken = dropEggs(k - 1, mid - 1);
        let notBroken = dropEggs(k, N - mid);
        if (broken > notBroken) {
            right = mid - 1;
            res = min(res, broken + 1);
        } else {
            left = mid + 1;
            res = min(res, notBroken + 1);
        }
    }
    mem[key] = res;
    return res;
}
```


