import ExcelJS from 'exceljs';
import moment from 'moment';
import { mappingInProcessOne } from '../service/mapping.js';
import { notHaveInArray } from '../util/preSequelize.js';

const paginatedData = (page = 1, perPage = 6, data) => {
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage

    const newData = [...data].slice(startIndex, endIndex)
    return newData
}

export async function processOne(req, res, next) {
    try {
        const { date, page, perPage } = req.query

        let exceptStaff = req.query?.exceptStaff
        if (!Array.isArray(exceptStaff))
            exceptStaff = !!exceptStaff ? [exceptStaff] : [];

        if (!req.file?.path) {
            return res.status(400).json({ msg: 'Error processing!! Please import again' })
        }
        let wb = new ExcelJS.Workbook();
        await wb.xlsx.readFile(req.file.path)
        let ws = await wb.getWorksheet(1)
        let jsonData = []
        ws.eachRow(function (row, rowNumber, index) {
            if (rowNumber === 1) {
                return
            }
            let data = mappingInProcessOne(row.values)
            jsonData = [...jsonData, data]
        })

        if (date) {
            jsonData = jsonData.filter((item) => item["timeStamp"] === date.replace(/\s+/g, ' ').trim() ? true : false)
        }

        const cloneJson = [...jsonData].map((item, key) => {
            return { ...item }
        })

        let result = [];

        const regexGender = /Nam|Nữ|nữ|nam/
        const regexYearBorn = /(?:19|20)\d\d/

        cloneJson.map((item) => {
            if (item.newInfected !== 0) {
                const staffs = item["noteNewInfected"]?.split(',')
                staffs?.forEach((staff, index) => {
                    const info = staff.split('-')
                    const infectedFrom = info.length <= 1 ? null : info[info.length - 1]
                    const dateOfBirth = item.noteNewInfected.match(regexYearBorn) ? item.noteNewInfected.match(regexYearBorn)[0] : null
                    const gender = item.noteNewInfected.match(regexGender) ? item.noteNewInfected.match(regexGender)[0] : null

                    const infoStaff = {
                        name: info[0],
                        gender,
                        dateOfBirth,
                        // job: '',
                        // phone: '',
                        info: staff,
                        clinic: item.clinic,
                        datePositive: moment(item.dateReport).format('DD/MM/YYYY'),
                        workingStatus: 'Đang cách ly',
                        fromNote: item.noteNewInfected,
                        infectedFrom: infectedFrom
                    }
                    result.push(infoStaff)
                })
            }

        })
        const total = result.length;
        // add key
        result = [...result].map((item, key) => { return { ...item, id: key + 1 } })

        // delete except
        if (exceptStaff || exceptStaff?.length > 0) {
            result = notHaveInArray(result, exceptStaff, "id")
        }

        const readyUploadExcel = [...result]
        result = paginatedData(page, perPage, result)

        return res.status(200).json({
            result, total, cloneJson, readyUploadExcel
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ msg: 'Error processing!! Please import again' })
    }
}