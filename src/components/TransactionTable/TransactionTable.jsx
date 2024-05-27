// import { Autocomplete, Box, Button } from "@mui/material"
// import { DataGrid } from "@mui/x-data-grid"
// import { useEffect, useState } from "react";
// import { productGetAPI } from "../../service/api/admin";
// const other = {
//     autoHeight: true,
//     showCellVerticalBorder: true,
//     showColumnVerticalBorder: true,
//   };
// function TransactionTable() {
//     const [rows, setRows] = useState([
//         // { id: 0, item: "", qty: 0, unit: "", price: 0, discount: 0, tax: 0 },
       
//       ]);
//       const [productOptions, setProductOptions] = useState([]);
//       const [selectedProduct, setSelectedProduct] = useState(null); // State to hold selected product
//       const [selectedProductDetails, setSelectedProductDetails] = useState(null); // State to hold selected product


//       useEffect(() => {
//         const fetchData = async () => {
//           const response = await productGetAPI();
//           console.log("response",response)
//           const products = response.responseData;
//           const productNames = products.map((product) => product);
//           console.log(products)
//           const options = productNames.map((data, index) => ({
//             value:data.id,
//             label: data.name,
//           }));
//           console.log(options)
//           setProductOptions(options);
//         };
//         fetchData();
//       }, []);

      

//       const handleSelectedProductChange = async (event, newValue) => {
//         setSelectedProduct(newValue);
      
//         const response = await productGetAPI();
//         const products = response.responseData;
      
//         const selectedProductData = products.find(
//           (product) => product.id === newValue?.value
//         );
      
//         // If selected product data is found
//         if (selectedProductData) {
//           const updatedRows = rows.map((row) => {
//             // Update the existing row if the product matches the row ID
//             if (row.id === selectedProductData.id) {
//               return {
//                 ...row,
//                 item: "stest",
//                 qty: 1,
//                 unit: "selectedProductData.unit",
//                 rate: 645,
//                 price: 321,
//                 tax: "0.2%",
//               };
//             }
//             return row; // Return unchanged row if not matching
//           });
      
//           setRows(updatedRows);
//         }
//       };
      
      
//       // item: selectedProductData.name,
//       // qty: 1,
//       // unit: selectedProductData.unit,
//       // rate: selectedProductData.rate,
//       // price: selectedProductData.rate * 1,
//       // tax: selectedProductData.tax,






//       // Calculate totals
//       const calculateTotals = () => {
//         const totals = rows.reduce((acc, row) => {
//           for (const key in row) {
//             if (key !== 'id' && !isNaN(row[key])) {
//               acc[key] = (parseInt(acc[key]) || 0) + parseInt(row[key]);
//             }
//           }
//           // Calculate the amount for each row based on qty, price, discount, and tax


//           row.amount = row.qty?(row.qty * row.price) - row.discount + row.tax:row.price;

          
//           acc.amount = (acc.amount || 0) + row.amount;
//           acc.discountAmount = (acc.discountAmount || 0) + parseInt(row.discountamount||0);
//           acc.taxValue = (acc.taxValue || 0) + parseInt(row.taxvalue||0);



//           return acc;
//         }, {});
        
//         return { id: 'total', ...totals };
//       };
    
//       // Add a new row at the top with a random ID
//       const addNewRow = () => {
//         console.log(rows)
//         const newRow = { 
//           // Math.floor(Math.random() * 1000000), 
//           id:0, 
//           item: '', 
//           qty: 1, 
//           price: 0, 
//           discount: 0, 
//           tax: null, 
//           amount: 0, 
//           row: 0,
//           unit: 'nos' 
//         };
        
//         // Clear the selected product when adding a new row
//         setSelectedProduct(null);
      
