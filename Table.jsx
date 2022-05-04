import './styles/DataTable.css'
import { DataRow } from './DataRow';
import { DataColumns } from './DataColumns';

export function Table({ data, columns, activeColumn, handleSort }) {


    return <>
        <table className="data_table">
            <thead>
                <DataColumns columns={columns} handleSort={handleSort} activeColumn={activeColumn} />
            </thead>
            <tbody>
                {data.length ? data.map(obj =>
                    <DataRow columns={columns} dataObj={obj} key={obj.id} />)
                    :
                    null}
            </tbody>
        </table>
        {!data.length && <p className="no_data">No data...</p>}
    </>
}


