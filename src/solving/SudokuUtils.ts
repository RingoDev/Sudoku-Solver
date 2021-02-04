// reshapes numbers to fields
export const byFields = (sudoku: sudoku) => {
    const result = []
    for (let m = 0; m < 3; m++) {
        const bigRow = []
        for (let n = 0; n < 3; n++) {
            let field = [];
            for (let i = 0; i < 3; i++) {
                let row = []
                for (let j = 0; j < 3; j++) {
                    row.push(sudoku[i + (3 * m)][j + (3 * n)])
                }
                field.push(row)
            }
            bigRow.push(field)
        }
        result.push(bigRow)
    }
    return result
}

export const getEmpty = (): digit[][] => {
    return [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]]
}

export const convert = (sudoku: sudoku): [boolean, sudoku] => {
    const result: sudoku = []
    let changed = false;
    for (let row of sudoku) {
        const sRow: (digit | digit[])[] = []
        for (let number of row) {
            let sNumber: digit | digit[]
            if (number === 0) {
                changed = true;
                sNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9]
            } else {
                sNumber = number
            }
            sRow.push(sNumber)
        }
        result.push(sRow)
    }
    return [changed, result];
}

export const copy = (sudoku: sudoku) => {
    const result: sudoku = []
    for (let row of sudoku) {
        const sRow: (digit | digit[])[] = []
        for (let number of row) {
            sRow.push(typeof number === "number" ? number : Array.from(number))
        }
        result.push(sRow)
    }
    return result
}

export const fromString = (string: string): sudoku => {
    if (string.length !== 81) return [];

    const result: sudoku = []

    for (let i = 0; i < 9; i++) {
        const row: (digit | digit[])[] = [];
        for (let j = 0; j < 9; j++) {
            row.push(Number(string.charAt(i * 9 + j)) as digit);
        }
        result.push(row)
    }
    return result
}

export type sudoku = (digit | digit[])[][]
export type digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
