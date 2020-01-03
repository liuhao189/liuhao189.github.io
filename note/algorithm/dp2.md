# 动态规划二

# 前言

动态规划是一种常见的算法设计技巧，动态规划遵循一套固定的流程。

# 斐波那契数列

简单的例子才能让你把精力充分集中在算法背后的通用思想和技巧上，而不会被那些晦涩的细节问题搞得莫名其妙。

## 暴力递归算法

子问题个数为O(2^n)，时间复杂度为指数级别。算法低效的原因：存在大量重复计算，重叠子问题。

## 备忘录的递归算法

子问题个数为O(n)，时间复杂度为O(n)，空间复杂度为O(n)。算法不存在冗余计算。

这种解法和动态规划的思想已经差不多，只不过这种方法叫做自顶向下，动态规划叫做自底向上。

## 动态规划

备忘录独立出来称为一张表，就叫做DP table，在这张表上完成自底向上的推算岂不美哉。

状态转移方程，f(n)是一个状态，这个状态n是由状态n-1和状态n-2相加转移而来，这就叫状态转移。是解决问题的核心，状态转移方程直接代表着暴力解法。

斐波那契数列：当前状态之和之前的两个状态有关，不需要那么长的DP table来存储所有的状态，可以进一步将空间复杂度将为O(1)。

当问题中要求一个最优解或在代码中看到循环和max、min等函数时，十有八九，需要动态规划大显身手。

## 凑零钱问题

最优子结构性质，原问题的解由子问题的最优解构成。要符合最优子机构，子问题间必须互相独立。

当n等于0时候，f(n)为0，当n不为0时，fn=1+min(f(n-ci)|i属于币值数组)。

```js
/**
 * 
 * @param {*} cm 币值数组
 * @param {*} n 总金额
 */
function findLeastCoin(cm, n) {
    if (n === 0) return 0;
    let min = -1;
    for (let i = 0; i < cm.length; ++i) {
        let currVal = cm[i];
        if (currVal > n) {
            continue;
        }
        let currCount = 1 + findLeastCoin(cm, n - currVal);
        if (min < 0 || currCount < min && currCount >= 0) {
            min = currCount;
        }
    }
    return min;
}
```

时间复杂度O(k*n^k)，指数级别。

```js
//时间复杂度O(n*k)
const cache = { 0: 0 };
const INTMAX = Number.MAX_SAFE_INTEGER;
/**
 * 
 * @param {*} cm  币值数组
 * @param {*} n  总金额
 */
function findLeastCoin(cm, n) {
    if (cache[n]!==undefined) {
        return cache[n] || 0;
    }
    let minCount = INTMAX;
    for (let i = 0; i < cm.length; ++i) {
        let currVal = cm[i];
        if (currVal > n) {
            continue;
        }
        let leastCount = findLeastCoin(cm, n - currVal);
        if (leastCount < 0) {
            continue;
        }
        minCount = Math.min(minCount, 1 + leastCount)
    }
    let result = minCount === INTMAX ? -1 : minCount;
    cache[n] = result;
    return result;
}
```


# 参考文档

https://zhuanlan.zhihu.com/p/78220312