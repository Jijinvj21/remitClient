import { Autocomplete, Box, Button, CircularProgress, Typography } from "@mui/material";
import "./DeliveryChallan.scss";
import { useEffect, useState } from "react";
import InputComponent from "../../components/InputComponent/InputComponent";
// import TransactionTable from "../../components/TransactionTable/TransactionTable";
import SalesTable from "../../components/SalesTable/SalesTable";

import {
  categeryGetAPI,
  deliveryChallanAddAPI,
  gstOptionsGetAPI,
  partyDataGetAPI,
  productAddAPI,
  productGetAPI,
  projectGetAPI,
  stateDataGetAPI,
  unitsDataGetAPI,
} from "../../service/api/admin";
import AddProductDrawer from "../../components/AddProductDrawer/AddProductDrawer";
import ImageAdd from "../../assets/sideBar/ImageAdd.svg";
import jsPDF from "jspdf";
import "jspdf-autotable";

function DeliveryChallan() {
  const [partyOptions, setPartyOptions] = useState([]);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null); // State to hold selected product
  const [totalValues, setTotalValues] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // State to hold selected product
  const [tableRows, setTableRows] = useState([]); // State to hold table rows
  const [state, setState] = useState({
    right: false,
  });
  const [productOptions, setProductOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [taxRateValue, setTaxRateValue] = useState({});
  const [ProductDrawerFormData, setProductDrawerFormData] = useState({
    name: "",
    quantity: "",
    rate: 0,
    hsn: "",
  });
  const [projectValue, setProjectValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [img, setImg] = useState(null);
  const [taxOptions, setTaxOptions] = useState([]);
  const [toggle, setToggle] = useState(true);

  const [challanNo, setChallanNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState();
  const [dueDate, setDueDate] = useState("");
  const [stateOfSupply, setStateOfSupply] = useState("");
  const [description, setDescription] = useState("");
const [imgDelivery, setImgDelivery] = useState(null);
const [roundOff, setRoundOff] = useState(0);
const [total, setTotal] = useState(0);
const [partySelect, setPartySelect] = useState(0);
const [stateOPtions, setStateOPtions] = useState();
const [isChecked, setIsChecked] = useState(false);
const [isDesabled, setIsDesabled] = useState(true);
const [clientData,setclientData]= useState({});


const groupByHSN = (data) => {
  const groupedData = data.reduce((acc, curr) => {
    console.log("firstcurr.taxRate",(parseInt(curr.taxApplied?.split("@")[1].replace("%", ""))||0))
    if (!acc[curr.hsn]) {
      acc[curr.hsn] = {
        hsn: curr.hsn,
        total: 0,
        cgstRate: (parseInt(curr.taxApplied?.split("@")[1].replace("%", ""))||0) / 2,
        sgstRate: (parseInt(curr.taxApplied?.split("@")[1].replace("%", ""))||0) / 2,
        cgstAmount: 0,
        sgstAmount: 0
      };
    }
    const totalValue = curr.qty * curr.rate;
    acc[curr.hsn].total += totalValue;
    acc[curr.hsn].cgstAmount += (totalValue * ((parseInt(curr.taxApplied?.split("@")[1].replace("%", ""))||0) / 100)) / 2;
    acc[curr.hsn].sgstAmount += (totalValue * ((parseInt(curr.taxApplied?.split("@")[1].replace("%", ""))||0) / 100)) / 2;
    return acc;
  }, {});

  return Object.values(groupedData);
};

const transformedData = groupByHSN(rows);
  
const handleCheckboxChange = (event) => {
  setIsChecked(event.target.checked);
};
const handlepdfgenerate = () => {
  const pdfpagedata = document.querySelector("#pagedatatoshow");
  const pdf = new jsPDF("p", "pt", "a4", true);
  pdf.html(pdfpagedata, {
    callback: () => {
      const blobURL = pdf.output("bloburl");
      window.open(blobURL, "_blank");
    },
  });
};


useEffect(() => {
  const updatedRows = rows.map((row) => {
    const quantity = parseInt(row.qty) || 0; // Parsing quantity to integer, defaulting to 0 if NaN
    const rate = parseInt(row.rate) || 0; // Parsing rate to integer, defaulting to 0 if NaN

    const totalWithoutTax = quantity * rate;

    const totalWithTax = totalWithoutTax - (row.amountafterdescount || 0); // Subtracting discount amount from totalWithoutTax

    let taxAppliedamount = 0; // Initializing taxAppliedamount variable
    if (row.taxAppliedamount) {
      taxAppliedamount =
        parseFloat(row.taxAppliedamount.replace("%", "")) || 0; // Parsing taxAppliedamount to float, defaulting to 0 if NaN
    } else if (row.taxApplied?.value) {
      taxAppliedamount =
        parseFloat(row.taxApplied.value.replace("%", "")) || 0; // Parsing taxApplied.value to float, defaulting to 0 if NaN
    } else if (row.taxApplied) {
      taxAppliedamount =
        parseFloat(row.taxApplied.split("@")[1].replace("%", "")) || 0; // Parsing taxApplied to float, defaulting to 0 if NaN
    }

    const total = (
      (totalWithTax * taxAppliedamount) / 100 +
      totalWithTax
    ).toFixed(2); // Calculating total with tax and rounding to 2 decimal places

    return {
      ...row,
      total: total,
    };
  });

  const grandTotal = updatedRows.reduce(
    (sum, row) => sum + parseFloat(row.total),
    0
  ); // Summing up all row totals
  const roundedGrandTotal = Math.round(grandTotal); // Rounding grandTotal to the nearest integer

  isChecked
    ? setRoundOff((grandTotal - roundedGrandTotal).toFixed(2))
    : setRoundOff(0);
  isChecked ? setTotalValues(roundedGrandTotal) : setTotalValues(grandTotal);
}, [rows, isChecked]); // Update when rows or isChecked change

useEffect(() => {
  stateDataGetAPI().then((data)=>{
    console.log("stateData",data.data.responseData)
    const stateData = data.data.responseData.map((entry) => ({
      value: entry.id,
      label: entry.name,
    }));
    stateData.unshift({ value: -2, label: "Select" })

    setStateOPtions(stateData)
  }).catch((err)=>{
console.log(err)
  })

  partyDataGetAPI()
  .then((data) => {
    console.log("partyData:", data);
    // setTaxOptions(data);

    // Transform data and set it to state
    const partyData = data.responseData.map((entry) => ({
      value: entry.id,
      label: entry.name,
      address1:entry.address1,
      address2:entry.address2,
      phonenumber:entry.phonenumber,
    }));
    console.log(partyData);
    setPartyOptions(partyData);
  })
  .catch((err) => {
    console.log(err);
  });
}, []);
const handleSetParty = (e, data) => {
  console.log("datadata",data)
  setclientData(data)
  setPartySelect(data.value);
};

const handleDescriptionChange = (e) => {
  setDescription(e.target.value);
};

const handleImageChange = (e) => {
  const file = e.target.files[0];
  setImgDelivery(file);
};




  const handleDrawerImageChange = (e) => {
    const file = e.target.files[0];

    setImg(file);
  };
  const handleTaxRateChange = (event) => {
    console.log(event.target.value);
    const selectedOptionObject = taxOptions.find(
      (option) => option.taxlabel == event.target.value
    );
    console.log(selectedOptionObject);
    // setTaxRateValue({
    //   label: selectedOptionObject ? selectedOptionObject.label : "", // Handle case where selectedOptionObject is undefined
    //   value: event.target.value
    // });
    setTaxRateValue(selectedOptionObject);
  };
  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
    console.log(event.target.value);
  };

  const handleSelectProject = (event) => {
    setProjectValue(event.target.value);
    console.log(event.target.value);
  };

  const handleSelectCatogary = (event) => {
    setCategoryValue(event.target.value);
    console.log(event.target.value);
  };

  const handleDrawerAddProducts = () => {
    const formData = new FormData();

    formData.append("name", ProductDrawerFormData.name);
    formData.append("hsn", ProductDrawerFormData.hsn);
    formData.append("rate", parseInt(ProductDrawerFormData.rate));
    formData.append("quantity", parseInt(ProductDrawerFormData.quantity));
    formData.append("unit", selectedValue);
    formData.append("projectid", parseInt(projectValue));
    formData.append("is_master_product", toggle);
    // formData.append("category_id", categoryValue);
    // formData.append('gst', ((parseInt(ProductDrawerFormData.rate) * parseInt(ProductFormData.quantity)) * (taxRateValue.value?.replace("%", ""))) / 100);
    formData.append("tax_rate", taxRateValue.id);
    formData.append("image", img);

    productAddAPI(formData)
      .then((data) => {
        fetchData();
        if (data.status === 200) {
          setProductDrawerFormData({
            name: "",
            qate: "",
            quantity: "",
            rate: "",
            taxvalue: "",
            hsn: "",
          });
          setSelectedValue("");
          setTaxRateValue("");
          alert("Product added successfully");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Problem in adding product");
      });
  };

  const getTaxOptionsFormAPI = () => {
    gstOptionsGetAPI()
      .then((data) => {
        console.log("tax:", data);
        // setTaxOptions(data);

        // Transform data and set it to state
        const transformedData = data.map((entry) => ({
          value: entry.percentage,
          label: entry.name ? `${entry.name} ${entry.percentage}` : "none",
          taxlabel: entry.percentage,
          id: entry.id,
        }));
        console.log(transformedData);
        setTaxOptions(transformedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCategeryOptionsFormAPI = () => {
    categeryGetAPI()
      .then((data) => {
        console.log("category:", data);

        // Transform data and set it to state
        const categoryOptions = data?.responseData.map((entry) => ({
          value: entry.id,
          label: `${entry.name}`,
        }));
        categoryOptions.unshift({ value: 0, label: "None" });

        console.log("categoryOptions", categoryOptions);
        setCategoryOptions(categoryOptions);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getClientOptionsFormAPI = () => {
    projectGetAPI()
      .then((data) => {
        console.log("projects:", data);

        // Transform data and set it to state
        const projectdData = data?.responseData.map((entry) => ({
          value: entry.id,
          label: `${entry.name} ( ${entry.client_name} )`,
        }));
        projectdData.unshift({ value: 0, label: "None" });

        console.log("projectdData", projectdData);
        setProjectOptions(projectdData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getUnitOptionsFormAPI = () => {
    unitsDataGetAPI()
      .then((data) => {
        console.log("units:", data);

        // Transform data and set it to state
        const unitsdData = data?.responseData.map((entry) => ({
          value: entry.id,
          label: entry.name,
        }));
        unitsdData.unshift({ value: 0, label: "None" });
        console.log("unitsdData", unitsdData);
        setUnitOptions(unitsdData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchData = async () => {
    const response = await productGetAPI();
    const products = response.responseData;
    const productNames = products.map((product) => product.name);
    const options = productNames.map((name, index) => ({
      value: `option${index + 1}`,
      label: name,
    }));
    options.unshift({ value: -2, label: "Add" });
    setProductOptions(options);
  };
  useEffect(() => {
    fetchData();
    setProductOptions([{ value: -2, label: "Add" }]);
    getTaxOptionsFormAPI();
    getCategeryOptionsFormAPI();
    getClientOptionsFormAPI();
    getUnitOptionsFormAPI();
  }, []);
  const handleDrawerSelectChange = (event) => {
    setSelectedValue(event.target.value);
    console.log(event.target.value);
  };
  const handleDrawerChange = (e) => {
    const { name, value } = e.target;
    setProductDrawerFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const arrOfDrawerInputs = [
    {
      handleChange: handleDrawerChange,
      intputName: "name",
      label: " Product Name",
      type: "text",
    },
    {
      handleChange: handleDrawerChange,
      intputName: "rate",
      label: "Rate",
      type: "number",
    },
    {
      handleChange: handleDrawerChange,
      intputName: "quantity",
      label: "Quantity",
      type: "number",
    },
    {
      handleChange: handleTaxRateChange,
      intputName: "taxrate",
      label: "Tax Rate",

      inputOrSelect: "select",
      options: taxOptions,
    },
    {
      intputName: "taxvalue",
      label: " Tax Value",
      // type: "number",
      value:
        (parseFloat(ProductDrawerFormData.rate || 0) *
          parseFloat(ProductDrawerFormData.quantity || 0) *
          (parseFloat(taxRateValue.value?.replace("%", "")) || 0)) /
        100,

      disabled: "disabled",
    },
    {
      handleChange: handleDrawerChange,
      intputName: "hsn",
      label: "HSN",
      type: "text",
    },
    {
      handleChange: handleSelectChange,
      intputName: "unit",
      label: "Unit",
      // type: "text",

      inputOrSelect: "select",
      options: unitOptions,
    },
    {
      handleChange: handleSelectProject,
      intputName: "project",
      label: "Projects",
      // type: "text",
      // value:selectedValue,

      inputOrSelect: "select",
      options: projectOptions,
    },
    // {
    //   handleChange: handleSelectCatogary,
    //   intputName: "categery",
    //   label: "Categerys",
    //   // type: "text",
    //   // value:selectedValue,

    //   inputOrSelect: "select",
    //   options: categoryOptions,
    // },
  ];

  const toggleDrawer = (anchor, open) => (event) => {
    console.log(event);
    console.log("Toggle Drawer:", anchor, open);
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const handleSelectedProductChange = async (event, newValue) => {
    if (!newValue) {
      // Handle the case where newValue is not defined
      return;
    }
    if (newValue.value === -2) {
      console.log(newValue.value === -2);
      toggleDrawer("right", true)();
    } else {
      setSelectedProduct(newValue);

      if (newValue) {
        console.log(newValue.label);
        // Set the amount based on the selected product
        const response = await productGetAPI();
        console.log(response);
        const products = response.responseData;

        const selectedProductData = products.find(
          (product) => product.name === newValue?.label
        );
        console.log(selectedProductData);
        setSelectedProductDetails(selectedProductData);
        console.log(selectedProductData);
        // Add selected product to the table rows
        const newRow = {
          id: 1,
          itemName: selectedProductData.name,
          qty: 1, // You can set default quantity here
          unit: selectedProductData.unit, // Assuming selectedProductData has a unit property
          price: selectedProductData.price, // Assuming selectedProductData has a price property
          discount: 0, // Assuming default discount is 0
          taxApplied: 0, // Assuming default tax applied is 0
          total: selectedProductData.price, // Assuming total is initially equal to price
        };
        setTableRows([...tableRows, newRow]);
      }
    }
  };

  const handleChallanNoChange = (e) => {
    setChallanNo(e.target.value);
  };

  const handleInvoiceDateChange = (e) => {
    setInvoiceDate(e.target.value);
  };

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
  };

  const handleStateOfSupplyChange = (e) => {
    console.log("firste.target.value",e.target.value)
    setStateOfSupply(e.target.value);
  };

  const topleftinput = [
    {
      intputName: "challanno",
      label: "Challan No",
      type: "text",
      handleChange: handleChallanNoChange,
      value: challanNo,
    },
    {
      handleChange: handleInvoiceDateChange,
      label: "Invoice Date",
      type: "date",
      value: invoiceDate,
    },
    {
      handleChange: handleDueDateChange,
      label: "Due Date",
      type: "date",
      value: dueDate,
    },
    {
      handleChange: handleStateOfSupplyChange,
      intputName: "statusofsupply",
      label: "State of supply",
      inputOrSelect: "select",
      options: stateOPtions,
      value: stateOfSupply,
    },
  ];

  const deliveryChallanAdd = async () => {
    setIsDesabled(false)

    const newArray = await rows.map((item) => ({
        product_id: item.id,
        quantity: item.qty,
        Price: item.qty * item.rate,
        discount: parseFloat(item?.descountvalue || 0),
        tax_rate_id: (item.taxId || 1 )
    }));

    const data = {
        due_date: dueDate,
        date: invoiceDate,
        challan_no: challanNo,
        state_id: stateOfSupply,
        party_id: partySelect,
        description: description,
        products: newArray
    };

    // Convert the data object to FormData
    const formData = new FormData();
    formData.append('due_date', data.due_date);
    formData.append('date', data.date);
    formData.append('challan_no', data.challan_no);
    formData.append('state_id', data.state_id);
    formData.append('party_id', data.party_id);
    formData.append('description', data.description);

        formData.append(`products`, JSON.stringify(data.products));
        formData.append(`image`,imgDelivery );


    // Log the FormData entries (for debugging purposes)
    // for (let pair of formData.entries()) {
    //     console.log(pair[0] + ': ' + pair[1]);
    // }

    // If you want to use the FormData with an API call, uncomment the following:
    deliveryChallanAddAPI(formData).then((res) => {
        console.log(res);
        alert("Delivery Challan added")
        setPartySelect()
        setChallanNo("")
        setInvoiceDate("")
        setDueDate("")
        setRows([])
        setDescription("")
        setStateOfSupply({})
        setIsDesabled(true)

    }).catch((err) => {
        console.log(err);
        alert("Delivery Challan adding Problem ")
        setIsDesabled(true)

    });
};


  return (
    <div className="deliverychallan-page">
      <h2>Delivery Challan</h2>
      <div className="inner-section">
        <div className="top-section">
          <Box sx={{ width: "100%", marginBottom: "10px" }}>
            <p className="party-name">Party</p>

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
              options={partyOptions}
                // value={partySelect}
              onChange={handleSetParty}
              componentsProps={{
                popper: {
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
                    style={{ height: "38px" }}
                  />
                </div>
              )}
            />
          </Box>
          <div className="rightinputs">
            {topleftinput.map((input, index) => {
              return (
                <InputComponent
                  key={index}
                  label={input.label}
                  type={input.type}
                  handleChange={input.handleChange}
                  intputName={input.intputName}
                  inputOrSelect={input.inputOrSelect}
                  value={input.value}
                  disabled={input.disabled}
                  options={input.options}
                />
              );
            })}
          </div>
        </div>
        <div className="middle-section">
          <Box
            sx={{
              width: "100%",
              marginBottom: "10px",
              "& .css-g6k71e-MuiAutocomplete-root": {
                width: "100% !important",
                paddingTop: "10px",
              },
              "& .css-6oxs1k-MuiAutocomplete-root": {
                width: "100% !important",
              },
              // "& .css-74bi4q-MuiDataGrid-overlayWrapper":{
              //   height: "60px",
              // },
            }}
          >
            <p className="products-name">products</p>

            <Autocomplete
              sx={{
                display: "inline-block",
                "& input": {
                  width: "100% !important ",
                  height: "41px",

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
              value={selectedProduct}
              onChange={handleSelectedProductChange}
              componentsProps={{
                popper: {
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
                    style={{ height: "10xp" }}
                  />
                </div>
              )}
            />
          </Box>
          {/* <TransactionTable
            selectedProductData={selectedProductDetails}
            totalValues={totalValues}
            rows={rows}
            setRows={setRows}
          /> */}
                <SalesTable
              selectedProductData={selectedProductDetails}
              setTotalValues={setTotalValues}
              totalValues={totalValues}
              setRows={setRows}
              rows={rows}
            />
        </div>
        <div className="bottom-section">
  <div>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        paddingBottom: "10px",
      }}
    >
      <label style={{ fontSize: "12px" }} htmlFor="descriptiontextarea">
        Description
      </label>
      <textarea
        id="descriptiontextarea"
        value={description}
        onChange={handleDescriptionChange}
        rows={2} // Set the number of visible rows
        cols={50} // Set the number of visible columns
      />
    </div>

    <Button
      disableRipple
      style={{
        textTransform: "none",
        color: "var(--black-button)",
        "&:hover": {
          background: "transparent",
        },
      }}
      component="label"
    >
      <img src={ImageAdd} alt="add img" />
      <Typography
        variant="string"
        style={{
          paddingLeft: 1,
        }}
      >
        Add Photo
      </Typography>
      <input
        type="file"
        hidden
        onChange={handleImageChange}
      />
    </Button>
  </div>
  <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
              width: "40%",
            }}
          >
            <InputComponent
              type="checkbox"
              handleChange={handleCheckboxChange}
            />
            <InputComponent
              label="Round off"
              type="number"
              intputName="roundoff"
              value={roundOff}
              disabled="disabled"
              // handleChange={handleRoundOffChange}
            />
            <InputComponent
              label="total"
              type="number"
              intputName="total"
              value={totalValues}
              disabled="disabled"
              // handleChange={handleTotalChange}
            />
          </div>
</div>
<hr />
        <div style={{ display: "flex", justifyContent: "end" }}>
          <Button
            variant="contained"
            sx={{
              height: 40,
              my: 2,
              marginRight: 2,
              textTransform: "none",
              bgcolor: "var(--black-button)",
            }}
            onClick={handlepdfgenerate}

          >
            Print
          </Button>
          <Button
            variant="contained"
            sx={{
              height: 40,
              my: 2,
              marginRight: 2,
              textTransform: "none",
              bgcolor: "var(--black-button)",
              '&:disabled': {
                bgcolor: "var(--black-button)",
                color: 'white', },
            }}
            
            onClick={deliveryChallanAdd}
            disabled={!isDesabled}
          >
           {isDesabled? "Save":
            <CircularProgress style={{color:"white",marginBottom:"15px",marginTop:"15px"}} size={20} />
          }</Button>
        </div>

      </div>
      <AddProductDrawer
        handleSelectChange={handleDrawerSelectChange}
        arrOfInputs={arrOfDrawerInputs}
        toggleDrawer={toggleDrawer}
        state={state}
        ProductFormData={ProductDrawerFormData}
        handleImageChange={handleDrawerImageChange}
        handleAdd={handleDrawerAddProducts}
        setToggle={setToggle}
        toggle={toggle}
      />
       <div  id="pagedatatoshow"className="offscreen" style={{ margin: "8px", width: "580px" ,  }}>
        <h6 style={{ textAlign: "center", marginBottom: "10px" }}>
          Tax Invoice
        </h6>
        <div style={{ border: "1px solid" }}>
          <div className="topsection" style={{ display: "flex" }}>
            <div
              className="left"
              style={{ display: "flex", flexDirection: "column", width: "50%" }}
            >
              <div style={{ display: "flex", borderBottom: "1px solid" }}>
                <div style={{ width: "100px", height: "100px" }}>
                  <img src="https://res.cloudinary.com/dczou8g32/image/upload/v1714668042/DEV/jw8j76cgw2ogtokyoisi.png" alt="img" width={90} height={90}/>
                </div>
                <div className="address" >
                  <h6>BILTREE</h6>
                  <h6>54/3175</h6>
                  <h6>MANGHAT ARCADE</h6>
                  <h6>KALOOR-KADAVANTHRA ROAD</h6>
                  <h6>KADAVANTHRA,ERNAKULAM</h6>
                  <h6>GSTIN/UIN:32AAVFB8613K1Z3</h6>
                  <h6>State Name:Kerala, Code : 32</h6>
                  <h6>E-Mail:info@biltree.in</h6>
                </div>
              </div>
              <div style={{ borderBottom: "1px solid", marginLeft:"2px",display:"flex",flexDirection:"column",gap:"3px" }}>
                <h6>Consignee (Ship to)</h6>
                 <h5>{clientData?.label}</h5>
                <h6>{clientData?.address1}</h6>
                 <h6>{clientData?.address2}</h6> 
                <h6>{clientData?.phonenumber}</h6> 

                <h6 style={{ display: "flex", gap: "20px",marginBottom:"3px" }}>
                  <span>GSTIN/UIN</span> <span>: 32AAFFC5911M2Z1</span>
                </h6>
                
              </div>
              <div style={{ marginLeft:"2px",display:"flex",flexDirection:"column",gap:"3px"}}>
              <h5>{clientData?.label}</h5>
                <h6>{clientData?.address1}</h6>
                 <h6>{clientData?.address2}</h6> 
                <h6>{clientData?.phonenumber}</h6> 
                <h6 style={{ display: "flex", gap: "20px", }}>
                  <span>GSTIN/UIN</span> <span>: 32AAFFC5911M2Z1</span>
                </h6>
                
              </div>
            </div>
            <div className="right" style={{ width: "50%" }}>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead style={{ borderBottom: "1px solid black" }}>
                  <tr>
                    <td
                      style={{ borderLeft: "1px solid black", padding: "8px" }}
                    >
                      <h6>Invoice No</h6>
                      {/* <h6>{ generateRandom6Digit(new Date())}</h6> */}
                      <h6>{challanNo}</h6>
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid black",
                        borderLeft: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      <h6>Date</h6>
                     { invoiceDate &&<h6>{new Date(invoiceDate)?.toLocaleDateString()}</h6>}
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{ borderLeft: "1px solid black", padding: "8px" }}
                    >
                      
                      <h6>Delivery Note</h6>
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid black",
                        borderLeft: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      
                      <h6>Mode/Terms of Payment</h6>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        borderTop: "1px solid black",
                        borderLeft: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      
                      <h6>Reference No.& Date</h6>
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid black",
                        borderLeft: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      
                      <h6>Other References</h6>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        borderTop: "1px solid black",
                        borderLeft: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      
                      <h6>Buyer's Order No</h6>
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid black",
                        borderLeft: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      
                      <h6>Date</h6>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        borderTop: "1px solid black",
                        borderLeft: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      
                      <h6>Dispatch Doc No</h6>
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid black",
                        borderLeft: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      
                      <h6>Delivery Note Date</h6>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        borderTop: "1px solid black",
                        borderLeft: "1px solid black",
                        borderBottom: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      
                      <h6>Dispatch throught</h6>
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid black",
                        borderLeft: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      
                      <h6>Destination</h6>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ borderLeft: "1px solid black", padding: "8px" }}
                    >
                      <h6 style={{ marginBottom: "75px" }}>
                        Terms of Delivery
                      </h6>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="middlesection">
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead
                style={{
                  borderBottom: "1px solid black",
                  borderTop: "1px solid black",
                }}
              >
                <tr>
                  <th>
                    
                    <h6>Sl.No</h6>
                  </th>
                  <th style={{ borderLeft: "1px solid black" }}>
                    
                    <h6>
                      Description of <br /> Goods and Services
                    </h6>
                  </th>
                  <th style={{ borderLeft: "1px solid black" }}>
                    
                    <h6>HSN/SAC</h6>
                  </th>
                  <th style={{ borderLeft: "1px solid black" }}>
                    
                    <h6>Quantity</h6>
                  </th>
                  <th style={{ borderLeft: "1px solid black" }}>
                    
                    <h6>Rate</h6>
                  </th>
                  <th style={{ borderLeft: "1px solid black" }}>
                    
                    <h6>Per</h6>
                  </th>
                  <th style={{ borderLeft: "1px solid black" }}>
                    
                    <h6>Amount</h6>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((data, index) => {
                   console.log("firstdata",data)
                  return(
                    <tr key={index} style={{borderBottom: "1px solid black",}}>
                      <td style={{paddingLeft:"3px",paddingBottom:"5px"}}>
                        
                        <h6>{index+1}</h6>
                      </td>
                      <td style={{ borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"5px" }}>
                        
                        <h6>{data.name}</h6>
                      </td>
                      <td style={{ borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"5px" }}>
                        
                        <h6> </h6>
                      </td>
                      <td style={{ borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"5px" }}>
                        
                        <h6>{data.qty}</h6>
                      </td>
                      <td style={{ borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"5px" }}>
                        
                        <h6> {data.rate}</h6>
                      </td>
                      <td style={{ borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"5px" }}>
                        
                        <h6> {data.unit}</h6>
                      </td>
                      <td style={{ borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"5px" }}>
                        
                        <h6>{((data.rate||0)*(data.qty)||0)}</h6>
                      </td>
                    </tr>
                  )})}
                
                {/* <tr
                  style={{
                    borderTop: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  <td> </td>
                  <td
                    style={{ textAlign: "end", borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"1px" }}
                  >
                    
                    <h6> Total</h6> 
                  </td>
                  <td
                    style={{ textAlign: "end", borderLeft: "1px solid black" }}
                  >
                    
                  </td>
                  <td
                    style={{ textAlign: "end", borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"1px" }}
                  >
                    
                     <h6>{pdfData?.product_info?.length} Nos</h6> 
                  </td>
                  <td
                    style={{ textAlign: "end", borderLeft: "1px solid black" }}
                  ></td>
                  <td
                    style={{ textAlign: "end", borderLeft: "1px solid black" }}
                  ></td>
                  <td
                    style={{ textAlign: "end", borderLeft: "1px solid black",paddingLeft:"3px",paddingBottom:"1px" }}
                  >
                    
                     <h6> {subtotal}</h6> 
                  </td>
                </tr> */}
              </tbody>
            </table> 
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
              marginLeft:"2px"
            }}
          >
            <h6>Amount Chargeable (in words)</h6>
            <h6>E.&.O.E</h6>
          </div>
          <h6 style={{ marginTop: "5px" }}>
            INR Sixteen lakh Twenty Eight Thousand Six Hundred Fifty One Only
          </h6>

          <table
  style={{
    borderCollapse: "collapse",
    width: "100%",
    marginTop: "10px",
  }}
>
  <thead
    style={{
      borderBottom: "1px solid black",
      borderTop: "1px solid black",
    }}
  >
    <tr>
      <th style={{ borderLeft: "1px solid black" }} rowSpan="2">
        <h6> HSN/SAC</h6>
      </th>
      <th style={{ borderLeft: "1px solid black" }} rowSpan="2">
        <h6> Taxable Value</h6>
      </th>
      <th style={{ borderLeft: "1px solid black",borderBottom: "1px solid black",borderRight: "1px solid black" }} colSpan="2">
        <h6> CGST</h6>
      </th>
      <th style={{ borderLeft: "1px solid black",borderBottom: "1px solid black" }} colSpan="2">
        <h6> SGST/UTGST</h6>
      </th>
      <th style={{ borderLeft: "1px solid black" }}>
        <h6> Total Tax Amount</h6>
      </th>
    </tr>
    <tr>
      <th style={{ borderLeft: "1px solid black" }}>
        <h6> Rate</h6>
      </th>
      <th style={{ borderLeft: "1px solid black" }}>
        <h6> Amount</h6>
      </th>
      <th style={{ borderLeft: "1px solid black" }}>
        <h6> Rate</h6>
      </th>
      <th style={{ borderLeft: "1px solid black",borderRight: "1px solid black" }}>
        <h6> Amount</h6>
      </th>
    </tr>
    
  </thead>
  <tbody style={{ borderBottom: "1px solid black"}}>
  {transformedData?.map(item => (
    <tr key={item?.hsn}>
      <td style={{ borderLeft: "1px solid black" }}>
        <h6> {item?.hsn}</h6>
      </td>
      <td style={{ borderLeft: "1px solid black" }}>
        <h6> {item?.total.toFixed(2)}</h6>
      </td>
      <td style={{ borderLeft: "1px solid black" }}>
        <h6> {item?.cgstRate}</h6>
      </td>
      <td style={{ borderLeft: "1px solid black" }}>
        <h6> {item?.cgstAmount.toFixed(2)}</h6>
      </td>
      <td style={{ borderLeft: "1px solid black" }}>
        <h6> {item?.sgstRate}</h6>
      </td>
      <td style={{ borderLeft: "1px solid black" }}>
        <h6> {item?.sgstAmount.toFixed(2)}</h6>
      </td>
      <td style={{ borderLeft: "1px solid black" }}>
        <h6>{ (item?.total+item?.sgstAmount+item?.cgstAmount).toFixed(2)}</h6>
      </td>
    </tr>
            ))}

  </tbody>
</table>


          <div style={{ display: "flex", gap: "10px", marginTop: "5px",marginLeft:"2px" }}>
            
            <h6>Tax Amount (in words)</h6>
            <h6>
              INR Sixteen lakh Twenty Eight Thousand Six Hundred Fifty One Only
            </h6>
          </div>
          <div style={{display:"flex",flexDirection:"column",justifyContent:"end", marginTop: "5px",marginLeft:"50%",fontSize:"12px"}}>
            <h6>Company's bank details</h6>
            <div style={{display:"flex",gap:"16.4px"}}>
              <h6>A/c Holder Name</h6>
              <h6>: BILTREE</h6>
            </div>
            <div style={{display:"flex",gap:"38px"}}>
              <h6>Bank Name</h6>
              <h6>: ICICI BANK CA - 785236984125</h6>
            </div>
            <div style={{display:"flex",gap:"56.6px"}}>
              <h6>A/c No</h6>
              <h6>: 785236984125</h6>
            </div>
            <div style={{display:"flex",gap:"12.4px"}}>
              <h6>Branch & IFS Code</h6>
              <h6>: PANAMPILLY MAGAR & ICIC0002483</h6>
            </div>
            <h6>SWIFT Code</h6>
          </div>
          <div style={{display:'flex'}}>
            <div className="leftsection" style={{width:"50%",marginLeft:"2px",marginBottom:"3px"}}>
<h6 style={{borderBottom:"1px solid black",width:"60px"}}>Declaration</h6>

<h6>we seclare that this invoice shows the actual price of the goods described and that all particulars are true and currect</h6>
            </div>
            <div className="rightsection" style={{width:"50%",textAlign:"end",borderTop:"1px solid black",borderLeft:"1px solid black"}}>
<h6 style={{marginBottom:"23px",marginRight:"5px"}}>for BILTREEE</h6>
              <h6 style={{marginRight:"5px"}}>Authorised Signatory</h6>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default DeliveryChallan;
