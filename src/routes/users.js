import express from 'express'
const router = express.Router()
import errorHandler from '../helpers/errorHandler'
import User from '../models/user'
import fs  from 'fs' 
import multer from 'multer'
import fastCsv  from 'fast-csv'
import path from 'path'
import { cleanFileData } from '../helpers/fileHelper'

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
 * Teste
 */
router.post('/', upload.single('file'),  async (req, res) => {
    try {
		const rows = []
        fastCsv.fromPath(req.file.path)
		.on("data", function (eachRow) {
            rows.push(eachRow)
		})
			.on("end", async function () {
				let clean = await cleanFileData(rows)
				return res.status(200).json(clean)
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