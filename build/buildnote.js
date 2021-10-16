const path = require('path');
const fs = require('fs');
const glob = require('glob');
const chalk = require('chalk');
const buildUtils = require('./utils/build');

function log(msg) {
    console.log(chalk.green(msg));
}

const fileEncoding = 'utf8';

function getBasePath() {
    return path.join(__dirname, './../note');
}

const blackFileArr = [
    'note/private-folder'
];

function getSourceFiles() {
    let files = glob.sync(getBasePath() + '/**/*.md');
    if (blackFileArr && blackFileArr.length) {
        files = files.filter(filePath => {
            let fileInBlackList = blackFileArr.some((blackPath) => {
                return filePath.includes(blackPath);
            })
            return !fileInBlackList;
        })
    }
    log(`Files:${files.join('\r\n')}`);
    return files;
}

function getBuildTargetNotes() {
    let argv = process.argv || [];
    log(argv);
    if (!argv) {
        return null;
    }
    //
    try {
        let argvArr = argv.slice(2) || [];
        let noteArgvArr = argvArr.filter(argvItem => {
            return argvItem.startsWith('--note');
        });

        if (!noteArgvArr || !noteArgvArr.length) {
            return null;
        }

        return noteArgvArr.map(noteArgvItem => {
            let parts = noteArgvItem.split('=');
            if (parts && parts.length >= 2) {
                let notePath = parts[1];
                if (!notePath) return null;
                return {
                    path: path.join(process.cwd(), notePath.replace(/^\s+|\s+$/g, ''))
                }
            }
        })

    } catch (ex) {
        console.error(ex);
        return null;
    }
}

function build() {

    let targetNotes = getBuildTargetNotes();
    let files;
    log(`TargetNotes:${JSON.stringify(targetNotes)}`)

    let targetNotesMode = !!(targetNotes && targetNotes.length);

    if (targetNotesMode) {
        files = targetNotes;
    } else {
        files = getSourceFiles();
    }

    const noteList = [];
    files.forEach((file) => {
        if (!file) return;
        buildUtils.buildNoteFile(targetNotesMode ? file.path : file, noteList);
    });

    buildUtils.updateNotesJsonFile(noteList, targetNotesMode);
}

build();