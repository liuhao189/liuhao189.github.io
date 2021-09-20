const fs = require('fs');

/**
 * 读取文件，返回JSON
 * @param {*} path 
 * @param {*} fileEncoding 
 * @returns 
 */
function readToJsonSync(path, fileEncoding = "utf-8") {
    let fileContent = fs.readFileSync(path, { encoding: fileEncoding }).toString();
    return JSON.parse(fileContent);
}

module.exports = {
    readToJsonSync,
}