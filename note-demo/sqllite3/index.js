const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

db.on('trace', (sql) => {
    console.log(`running sql ${sql}.`);
});
db.on('profile', (sql, time) => { 
    console.log(`runing sql ${sql} time is ${time}`);
});

db.serialize(() => {

    db.run("CREATE TABLE lorem (info TEXT)");

    const stmt = db.prepare("INSERT INTO lorem VALUES (?)");

    for (let i = 0; i < 100; ++i) {
        stmt.run("Ipsum " + i);
    }

    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
        console.log(row.id + ": " + row.info)
    })
});

