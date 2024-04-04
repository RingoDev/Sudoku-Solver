import React, { createRef, useRef } from "react";
import { digit, SudokuListType } from "../../lib/utils/sudoku";
import MiddleGrid from "./middle-grid";
import useOnClickOutside from "../../lib/hooks/useOnClickOutside";

interface SudokuGridProps {
  sudoku: SudokuListType;
  setSelected: (number: number) => void;
  selected: number;
  setNumber: (number: digit, index: number) => void;
}

const SudokuGrid: React.FC<SudokuGridProps> = ({
  sudoku,
  setSelected,
  selected,
  setNumber,
}) => {
  const ref = createRef<HTMLDivElement>();
  useOnClickOutside(ref, () => setSelected(-1));

  const getTransformedIndices = (middleGridIndex: number): any => {
    return [0, 1, 2, 9, 10, 11, 18, 19, 20].map(
      (v) =>
        v +
        3 * Math.floor(middleGridIndex % 3) +
        27 * Math.floor(middleGridIndex / 3),
    );
  };
  return (
    <div
      ref={ref}
      className={
        "mx-auto aspect-square p-4 sm:p-8 md:max-h-[90vh] md:w-[1024px] md:max-w-[90vh] md:p-16 "
      }
    >
      <div
        className={
          "grid aspect-square grid-cols-3 gap-1 outline outline-3 outline-offset-1 outline-slate-500"
        }
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
          <div
            key={index}
            className={
              "grid w-full grid-cols-3 gap-1 outline outline-1 outline-offset-2 outline-slate-500"
            }
          >
            <MiddleGrid
              setNumber={setNumber}
              selected={selected}
              setSelected={(innerIndex) => {
                setSelected(getTransformedIndices(index)[innerIndex]);
              }}
              gridIndex={index}
              values={getTransformedIndices(index).map(
                (x: number) => sudoku[x],
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SudokuGrid;
