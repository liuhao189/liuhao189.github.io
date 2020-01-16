/**
 * 
 * @param {*} nums 最长上升子序列 
 */
function findLIS(nums) {
    if (!nums || !nums.length) return;
    let dp = [];
    for (let i = 0; i < nums.length; ++i) {
        dp.push(1);
        for (let j = 0; i < i; ++j) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    let max = -1;
    for (let i = 0; i < nums.length; ++i) {
        max = Math.max(dp[i], max);
    }
    return max;
}
/**
 * 
 * @param {*} nums 
 */
function findLCIS(nums) {
    if (!nums || !nums.length) return 0;
    let dp = [];
    for (let i = 0; i < nums.length; ++i) {
        let arr = [];
        let currArr = [nums[0]];
        let prev = nums[0];
        for (let j = 1; j < i; ++j) {
            let curr = nums[j];
            if (curr > prev) {
                currArr.push(curr);
            } else {
                arr.push(currArr);
                currArr = [curr];
            }
            prev = curr;
        }
        let maxIndex = -1;
        let maxLen = -1;
        arr.forEach((arr, inx) => {
            let len = arr.length;
            if (len > maxLen) {
                maxIndex = inx;
                maxLen = len;
            }
        });
        dp.push(arr[maxIndex]);
    }
    return dp[nums.length - 1];
}

function findLCIS(nums) {
    if (!nums || !nums.length) return 0;
    let prev = nums[0];
    let arr = [];
    let currArr = [nums[0]];
    for (let i = 1; i < nums.length; ++i) {
        let curr = nums[i];
        if (curr > prev) {
            currArr.push(curr);
        } else {
            arr.push(currArr);
            currArr = [curr];
        }
        prev = curr;
    }
    arr.puysh(currArr);
    let maxIndex = 0;
    let maxLen = -1;
    arr.forEach((arr, inx) => {
        let len = arr.length;
        if (len > maxLen) {
            maxLen = len;
            maxIndex = inx;
        }
    });
    return arr[maxIndex];
}