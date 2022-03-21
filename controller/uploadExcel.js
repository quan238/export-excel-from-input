import ExcelJS from 'exceljs';
import { mapping } from '../service/mapping.js';
import { fieldExcel } from '../util/field.js';
import { mapArrayWithKey } from '../util/preSequelize.js';
import tempfile from 'tempfile';
const INPUT_FIELD_ARRAY = mapArrayWithKey(fieldExcel, 'inputField')
const OUTPUT_FIELD_ARRAY = mapArrayWithKey(fieldExcel, 'outputField')
export async function uploadFile(req, res, next) {
    // var body = {
    //     file: req.file.buffer,
    //     type: req.body.type
    // }
    try {
        if (!req.file?.path) {
            return res.send('Return and update file again!!')
        }
        let jsonData = [];
        let wb = new ExcelJS.Workbook();
        await wb.xlsx.readFile(req.file.path)
        let ws = await wb.getWorksheet("Sheet1")
        ws.eachRow(function (row, rowNumber, index) {
            // console.log(rowNumber)
            // console.log(row)
            if (rowNumber === 1) {
                return
            }
            let data = mapping(row.values)
            jsonData = [...jsonData, data]
        })
        const outputDataWithNull = jsonData.map((item, key) => {
            // console.log(Object.keys(item)[0])
            const findKey = fieldExcel.find((itemFind) => {
                if (Array.isArray(itemFind['inputField'])) {
                    return itemFind['inputField'].includes(Object.keys(item)[0])
                }
                return itemFind['inputField'] === Object.keys(item)[0] ? true : false
            })
            if (!findKey) {
                return null
            }

            return { [findKey.outputField]: Object.values(item)[0], id: findKey.id }
        })
        const outputData = outputDataWithNull.filter((item) => item)
        fieldExcel.forEach((item, key) => {
            if (outputData.filter((i) => i.id === item.id).length > 0) {
                return true;
            } else {
                outputData.splice(key + 1, 0, { [item["outputField"]]: 0, id: key + 1 })
            }
        })
        outputData.sort((a, b) => a?.id - b?.id)

        let writeWb = new ExcelJS.Workbook();
        const writeWorkSheet = writeWb.addWorksheet('result')
        const row = writeWorkSheet.getRow(1);
        row.getCell(1).value = "STT"
        row.getCell(2).value = "Khoa/phòng/đơn vị"
        outputData.forEach((item, key) => {
            // not regonize first row
            const row = writeWorkSheet.getRow(key + 2);
            row.getCell(1).value = key + 1
            row.getCell(2).value = Object.keys(item)[0]
            row.getCell(3).value = Object.values(item)[0]
        })

        writeWorkSheet.columns.forEach(function (column, i) {
            var maxLength = 0;
            column["eachCell"]({ includeEmpty: true }, function (cell) {
                var columnLength = cell.value ? cell.value.toString().length : 10;
                if (columnLength > maxLength) {
                    maxLength = columnLength;
                }
            });
            column.width = maxLength < 10 ? 10 : maxLength;
        });

        const buffer = await writeWb.xlsx.writeBuffer()
        const base64 = Buffer.from(buffer).toString('base64')
        // response.end();
        return res.render('../views/index.ejs', {
            success: true,
            data: {
                docs: base64
            }
        })
    }
    catch (error) {
        console.log(error)
        return res.send('Return and update file again!!', {
            success: false
        })
    }
}
