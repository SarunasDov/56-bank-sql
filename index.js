const db = require('./db');
const Users = require('./Users');
const Accounts = require('./Accounts');
const History = require('./History');

const app = {}

app.init = async () => {
    // prisijungti prie duomenu bazes
    const conn = await db.init({
        host: 'localhost',
        user: 'root',
        database: 'bank',
    });

    // LOGIC BELOW

    console.log('');
    const user1 = await Users.create(conn, 'Ona', 'Onaityte');
    console.log(user1);
    const user2 = await Users.create(conn, 'Antanas', 'Antanaitis');
    console.log(user2);
    const user3 = await Users.create(conn, 'Jonas', 'Jonaitis');
    console.log(user3);
    const user4 = await Users.create(conn, 'Maryte', 'Marytaite');
    console.log(user4);
    const user5 = await Users.create(conn, 'Birute', 'Birutaite');
    console.log(user5);
    const user6 = await Users.create(conn, 'Juze', 'Juzytis');
    console.log(user6);

    console.log('');
    const userupdate1 = await Users.updateSurnameById(conn, 1, 'Pertaitiene');
    console.log(userupdate1);

    console.log('');
    const account1 = await Accounts.create(conn, 1);
    console.log(account1);
    const account2 = await Accounts.create(conn, 2);
    console.log(account2);
    const account3 = await Accounts.create(conn, 3);
    console.log(account3);
    const account4 = await Accounts.create(conn, 4);
    console.log(account4);
    const account5 = await Accounts.create(conn, 5);
    console.log(account5);


    console.log('');
    const add1 = await Accounts.addAmountById(conn, 1, 500);
    console.log(add1);
    const add2 = await Accounts.addAmountById(conn, 2, 1000);
    console.log(add2);
    const add3 = await Accounts.addAmountById(conn, 5, 5000);
    console.log(add3);
    //const add4 = await Accounts.addAmountById(conn, 55, 5000);
    //console.log(add4);

    console.log('');
    const reduce1 = await Accounts.reduceAmountById(conn, 1, 100);
    console.log(reduce1);
    //const reduce2 = await Accounts.reduceAmountById(conn, 3, 100);
    //console.log(reduce2);

    console.log('');
    //const transfer1 = await Accounts.transfer(conn, 9, 1, 500);
    //console.log(transfer1);
    //const transfer2 = await Accounts.transfer(conn, 1, 9, 200);
    //console.log(transfer2);
    const transfer3 = await Accounts.transfer(conn, 1, 7, 300);
    console.log(transfer3);
    const transfer4 = await Accounts.transfer(conn, 7, 9, 100);
    console.log(transfer4);

    console.log('');
    //const delete1 = await Accounts.delete(conn, 4);
    //console.log(delete1);
    //const delete2 = await Accounts.delete(conn, 1);
    //console.log(delete2);
    //const delete3 = await Accounts.delete(conn, 8);
    //console.log(delete3);

    console.log('');
    //const userdelete1 = await Users.delete(conn, 2);
    //console.log(userdelete1);
    //const userdelete2 = await Users.delete(conn, 6);
    //console.log(userdelete2);
    //const userdelete3 = await Users.delete(conn, 5);
    //console.log(userdelete3);

    console.log('');
    await History.dbReadingLog(conn);
    //console.log(history);


}

app.init();

module.exports = app;