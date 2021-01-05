import React from 'react';
import {BrowserRouter, NavLink, Route, Switch} from 'react-router-dom';
import './App.css';
import Page from './Page';
import Sudoku from './Sudoku';

function App() {
    return (
        <>
            <BrowserRouter>
                <nav>
                    <div className="nav-wrapper">
                        <a href="https://ringodev.com" className="brand-logo">RingoDev</a>
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            <li><NavLink to="/scanner">Scanner</NavLink></li>
                            <li><NavLink to="/picture">Picture</NavLink></li>
                        </ul>
                    </div>
                </nav>

                <div className="App" style={{padding: '1em'}}>


                    <Switch>
                        <Route path="/scanner">
                            <Page/>
                        </Route>
                        <Route path="/picture">
                            <Sudoku/>

                        </Route>
                        <Route path="/">
                            <Sudoku/>
                        </Route>
                    </Switch>

                </div>
            </BrowserRouter>
        </>
    );
}

export default App;
