import React from "react";
import Solver from "../src/components/solving/solver";
import { SudokuGridType, fromString } from "../src/lib/utils/sudoku";
import { samples } from "../src/lib/sampleSudokus";
import Scanner from "../src/components/scanning/Scanner";
import Head from "next/head";

const Scan = () => {
  return (
    <>
      <Head>
        <title>Sudoku Solver | RingoDev</title>
      </Head>
      <Scanner />
    </>
  );
};

export default Scan;
