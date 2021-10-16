const path = require('path');
const fs = require('fs');
const fsUtils = require('./fs');
const fsReadUtils = require('./file-reader');
const childProcess = require('child_process');
const logUtils = require('./log');

function log(msg) {
    logUtils.success(msg);
}

function getBasePath() {
    return path.join(__dirname, './../../note');
}

function getBuildPath() {
    let basePath = getBasePath();
    let distPath = path.join(basePath, 'dist');
    return distPath;
}

function getInjectScript() {
    let scriptPath = path.join(getBasePath(), './note-script.js');
    let jsContent = fs.readFileSync(scriptPath, { encoding: 'utf-8' });
    return `<script>${jsContent}</script>`
}

const fileEncoding = 'utf-8';

function getMarkDownTitle(filePath) {
    let fileContent = fs.readFileSync(filePath, { encoding: fileEncoding });
    let titleReg = /^#+\s+(.*)\n?/;
    let execResult = titleReg.exec(fileContent);
    if (execResult) {
        return execResult[1];
    }
}

const buildTs = new Date().getTime();

function buildNoteFile(filePath, noteList) {
    log(`Start to build '${filePath}'...`);
    let fileName = fsUtils.getFileNameFromPath(filePath) || 'note';
    let fileTitle = getMarkDownTitle(filePath);

    noteList.push({
        sourceFilePath: path.relative(path.resolve(__dirname, '../..'), filePath),
        link: `/note/dist/${fileName}.html`,
        name: fileTitle
    });

    let cmdStr = `npx markdown ${filePath} -f gfm --highlight -t "${fileTitle}" -s /note/note.css?ts=${buildTs}`;
    log(`Build command is ${cmdStr}`);
    let result = childProcess.execSync(cmdStr).toString('utf-8');
    let postProcessResult = result.replace(/&lt;br&gt;/g, '<br>').replace(/&lt;br\/&gt;/g, '<br/>');

    postProcessResult = postProcessResult.replace('</head>', `<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"></head>`)
    postProcessResult = postProcessResult.replace('</head>', `<link rel="shortcut icon" href="/ico.png"></head>`)

    let injectJSStr = getInjectScript();
    if (injectJSStr) {
        postProcessResult = postProcessResult.replace('<body>', `<body>${getInjectScript()}`)
    }

    fs.writeFileSync(getBuildPath() + `/${fileName}.html`, postProcessResult, {
        encoding: fileEncoding
    });
    log('Build Successfully!')
}

/**
 * 
 * @returns 
 */
function getNoteListFromJsonFile() {
    let jsonFilePath = path.resolve(getBuildPath(), 'notes.json');
    fsReadUtils.readToJsonSync(jsonFilePath);
}

/**
 * 
 * @param {*} buildNoticeList 
 * @param {*} isPartBuild 
 */
function updateNotesJsonFile(buildNoticeList, isPartBuild) {
    if (buildNoticeList && buildNoticeList.length) {
        let noteListForWrite;
        //
        if (isPartBuild) {
            let oldNoteList = getNoteListFromJsonFile();
            noteList.forEach((noticeItem) => {
                let noteInOldList = oldNoteList.find(item => {
                    return item.sourceFilePath === noticeItem.sourceFilePath;
                })
                if (!noteInOldList) {
                    noteInOldList.push(noticeItem);
                }
            });

            noteListForWrite = oldNoteList;

        } else {
            noteListForWrite = buildNoticeList;
        }


        let listStrForWrite = JSON.stringify(noteListForWrite);
        let buildPath = getBuildPath();
        fs.writeFileSync(buildPath + '/notes.json', listStrForWrite, {
            encoding: fileEncoding
        });
        log('Write notelist Successfully!')
    }
}


module.exports = {
    buildNoteFile,
    updateNotesJsonFile,
}