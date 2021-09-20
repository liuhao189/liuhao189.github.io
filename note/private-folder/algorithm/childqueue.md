# 子序列问题通用思路

## 前言

子序列问题很可能涉及到两个字符串。一般来说，这类问题都是让你求一个最长子序列，因为最短子序列就是一个字符，没啥可问的。
一旦涉及到子序列和最值，几乎可以肯定，考察的是动态规划技巧，时间复杂度一般都是O(n^2)。

既然要用动态规划，那就要定义dp数组，找状态转移关系。两种思路模板，就是dp数组的定义思路，不同的问题可能需要不同的dp数组定义来解决。

## 一些名词

LCIS，最长连续递增序列；LIS，最长上升子序列；LCS，最长连续序列；LCS，最长公共子序列。

子序列并不要求连续，只要保证元素前后顺序一致即可。eg：[4, 6, 5]是[1, 2, 4, 3, 7, 6, 5]的一个子序列。

上升要求严格上升，即不能相等。eg：[2, 3, 3, 6, 7]由于3重复了，所以不是严格上升的。

## 最长上升子序列

DP，dp[i]表示以i索引结尾的最长上升子序列的长度。如果遍历到i位置，在[0, i]区间内有[0, j]且j < i，当nums[i]<=nums[j]时，

表示以j结束的子序列和i结束的子序列不能形成上升子序列。那么当nums[i]>nums[j]时，可以考虑在max(dp[j])的最大值加上当前nums[i]的长度也就是，dp[i]=Math.max(dp[i], dp[j]+1)。此为状态转移方程。

``` js
/**
 * 
 * @param {*} nums 最长上升子序列 
 */
function findLIS(nums) {
    if (!nums || !nums.length) return;
    let dp = [];
    for (let i = 0; i < nums.length; ++i) {
        dp.push(1);
        for (let j = 0; j < i; ++j) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    let max = -1;
    for (let i = 0; i < nums.length; ++i) {
        max = Math.max(dp[i], max);
    }
    return max;
}
```

## 最长连续递增序列 Easy

给定一个未经排序的整数数组，找到最长且连续的递增序列。

dp[i]表示以 i 位置结尾，即nums[i]值结尾的最长连续递增序列的长度。当 nums[i]>nums[i-1]时，可以和 nums[i-1]拼接起来，dp[i]=dp[i-1]+1，当 nums[i]<= nums[i-1]时，nums[i]自身形成一个最长连续递增序列，长度为 1。

``` js
//时间复杂度 n，空间复杂度 n，因为只依赖前一个结果，所以空间复杂度可以改善为 O(1)。
function getLCISLen(nums) {
    if (!nums || !nums.length) return 0;
    let dp = [1];
    let max = dp[0];
    for (let i = 1; i < nums.length; ++i) {
        let prevNum = nums[i - 1];
        let currNum = nums[i];
        if (currNum > prevNum) {
            dp[i] = dp[i - 1] + 1;
        } else {
            dp[i] = 1;
        }
        max = Math.max(dp[i], max);
    }
    return max;
}
```

## 最长递增子序列的个数



## 参考文献

https://leetcode-cn.com/problems/longest-consecutive-sequence/solution/tao-lu-jie-jue-zui-chang-zi-xu-lie-deng-yi-lei-wen/

