export const sum = (arrOfNumbers) => {
    if (
        "undefined" === typeof arrOfNumbers || 
        null === arrOfNumbers ||
        false === Array.isArray(arrOfNumbers) ||
        0 === arrOfNumbers.length
    ) {
        arrOfNumbers = [0,0];
    }


    return arrOfNumbers.reduce((x,y) => {
        if( typeof x !== 'number') {
            x = 0;
        }
        if( typeof y != 'number') {
            y = 0;
        }
        return x+y;
    })
}