#!/usr/bin/env node
const path = require('path');
const glob = require('glob')
const fs = require('fs');

const distPath = path.join(__dirname, './../dist')
const publishPath = `https://img-oss.yunshanmeicai.com/supply/mobile-im`;
const fileEncoding = 'utf-8';

function getSWTempalteContent() {
  let swTemplatePath = path.join(__dirname, './../src/sw-template.js')
  return fs.readFileSync(swTemplatePath, { encoding: fileEncoding }).toString();
}

function getCachePatterns() {
  const cacheFolders = ['js', 'fonts', 'css', 'img'];
  return cacheFolders.map(folderName => {
    return `${distPath}/${folderName}/*`
  })
}

function getUrlShouleCacheArray() {
  const urlShouldCacheArr = [];
  let cachePatterns = getCachePatterns();

  cachePatterns.forEach(pattern => {
    const files = glob.sync(pattern)
    files.forEach(absoluteFilePath => {
      urlShouldCacheArr.push(absoluteFilePath.replace(distPath, publishPath))
    })
  })
  return urlShouldCacheArr;
}

function writeSWFile(fileContent) {
  let writePath = path.join(distPath, 'sw.js');
  if (fs.existsSync(writePath)) {
    fs.unlinkSync(writePath)
  }
  fs.writeFileSync(writePath, fileContent, { encoding: fileEncoding });
}

function getNewSWFileContent() {
  const urlShouldcacheArr = getUrlShouleCacheArray();
  const nowTs = new Date().getTime();
  const templateContent = getSWTempalteContent();
  const urlShouldCacheStr = `let urlsShouldCache = ${JSON.stringify(urlShouldcacheArr)};`;
  const insertStr = `let version = ${nowTs};${urlShouldCacheStr}`;
  const newFileContent = templateContent.replace('//$inject-placeholder', insertStr);
  return newFileContent;
}

function main() {
  try {
    let newFileContent = getNewSWFileContent();
    writeSWFile(newFileContent)
  } catch (ex) {
    console.error(ex)
  }
}


main();

