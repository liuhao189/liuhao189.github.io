# 经典动态规划问题：高楼扔鸡蛋

## 题目

面前有一栋从 1 到 N 共 N 层的楼，然后给你 K 个鸡蛋（K 至少为 1）。现在确定这栋楼存在楼层 0 <= F <= N，在这层楼将鸡蛋扔下去，鸡蛋恰好没摔碎（高于 F 的楼层都会碎，低于 F 的楼层都不会碎）。现在问你，最坏情况下，你至少要扔几次鸡蛋，才能确定这个楼层 F 呢？

## 分析

什么叫最坏情况下至少要扔几次？ 

1、线性扫描，最坏情况下需要扔n次。扔到n次鸡蛋也没碎。 鸡蛋破碎在搜索区间穷尽时，叫最坏的情况。

什么叫至少要扔几次？

2、最好的策略是使用二分查找思路，最坏的情况下，只需要试log7向上取整即可。

使用二分查找排除楼层，等到只剩下一个鸡蛋的时候再执行线性扫描，是不是最少的扔鸡蛋次数呢？

并不是的。给你两个鸡蛋，不要二分，五分，十分都会大幅度减少最坏情况下的尝试次数。最优解其实是14次。

## 动态规划解法

框架思维：这个问题有什么状态，有什么选择，然后穷举。

状态很明显，就是当前拥有的鸡蛋数K和需要测试的楼层数N。选择其实就是选择哪层楼扔鸡蛋。

肯定是个二维的dp数组或者带有两个状态参数的dp函数来表示状态转移，外加一个for循环来遍历所有选择，择最优的选择更新状态。

```js
//K个鸡蛋，N层楼
function dp(K,N) {
    if(K===1) return N;
    if(N===0) return 0;
    let res=0;
    for(let i=1; i<=N; ++i){
        res=Math.min(res,dp[...]);
    }
    return res;
}
```

选择在第i层扔鸡蛋，可能出现两种情况，鸡蛋碎了，鸡蛋没碎。这时候状态转移就来了。

如果鸡蛋碎了，那么鸡蛋的个数K应该减1，搜索的区间从[1,N]变为[1,i-1]层楼。

如果鸡蛋没碎，那么鸡蛋的个数K不变，搜索的楼层区间应该从[1,N]变为[i+1,N]层楼。

```js
function dp(K,N) {
    for(let i=0;i<=N;++i){
        //最坏的情况下，最少的扔鸡蛋次数
        res=Math.min(res,
            Math.max(
                dp(K-1, i-1),
                dp(K, N-i)
                ) + 1
            );
    }
}
```

base case很容易理解，当楼层N等于0时，不需要扔鸡蛋，当鸡蛋数K为1时，显然智能线性扫描所有楼层。

算法的时间复杂度是多少呢？动态规划算法的时间复杂度就是子问题个数x函数本身的复杂度。

函数本身的复杂度忽略递归部分的复杂度，这里dp函数中有一个for循环，所以函数本身的复杂度是O(N)。

子问题的个数就是不同状态组合的总数，两个状态的乘积，也就是O(KN)。

所以算法的总时间复杂度是O(K*N*N)，空间复杂度是O(KN)。

## 疑难解答

问题很复杂，算法代码却十分简洁，这就是动态规划的特性，穷举+备忘录/DP table优化，真的没啥新意。

for循环遍历楼层，只是在做一次选择。eg：2个鸡蛋，10层楼，你这次选择去哪一层楼呢？不知道，那就把这10层楼全试一遍。至于下次怎么选择，不用你操心，有正确的状态转移，递归会算出每个选择的代价，会取最优解。

## 二分法

二分法跟之前讨论的二分思路扔鸡蛋没有半毛钱关系，能用二分搜索是因为状态转移方差的函数图像具有单调性，可以快速找到最值。

K固定时，无论你策略多么聪明，楼层增加测试次数一定要增加。

dp[k-1,i-1]和dp[k,N-i]，这两个函数，其中i是从1到N单增的，如果我们固定K和N，两个函数看成i的函数，前者随着i的增加是单调递增的，后者随着i的增加是单调递减的。

求两者较大值，再求这些最大值之中的最小值，其实就是交点。

```js
let cache = {};
function superEggDrop(K, N) {
    function dropEggCount(K, N) {
        if (K === 0 || N === 0) return 0;
        if (K === 1) return N;
        let cacheKey = `K${K}N${N}`;
        if (cache[cacheKey] !== undefined) {
            return cache[cacheKey];
        }
        let low = 1;
        let high = N;
        let res = Number.MAX_SAFE_INTEGER;
        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            let broken = superEggDrop(K - 1, mid - 1);
            let not_broken = superEggDrop(K, N - mid);
            if (broken > not_broken) {
                high = mid - 1;
                res = Math.min(res, broken + 1);
            } else {
                low = mid + 1;
                res = Math.min(res, not_broken + 1);
            }
        }
        cache[cacheKey] = res;
        return res;
    }

    return dropEggCount(K, N);
}
```