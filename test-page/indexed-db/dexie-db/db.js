// import Dexie from 'dexie';
// export interface Friend {
//   id?: number;
//   name: string;
//   age: number;
// }
// export class MyDexie extends Dexie {
//   friends: Dexie.Table<Friend, number>;
//   constructor() {
//     super('MyDataBae');
//     this.version(1).stores({
//       friends: '++id,name,age'
//     });
//     this.friends = this.table('friends');
//   }
// }
// declare const window: Window & { myDB: MyDexie }
// export const db = new MyDexie();
// window.myDB = db;
// window.addEventListener('load', () => {
//   const btnAdd = document.querySelector('#btnAdd');
//   btnAdd?.addEventListener('click', async () => {
//     try {
//       const txtName = document.querySelector('#txtName') as HTMLInputElement;
//       const txtAge = document.querySelector('#txtAge') as HTMLInputElement;
//       if (!txtName?.value || !txtAge?.value) {
//         alert(`请输入姓名和年龄！`)
//         return;
//       }
//       //@ts-ignore
//       let db = window.myDB;
//       const addId = await db.friends.add({ name: txtName.value, age: Number.parseInt(txtAge?.value) });
//       console.log(`New Friend Id is ${addId}`);
//     }
//     catch (ex) {
//       console.error(ex);
//     }
//   })
// })
// function queryAllFriends() {
//   window.myDB.friends.toArray().then(res => { console.log(res); })
// }
// async function queryWithAgeParams(minAge: number, maxAge: number): Promise<any> {
//   try {
//     const friends = await window.myDB.friends.where('age').between(minAge, maxAge).toArray();
//     return friends;
//   } catch (ex) {
//     console.error(ex);
//   }
// }
// import Dexie from 'dexie';
// interface Friend {
//   name: string;
//   age: number;
//   id?: number;
// }
// class MyDexieDb extends Dexie {
//   friends: Dexie.Table<Friend, number>;
//   gameSessions: Dexie.Table<number, number>;
//   constructor() {
//     super('MyDataBase')
//     this.version(1).stores({
//       friends: '++id,name,age,*tags',
//       gameSessions: 'id,score'
//     });
//     this.friends = this.table('friends');
//     this.gameSessions = this.table('gameSessions');
//   }
// }
// interface Book {
//   id: number;
//   name: string;
//   author: string;
//   categories: Array<string>;
// }
// class MyBookDb extends Dexie {
//   books: Dexie.Table<Book, number>;
//   constructor() {
//     super('BookDB');
//     this.version(1).stores({
//       books: 'id,author,name,*categories'
//     });
//     this.books = this.table('book');
//   }
//   addBook(bookItem: Book) {
//     this.books.put(bookItem);
//   }
//   queryBookByCategory(category: string) {
//     return this.books.where('categories').equals(category).toArray();
//   }
//   queryBooksByMultiCategory(categoryArr: Array<string>) {
//     return this.books.where('categories').anyOf(...categoryArr).distinct().toArray();
//   }
// }
// const db = new MyBookDb();
// db.addBook({
//   id: 1,
//   name: "Under the Demo",
//   author: "Stephen King",
//   categories: ['sci-fi', 'thriller']
// });
// db.queryBookByCategory('sci-fi').then(res => {
//   console.log(`queryBookByCategory`, res);
// });
// db.queryBooksByMultiCategory(['sci-fi', 'thriller']).then(res => {
//   console.log(`queryBooksByMultiCategory`, res);
// })
// interface Person {
//   id: number;
//   firstName: string;
//   lastName: string;
// }
// class MyPeopleDb extends Dexie {
//   persons: Dexie.Table<Person, number>;
//   constructor() {
//     super('PeopleDB');
//     this.version(2).stores({
//       personsNew: '[firstName+lastName]'
//     });
//     this.persons = this.table('personsNew');
//   }
//   addPerson(personItem: Person) {
//     this.persons.put(personItem);
//   }
//   queryPersonByName(nameArr: Array<string>) {
//     return this.persons.where('[firstName+lastName]').equals(nameArr).toArray();
//   }
// }
// const db = new MyPeopleDb();
// db.addPerson({
//   id: 1,
//   firstName: "White",
//   lastName: "King",
// });
// db.addPerson({
//   id: 2,
//   firstName: "White",
//   lastName: "Queen",
// })
// db.addPerson({
//   id: 3,
//   firstName: "Black",
//   lastName: "One"
// })
// // db.persons.where({ firstName: 'White', lastName: 'Queen' }).toArray().then(res => {
// //   console.log(`res is `, res);
// // });
// // db.persons.where('[firstName+lastName]').equals(['White', 'Queen']).toArray().then(res => {
// //   console.log(`res is `, res);
// // });
// // db.persons.where('[firstName+lastName]').between(['White', Dexie.minKey], ['White', Dexie.maxKey]).toArray().then((res) => {
// //   console.log(`res is `, res);
// // })
// // db.persons.where('firstName').equals("White").toArray().then(res => {
// //   console.log(`res is `, res);
// // });
// // db.persons.where('[firstName+lastName]').anyOf([['White', 'King'], ['White', 'Queen']]).toArray().then(res => {
// //   console.log(`res is `, res);
// // });
// db.persons.where('[firstName+lastName]').between(['W', ''], ['Z', '']).toArray().then(res => {
//   console.log(res);
// });
// import Dexie from 'dexie';
// class MyDB extends Dexie {
//   friends: Dexie.Table<{ id?: number, firstName: string, lastName: string; yearOfBirth: number, tags: Array<string> }, number>;
//   constructor() {
//     super('MyDB');
//     this.version(2).stores({
//       friends: '++id,[firstName+lastName],yearOfBirth,*tags'
//     });
//     this.friends = this.table(`friends`);
//   }
// }
// const myDB = new MyDB();
// class Friend {
//   id!: number;
//   firstName!: string;
//   lastName!: string;
//   yearOfBirth!: number;
//   tags!: Array<string>;
//   save() {
//     return myDB.friends.put(this);
//   }
//   get age() {
//     return (new Date().getFullYear() - this.yearOfBirth);
//   }
// }
// myDB.friends.mapToClass(Friend);
// import Dexie from 'dexie';
class MyDB extends Dexie {
    // folders!: Dexie.Table<any>;
    constructor() {
        super('MyAppDB');
        this.version(1).stores({
            folders: '++id,&path'
        });
        // this.folders = this.table('folders');
    }
}
const myDB = new MyDB();
//@ts-ignore
const Folder = myDB.folders.defineClass({
    id: Number,
    path: String,
    desc: String
});
Folder.prototype.save = function () {
    //@ts-ignore
    return myDB.folders.put(this);
};
// class Folder {
//   path!: string
//   desc!: string;
//   save() {
//     return myDB.folders.put(this);
//   }
// }
// myDB.folders.mapToClass(Folder);
