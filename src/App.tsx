import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route, NavLink} from "react-router-dom";
import {Navbar, NavbarBrand} from "reactstrap";
import Scanner from './scanning/Scanner';
import Solver from './solving/Solver';

function App() {
    return (
        <>
            <Router>

                <Navbar expand={true} light={true} className="static-top">
                    <NavbarBrand href={"/"} className={"mr-auto"}>Sudoku Solver</NavbarBrand>
                    <ul className="navbar-nav ml-auto">
                        <li><NavLink className={"nav-link"} to={"/solver"}>Solver</NavLink></li>
                        <li><NavLink className={"nav-link"} to={"/scanner"}>Scanner</NavLink></li>
                        <li><NavLink className={"nav-link"} to={"/scanner/video"}>Video</NavLink></li>
                    </ul>
                </Navbar>

                <div className="App" style={{padding: '1em'}}>
                    <Switch>
                        <Route path="/scanner">
                            <Scanner/>
                        </Route>
                        <Route path="/solver">
                            <Solver/>
                        </Route>
                        <Route path="/">
                            <Scanner/>
                        </Route>
                    </Switch>
                </div>
            </Router>
        </>
    );
}

export default App;
