import React from "react";

const DataRow = React.memo(function ({ columns, dataObj }) {

    const [hover, setHover] = React.useState(false)

    const trClassName = hover ? 'tr_hover' : ''
    const tdClassName = hover ? 'td_hover' : ''

    return <tr className={trClassName} onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
        {columns.map((column, index) =>
            <td className={tdClassName} key={index} >{dataObj[column.props.data]}</td>)
        }
    </tr>

})

export default DataRow;