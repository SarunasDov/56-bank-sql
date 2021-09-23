const Validation = require('./Validations');
const Accounts = require('./Accounts');
const History = require('./History');
const Users = {};

/**
* Vartotojo itrukimas i duombaze.
* @param {Object} connection   Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
* @param {string} userFirstname  vartotojo vardas.
* @param {string} userLastname  vartotojo pavarde.
* @param {number} userId vartotojo ID.
* @returns {Promise<string>} Tekstas nurodo vartotojo duomenis.
*/
Users.create = async (connection, userFirstname, userLastname) => {
    //VALIDATIONS
    if (!Validation.isText(userFirstname)) {
        return `Parametras turi buti ne tuscias tekstas!`;
    }
    if (!Validation.isText(userLastname)) {
        return `Parametras turi buti ne tuscias tekstas!`;
    }

    const sql = 'INSERT INTO `users`\
                 (`id`, `firstname`, `lastname`)\
                 VALUES (NULL, "' + userFirstname + '", "' + userLastname + '")';
    const [rows] = await connection.execute(sql);
    //console.log(rows);
    const holderId = rows.insertId;   // randam userId
    const account = await Accounts.create(connection, holderId, 0);  // userId perduodamas i accounts lentele
    const resp = account;
    return resp;
}

/**
 * Autoriaus paieska pagal id ir viena papildoma parametra. 
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} userId vartotojo ID.
 * @param {string} userLastname vartotojo pavarde.
 * @returns { Promise < string >} Tekstas, skelbiantis kokia savybe, pagal duota ID, buvo atnaujinta i kokia verte.
 */
Users.updateSurnameById = async (connection, userId, userLastname) => {
    //VALIDATIONS
    if (!Validation.IDisValid(userId)) {
        return `Vartotojo ID turi buti teigiamas sveikasis skaicius!`;
    }
    if (!Validation.isText(userLastname)) {
        return `Parametras turi buti ne tuscias tekstas!`;
    }

    const sql = 'UPDATE users\
                 SET lastname = "' + userLastname + '"\
                 WHERE users.id =' + userId;
    [rows] = await connection.execute(sql);
    const updatedSurnameById = `User with ID ${userId} has a new surname now as "${userLastname}."`
    return updatedSurnameById;
}

/**
 * Vartotojo paieska pagal id.
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} userId vartotojo ID.
 * @returns { Promise < string >} Tekstas, skelbiantis kokia savybe, pagal duota ID, buvo atnaujinta i kokia verte.
 */
Users.getUserById = async (connection, userId) => {
    //VALIDATIONS
    if (!Validation.IDisValid(userId)) {
        return `Vartotojo ID turi buti teigiamas sveikasis skaicius!`;
    }

    const sql = 'SELECT *\
                 FROM `users`\
                 WHERE `id`='+ userId;

    const [rows] = await connection.execute(sql);

    if (rows.lenght === 0) {
        console.log(`Such user doest exist!`);
        return {}
    }
    return rows[0];
}

/**
 * Vartotojo trynimas pagal id. 
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} userId vartotojo ID.
 * @returns { Promise < string >} Tekstas, skelbiantis kokia savybe, pagal duota ID, buvo atnaujinta i kokia verte.
 */
Users.delete = async (connection, userId) => {
    //VALIDATIONS
    if (!Validation.IDisValid(userId)) {
        return `Vartotojo ID turi buti teigiamas sveikasis skaicius!`;
    }
    //tikrinam ar egzistuoja vartotojas sistemoje
    if (!(await Users.getUserById(connection, userId)).id) {
        return `Vartotojas neegzistuoja pasalinti negalima!`
    }

    const sql = 'SELECT `firstname`, `lastname`,\
                        `accounts`.`balance`,\
                        `accounts`.`id` as accountId\
                FROM `users`\
                LEFT JOIN `accounts`\
                    ON `accounts`.`userId` = `users`.`id`\
                    WHERE `users`.`id` =' + userId;
    let [rows] = await connection.execute(sql);
    const { firstname, lastname } = rows[0];

    // tikrinam ar bent vienoje vartotojo saskaitoje yra pinigu

    for (let { accountId } of rows) {
        const status = await Accounts.delete(connection, accountId);

        // jei saskaitos be likucio, tada trinam
        let sql1 = 'DELETE\
            FROM `users`\
            WHERE `users`.`id` =' + userId;
        [rows1] = await connection.execute(sql1);
        return `User ${firstname} ${lastname} ID ${userId} has been removed!`
    }
}
module.exports = Users;