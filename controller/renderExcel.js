import ExcelJS from 'exceljs';
import { outputProcess1 } from '../util/field.js';

export async function renderExcel(req, res, next) {
    try {
        const data = req.body
        let writeWb = new ExcelJS.Workbook();
        const writeWorkSheet = writeWb.addWorksheet('FO NHAN VIEN')
        const rowOne = writeWorkSheet.getRow(1);
        //add headers
        rowOne.height = 50
        outputProcess1.forEach((item, key) => {
            rowOne.getCell(key + 1).value = item.output
            var borderStyles = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };

            rowOne.getCell(key + 1).alignment = {
                vertical: 'middle', horizontal: 'center'
            }
            rowOne.getCell(key + 1).border = borderStyles
            rowOne.getCell(key + 1).font = {
                size: 12,
                bold: true
            }
            rowOne.getCell(key + 1).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: {
                    argb: 'fff2cc'
                },
            }
        })
        //add body
        data.forEach((item, key) => {
            const row = writeWorkSheet.getRow(key + 2);
            outputProcess1.forEach((output1, index) => {
                row.getCell(1).value = key + 1;
                row.getCell(index + 1).value = item[output1.key]
            })
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
    } catch (error) {
        console.log(error)
        return res.status(400).json({ msg: 'Error processing!! Please import again' })
    }
}

export async function renderExcelStep3(req, res, next) {
    try {
        const data = req.body
        let writeWb = new ExcelJS.Workbook();
        const writeWorkSheet = writeWb.addWorksheet('result')
        const row = writeWorkSheet.getRow(1);
        row.getCell(1).value = "STT"
        row.getCell(2).value = "Khoa/phòng/đơn vị"
        data.forEach((item, key) => {
            // not regonize first row
            const row = writeWorkSheet.getRow(key + 2);
            row.getCell(1).value = key + 1
            row.getCell(2).value = item.id
            row.getCell(3).value = item.count
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
    } catch (error) {
        console.log(error)
        return res.status(400).json({ msg: 'Error processing!! Please import again' })
    }
}