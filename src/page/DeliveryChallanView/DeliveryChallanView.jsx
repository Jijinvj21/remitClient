import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import "./DeliveryChallanView.scss"
import { useEffect, useState } from 'react';
import {  deliveryChallanDataGetAPI } from '../../service/api/admin';
function DeliveryChallanView() {
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
    deliveryChallanDataGetAPI().then((res)=>{
      console.log(res?.data?.responseData)
      setData(res?.data?.responseData)
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
            <TableCell>Due Date</TableCell>
            <TableCell>Invoice Date</TableCell>
            <TableCell>Party</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Products</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row?.challan_no}</TableCell>
              <TableCell>{new Date(row?.due_date)?.toLocaleDateString()}</TableCell>
              <TableCell>{ new Date(row?.date)?.toLocaleDateString()}</TableCell>
              <TableCell>{row?.party_id}</TableCell>
              <TableCell>{row?.description}</TableCell>
              <TableCell>{ row?.products.map((data)=>data.product)}</TableCell>
              <TableCell>{ row?.total}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer>

      </div>
    </div>
  )
}

export default DeliveryChallanView