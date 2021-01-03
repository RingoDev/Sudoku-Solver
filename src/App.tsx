import React from 'react';
import './App.css';
// import Scanner from "./Scanner";
// import cv from './services/cv'
import Page from "./Page";
// import StaticImage from "./StaticImage";
import Sudoku from './Sudoku';

function App() {
    // const [scanning, setScanning] = useState(false);
    return (
        <div className="App">


            {/*<button onClick={() => setScanning(!scanning)}>Toggle Scanner</button>*/}
            {/*{scanning ? <Scanner scanning={scanning}/> : <> </>}*/}

            <Page/>
            {/*<StaticImage/>*/}
            {/*<Sudoku/>*/}


        </div>
    );
}

export default App;
