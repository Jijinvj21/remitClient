

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import "./ExpenseView.scss"
import { useEffect, useState } from 'react';
import { expensesDataGetAPI } from '../../service/api/admin';
function ExpenseView() {
  // const data = [
  //   {
  //     dueDate: '2024-06-01',
  //     invoiceDate: '2024-05-01',
  //     challanNo: '12345',
  //     stateOfSupply: 'California',
  //     partySelect: 'Party A',
  //     description: 'Product delivery',
  //     products: "Product"
  //   },
  //   {
  //     dueDate: '2024-06-15',
  //     invoiceDate: '2024-05-15',
  //     challanNo: '67890',
  //     stateOfSupply: 'New York',
  //     partySelect: 'Party B',
  //     description: 'Product shipment',
  //     products: "Product"
  //   }
  // ];
  const [data,setData]=useState([]);
  useEffect(() => {
    expensesDataGetAPI().then((res)=>{
      console.log(res.data.responseData)
      setData(res.data.responseData)
    }).catch((err)=>{
  console.log(err)
    })
   
  }, [])
  return (
    <div className="delivery_challan_view">
       <h2>Delivery Challan</h2>
      <div className="inner-section">
      <TableContainer component={Paper} sx={{margin:"0px !important"}}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Challan No</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Party</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Total</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.serial_no}</TableCell>
              <TableCell>{row.project}</TableCell>
              <TableCell>{ new Date(row?.date)?.toLocaleDateString()}</TableCell>
              <TableCell>{row.expenses_category}</TableCell>
              <TableCell>{row.party}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{ row.total}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer>

      </div>
    </div>
  )
}

export default ExpenseView