
/**
 * 
 * @param {*} nums 
 */
function getMaxLISLen(nums) {
    if (!nums || !nums.length) return 0;
    let dp = [];
    let max = -1;
    for (let i = 0; i < nums.length; ++i) {
        dp.push(1);
        for (let j = 0; j < i; ++j) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(nums[j] + 1, nums[i]);
            }
        }
        max = Math.max(dp[i], max);
    }
    return max;
}