//         // Add the new row to the existing rows
//         setRows(prevRows => [...prevRows, newRow]);
//       };
      
      
//       // Handle cell edits
//       const handleEdit = (newRow) => {
//         const updatedRows = rows.map((row) => {
//           if (row.id === newRow.id) {
//             // Recalculate amount if qty, price, discount, or tax are edited
//             if (
//               row.qty !== newRow.qty ||
//               row.price !== newRow.price ||
//               row.discount !== newRow.discount ||
//               row.tax !== newRow.tax
//             ) {
//               newRow.amount = (newRow.qty * newRow.price) - newRow.discount + newRow.tax;
              
//             }
//             return newRow;
//           }
//           return row;
//         });
//         console.log(updatedRows)
//         setRows(updatedRows);
//       };
      
//       const handleDiscountPercentageChange = (id, e) => {
//         const { name, value } = e;
//         setRows(prevRows =>
//           prevRows.map(row =>
//             row.id === id ? { ...row, [name]: value } : row
//           )
//         );
//       };
      
//       const handleDiscountAmountChange = (id, e) => {
//         const { name, value } = e;
//         console.log(name)
//         setRows(prevRows =>
//           prevRows.map(row =>
//             row.id === id ? { ...row, [name]: value } : row
//           )
//         );
//       };
      
//       const handleTaxValueChange = (id, e) => {
//         const { name, value } = e;
//         console.log(name)
//         setRows(prevRows =>
//           prevRows.map(row =>
//             row.id === id ? { ...row, [name]: value } : row
//           )
//         );
//       };
      
//       const handleTaxPercentageChange = (id, e) => {
//         const { name, value } = e;
//         setRows(prevRows =>
//           prevRows.map(row =>
//             row.id === id ? { ...row, [name]: value } : row
//           )
//         );
//       };
      
      
//     const columns=[
//         { field: 'id', headerName: 'id', hideable: false, flex: 1,renderCell: (params) => (
//           params.row.id === 'total' ?
//           <div style={{display:"flex",alignItems:"center",gap:10,}}>
//             <button style={{background:"var(--black-button)",color:"white",outline:"none",border:"none",padding:"10px",borderRadius:"10px"}} onClick={addNewRow}>
//               Add Row
//             </button>
//             <p>Total</p>
//           </div>:<p>{params.row.id}</p>
//         )  },
//         { field: 'item', headerName: 'Item', hideable: false, flex: 1, editable: false,renderCell: (params) => (
//           params.row.id === 'total' ?
//           "":
//           <Box sx={{ width: "100%", marginBottom: "10px" }}>

//        <Autocomplete
//   sx={{
//     display: "inline-block",
//     "& input": {
//       width: "100%",
//       border: "none",
//       bgcolor: "var(--inputbg-color)",
//       color: (theme) =>
//         theme.palette.getContrastText(theme.palette.background.paper),
//     },
//   }}
//   id="custom-input-demo"
//   options={productOptions}
//   // value={selectedProduct} // Set the initial value based on selectedProduct state
//   onChange={handleSelectedProductChange}
//   componentsProps={{
//     popper: {
//       sx: {
//         width: "20% !important"
//       },
//       modifiers: [
//         {
//           name: "offset",
//           options: {
//             offset: [0, -20],
//           },
//         },
//       ],
//     },
//   }}
//   renderInput={(params) => (
//     <div ref={params.InputProps.ref}>
//       <input
//         type="text"
//         {...params.inputProps}
//         style={{ height: "50px", paddingLeft: "10px" }}
//       />
//     </div>
//   )}
// />

//         </Box>
//         ) },
//         { field: 'qty', headerName: 'Qty', hideable: false, flex: 1, editable: true },
//         { field: 'unit', headerName: 'Unit', hideable: false, flex: 1 },
//         { field: 'price', headerName: 'Price', hideable: false, flex: 1, editable: true, renderHeader: () => (
//             <div style={{ width: '100%', display:"flex",flexDirection:"column",alignItems:"center"}}>
//               <div>Price/Unit</div>
//               <hr style={{ width: '100%' }} />
//                 <div style={{ fontWeight: 'bold', }}>without tax</div>
//             </div>
//           ),
//           renderCell: (params) => (
//             console.log(params)
//           )

