import {convert, copy, sudoku} from "./SudokuUtils";
import nakedPairs from "./nakedPairs";
import hiddenSingles from "./hiddenSingles";
import {reducePossibles} from "./reducePossibles";
import nakedTriples from "./nakedTriples";

// finds single fields with 1 possible value and reformats
export const checkSolved = (input: sudoku): [boolean, sudoku] => {
    const sudoku = copy(input);
    let changed = false;

    for (let i = 0; i < sudoku.length; i++) {
        for (let j = 0; j < sudoku[i].length; j++) {
            const current = sudoku[i][j];
            if (typeof current === "number" || current.length !== 1) continue;
            changed = true;
            sudoku[i][j] = current[0]
        }
    }
    return [changed, sudoku]
}

export const hiddenPairs = (input: sudoku): [boolean, sudoku] => {
    const sudoku = copy(input);
    let changed = false;

    // todo implement

    return [changed, sudoku]
}

const algorithms: ((sudoku: sudoku) => [boolean, sudoku])[] = [convert, checkSolved, reducePossibles, hiddenSingles, nakedPairs, nakedTriples, hiddenPairs]
export default algorithms;
