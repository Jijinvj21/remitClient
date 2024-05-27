import * as React from "react";
import Box from "@mui/material/Box";

import { DataGrid } from "@mui/x-data-grid";
import { gstOptionsGetAPI } from "../../service/api/admin";

export default function FullFeaturedCrudGrid({
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
          id:entry.id
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
      console.log("selectedProductData",selectedProductData,` ${selectedProductData.tax_rate?.name} ${selectedProductData.tax_rate?.percentage}`);
      const newRow = {
        id: selectedProductData.id,
        itemCode: selectedProductData.itemCode,
        name: selectedProductData.name,
        unit: selectedProductData.unit,
        unit_id: selectedProductData.unit_id,
        hsn:selectedProductData.hsn,
        
tax_id:selectedProductData.tax_rate.id,

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
      type: "text",
      renderHeader: () => (
        <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
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
          const selectedTax = taxOptions.find(option => option.value === event.target.value);
          const editedRow = {
            ...params.row,
            taxApplied: selectedTax ? `${selectedTax.label}` : '',
            taxId: selectedTax ? selectedTax.id : "0",
          };
          const updatedRows = rows.map((row) =>
            row.id === params.row.id ? editedRow : row
          );
          setRows(updatedRows);
        };
    
        // const calc = () => {
        //   const taxValue = params.row.taxApplied
        //     ? params.row.taxAppliedamount
        //       ? parseFloat(params.row.taxAppliedamount)
        //       : parseFloat(params.row.taxApplied.split(" ")[1])
        //     : 0;
    
        //   const totalVal = ((params.row.qty||0) * (params.row.rate||0));
        //   const totalDiscount = totalVal - (params.row.amountafterdescount || 0);
        //   const taxApplied = ((totalDiscount * taxValue) / 100);
    
        //   return taxApplied;
        // }
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
                : params.row.taxApplied.split("GST@ ")[1]
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
              {taxOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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
                background: "white",
              }}
              type="text"
              value={calc()}
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
          taxAppliedamount = parseFloat(params.row.taxApplied.split("@")[1].replace("%", "")) || 0;
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