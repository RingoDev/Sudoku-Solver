import React from "react";
import Solver from "../src/components/solving/solver";
import { fromString } from "../src/lib/utils/sudoku";
import { samples } from "../src/lib/sampleSudokus";
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
