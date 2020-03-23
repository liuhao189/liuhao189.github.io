# 如何寻找最长回文子串

回文串就是正着读和反着读都一样的字符串。解决该类问题的核心是双指针。

## 思考

把s反转，称为s'，然后在s和s'中寻找最长公共子串，这样应该能找到最长回文子串。但这个思路是错误的，eg：aacxycaa，aacyxcaa，最长公共子串是aac，但最长回文子串是aa。

虽然这个思路不正确，但是这种把问题转化为其它形式的思考方式是非常值得提倡的。

寻找回文串的问题核心思想是，从中间开始扩散来判断回文串。

但是回文子串的长度可能是奇数也可能是偶数，需要判断偶数情况。

```js
// 时间复杂度O(N*N)，空间复杂度O(1)
function longestPalindrome(s) {
    if (!s) return '';
    function palindrome(left, right) {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            left--;
            right++;
        }
        return s.substring(left + 1, right);
    }
    let res = '';
    for (let i = 0; i <= s.length - 1; ++i) {
        let s1 = palindrome(i, i);
        let s2 = palindrome(i, i + 1);
        let strMax = s1.length >= s2.length ? s1 : s2;
        if (res.length < strMax.length) {
            res = strMax;
        }
    }
    return res;
}
//动态规划法，时间复杂度一样，但是空间复杂度至少O(N^2)来存储DP Table。没有经过验证。。。
var longestPalindrome = function (s) {
    if (!s) return '';
    let cache = {};

    function helper(left, right) {
        if (left === right) return s[left];
        if (left > right) return '';
        let key = `L${left}R${right}`;
        if (cache[key] !== undefined) {
            return cache[key];
        }
        let res = '';
        let currLeft = left;
        let currRight = right;
        while (currLeft < currRight) {
            if (s[currLeft] === s[currRight]) {
                currLeft++;
                currRight--;
            } else {
                let rightBack = helper(left, right - 1);
                let leftNext = helper(left + 1, right);
                res = leftNext.length > rightBack.length ? leftNext : rightBack;
                break;
            }
        }
        if (currLeft >= currRight) {
            res = s.slice(left, right + 1);
        }
        cache[key] = res;
        return res;
    }

    return helper(0, s.length - 1);
};
```

这道题是少有的动态规划非最优解法的问题。