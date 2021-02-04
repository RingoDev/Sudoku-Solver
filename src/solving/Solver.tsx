import React, {useState} from "react";
import './Solver.css'
import {Button} from "@material-ui/core";
import {convert, sudoku} from "./SudokuUtils";
import SudokuGrid from "../components/SudokuGrid";
import {bruteForce} from "./bruteForce";
import algorithms from "./algorithms";


interface SolverProps {
    sudoku: sudoku;
}

const Solver: React.FC<SolverProps> = (props) => {

    const [solved, setSolved] = useState<sudoku>()
    const [current, setCurrent] = useState<sudoku>(props.sudoku)

    if (solved === undefined) {
        setSolved(bruteForce(convert(props.sudoku)[1]))
        return <div>solving</div>
    }


    //eslint-disable-next-line
    const stepBack = () => {
        // todo maybe implement later needs restructuring
    }
    const stepForward = () => {
        console.log("Taking a step forward")

        for (let algo of algorithms) {
            console.debug("Trying next algorithm",algo.name)
            let [changed, sudoku] = algo(current);
            if (changed) {// step is complete
                setCurrent(sudoku);
                return;
            }
        }
        // we ran through the loop and couldn't find a new value so we failed :(
        console.debug("No more possible Steps found")
    }
    const goStart = () => {
        console.debug("Going to start")
        setCurrent(props.sudoku)
    }
    const goEnd = () => {
        console.debug("Going to end")
        setCurrent(solved)
    }


    return (
        <>
            <SudokuGrid sudoku={current} setSelected={() => {
            }} selected={[-1, -1]} setNumber={() => {
            }}/>
            <div className={"controls"}>
                <Button className={"control-btn"} onClick={goStart}><i className="fas fa-arrow-left"/></Button>
                <Button className={"control-btn"}><i className="fas fa-arrow-left"/></Button>
                <Button className={"control-btn"} onClick={stepForward}><i className="fas fa-arrow-right"/></Button>
                <Button className={"control-btn"} onClick={goEnd}><i className="fas fa-arrow-right"/></Button>
            </div>
        </>
    )


}
export default Solver
