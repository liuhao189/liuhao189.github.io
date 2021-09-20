# 动态规划一

# 定义

动态规划的英文名为Dynamic Programming，是一种分阶段求解策略问题的数学思想。它不止用于编程领域，也应用于管理学、经济学、生物学。

# 问题

## 台阶走法

有一座高度是10级台阶的楼梯，从下往上走，每跨一步只能向上1级或者2级台阶。要求用程序来求出一共有多少种走法？

### 推理

最后一步必然是从8级或9级开始，所以总的走法是8级+9级的走法。即F(10)=F(9)+F(8)，以此类推。

    把一个复杂的问题分阶段进行简化，逐步简化成简单的问题，这就是动态规划的思想。

动态规划包含三个重要的概念：最优子结构、边界、状态转移公式。F(9)和F(8)是F(10)的最优子结构。
当只有一级台阶或二级台阶时，我们可以直接得出结果，无需继续简化。F(1)和F(2)是问题的边界。
F(n)=F(n-1)+F(n-2)是阶段与状态之间的状态转移方程。动态规划的核心，决定了问题的每一个阶段和下一阶段的关系。

    先找出最优子结构，然后定义状态转移方程，最后寻找问题边界。

### 普通递归

```js
// 二叉树，时间复杂度接近2的N次方
function findWalkWays(n) {
    if (n === 1) return 1;
    if (n === 2) return 2;
    return findWalkWays(n - 1) + findWalkWays(n - 2);
}
```

### 备忘录法

```js
//时间复杂度和空间复杂度都是o(N)
let cache = {};
function findWalkWays(stairsCount) {
    if (n === 1) return 1;
    if (n === 2) return 2;
    if (cache[n]) {
        return cache[n];
    }
    let res = findWalkWays(n - 1) + findWalkWays(n - 2);
    cache[n] = res;
    return res;
}
```

### 自底向上求解

利用简洁的自底向上的递推方式，实现了时间和空间上的最优化。

```js
// 时间复杂度o(N)，空间复杂度o(1)
function findWalkWays(n) {
    if (n === 1) return 1;
    if (n === 2) return 2;
    let prev2 = 1;
    let prev1 = 2;
    let temp;
    for (let i = 3; i <= n; ++i) {
        temp = prev1 + prev2;
        prev2 = prev1;
        prev1 = temp;
    }
    return temp;
}
```

### 台阶问题总结

主要找最优子结构、状态转移公式和边界。台阶动态规划领域最简单的问题，因为它只有一个变化维度，还有许多问题比这要复杂得多。

## 国王和金矿

有一个国家发现了5座金矿，每座金矿的黄金储量不同，需要参与挖掘的工人数也不同。参与挖矿工人的总数是10人。每座金矿要么全挖，要么不挖，不能派出一半人挖取一半金矿。要求用程序求解出，要想得到尽可能多的黄金，应该选择挖取哪几座金矿？


| 金矿 | 黄金储量 | 人工数 |
|------|----------|--------|
| A    | 500      | 5      |
| B    | 200      | 3      |
| C    | 300      | 4      |
| D    | 350      | 3      |
| E    | 300      | 3      |

### 推理

5个金矿的最优选择，就是前4个金矿10工人的挖金数量和前4个金矿7工人的挖金数量+第5个金矿的挖金数量的最大值。

金矿数量设为Golds，工人数量Workers，金矿的黄金量设为数组GoldReserves，金矿的用工数设为数组GoldWorkers。

F(Golds,Workers)=MAX(F(Golds-1,Workers),F(Golds-1,Workers-GoldWorkers[Golds])+GoldReserves[Golds]);

eg: F(5,10)=MAX(F(4,10),F(4,7)+300)

问题的边界：有1个金矿，如果工人数大于金矿需要工人数，则得到的黄金是GoldReserves[0]，如果工人数小于金矿需要工人数，则得到的黄金是0。

### 解法

```js
//时间复杂度O(N*W),空间复杂度O(W)
/**
 * 
 * @param {*} n 金矿数量
 * @param {*} w 工人数量
 * @param {*} g []数组，黄金存储量
 * @param {*} p []数组，金矿需要的工人数
 */
function findMostGold(n, w, g, p) {
    let preRow = [];
    let currRow = [];
    for (let i = 0; i <= w; ++i) {
        if (i < p[0]) {
            preRow[i] = 0;
        } else {
            preRow[i] = g[0];
        }
    }
    currRow = preRow;
    for (let i = 1; i < n; ++i) {
        for (let j = 0; j <= w; ++j) {
            if (j < p[i]) {
                currRow[j] = preRow[j];
            } else {
                currRow[j] = Math.max(preRow[j], preRow[j - p[i]] + g[i]);
            }
        }
        preRow = currRow;
    }
    return currRow[w];
}
```

## 最大子序和

给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

### 推理

最大子序和，我们想让一个子序中正数越多越好，负数越少越好。

定义一个数组dp，dp[i]是以第i个元素为结尾的一段最大子序和。求dp[i]时，if dp[i-1]小于0，则dp[i]加上前面的任意长度的序列都会小于前面的序列。

```js
function maxSubArray(nums) {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    let resArr = [];
    resArr[0] = nums[0];
    let max = dp[0];
    for (let i = 1; i < nums.length; ++i) {
        if (resArr[i - 1] > 0) {
            resArr[i] = resArr[i - 1] + nums[i];
        } else {
            resArr[i] = nums[i];
        }
        max = Math.max(resArr[i], max);
    }
    return max;
}
```

## 大家劫舍

你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。

给定一个代表每个房屋存放金额的非负整数数组，计算你在不触动警报装置的情况下，能够偷窃到的最高金额。

### 推理

nums代表屋内财产价值的数组。sNums是最高偷窃额的数组。sNums[i]代表i个房屋的最高偷窃额。

sNums[i]和sNums[i-1]的关系。如果偷i，肯定不偷i-1。所以关系是sNums[i]=Max(sNums[i-2]+nums[i],sNums[i-1])。

```js
function getMaxMoney(moneys) {
    if (moneys.length === 0) return 0;
    if (moneys.length === 1) return moneys[0];
    let maxMoneys = [];
    maxMoneys.push(moneys[0]);
    if (moneys.length >= 2) {
        maxMoneys.push(Math.max(moneys[1], moneys[0]));
    }
    for (let i = 2; i < moneys.length; ++i) {
        maxMoneys.push(Math.max(maxMoneys[i - 2] + moneys[i], maxMoneys[i - 1]));
    }
    return maxMoneys[moneys.length - 1];
}
```

## 总结

在利用动态规划求解问题的过程中，比较难的是找到状态转移方程，状态转移方程式第N项与前若干项之间的关系。求动态规划时的第i项时可以假设前面的若干项都是已知的。找到这种关系后，需要转化思路，自底向上编写程序，这样才能降低时间复杂度，才是真正的动态规划。

