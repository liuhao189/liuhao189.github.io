# 连续子数组的最大和

题目：输入一个整型数组，数组中的一个或连续多个整数组成一个子数组。求所有子数组的和的最大值。要求时间复杂度为O(n)。

```js
// 动态规划的思路，其实只有一个数据做状态就好
// dp[i]为以i为结尾的连续子数组的最大和
// dp[i+1] = Math.max(nums[i+1] + dp[i], nums[i+1])
var maxSubArray = function(nums) {
    if (!nums || !nums.length) return null;

    if (nums.length === 1) return nums[0];

    let prev = 0,
        maxAns = Number.MIN_SAFE_INTEGER;

    nums.forEach((val, inx) => {
        let curr = Math.max(val + prev, val);
        if (curr > maxAns) {
            maxAns = curr;
        }
        prev = curr;
    });

    return maxAns;
};
```

# 三数之和

给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。

注意：答案中不可以包含重复的三元组。

示例 1：

输入：nums = [-1, 0, 1, 2, -1, -4]
输出：[[-1, -1, 2], [-1, 0, 1]]

示例 2：

输入：nums = []
输出：[]

示例 3：

输入：nums = [0]
输出：[]

```js
function threeSum(pNums) {
    let NUM_COUNT = 3;
    if (!pNums || pNums.length < NUM_COUNT) return [];
    let nums = pNums.slice(0);
    nums.sort((a, b) => {
        return a - b > 0 ? 1 : -1;
    });
    let numsLen = nums.length;
    let result = [];

    for (let first = 0; first < numsLen; ++first) {

        if (first > 0 && nums[first] === nums[first - 1]) {
            continue;
        }

        let third = numsLen - 1;
        let target = -nums[first];

        for (let second = first + 1; second < numsLen; ++second) {
            if (second > first + 1 && nums[second] === nums[second - 1]) {
                continue;
            }

            while (second < third && nums[second] + nums[third] > target) {
                third--;
            }
            //后续增加不会再有值
            // 后续b增加，c增加
            if (second === third) {
                break;
            }

            if (nums[second] + nums[third] === target) {
                result.push([nums[first], nums[second], nums[third]]);
            }
        }
    }

    return result;
}
```

# 洗牌算法

重要的是足够随机，不重复，需要删除原数组。

```js
function shuffle(arr) {
    let result = [];
    let arrCopied = arr.slice();
    while (arrCopied.length) {
        let random = Math.floor(Math.random() * arrCopied.length);
        result.push(arrCopied[random]);
        arrCopied.splice(random, 1);
    }

    return result;
}
```

# 洗牌算法knuth-durstenfeld 

每次从未处理的数组中随机取一个元素，然后把该元素放到数组的尾部，即数组的尾部放的就是已经处理过的元素，这是一种原地打乱的算法，每个元素随机概率也相等。时间复杂度从Fisher算法的O(n^2)提升到了O(n)。

1、选取数组中最后一个元素arr[length-1]，将其与n个元素中的任意一个交换，此时最后一个元素已经确定。

2、选取第二个元素(arr[length-2])，将其与n-1个元素中的任意一个交换。

3、重复1和2步，直到剩下一个元素。

```js
function shuffle(arr) {
    let arrCopied = arr.slice();
    let arrLen = arrCopied.length;
    while (arrLen > 1) {
        let randomInx = Math.floor(Math.random() * arrLen);
        let temp = arrCopied[arrLen - 1];
        arrCopied[arrLen - 1] = arrCopied[randomInx];
        arrCopied[randomInx] = temp;
        arrLen--;
    }
    return arrCopied;
}
```


