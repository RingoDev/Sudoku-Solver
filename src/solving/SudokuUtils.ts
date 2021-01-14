export default class SudokuUtils {
    // reshapes numbers to fields
    public static byFields(sudoku: sudoku) {
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

    public static getEmpty(): digit[][] {
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

    public static convert(sudoku: sudoku) {
        const result: sudoku = []
        for (let row of sudoku) {
            const sRow: (digit | digit[])[] = []
            for (let number of row) {
                let sNumber: digit | digit[]
                if (number === 0) {
                    sNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9]
                } else {
                    sNumber = number
                }
                sRow.push(sNumber)
            }
            result.push(sRow)
        }
        return result;
    }
}
export type sudoku = (digit | digit[])[][]
export type digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
