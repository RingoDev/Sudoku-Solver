import React from "react";
import { SudokuGridType } from "../../lib/SudokuUtils";
import Picture from "./Picture";

interface ScannerProps {
  solveSudoku: (val: SudokuGridType) => void;
}

const Scanner: React.FC<ScannerProps> = (props) => {
  return (
    <>
      <Picture solveSudoku={props.solveSudoku} />
      {/*<Video solveSudoku={props.solveSudoku} />*/}
    </>
  );
};

export default Scanner;
