export default class Sudoku {
    private numbers: number[][] =
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]]


    set(numbers: number[][]) {
        this.numbers = numbers
        return this
    }

    // reshapes numbers to fields
    byFields() {
        const result = []
        for (let m = 0; m < 3; m++) {
            const bigRow = []
            for (let n = 0; n < 3; n++) {
                let field = [];
                for (let i = 0; i < 3; i++) {
                    let row = []
                    for (let j = 0; j < 3; j++) {
                        row.push(this.numbers[i + (3 * m)][j + (3 * n)])
                    }
                    field.push(row)
                }
                bigRow.push(field)
            }
            result.push(bigRow)
        }
        return result
    }

    byRows() {
        return this.numbers.slice()
    }

    byCols() {

    }

}
