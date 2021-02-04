import React from "react";
import Video from "./Video";
import {sudoku} from "../solving/SudokuUtils";
import {Route, Switch} from "react-router-dom";
import Picture from "./Picture";

interface ScannerProps {
    solveSudoku: (val: sudoku) => void
}

const Scanner: React.FC<ScannerProps> = (props) => {
    return (
        <>
            <Switch>
                <Route path={"/scan/picture"}>
                    <Picture solveSudoku={props.solveSudoku}/>
                </Route>
                <Route path={"/"}>
                    <Video solveSudoku={props.solveSudoku}/>
                </Route>
            </Switch>
        </>
    )
}

export default Scanner
