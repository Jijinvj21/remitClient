import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import "./CreaditNoteView.scss"
import { creditDataGetAPI } from '../../service/api/admin';
import { useEffect, useState } from 'react';
function CreaditNoteView() {
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
    creditDataGetAPI().then((res)=>{
      console.log(res.data.responseData)
      setData(res.data.responseData)
    }).catch((err)=>{
  console.log(err)
    })
   
  }, [])
  
  return (
    <div className="delivery_challan_view">
       <h2>Credit Note</h2>
      <div className="inner-section">
      <TableContainer component={Paper} sx={{margin:"0px !important"}}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Invoice No</TableCell>
            <TableCell>party</TableCell>
            <TableCell>Invoice Date</TableCell>
            <TableCell>Billing Address</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.invoice_no}</TableCell>
              <TableCell>{row.party}</TableCell>
              <TableCell>{new Date(row?.invoice_date)?.toLocaleDateString()}</TableCell>
              <TableCell>{row.billing_address}</TableCell>
              <TableCell>{row.product_details.map((data)=>(
                data.product
              ))}</TableCell>
              <TableCell>{ row.total_amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer>

      </div>
    </div>
  )
}

export default CreaditNoteView