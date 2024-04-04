import { copyGrid, digit, SudokuGridType } from "../utils/sudoku";

type position = [row: number, column: number];

//https://www.sudokuwiki.org/Hidden_Candidates#HP

// check for a combination of 2 numbers that only appear together and 2 times
export default function hiddenPairs(
  input: SudokuGridType,
): [boolean, SudokuGridType] {
  const sudoku = copyGrid(input);
  let changed = false;
  for (let rowIndex = 0; rowIndex < sudoku.length; rowIndex++) {
    for (let colIndex = 0; colIndex < sudoku[rowIndex].length; colIndex++) {
      const current = sudoku[rowIndex][colIndex];
      if (typeof current === "number") continue;

      let found: [position, [number, number]] | undefined;

      found = hiddenPairRow(sudoku, [rowIndex, colIndex]);
      if (found !== undefined) {
        console.debug(
          "Found a hidden Pair in row",
          [rowIndex, colIndex],
          found,
        );
        if (removeFromFields(sudoku, found, [rowIndex, colIndex]))
          changed = true;
      }

      found = hiddenPairColumn(sudoku, [rowIndex, colIndex]);
      if (found !== undefined) {
        console.debug(
          "Found a hidden Pair in column ",
          [rowIndex, colIndex],
          found,
        );
        if (removeFromFields(sudoku, found, [rowIndex, colIndex]))
          changed = true;
      }

      found = hiddenPair3x3(sudoku, [rowIndex, colIndex]);
      if (found !== undefined) {
        // we have a naked pair in this 3x3, we can erase its occurrences in all other possibility-arrays in this 3x3
        console.debug(
          "Found a hidden Pair in 3x3 ",
          [rowIndex, colIndex],
          found,
        );
        if (removeFromFields(sudoku, found, [rowIndex, colIndex]))
          changed = true;
      }
    }
  }
  return [changed, sudoku];
}

function removeNonPair(
  sudoku: SudokuGridType,
  field: digit[],
  pair: [number, number],
  pos: [rowIndex: number, colIndex: number],
) {
  let changed = false;
  const [newPossibles1, includedVal1] = filter(field, pair, true);
  if (includedVal1) {
    changed = true;
    sudoku[pos[0]][pos[1]] = newPossibles1;
  }
  return changed;
}

/**
 * finds the position of the corresponding part of the hidden pair
 * @param sudoku
 * @param pos the current position in the sudoku
 * @return the position of the counterpart of the hidden pair and the values of the pair
 */
function hiddenPairRow(
  sudoku: SudokuGridType,
  pos: position,
): [position, [number, number]] | undefined {
  const [row, column] = pos;

  const first = sudoku[row][column];
  if (typeof first === "number") return;

  // iterate over the columns of the row
  for (let j = 0; j < sudoku.length; j++) {
    if (j === column) continue; // dont check pair against itself
    const current = sudoku[row][j];
    if (typeof current === "number") continue;

    // we need to check if we share at least 2 values with the partner
    let overlap = getOverlap(first, current);
    // we dont share 2 or more values so discard
    if (overlap.length < 2) continue;

    // now we can filter our overlap against every field in this row except for first and current candidate
    // iterate over the columns of the row again
    for (let x = 0; x < sudoku.length; x++) {
      if (x === column || x === j) continue; // dont check pair against first and current
      const temp = sudoku[row][x];

      // not interested in solved cells
      if (typeof temp === "number") continue;
      overlap = overlap.filter((v) => !temp.includes(v));
    }
    if (overlap.length === 2)
      return [
        [row, j],
        [overlap[0], overlap[1]],
      ];
  }
}

function getOverlap(array1: digit[], array2: digit[]): digit[] {
  const result: digit[] = [];
  for (let x of array1) {
    if (array2.includes(x)) result.push(x);
  }
  return result;
}

/**
 * finds the position of the corresponding part of the hidden pair in the column
 * @param sudoku
 * @param pos the current position in the sudoku
 * @return the position of the counterpart of the hidden pair and the values of the pair
 */
