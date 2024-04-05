import React from "react";
import InnerField from "./value";
import { digit } from "../../lib/utils/sudoku";
import PossibleGrid from "./possible-grid";

interface SudokuSingleProps {
  showPossibleValues: boolean;
  setSelected: (_index: number) => void;
  selected: number;
  index: number;
  possibleValues: digit[];
  setNumber: (_number: digit) => void;
}

const SingleTile: React.FC<SudokuSingleProps> = ({
  showPossibleValues,
  selected,
  possibleValues,
  index,
  setNumber,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        style={{ MozAppearance: "textfield" }}
        value={possibleValues.length === 1 ? possibleValues[0] : ""}
        onChange={handleChange}
        type={"number"}
        autoFocus={true}
      />
    );
  }

  if (possibleValues.length === 1) {
    return <InnerField value={possibleValues[0]} />;
  }

  if (showPossibleValues) {
    return <PossibleGrid values={possibleValues} />;
  }

  return <InnerField value={0} />;
};

export default SingleTile;
