import React from "react";
import {Table} from "reactstrap";
import SudokuUtils, {sudoku, digit} from "../solving/SudokuUtils";
import SudokuSingle from "./SudokuSingle";


interface SudokuGridProps {
    sudoku: sudoku
    setSelected: (r: number, c: number) => void
    selected: [r: number, c: number]
    setNumber: (number: digit) => void
}

const SudokuGrid: React.FC<SudokuGridProps> = (props) => {
    return (
        <>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Table bordered={true} style={{width: 'auto', borderWidth: '4px', tableLayout: 'fixed'}}>
                    <tbody>
                    {SudokuUtils.byFields(props.sudoku).map((bigRow, i) => (
                        <tr key={i}>
                            {bigRow.map((field, j) => (
                                <td key={j} style={{padding: 0}}>
                                    <Table bordered={true} style={{margin: 0, width: 'auto', tableLayout: 'fixed'}}>
                                        <tbody>
                                        {field.map((col, k) => (
                                            <tr style={{}} key={k}>
                                                {col.map((value, l) => (
                                                    <td key={l} style={{padding: 0,}}>
                                                        <SudokuSingle value={value} coords={[i * 3 + k, j * 3 + l]}
                                                                      setSelected={props.setSelected}
                                                                      selected={props.selected}
                                                                      setNumber={props.setNumber}/>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default SudokuGrid
