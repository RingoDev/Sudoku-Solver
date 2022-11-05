import React from "react";

interface PossibleGridProps {
  values: number[];
}

const PossibleGrid: React.FC<PossibleGridProps> = ({ values }) => {
  return (
    <div
      className={
        "xl:text-md grid aspect-square w-full grid-cols-3 text-xs leading-3 sm:text-xs md:text-[0.75rem] lg:text-[0.8rem] 2xl:text-lg"
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
