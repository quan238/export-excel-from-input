import { connect, mapArrayWithKey, zip } from "../util/preSequelize.js";


export const mapping = (data) => {
    // return first filed
    data.splice(0, 1)
    const clinic = connect(data)
    return clinic;
}