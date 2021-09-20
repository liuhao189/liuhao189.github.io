# 动态规划详解

动态规划问题一般形式就是求最值，动态规划其实是运筹学的一种最优方法。

既然明确要求最值，核心问题是什么呢？求解动态规划的核心问题是穷举，因为要求最值，肯定要把所有可行的答案穷举出来，然后在其中找最值。

动态规划的穷举法有点特别，因为这类问题存在重叠子问题，如果暴力穷举的话效率会极其低下，所以需要备忘录或DP Table来优化穷举过程，避免不必要的计算。

而且，动态规划问题一定会具备最优子结构，才能通过子问题的最值得到原问题的最值。

虽然，动态规划的核心问题就是穷举求最值，但是问题可以千变万化，穷举所有可行解其实并不是一件容易的事，只有列出正确的状态转移方程才能正确地穷举。

重叠子问题，最优子结构，状态转移方程就是动态规划三要素。实际的算法问题中，写出状态转移方程是最困难的。

辅助你思考状态转移方程：明确状态->定义dp数组/函数的含义->明确选择->明确base case。

## 斐波那契数列

### 单纯递归

缺点：效率特别低，因为存在重叠子问题。时间复杂度为O(2^n)，为指数级别的。

```js
function fib(n) {
    if (n === 1 || n === 2) return 1;
    return fib(n - 1) + fib(n - 2);
}
```

### 带备忘录的递归算法

时间复杂度降低为O(n)。

```js
//
let cache = {};

function fib(n) {
    if (n === 1 || n === 2) {
        return 1;
    }
    if (cache[n]) {
        return cache[n];
    }
    let res = fib(n - 1) + fib(n - 2);
    cache[n] = res;
    return res;
}
```

### 自顶向下 && 自底向上

自顶向下：从上向下延伸，都是一个规模较大的原问题，向下逐步分解规模，直到f(1)和f(2)触底，然后逐层返回答案，这就叫自顶向下。

自底向上：直接从最底下，最简单的，问题规模最小的f(1)和f(2)开始向上推，直到推导我们想要的答案，这就是动态规划的思路，动态规划一般脱离了递归，而是由循环迭代完成计算。

### 状态转移方程

你把f(n)看做一个状态，这个状态是由n-1和n-2的状态相加转移而来，这就叫状态转移。

状态转移方程非常重要，是解决问题的核心，其实状态转移方程代表着暴力破解。

```js
// 时间复杂度O(n)，空间复杂度O(1)，因为只跟之前的两个状态相关。

function fib(n) {
    if (n == 1 || n == 2) return 1;
    let prev2 = 1;
    let prev1 = 1;
    let curr = prev1 + prev2;
    for (let i = 4; i <= n; ++i) {
        prev1 = curr;
        prev2 = prev1;
        curr = prev1 + prev2;
    }
    return curr;
}
```

## 凑零钱问题

题目：给你 k 种面值的硬币，面值分别为 c1, c2 ... ck，每种硬币的数量无限，再给一个总金额 amount，问你最少需要几枚硬币凑出这个金额，如果不可能凑出，算法返回 -1 。

```js
/**
 * 
 * @param {*} coins 面值数组
 * @param {*} amount 零钱数量
 */
// 空间复杂度O(s)，时间复杂度O(S*n)
function coinChange(coins, amount) {
    if (amount < 0) return -1;
    let dp = { 0: 0 };
    let max = amount + 1;
    for (let i = 1; i <= amount; ++i) {
        dp[i] = max;
        for (let j = 0; j < coins.length; ++j) {
            if (i >= coins[j]) {
                dp[i] = Math.min(dp[i], dp[i - coins[j]] + 1)
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount]
}
```

### 暴力递归

因为它具有最优子结构，所以可以用动态规划来解决。要符合最优子结构，子问题必须互相独立。

如何列出正确的状态转移方程？

先确定状态，也就是原问题和子问题中变化的变量。由于硬币数量无限，所以唯一的状态就是目标金额amount。

然后确定dp函数的定义，当前的目标金额是n，至少需要dp(n)个硬币凑出该金额。

然后确定选择并择优，对于每个状态，可以做出什么选择改变当前状态。

最后确定base case，显然目标金额为0时，所需硬币数量为0，目标金额小于0时，无解，返回-1。

## 最后总结

第一个斐波那契数列的问题，解释了如何通过[备忘录]或者[DP table]的方法来优化递归树，并且明确了这两种方法本质都是一样的，只是自顶向下和自底向上地不同而已。

凑零钱的问题，展示了如何流程化确定状态转移方程，只要通过状态转移方程写出暴力递归解，剩下的也就是优化递归树，消除重叠子问题而已。

计算机解决问题其实没有任何好的办法，它唯一的解决办法就是穷举，穷举所有可能性，算法设计无非就是先思考如何穷举，然后追求如何聪明地穷举。

列出状态转移方程，就是在解决如何穷举的问题，之所以说它难，一是因为很多穷举需要递归实现，二是因为有的问题本身的解空间复杂，不那么容易穷举完整。

备忘录、DP table就是在追求如何聪明地穷举，用空间换时间的思路，是降低时间复杂度的不二方法。
