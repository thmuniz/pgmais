import mysqlWrapper from '../database/mysqlWrapper'

class User {

    /**
     *
     *  Insere um registro na tabela users
     * @static
     * @param {*} {connection, data}
     * @returns
     * @memberof User
     */
    static async insert({connection, data}) {
        try {
            let insertUser = await mysqlWrapper.createTransactionalQuery({
                query: `INSERT INTO users SET ?`,
                params: data,
                connection
            });
            let user = this.findByID({id: insertUser.insertId, connection});
            return user;
        }catch(e) {
            throw e;
        }
    }

    /**
     * Busca por um registro na tabela users através do seu ID
     *
     * @static
     * @param {*} {id, connection}
     * @returns
     * @memberof User
     */
    static async findByID({id, connection}) {
        try {
            let user = await mysqlWrapper.createTransactionalQuery({
                query: `SELECT users.* FROM users WHERE _id = ?`,
                params: [id],
                connection
            });
            return user.shift();
        }catch(e) {
            throw e;
        }
    }
}
export default User