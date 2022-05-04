import { memo } from 'react'
import { ArrowIcon } from './icons/ArrowIcon';
import './styles/ArrowIcon.css';

export const DataColumns = memo(function ({ columns, handleSort, activeColumn }) {

    const activeAsc = column => column === activeColumn.column?.data && activeColumn.order ? 'active' : ''
    const activeDesc = column => column === activeColumn.column?.data && !activeColumn.order ? 'active' : ''

    return <tr>
        {columns.map(column => <th key={column.key} onClick={() => handleSort(column.props)}>
            {column.props.title}
            <div className="arrowIcons">
                <ArrowIcon className={`arrowIcon asc ${activeAsc(column.props.data)}`} />
                <ArrowIcon className={`arrowIcon desc ${activeDesc(column.props.data)}`} />
            </div>
        </th>)}
    </tr>
})