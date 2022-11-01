// reshapes numbers to fields
export const byFields = (sudoku: SudokuType) => {
  const result = [];
  for (let m = 0; m < 3; m++) {
    const bigRow = [];
    for (let n = 0; n < 3; n++) {
      let field = [];
      for (let i = 0; i < 3; i++) {
        let row = [];
        for (let j = 0; j < 3; j++) {
          row.push(sudoku[i + 3 * m][j + 3 * n]);
        }
        field.push(row);
      }
      bigRow.push(field);
    }
    result.push(bigRow);
  }
  return result;
};

export const byNumbers = (sudoku: SudokuType) => {
  return sudoku.flatMap((x) => x);
};

export const setValueAtIndex = (
  value: digit,
  index: number,
  sudoku: SudokuType
): SudokuType => {
  if (index < 0 || index > 81) {
    console.error("index " + index + "doesnt exist");
    return sudoku;
  }

  const result = copy(sudoku);

  result[getRowFromIndex(index)][getColFromIndex(index)] = value;
  return result;
};

const getColFromIndex = (index: number) => {
  return Math.round(index) % 9;
};

const getRowFromIndex = (index: number) => {
  return Math.floor(Math.round(index) / 9);
};

export const getEmpty = (): digit[][] => {
  return [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
};

export const convert = (sudoku: SudokuType): [boolean, SudokuType] => {
  const result: SudokuType = [];
  let changed = false;
  for (let row of sudoku) {
    const sRow: (digit | digit[])[] = [];
    for (let number of row) {
      let sNumber: digit | digit[];
      if (number === 0) {
        changed = true;
        sNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      } else {
        sNumber = number;
      }
      sRow.push(sNumber);
    }
    result.push(sRow);
  }
  return [changed, result];
};

export const copy = (sudoku: SudokuType) => {
  const result: SudokuType = [];
  for (let row of sudoku) {
    const sRow: (digit | digit[])[] = [];
    for (let number of row) {
      sRow.push(typeof number === "number" ? number : Array.from(number));
    }
    result.push(sRow);
  }
  return result;
};

export const fromString = (string: string): SudokuType => {
  if (string.length !== 81) return [];

  const result: SudokuType = [];

  for (let i = 0; i < 9; i++) {
    const row: (digit | digit[])[] = [];
    for (let j = 0; j < 9; j++) {
      row.push(Number(string.charAt(i * 9 + j)) as digit);
    }
    result.push(row);
  }
  return result;
};

export type SudokuType = (digit | digit[])[][];
export type digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
