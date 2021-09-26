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

# 









