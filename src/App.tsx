import React from 'react';
import './App.css';
import Scanner from './Scanner';
import Sudoku from './Sudoku';
import {BrowserRouter as Router, Switch, Route, NavLink} from "react-router-dom";
import {Navbar, NavbarBrand} from "reactstrap";

function App() {
    return (
        <>
            <Router>

                <Navbar expand={true} light={true} className="static-top">
                    <NavbarBrand href={"/"} className={"mr-auto"}>Sudoku Solver</NavbarBrand>
                    <ul className="navbar-nav ml-auto">
                        <li><NavLink className={"nav-link"} to={"/picture"}>Picture</NavLink></li>
                        <li><NavLink className={"nav-link"} to={"/scanner"}>Scanner</NavLink></li>
                    </ul>
                </Navbar>

                <div className="App" style={{padding: '1em'}}>

                    <Switch>
                        <Route path="/scanner">
                            <Scanner/>
                        </Route>
                        <Route path="/picture">
                            <Sudoku/>

                        </Route>
                        <Route path="/">
                            <Sudoku/>
                        </Route>
                    </Switch>

                </div>
            </Router>
        </>
    );
}

export default App;
