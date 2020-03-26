# 题目

给定一个非负整数 numRows，生成杨辉三角的前 numRows 行。

在杨辉三角中，每个数是它左上方和右上方的数的和。

示例:

输入: 5
输出:
[
     [1],
    [1,1],
   [1,2,1],
  [1,3,3,1],
 [1,4,6,4,1]
]

```js
/**
 * @param {number} numRows
 * @return {number[][]}
 */
var generate = function (numRows) {
    if (numRows <= 0) return [];
    let res = [];
    for (let i = 0; i < numRows; ++i) {
        let row = [];
        if (i === 0) {
            row.push(1)
        } else if (i === 1) {
            row.push(1);
            row.push(1);
        } else {
            let prevRows = res[i - 1];
            let startPrevInx = 0;
            for (let j = 0; j < i + 1; ++j) {
                if (j === 0) {
                    row.push(1);
                }
                else if (j === i) {
                    row.push(1);
                } else {
                    row.push(prevRows[startPrevInx] + prevRows[startPrevInx + 1]);
                    startPrevInx++;
                }
            }
        }
        res.push(row);
    }
    return res;
};
```