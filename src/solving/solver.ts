import {digit, sudoku} from "./SudokuUtils";


export function solve(input: sudoku) {
    const sudoku = input.slice()
    const solution = solveRecursively(sudoku)
    console.debug("Found solution", solution)
    return solution;
}

const digits: digit[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export function getNextFree(sudoku: sudoku): [row: number, col: number] {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            // we found the next free cell
            if (typeof sudoku[row][col] !== "number" || sudoku[row][col] === 0) {

                return [row, col]
            }
        }
    }
    return [-1, -1]
}


export function solveRecursively(sudoku: sudoku): sudoku {
    const [row, col] = getNextFree(sudoku)
    // console.debug("Next free cell is [" + row + "," + col + "]")
    if (col === -1) return sudoku

    for (let num of digits) {
        if (isValid(sudoku, row, col, num)) {
            // console.debug(JSON.stringify(sudoku))
            sudoku[row][col] = num;
            solveRecursively(sudoku);
        }
    }

    if (getNextFree(sudoku)[0] !== -1)
        sudoku[row][col] = 0;

    return sudoku;
}

function isValid(sudoku: sudoku, row: number, column: number, value: digit) {
    return validateColumn(sudoku, column, value) && validateRow(sudoku, row, value) && validateField(sudoku, row, column, value)
}
//
// function simplifyRows(sudoku: sudoku) {
//     const result = sudoku.slice();
//     for (let i = 0; i < sudoku.length; i++) {
//         for (let n = 1; n < 10; n++) {
//             const row = sudoku[i]
//             if (row.includes(n as digit)) {
//                 //    remove n from all subindexes in this row;
//                 for (let j = 0; j < row.length; j++) {
//                     const value = row[j];
//                     if (typeof value !== 'number') {
//                         result[i][j] = value.filter(v => v !== n)
//                     }
//                 }
//             }
//         }
//     }
//     return result;
// }
//
// function simplifyCols(sudoku: sudoku) {
//     const result = sudoku.slice();
//     for (let j = 0; j < sudoku.length; j++) {
//         for (let n = 1; n < 10; n++) {
//             let col = sudoku[j]
//             let foundN = false;
//             for (let i = 0; i < col.length; i++) {
//                 const value = sudoku[i][j]
//                 if (value === n) {
//                     foundN = true;
//                     break;
//                 }
//             }
//             if (foundN) {
//                 // remove n from all subindexes in this row
//                 for (let i = 0; i < col.length; i++) {
//                     const value = sudoku[i][j];
//                     if (typeof value !== 'number') {
//                         result[i][j] = value.filter(v => v !== n)
//                     }
//                 }
//             }
//         }
//     }
//     return result;
// }
//
// function simplifyFields(sudoku: sudoku) {
//
// }
//
// function simplifyField(field: (number | number[])[][]) {
//     const result = field.slice();
//     for (let n = 1; n < 10; n++) {
//         let foundN = false;
//         for (let i = 0; i < 3; i++) {
//             for (let j = 0; j < 3; j++) {
//                 if (field[i][j] === n) {
//                     foundN = true;
//                     break;
//                 }
//
//             }
//         }
//         if (foundN) {
//             // remove n from all subindexes in this field
//             for (let i = 0; i < 3; i++) {
//                 for (let j = 0; j < 3; j++) {
//                     const value = field[i][j]
//                     if (typeof value !== 'number') {
//                         result[i][j] = value.filter(v => v !== n);
//                     }
//                 }
//             }
//         }
//     }
//     return result
// }

function validateColumn(sudoku: sudoku, column: number, value: digit) {
    for (let i = 0; i < sudoku.length; i++) {
        if (sudoku[i][column] === value) {
            return false;
        }
    }

    return true;
}

function validateRow(sudoku: sudoku, row: number, value: digit) {
    for (let i = 0; i < sudoku[row].length; i++) {
        if (sudoku[row][i] === value) {
            return false;
        }
    }

    return true;
}

function validateField(sudoku: sudoku, row: number, column: number, value: digit) {
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(column / 3) * 3;

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (sudoku[boxRow + r][boxCol + c] === value)
                return false;
        }
    }
    return true;
}
