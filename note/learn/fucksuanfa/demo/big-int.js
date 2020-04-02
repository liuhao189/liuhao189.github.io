/**
 * 
 * @param {*} num1 
 * @param {*} num2 
 */
function addStrings(num1, num2) {
    if (!num1 || !num2) return num1 || num2;

    let num1Len = num1.length;
    let num2Len = num2.length;
    //
    let maxLen = Math.max(num1Len, num2Len);
    let resArr = [];
    let num1Arr = num1.split('');
    let num2Arr = num2.split('');
    let fromPrev = 0;
    for (let i = 1; i <= maxLen; ++i) {
        let curr1 = Number.parseInt(num1Arr[i]) || 0;
        let curr2 = Number.parseInt(num2Arr[i]) || 0;
        let sum = curr1 + curr2 + fromPrev;
        fromPrev = sum >= 10 ? 1 : 0;
        sum = sum >= 10 ? sum - 10 : sum;
        resArr.unshift(sum);
    }
    if (fromPrev) {
        resArr.unshift(fromPrev);
    }
    return resArr.join('');
}