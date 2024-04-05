import SingleTile from "./single-tile";
import React from "react";
import { digit } from "../../lib/utils/sudoku";

interface Props {
  showPossibleValues: boolean;
  setSelected: (_index: number) => void;
  selected: number;
  setNumber: (_value: digit, _index: number) => void;
  values: digit[][];
  gridIndex: number;
}

function normalizeIndex(middleGridIndex: number, innerIndex: number): number {
  return [0, 1, 2, 9, 10, 11, 18, 19, 20].map(
    (v) =>
      v +
      3 * Math.floor(middleGridIndex % 3) +
      27 * Math.floor(middleGridIndex / 3),
  )[innerIndex];
}

const MiddleGrid = ({
  showPossibleValues,
  setSelected,
  selected,
  setNumber,
  values,
  gridIndex,
}: Props) => (
  <>
    {values.map((possibleValues, index) => (
      <div
        key={index}
        className={
          "align-center flex aspect-square w-full flex-col items-center justify-center text-center text-2xl outline outline-1 outline-offset-2 outline-slate-500"
        }
        onClick={() => {
          setSelected(index);
          console.log("select", index);
        }}
      >
        <SingleTile
          showPossibleValues={showPossibleValues}
          setSelected={setSelected}
          selected={selected}
          index={normalizeIndex(gridIndex, index)}
          setNumber={(number) =>
            setNumber(number, normalizeIndex(gridIndex, index))
          }
          possibleValues={possibleValues}
        />
      </div>
    ))}
  </>
);
export default MiddleGrid;
