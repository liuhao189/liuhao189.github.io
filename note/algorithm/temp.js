let cache = {};
function eggDrop(K, N) {
    if (K === 1) return N;
    if (N === 0) return 0;
    let key = `Egg${K}Floor${N}`;
    if (cache[key] !== undefined) {
        return key;
    }
    let res = 0;
    for (let i = 0; i <= N; ++i) {
        res = min(res, max(
            eggDrop(K - 1, i - 1),
            eggDrop(K, N - i))
        )
    }
    cache[key] = res;
    return res;
}


let mem = {};

/**
 * 
 * @param {*} k  k个鸡蛋
 * @param {*} n  n层楼
 */
function dropEggs(k, n) {
    if (k === 1) return n;
    if (n === 0) return 0;
    let key = `Egg${k}Floor${n}`;
    if (mem[key] !== undefined) {
        return mem[key];
    }
    let res = 0;
    let left = 1, right = N;
    while (left <= right) {
        let mid = Number.parseInt(left + right / 2);
        let broken = dropEggs(k - 1, mid - 1);
        let notBroken = dropEggs(k, N - mid);
        if (broken > notBroken) {
            right = mid - 1;
            res = min(res, broken + 1);
        } else {
            left = mid + 1;
            res = min(res, notBroken + 1);
        }
    }
    mem[key] = res;
    return res;
}

/**
 * 
 * @param {*} txt 
 * @param {*} pattern 
 */
function isMatch(txt, pattern) {
    if (!pattern) return txt === pattern;
    let firstMatch = txt[0] === pattern[0];
    return firstMatch && isMatch(txt.substr(1), pattern.substr(1));
}

/**
 * 
 * @param {*} txt 
 * @param {*} pattern 
 */
function isMatch(txt, pattern) {
    if (!pattern) return txt === pattern;
    let firstMatch = (txt[0] === pattern[0] || pattern[0] === '.');
    return firstMatch && isMatch(txt.substr(1), pattern.substr(1));
}

/**
 * 
 * @param {*} txt 
 * @param {*} pattern 
 */
function isMatch(txt, pattern) {
    if (!pattern) return txt === pattern;
    let firstMatch = (txt[0] === pattern[0] || pattern[0] === '.');
    if (pattern.length >= 2 && pattern[1] === '*') {
        return firstMatch ? isMatch(txt, pattern.substr(2)) : isMatch(txt.substr(1), pattern);
    } else {
        return firstMatch && isMatch(txt.substr(1), pattern.substr(1));
    }
}

function isMatch(txt, pattern) {
    if (!txt || !pattern) return false;
    if (txt === pattern) return true;
    let i = 0;
    let j = 0;
    while (i < txt.length & j < pattern.length) {
        let currVal = txt[i];
        let currPatternChar = pattern[j];
        let nextPatternChar;
        if (j + 1 < pattern.length) {
            nextPatternChar = pattern[j + 1];
        }

        if (nextPatternChar === '*') {
            if (currVal === currPatternChar || currPatternChar === '.') {
                i++;
                continue;
            } else {
                j = j + 2;
                continue;
            }
        } else {
            if (currVal === currPatternChar || currPatternChar === '.') {
                i++;
                j++;
                continue;
            } else {
                break;
            }
        }
    }
    //
    let patternEnd = j >= pattern.length || (j + 1 === pattern.length - 1 && pattern[j + 1] === '*');
    return i >= txt.length && patternEnd;
}