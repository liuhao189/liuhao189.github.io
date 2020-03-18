# 动态规划设计

最长递增子序列问题。

## 动态规划解法

动态规划的核心设计思想是数学归纳法。

数学归纳法思路很简单，我们想证明一个数学结论，那么我们先假设这个结论在$k<$n时成立，然后想办法证明$k=$n的时候结论也成立，如果能证明出来，那么就说明结论对k等于任何数都成立。

首先定义dp数组，假设dp[0]-dp[i]都已经被算出来了。假设我们的定义是dp[i]表示以nums[i]这个数为结尾的最长递增子序列的长度。

接下来要思考如何进行状态转移了，我们已经知道了$0-$4的所有结果，我们如何通过这些已知结果推出$5呢？我们只需要找到前面那些结尾小于$5的子序列，就可以形成以$5结尾的新的子序列，而且这个子序列长度加1。

还有一个细节问题，dp数组应该全部初始化为1，因为子序列最少也要包含自己。所以长度最小长度为1。

``` js
/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function(nums) {
    if (!nums || !nums.length) return 0;
    let dp = [1];
    let max = dp[0];
    for (let i = 1; i < nums.length; ++i) {
        dp[i] = 1;
        for (let j = 0; j < i; ++j) {
            //优化，不用遍历到最开始
            if (nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        max = Math.max(max, dp[i])
    }
    return max;
};
```

## 最长公共子序列问题

最长公共子序列是一道非常经典的面试题目，因为它的解法是典型的二维动态规划。大部分比较困难的字符串问题和这个问题一个套路，比如说编辑距离。

第一步明确dp数组的含义，对于两个字符串的动态规划问题，套路是通用的，对于字符串s1和s2，一般要构建一个DP Table。

dp[i][j]的含义是，对于s1[0... i]和s2[0... j]，它们的LCS长度是dp[i][j]。

第二步，定义base case。专门让索引0的行和列表示空串。dp[0][... ]和dp[... ][0]，都应初始化为0。

第三步，找状态转义方程。求s1和s2的最长公共子序列，不妨设这个子序列为lcs，那么对于s1和s2中的每个字符，有两个选择，要么在lcs中，要么不在。

``` js
/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
var longestCommonSubsequence = function(text1, text2) {
    if (!text1 || !text2) return 0;
    let cache = {};

    function lcsHelper(i, j) {
        if (i === -1 || j === -1) return 0;
        let key = `S${i}S${j}` ;
        if (cache[key] !== undefined) {
            return cache[key];
        }
        let res;
        if (text1[i] === text2[j]) {
            res = lcsHelper(i - 1, j - 1) + 1;
        } else {
            res = Math.max(lcsHelper(i - 1, j), lcsHelper(i, j - 1));
        }
        cache[key] = res;
        return res;
    }

    return lcsHelper(text1.length - 1, text2.length - 1);
};

///
function longestCommonSubsequence(text1, text2) {
    if (!text1 || !text2) return 0;
    let dpArr = [];
    let len1 = text1.length;
    let len2 = text2.length;
    for (let i = 0; i <= len1; ++i) {
        let row = [];
        for (let j = 0; j <= len2; ++j) {
            row.push(0);
        }
        dpArr.push(row);
    }
    for (let i = 1; i <= len1; ++i) {
        for (let j = 1; j <= len2; ++j) {
            if (text1[i - 1] === text2[j - 1]) {
                dpArr[i][j] = dpArr[i - 1][j - 1] + 1;
            } else {
                dpArr[i][j] = Math.max(dpArr[i - 1][j], dpArr[i][j - 1]);
            }
        }
    }
    return dpArr[len1][len2];
}
```

### 疑难解答

对于s1[i]和s2[j]不相等的情况，至少有一个字符不在lcs中，也有可能都不在。但是dp[i-1][j-1]是最小的，不可能选到它，所以max(dp[i-1][j], dp[i][j-1])可以得出正确答案。

### 总结

对于两个字符串的动态规划问题，一般来说都是像本文一样定义DP Table，这样有一个好处，容易写出状态转义方程。

找状态转移方程的方法是，思考每个状态有哪些选择，只要我们能用正确的逻辑做出正确的选择，算法就能够正确运行。

## 编辑距离

问题：给我们两个字符串s1和s2，只能用三种操作，让我们把s1变为s2，求最少的操作数。

算法的base case是s1或s2走完的时候，另一个没走完，需要插入和删除。

### 递归代码

递归代码的解释性很好，只要理解函数的定义，就能很清楚理解算法的逻辑。

``` js
/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
var minDistance = function(word1, word2) {
    if (!word1 && !word2) return 0;
    if (word1 && !word2) {
        return word1.length;
    }
    if (!word1 && word2) {
        return word2.length;
    }
    let cache = {};

    function mdHelper(i, j) {
        if (i === -1) return j + 1;
        if (j === -1) return i + 1;
        let key = `WO${i}WT${j}` ;
        if (cache[key] !== undefined) {
            return cache[key];
        }
        let res;
        if (word1[i] === word2[j]) {
            res = mdHelper(i - 1, j - 1);
        } else {
            res = Math.min(
                mdHelper(i - 1, j) + 1, //删除
                mdHelper(i, j - 1) + 1, //新增
                mdHelper(i - 1, j - 1) + 1) //编辑
        }
        cache[key] = res;
        return res;
    }

    return mdHelper(word1.length - 1, word2.length - 1);
};
```

### 代码详解

base case是i走完s1或j走完s2，可以直接返回另一个字符串剩下的长度。

对于每对字符s1[i]和s2[j]，可以有四种操作。

```js
if (s1[i] === s2[j]) {
    //skip 
    // i和j向前移动
} else {
    // 三选一
    // 插入(i,j-1) 
    // 删除(i-1,j)
    // 编辑(i-1,j-1)
    // + 本步求最低值
}
```

现在代码存在大量大量的重叠子问题，需要使用备忘录或dp table优化。


