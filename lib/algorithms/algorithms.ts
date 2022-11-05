import nakedPairs from "./nakedPairs";
import hiddenSingles from "./hiddenSingles";
import { reducePossibles } from "./reducePossibles";
import nakedTriples from "./nakedTriples";
import hiddenPairs from "./hiddenPairs";
import hiddenTriples from "./hiddenTriples";
import { copyGrid, SudokuGridType } from "../SudokuUtils";

// finds single fields with 1 possible value and reformats
export const checkSolved = (
  input: SudokuGridType
): [boolean, SudokuGridType] => {
  const sudoku = copyGrid(input);
  let changed = false;
  for (let i = 0; i < sudoku.length; i++) {
    for (let j = 0; j < sudoku[i].length; j++) {
      const current = sudoku[i][j];
      if (typeof current === "number" || current.length !== 1) continue;
      changed = true;
      sudoku[i][j] = current[0];
    }
  }
  return [changed, sudoku];
};

const algorithms: ((sudoku: SudokuGridType) => [boolean, SudokuGridType])[] = [
  checkSolved,
  reducePossibles,
  hiddenSingles,
  nakedPairs,
  nakedTriples,
  hiddenPairs,
  hiddenTriples,
];
export default algorithms;
