const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const chalk = require('chalk');

function log(msg) {
    console.log(chalk.green(msg));
}

const fileEncoding = 'utf8';

function getBuildPath() {
    let basePath = path.join(__dirname, './../note');
    let distPath = path.join(basePath, 'dist');
    return distPath;
}

function getSourceFiles() {
    let files = glob.sync(path.join(__dirname, './../note') + '/**/*.md');
    log(`Files:${files.join('\r\n')}`);
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

function getMarkDownTitle(filePath) {
    let fileContent = fs.readFileSync(filePath, { encoding: fileEncoding });
    let titleReg = /^#+\s+(.*)\n?/;
    let execResult = titleReg.exec(fileContent);
    if (execResult) {
        return execResult[1];
    }
}

function buildFile(filePath) {
    log(`Start to build '${filePath}'...`);
    let fileInfo = getFileNameInfo(filePath);
    let fileName = fileInfo && fileInfo.fileName || 'note';
    let fileTitle = getMarkDownTitle(filePath);
    let cmdStr = `npx markdown ${filePath} -f gfm --highlight -t '${fileTitle}' -s /note/note.css`;
    log(`Build command is ${cmdStr}`);
    let result = childProcess.execSync(cmdStr);
    fs.writeFileSync(getBuildPath() + `/${fileName}.html`, result, {
        encoding: fileEncoding
    });
    log('Build Successfully!')
}

function build() {
    let files = getSourceFiles();
    files.forEach((file) => {
        buildFile(file);
    })
}

build();