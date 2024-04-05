import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

const Picture = dynamic(() => import("../src/components/scanning/scanner"), {
  ssr: false,
});

const Scan = () => {
  return (
    <>
      <Head>
        <title>Sudoku Solver | RingoDev</title>
      </Head>
      <Picture />
    </>
  );
};

export default Scan;
