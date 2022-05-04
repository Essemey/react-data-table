import { memo } from 'react'
import { useState } from 'react'

export const DataRow = memo(function ({ columns, dataObj }) {

    const [hover, setHover] = useState(false)

    const trClassName = hover ? 'tr_hover' : ''
    const tdClassName = hover ? 'td_hover' : ''

    return <tr className={trClassName} onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
        {columns.map((column, index) =>
            <td className={tdClassName} key={index} >{dataObj[column.props.data]}</td>)
        }
    </tr>

})