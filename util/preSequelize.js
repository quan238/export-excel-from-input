/**
 * Convert 2 array, one with key, and one with value
 * @example
 * zip(['a','b'],['1','2']) ={ a:1, b:2 } 
 */
export function zip(arr1, arr2, result = {}) {
    arr1.forEach((key, i) => result[key] = arr2[i]);
    return result;
}

export function mapArrayWithKey(arr, key) {
    return arr.map((item) => {
        if (!key) return
        return item[key]
    })
}

export function connect(arr) {
    return { [arr[0].toString().replace(/\s{2,}/g, ' ').trim()]: arr[1] };
}