// <!-- 
// 1. 输入：[['a', 'b'], ['n', 'm'], ['0', '1']]，输出：["an0", "an1", "am0", "am1", "bn0", "bn1", "bm0", "bm1"] 



function getArr(arr) {
    if (!arr || !arr.length) return [];
    //
    let result = [];
    let arrLen = arr.length;
    //排列组合，使用递归
    function walk(currArr, inx) {
        if (currArr.length === arrLen) {
            result.push(currArr.join(''));
            return;
        }

        let arrInInx = arr[inx];
        arrInInx.forEach(char => {
            currArr.push(char);
            walk(currArr, inx + 1);
            currArr.pop();
        });
    }
    //

    walk([], 0);

    return result;
}

//
var tree = {
    value: 'A',
    left: {
        value: 'B',
        left: {
            value: 'C',
            left: {
                value: 'W'
            }
        },
        right: {
            value: 'D',
            right: {
                value: 'X'
            }
        }
    },
    right: {
        value: 'E',
        left: {
            value: 'F',
            left: {
                value: 'Y'
            }
        },
        right: {
            value: 'G',
            right: {
                value: 'Z'
            }
        }
    }
};

/**
 * 树中序遍历
 */
class BTreeIterator {
    constructor(root) {
    }

    next() {
    }

    hasNext() {

    }
}
