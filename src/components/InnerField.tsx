import React from "react";
import {Table} from "reactstrap";


interface InnerFieldProps {
    value: number | number[]
}


const InnerField: React.FC<InnerFieldProps> = (props) => {

    const val = props.value;
    if (typeof val === 'number') {
        return (
            <div style={{fontSize: 'min(4.2vw,54px)',border: "1px grey"}}>
                {val === 0 ? '' : val}
            </div>
        )
    } else return (
        <>
            <Table bordered={false} style={{margin: 0, width: '100%',tableLayout:"fixed"}}>
                <tbody>
                {[[1, 2, 3], [4, 5, 6], [7, 8, 9]].map((row, index) => (
                    <tr key={index}>
                        {row.map(n => (
                            <td key={n} style={{padding: 0,
                               }}>
                                <div style={{ maxHeight: '30px',
                                    maxWidth: '30px',
                                    height: '3vw',
                                    width: '3vw',
                                    fontSize:'min(1.4vw,18px)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        {val.includes(n) ? n : ''}
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
