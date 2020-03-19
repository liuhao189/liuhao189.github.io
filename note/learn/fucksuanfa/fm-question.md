# 大数相加

题目：给定两个字符串形式的非负整数num1和num2，计算它们的和？

## 分析

int之类的整数类型都有表达范围，无法适用于大数相加。大数相加一般使用字符串形式。

主要在于进位上。

## 代码

``` js
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
        let curr1 = Number.parseInt(num1Arr[maxLen - i]) || 0;
        let curr2 = Number.parseInt(num2Arr[maxLen - i]) || 0;
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
```

# 二叉树的前序遍历

递归的比较简单，迭代的算法可以加分。

``` js
// 递归
var preorderTraversal = function(root) {
    if (!root) return [];
    let arr = [];

    function prevTraversal(root) {
        if (!root) return;
        arr.push(root.val);
        prevTraversal(root.left);
        prevTraversal(root.right);
    }
    prevTraversal(root);
    return arr;
};
// 迭代
function preorderTraversal(root) {
    if (!root) return [];
    let arr = [];
    let nodes = [root];
    while (nodes.length) {
        let node = nodes.pop();
        arr.push(node.val);
        if (node.right) {
            nodes.push(node.right)
        }
        if (node.left) {
            nodes.push(node.left);
        }
    }
    return arr;
}
```

## 二叉树的中序遍历

中序遍历是先访问左子树，再方法右子树。

``` js
// 递归版本，O(N)，空间复杂度O(N)
var inorderTraversal = function(root) {
    if (!root) return [];
    let resArr = [];

    function inorderTraversalHelper(tree) {
        if (!tree) return;
        inorderTraversalHelper(tree.left);
        resArr.push(tree.val);
        inorderTraversalHelper(tree.right);
    }
    inorderTraversalHelper(root);
    return resArr;
};
// 迭代版本

function inorderTraversal(root) {
    if (!root) return [];
    let stack = [];
    let curr = root;
    let resArr = [];
    while (curr || stack.length) {
        while (curr) {
            stack.push(curr);
            curr = curr.left;
        }
        curr = stack.pop();
        resArr.push(curr.val);
        curr = curr.right;
    }
    return resArr;
}
```

# 层次遍历

给定一个二叉树，返回其按层次遍历的节点值。 （即逐层地，从左到右访问所有节点）。

例如:
给定二叉树: [3, 9, 20, null, null, 15, 7], 

    3

   / \
  9  20

    /  \

   15   7

返回其层次遍历结果：

[
  [3], 
  [9, 20], 
  [15, 7]
]

``` js
function levelOrder(tree) {
    if (!tree) return;
    let resArr = [];
    let nodes = [
        [root]
    ];
    while (nodes.length) {
        let currLayerNodes = nodes.pop();
        let newLayerNodes = [];
        let layerVals = [];
        currLayerNodes.forEach(node => {
            layerVals.push(node.val);
            if (node.left) {
                newLayerNodes.push(node.left);
            }
            if (node.right) {
                newLayerNodes.push(node.right);
            }
        })
        resArr.push(layerVals);
        if (newLayerNodes.length) {
            nodes.push(newLayerNodes);
        }
    }
    return resArr;
}
```

## 数组排序

给定一个整数数组 nums，将该数组升序排列。

### 选择排序

时间复杂度O(N^2)，空间复杂度O(1)。

``` js
var sortArray = function(nums) {
    if (!nums || !nums.length) return [];
    for (let i = 0; i < nums.length; ++i) {
        for (let j = i + 1; j < nums.length; ++j) {
            if (nums[i] > nums[j]) {
                let temp = nums[i];
                nums[i] = nums[j];
                nums[j] = temp;
            }
        }
    }
    return nums;
};
//记录minIndex，省去替换时间
function sortArray(nums) {
    if (!nums || !nums.length) return [];
    for (let i = 0; i < nums.length; ++i) {
        let minIndex = i;
        for (let j = i + 1; j < nums.length; ++j) {
            if (nums[j] < nums[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            let temp = nums[i];
            nums[i] = nums[minIndex];
            nums[minIndex] = temp;
        }
    }
    return nums;
}
//
```

### 归并排序

