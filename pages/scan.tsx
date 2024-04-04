import React from "react";
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
