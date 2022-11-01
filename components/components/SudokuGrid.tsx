import React from "react";
import { byNumbers, digit, SudokuType } from "../../lib/SudokuUtils";
import SingleTile from "./single-tile";

interface SudokuGridProps {
  sudoku: SudokuType;
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
  return (
    <div
      className={
        "mx-auto grid aspect-square grid-cols-9 p-4 sm:p-8 md:w-[1024px] md:p-16"
      }
    >
      {byNumbers(sudoku).map((value, i) => (
        <div
          onClick={() => {
            setSelected(i);
          }}
          key={i}
          className={
            "flex aspect-square items-center justify-center outline outline-2 -outline-offset-1 outline-black md:text-5xl"
          }
        >
          <SingleTile
            value={value}
            index={i}
            setSelected={setSelected}
            selected={selected}
            setNumber={(value) => setNumber(value, i)}
          />
        </div>
      ))}
    </div>
  );
};

export default SudokuGrid;
