// import Dexie from 'dexie';
class FriendDataBase extends Dexie {
    constructor() {
        super('FriendDataBase');
        this.version(1).stores({
            friends: '++id,name,age'
        });
        this.friends = this.table('friends');
    }
}
const db = new FriendDataBase();
db.transaction('rw', db.friends, async () => {
    if ((await db.friends.where({ name: 'Josephine' }).count()) === 0) {
        const id = await db.friends.add({ name: "Josephine", age: 21 });
        alert(`Addded friend with id ${id}`);
    }
    const youngFriends = await db.friends.where("age").below(25).toArray();
    console.log(`My young friends：`, youngFriends);
}).catch(err => {
    console.error(err);
});
