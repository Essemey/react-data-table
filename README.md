# react-data-table

>React implementation of the [DataTables](https://github.com/DataTables/DataTables) package

![image](https://user-images.githubusercontent.com/77215266/167102134-adf32e4c-1aac-4db5-a37a-15ca411193c3.png)

## Example

```javascript
import { DataTable, Column } from '@essemey/react-data-table'
import {useState} from 'react'

export default function App(){ 

  const [employee, setEmployee] = useState([])

  return <div className="app">
        <DataTable title="Employees" data={employee} setData={setEmployee}>
            <Column title="First Name" data="firstName" />
            <Column title="City" data="city" />
            <Column title="Last Name" data="lastName" />
            <Column title="Zip Code" data="zipCode" type="number" />
            <Column title="Start Date" data="startDate" type="date" />
            <Column title="Department" data="department" />
            <Column title="Date of Birth" data="dateOfBirth" type="date" />
            <Column title="Street" data="street" />
            <Column title="State" data="state" />
        </DataTable>
      </div>
}
