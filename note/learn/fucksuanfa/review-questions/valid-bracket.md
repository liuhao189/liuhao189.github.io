# 合法括号的判断

对括号的合法性判断是一个很常见且实用的问题。

关于括号合法性的判断的算法题，可以加深你对栈这种数据结构的理解。

## 题目

输入一个字符串，其中包含`[]{}()`，判断这个字符串组成的括号是否合法。

```js
var isValid = function (s) {
    if (!s) return true;
    let len = s.length;
    let stack = [];
    let startObj = {
        '(': ')',
        '[': ']',
        '{': '}',
    };
    let endObj = {
        ')': '(',
        ']': '[',
        '}': '{',
    }
    let res = true;
    for (let i = 0; i < len; ++i) {
        let currChar = s[i];
        if (startObj[currChar]) {
            stack.push(currChar);
        }
        if (endObj[currChar]) {
            let prevStartChar = stack.pop();
            if (prevStartChar !== endObj[currChar]) {
                res = false;
                break;
            }
        }
    }

    return res && !stack.length;
};
```