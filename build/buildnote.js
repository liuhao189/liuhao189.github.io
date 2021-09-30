const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const chalk = require('chalk');

function log(msg) {
    console.log(chalk.green(msg));
}

const fileEncoding = 'utf8';

function getBasePath() {
    return path.join(__dirname, './../note');
}

function getBuildPath() {
    let basePath = getBasePath();
    let distPath = path.join(basePath, 'dist');
    return distPath;
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

function getInjectScript() {
    let scriptPath = path.join(getBasePath(), './note-script.js');
    let jsContent = fs.readFileSync(scriptPath, { encoding: 'utf-8' });
    return `<script>${jsContent}</script>`
}

function getMarkDownTitle(filePath) {
    let fileContent = fs.readFileSync(filePath, { encoding: fileEncoding });
    let titleReg = /^#+\s+(.*)\n?/;
    let execResult = titleReg.exec(fileContent);
    if (execResult) {
        return execResult[1];
    }
}

const buildTs = new Date().getTime();

function buildFile(filePath, noteList) {
    log(`Start to build '${filePath}'...`);
    let fileInfo = getFileNameInfo(filePath);
    let fileName = fileInfo && fileInfo.fileName || 'note';
    let fileTitle = getMarkDownTitle(filePath);
    noteList.push({
        sourceFilePath: path.relative(path.resolve(__dirname, '..'), filePath),
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

function getBuildTargetNotes() {
    console.log(process);
    let argv = process.env.npm_config_argv;
    log(argv);
    if (!argv) {
        return null;
    }
    //
    try {
        argvObj = JSON.parse(argv);
        let originalArgvArr = argvObj.original || [];
        let noteArgvArr = originalArgvArr.filter(argvItem => {
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
/**
 * 
 * @returns 
 */
function getNoteListFromJsonFile() {
    let jsonFilePath = path.resolve(getBuildPath(), 'notes.json');
    let noteContent = fs.readFileSync(jsonFilePath, { encoding: 'utf-8' });
    return JSON.parse(noteContent);
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
        buildFile(targetNotesMode ? file.path : file, noteList);
    });
    if (noteList && noteList.length) {
        let noteListForWrite;
        if (targetNotesMode) {
            let currentNoteList = getNoteListFromJsonFile();
            noteList.forEach((noticeItem) => {
                let noteInCurrentList = currentNoteList.find(item => {
                    return item.sourceFilePath === noticeItem.sourceFilePath;
                })
                if (!noteInCurrentList) {
                    currentNoteList.push(noticeItem);
                }
            });
            noteListForWrite = currentNoteList;
        } else {
            noteListForWrite = noteList;
        }

        let listStrForWrite = JSON.stringify(noteListForWrite);
        let buildPath = getBuildPath();
        fs.writeFileSync(buildPath + '/notes.json', listStrForWrite, {
            encoding: fileEncoding
        });
        log('Write notelist Successfully!')
    }
}

build();