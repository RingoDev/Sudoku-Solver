import React from "react";
import {Input} from "reactstrap";
import InnerField from "./InnerField";
import './SudokuSingle.css'
import {digit} from "../solving/SudokuUtils";

interface SudokuSingleProps {
    setSelected: (r: number, c: number) => void
    selected: [r: number, c: number]
    coords: [r: number, c: number]
    value: number | number[]
    setNumber: (number: digit) => void
}

const SudokuSingle: React.FC<SudokuSingleProps> = (props) => {

    if (props.coords[0] === props.selected[0] && props.coords[1] === props.selected[1]) {
        console.log("Rendering input")
        const val = props.value
        return (
            <>
                <Input value={typeof val === "number" && val !== 0 ? val : ''} onChange={(event => {
                    const number = Number(event.target.value)
                    console.debug("Test")
                    if (!isNaN(number)) {
                        console.debug("is number")
                        props.setNumber((number % 10) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9)

                    }
                })} type={"number"} autoFocus={true} maxLength={1} style={{
                    cursor: 'pointer',
                    // boxShadow: (props.coords[0] === props.selected[0] && props.coords[1] === props.selected[1]) ? '0 0 0 0.2rem rgba(0,123,255,.25)' : '',
                    maxHeight: '90px',
                    maxWidth: '90px',
                    height: '9vw',
                    width: '9vw',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    fontSize: 'min(4vw,50px)',
                }}/>
            </>
        )
    }


    return (
        <div
            onClick={() => {
                // render input field
                props.setSelected(props.coords[0], props.coords[1])
            }}
            style={{
                cursor: 'pointer',
                boxShadow: (props.coords[0] === props.selected[0] && props.coords[1] === props.selected[1]) ? '0 0 0 0.2rem rgba(0,123,255,.25)' : '',
                maxHeight: '90px',
                maxWidth: '90px',
                height: '9vw',
                width: '9vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>


            <InnerField value={props.value}/>
        </div>

    )
}

export default SudokuSingle
