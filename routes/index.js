import express from "express";
import multer from 'multer'
import { processOne } from "../controller/processOne.js";
import { getChartData } from "../controller/processThree.js";
import { renderExcel, renderExcelStep3 } from "../controller/renderExcel.js";
import { uploadFile } from "../controller/uploadExcel.js"
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

/*-------------------------------------------------------------------------*/
// Below all APIs are public APIs protected by api-key
/*-------------------------------------------------------------------------*/

router.post('/processOne', upload.single('formFile'), processOne);
router.post('/renderExcel', renderExcel);

router.post('/getChartData', getChartData);
router.post('/importExcel', upload.single('formFile'), uploadFile);
router.post('/renderExcelStep3', renderExcelStep3);


export default router;
