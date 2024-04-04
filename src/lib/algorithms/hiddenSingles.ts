// checks if a field is the only possible solution in its row, col or field
import { copyGrid, digit, SudokuGridType } from "../utils/sudoku";

export default function hiddenSingles(
  input: SudokuGridType,
): [boolean, SudokuGridType] {
  const sudoku = copyGrid(input);
  let changed = false;

  for (let i = 0; i < sudoku.length; i++) {
    for (let j = 0; j < sudoku[i].length; j++) {
      const current = sudoku[i][j];
      if (typeof current === "number") continue;
      for (let n = 0; n < current.length; n++) {
        let single = countInRow(sudoku, i, current[n]) === 1;
        if (!single) single = countInColumn(sudoku, j, current[n]) === 1;
        if (!single) single = countInField(sudoku, i, j, current[n]) === 1;

        if (single) {
          //    set this possible to be the only possible in this filed
          sudoku[i][j] = [current[n]];
          changed = true;
          break;
        }
      }
    }
  }
  return [changed, sudoku];
}

// returns the amount of fields a possible number appears in a column
function countInColumn(sudoku: SudokuGridType, column: number, value: digit) {
  let sum = 0;
  for (let i = 0; i < sudoku.length; i++) {
    const current = sudoku[i][column];
    if (typeof current === "number") continue;
    if (current.includes(value)) sum++;
  }
  return sum;
}

// returns the amount of fields a possible number appears in a column
function countInRow(sudoku: SudokuGridType, row: number, value: digit) {
  let sum = 0;
  for (let i = 0; i < sudoku.length; i++) {
    const current = sudoku[row][i];
    if (typeof current === "number") continue;
    if (current.includes(value)) sum++;
  }
  return sum;
}

function countInField(
  sudoku: SudokuGridType,
  row: number,
  column: number,
  value: digit,
) {
  let sum = 0;
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(column / 3) * 3;

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const current = sudoku[boxRow + r][boxCol + c];
      if (typeof current === "number") continue;
      if (current.includes(value)) sum++;
    }
  }
  return sum;
}
