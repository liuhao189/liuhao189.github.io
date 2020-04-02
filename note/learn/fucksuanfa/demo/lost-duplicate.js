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