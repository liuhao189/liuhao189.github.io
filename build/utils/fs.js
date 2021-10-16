/**
 * 
 * @param {*} path 
 */
function getFileNameFromPath(path, withExt = false) {
    if (!path) return null;
    let partArr = path.split('/');
    let fileNameWithExt = partArr[partArr.length - 1];
    if (!withExt) {
        let nameParts = fileNameWithExt.split('.');
        return nameParts[0];
    }
}

module.exports = {
    getFileNameFromPath,
}