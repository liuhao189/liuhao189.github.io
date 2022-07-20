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

// class MyDB extends Dexie {
//   // folders!: Dexie.Table<any>;

//   constructor() {
//     super('MyAppDB');
//     this.version(1).stores({
//       folders: '++id,&path'
//     });
//     // this.folders = this.table('folders');
//   }
// }

// const myDB = new MyDB();
// //@ts-ignore
// const Folder = myDB.folders.defineClass({
//   id: Number,
//   path: String,
//   desc: String
// });

// Folder.prototype.save = function () {
//   //@ts-ignore
//   return myDB.folders.put(this);
// }


// class Folder {
//   path!: string
//   desc!: string;

//   save() {
//     return myDB.folders.put(this);
//   }
// }

// myDB.folders.mapToClass(Folder);

import Dexie, { ObservabilitySet, Table } from "dexie";


interface Friend {
  id?: number;
  name: string;
  age: number;
  tags: string[];
}

interface Logger {
  id?: number;
  messgae: string;
  date: number;
}

interface Pet {
  id?: number;
  name: string;
}

interface Car {
  id?: number;
  brand: string;
}

class FriendDataBase extends Dexie {
  public friends!: Dexie.Table<Friend, number>;
  public logger!: Dexie.Table<Logger, number>;
  public pets!: Dexie.Table<Pet, number>;
  public cars!: Dexie.Table<Car, number>;

  public constructor() {
    super('FriendDataBase', { chromeTransactionDurability: 'relaxed' });
    this.version(4).stores({
      friends: '++id,name,age,*tags',
      logger: '++id',
      pets: '++id',
      cars: '++id,brand'
    });
  }
}

const db = new FriendDataBase();
// db.friends.hook('creating', (...args) => {
//   console.log(args);
// })
// console.time('Default');
// for (let i = 0; i < 10000; ++i) {
//   db.friends.add({
//     name: 'Hao',
//     age: 21,
//     tags: ['Good Person']
//   }).then(res => {
//     // console.log(res);
//   })
// }
// console.timeEnd('Default');
// db.friends.hook('reading', (obj) => {
//   console.log('reading', obj);
// });

// console.time(`Where-Time`);
// db.friends.where('id').equals(1).toArray().then(res => {
//   console.log(res);
//   console.timeEnd(`Where-Time`);
// });

// console.time('Between-time');
// db.friends.where({ name: 'Hao', id: 1 }).toArray().then(res => {
//   console.timeEnd(`Between-time`)
//   console.log(res);
// });

// class LoggerClass {
//   log(msg: string) {
//     return db.transaction('rw!', db.logger, function () {
//       db.logger.add({ messgae: msg, date: new Date().getTime() as number });
//     })
//   }
// }


// const logger = new LoggerClass();
// db.transaction('rw', db.friends, () => {
//   logger.log(`Now adding hillary...`);
//   return db.friends.add({ name: 'Liu', age: 32, tags: ['Boy'] }).then(() => {
//     logger.log("Hillary wa added!");
//   });
// }).then(() => {
//   logger.log(`Transcation successfully commited!`)
// })


// db.transaction('rw', db.friends, () => {
//   db.transaction('r!', db.pets, () => {
//     //使用了!，并行事务
//   });
//   // Dexie.ignoreTranscation也可以创建并行的事务。
//   Dexie.ignoreTransaction(() => {
//     db.pets.toArray((res) => {
//       console.log(res);
//     })
//   });
// })

// function logCars() {
//   return db.transaction('r', db.cars, () => {
//     db.cars.where('brand').equals('Wu-Ling').each(car => {
//       console.log(car);
//     });

//     db.cars.where('brand').equals('Jin-Bei').each(car => {
//       console.log(car);
//     });
//   })
// }

// Dexie.on('storagemutated', (changeParts: ObservabilitySet) => {
//   console.log(`Change-Parts`, changeParts);
// });
db.use({
  stack: 'dbcore',
  name: 'my-middle',
  create(downLevelDatabase) {
    return {
      ...downLevelDatabase,
      table(tableName) {
        const downlevelTable = downLevelDatabase.table(tableName);
        return {
          ...downlevelTable,
          mutate: req => {
            const myRequest = { ...req };
            console.log(myRequest);
            return downlevelTable.mutate(myRequest).then(res => {
              const myResponse = { ...res };
              console.log(myResponse);
              return myResponse;
            })
          }
        }
      },
    }
  }
})

console.time('Into-Car');
db.transaction('rw', db.cars, () => {
  return db.cars.bulkAdd([{ brand: 'Wu-Ling' }, { brand: 'Jin-Bei' }]);
}).then(res => {
  console.timeEnd(`Into-Car`);
  // logCars();
});


