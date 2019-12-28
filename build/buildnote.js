const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');
const glob = require('glob');

function getBuildPath() {
    let basePath = path.join(__dirname, './../note');
    let distPath = path.join(basePath, 'dist');
    return distPath;
}

function getSourceFiles() {
    let files = glob.sync(path.join(__dirname, './../note') + '/**/*.md');
    console.log(files);
    return files;
}

function getFileNameInfo(filePath) {
    let fileNameReg = /([^\/]+)$/;
    let regResult = fileNameReg.exec(filePath);
    if (regResult && regResult.length) {
        let fileNameStr = regResult[1];
        if (fileNameStr) {
            let nameParts = fileNameStr.split('.');
            return {
                fileName: nameParts[0],
                ext: nameParts[1]
            }
        }
    }
}

function buildFile(filePath) {
    let fileInfo = getFileNameInfo(filePath);
    let fileName = fileInfo && fileInfo.fileName || 'note';
    let cmdStr = `npx markdown ${filePath} -f gfm --highlight -t ${fileName} -s /note/note.css`;
    console.log(cmdStr);
    let result = childProcess.execSync(cmdStr);
    fs.writeFileSync(getBuildPath() + `/${fileName}.html`, result, {
        encoding: 'utf8'
    });
}

function build() {
    let files = getSourceFiles();
    files.forEach((file) => {
        buildFile(file);
    })
}

build();