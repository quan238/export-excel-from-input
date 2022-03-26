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
        console.log(req.file)
        if (!req.file?.path) {
            return res.status(400).json({ msg: 'Return and update file again!!' })
        }
        let jsonData = [];
        let wb = new ExcelJS.Workbook();
        await wb.xlsx.readFile(req.file.path)
        let ws = await wb.getWorksheet("Sheet1")
        if (!ws) {
            throw new Error("Sheet not found")
        }
        ws.eachRow(function (row, rowNumber, index) {
            if (rowNumber === 1) {
                return
            }
            let data = mapping(row.values)
            jsonData = [...jsonData, data]
        })
        const outputDataWithNull = jsonData.map((item, key) => {
            const findKey = fieldExcel.find((itemFind) => {
                if (Array.isArray(itemFind['inputField'])) {
                    return itemFind['inputField'].includes(Object.keys(item)[0]) ? true : false
                }
                return itemFind['inputField'] === Object.keys(item)[0] ? true : false
            })
            if (!findKey) {
                return null
            }

            return { [findKey.outputField]: Object.values(item)[0], id: findKey.id }
        })
        const result = outputDataWithNull.filter((item) => item)
        let outputData = result.reduce((a, c) => {
            let x = a.find(e => e.id === c.id)
            if (!x) a.push(Object.assign({}, c))
            else x[Object.keys(x)[0]] += c[Object.keys(c)[0]]
            return a
        }, [])
        fieldExcel.forEach((item, key) => {
            if (outputData.filter((i) => i.id === item.id).length > 0) {
                return true;
            } else {
                outputData.splice(key + 1, 0, { [item["outputField"]]: 0, id: key + 1 })
            }
        })
        outputData.sort((a, b) => a?.id - b?.id)
        console.log(outputData)
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

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Result.xlsx");
        await writeWb.xlsx.write(res).then(function () {
            res.end();
        })
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({ msg: 'Return and update file again!!' })
    }
}
