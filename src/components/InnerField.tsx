import React from "react";
import {Table} from "reactstrap";


interface InnerFieldProps {
    value: number | number[]
}


const InnerField: React.FC<InnerFieldProps> = (props) => {

    const val = props.value;
    if (typeof val === 'number') {
        return (
            <div style={{fontSize: 'min(4vw,50px)'}}>
                {val === 0 ? '' : val}
            </div>
        )
    } else return (
        <>
            <Table bordered={false} style={{margin: 0, width: 'auto', tableLayout: 'fixed'}}>
                <tbody>
                {[[1, 2, 3], [4, 5, 6], [7, 8, 9]].map((row, index) => (
                    <tr key={index}>
                        {row.map(n => (
                            <td key={n} style={{padding: 0}}>
                                <div style={{
                                    maxHeight: '30px',
                                    maxWidth: '30px',
                                    height: '3vw',
                                    width: '3vw',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        {n === 0 ? '' : n}
                                    </div>
                                </div>

                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    )

}
export default InnerField
