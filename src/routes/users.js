import express from 'express'
const router = express.Router()
import errorHandler from '../helpers/errorHandler'
import fs  from 'fs' 
import multer from 'multer'
import fastCsv  from 'fast-csv'
import path from 'path'
import User from '../models/user'
import Client from '../models/client'
import { cleanFileData } from '../helpers/usersHelper'
import { verifyIfUserExists } from '../middleware/usersMiddleware'
import mySQLWrapper from '../database/mysqlWrapper'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'tmp/csv/')
  },
  filename: function (req, file, cb) {
      cb(null, `${file.originalname}`)
  }
})
const upload = multer({ storage })

/**
 * Rota responsável pela inserção do usuário e os dados informados no csv
 */
router.post('/', upload.single('file'),  async (req, res) => {
    try {
        const rows = []
        fastCsv.fromPath(req.file.path)
        .on("data", function (eachRow) {
            rows.push(eachRow)
        })
        .on("end", async function () {
            let cleanData = await cleanFileData(rows)
            let splittedFileName = req.file.originalname.substring(0, req.file.originalname.length - 4).split("_")
            let data = {
                _id: splittedFileName[1],
                name: splittedFileName[0].replace(/([a-z])([A-Z])/g, '$1 $2'),
                data_sent: new Date(),
                file_name: req.file.originalname,
                status: "upload_complete"
            }
            let connection
            try {
                connection = await mySQLWrapper.getConnectionFromPool()
                await mySQLWrapper.beginTransaction(connection)

                // Verifica existência do usuário para evitar duplicidade
                let userInsert = await User.findByID(data._id, connection)
                if(userInsert == null) {
                    userInsert = await User.insert({connection, data})
                }
                await Promise.all(cleanData.map(async client => {
                    client.users_id = userInsert.id
                    await Client.insert({connection, data: client})
                }))

                await mySQLWrapper.commit(connection)
                return res.status(201).json(data)
            } catch (e) {
                fs.unlinkSync(req.file.path)
                await mySQLWrapper.rollback(connection)
                errorHandler.logger.log("error", e)
                return errorHandler.handleError({
                    error: {status: 500, error: `Error while inserting data: ${e}`, display: false},
                    res: res,
                    req: req
                })
            }
        })
            .on("error", function() {
                fs.unlinkSync(req.file.path)
                if(path.extname(req.file.originalname) !== ".csv") {
                    return errorHandler.handleError({
                        error: {status: 400, error: `Invalid file extension.`, display: true},
                        res: res,
                        req: req
                    })
                }
            })
    } catch (e) {
        errorHandler.logger.log("error", e)
        return errorHandler.handleError({
            error: {status: 500, error: `Error: ${e}`, display: false},
            res: res,
            req: req
        })
    } 
})

/**
 * Rota responsável por retornar os clients de um usuário
 */
router.get('/:id/clients', [verifyIfUserExists,  async (req, res) => {
    try {
        let userID = req.params.id
        let user = await User.findByID(userID);
        let clientsFromUser = await Client.getUserClients(user.id)
        return res.status(200).json(clientsFromUser)
    } catch (e) {
        errorHandler.logger.log("error", e)
        return errorHandler.handleError({
            error: {status: 500, error: `Error: ${e}`, display: false},
            res: res,
            req: req
        })
    } 
}])

/**
 * Rota responsável por excluir um usuário e seus respectivos clientes
 */
router.delete('/:id',[verifyIfUserExists, async (req, res) => {
    try {
        let connection
        try {
            connection = await mySQLWrapper.getConnectionFromPool()
            await mySQLWrapper.beginTransaction(connection)

            let userToRemove = await User.findByID(req.params.id)

            await Client.deleteByUserID({userID: userToRemove.id, connection})

            await User.delete({id: userToRemove._id, connection})
            
            userToRemove.status = "deleted"
            delete userToRemove.file_name
            delete userToRemove.id
            await mySQLWrapper.commit(connection)
            return res.status(200).json(userToRemove)
        } catch (e) {
            await mySQLWrapper.rollback(connection)
            errorHandler.logger.log("error", e)
            return errorHandler.handleError({
              error: {status: 500, error: `Error while deleting data: ${e}`, display: false},
              res: res,
              req: req
            })
        }
    } catch (e) {
        errorHandler.logger.log("error", e)
        return errorHandler.handleError({
            error: {status: 500, error: `Error: ${e}`, display: false},
            res: res,
            req: req
        })
    } 
}])

/**
 * Rota responsável por alterar um usuário
 */
router.put('/:id', [verifyIfUserExists, async (req, res) => {
    let connection;
    try {
        let json = {
            status: "updated_info"
        }
        if(req.body.name === "") {
            return errorHandler.handleError({
                req: req,
                res: res,
                error: {display: true, status: 403, error: "The name couldn't be empty."}
            });
        }else {
            json.name = req.body.name
        }

        let currentUser = await User.findByID(req.params.id);

        if(req.body._id != null && req.body._id !== "" && req.body._id !== req.params.id) {
            let userVerify = await User.findByID(req.body._id);
            if(userVerify != null) {
                return errorHandler.handleError({
                    req: req,
                    res: res,
                    error: {display: true, status: 403, error: "Already have an user with this ID."}
                });
            }else {
                json._id = req.body._id
            }
        }
        connection = await mySQLWrapper.getConnectionFromPool();
        let updatedUser = await User.update(currentUser.id, json, connection);
        await mySQLWrapper.commit(connection)
        return res.status(200).json(updatedUser)
    } catch (e) {
        errorHandler.logger.log("error", e);
        return errorHandler.handleError({
            error: {status: 500, error: `Error when updating : ${e}`, display: false},
            res: res,
            req: req
        })
    }
}])

export default router