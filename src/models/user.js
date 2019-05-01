import GenericDAO from '../database/genericDAO';
import MysqlWrapper from '../database/mysqlWrapper'

class User extends GenericDAO {

    static get TABLE_NAME() {
        return "users";
    };

    static async getUsers() {
        let users = await MysqlWrapper.createQuery({
            query: `SELECT * FROM users;`
        });
        return users;
    }
}
export default User;