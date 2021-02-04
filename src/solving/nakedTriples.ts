import {copy, digit, sudoku} from "./SudokuUtils";


const sudokuValues = [1, 2, 3, 4, 5, 6, 7, 8, 9]

//https://www.sudokuwiki.org/Naked_Candidates#NP

// doesnt find xy,yz,xz todo
export default function nakedTriples(input: sudoku): [boolean, sudoku] {
    const sudoku = copy(input);
    let changed = false;
    for (let i = 0; i < sudoku.length; i++) {
        for (let j = 0; j < sudoku[i].length; j++) {
            const current = sudoku[i][j];
            if (typeof current === "number") continue;
            // we only detect the 3 possible fields and from that detect the others
            if (current.length !== 3) continue;


            const values: [digit, digit, digit] = [current[0], current[1], current[2]];

            // coordinates of first and second occurrence and the values of our triple
            let found: [{ row: number, col: number }, { row: number, col: number }] | undefined;
            found = nakedTripleColumn(sudoku, j, i, values)
            if (found !== undefined) {
                // we have a naked pair in this column, we can erase its occurrences in all other possibility-arrays in this column
                for (let x = 0; x < sudoku.length; x++) {
                    if (i === x || found[0].row === x || found[1].row === x) continue; // leave the found triples and ourself out
                    const value = sudoku[x][j];
                    if (typeof value === "number") continue; // we don't need solved cells
                    sudoku[x][j] = value.filter((v) => !values.includes(v))
                }
                changed = true;
                break; // not sure if we can break here or not
                // todo more testing
            }

            found = nakedTripleRow(sudoku, j, i, values)
            if (found !== undefined) {
                // we have a naked pair in this row, we can erase its occurrences in all other possibility-arrays in this row
                for (let x = 0; x < sudoku.length; x++) {
                    if (j === x || found[0].col === x || found[1].col === x) continue; // leave the found triples and ourself out
                    const value = sudoku[i][x];
                    if (typeof value === "number") continue; // we don't need solved cells
                    sudoku[i][x] = value.filter((v) => !values.includes(v))
                }
                changed = true;
                break; // not sure if we can break here or not
                // todo more testing
            }

            found = nakedTriple3x3(sudoku, j, i, values)
            if (found !== undefined) {
                // we have a naked pair in this 3x3, we can erase its occurrences in all other possibility-arrays in this 3x3

                const boxRow = Math.floor(j / 3) * 3;
                const boxCol = Math.floor(i / 3) * 3;

                for (let r = 0; r < 3; r++) {
                    for (let c = 0; c < 3; c++) {
                        if ((i === boxRow + r && j === boxCol + c) ||
                            (found[0].row === boxRow + r && found[0].col === boxCol + c) ||
                            (found[1].row === boxRow + r && found[1].col === boxCol + c)) continue; // leave the found triples and ourself out
                        const value = sudoku[boxRow + r][boxCol + c]
                        if (typeof value === "number") continue;
                        sudoku[boxRow + r][boxCol + c] = value.filter((v) => !values.includes(v))
                    }
                }
                changed = true;
                break; // not sure if we can break here or not
                // todo more testing
            }
        }
    }
    return [changed, sudoku]
}

// returns the position of the naked pair counterpart in the column if found
function nakedTripleColumn(sudoku: sudoku, row: number, column: number, values: [number, number, number]): [{ row: number, col: number }, { row: number, col: number }] | undefined {

    let second: { row: number, col: number } | undefined;

    for (let i = 0; i < sudoku.length; i++) {
        if (i === row) continue; // dont check pair against itself
        const current = sudoku[i][column]
        if (typeof current === "number") continue;
        if (current.length > 3) continue;

        // the field must include 2 of the 3 numbers and only the 3 numbers.
        // the best way to check is to check if it does not contain the complementary numbers
        const badValues = sudokuValues.filter(v => !values.includes(v));
        let correct = true;
        for (let n of current) {
            if (badValues.includes(n)) {
                correct = false;
                break;
            }
        }
        if (correct) {
            if (second === undefined) {
                second = {row: i, col: column}
            } else {// we found the third triple there can't be another one due to sudoku restraints so lets return
                return [second, {row: i, col: column}]
            }
        }
    }
}

// returns the position of the naked pair counterpart in the row if found
function nakedTripleRow(sudoku: sudoku, row: number, column: number, values: [number, number, number]): [{ row: number, col: number }, { row: number, col: number }] | undefined {

    let second: { row: number, col: number } | undefined;

    for (let i = 0; i < sudoku.length; i++) {
        if (i === column) continue; // dont check pair against itself
        const current = sudoku[row][i]
        if (typeof current === "number") continue;
        if (current.length > 3) continue;

        // the field must include 2 of the 3 numbers and only the 3 numbers.
        // the best way to check is to check if it does not contain the complementary numbers
        const badValues = sudokuValues.filter(v => !values.includes(v));
        let correct = true;
        for (let n of current) {
            if (badValues.includes(n)) {
                correct = false;
                break;
            }
        }
        if (correct) {
            if (second === undefined) {
                second = {row: row, col: i}
            } else {// we found the third triple there can't be another one due to sudoku restraints so lets return
                return [second, {row: row, col: i}]
            }
        }
    }
}


function nakedTriple3x3(sudoku: sudoku, row: number, column: number, values: [number, number, number]): [{ row: number, col: number }, { row: number, col: number }] | undefined {

    let second: { row: number, col: number } | undefined;

    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(column / 3) * 3;

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (boxCol === column && boxRow === row) continue; // dont check pair against itself
            const current = sudoku[boxRow + r][boxCol + c]
            if (typeof current === "number") continue; // not interested in solved cells
            if (current.length > 3) continue;

            // the field must include 2 of the 3 numbers and only the 3 numbers.
            // the best way to check is to check if it does not contain the complementary numbers
            const badValues = sudokuValues.filter(v => !values.includes(v));
            let correct = true;
            for (let n of current) {
                if (badValues.includes(n)) {
                    correct = false;
                    break;
                }
            }
            if (correct) {
                if (second === undefined) {
                    second = {row: boxRow + r, col: boxCol + c}
                } else {// we found the third triple there can't be another one due to sudoku restraints so lets return
                    return [second, {row: boxRow + r, col: boxCol + c}]
                }
            }
        }
    }
}
