# 回溯算法详解

解决一个回溯问题，实际上就是一个决策树的遍历过程，你只需要思考3个问题。

1、路径，也就是已经做出的选择。

2、选择列表，你当前可以做的选择。

3、结束条件，到达决策树底层，无法再做选择的条件。

```js
function backtrace(路径， 选择列表) {
    if (满足结束条件) {
        result.push(路径)
        return;
    }
    for(let 选择 of 选择列表){
        做选择
        backtrace(路径，选择列表)
        撤销选择
    }
}
```

核心就是for循环里面的递归，在递归调用之前做选择，在递归调用之后撤销选择，特别简单。

## 全排列问题

只要从根遍历这棵树，记录路径上的数字，其实就是所有的全排列。不妨把这棵树成为回溯算法的决策树。

因为你在每个节点上其实都在做决策。

eg:[2]就是路径，记录你已经做过的选择；[1,3]就是选择列表，表示你当前可以做出的选择，结束条件就是遍历到树的底层。也就是选择列表为空的时候。

定义的backtrace函数其实就像一个指针，在这棵树上游走，同时要正确维护每个节点的属性，每当走到树的底层，其路径就是一个全排列。

前序遍历的代码在进入一个节点之前的那个时间点执行，后续遍历代码在离开某个节点之后的那个时间点执行。

回溯算法，时间复杂度都不可能低于O(N!)，因为穷举整颗决策树是无法避免的，不像动态规划存在重叠子问题可以优化，回溯算法就是纯暴力穷举，复杂度一般很高。

```js
var permute = function (nums) {
    if (!nums || !nums.length) return [];
    let res = [];
    function premuteHelper(nums, track) {
        if (nums.length === track.length) {
            res.push(track.slice());
            return;
        }
        for (let i = 0; i < nums.length; ++i) {
            if (track.includes(nums[i])) {
                continue;
            }
            track.push(nums[i]);
            premuteHelper(nums, track);
            track.pop();
        }
    }

    premuteHelper(nums, []);
    return res;
};
```

