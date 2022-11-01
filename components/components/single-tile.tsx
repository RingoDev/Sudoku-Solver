import React from "react";
import InnerField from "./InnerField";
import { digit } from "../../lib/SudokuUtils";
import PossibleGrid from "./possible-grid";

interface SudokuSingleProps {
  setSelected: (index: number) => void;
  selected: number;
  index: number;
  value: number | number[];
  setNumber: (number: digit) => void;
}

const SingleTile: React.FC<SudokuSingleProps> = ({
  selected,
  value,
  index,
  setNumber,
}) => {
  const handleChange = (event) => {
    const number = Number(event.target.value);
    console.log("Test");
    if (!isNaN(number)) {
      console.log("is number");
      setNumber((number % 10) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9);
    }
  };

  if (index === selected) {
    const val = value;
    return (
      <input
        className={
          "flex aspect-square max-w-[50%] cursor-pointer items-center justify-center text-center"
        }
        value={typeof val === "number" && val !== 0 ? val : ""}
        onChange={handleChange}
        type={"number"}
        autoFocus={true}
      />
    );
  }

  return (
    <>
      {typeof value === "number" ? (
        <InnerField value={value} />
      ) : (
        <PossibleGrid values={value} />
      )}
    </>
  );
};

export default SingleTile;
