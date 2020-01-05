# 二分查找细节详解

# 二分查找

二分查找真的很简单吗？思路很简单，细节是魔鬼。寻找一个数，寻找左侧边界，寻找右侧边界，不等号是否应该带等号，mid是否应该加一等等。

# 有序数组查找特定值

```js
function findIndex(nums, target) {
    if (!nums || !nums.length) return -1;
    let left = 0;
    let right = nums.length - 1;
    let resultIndex = -1;
    while (left <= right) {
        let mid = Number.parseInt((left + right) / 2);
        if (target === nums[mid]) {
            resultIndex = mid;
            break;
        } else if (target < nums[mid]) {
            right = mid - 1;
        } else if (target > nums[mid]) {
            left = mid + 1;
        }
    }
    return resultIndex;
}
```

Q、为什么while循环的条件是<=，而不是<？

因为right的赋值是nums.length-1，即最后一个元素的索引，而不是nums.length。

Q、什么时候应该停止搜索？

找到目标值的时候，或搜索区间为空的时候应该终止。

Q、为什么left=mid+1，right=mid-1？

搜索区间的概念，二分查找的一个难点。mid已经搜索过了，应该从搜索区间中去除。

Q、有啥缺陷？

不能找到左侧边界索引，或右侧边界索引。

# 寻找左侧边界的二分搜索