时间复杂度O(nlogn)，空间复杂度O(nlogn)。

``` js
function sortArray(nums) {
    if (!nums || !nums.length) return [];
    if (nums.length < 2) {
        return nums;
    }
    let mid = Math.floor(nums.length / 2);
    let left = nums.slice(0, mid);
    let right = nums.slice(mid);
    return merge(sortArray(left), sortArray(right));
}

function merge(left, right) {
    let result = [];
    while (left.length && right.length) {
        if (left[0] < right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }
    while (left.length) {
        result.push(left.shift())
    }
    while (right.length) {
        result.push(right.shift())
    }
    return result;
}
```

### 快速排序

``` js
function sortArray(nums, left, right) {
    if (!nums || !nums.length) return [];
    left = typeof left === 'number' ? left : 0;
    right = typeof right === 'number' ? right : nums.length - 1;
    if (left < right) {
        let pivotIndex = partion(nums, left, right);
        sortArray(nums, left, pivotIndex - 1);
        sortArray(nums, pivotIndex + 1, right);
    }
    return nums;
}

function partion(nums, left, right) {
    let pivot = nums[left];
    while (left < right) {
        while (left < right && nums[right] > pivot) {
            right--;
        }
        nums[left] = nums[right];
        while (left < right && nums[left] <= pivot) {
            left++;
        }
        nums[right] = nums[left];
    }
    nums[left] = pivot;
    return left;
}
```

## 螺旋矩阵

给定一个包含 m x n 个元素的矩阵（m 行, n 列），请按照顺时针螺旋顺序，返回矩阵中的所有元素。

示例 1:

输入:
[
 [ 1, 2, 3 ], 
 [ 4, 5, 6 ], 
 [ 7, 8, 9 ]
]
输出: [1, 2, 3, 6, 9, 8, 7, 4, 5]
示例 2:

输入:
[
  [1, 2, 3, 4], 
  [5, 6, 7, 8], 
  [9, 10, 11, 12]
]
输出: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]

``` js
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
function spiralOrder(matrix) {
    if (!matrix || !matrix.length) return [];
    let resArr = [];
    let R = matrix.length,
        C = matrix[0].length;
    let dr = [0, 1, 0, -1];
    let dc = [1, 0, -1, 0];
    let cache = {};
    let i = 0,
        j = 0,
        dire = 0;
    for (let k = 0; k < R * C; ++k) {
        let cacheKey = `R${i}C${j}` ;
        resArr.push(matrix[i][j]);
        cache[cacheKey] = true;
        let ni = i + dr[dire % 4];
        let nj = j + dc[dire % 4];
        if (ni >= 0 && ni < R && nj >= 0 && nj < C && !cache[ `R${ni}C${nj}` ]) {
            i = ni;
            j = nj;
        } else {
            dire++;
            i = i + dr[dire % 4];
            j = j + dc[dire % 4];
        }
    }
    return resArr;
}
```

## 买卖股票的最佳时机

给定一个数组，它的第 i 个元素是一支给定股票第 i 天的价格。

如果你最多只允许完成一笔交易（即买入和卖出一支股票一次），设计一个算法来计算你所能获取的最大利润。

注意你不能在买入股票前卖出股票。

示例 1:

输入: [7, 1, 5, 3, 6, 4]
输出: 5
解释: 在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。

     注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格。

示例 2:

输入: [7, 6, 4, 3, 1]
输出: 0
解释: 在这种情况下, 没有交易完成, 所以最大利润为 0。

``` js
var maxProfit = function(prices) {
    if (!prices || !prices.length) return 0;

    let max = 0;
    for (let i = 0; i < prices.length; ++i) {
        for (let j = i + 1; j < prices.length; ++j) {
            let diff = prices[j] - prices[i];
            max = Math.max(max, diff);
        }
    }
    return max;
};
//
function maxProfit(prices) {
    if (!prices || !prices.length) return 0;
    let start = 0;
    let end = 0;
    let res = 0;
    for (end = 1; end < prices.length; ++end) {
        if (prices[start] > prices[end]) {
            start = end;
        }
        let diff = prices[end] - prices[start];
        res = Math.max(res, diff);
    }
    return res;
}
```

