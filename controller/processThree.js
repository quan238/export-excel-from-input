import { field, fieldExcel } from '../util/field.js';

const optionsClinic = field.map((item) => item.outputField)

export async function getChartData(req, res, next) {
    try {
        const data = req.body
        const { clinic } = req.query

        // count data
        const countData = [...data.reduce((result, item) => {
            if (!result.has(item.clinic)) result.set(item.clinic, { id: item.clinic, count: 0 })
            result.get(item.clinic).count++;
            return result
        }, new Map).values()]
        let result = [...countData]


        // add field not have in file excel
        fieldExcel.forEach((item, key) => {
            if (result.filter((i) => i.id === item["outputField"]).length > 0) {
                return true;
            } else {
                result.splice(key + 1, 0, { id: item["outputField"], count: 0, })
            }
        })


        result = [...result].filter((item) => item?.id ? true : false)

        // filter clinic
        if (clinic || clinic === '') {
            result = [...result].filter((item) => item.id.toLowerCase().includes(clinic.toLowerCase()) ? true : false)
        }

        return res.status(200).json(result)

    } catch (error) {
        console.log(error)
        return res.status(400).json({ msg: 'Error processing!! Please import again' })
    }
}