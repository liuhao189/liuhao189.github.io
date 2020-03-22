# 子序列问题解题模板

子序列问题本身相对子串，子数组更困难一些，因为前者是不连续的序列，而后者是连续的。

一般来说，这种问题都是让你求一个最长子序列，因为最短子序列就是一个字符，没啥可问的。一旦涉及到子序列和最值，那几乎可以肯定，考察的是动态规划技巧，时间复杂度一般都是O(N*N)。

既然要用动态规划，那就要定义dp数组，找状态转移关系。两种思路，就是dp数组的定义思路。

## 一维的dp数组

最长递增子序列，因为这样符合归纳法，可以找到状态转移的关系。

## 二维的dp数组

这种思路运用相对更多一些，尤其是涉及到两个字符串/数组的子序列。eg：最长公共子序列。

```js
var lengthOfLIS = function (nums) {
    if (!nums || !nums.length) return 0;
    let dp = [];
    let max = -1;
    for (let i = 0; i < nums.length; ++i) {
        dp.push(1);
        for (let j = 0; j < i; ++j) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        max = Math.max(max, dp[i]);
    }
    return max;
};
```

### 涉及两个字符串/数组时

在子数组arr1[i]和子数组arr[j]中，我们要求的子序列长度为dp[i][j]。

最长公共子序列

```js
var longestCommonSubsequence = function (text1, text2) {
    if (!text1 || !text2) return 0;
    let cache = {};
    function lcsHelper(inx1, inx2) {
        if (inx1 < 0 || inx2 < 0) return 0;
        let key = `O${inx1}T${inx2}`;
        if (cache[key] !== undefined) {
            return cache[key] ;
        }
        let res = -1;
        if (text1[inx1] === text2[inx2]) {
            res = lcsHelper(inx1 - 1, inx2 - 1) + 1;
        } else {
            res = Math.max(lcsHelper(inx1, inx2 - 1), lcsHelper(inx1 - 1, inx2))
        }
        cache[key] = res;
        return res;
    }

    return lcsHelper(text1.length-1, text2.length-1)
};
//

function longestCommonSubsequence(text1, text2) {
    if (!text1 || !text2) return 0;
    let dp = [];
    let len1 = text1.length;
    let len2 = text2.length;
    for (let i = 0; i <= len1; ++i) {
        let row = [];
        for (let j = 0; j <= len2; ++j) {
            row.push(0);
        }
        dp.push(row);
    }
    for (let i = 1; i <= len1; ++i) {
        let res = -1;
        for (let j = 1; j <= len2; ++j) {
            if (text1[i - 1] === text2[j - 1]) {
                res = dp[i - 1][j - 1] + 1;
            } else {
                res = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
            dp[i][j] = res;
        }
    }
    return dp[text1.length][text2.length];
}
```

最短编辑距离

```js
var minDistance = function (word1, word2) {
    if (!word1 || !word2) return word1.length || word2.length;
    let cache = {};
    function minDistanceHelper(i, j) {
        if (i < 0) return j + 1;
        if (j < 0) return i + 1;
        let key = `O${i}T${j}`;
        if (cache[key] !== undefined) {
            return cache[key];
        }
        let res = 0;
        if (word1[i] === word2[j]) {
            res = minDistanceHelper(i - 1, j - 1);
        } else {
            res = Math.min(
                minDistanceHelper(i - 1, j - 1),
                minDistanceHelper(i - 1, j),
                minDistanceHelper(i, j - 1)
            ) + 1;
        }
        cache[key] = res;
        return res;
    }

    return minDistanceHelper(word1.length - 1, word2.length - 1);
};
//
function minDistance(word1, word2) {
    if (!word1 || !word2) return word1.length || word2.length;
    let dp = [];
    let len1 = word1.length;
    let len2 = word2.length;
    for (let i = 0; i <= len1; ++i) {
        let row = [];
        for (let j = 0; j <= len2; ++j) {
            if (j === 0) {
                row.push(i);
                continue;
            }
            if (i === 0) {
                row.push(j);
                continue;
            }
            row.push(0);
        }
        dp.push(row);
    }
    //
    for (let i = 1; i <= len1; ++i) {
        for (let j = 1; j <= len2; ++j) {
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j - 1],//编辑
                    dp[i][j - 1],//插入
                    dp[i - 1][j]//删除
                ) + 1;
            }
        }
    }
    return dp[len1][len2];
}
```

### 涉及一个字符串数组时

在子数组arr[i]中，我们要求的子序列的长度为dp[i][j]。

