import { connect, mapArrayWithKey, zip } from "../util/preSequelize.js";


export const mapping = (data) => {
    // return first filed
    data.splice(0, 1)
    const clinic = connect(data)
    // clinic[Object.keys(clinic)[0].replace(/\s{2,}/g, ' ').trim()] = clinic[Object.keys(clinic)[0]]
    // console.log(clinic)
    return clinic;
}