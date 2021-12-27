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
class MyPeopleDb extends Dexie {
    constructor() {
        super('PeopleDB');
        this.version(2).stores({
            personsNew: '[firstName+lastName]'
        });
        this.persons = this.table('personsNew');
    }
    addPerson(personItem) {
        this.persons.put(personItem);
    }
    queryPersonByName(nameArr) {
        return this.persons.where('[firstName+lastName]').equals(nameArr).toArray();
    }
}
const db = new MyPeopleDb();
db.addPerson({
    id: 1,
    firstName: "White",
    lastName: "King",
});
db.addPerson({
    id: 2,
    firstName: "White",
    lastName: "Queen",
});
db.addPerson({
    id: 3,
    firstName: "Black",
    lastName: "One"
});
// db.persons.where({ firstName: 'White', lastName: 'Queen' }).toArray().then(res => {
//   console.log(`res is `, res);
// });
// db.persons.where('[firstName+lastName]').equals(['White', 'Queen']).toArray().then(res => {
//   console.log(`res is `, res);
// });
// db.persons.where('[firstName+lastName]').between(['White', Dexie.minKey], ['White', Dexie.maxKey]).toArray().then((res) => {
//   console.log(`res is `, res);
// })
// db.persons.where('firstName').equals("White").toArray().then(res => {
//   console.log(`res is `, res);
// });
// db.persons.where('[firstName+lastName]').anyOf([['White', 'King'], ['White', 'Queen']]).toArray().then(res => {
//   console.log(`res is `, res);
// });
