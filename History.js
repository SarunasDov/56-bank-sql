const Validation = require('./Validations');
const Accounts = require('./Accounts');
const Users = require('./Users');
const History = {};

History.dbReadingLog = async (connection, userId, accountId, income, outcome, date) => {

    const sql1 = 'INSERT INTO `history`\
                 (`id`, `userId`, `accountId`, `in`, `out`, `date`)\
                 VALUES (NULL, "' + userId + '", "' + accountId + '", "' + income + '", "' + outcome + '", "' + date + '")';

    const [rows1] = await connection.execute(sql1);
    console.log(rows1);

}


module.exports = History;