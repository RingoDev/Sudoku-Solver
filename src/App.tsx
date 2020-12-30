import React, {useState} from 'react';
import './App.css';
import Scanner from "./Scanner";

function App() {
    const [scanning, setScanning] = useState(false);
    return (
        <div className="App">


            <button onClick={() => setScanning(!scanning)}>Toggle Scanner</button>
            {scanning ? <Scanner scanning={scanning}/> : <> </>}

        </div>
    );
}

export default App;
