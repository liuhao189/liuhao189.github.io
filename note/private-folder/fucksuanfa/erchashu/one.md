# 二叉树一

## 平衡二叉树

给定一个二叉树，判断它是否是高度平衡的二叉树。

一棵高度平衡的二叉树定义为：一个二叉树每个节点的左右两个子树的高度差的绝对值不超过1。


```js
// 给定二叉树[3,9,20,null,null,15,7]，返回true。
//   3
// 9    20
//    15    7

// 给定二叉树[1,2,2,3,3,null,null,4,4]，返回false。
//           1
//        2    2
//      3   3
//   4   4 
```

### 思路解析

递归方法：递归获得左右子树的高度，求差；如果差距大于1，返回true，如果差距小于1，继续递归。直到叶子节点。

```js
//自上向下 时间复杂度nlog(n)，最差n2
var isBalanced = function (root) {
    if (!root) return true;
    let leftDepth = getNodeDepth(root.left);
    let rightDepth = getNodeDepth(root.right);
    if (Math.abs(leftDepth - rightDepth) > 1) {
        return false;
    }
    return isBalanced(root.left) && isBalanced(root.right);
};

function getNodeDepth(node) {
    if (!node) return 0;
    let leftNodeDepth = getNodeDepth(node.left) + 1;
    let rightNodeDepth = getNodeDepth(node.right) + 1;
    return Math.max(leftNodeDepth, rightNodeDepth);
}

// 自底向上，时间复杂度O(n)

var isBalanced = function (root) {
    if (!root) return true;
    return balancedHelper(root).balanced;
};

function balancedHelper(root) {
    if (!root) return new TreeInfo(-1, true);
    let leftInfo = balancedHelper(root.left);
    if (!leftInfo.balanced) {
        return new TreeInfo(-1, false);
    }
    let rightInfo = balancedHelper(root.right);
    if (!rightInfo.balanced) {
        return new TreeInfo(-1, false);
    }

    if (Math.abs(leftInfo.height - rightInfo.height) < 2) {
        return new TreeInfo(Math.max(leftInfo.height, rightInfo.height) + 1, true);
    }
    return new TreeInfo(-1, false);
}

function TreeInfo(height, balanced) {
    this.height = height;
    this.balanced = balanced;
}
```

## 合并二叉树

给定两个二叉树，想象当你将它们中的一个覆盖到另一个上时，两个二叉树的一些节点便会重叠。

你需要将他们合并为一个新的二叉树。合并的规则是如果两个节点重叠，那么将他们的值相加作为节点合并后的新值，否则不为 NULL 的节点将直接作为新二叉树的节点。

```js
// 输入: 
// 	Tree 1                     Tree 2                  
//           1                         2                             
//          / \                       / \                            
//         3   2                     1   3                        
//        /                           \   \                      
//       5                             4   7                  
// 输出: 
// 合并后的树:
// 	     3
// 	    / \
// 	   4   5
// 	  / \   \ 
// 	 5   4   7
```

### 思路解析

递归法和迭代法均可以。

```js
// 递归法，时间复杂度O(n)，空间复杂度O(n)
function mergeTree(t1, t2) {
    if (!t1 || !t2) return t1 || t2;
    let tn = new TreeNode(t1.val + t2.val);
    tn.left = mergeTree(t1.left, t2.left);
    tn.right = mergeTree(t1.right, t2.right);
    return tn;
}
// 迭代法，时间复杂度O(n)，空间复杂度O(n)
function mergeTrees(t1, t2) {
    if (!t1 || !t2) return t1 || t2;
    let nodesArr = [[t1, t2]];
    while (nodesArr.length) {
        let currNodes = nodesArr.pop();
        currNodes[0].val += currNodes[1].val;
        if (currNodes[0].left && currNodes[1].left) {
            nodesArr.push([currNodes[0].left, currNodes[1].left]);
        }

        if (currNodes[0].right && currNodes[1].right) {
            nodesArr.push([currNodes[0].right, currNodes[1].right])
        }

        if (!currNodes[0].left && currNodes[1].left) {
            currNodes[0].left = currNodes[1].left;
        }
        if (!currNodes[0].right && currNodes[1].right) {
            currNodes[0].right = currNodes[1].right;
        }
    }
    return t1;
}
```

## 对称二叉树

给定一个二叉树，检查它是否是镜像对称的。

例如，二叉树 [1,2,2,3,4,4,3] 是对称的。

    1
   / \
  2   2
 / \ / \
3  4 4  3
但是下面这个 [1,2,2,null,3,null,3] 则不是镜像对称的:

    1
   / \
  2   2
   \   \
   3    3

说明：如果你可以运用递归和迭代两种方法解决这个问题，会很加分。

```js
//递归，时间复杂度O(n/2)，空间复杂度O(n/2)，调用的堆栈
function isSymmetric(root) {
    if (!root) return true;
    return isSymmetricHelper(root.left, root.right);
}

function isSymmetricHelper(t1, t2) {
    if (!t1 && !t2) return true;
    if (!t1 && t2 || t1 && !t2) return false;
    if (t1.val !== t2.val) return false;
    return isSymmetricHelper(t1.left, t2.right) && isSymmetricHelper(t1.right, t2.left);
}

//迭代法，时间复杂度n/2，空间复杂度O(n/2)

function isSymmetric(root) {
    if (!root) return true;
    let nodes = [[root.left, root.right]];
    let res = true;
    while (nodes.length) {
        let currNodes = nodes.pop();
        if (!currNodes[0] && !currNodes[1]) {
            continue;
        } else if (currNodes[0] && currNodes[1]) {
            if (currNodes[0].val !== currNodes[1].val) {
                res = false;
                break;
            }
            nodes.push([currNodes[0].left, currNodes[1].right]);
            nodes.push([currNodes[0].right, currNodes[1].left]);
        } else {
            res = false;
            break;
        }
    }
    return res;
}
```

## 翻转二叉树

翻转一棵二叉树。

示例：

输入：

     4
   /   \
  2     7
 / \   / \
1   3 6   9
输出：

     4
   /   \
  7     2
 / \   / \
9   6 3   1

### 解析

递归法和迭代法。

```js
// 时间复杂度O(n)，空间复杂度O(n)
var invertTree = function (root) {
    if (!root) return null;
    let temp = root.left;
    root.left = root.right;
    root.right = temp;
    invertTree(root.left);
    invertTree(root.right);
    return root;
};
// 时间复杂度O(n)，空间复杂度O(n)
function invertTree(root) {
    if (!root) return root;
    let nodes = [root];
    while (nodes.length) {
        let currNode = nodes.pop();
        if (!currNode.left && !currNode.right) {
            continue;
        }
        let temp = currNode.left;
        currNode.left = currNode.right;
        currNode.right = temp;
        if (currNode.left) {
            nodes.push(currNode.left);
        }
        if (currNode.right) {
            nodes.push(currNode.right);
        }
    }
    return root;
}
```