function hiddenPairColumn(
  sudoku: SudokuGridType,
  pos: position,
): [position, [number, number]] | undefined {
  const [row, column] = pos;

  const first = sudoku[row][column];
  if (typeof first === "number") return;

  // iterate over the rows of the column
  for (let i = 0; i < sudoku.length; i++) {
    if (i === row) continue; // dont check pair against itself
    const current = sudoku[i][column];
    if (typeof current === "number") continue;

    // we need to check if we share at least 2 values with the partner
    let overlap = getOverlap(first, current);
    // we dont share 2 or more values so discard
    if (overlap.length < 2) continue;

    // now we can filter our overlap against every field in this row except for first and current candidate
    // iterate over the rows of the column again
    for (let x = 0; x < sudoku.length; x++) {
      if (x === row || x === i) continue; // dont check pair against first and current
      const temp = sudoku[x][column];

      // not interested in solved cells
      if (typeof temp === "number") continue;
      overlap = overlap.filter((v) => !temp.includes(v));
    }
    if (overlap.length === 2)
      return [
        [i, column],
        [overlap[0], overlap[1]],
      ];
  }
}

/**
 * finds the position of the corresponding part of the hidden pair in the 3x3
 * @param sudoku
 * @param pos the current position in the sudoku
 * @return the position of the counterpart of the hidden pair and the values of the pair
 */
function hiddenPair3x3(
  sudoku: SudokuGridType,
  pos: position,
): [position, [number, number]] | undefined {
  const [row, column] = pos;

  const first = sudoku[row][column];
  if (typeof first === "number") return;

  // iterate over the fields of the 3x3
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(column / 3) * 3;

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (boxRow + r === row && boxCol + c === column) continue; // dont check pair against itself
      const current = sudoku[boxRow + r][boxCol + c];
      if (typeof current === "number") continue;

      // we need to check if we share at least 2 values with the partner
      let overlap = getOverlap(first, current);
      // we dont share 2 or more values so discard
      if (overlap.length < 2) continue;

      // now we can filter our overlap against every field in this 3x3 except for first and current candidate
      // iterate over the fields of the 3x3 again
      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
          if (
            (boxRow + x === row && boxCol + y === column) ||
            (x === r && y === c)
          )
            continue; // dont check pair against first and current
          const temp = sudoku[boxRow + x][boxCol + y];
          // not interested in solved cells
          if (typeof temp === "number") continue;
          overlap = overlap.filter((v) => !temp.includes(v));
        }
      }
      if (overlap.length === 2)
        return [
          [boxRow + r, boxCol + c],
          [overlap[0], overlap[1]],
        ];
    }
  }
}

function removeFromFields(
  sudoku: SudokuGridType,
  found: [[row: number, column: number], [number, number]],
  pos: [rowIndex: number, colIndex: number],
) {
  const [rowIndex, colIndex] = pos;
  const [[row, col], pair] = found;

  let changed = false;

  const field1 = sudoku[rowIndex][colIndex];
  const field2 = sudoku[row][col];

  if (typeof field1 === "number" || typeof field2 === "number") return; // should never happen

  if (removeNonPair(sudoku, field1, pair, [rowIndex, colIndex])) changed = true;
  if (removeNonPair(sudoku, field2, pair, [row, col])) changed = true;
  return changed;
}

/**
 * Removes certain values from an array and also returns true if something was changed
 * if opposite is set to true, removes all values but the ones passed in
 * @param array the array to filter
 * @param values the values to keep
 * @param opposite
 */
function filter(
  array: digit[],
  values: number[],
  opposite: boolean = false,
): [digit[], boolean] {
  console.debug("Filtering array: " + array + " from numbers: " + values);

  let result: digit[];
  let changed = false;
  result = array.filter((v) => {
    if (!opposite) {
      if (values.includes(v)) {
        changed = true;
        return false;
      }
      return true;
    } else {
      if (!values.includes(v)) {
        changed = true;
        return false;
      }
      return true;
    }
  });

  // console.debug("Returning the filtered array: " + result + "and the result has " + (changed ? "" : "not ") + "changed")
  return [result, changed];
}
