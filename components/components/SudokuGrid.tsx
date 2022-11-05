import React from "react";
import { digit, SudokuListType } from "../../lib/SudokuUtils";
import MiddleGrid from "./middle-grid";

interface SudokuGridProps {
  sudoku: SudokuListType;
  setSelected: (number) => void;
  selected: number;
  setNumber: (number: digit, index: number) => void;
}

const SudokuGrid: React.FC<SudokuGridProps> = ({
  sudoku,
  setSelected,
  selected,
  setNumber,
}) => {
  const getTransformedIndices = (middleGridIndex): any => {
    return [0, 1, 2, 9, 10, 11, 18, 19, 20].map(
      (v) =>
        v +
        3 * Math.floor(middleGridIndex % 3) +
        27 * Math.floor(middleGridIndex / 3)
    );
  };
  return (
    <div
      className={
        "mx-auto aspect-square p-4 sm:p-8 md:max-h-[90vh] md:w-[1024px] md:max-w-[90vh] md:p-16 "
      }
    >
      <div className={"grid aspect-square grid-cols-3 gap-1 outline outline-4"}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
          <div
            key={index}
            className={"grid w-full grid-cols-3 gap-1 outline outline-1"}
          >
            <MiddleGrid
              setNumber={setNumber}
              selected={selected}
              setSelected={(innerIndex) => {
                setSelected(getTransformedIndices(index)[innerIndex]);
              }}
              gridIndex={index}
              values={getTransformedIndices(index).map((x) => sudoku[x])}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SudokuGrid;
