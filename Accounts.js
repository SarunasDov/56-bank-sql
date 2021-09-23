/**
 * Kaip rasyti JSDOc'sus?
 * Link: https://jsdoc.app
 */
const Validation = require('./Validations');
const Accounts = {};

/**
* Vartotojo saskaitos sukurimas.
* @param {Object} connection   Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
* @param {number} userId vartotojo ID.
* @returns {Promise<string>} Tekstas nurodo vartotojo duomenis.
*/
Accounts.create = async (connection, userId) => {
    //VALIDATIONS
    if (!Validation.IDisValid(userId)) {
        return `Vartotojo ID turi buti teigiamas sveikasis skaicius!`;
    }

    const sql = 'INSERT INTO `accounts`\
                (`id`, `userId`,`balance`)\
                VALUES (NULL, "' + userId + '", "0")';
    const [rows] = await connection.execute(sql);

    return rows.affectedRows === 1 ? `Account created!` : `Account create failed unfortunately.`
}

/**
* Pinigu inesimas i saskaita.
* @param {Object} connection   Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
* @param {number} accountId saskaitos ID.
* @param {number} amount inesama suma.
* @returns {Promise<string>} Tekstas nurodo vartotojo duomenis.
*/
Accounts.addAmountById = async (connection, accountId, amount) => {
    //VALIDATIONS
    if (!Validation.IDisValid(accountId)) {
        return `Saskaitos ID turi buti teigiamas sveikasis skaicius!`;
    }
    if (!Validation.isValidAmount(amount)) {
        return `** Parametras turi buti teigiamas sveikasis skaicius!`;
    }

    //tikrinam, ar egzistuoja toks saskaitos numeris
    let sql = 'SELECT `id`\
               FROM accounts\
               WHERE `id` = ' + accountId;
    const [rows] = await connection.execute(sql);
    if (rows.length === 0) {
        console.log(`Neteisingas saskaitos numeris!`);
        return false;
    }

    let sql1 = 'UPDATE `accounts`\
                SET `balance` = `balance` + "' + amount + '"\
                WHERE `id` = ' + accountId;
    const [rows1] = await connection.execute(sql1);
    console.log(`Account balance has increased by value ${amount}.`);
    return true;
}

/**
* Pinigu isemimas is saskaitos.
* @param {Object} connection   Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
* @param {number} accountId saskaitos ID.
* @param {number} amount nurasoma suma.
* @returns {Promise<string>} Tekstas nurodo vartotojo duomenis.
*/
Accounts.reduceAmountById = async (connection, accountId, amount) => {
    //VALIDATIONS
    if (!Validation.IDisValid(accountId)) {
        return `Saskaitos ID turi buti teigiamas sveikasis skaicius!`;
    }
    if (!Validation.isValidAmount(amount)) {
        return `*** Parametras turi buti teigiamas sveikasis skaicius!`;
    }
    let sql = 'SELECT `balance`\
               FROM `accounts`\
               WHERE `id` =' + accountId;

    let [rows] = await connection.execute(sql);

    if (rows[0].balance < amount) {
        console.log(`Nepakankamas pinigu likutis saskaitoje!`);
        return false;
    }

    const sql1 = 'UPDATE `accounts`\
                  SET `balance` = `balance` - "' + amount + '"\
                  WHERE `id` = ' + accountId;
    const [rows1] = await connection.execute(sql1);

    if (!!rows1.affectedRows) {
        console.log(`Account balance has decreased by value ${amount}.`);
    } else {
        console.log(`Nepavyko nurasyti pinigu!`);
    }
    return !!rows1.affectedRows;
}

/**
* Pinigu pervedimas is vienos saskaitos i kita.
* @param {Object} connection   Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
* @param {number} fromAccountId is saskaitos ID.
* @param {number} toAccountId i saskaitos ID.
* @param {number} amount inesama suma.
* @returns {Promise<string>} Tekstas nurodo vartotojo duomenis.
*/
Accounts.transfer = async (connection, fromAccountId, toAccountId, amount, date) => {
    //VALIDATIONS
    if (!Validation.IDisValid(fromAccountId)) {
        return `Saskaitos ID turi buti teigiamas sveikasis skaicius!`;
    }
    if (!Validation.IDisValid(toAccountId)) {
        return `Saskaitos ID turi buti teigiamas sveikasis skaicius!`;
    }
    if (!Validation.isValidAmount(amount)) {
        return `**** Parametras turi buti teigiamas sveikasis skaicius!`;
    }

    // tikrinam ar FROM saskaitoje pakankamas pinigu likutis
    let sql = 'SELECT `balance`\
               FROM `accounts`\
               WHERE `id` =' + fromAccountId;

    let [rows] = await connection.execute(sql);

    if (rows[0].balance < amount) {
        console.log(`Nepakankamas pinigu likutis saskaitoje!`);
        return false;
    }

    //tikrinam, ar egzistuoja TO saskaitos numeris
    let sql1 = 'SELECT `id`\
                FROM accounts\
                WHERE `id` = ' + toAccountId;
    const [rows1] = await connection.execute(sql1);
    if (rows1.length === 0) {
        console.log(`Neteisingas saskaitos numeris!`);
        return false;
    }

    // darom pinigu perlaida tarp saskaitu
    const from = 'UPDATE `accounts` SET\
                 `balance` = `balance` - "' + amount + '"\
                  WHERE `accounts`.`id` = ' + fromAccountId;
    [rows2] = await connection.execute(from);

    const to = 'UPDATE `accounts` SET\
     `balance` = `balance` + "' + amount + '"\
     WHERE `accounts`.`id` = ' + toAccountId;
    [rows3] = await connection.execute(to);

    return `${amount} has been transferred.`;
}

/**
* Saskaitos istrynimas.
* @param {Object} connection   Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
* @param {number} accountId saskaitos ID.
* @returns {Promise<string>} Tekstas nurodo vartotojo duomenis.
*/
Accounts.delete = async (connection, accountId) => {
    //VALIDATIONS
    if (!Validation.IDisValid(accountId)) {
        return `Saskaitos ID turi buti teigiamas sveikasis skaicius!`;
    }

    const sql = 'SELECT `balance` FROM `accounts`\
                 WHERE `id` =' + accountId;
    const [rows] = await connection.execute(sql);
    const balance = rows[0].balance;

    if (balance > 0 || balance < 0) {
        return `Accous's ${accountId} balance is ${balance} and it cant be deleted.`;
    }
    else {
        const sql1 = 'DELETE FROM `accounts`\
                      WHERE `id` =' + accountId;
        const [rows1] = await connection.execute(sql1);
    }
    return `Account ID "${accountId}" has been removed.`;
}
module.exports = Accounts;