// },
//         { field: 'discount', headerName: 'Discount', hideable: false, flex: 1, editable: false, renderHeader: () => (
//             <div style={{ width: '100%', display:"flex",flexDirection:"column",}}>
//               <div style={{display:"flex",justifyContent:"center"}}>
//                 <p>Discount</p>
//               </div>
//               <hr style={{ width: '100%' }} />
//               <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
//                 <div style={{ fontWeight: 'bold', }}>%</div>
//                 <div style={{ fontWeight: 'bold' }}>Amount</div>
//               </div>
//             </div>
//           ),
//           renderCell: (params) => (
//             params.row.id === 'total' ? 
//             <div>{params.row.discountAmount}</div> : 
//             <div style={{ display: 'flex', justifyContent: "space-evenly",gap:5}}>
//               <input
//                style={{width:"100%", outline:"none",border:"none", height: "50px",paddingLeft:"5px", bgcolor: "transprant !imporatant" }}
//                 // style={{width:"100%"}}
//                 type="text"
//                 name="discountpercentage"
//                 value={params.row.discountpercentage}
//                 onChange={(e) => handleDiscountPercentageChange(params.row.id,  e.target)}
//               />
//               <input
//                style={{width:"100%", outline:"none",border:"none", height: "50px",paddingLeft:"5px", bgcolor: "transprant !imporatant" }}
//                 // style={{width:"100%"}}
//                 type="text"
//                 name="discountamount"
//                 value={params.row.discountamount}
//                 onChange={(e) => handleDiscountAmountChange(params.row.id, e.target)}
//               />
//             </div>
//           ), },
//         { field: 'tax', headerName: 'Tax', hideable: false, flex: 1, renderHeader: () => (
//             <div style={{ width: '100%', display:"flex",flexDirection:"column",}}>
//               <div style={{display:"flex",justifyContent:"center"}}>
//                 <p>Tax</p>
//               </div>
//               <hr style={{ width: '100%' }} />
//               <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
//                 <div style={{ fontWeight: 'bold', }}>%</div>
//                 <div style={{ fontWeight: 'bold' }}>Amount</div>
//               </div>
//             </div>
//           ),
//           renderCell: (params) => (
//             params.row.id === 'total' ? 
//             <div>{params.row.taxValue}</div> : 
//             <div style={{ display: 'flex', justifyContent: "space-evenly",gap:5}}>
//               <input
//                style={{width:"100%", outline:"none",border:"none", height: "50px",paddingLeft:"5px", bgcolor: "transprant !imporatant" }}
//                 // style={{width:"100%"}}
//                 type="text"
//                 name="taxpercentage"
//                 value={params.row.taxpercentage}
//                 onChange={(e) => handleTaxPercentageChange(params.row.id, e.target)}
//               />
//               <input
//                style={{width:"100%", outline:"none",border:"none", height: "50px",paddingLeft:"5px", bgcolor: "transprant !imporatant" }}
//                 // style={{width:"100%"}}
//                 type="text"
//                 name="taxvalue"
//                 value={params.row.taxvalue}
//                 onChange={(e) => handleTaxValueChange(params.row.id, e.target)}
//               />
//             </div>
//           ), },
//         { field: 'amount', headerName: 'Amount', hideable: false, flex: 1 },
//       ]
      
