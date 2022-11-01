import React from "react";
import { SudokuType } from "../../lib/SudokuUtils";
import Picture from "./Picture";

interface ScannerProps {
  solveSudoku: (val: SudokuType) => void;
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
