import React, { useContext } from "react";
import Solver from "../src/components/solving/solver";
import Head from "next/head";
import { SudokuContext } from "../src/contexts/sudoku-context";
import { createEmptySudoku } from "../src/lib/utils/sudoku";

const App = () => {
  const sudokuContext = useContext(SudokuContext);
  return (
    <>
      <Head>
        <title>Sudoku Solver | RingoDev</title>
      </Head>
      <Solver
        sudoku={
          sudokuContext.sudoku ? sudokuContext.sudoku : createEmptySudoku()
        }
      />
    </>
  );
};

export default App;
