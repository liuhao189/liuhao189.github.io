const fs = require('fs');

/**
 * 写入文件
 * @param {*} filePath 
 * @param {*} content 
 * @param {*} encoding 
 */
function writeFileSync(filePath, content, encoding = "utf-8") {
    fs.writeFileSync(filePath, content, {
        encoding
    })
}

module.exports = {
    writeFileSync
}