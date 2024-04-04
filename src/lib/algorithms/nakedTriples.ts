import { copyGrid, digit, SudokuGridType } from "../utils/sudoku";

type position = [row: number, column: number];
type triple = [number, number, number];
// const sudokuValues = [1, 2, 3, 4, 5, 6, 7, 8, 9]

//https://www.sudokuwiki.org/Naked_Candidates#NP

// doesnt find xy,yz,xz todo
export default function nakedTriples(
  input: SudokuGridType,
): [boolean, SudokuGridType] {
  const sudoku = copyGrid(input);
  let changed = false;

  for (let rowIndex = 0; rowIndex < sudoku.length; rowIndex++) {
    for (let colIndex = 0; colIndex < sudoku[rowIndex].length; colIndex++) {
      const current = sudoku[rowIndex][colIndex];
      if (typeof current === "number") continue;
      // console.debug("LOOKING AT FIELD " + [rowIndex, colIndex])

      // only look into fields with length 2 or 3
      if (current.length > 3) continue;

      // coordinates of first and second occurrence and the values of our triple
      let found: [position, position, triple] | undefined;

      found = nakedTripleRow(sudoku, [rowIndex, colIndex]);
      if (found !== undefined) {
        const [[, col1], [, col2], triple] = found;

        console.debug(
          "Found a naked Triple in Row",
          [rowIndex, colIndex],
          "column of first: " + col1,
          "column of second: " + col2,
          " With values: " + triple,
        );
        // we have a naked triple in this row, we can erase its occurrences in all other possibility-arrays in this row
        for (let x = 0; x < sudoku.length; x++) {
          if (colIndex === x || col1 === x || col2 === x) continue; // leave the found triples and ourself out
          const value = sudoku[rowIndex][x];
          if (typeof value === "number") continue; // we don't need solved cells
          const [newPossibles, includedVal] = filter(value, triple);
          if (includedVal) {
            changed = true;
            sudoku[rowIndex][x] = newPossibles;
          }
        }
      }

      found = nakedTripleColumn(sudoku, [rowIndex, colIndex]);
      if (found !== undefined) {
        const [[row1], [row2], triple] = found;

        console.debug(
          "Found a naked Triple in Column",
          [rowIndex, colIndex],
          [row1],
          [row2],
          " With values: " + triple,
        );

        // we have a naked triple in this column, we can erase its occurrences in all other possibility-arrays in this column
        for (let x = 0; x < sudoku.length; x++) {
          if (rowIndex === x || row1 === x || row2 === x) continue; // leave the found triples and ourself out
          const value = sudoku[x][colIndex];
          if (typeof value === "number") continue; // we don't need solved cells
          const [newPossibles, includedVal] = filter(value, triple);
          if (includedVal) {
            changed = true;
            sudoku[x][colIndex] = newPossibles;
          }
        }
      }

      found = nakedTriple3x3(sudoku, [rowIndex, colIndex]);
      if (found !== undefined) {
        const [[row1, col1], [row2, col2], triple] = found;

        console.debug(
          "Found a naked Triple in 3x3",
          [rowIndex, colIndex],
          [row1, col1],
          [row2, col2],
          " With values: " + triple,
        );
        // we have a naked triple in this 3x3, we can erase its occurrences in all other possibility-arrays in this 3x3

        const boxRow = Math.floor(rowIndex / 3) * 3;
        const boxCol = Math.floor(colIndex / 3) * 3;

        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            if (
              (rowIndex === boxRow + r && colIndex === boxCol + c) ||
              (row1 === boxRow + r && col1 === boxCol + c) ||
              (row2 === boxRow + r && col2 === boxCol + c)
            )
              continue; // leave the found triples and ourself out
            const value = sudoku[boxRow + r][boxCol + c];
            if (typeof value === "number") continue;
            const [newPossibles, includedVal] = filter(value, triple);
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
 * finds the 2 positions of the 2 corresponding parts of the naked triple
 * @param sudoku
 * @param pos the current position in the sudoku
 * @return the 2 positions of the counterparts of the naked triple and the 3 values of the triple or undefined if none was found
 */
function nakedTripleRow(
  sudoku: SudokuGridType,
  pos: position,
): [position, position, [number, number, number]] | undefined {
  for (let j = 0; j < sudoku.length - 1; j++) {
    let second = findNextInRow(sudoku, pos, j);
    if (second === undefined) continue;

    for (let x = second[1] + 1; x < sudoku.length; ) {
      // search for third from Col of last found field
      const third = findNextInRow(sudoku, pos, x);

      // found no third candidate so we can return
      if (third === undefined) return;

      const values = getValues(sudoku, pos, second, third);
      if (values.length === 3) {
        return [second, third, values as [number, number, number]];
      }

      // the three field have more then 3 distinct values so look for a next third field
      x = third[1] + 1;
    }
  }
}

/**
 * finds the next field with 2 or 3 values
 * @param sudoku
 * @param pos the current position in the sudoku
 * @param fromCol the columnIndex from where to look for the second field
 */
function findNextInRow(
  sudoku: SudokuGridType,
  pos: position,
  fromCol: number,
): position | undefined {
  const [row, column] = pos;

  for (let j = fromCol; j < sudoku.length; j++) {
    if (j === column) continue; // dont check pair against itself
    const current = sudoku[row][j];
    if (typeof current === "number") continue;
    if (current.length > 3) continue;
    // we only get here if the field is not the same coordinates and has 2 or 3 values
    return [row, j];
  }
}

/**
 * finds the 2 positions of the 2 corresponding parts of the naked triple in this column
 * @param sudoku
 * @param pos the current position in the sudoku
 * @return the 2 positions of the counterparts of the naked triple and the 3 values of the triple or undefined if none was found
 */
function nakedTripleColumn(
  sudoku: SudokuGridType,
  pos: position,
): [position, position, [number, number, number]] | undefined {
  for (let i = 0; i < sudoku.length - 1; i++) {
    let second = findNextInColumn(sudoku, pos, i);
    if (second === undefined) continue;

    for (let x = second[0] + 1; x < sudoku.length; ) {
      // search for third from lsat found field
      const third = findNextInColumn(sudoku, pos, x);

      // found no third candidate so we can return
      if (third === undefined) return;

      const values = getValues(sudoku, pos, second, third);

      if (values.length === 3) {
        return [second, third, values as [number, number, number]];
      }
      // the three field have more then 3 distinct values so look for a next third field
      x = third[0] + 1;
    }
  }
}

/**
 * finds the next field with 2 or 3 values
 * @param sudoku
 * @param pos the current position in the sudoku
 * @param fromRow the rowIndex from where to look for the second field
 */
function findNextInColumn(
  sudoku: SudokuGridType,
  pos: position,
  fromRow: number,
): position | undefined {
  const [row, column] = pos;
  for (let i = fromRow; i < sudoku.length; i++) {
    if (i === row) continue; // dont check pair against itself
    const current = sudoku[i][column];
    if (typeof current === "number") continue;
    if (current.length > 3) continue;
    // we only get here if the field is not the same coordinates and has 2 or 3 values
    return [i, column];
  }
}

function nakedTriple3x3(
  sudoku: SudokuGridType,
  pos: position,
): [position, position, [number, number, number]] | undefined {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      let second = findNextIn3x3(sudoku, pos, [r, c]);
      if (second === undefined) continue;
      // console.debug("Found second to " + pos + " " + second)

      const [secBoxRow, secBoxCol] = second[1];

      for (let r = secBoxRow; r < 3; r++) {
        for (let c = 0; c < 3; ) {
          if (secBoxRow === r && secBoxCol >= c) {
            c++;
            continue;
          }

          let third = findNextIn3x3(sudoku, pos, [r, c]);

          // found no third candidate so we can return
          if (third === undefined) return;

          // console.debug("Found third to " + pos + " " + second + "  " + third)

          const values = getValues(sudoku, pos, second[0], third[0]);
          if (values.length === 3) {
            return [second[0], third[0], values as [number, number, number]];
          }

          // the three field have more then 3 distinct values so look for a next third field
          r = third[1][0];
          c = third[1][1] + 1;
        }
      }
    }
  }
}

/**
 * finds the next field with 2 or 3 values
 * @param sudoku
 * @param pos the current position in the sudoku
 * @param fromPos the row and col in the 3x3 to check from for the next field
 * @return the global coordinates of the next field and the box coordinates of the next field
 */
function findNextIn3x3(
  sudoku: SudokuGridType,
  pos: position,
  fromPos: position,
): [position, position] | undefined {
  const [row, column] = pos;

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(column / 3) * 3;

  // console.debug("Looking for next field in 3x3 from BoxLocation " + fromPos)

  for (let r = fromPos[0]; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (fromPos[0] === r && fromPos[1] > c) continue;

      if (boxRow + r === row && boxCol + c === column) continue; // dont check against current

      const current = sudoku[boxRow + r][boxCol + c];
      if (typeof current === "number") continue;
      if (current.length > 3) continue;
      // we only get here if the field is not the same coordinates and has 2 or 3 values
      return [
        [boxRow + r, boxCol + c],
        [r, c],
      ];
    }
  }
}

function getValues(
  sudoku: SudokuGridType,
  pos1: position,
  pos2: position,
  pos3: position,
) {
  // check if the 3 found fields combined contain exactly 3 different values
  const values1 = sudoku[pos1[0]][pos1[1]];
  const values2 = sudoku[pos2[0]][pos2[1]];
  const values3 = sudoku[pos3[0]][pos3[1]];

  if (
    typeof values1 === "number" ||
    typeof values2 === "number" ||
    typeof values3 === "number"
  )
    return []; // should never happen, is just due to type safety

  return Array.from(new Set([...values1, ...values2, ...values3]));
}

/**
 * Removes certain values from an array and also returns true if something was changed
 * @param array the array to filter
 * @param values the values to keep
 */
function filter(array: digit[], values: number[]): [digit[], boolean] {
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

  // console.debug("Returning the filtered array: " + result + "and the result has " + (changed ? "" : "not ") + "changed")
  return [result, changed];
}
