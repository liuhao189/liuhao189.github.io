function TreeNode(val) {
    this.val = val;
    this.left = this.right = null;
}

function mergeTree(t1, t2) {
    if (!t1 || !t2) return t1 || t2;
    let tn = new TreeNode(t1.val + t2.val);
    tn.left = mergeTree(t1.left, t2.left);
    tn.right = mergeTree(t1.right, t2.right);
    return tn;
}

function mergeTrees(t1, t2) {
    if (!t1 || !t2) return t1 || t2;
    let nodes = [[t1, t2]];
    while (nodes.length) {
        let currNodes = nodes.pop();
        currNodes[0].val += currNodes[1].val;
        if (currNodes[0].left && currNodes[1].left) {
            nodes.push([currNodes[0].left, currNodes[1].left]);
        }

        if (currNodes[0].right && currNodes[1].right) {
            nodes.push([currNodes[0].right, currNodes[1].right])
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