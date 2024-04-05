import { createContext } from "react";
import { SudokuListType, createEmptySudoku } from "../lib/utils/sudoku";

const sudokuContext = createContext<{
  sudoku: SudokuListType | undefined;
  setSudoku: (_: SudokuListType | undefined) => void;
}>({
  sudoku: createEmptySudoku(),
  setSudoku: (_: SudokuListType | undefined) => {},
});

export const SudokuContext = sudokuContext;
export const SudokuContextProvider = sudokuContext.Provider;
export const SudokuContextConsumer = sudokuContext.Consumer;
