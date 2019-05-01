import mysqlWrapper from '../database/mysqlWrapper'
import { sqlConstants } from '../constants/sql'

class GenericDAO {

    /**
     * Método auxiliar para retorno da conexão
     */
    static getConnection() {
        return mysqlWrapper.getConnectionFromPool()
    }

    /**
     * find - Método genérico para carregar um objeto por ID
     * @returns {ResultSet} - Objeto contendo o resultado da query
     */
    static find(id) {
        return mysqlWrapper.createQuery({
            query: `SELECT * FROM ?? WHERE ?? = ?`,
            params: [this.TABLE_NAME, this.PRIMARY_KEY, id]
        })
    }

    /**
     * 
     * 
     * findByFields - Método genérico para carregar objetos pelos campos informados
     * @param {Object} fields - Campos que serão utilizados para carregar o objeto
     * @param {Object} limit - Limitador da query
     * @param {Object} order - Odernação da query
     * @returns {ResultSet} - Objeto contendo o resultado da query
     */
    static findByFields({fields, limit, order}) {
        
        let baseQuery = `SELECT * FROM ?? WHERE `

        let params = [this.TABLE_NAME]

        Object.keys(fields).forEach((key, index) => {
            baseQuery += `${key} = ?`
            params.push(fields[key])
            if (index + 1 !== Object.keys(fields).length) baseQuery += " AND "
        })

        if (order != null && order.by != null && order.direction != null) {
            baseQuery += ` ORDER BY ??`
            baseQuery += order.direction === sqlConstants.DESC ? " DESC" : " ASC"
            params.push(order.by)
        }

        if (limit != null && !isNaN(limit)) {
            baseQuery += " LIMIT ?"
            params.push(limit)
        }

        return mysqlWrapper.createQuery({
            query: baseQuery,
            params: params
        })
    }

    /**
     * 
     * 
     * Update - Método genérico utilizado para atualizar uma tabela
     * @param {Mysql.Connection} connection - A conexão a ser utilizada durante a transação
     * @param {String} table - A tabela a ser atualizada
     * @param {String} data - Os campos a ser utilizados para atualizar a tabela
     * @param {Number} id - O ID da entrada a ser atualizada
     * @returns {ResultSet} - Objeto contendo o resultado da query
     */
    static update(connection, {data, id}) {
        return mysqlWrapper.createTransactionalQuery({
            query: `UPDATE ??
                    SET ?
                    WHERE ?? = ?`,
            params: [this.TABLE_NAME, data, this.PRIMARY_KEY, id],
            connection: connection
        })
    }

    /**
     * insert - Método genérico utilizado para realizar uma inserção no banco
     * @param {MySQL.Connection} connection - A conexão a ser utilizada durante a transação
     * @param {String} table - A tabela a ser atualizada
     * @param {String} data - Os campos a ser utilizados para popular a nova entrada na tabela
     * @returns {ResultSet} - Objeto contendo o resultado da query
     */    
    static insert(connection, {data}) {
        return mysqlWrapper.createTransactionalQuery({
            query: `INSERT INTO ${this.TABLE_NAME}
                    SET ?`,
            params: [data],
            connection: connection
        })
    }

    /**
     * Pardrão caso o método não seja sobrescrito na classe de herança
     */
    static get PRIMARY_KEY() {
        return "_id";
    };

}

export default GenericDAO