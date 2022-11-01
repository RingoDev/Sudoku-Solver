import React from "react";
import Solver from "../components/solving/solver";
import { fromString } from "../lib/SudokuUtils";
import { samples } from "../lib/sampleSudokus";
import Head from "next/head";

const App = () => {
  return (
    <>
      <Head>
        <title>Sudoku Solver | RingoDev</title>
      </Head>
      <Solver sudoku={fromString(samples[2])} />
    </>
  );
};

export default App;
