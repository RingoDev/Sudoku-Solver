import { createContext } from "react";
import { SudokuListType, createEmptySudoku } from "../lib/utils/sudoku";

const sudokuContext = createContext<SudokuListType>(createEmptySudoku());
export const SudokuContextProvider = sudokuContext.Provider;
export const SudokuContextConsumer = sudokuContext.Consumer;
