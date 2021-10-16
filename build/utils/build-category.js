const readFileUtils = require('./file-reader');
const writeFileUtils = require('./file-writer');
const path = require('path');

function getNoteBasePath() {
    return path.resolve(process.cwd(), 'note');
}

function getNoteCategoryList() {
    let filePath = path.resolve(getNoteBasePath(), 'note-category.json');
    return readFileUtils.readToJsonSync(filePath);
}

function getAllNoteList() {
    let filePath = path.resolve(getNoteBasePath(), 'dist/notes.json');
    return readFileUtils.readToJsonSync(filePath);
}

function getCategoryJsonPath(categoryName) {
    return path.resolve(getNoteBasePath(), `dist/${categoryName}.json`);
}

function generateCategoryJson(categoryList, notesList) {
    if (!categoryList || !notesList) {
        console.log(`categoryList or  notesList is null or empty!`)
        return;
    }

    categoryList.forEach(categoryItem => {
        if (!categoryItem.path) return;
        let categoryNotePaths = categoryItem.path.map(path => {
            return `note/${path}/`
        });

        let categoryNotes = notesList.filter(noteItem => {
            if (noteItem.inCategory) {
                return false;
            }
            let sourceFilePath = noteItem.sourceFilePath;
            let noteInCategory = !!categoryNotePaths.find(categoryPath => {
                return sourceFilePath.includes(categoryPath);
            });
            if (noteInCategory) {
                noteItem.inCategory = true;
                return noteItem;
            }
        });

        if (!categoryNotes || !categoryNotes.length) return;

        let categoryJsonPath = getCategoryJsonPath(categoryItem.distFileName);

        writeFileUtils.writeFileSync(categoryJsonPath, JSON.stringify(categoryNotes));

        console.log(`write ${categoryItem.name} successfully!`)
    })
}

function buildNoteCategory() {
    console.log(`build-note-category start...`)
    let categoryList = getNoteCategoryList();
    console.log(`categoryList:${JSON.stringify(categoryList)}`);
    let notesList = getAllNoteList();
    console.log(`notesList:length-${notesList.length}`);
    generateCategoryJson(categoryList, notesList);
    console.log(`build-note-category successfully!`)
}

module.exports = {
    buildNoteCategory
};