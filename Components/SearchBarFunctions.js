
export const keywordsMaker = array => {
    let tempArray = ['']
    for (let i = 0; i < array.length; i++) {
        for(let j = 1; j < array[i].length + 1; j++) {
            tempArray.push(array[i].slice(0, j).toLowerCase())
        }
    }
    return tempArray
}

export const messageSorter = (array1, array2) => {
    const tempArray = []
    let array1Pointer = 0
    let array2Pointer = 0
    while ((array1Pointer) !== array1.length && (array2Pointer) !== array2.length) {
        if( array1[array1Pointer].value.lastMessageTime > array2[array2Pointer].value.lastMessageTime) {
            tempArray.push(array1[array1Pointer])
            array1Pointer += 1
        } else {
            tempArray.push(array2[array2Pointer])
            array2Pointer += 1
        }
    }
    if (array1.length === array1Pointer) {
        for (let i = array2Pointer; i < array2.length; i++) {
            tempArray.push(array2[i])
        }
    } else {
        for (let i = array1Pointer; i < array1.length; i++) {
            tempArray.push(array1[i])
        }
    }
    return tempArray
}
