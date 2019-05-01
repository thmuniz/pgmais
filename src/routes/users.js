import express from 'express'
const router = express.Router()
import errorHandler from '../helpers/errorHandler'
import User from '../models/user'
import fs  from 'fs' 
import multer from 'multer'
import fastCsv  from 'fast-csv';
import { cleanFileData } from '../helpers/fileHelper';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'tmp/csv/')
  },
  filename: function (req, file, cb) {
    console.log(file)
      cb(null, `${file.originalname}`);
  }
});
const upload = multer({ storage });

/**
 * Teste
 */
router.post('/', upload.single('file'),  async (req, res) => {
    try {
		const rows = [];
        // open uploaded file
        fastCsv.fromPath(req.file.path)
		.on("data", function (eachRow) {
            rows.push(eachRow);
          })
          .on("end", async function () {
            let clean = await cleanFileData(rows);
            console.log(clean)
           
            //fs.unlinkSync(req.file.path);   // remove temp file
            //process "fileRows" and respond
          })
    } catch (e) {
        errorHandler.logger.log("error", e);
        return errorHandler.handleError({
            error: {status: 500, error: `Error: ${e}`, display: false},
            res: res,
            req: req
        })
    } 
})

export default router;