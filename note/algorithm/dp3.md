# 动态规划三

# 正则表达式

给定一个字符串s和一个字符模式p，实现支持'.'和'*'的正则表达式匹配。

'.'匹配任意单个字符，'*'匹配零个或多个前面的元素。匹配应该覆盖整个字符串，而不是部分字符串。

eg：s='aa',p='a*'，输出ture。输入s='aab',p=c*a*b*，输出true。输入s='ab',p='.*'，输出true。

## 分析

判断字符串相等递归算法

```js
/**
 * 
 * @param {*} txt 
 * @param {*} pattern 
 */
function isMatch(txt, pattern) {
    if (!pattern) return txt === pattern;
    let firstMatch = (txt[0] === pattern[0]);
    return firstMatch && isMatch(txt.substr(1), pattern.substr(1));
}
```

处理点号.通配符

```js
/**
 * 
 * @param {*} txt 
 * @param {*} pattern 
 */
function isMatch(txt, pattern) {
    if (!pattern) return txt === pattern;
    let firstMatch = (txt[0] === pattern[0] || pattern[0] === '.');
    return firstMatch && isMatch(txt.substr(1), pattern.substr(1));
}
```

处理*量词符

```js
/**
 * 
 * @param {*} txt 
 * @param {*} pattern 
 */
function isMatch(txt, pattern) {
    if (!pattern) return txt === pattern;
    let firstMatch = (txt[0] === pattern[0] || pattern[0] === '.');
    if (pattern.length >= 2 && pattern[1] === '*') {
        return firstMatch ? isMatch(txt, pattern.substr(2)) : isMatch(txt.substr(1), pattern);
    } else {
        return firstMatch && isMatch(txt.substr(1), pattern.substr(1));
    }
}
```