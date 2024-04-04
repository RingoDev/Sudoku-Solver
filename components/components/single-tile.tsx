import React from "react";
import InnerField from "./InnerField";
import { digit } from "../../lib/SudokuUtils";
import PossibleGrid from "./possible-grid";

interface SudokuSingleProps {
  setSelected: (index: number) => void;
  selected: number;
  index: number;
  possibleValues: digit[];
  setNumber: (number: digit) => void;
}

const SingleTile: React.FC<SudokuSingleProps> = ({
  selected,
  possibleValues,
  index,
  setNumber,
}) => {
  const handleChange = (event) => {
    const number = Number(event.target.value);
    if (!isNaN(number)) {
      setNumber((number % 10) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9);
    }
  };

  if (index === selected) {
    return (
      <input
        className={
          "box-border max-w-[90%] max-h-[90%] cursor-pointer items-center justify-center text-center"
        }
        style={{MozAppearance: "textfield"}}
        value={possibleValues.length === 1 ? possibleValues[0] : ""}
        onChange={handleChange}
        type={"number"}
        autoFocus={true}
      />
    );
  }

  return possibleValues.length === 1 ? (
    <InnerField value={possibleValues[0]} />
  ) : (
    <PossibleGrid values={possibleValues} />
  );
};

export default SingleTile;
