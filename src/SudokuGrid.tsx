import React from "react";
import {Table} from "reactstrap";
import Sudoku from "./Sudoku";

interface SudokuGridProps {
    sudoku: Sudoku
}

const SudokuGrid: React.FC<SudokuGridProps> = (props) => {
    return (
        <>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Table bordered={true} style={{width: 'auto', borderWidth: '4px', tableLayout: 'fixed'}}>
                    <tbody>
                    {props.sudoku.byFields().map((bigRow, i) => (
                        <tr key={i}>
                            {bigRow.map((field, j) => (
                                <td key={j} style={{padding: 0}}>
                                    <Table bordered={true} style={{margin: 0, width: 'auto', tableLayout: 'fixed'}}>
                                        <tbody>
                                        {field.map((col, k) => (
                                            <tr style={{}} key={k}>
                                                {col.map((value, l) => {
                                                    return (
                                                        <td key={l} style={{padding: 0,}}>
                                                            <div
                                                                style={{
                                                                    maxHeight: '80px',
                                                                    maxWidth: '80px',
                                                                    height: '9vw',
                                                                    width: '9vw',
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center'
                                                                }}>
                                                                <button onClick={() => {
                                                                }} className={'btn'}
                                                                        style={{width: '100%', height: '100%'}}>
                                                                    <div style={{
                                                                        fontSize: 'min(4vw,50px)'
                                                                    }}>{value === 0 ? '' : value}</div>

                                                                </button>
                                                            </div>
                                                        </td>
                                                    )
                                                })}
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