//   return (
//     <Box
//     sx={{
//       height: "100%",
//       // width: '53.4%',
//       "& .actions": {
//         color: "text.secondary",
//       },
//       "& .textPrimary": {
//         color: "text.primary",
//       },
//       background: "var(--bgwhite)",
//       "& .MuiDataGrid-columnsContainer .": {
//         borderRight: "1px solid rgba(224, 224, 224, 1)",
//         // color: 'text.primary',
//       },
//       "&  .MuiDataGrid-cell": {
//         borderRight: "1px solid rgba(224, 224, 224, 1)",
//       },
//       "&.MuiDataGrid-row": {
//         borderBottomColor: "none",
//       },
//       "& .MuiDataGrid-columnHeader": {
//         borderRight: "1px solid rgba(224, 224, 224, 1)",
//       },
//       "& .css-yrdy0g-MuiDataGrid-columnHeaderRow": {
//         bgcolor: "#f3f6f9 !important",
//       },
//       "& .css-boxz2p-MuiDataGrid-root .MuiDataGrid-columnHeaderTitleContainerContent  ": {
//         width:"100%",
//       },
     
//     }}
//   >
//           {/* <button onClick={addNewRow}>Add Row</button> */}

//     <DataGrid
//         rows={[...rows, calculateTotals()]}
//         {...other}

//         columns={columns}
//       editMode="row"
//       disableColumnMenu
//     //   rowModesModel={rowModesModel}
//     //   onRowModesModelChange={handleRowModesModelChange}
//     //   onRowEditStop={handleRowEditStop}
//       processRowUpdate={handleEdit}
//     //   slotProps={{
//     //     toolbar: { setRows, setRowModesModel },
//     //   }}
//       sx={{
//         "& .MuiDataGrid-footerContainer": {
//           display: "none !important",
//         },
//         "& .css-3dzjca-MuiPaper-root-MuiPopover-paper-MuiMenu-paper ": {
//           maxHeightheight: "calc(5% - 96px) !important",
//         },
        
//       }}
//     />
//   </Box>
//   )
// }

// export default TransactionTable





import * as React from "react";
import Box from "@mui/material/Box";

import { DataGrid } from "@mui/x-data-grid";
import { gstOptionsGetAPI } from "../../service/api/admin";

