import { createContext } from "react";
import { SudokuListType, createEmptySudoku } from "../lib/utils/sudoku";

const sudokuContext = createContext({
  sudoku: createEmptySudoku(),
  setSudoku: (_: SudokuListType) => {},
});

export const SudokuContext = sudokuContext;
export const SudokuContextProvider = sudokuContext.Provider;
export const SudokuContextConsumer = sudokuContext.Consumer;
