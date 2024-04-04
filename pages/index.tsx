import React, { useContext } from "react";
import Solver from "../src/components/solving/solver";
import Head from "next/head";
import { SudokuContext } from "../src/contexts/sudoku-context";

const App = () => {
  const sudokuContext = useContext(SudokuContext);
  return (
    <>
      <Head>
        <title>Sudoku Solver | RingoDev</title>
      </Head>
      <Solver sudoku={sudokuContext.sudoku} />
    </>
  );
};

export default App;
