import React, { useEffect, useState } from "react";
import styles from "./solver.module.css";
import {
  SudokuListType,
  digit,
  gridToList,
  listToGrid,
} from "../../lib/utils/sudoku";
import SudokuGrid from "../sudoku/sudoku-grid";
import algorithms from "../../lib/algorithms/algorithms";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { bruteForce } from "../../lib/algorithms/bruteForce";

interface SolverProps {
  sudoku: SudokuListType;
}

const Solver: React.FC<SolverProps> = (props) => {
  const [solved, setSolved] = useState<SudokuListType>();
  const [displayed, setDisplayed] = useState<SudokuListType>(props.sudoku);

  useEffect(() => {
    if (solved === undefined) {
      setSolved(gridToList(bruteForce(listToGrid(props.sudoku))));
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
      let [changed, sudoku] = algo(listToGrid(displayed));
      if (changed) {
        // step is complete
        setDisplayed(gridToList(sudoku));
        return;
      }
    }
    // we ran through the loop and couldn't find a new value, so we failed :(
    console.debug("No more possible Steps found");
  };
  const goStart = () => {
    console.debug("Going to start");
    setDisplayed(props.sudoku);
  };
  const goEnd = () => {
    if (solved == undefined) alert("Sudoku not solvable");
    else setDisplayed(solved);
  };

  const setNumberAtIndex = (value: digit, index: number) => {
    console.info("setting value at index " + index + " to value " + value);
    setDisplayed(displayed.map((v, i) => (i === index ? [value] : v)));
  };

  return (
    <>
      <SudokuGrid
        showPossibleValues
        sudoku={displayed}
        setSelected={() => {}}
        selected={-1}
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
