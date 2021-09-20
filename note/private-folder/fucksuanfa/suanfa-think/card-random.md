# 洗牌算法

## 洗牌算法

此类算法都是靠随机选取元素交换来获取随机性，直接看代码。

### 分析洗牌算法

产生的结果必须有n!种可能，否则就是错误的。算法必须能够反映这个事实，才是正确的。

```js
var Solution = function (nums) {
    this.originNums = nums.slice();
    this.nums = nums;
};

/**
 * Resets the array to its original configuration and return it.
 * @return {number[]}
 */
Solution.prototype.reset = function () {
    this.nums = this.originNums.slice();
    return this.nums;
};

/**
 * Returns a random shuffling of the array.
 * @return {number[]}
 */
Solution.prototype.shuffle = function () {
    let nums = this.nums;
    if (!nums || !nums.length) return nums;
    let numLen = nums.length;
    for (let i = 0; i < numLen; ++i) {
        let randInx = i + Math.floor(Math.random(new Date().getTime()) * (numLen - i));
        let temp = nums[i];
        nums[i] = nums[randInx];
        nums[randInx] = temp;
    }
    return nums;
};

```

## 蒙特卡罗方法验证正确性

乱置算法的正确性衡量标准是，对于每种可能的结果出现的概率必须相等，也就是说足够随机。

第一种思路，数组arr的所有排列组合都列举出来，做成一个直方图。重复进行一百万次，如果每种结果出现的总次数差不多，那就说明每种结果出现的概率应该是相等的。

第二种思路，arr数组中全都是0，只有一个1，进行100万次打乱，记录每个索引位置出现1的次数。

## 总结

本文第一部分介绍了洗牌算法，通过一个简单的分析技巧证明了该算法的正确行使。

第二部分是洗牌算法正确性的衡量标准，即每种随机结果出现的概率必须相等。如果不用严格的数学证明，可以通过蒙特卡罗方法大力出奇迹，粗略验证算法的正确性。

