const fs = require('fs');
const glob = require('glob');
const path = require('path');
const logUtils = require('./utils/log');
const fsUtils = require('./utils/fs');
const buildNoteUtils = require('./utils/build');
const buildCategoryUtils = require('./utils/build-category');

function getBasePath() {
    return path.resolve(__dirname, './../note');
}

function getFilesStatInfoSync(pattern, filterFn = () => { return false }) {
    if (!pattern) return null;
    let filePaths = glob.sync(pattern);
    let res = {};
    filePaths.forEach(filePath => {
        let filterFile = false;
        if (filterFn) {
            try {
                filterFile = filterFn(filePath);
            }
            catch (ex) {
                console.error(ex);
            }
        }
        if (filterFile) return;
        let fileName = fsUtils.getFileNameFromPath(filePath);
        let fileStat = fs.statSync(filePath);
        res[fileName] = {
            mtime: fileStat.mtime,
            fullPath: filePath
        }
    })

    return res;

}

/**
 * 获取最新的html 文件的修改信息
 * @returns 
 */
function getLastBuildInfo() {
    let buildHtmlFilePattern = getBasePath() + '/dist/*.html';
    let htmlFileInfos = getFilesStatInfoSync(buildHtmlFilePattern);
    return htmlFileInfos;
}

/**
 * 获取note文件的修改信息
 */
function getNoteInfo() {
    let notesPattern = getBasePath() + '/**/*.md';
    let noteInfos = getFilesStatInfoSync(notesPattern, (path) => {
        return path.includes(`note/private-folder`);
    });

    return noteInfos;
}

/**
 * 
 * @param {*} htmlInfos 
 * @param {*} noteInfos 
 */
function getNewNotes(noteInfoMap, htmlInfoMap) {
    let resArr = [];

    Object.keys(noteInfoMap).forEach(noteName => {
        let noteHtml = htmlInfoMap[noteName];
        let noteInfo = noteInfoMap[noteName];

        if (!noteHtml) {
            //html中不存在，没有编译
            resArr.push(noteInfo.fullPath);
            return;
        }

        let htmlMTS = new Date(noteHtml.mtime).getTime();
        let noteMTS = new Date(noteInfo.mtime).getTime();
        if (noteMTS > htmlMTS) {
            //存在更新，需要重新编译
            resArr.push(noteInfo.fullPath)
        }
    })

    return resArr;
}

function main() {
    let htmlStatInfos = getLastBuildInfo();
    let noteStatInfos = getNoteInfo();
    let newNotes = getNewNotes(noteStatInfos, htmlStatInfos);
    logUtils.success(`newNote:`)
    logUtils.success(newNotes);
    
    if (newNotes && newNotes.length) {
        let buildNoteList = [];
        newNotes.forEach(notePath => {
            buildNoteUtils.buildNoteFile(notePath, buildNoteList);
        });

        buildNoteUtils.updateNotesJsonFile(buildNoteUtils, true);

        buildCategoryUtils.buildNoteCategory();
    }

}

main();