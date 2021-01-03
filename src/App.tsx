import React from 'react';
import './App.css';
import Page from "./Page";
// import Sudoku from './Sudoku';

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
