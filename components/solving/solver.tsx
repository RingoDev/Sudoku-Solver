import React, { useEffect, useState } from "react";
import styles from "./solver.module.css";
import {
  convert,
  digit,
  setValueAtIndex,
  SudokuType,
} from "../../lib/SudokuUtils";
import SudokuGrid from "../components/SudokuGrid";
import algorithms from "../../lib/algorithms/algorithms";
import {
  ChevronRight,
  ChevronsRight,
  ChevronLeft,
  ChevronsLeft,
} from "lucide-react";
import { bruteForce } from "../../lib/algorithms/bruteForce";

interface SolverProps {
  sudoku: SudokuType;
}

const Solver: React.FC<SolverProps> = (props) => {
  const [solved, setSolved] = useState<SudokuType>();
  const [current, setCurrent] = useState<SudokuType>(props.sudoku);
  const [selected, setSelected] = useState<number>(-1);

  useEffect(() => {
    if (solved === undefined) {
      setSolved(bruteForce(convert(props.sudoku)[1]));
    }
  }, [setSolved, props.sudoku, solved]);

  //eslint-disable-next-line
  const stepBack = () => {
    // todo maybe implement later needs restructuring
  };

  const stepForward = () => {
    console.log("Taking a step forward");

    for (let algo of algorithms) {
      console.log("Trying next algorithm", algo.name);
      let [changed, sudoku] = algo(current);
      if (changed) {
        // step is complete
        setCurrent(sudoku);
        return;
      }
    }
    // we ran through the loop and couldn't find a new value, so we failed :(
    console.debug("No more possible Steps found");
  };
  const goStart = () => {
    console.debug("Going to start");
    setCurrent(props.sudoku);
  };
  const goEnd = () => {
    setCurrent(solved);
  };

  const setNumberAtIndex = (value: digit, index: number) => {
    console.info("setting value at index " + index + " to value " + value);
    setCurrent(setValueAtIndex(value, index, current));
  };

  return (
    <>
      <SudokuGrid
        sudoku={current}
        setSelected={setSelected}
        selected={selected}
        setNumber={setNumberAtIndex}
      />
      <div className={styles.controls}>
        <button aria-label={"to the start"} onClick={goStart}>
          <ChevronsLeft />
        </button>
        <button aria-label={"step back"}>
          <ChevronLeft />
        </button>
        <button aria-label={"step forward"} onClick={stepForward}>
          <ChevronRight />
        </button>
        <button aria-label={"solve completely"} onClick={goEnd}>
          <ChevronsRight />
        </button>
      </div>
    </>
  );
};
export default Solver;
