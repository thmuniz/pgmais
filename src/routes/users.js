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
                    let userInsert = await User.findByID({id: data._id, connection})
                    if(userInsert == null) {
                        userInsert = await User.insert({connection, data})
                    }
                    await Promise.all(cleanData.map(async client => {
                        client.users__id = userInsert._id
                        await Client.insert({connection, data: client})
                    }))
                    
                    //Commits the transaction
                    await mySQLWrapper.commit(connection)
                    return res.status(200).json(data)
                } catch (e) {
                    //Rollback and return with error to the caller
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

export default router