// reshapes numbers to fields
// export const byFields = (sudoku: SudokuType) => {
//     const result = [];
//     for (let m = 0; m < 3; m++) {
//         const bigRow = [];
//         for (let n = 0; n < 3; n++) {
//             let field = [];
//             for (let i = 0; i < 3; i++) {
//                 let row = [];
//                 for (let j = 0; j < 3; j++) {
//                     row.push(sudoku[i + 3 * m][j + 3 * n]);
//                 }
//                 field.push(row);
//             }
//             bigRow.push(field);
//         }
//         result.push(bigRow);
//     }
//     return result;
// };

// export const byNumbers = (sudoku: SudokuType) => {
//     return sudoku.flatMap((x) => x);
// };

// const getColFromIndex = (index: number) => {
//     return Math.round(index) % 9;
// };
//
// const getRowFromIndex = (index: number) => {
//     return Math.floor(Math.round(index) / 9);
// };

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

export const gridToList = (sudoku: SudokuGridType): SudokuListType => {
  return sudoku.flatMap((x) => x).map((x) => (typeof x === "number" ? [x] : x));
};

export const listToGrid = (sudoku: SudokuListType): SudokuGridType => {
  const result: SudokuGridType = [];

  for (let i = 0; i < 9; i++) {
    const sRow: (digit | digit[])[] = [];
    for (let j = 0; j < 9; j++) {
      let sNumber: digit | digit[];
      const possibleValues = sudoku[i * 9 + j];
      possibleValues.length === 1
        ? sRow.push(possibleValues[0])
        : sRow.push(possibleValues);
    }
    result.push(sRow);
  }
  return result;
};

export const copy = (sudoku: SudokuListType) => {
  const result: SudokuListType = [];
  for (let digits of sudoku) {
    result.push(digits);
  }
  return result;
};

export const copyGrid = (sudoku: SudokuGridType) => {
  const result: SudokuGridType = [];
  for (let row of sudoku) {
    const sRow: (digit | digit[])[] = [];
    for (let number of row) {
      sRow.push(typeof number === "number" ? number : Array.from(number));
    }
    result.push(sRow);
  }
  return result;
};

export const fromString = (string: string): SudokuListType => {
  if (string.length !== 81) return [];

  const result: SudokuListType = [];

  for (let i = 0; i < 81; i++) {
    const number = Number(string.charAt(i));
    result.push(number == 0 ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [number as digit]);
  }
  return result;
};

export type SudokuListType = digit[][];
export type SudokuGridType = (digit | digit[])[][];
export type digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
