# 子集排列组合

## 子集

输入一个不包含重复数字的数组，要求算法输出这些数字的所有子集。

### 归纳法

知道了规模更小的子问题的结果，推导出当前问题的结果。

subset([1,2,3])=subset([1,2])+[(subser([1,2])).add(3) for...]

```js
var subsets = function (nums) {
    function helper(nums, end) {
        if (!nums || !nums.length) return [[]];
        if (end < 0) return [[]];
        let prevSubsets = helper(nums, end - 1);
        let currRes = [];
        prevSubsets.forEach((setItem) => {
            currRes.push(setItem.slice());
            setItem.push(nums[end]);
            currRes.push(setItem.slice());
        })
        return currRes;
    }

    return helper(nums, nums.length - 1);
};
```