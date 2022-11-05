import { createContext } from "react";
import { SudokuListType } from "../lib/SudokuUtils";

const sudokuContext = createContext<SudokuListType>(null);
export const SudokuContextProvider = sudokuContext.Provider;
export const SudokuContextConsumer = sudokuContext.Consumer;
