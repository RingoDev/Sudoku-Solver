import React from "react";

interface PossibleGridProps {
  values: number[];
}

const PossibleGrid: React.FC<PossibleGridProps> = ({ values }) => {
  return (
    <div
      className={
        "xl:text-md grid aspect-square w-full grid-cols-3 gap-[0.125rem] text-[0.5rem] leading-none sm:text-xs md:text-[0.75rem] lg:text-[0.8rem] 2xl:text-lg"
      }
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((currentNumber, i) => (
        <div
          key={i}
          className={
            "flex aspect-square items-center justify-center outline outline-[0.5px] outline-offset-1 outline-slate-500"
          }
        >
          {values.includes(currentNumber) ? currentNumber : ""}
        </div>
      ))}
    </div>
  );
};
export default PossibleGrid;
