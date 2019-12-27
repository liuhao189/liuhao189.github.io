const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');

let basePath = path.join(__dirname, './../note');

let distPath = path.join(basePath, 'dist');

let subPath = 'test.md';

const filePath = path.join(basePath, subPath);

const distFilePath = path.join(distPath, 'test.html');


let cmdStr = `npx markdown ${filePath} -f 'gfm' --highlight -s '/note/note.css'`;

console.log(cmdStr);

let result = childProcess.execSync(cmdStr);

fs.writeFileSync(distFilePath, result, { encoding: 'utf8' });