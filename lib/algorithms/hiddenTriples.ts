import { copy, digit, SudokuType } from "../SudokuUtils";

type position = [row: number, column: number];

//https://www.sudokuwiki.org/Hidden_Candidates#HP

// check for a combination of 2 numbers that only appear together and 2 times
export default function hiddenTriples(
  input: SudokuType
): [boolean, SudokuType] {
  const sudoku = copy(input);
  let changed = false;
  for (let rowIndex = 0; rowIndex < sudoku.length; rowIndex++) {
    for (let colIndex = 0; colIndex < sudoku[rowIndex].length; colIndex++) {
      const current = sudoku[rowIndex][colIndex];
      if (typeof current === "number") continue;

      let found: [position, position, [number, number, number]] | undefined;

      found = hiddenTripleRow(sudoku, [rowIndex, colIndex]);
      if (found !== undefined) {
        console.debug(
          "Found a hidden Triple in row",
          [rowIndex, colIndex],
          found
        );
        if (
          removeFromFields(
            sudoku,
            [rowIndex, colIndex],
            found[0],
            found[1],
            found[2]
          )
        )
          changed = true;
      }

      found = hiddenTripleColumn(sudoku, [rowIndex, colIndex]);
      if (found !== undefined) {
        console.debug(
          "Found a hidden Triple in column ",
          [rowIndex, colIndex],
          found
        );
        if (
          removeFromFields(
            sudoku,
            [rowIndex, colIndex],
            found[0],
            found[1],
            found[2]
          )
        )
          changed = true;
      }

      found = hiddenTriple3x3(sudoku, [rowIndex, colIndex]);
      if (found !== undefined) {
        // we have a naked pair in this 3x3, we can erase its occurrences in all other possibility-arrays in this 3x3
        console.debug(
          "Found a hidden Triple in 3x3 ",
          [rowIndex, colIndex],
          found
        );
        if (
          removeFromFields(
            sudoku,
            [rowIndex, colIndex],
            found[0],
            found[1],
            found[2]
          )
        )
          changed = true;
      }
    }
  }
  return [changed, sudoku];
}

function removeNonTriple(
  sudoku: SudokuType,
  field: digit[],
  triple: [number, number, number],
  pos: position
) {
  let changed = false;
  const [newPossibles1, includedVal1] = filter(field, triple, true);
  if (includedVal1) {
    changed = true;
    sudoku[pos[0]][pos[1]] = newPossibles1;
  }
  return changed;
}

function reduceOverlapRow(
  sudoku: SudokuType,
  pos: [row: number, column: number],
  j: number,
  k: number,
  overlap: digit[]
) {
  const [row, column] = pos;

  // iterate over the columns of the row again
  for (let x = 0; x < sudoku.length; x++) {
    if (x === column || x === j || x === k) continue; // dont check against first,second and third
    const temp = sudoku[row][x];
    // not interested in solved cells
    if (typeof temp === "number") continue;
    // reduce overlap every iteration
    overlap = overlap.filter((v) => !temp.includes(v));
  }
  return overlap;
}

function reduceOverlapColumn(
  sudoku: SudokuType,
  pos: [row: number, column: number],
  i: number,
  k: number,
  overlap: digit[]
) {
  const [row, column] = pos;

  // iterate over the rows of the column again
  for (let x = 0; x < sudoku.length; x++) {
    if (x === row || x === i || x === k) continue; // dont check against first,second and third
    const temp = sudoku[x][column];
    // not interested in solved cells
    if (typeof temp === "number") continue;
    // reduce overlap every iteration
    overlap = overlap.filter((v) => !temp.includes(v));
  }
  return overlap;
}

/**
 * finds the position of the corresponding part of the hidden pair
 * @param sudoku
 * @param pos the current position in the sudoku
 * @return the position of the counterpart of the hidden pair and the values of the pair
 */
function hiddenTripleRow(
  sudoku: SudokuType,
  pos: position
): [position, position, [number, number, number]] | undefined {
  const [row, column] = pos;

  const first = sudoku[row][column];
  if (typeof first === "number") return;

  // iterate over the columns of the row
  for (let j = 0; j < sudoku.length; j++) {
    if (j === column) continue; // dont check against first
    const second = sudoku[row][j];
    if (typeof second === "number") continue;
    // we dont share 3 or more values so discard
    if (getOverlap([first, second]).length < 3) continue;

    // we share at least 3 values so lets look for a third partner
    for (let k = j + 1; k < sudoku.length; k++) {
      if (k === column || k === j) continue; // dont check against first and second
      const third = sudoku[row][k];
      if (typeof third === "number") continue;

      // we need to check if we share at least 3 values with both fields
      let overlap = getOverlap([first, second, third]);
      // we dont share 3 or more values so discard
      if (overlap.length < 3) continue;

      // now we can filter our overlap against every field in this row
      overlap = reduceOverlapRow(sudoku, [row, column], j, k, overlap);

      // still 3 overlap, this is actually a hidden triple
      if (overlap.length === 3)
        return [
          [row, j],
          [row, k],
          [overlap[0], overlap[1], overlap[2]],
        ];
    }
  }
}

