import React, { useContext, useState } from "react";
import { SudokuListType, digit } from "../../lib/utils/sudoku";
import SudokuGrid from "../sudoku/sudoku-grid";
import { useRouter } from "next/router";
import { SudokuContext } from "../../contexts/sudoku-context";

const ParsedSudoku = ({ sudoku }: { sudoku: SudokuListType }) => {
  const setNumberAtIndex = (value: digit, index: number) => {
    console.info("setting value at index " + index + " to value " + value);
    setDisplayed(displayed.map((v, i) => (i === index ? [value] : v)));
  };

  const router = useRouter();

  const sudokuContext = useContext(SudokuContext);

  const [displayed, setDisplayed] = useState<SudokuListType>(sudoku);
  const [selected, setSelected] = useState<number>(-1);

  const setStartingStateAndNavigate = () => {
    // set global sudoku state to configured sudoku
    sudokuContext.setSudoku(displayed);

    // naviage to solver
    router.push("/solve");
  };

  return (
    <>
      <SudokuGrid
        showPossibleValues={false}
        sudoku={displayed}
        setSelected={setSelected}
        selected={selected}
        setNumber={setNumberAtIndex}
      />
      <div className={"flex justify-center"}>
        <button className={"pb-3"} onClick={setStartingStateAndNavigate}>
          Solve
        </button>
      </div>
    </>
  );
};
export default ParsedSudoku;
