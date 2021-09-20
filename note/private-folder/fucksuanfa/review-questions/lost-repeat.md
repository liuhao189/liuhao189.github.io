# 缺失和重复的元素

## 题目

给一个长度为 `N` 的数组 `nums`，其中本来装着 `[1..N]` 这 `N` 个元素，无序。但是现在出现了一些错误，`nums` 中的一个元素出现了重复，也就同时导致了另一个元素的缺失。请你写一个算法，找到 `nums` 中的重复元素和缺失元素的值。

## 暴力解法

先遍历一次数组，用一个很哈希表记录每个数字出现的次数，然后遍历一次`[1..N]`即可。

此解法O(N)的时间复杂度和O(N)的空间复杂度是无法避免的。

## 思路分析

如果nums中不存在重复元素和缺失元素，那么每个元素就和唯一的索引值对应。

一个元素重复了，同时导致另一个元素缺失了，会导致有两个元素对应到了同一个索引，而且会有一个索引没有元素对应过去。

在不使用额外的空间判断某个索引有多少元素对应呢？

```js
/**
 * 
 * @param {*} nums 
 */
function findErrorNums(nums) {
    if (!nums || !nums.length) return;
    let len = nums.length;
    let dup = -1;
    for (let i = 0; i < len; ++i) {
        let inx = Math.abs(nums[len]);
        if (nums[inx - 1] < 0) {
            dup = inx;
        } else {
            nums[inx - 1] *= -1;
        }
    }
    let miss = -1;
    for (let i = 0; i < len; ++i) {
        if (nums[i] > 0) {
            miss = i + 1;
        }
    }
    return { dup, miss };
}
```

## 总结

对于数组问题，关键点在于元素和索引是成对儿出现的，常用的方法是排序，异或，映射。

映射的思路，每个索引和元素映射起来，通过正负号记录某个元素是否被映射。

排序的方法也很好理解，发现索引对应的元素如果不相符，就可以找到重复和缺失的元素。

异或运算也很常见，因为异或性质，将索引和元素同时异或，就可以消除成对的索引和元素，留下的就是重复和缺失的元素。

## 附录

## 题目

一个长度为n-1的递增排序数组中的所有数字都是唯一的，并且每个数字都在范围0～n-1之内。在范围0～n-1内的n个数字中有且只有一个数字不在该数组中，请找出这个数字。

### 异或思路

位运算，异或，一个数和它本身做异或运算结果为0，一个数和0做异或运算还是它本身。而且异或满足交换律和结合律。

只要把所有的元素和索引做异或运算，成对的数字就会消失为0，只有这个落单的元素会剩下，也就达到我们的目的。

```js
var missingNumber = function (nums) {
    if (!nums || !nums.length) return -1;
    let len = nums.length;
    let res = 0;
    res ^= len;
    for (let i = 0; i < len; ++i) {
        res ^= i ^ nums[i];
    }
    return res;
};
```

### 等差数列

等差数列求和公式，需要考虑整型溢出问题。

我们可以让每个索引减去其对应的元素，再把相减的结果加起来。最后的结果就是缺失的元素。

```js
function missingNumber(nums) {
    if (!nums || !nums.length) return -1;
    let len = nums.length;
    let res = len;
    for (let i = 0; i < len; ++i) {
        res += i - nums[i];
    }
    return res;
}
```