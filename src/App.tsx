import React, {useState} from 'react';
import './App.css';
import { NavLink, Switch, Route, useHistory} from "react-router-dom";
import {Navbar, NavbarBrand} from "reactstrap";
import Scanner from './scanning/Scanner';
import Solver from './solving/Solver';
import {fromString, sudoku} from "./solving/SudokuUtils";
import {samples} from "./solving/sampleSudokus";

const App: React.FC = () => {

    const [current, setCurrent] = useState<sudoku>()
    const history = useHistory();

    const solveSudoku = (sudoku: sudoku) => {
        setCurrent(sudoku);
        history.push("/solve")
    }

    return (
        <>

                <Navbar expand={true} light={true} className="static-top">
                    <NavbarBrand href={"/"} className={"mr-auto"}>Sudoku Solver</NavbarBrand>
                    <ul className="navbar-nav ml-auto">
                        <li><NavLink className={"nav-link"} to={"/solve"}>Solver</NavLink></li>
                        <li><NavLink className={"nav-link"} to={"/scan"}>Scanner</NavLink></li>
                        <li><NavLink className={"nav-link"} to={"/scan/picture"}>Picture</NavLink></li>
                    </ul>
                </Navbar>

                <div className="App" style={{padding: '1em'}}>
                    <Switch>
                        <Route path={"/solve"}>
                            {!current ? <Solver sudoku={fromString(samples[3])}/> : <Solver sudoku={current}/>}
                        </Route>
                        <Route path={"/"}>
                            <Scanner solveSudoku={solveSudoku}/>
                        </Route>
                    </Switch>
                </div>
        </>
    );
}

export default App;
