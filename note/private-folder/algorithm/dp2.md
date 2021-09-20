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

斐波那契数列：当前状态之和之前的两个状态有关，不需要那么长的DP table来存储所有的状态，可以进一步将空间复杂度降为O(1)。

当问题中要求一个最优解或在代码中看到循环和max、min等函数时，十有八九，需要动态规划大显身手。

## 凑零钱问题

最优子结构性质，原问题的解由子问题的最优解构成。要符合最优子结构，子问题间必须互相独立。

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

# 打家劫舍系列问题

这一系列题目的点赞非常之高，是比较有代表性和技巧性的动态规划题目。

## 初级盗贼题目

你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。

给定一个代表每个房屋存放金额的非负整数数组，计算你在不触动警报装置的情况下，能够偷窃到的最高金额。

### 分析

经典动态规划，略。

## 中级盗贼题目

强盗依然不能抢劫相邻的房子，输入依然是一个数组，但是告诉你这些房子不是一排，而是围成了一个圈。

### 分析

首尾房间不能同时被抢，有三种可能：一、都不抢；二、抢第一间，最后一间不抢；三、抢最后一间，第一间不抢。

```js
function robMost(nums, start, end) {
    let prev2 = nums[start];
    let prev1 = Math.max(prev1, nums[start + 1] || 0);
    for (let i = start + 2; i < end; ++i) {
        let dpi = Math.max(prev2 + nums[i], prev1);
        prev2 = prev1;
        prev1 = dpi;
    }
    return prev1;
}

function robCycleMost(nums) {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    return Math.max(
        robMost(nums, 1, nums.length),
        robMost(nums, 0, nums.length - 1)
    )
}
```

## 高级

强盗发现现在面对的房子不是一排，不是一圈，而是一棵二叉树，相连的两个房子不能同时被抢劫。

[3,2,3,null,3,null,1]，[3,4,5,1,3,null,1]。

# 最后总结

计算机解决问题其实没有任何奇淫技巧，它唯一的解决办法就是穷举，穷举所有可能性。算法设计无非就是先思考如何穷举，然后再追求如何聪明地穷举。

列出动态转移方程，就是在解决如何穷举的问题。之所以说它难，一是因为很多穷举需要递归实现；二是因为有的问题本身的解空间复杂，不那么容易穷举完整。

备忘录，DP table就是在追求如何聪明地穷举，用空间换时间的思路，是降低时间复杂度的常规做法。


# 参考文档

https://zhuanlan.zhihu.com/p/78220312