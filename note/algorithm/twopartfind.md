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

```js
function findLeftIndex(nums, target) {
    if (!nums || !nums.length) return -1;
    if (nums.length === 1) {
        return nums[0] === target ? 0 : -1;
    }
    let left = 0;
    let right = nums.length - 1;
    let resultIndex=-1;
    while (left < right) {
        let mid = Number.parseInt((left + right) / 2);
        let midVal = nums[mid];
        if (midVal === target) {
            right = mid;
        } else if (target > midVal) {
            left = mid + 1;
        } else if (target < midVal) {
            right = mid - 1;
        }
    }
    return nums[left] === target ? left : -1;
}
```

Q：为什么算法能够搜索左侧边界？

关键在于对nums[mid]===target这种情况的处理, if(nums[mid]===target){right=mid;}。

Q：为什么返回left而不是right？

都是一样的，因为while的终止条件是left===right。

# 寻找右侧边界的二分查找

```js
//[1,2,2,2,3],2
function findRightIndex(nums, target) {
    if (!nums || !nums.length) return -1;
    if (nums.length === 1) {
        return nums[0] === target ? 0 : -1;
    }
    let left = 0;
    let right = nums.length - 1;
    while (left < right) {
        let mid = Number.parseInt((left + right) / 2);
        let midVal = nums[mid];
        if (midVal === target) {
            left = mid + 1;
        } else if (target > midVal) {
            left = mid + 1;
        } else if (target < midVal) {
            right = mid - 1;
        }
    }
    return nums[right - 1] === target ? right - 1 : -1;
}
```

Q：为什么这个算法能够找到右侧边界？

关键点在于if(nums[mid]===target){left=mid+1;}，不是立即返回，而是增大搜索区间的下界left，使得区间不断向右收缩。

# 总结

基本的二分查找算法：

```js
let left=0,right=nums.length-1;
while(left<right){
    if(nums[mid]>target){
        right=mid-1;
    }else if(nums[mid]<target){
        left=mid+1;
    }
}
```

左侧边界&&右侧边界：

```js
while(left<right){
    //左侧边界
    if(nums[mid]===target){
        right=mid;
    }
    //右侧边界
    if(nums[mid]===target){
        left=mid+1;
    }
}
// 左侧边界
return nums[left]===target?left:-1;
// 右侧边界
return nums[left-1]===target?left-1:-1;
```

注意：

分支二分代码时，不要出现else，全部展开成else if方便理解。

注意搜索区间和while的终止条件，如果存在漏掉的元素，记得在最后检查。

搜索左右边界时，只要在nums[mid]===target时修改即可，搜索右侧时需要减一。

# 参考文献

https://zhuanlan.zhihu.com/p/79553968