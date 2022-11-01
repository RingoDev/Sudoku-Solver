import React from "react";

interface PossibleGridProps {
  values: number[];
}

const PossibleGrid: React.FC<PossibleGridProps> = ({ values }) => {
  return (
    <div
      className={
        "grid aspect-square w-full grid-cols-3 text-[0.5rem] md:text-lg"
      }
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((currentNumber, i) => (
        <div
          key={i}
          className={"flex aspect-square items-center justify-center"}
        >
          {values.includes(currentNumber) ? currentNumber : ""}
        </div>
      ))}
    </div>
  );
};
export default PossibleGrid;