/**
 * returns the overlap between multiple arrays
 * @param arrays
 */
function getOverlap(arrays: digit[][]): digit[] {
  const result: digit[] = [];

  if (arrays.length === 0) return result;
  if (arrays.length === 1) return arrays[0].slice();

  for (let value of arrays[0]) {
    let includes = true;
    for (let array of arrays.slice(1)) {
      if (!array.includes(value)) {
        includes = false;
        break;
      }
    }
    if (includes) result.push(value);
  }
  return result;
}

/**
 * finds the position of the corresponding part of the hidden triple in the column
 * @param sudoku
 * @param pos the current position in the sudoku
 * @return the position of the counterpart of the hidden pair and the values of the triple
 */
function hiddenTripleColumn(
  sudoku: SudokuType,
  pos: position
): [position, position, [number, number, number]] | undefined {
  const [row, column] = pos;

  const first = sudoku[row][column];
  if (typeof first === "number") return;

  // iterate over the rows of the column
  for (let i = 0; i < sudoku.length; i++) {
    if (i === row) continue; // dont check against first
    const second = sudoku[i][column];
    if (typeof second === "number") continue;
    // we dont share 3 or more values so discard
    if (getOverlap([first, second]).length < 3) continue;

    // we share at least 3 values so lets look for a third partner
    for (let k = i + 1; k < sudoku.length; k++) {
      if (k === row || k === i) continue; // dont check against first and second
      const third = sudoku[k][column];
      if (typeof third === "number") continue;

      // we need to check if we share at least 3 values with both fields
      let overlap = getOverlap([first, second, third]);
      // we dont share 3 or more values so discard
      if (overlap.length < 3) continue;

      // now we can filter our overlap against every field in this column
      overlap = reduceOverlapColumn(sudoku, [row, column], i, k, overlap);

      // still 3 overlap, this is actually a hidden triple
      if (overlap.length === 3)
        return [
          [row, i],
          [row, k],
          [overlap[0], overlap[1], overlap[2]],
        ];
    }
  }
}

/**
 * finds the position of the corresponding part of the hidden pair in the 3x3
 * @param sudoku
 * @param pos the current position in the sudoku
 * @return the position of the counterpart of the hidden pair and the values of the pair
 */
function hiddenTriple3x3(
  sudoku: SudokuType,
  [row, column]: position
): [position, position, [number, number, number]] | undefined {
  const first = sudoku[row][column];
  if (typeof first === "number") return;

  // iterate over the fields of the 3x3
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(column / 3) * 3;

  // iterate over the 3x3
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (boxRow + r === row && boxCol + c === column) continue; // dont check pair against itself
      const second = sudoku[boxRow + r][boxCol + c];
      if (typeof second === "number") continue;

      // we dont share 3 or more values so discard
      if (getOverlap([first, second]).length < 3) continue;
      // we share at least 3 values so lets look for a third partner

      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
          if (
            (boxRow + x === row && boxCol + y === column) ||
            (x === r && y === c)
          )
            continue; // dont check against first and second

          const third = sudoku[boxRow + x][boxCol + y];
          if (typeof third === "number") continue;

          // we need to check if we share at least 3 values with both fields
          let overlap = getOverlap([first, second, third]);
          // we dont share 3 or more values so discard
          if (overlap.length < 3) continue;

          // now we can filter our overlap against every field in this 3x3 except for first and current candidate
          overlap = reduceOverlap3x3(
            sudoku,
            [row, column],
            [r, c],
            [x, y],
            overlap
          );

          // still 3 overlap, this is actually a hidden triple
          if (overlap.length === 3)
            return [
              [boxRow + r, boxCol + c],
              [boxRow + x, boxCol + y],
              [overlap[0], overlap[1], overlap[2]],
            ];
        }
      }
    }
  }
}

function reduceOverlap3x3(
  sudoku: SudokuType,
  [row, column]: position,
  [bRowSecond, bColSecond]: position,
  [bRowThird, bColThird]: position,
  overlap: digit[]
) {
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(column / 3) * 3;

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (
        (boxRow + x === row && boxCol + y === column) ||
        (x === bRowSecond && y === bColSecond) ||
        (x === bRowThird && y === bColThird)
      )
        continue; // dont check against first, second and third
      const temp = sudoku[boxRow + x][boxCol + y];
      // not interested in solved cells
      if (typeof temp === "number") continue;
      overlap = overlap.filter((v) => !temp.includes(v));
    }
  }
  return overlap;
}

function removeFromFields(
  sudoku: SudokuType,
  first: position,
  second: position,
  third: position,
  triple: [number, number, number]
) {
  let changed = false;

  const field1 = sudoku[first[0]][first[1]];
  const field2 = sudoku[second[0]][second[1]];
  const field3 = sudoku[third[0]][third[1]];

  if (
    typeof field1 === "number" ||
    typeof field2 === "number" ||
    typeof field3 === "number"
  )
    return false; // should never happen

  if (removeNonTriple(sudoku, field1, triple, first)) changed = true;
  if (removeNonTriple(sudoku, field2, triple, second)) changed = true;
  if (removeNonTriple(sudoku, field3, triple, third)) changed = true;
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
  opposite: boolean = false
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
