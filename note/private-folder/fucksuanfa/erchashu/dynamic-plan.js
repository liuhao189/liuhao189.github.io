
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

function fib(n) {
    if (n == 1 || n == 2) return 1;
    let prev2 = 1;
    let prev1 = 1;
    let curr = prev1 + prev2;
    for (let i = 3; i <= n; ++i) {
        prev1 = curr;
        prev2 = prev1;
        curr = prev1 + prev2;
    }
    return curr;
}
/**
 * 
 * @param {*} coins 面值数组
 * @param {*} amount 零钱数量
 */
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