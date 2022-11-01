import { SudokuType } from "./SudokuUtils";
import algorithms from "./algorithms/algorithms";

export class StepSolver {
  private history: [col: number, row: number, value: number][] = [];
  private waysToSolve: ((sudoku: SudokuType) => [boolean, SudokuType])[] = [];
  private states: SudokuType[] = [];
  private startState;

  constructor(sudoku: SudokuType) {
    this.startState = sudoku;
    this.waysToSolve = algorithms;
  }

  nextStep() {
    // do the next thing

    let sudokuSolved = false;
    while (!sudokuSolved) {
      let sudoku: SudokuType;
      if (this.states.length === 0) sudoku = this.startState;
      else sudoku = this.states[this.states.length - 1];
      for (let i = 0; i < this.waysToSolve.length; i++) {
        let [successful, newSudoku] = this.waysToSolve[i](sudoku);

        // if the algorithm was able to change something, set sudoku as new state and start from first algorithm
        if (successful) {
          this.states.push(newSudoku);
          break;
        }
        // if the algorithm didn't help, try the next one
      }
    }
  }
}
