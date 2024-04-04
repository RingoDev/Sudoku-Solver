import React from "react";
import { SudokuGridType } from "../../lib/utils/sudoku";

import dynamic from "next/dynamic";

const Picture = dynamic(() => import("./Picture"), {
  ssr: false,
});

interface ScannerProps {
  // solveSudoku: (val: SudokuGridType) => void;
}

const Scanner: React.FC<ScannerProps> = (props) => {
  return (
    <>
      <Picture />
      {/*<Video solveSudoku={props.solveSudoku} />*/}
    </>
  );
};

export default Scanner;
