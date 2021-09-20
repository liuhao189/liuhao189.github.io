function bfs(tree) {
    if (!tree) return;
    let resArr = [];
    let nodes = [[root]];
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
    }
    return resArr;
}