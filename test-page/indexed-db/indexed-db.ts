
// function checkIndexedDB() {
//     if (!window.indexedDB) {
//         return false;
//     }
//     return true;
// }

// let msgEl: HTMLDivElement;

// function log(msg: string) {
//     if (!msgEl) {
//         msgEl = document.querySelector('#msg') as HTMLDivElement;
//     }

//     let pEl = document.createElement('p');
//     pEl.innerText = msg;
//     msgEl.appendChild(pEl);
// }

// function openDBAsync(dbName: string, dbVersion: number, onUpgrade: (db: IDBDatabase) => void): Promise<IDBDatabase> {
//     return new Promise((resolve, reject) => {

//         let openRequest = window.indexedDB.open(dbName, dbVersion || 1);

//         openRequest.onerror = (err) => {
//             reject(err);
//         }

//         openRequest.onsuccess = () => {
//             resolve(openRequest.result);
//         }

//         openRequest.onblocked = function (ev) {
//             alert(`请关闭其它由该站点打开的标签。`)
//         }

//         openRequest.onupgradeneeded = (ev: IDBVersionChangeEvent) => {
//             //@ts-ignore
//             const db = ev.target!.result as IDBDatabase;
//             if (onUpgrade && typeof onUpgrade === 'function') {
//                 onUpgrade(db);
//             }
//             //@ts-ignore
//             const transaction = ev.target!.transaction as IDBTransaction;

//             transaction.oncomplete = () => {
//                 resolve(db);
//             }

//             transaction.onerror = (err) => {
//                 reject(err);
//             }
//         }

//     })
// }


// const CUSTOMERS_NAME = 'customers';

// function createTableAndIndexs(db: IDBDatabase) {
//     const tableConfigs = [
//         {
//             name: CUSTOMERS_NAME,
//             props: { keyPath: 'ssn' },
//             indexs: [{
//                 name: 'name',
//                 key: 'name',
//                 unique: false,
//             }, {
//                 name: 'email',
//                 key: 'email',
//                 unique: true
//             }]
//         }
//     ];

//     for (let i = 0; i < tableConfigs.length; ++i) {
//         try {
//             let currConfig = tableConfigs[i];
//             let objectStores = Array.from<string>(db.objectStoreNames || [])
//             if (objectStores.includes(currConfig.name)) {
//                 db.deleteObjectStore(currConfig.name);
//             }
//             const objStore = db.createObjectStore(currConfig.name, currConfig.props);
//             (currConfig.indexs || []).forEach(indexConfig => {
//                 objStore.createIndex(indexConfig.name, indexConfig.key, {
//                     unique: indexConfig.unique
//                 });
//             })
//         } catch (ex) {
//             console.error(`createTableAndIndexs`, ex);
//         }
//     }
// }


// function addCustomersAsync(db: IDBDatabase): Promise<void> {
//     return new Promise((resolve, reject) => {
//         const customers = [
//             { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
//             { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
//         ];

//         const transaction = db.transaction([CUSTOMERS_NAME], 'readwrite');

//         const objStore = transaction.objectStore(CUSTOMERS_NAME);
//         if (objStore.count()) {
//             resolve();
//         }
//         customers.forEach(item => {
//             objStore.add(item);
//         });

//         transaction.onerror = (err) => {
//             reject(err);
//         }

//         transaction.oncomplete = () => {
//             resolve();
//         };
//     })
// }

// // interface Window {
// //     myDB: IDBDatabase,
// // }

// function readDataFromDb(db: IDBDatabase, range: null | IDBKeyRange): Promise<Array<any>> {
//     return new Promise((resolve, reject) => {
//         const transaction = db.transaction([CUSTOMERS_NAME], "readonly");

//         const objStore = transaction.objectStore(CUSTOMERS_NAME);
//         const request = objStore.openCursor(range);

//         request.onerror = (err) => {
//             console.error(err);
//         }

//         const result: Array<any> = [];
//         request.onsuccess = (ev: Event) => {
//             //@ts-ignore
//             const cursor: IDBCursor = ev.target!.result;
//             if (cursor) {
//                 //@ts-ignore
//                 result.push(cursor!.value);
//                 cursor.continue();
//             } else {
//                 resolve(result);
//             }
//         }
//     })
// }


// async function main() {
//     if (!checkIndexedDB()) {
//         log(`Your browser doesn't support indexedDB!`)
//         return;
//     }

//     const DB_NAME = 'testDB';
//     const DB_VERSION = 7;

//     try {
//         const db = await openDBAsync(DB_NAME, DB_VERSION, createTableAndIndexs);
//         await addCustomersAsync(db);
//         window.myDB = db;

//         window.myDB.onversionchange = function (ev) {
//             alert(`A new version of this page is ready.Please reload or close this tab!`)
//         }

//     } catch (ex) {
//         console.error(`main error `, ex);
//     }

// }

// main();