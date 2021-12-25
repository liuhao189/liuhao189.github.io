"use strict";
function checkIndexedDB() {
    if (!window.indexedDB) {
        return false;
    }
    return true;
}
let msgEl;
function log(msg) {
    if (!msgEl) {
        msgEl = document.querySelector('#msg');
    }
    let pEl = document.createElement('p');
    pEl.innerText = msg;
    msgEl.appendChild(pEl);
}
function openDBAsync(dbName, dbVersion, onUpgrade) {
    return new Promise((resolve, reject) => {
        let openRequest = window.indexedDB.open(dbName, dbVersion || 1);
        openRequest.onerror = (err) => {
            reject(err);
        };
        openRequest.onsuccess = () => {
            resolve(openRequest.result);
        };
        openRequest.onblocked = function (ev) {
            alert(`请关闭其它由该站点打开的标签。`);
        };
        openRequest.onupgradeneeded = (ev) => {
            //@ts-ignore
            const db = ev.target.result;
            if (onUpgrade && typeof onUpgrade === 'function') {
                onUpgrade(db);
            }
            //@ts-ignore
            const transaction = ev.target.transaction;
            transaction.oncomplete = () => {
                resolve(db);
            };
            transaction.onerror = (err) => {
                reject(err);
            };
        };
    });
}
const CUSTOMERS_NAME = 'customers';
function createTableAndIndexs(db) {
    const tableConfigs = [
        {
            name: CUSTOMERS_NAME,
            props: { keyPath: 'ssn' },
            indexs: [{
                    name: 'name',
                    key: 'name',
                    unique: false,
                }, {
                    name: 'email',
                    key: 'email',
                    unique: true
                }]
        }
    ];
    for (let i = 0; i < tableConfigs.length; ++i) {
        try {
            let currConfig = tableConfigs[i];
            let objectStores = Array.from(db.objectStoreNames || []);
            if (objectStores.includes(currConfig.name)) {
                db.deleteObjectStore(currConfig.name);
            }
            const objStore = db.createObjectStore(currConfig.name, currConfig.props);
            (currConfig.indexs || []).forEach(indexConfig => {
                objStore.createIndex(indexConfig.name, indexConfig.key, {
                    unique: indexConfig.unique
                });
            });
        }
        catch (ex) {
            console.error(`createTableAndIndexs`, ex);
        }
    }
}
function addCustomersAsync(db) {
    return new Promise((resolve, reject) => {
        const customers = [
            { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
            { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
        ];
        const transaction = db.transaction([CUSTOMERS_NAME], 'readwrite');
        const objStore = transaction.objectStore(CUSTOMERS_NAME);
        if (objStore.count()) {
            resolve();
        }
        customers.forEach(item => {
            objStore.add(item);
        });
        transaction.onerror = (err) => {
            reject(err);
        };
        transaction.oncomplete = () => {
            resolve();
        };
    });
}
function readDataFromDb(db, range) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([CUSTOMERS_NAME], "readonly");
        const objStore = transaction.objectStore(CUSTOMERS_NAME);
        const request = objStore.openCursor(range);
        request.onerror = (err) => {
            console.error(err);
        };
        const result = [];
        request.onsuccess = (ev) => {
            //@ts-ignore
            const cursor = ev.target.result;
            if (cursor) {
                //@ts-ignore
                result.push(cursor.value);
                cursor.continue();
            }
            else {
                resolve(result);
            }
        };
    });
}
async function main() {
    if (!checkIndexedDB()) {
        log(`Your browser doesn't support indexedDB!`);
        return;
    }
    const DB_NAME = 'testDB';
    const DB_VERSION = 7;
    try {
        const db = await openDBAsync(DB_NAME, DB_VERSION, createTableAndIndexs);
        await addCustomersAsync(db);
        window.myDB = db;
        window.myDB.onversionchange = function (ev) {
            alert(`A new version of this page is ready.Please reload or close this tab!`);
        };
    }
    catch (ex) {
        console.error(`main error `, ex);
    }
}
main();
