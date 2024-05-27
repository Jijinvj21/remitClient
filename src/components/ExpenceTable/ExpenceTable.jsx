import { Autocomplete, Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  gstOptionsGetAPI,
  partyDataGetAPI,
  unitsDataGetAPI,
} from "../../service/api/admin";
const other = {
  autoHeight: true,
  showCellVerticalBorder: true,
  showColumnVerticalBorder: true,
};
function ExpenceTable({ rows, setRows,setSelectedProduct }) {
  const [productOptions, setProductOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);

  // const [selectedProduct, setSelectedProduct] = useState(null); // State to hold selected product

  const [taxOptions, setTaxOptions] = useState([]);
  const getTaxOptionsFormAPI = () => {
    gstOptionsGetAPI()
      .then((data) => {
        console.log("tax:", data);

        const transformedData = data.map((entry) => ({
          value: entry.percentage,
          label: entry.name ? `${entry.name} ${entry.percentage}` : "none",
          taxlabel: entry.id,
        }));
        setTaxOptions(transformedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getTaxOptionsFormAPI();
    console.log("firstrows", rows);
  }, [rows]);

  const fetchData = async () => {
    const response = await partyDataGetAPI();
    console.log("response", response.responseData);
    const products = response.responseData;
    const productNames = products.map((product) => product);
    console.log(products);
    const options = productNames.map((data, index) => ({
      value: data.id,
      label: data.name,
    }));
    console.log(options);
    setProductOptions(options);
  };

  const unitFetch = () => {
    unitsDataGetAPI().then((data) => {
      const unit = data.responseData;
      const options = unit.map((data) => ({
        value: data.id,
        label: data.name,
      }));
      console.log(options);
      setUnitOptions(options);
    });
  };

  useEffect(() => {
    fetchData();
    unitFetch();
  }, []);

  const handleSelectedProductChange = (id, newValue) => {
    console.log("id,newValue",id,newValue)
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, item: newValue?.value || "" } : row
      )
    );
  };

  const handleSelectedUnitChange = (id, newValue) => {
    setRows((prevRows) => {
      const updatedRows = prevRows.map((row) =>
        row.id === id ? { ...row, unit: newValue?.value || "" } : row
      );
      console.log("Updated Rows after unit change:", updatedRows);
      return updatedRows;
    });
  };
  

  // Calculate totals
  const calculateTotals = () => {
    const totals = rows.reduce((acc, row) => {
      for (const key in row) {
        if (key !== "id" && !isNaN(row[key])) {
          acc[key] = (parseInt(acc[key]) || 0) + parseInt(row[key]);
        }
      }
      // Calculate the amount for each row based on qty, price, discount, and tax

      row.amount = row.qty
        ? row.qty * row.price - row.discount + row.tax
        : row.price;

      acc.amount = (acc.amount || 0) + row.amount;
      acc.discountAmount =
        (acc.discountAmount || 0) + parseInt(row.discountamount || 0);
      acc.taxValue = (acc.taxValue || 0) + parseInt(row.taxvalue || 0);

      return acc;
    }, {});

    return { id: "total", ...totals };
  };

  // Add a new row at the top with a random ID
  const addNewRow = () => {
    // Find the maximum id from existing rows
    const maxId = rows.length > 0 ? Math.max(...rows.map((row) => row.id)) : 0;

    // Create a new row with an incremented id
    const newRow = {
      id: maxId + 1,
      item: "",
      qty: 1,
      price: 0,
      discount: 0,
      tax: null,
      amount: 0,
      row: 0,
      unit: "nos",
    };

    // Clear the selected product when adding a new row
    setSelectedProduct(null);

    // Add the new row to the existing rows
    setRows((prevRows) => [...prevRows, newRow]);
  };

  // Handle cell edits
  const handleEdit = (newRow) => {
    const updatedRows = rows.map((row) => {
      if (row.id === newRow.id) {
        // Recalculate amount if qty, price, discount, or tax are edited
        if (
          row.qty !== newRow.qty ||
          row.price !== newRow.price ||
          row.discount !== newRow.discount ||
          row.tax !== newRow.tax
        ) {
          newRow.amount =
            newRow.qty * newRow.price - newRow.discount + newRow.tax;
        }
        return newRow;
      }
      return row;
    });
    console.log(updatedRows);
    setRows(updatedRows);
  };

  const handleDiscountPercentageChange = (id, name, value) => {
    // const { name, value } = e;
    console.log("name,value", name, value);
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [name]: value } : row))
    );
  };

  const handleDiscountAmountChange = (id, name, value) => {
    console.log(name);
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [name]: value } : row))
    );
  };

  const handleTaxValueChange = (id, name, value, gst, taxId) => {
    console.log("handleTaxValueChange", value, gst, taxId);
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [name]: value, "gstSelectedVlue": gst, "taxId": taxId } : row))
    );
  };
  

  const handleTaxPercentageChange = (id, e) => {
    const { name, value } = e;
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [name]: value } : row))
    );
  };

  const columns = [
    {
      field: "id",
      headerName: "id",
      hideable: false,
      flex: 1,
      renderCell: (params) =>
        params.row.id === "total" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              style={{
                background: "var(--black-button)",
                color: "white",
                outline: "none",
                border: "none",
                padding: "10px",
                borderRadius: "10px",
              }}
              onClick={addNewRow}
            >
              Add Row
            </button>
            <p>Total</p>
          </div>
        ) : (
          <p>{params.row.id}</p>
        ),
    },
    {
      field: "item",
      headerName: "Item",
      hideable: false,
      flex: 1,
      editable: false,
      renderCell: (params) =>
        params.row.id === "total" ? (
          ""
        ) : (
          <Box sx={{ width: "100%", marginBottom: "10px" }}>
            <Autocomplete
              sx={{
                display: "inline-block",
                "& input": {
                  width: "100%",
                  border: "none",
                  bgcolor: "var(--inputbg-color)",
                  color: (theme) =>
                    theme.palette.getContrastText(
                      theme.palette.background.paper
                    ),
                },
              }}
              id="custom-input-demo"
              options={productOptions}
              // value={selectedProduct} // Set the initial value based on selectedProduct state
              onChange={(event, newValue) =>
                handleSelectedProductChange(params.row.id, newValue)
              }              componentsProps={{
                popper: {
                  sx: {
                    width: "20% !important",
                  },
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -20],
                      },
                    },
                  ],
                },
              }}
              renderInput={(params) => (
                <div ref={params.InputProps.ref}>
                  <input
                    type="text"
                    {...params.inputProps}
                    style={{ height: "50px", paddingLeft: "10px" }}
                  />
                </div>
              )}
            />
          </Box>
        ),
    },
    {
      field: "qty",
      headerName: "Qty",
      hideable: false,
      flex: 1,
      editable: true,
    },
    {
      field: "unit",
      headerName: "Unit",
      hideable: false,
      flex: 1,
      renderCell: (params) =>
        params.row.id === "total" ? (
          ""
        ) : (
          <Box sx={{ width: "100%", marginBottom: "10px" }}>
            <Autocomplete
              sx={{
                display: "inline-block",
                "& input": {
                  width: "100%",
                  border: "none",
                  bgcolor: "var(--inputbg-color)",
                  color: (theme) =>
                    theme.palette.getContrastText(
                      theme.palette.background.paper
                    ),
                },
              }}
              id="custom-input-demo"
              options={unitOptions}
              onChange={(event, newValue) =>
                handleSelectedUnitChange(params.row.id, newValue)
              }              componentsProps={{
                popper: {
                  sx: {
                    width: "20% !important",
                  },
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -20],
                      },
                    },
                  ],
                },
              }}
              renderInput={(params) => (
                <div ref={params.InputProps.ref}>
                  <input
                    type="text"
                    {...params.inputProps}
                    style={{ height: "50px", paddingLeft: "10px" }}
                  />
                </div>
              )}
            />
          </Box>
        ),
    },
    {
      field: "price",
      headerName: "Price",
      hideable: false,
      flex: 1,
      editable: true,
      renderHeader: () => (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>Price/Unit</div>
          <hr style={{ width: "100%" }} />
          <div style={{ fontWeight: "bold" }}>without tax</div>
        </div>
      ),
      renderCell: (params) => console.log(params),
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
      renderCell: (params) =>
        params.row.id === "total" ? (
          <div>{params.row.discountAmount}</div>
        ) : (
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
                  backgroundColor: "transparent",
                  outline: "none",
                  border: "none",
                  paddingBottom: "20px",
                  paddingTop: "20px",
                }}
                type="text"
                value={params.row.discount}
                onChange={(e) =>
                  handleDiscountPercentageChange(
                    params.row.id,
                    "discount",
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
                  backgroundColor: "white",
                  outline: "none",
                  border: "none",
                  paddingBottom: "20px",
                  paddingTop: "20px",
                }}
                type="text"
                value={
                  (params.row.qty || 0) *
                  (params.row.price || 0) *
                  ((params.row.discount || 0) / 100)
                }
                disabled
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
        const taxValue = params.row.taxvalueinpercentage?.replace("%", "");
    
        const discountedAmount = (
          (params.row.qty || 0) *
          (params.row.price || 0) *
          ((params.row.discount || 0) / 100)
        ).toFixed(2);
        const discountedTotal =
          (params.row.qty || 0) * (params.row.price || 0) - discountedAmount;
        const taxAmount = discountedTotal * (taxValue / 100);
    
        return params.row.id === "total" ? (
          <div>{params.row.discountAmount}</div>
        ) : (
          <div style={{ width: "100%", display: "flex" }}>
            <select
              value={
                params.row.taxAppliedamount
                  ? params.row.taxAppliedamount
                  : params.row.taxApplied?.split("GST@ ")[1]
              }
              onChange={(e) => {
                const selectedTaxOption = taxOptions.find(option => option.value === e.target.value);
                const taxId = selectedTaxOption ? selectedTaxOption.taxlabel : null;
                handleTaxValueChange(
                  params.row.id,
                  "taxvalueinpercentage",
                  e.target.value,
                  params.row.taxAppliedamount
                    ? params.row.taxAppliedamount
                    : params.row.taxApplied?.split("GST@ ")[1],
                  taxId
                );
              }}
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
              value={taxAmount || 0}
              disabled
            />
          </div>
        );
      },
    },
    

    {
      field: "amount",
      headerName: "Amount",
      hideable: false,
      flex: 1,
      renderCell: (params) => {
        const discountedAmount = (
          (params.row.qty || 0) *
          (params.row.price || 0) *
          ((params.row.discount || 0) / 100)
        ).toFixed(2);
        const discountedTotal =
          (params.row.qty || 0) * (params.row.price || 0) - discountedAmount;
        const taxValue = parseFloat(
          params.row.taxvalueinpercentage?.replace("%", "") || 0
        );
        const taxAmount = discountedTotal * (taxValue / 100);
        const totalAmount = (discountedTotal + taxAmount).toFixed(2);

        return totalAmount;
      },
    },
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
      {/* <button onClick={addNewRow}>Add Row</button> */}

      <DataGrid
        rows={[...rows, calculateTotals()]}
        {...other}
        columns={columns}
        editMode="row"
        disableColumnMenu
        //   rowModesModel={rowModesModel}
        //   onRowModesModelChange={handleRowModesModelChange}
        //   onRowEditStop={handleRowEditStop}
        processRowUpdate={handleEdit}
        //   slotProps={{
        //     toolbar: { setRows, setRowModesModel },
        //   }}
        sx={{
          "& .MuiDataGrid-footerContainer": {
            display: "none !important",
          },
          "& .css-3dzjca-MuiPaper-root-MuiPopover-paper-MuiMenu-paper ": {
            maxHeightheight: "calc(5% - 96px) !important",
          },
        }}
      />
    </Box>
  );
}

export default ExpenceTable;
