// reduces the possible solutions for every field
import { copy, digit, SudokuType } from "../SudokuUtils";

export const reducePossibles = (input: SudokuType): [boolean, SudokuType] => {
  const sudoku = copy(input);
  let changed = false;

  for (let i = 0; i < sudoku.length; i++) {
    for (let j = 0; j < sudoku[i].length; j++) {
      const current = sudoku[i][j];
      if (typeof current === "number") continue;

      const possibleValues: digit[] = [];
      // iterating over the possible values for this field
      for (let n = 0; n < current.length; n++) {
        //    check if n is possible in this row,col and field
        let isValid = validateRow(sudoku, i, current[n]);
        if (isValid) isValid = validateColumn(sudoku, j, current[n]);
        if (isValid) isValid = validateField(sudoku, i, j, current[n]);

        if (isValid) possibleValues.push(current[n]);
        else changed = true;
      }
      sudoku[i][j] = possibleValues;
    }
  }
  return [changed, sudoku];
};

function validateColumn(sudoku: SudokuType, column: number, value: digit) {
  for (let i = 0; i < sudoku.length; i++) {
    if (sudoku[i][column] === value) {
      return false;
    }
  }

  return true;
}

function validateRow(sudoku: SudokuType, row: number, value: digit) {
  for (let i = 0; i < sudoku[row].length; i++) {
    if (sudoku[row][i] === value) {
      return false;
    }
  }

  return true;
}

function validateField(
  sudoku: SudokuType,
  row: number,
  column: number,
  value: digit
) {
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(column / 3) * 3;

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (sudoku[boxRow + r][boxCol + c] === value) return false;
    }
  }
  return true;
}
