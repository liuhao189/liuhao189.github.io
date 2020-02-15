/**
 * 
 * @param {*} nums 
 */
function getLCISLength(nums) {
    if (!nums || !nums.length) return 0;
    let dp = [1];
    let max = dp[0];
    for (let i = 1; i < nums.length; ++i) {
        if (nums[i] > nums[i - 1]) {
            dp[i] = dp[i - 1] + 1;
        } else {
            dp[i] = 1;
        }
        max = Math.max(max, dp[i]);
    }
    return max;
}

function getLCISLength(nums) {
    if (!nums || !nums.length) return 0;
    let prevLen = 1;
    let currLen;
    let max = prevLen;
    for (let i = 1; i < nums.length; ++i) {
        if (nums[i] > nums[i - 1]) {
            currLen = prevLen + 1;
        } else {
            currLen = 1;
        }
        max = Math.max(max, currLen);
        prevLen = currLen;
    }
    return max;
}