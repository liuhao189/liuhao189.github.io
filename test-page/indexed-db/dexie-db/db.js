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
                        console.time(`Insert-Time`);
                        console.log(myRequest);
                        return downlevelTable.mutate(myRequest).then(res => {
                            const myResponse = { ...res };
                            console.log(myResponse);
                            console.timeEnd(`Insert-Time`);
                            return myResponse;
                        });
                    }
                };
            },
        };
    }
});
console.time('Into-Car');
db.transaction('rw', db.cars, () => {
    return db.cars.bulkAdd([{ brand: 'Wu-Ling' }, { brand: 'Jin-Bei' }]);
}).then(res => {
    console.timeEnd(`Into-Car`);
});