export default function TransactionTable({
  selectedProductData,
  totalValues,
  setTotalValues,
  setRows,
  rows,
}) {


  const [rowModesModel, setRowModesModel] = React.useState({});
  const [taxOptions, setTaxOptions] = React.useState([]);

  const getTaxOptionsFormAPI = () => {
    gstOptionsGetAPI()
      .then((data) => {
        console.log("tax:", data);

        const transformedData = data.map((entry) => ({
          value: entry.percentage,
          label: entry.name ? `${entry.name} ${entry.percentage}` : "none",
          taxlabel: entry.percentage,
        }));
        setTaxOptions(transformedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  React.useEffect(() => {
    getTaxOptionsFormAPI();
  }, []);

  React.useEffect(() => {
    if (selectedProductData) {
      console.log(selectedProductData);
      const newRow = {
        id: selectedProductData.id,
        itemCode: selectedProductData.itemCode,
        name: selectedProductData.name,
        unit: selectedProductData.unit,
        rate: selectedProductData.rate,
        taxApplied: ` ${selectedProductData.tax_rate?.name} ${selectedProductData.tax_rate?.percentage}`,
        qty: 1, 
      };
      setRows((prevRows) => [...prevRows, newRow]);
    }
  }, [selectedProductData]);

  React.useEffect(() => {
    const updatedRows = rows.map((row) => {
      const quantity = parseInt(row.qty) || 0;
      const rate = parseInt(row.rate) || 0;
      const discount = parseFloat(row.discount) || 0;
      const taxApplied =
        parseFloat(row.taxApplied?.split("@")[1].replace("%", "")) || 0;

      // Calculate total amount without tax
      const totalWithoutTax = quantity * rate;

      // Apply discount if applicable
      let discountedTotal = totalWithoutTax;
      if (quantity > 0 && discount > 0) {
        discountedTotal -= (totalWithoutTax * discount) / 100;
      }

      // Apply tax
      const totalWithTax =
        discountedTotal + (discountedTotal * taxApplied) / 100;

      return {
        ...row,
        total: row.amountafterdescount ? row.amountafterdescount : totalWithTax,
      };
    });

    // Update the rows with calculated totals
    setRows(updatedRows);

    // Sum up all totalWithTax values
    const totalWithTaxSum = updatedRows.reduce(
      (sum, row) =>
        sum + row.amountafterdescount ? row.amountafterdescount : row.total,
      0
    );

    // Update the total values
    // setTotalValues(totalWithTaxSum);
  }, []); //add rows in the array !important and check the error

  const processRowUpdate = (newRow) => {
    console.log(newRow);
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleValueChange = (id, field, value) => {
    const updatedRows = rows.map((row) => {
      const quantity = parseInt(row.qty) || 0;
      const rate = parseInt(row.rate) || 0;
      const totalWithoutTax = quantity * rate;

      if (row.id === id) {
        let updatedRow = { ...row, [field]: value };
        if (field === "descountvalue") {
          // Calculate amount after discount
          console.log(totalWithoutTax - (totalWithoutTax * value) / 100); //set to total
          updatedRow.amountafterdescount = (totalWithoutTax * value) / 100;
        } else if (field === "amountafterdescount") {
          // Calculate discount value
          updatedRow.descountvalue = 100 - (value / totalWithoutTax) * 100;
        }
        return updatedRow;
      }
      return row;
    });
    setRows(updatedRows);
  };

  const columns = [
    { field: "id", headerName: "Slno", flex: 0.5, editable: false },
    {
      field: "name",
      headerName: "Item Name",
      type: "number",
      flex: 1,

      editable: false,
    },

    {
      field: "qty",
      headerName: "Qty",
      flex: 0.5,
      editable: true,
      type: "number",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0.75,
      editable: false,
      type: "number",
    },
    {
      field: "rate",
      headerName: "rate",
      flex: 1,
      editable: false,
      type: "number",
    },
    {
      field: "price",
      headerName: "price (without tax)",
      flex: 1,
      editable: false,
      type: "number",
      renderHeader: () => {

        
        return(
        <div
          style={{ width: "100%", display: "flex", flexDirection: "column" }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <p>price</p>
          </div>
          <hr style={{ width: "100%" }} />
          <div style={{ fontWeight: "bold" }}>(without tax)</div>
        </div>
      )},
      renderCell: (params) => {
        
        const quantity = parseInt(params.row.qty) || 0;
        const rate = parseInt(params.row.rate) || 0;
        const discount = parseFloat(params.row.discount) || 0;
        const taxrat = params.row.taxApplied;
        
        
        // Check if taxrat is a string before splitting
        const taxNumber =
          typeof taxrat === "string"
            ? parseInt(taxrat.split("@")[1].replace("%", ""))
            : 0;

        // Calculate total without tax
        const totalWithoutTax = quantity * rate;

        let discountedTotal = quantity ? totalWithoutTax : rate;

        // Check if quantity is provided and discount is applicable
        if (quantity > 0 && discount > 0) {
          // Calculate discounted total
          discountedTotal =
            totalWithoutTax - (totalWithoutTax * discount) / 100;
        }

        // Calculate total with tax
        // const totalWithTax = d(discountedTotal * taxNumber) / 100;

        // return totalWithoutTax; // Display the total with tax
        return (quantity * rate)-(params.row.amountafterdescount ||0)
      },
    },

    {
      field: "discount",
      headerName: "Discount %",
      flex: 1.5,
      editable: false,
      hideable: false,
      sortable: false,
      filterable: false,
      type: "number",
      renderHeader: () => (
        <div
          style={{ width: "100%", display: "flex", flexDirection: "column" }}
        >
          <div style={{ margin: "auto" }}>Discount %</div>
          <hr style={{ width: "100%" }} />
          <div style={{ display: "flex" }}>
            <div style={{ flex: "1", textAlign: "center" }}>%</div>
            <div
              style={{
                height: "23px",
                width: "2px",
                backgroundColor: "#e6e6e6",
              }}
            ></div>
            <div style={{ flex: "1", textAlign: "center" }}>Amount</div>
          </div>
        </div>
      ),
      renderCell: (params) => (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <div style={{ flex: "1", textAlign: "center" }}>
            <input
              style={{
                width: "100%",
                bgcolor: "transparent",
                outline: "none",
                border: "none",
                paddingBottom: "20px",
                paddingTop: "20px",
              }}
              type="text"
              value={params.row.descountvalue}
              onChange={(e) =>
                handleValueChange(
                  params.row.id,
                  "descountvalue",
                  e.target.value
                )
              }
            />
          </div>
          <div
            style={{
              height: "300px",
              width: "2px",
              backgroundColor: "#e6e6e6",
            }}
          ></div>

          <div style={{ flex: "1", textAlign: "center" }}>
            <input
              style={{
                width: "100%",
                bgcolor: "transparent",
                outline: "none",
                border: "none",
                paddingBottom: "20px",
                paddingTop: "20px",
              }}
              type="text"
              value={params.row.amountafterdescount}
              onChange={(e) =>
                handleValueChange(
                  params.row.id,
                  "amountafterdescount",
                  e.target.value
                )
              }
            />
          </div>
        </div>
      ),
    },
    {
      field: "taxApplied",
      headerName: "Tax Applied",
      flex: 2,
      // editable: true,
      type: "text",
      // valueOptions: ["Credit card", "Wire transfer", "Cash"],
      renderHeader: () => (
        <div
          style={{ width: "100%", display: "flex", flexDirection: "column" }}
        >
          <div style={{ margin: "auto" }}>Tax %</div>
          <hr style={{ width: "100%" }} />
          <div style={{ display: "flex" }}>
            <div style={{ flex: "1", textAlign: "center" }}>%</div>
            <div
              style={{
                height: "23px",
                width: "2px",
                backgroundColor: "#e6e6e6",
              }}
            ></div>
            <div style={{ flex: "1", textAlign: "center" }}>Amount</div>
          </div>
        </div>
      ),
      renderCell: (params) => {
        const handleTaxChange = (event) => {
          console.log("newvalue:", event.target.value);
          const editedRow = {
            ...params.row,
            taxAppliedamount: event.target.value,
          };
          const updatedRows = rows.map((row) =>
            row.id === params.row.id ? editedRow : row
          );
          setRows(updatedRows);
          console.log(updatedRows);
        };

        console.log(
          "data to show in select",
          params.row.taxAppliedamount
                    ? params.row.taxAppliedamount.length
                    : params.row.taxApplied?.split("GST@ ")[1].length
           
        );
        const calc=()=>{
          const taxvalue=( params.row.taxApplied
            ? params.row.taxAppliedamount
              ? parseInt(params.row.taxAppliedamount?.replace("%", " "))
              : parseFloat(
                  params.row?.taxApplied?.split("@")[1].replace("%", "")
                )
            : parseInt(params.row.taxAppliedamount?.replace("%", " ")) )
            const totalval=(params.row.qty*params.row.rate)
const totaldis=(totalval- ((params.row.quantity||0) * (params.row.rate||0))-(params.row.amountafterdescount ||0))
            const taxApplied= ((totaldis*taxvalue) / 100);

            return taxApplied;

        }
        return (
          <div style={{ width: "100%", display: "flex" }}>
              <select
                value={
                  params.row.taxAppliedamount
                    ? params.row.taxAppliedamount
                    : params.row.taxApplied?.split("GST@ ")[1]
                }
                onChange={handleTaxChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "none",
                  backgroundColor: "white",
                  margin: "0px",
                }}
              >
                {taxOptions.map((option) => {
                  console.log(taxOptions,"taxooo")
                  return(
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                )})}
              </select>
              <div
              style={{
                height: "50px",
                width: "2px",
                backgroundColor: "#e6e6e6",
              }}
            ></div>
            <input
              style={{
                width: "100%",
                bgcolor: "transparent",
                outline: "none",
                border: "none",
                paddingBottom: "20px",
                paddingTop: "20px",
                // height: "7.8px",
                background: "white",
              }}
              type="text"
              value={calc()
              
              }
              disabled
            />
          </div>
        );
      },
    },
    {
      field: "total",
      type: "number",
      headerName: "Total",
      flex: 1,
      renderCell: (params) => {
        const quantity = parseInt(params.row.qty) || 0;
        const rate = parseInt(params.row.rate) || 0;
        const discount = parseFloat(params.row.discount) || 0;
        
        let taxAppliedamount = 0;
        if (params.row.taxAppliedamount) {
          taxAppliedamount = parseFloat(params.row.taxAppliedamount.replace("%", "")) || 0;
        } else if (params.row.taxApplied?.value) {
          taxAppliedamount = parseFloat(params.row.taxApplied.value.replace("%", "")) || 0;
        } else if (params.row.taxApplied) {
          taxAppliedamount = parseFloat(params.row.taxApplied?.split("@")[1].replace("%", "")) || 0;
        }
        
        const totalWithoutTax = quantity * rate;
        // let discountedTotal = totalWithoutTax;
    
        // if (quantity > 0 && discount > 0) {
        //   discountedTotal -= (totalWithoutTax * discount) / 100;
        // }
        const dis=totalWithoutTax-(params.row.amountafterdescount||0)
        return (((dis*taxAppliedamount)/100)+dis).toFixed(2);
      },
    }
    
,    
  ];
  // const calculateTotals = () => {
  //   const totals = {
  //     qty: 0,
  //     rate: 0,
  //     price:0
  //     // amountafterdescount: 0,
      
  //   };

  //   rows.forEach((row) => {
  //     console.log("row.total",row)
  //     totals.qty += parseFloat(row.qty) || 0;
  //     totals.rate += parseFloat(row.rate) || 0;
  //     totals.price += parseFloat((row.rate)*5) || 0;

  //     // totals.amountafterdescount += parseFloat(row.amountafterdescount) || 0;
  //     // totals.total += parseFloat(row.total) || 0;
  //   });

  //   return totals;
  // };

  // const totalRow = calculateTotals();
  // console.log("row.total",totalRow)
  return (
    <Box
      sx={{
        height: "100%",
        // width: '53.4%',
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
        background: "var(--bgwhite)",
        "& .MuiDataGrid-columnsContainer .": {
          borderRight: "1px solid rgba(224, 224, 224, 1)",
          // color: 'text.primary',
        },
        "&  .MuiDataGrid-cell": {
          borderRight: "1px solid rgba(224, 224, 224, 1)",
        },
        "&.MuiDataGrid-row": {
          borderBottomColor: "none",
        },
        "& .MuiDataGrid-columnHeader": {
          borderRight: "1px solid rgba(224, 224, 224, 1)",
        },
        "& .css-yrdy0g-MuiDataGrid-columnHeaderRow": {
          bgcolor: "#f3f6f9 !important",
        },
        "& .css-boxz2p-MuiDataGrid-root .MuiDataGrid-columnHeaderTitleContainerContent  ":
          {
            width: "100%",
          },
      }}
    >
      <DataGrid
        // rows={[...rows, { id: "total-row", ...totalRow }]}
        rows={rows}
        columns={columns}
        editMode="row"
        disableColumnMenu
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        // onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        sx={{
          "& .MuiDataGrid-footerContainer": {
            display: "none !important",
          },
          "& .css-3dzjca-MuiPaper-root-MuiPopover-paper-MuiMenu-paper ": {
            maxHeightheight: "calc(5% - 96px) !important",
          },
          "& .css-74bi4q-MuiDataGrid-overlayWrapper":{
              height: "60px",
            },
            "& .MuiDataGrid-columnHeaderTitleContainerContent":{
              width: "100%",
            },
        }}
      />
    </Box>
  );
}
