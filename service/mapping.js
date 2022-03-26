import { fieldProcessOne } from "../util/field.js";
import { connect, mapArrayWithKey, zip } from "../util/preSequelize.js";
import _ from 'lodash'
import moment from 'moment';
export const mapping = (data) => {
    // return first filed
    data.splice(0, 1)
    const clinic = connect(data)
    // clinic[Object.keys(clinic)[0].replace(/\s{2,}/g, ' ').trim()] = clinic[Object.keys(clinic)[0]]
    // console.log(clinic)
    return clinic;
}

export const mappingInProcessOne = (data) => {
    data.splice(0, 1)
    const mapData = zip(fieldProcessOne, data)

    const getNewFormat = moment(mapData["timeStamp"], 'D/M/YYYY hh:mm:ss a').format('DD/MM/YYYY')
    return { ...mapData, timeStamp: getNewFormat }

    return mapTimeStampColumn
}