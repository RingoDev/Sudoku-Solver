import React from "react";
import {Col, Container, Row} from "reactstrap";

interface SudokuGridProps {
    sudoku: number[][]
}

const SudokuGrid: React.FC<SudokuGridProps> = (props) => {
    return (
        <>
            <Container>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div style={{border: 'solid 5px'}}>
                        {props.sudoku.map((row, i) => (

                            <Row style={{margin: 0, width: '45vw', height: '5vw'}} key={i}>
                                {row.map((value, j) => (
                                    <Col style={{border: 'solid 1px', padding: 0, width: '5vw', height: '5vw'}} key={j}>
                                        <div style={{
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {value === 0 ? '' : value}
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        ))}
                    </div>
                </div>
            </Container>
        </>
    )
}

export default SudokuGrid
