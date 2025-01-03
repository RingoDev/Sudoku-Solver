import { SudokuGridType, copyGrid, digit } from "../utils/sudoku";

//https://www.sudokuwiki.org/Naked_Candidates#NP
export default function nakedPairs(
  input: SudokuGridType,
): [boolean, SudokuGridType] {
  const sudoku = copyGrid(input);
  let changed = false;
  for (let rowIndex = 0; rowIndex < sudoku.length; rowIndex++) {
    for (let colIndex = 0; colIndex < sudoku[rowIndex].length; colIndex++) {
      const current = sudoku[rowIndex][colIndex];
      if (typeof current === "number") continue;
      if (current.length !== 2) continue;
      const pair: [digit, digit] = [current[0], current[1]];
      let found: [row: number, col: number] | undefined;

      found = nakedPairRow(sudoku, rowIndex, colIndex, pair);
      if (found !== undefined) {
        // we have a naked pair in this row, we can erase its occurrences in all other possibility-arrays in this row
        console.debug(
          "Found a naked Pair in row",
          [rowIndex, colIndex],
          found,
          " With values: " + pair,
        );
        for (let x = 0; x < sudoku.length; x++) {
          if (found[1] === x || colIndex === x) continue; // leave our counterpart and ourself out
          const value = sudoku[rowIndex][x];
          if (typeof value === "number") continue;
          const [newPossibles, includedVal] = filter(value, pair);
          if (includedVal) {
            changed = true;
            sudoku[rowIndex][x] = newPossibles;
          }
        }
      }

      found = nakedPairColumn(sudoku, rowIndex, colIndex, pair);
      if (found !== undefined) {
        const [row] = found;

        console.debug(
          "Found a naked Pair in column ",
          [rowIndex, colIndex],
          found,
          " With values: " + pair,
        );
        // we have a naked pair in this column, we can erase its occurrences in all other possibility-arrays in this column except counterpart
        for (let x = 0; x < sudoku.length; x++) {
          if (row === x || rowIndex === x) continue; // leave our counterpart and ourself out
          const value = sudoku[x][colIndex];
          if (typeof value === "number") continue;
          const [newPossibles, includedVal] = filter(value, pair);
          if (includedVal) {
            changed = true;
            sudoku[x][colIndex] = newPossibles;
          }
        }
      }

      found = nakedPair3x3(sudoku, rowIndex, colIndex, pair);
      if (found !== undefined) {
        // we have a naked pair in this 3x3, we can erase its occurrences in all other possibility-arrays in this 3x3
        console.debug(
          "Found a naked Pair in 3x3 ",
          [rowIndex, colIndex],
          found,
          " With values: " + pair,
        );

        const boxRow = Math.floor(rowIndex / 3) * 3;
        const boxCol = Math.floor(colIndex / 3) * 3;

        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            if (
              (found[0] === boxRow + r && found[1] === boxCol + c) ||
              (rowIndex === boxRow + r && colIndex === boxCol + c)
            )
              continue; // leave our counterpart out
            const value = sudoku[boxRow + r][boxCol + c];
            if (typeof value === "number") continue;
            const [newPossibles, includedVal] = filter(value, pair);
            if (includedVal) {
              changed = true;
              sudoku[boxRow + r][boxCol + c] = newPossibles;
            }
          }
        }
      }
    }
  }
  return [changed, sudoku];
}

/**
 *
 * @param array
 * @param values
 */
function filter(array: digit[], values: [digit, digit]): [digit[], boolean] {
  console.debug("Filtering array: " + array + " from numbers: " + values);

  let result: digit[];
  let changed = false;
  result = array.filter((v) => {
    if (values.includes(v)) {
      changed = true;
      return false;
    }
    return true;
  });
  return [result, changed];
}

// returns the position of the naked pair counterpart in the column if found
function nakedPairColumn(
  sudoku: SudokuGridType,
  row: number,
  column: number,
  pair: [digit, digit],
): [row: number, col: number] | undefined {
  for (let i = 0; i < sudoku.length; i++) {
    if (i === row) continue; // dont check pair against itself
    const current = sudoku[i][column];
    if (typeof current === "number") continue;
    if (current.length !== 2) continue;
    if (current.includes(pair[0]) && current.includes(pair[1]))
      return [i, column];
  }
}

// returns the position of the naked pair counterpart in the row if found
function nakedPairRow(
  sudoku: SudokuGridType,
  row: number,
  column: number,
  pair: [digit, digit],
): [row: number, col: number] | undefined {
  for (let i = 0; i < sudoku.length; i++) {
    if (i === column) continue; // dont check pair against itself
    const current = sudoku[row][i];
    if (typeof current === "number") continue;
    if (current.length !== 2) continue;
    if (current.includes(pair[0]) && current.includes(pair[1])) return [row, i];
  }
}

/**
 * @param sudoku
 * @param row the row index the input pair is located at
 * @param column the column index the input pair is located at
 * @param pair the value of the input pair to check
 */
function nakedPair3x3(
  sudoku: SudokuGridType,
  row: number,
  column: number,
  pair: [digit, digit],
): [row: number, col: number] | undefined {
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(column / 3) * 3;

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (boxCol + c === column && boxRow + r === row) continue; // dont check pair against itself
      const current = sudoku[boxRow + r][boxCol + c];
      if (typeof current === "number") continue;
      if (current.length !== 2) continue;
      if (current.includes(pair[0]) && current.includes(pair[1]))
        return [boxRow + r, boxCol + c];
    }
  }
}
