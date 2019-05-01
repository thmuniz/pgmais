import mysqlWrapper from '../database/mysqlWrapper'


class Client {

    /**
     * Insere um registro na tablea clients
     *
     * @static
     * @param {*} {connection, data} conexão e payload
     * @returns
     * @memberof Client
     */
    static async insert({connection, data}) {
        try {
            let insertUser = await mysqlWrapper.createTransactionalQuery({
                query: `INSERT INTO clients SET ?`,
                params: this.clientAsDBFormat(data),
                connection
            })
            let user = this.findByID({id: insertUser.insertId, connection})
            return user
        }catch(e) {
            throw e
        }
    }

    /**
     * Recupera um registro na tabela clients através do seu ID
     *
     * @static
     * @param {*} {id, connection} id do client, conexão
     * @returns
     * @memberof Client
     */
    static async findByID({id, connection}) {
        try {
            let client = await mysqlWrapper.createTransactionalQuery({
                query: `SELECT clients.* FROM clients WHERE _id = ?`,
                params: [id],
                connection
            })
            return this.clientToJSON(client.shift())
        }catch(e) {
            throw e
        }
    }

    /**
     *
     * Transforma o objeto client no padrão JSON
     * @static
     * @param {*} client - objeto client
     * @returns
     * @memberof Client
     */
    static clientToJSON(client) {
        return {
            _id: client._id,
            name: client.name,
            CEP: client.CEP,
            data_sent: client.data_sent,
            address: {
                district: client.district,
                street: client.street,
                state: client.state
            }
        }
    }

    /**
     *  Transforma um json client em um json padrão banco de dados
     *
     * @static
     * @param {*} client
     * @returns
     * @memberof Client
     */
    static clientAsDBFormat(client) {
        return {
            name: client.name,
            CEP: client.CEP,
            CPF: client.CPF,
            data_sent: client.data_sent,
            district: client.address.district,
            street: client.address.street,
            state: client.address.state,
            users__id: client.users__id
        }
    }
}
export default Client