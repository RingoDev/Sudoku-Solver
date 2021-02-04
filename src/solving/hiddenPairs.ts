import {copy, sudoku} from "./SudokuUtils";

//https://www.sudokuwiki.org/Hidden_Candidates#HP
// check for a combination of 2 numbers that only appear together and 2 times
export default function hiddenPairs(input: sudoku) {
    const sudoku = copy(input);
    let changed = false;




    return [changed, sudoku]
}
