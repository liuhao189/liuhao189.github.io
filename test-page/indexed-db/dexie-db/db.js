// import Dexie from "dexie";
class FriendDataBase extends Dexie {
    constructor() {
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
Dexie.on('storagemutated', (changeParts) => {
    console.log(`Change-Parts`, changeParts);
});
console.time('Into-Car');
db.transaction('rw', db.cars, () => {
    return db.cars.bulkAdd([{ brand: 'Wu-Ling' }, { brand: 'Jin-Bei' }]);
}).then(res => {
    console.timeEnd(`Into-Car`);
});
