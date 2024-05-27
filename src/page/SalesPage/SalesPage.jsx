import SalesTable from "../../components/SalesTable/SalesTable";
import "./SalesPage.scss";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useEffect, useRef, useState } from "react";
import Modal from "@mui/material/Modal";
import InputComponent from "../../components/InputComponent/InputComponent";
import {
  categeryGetAPI,
  clientDataGetAPI,
  createVoucherAPI,
  gstOptionsGetAPI,
  productAddAPI,
  productGetAPI,
  projectGetAPI,
  unitsDataGetAPI,
} from "../../service/api/admin";
import AddProductDrawer from "../../components/AddProductDrawer/AddProductDrawer";
import { generateRandom6Digit } from "../../utils/randomWithDate";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: '2px solid #000',
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};
 
function SalesPage() {
  const selectRef = useRef(null);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null); // State to hold selected product
  const [totalValues, setTotalValues] = useState(0);
  const [inputData, setInputData] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState(null); // State to hold selected product

  const [tableRows, setTableRows] = useState([]); // State to hold table rows
  const [inputValue, setInputValue] = useState(""); // State to hold the value of the new input
  const [open, setOpen] = useState(false);
  const [clinedOptions, setClientOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("none");
  const [selectedCustomer, setSelectedCustomer] = useState("none");
  const [rows, setRows] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [ProductDrawerFormData, setProductDrawerFormData] = useState({
    name: "",
    quantity: "",
    rate: 0,
    hsn: "",
  });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [taxRateValue, setTaxRateValue] = useState({});
  const [selectedValue, setSelectedValue] = useState("");
  const [state, setState] = useState({
    right: false,
  });
  const [projectValue, setProjectValue] = useState("");
  // const [categoryValue, setCategoryValue] = useState("");
  const [img, setImg] = useState(null);
  const [taxOptions, setTaxOptions] = useState([]);
const [clientData,setclientData]= useState({});
const [isDesabled, setIsDesabled] = useState(true);


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

  const getTaxOptionsFormAPI = () => {
    gstOptionsGetAPI()
      .then((data) => {
        console.log("tax:", data);

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

  const handleClose = () => setOpen(false);

  useEffect(() => {
    getTaxOptionsFormAPI();
    getUnitOptionsFormAPI();
    getClientOptionsFormAPI();
    getCategeryOptionsFormAPI();
    clientDataGetAPI()
      .then((data) => {
        // setTaxOptions(data);
        
        // Transform data and set it to state
        const clientData = data.responseData.map((entry) => ({
          value: entry.id,
          label: `${entry.project_name} ( ${entry.name} )`,
          address1:entry.entry,
          phonenumber:entry.phonenumber
        }));
        console.log("clientData:", clientData);
        console.log(clientData);
        setClientOptions(clientData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
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

    setTotalValues(grandTotal);
  }, [rows]); // Update when rows change

  const handleOptionSelect = (e) => {
    console.log(e.target.value);
    console.log(e.target);
    const selectedOption = e.target.value;
    if (selectedOption === "addNew") {
      setOpen(true);
      selectRef.current.value = "select";
    } else {
      setOpen(false);
      // Handle selection of other options
      const selectedOptionObject = clinedOptions.find(
        (option) => option.value == e.target.value
      );
      setclientData(selectedOptionObject)
      console.log(selectedOptionObject)
      setSelectedCustomer(e.target.value);
    }
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // const getArrayFromLocalStorage = () => {
  //   const storedArray = localStorage.getItem('products');
  //   if (storedArray) {
  //     setMyArray(JSON.parse(storedArray));
  //   }
  // };

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
  }, []);

  const handleSelectedProductChange = async (event, newValue) => {
    if (!newValue) {
      // Handle the case where newValue is not defined
      return;
    }

    setSelectedProduct(newValue);

    if (newValue) {
      if (newValue.value === -2) {
        console.log(newValue.value === -2);
        toggleDrawer("right", true)();
        setSelectedProduct()
      } else {
        // Set the amount based on the selected product
        const response = await productGetAPI();
        console.log(response);
        const products = response.responseData;

        const selectedProductData = products.find(
          (product) => product.name === newValue?.label
        );
        console.log("selectedProductData",selectedProductData);
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
          taxApplied:selectedProductData.tax_rate, // Assuming default tax applied is 0
          total: selectedProductData.price, // Assuming total is initially equal to price
        };
        setSelectedProduct()
        
        setTableRows([...tableRows, newRow]);
      }
    }
  };

  const handleChangeAmout = (e) => {
    setInputData(e.target.value);
  };

  const handleAddVoucher = async () => {
    setIsDesabled(false)

    console.log("salesVoucher",rows);
    const newArray = await rows.map((item) => ({
      product_id: item.id,
      quantity: item.qty,
      Price:item.rate,
      unit:item.unit_id,
      discount: parseFloat(item?.descountvalue||0),
      tax_rate:{id:item?.taxId?item?.taxId:item?.tax_id}
      
    }));
    const salesVoucher = {
      credit_sale: false,
      payment_type: selectedOption === "cash" ? 5 : 10,
      billing_address: "",
      customer: parseInt(selectedCustomer),
      total: parseFloat(totalValues),
      product_details: newArray,
    };

    console.log(salesVoucher);
    createVoucherAPI(salesVoucher)
      .then((data) => {
        alert("Bill created")
        handlepdfgenerate()
        console.log(data);
        setSelectedOption({})
        setSelectedCustomer({})
        setRows([])
        setIsDesabled(true)

      })
      .catch((err) => {
        console.log(err);
        setIsDesabled(true)

      });
  };

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

  // const handleSelectCatogary = (event) => {
  //   setCategoryValue(event.target.value);
  //   console.log(event.target.value);
  // };

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

  
  return (
    <div className="sales-table-container">
      <Box sx={{ width: "75%", mx: 1 }}>
        <Box sx={{ width: "100%", marginBottom: "10px" }}>
          <p className="product-name">products</p>

          <Autocomplete
            sx={{
              display: "inline-block",
              "& input": {
                width: "100%",
                border: "none",
                bgcolor: "var(--inputbg-color)",
                color: (theme) =>
                  theme.palette.getContrastText(theme.palette.background.paper),
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
        <div style={{ overflow: "auto" }}>
          <Box>
            <SalesTable
              selectedProductData={selectedProductDetails}
              setTotalValues={setTotalValues}
              totalValues={totalValues}
              setRows={setRows}
              rows={rows}
            />
            {/* Pass tableRows as props to SalesTable */}
          </Box>
        </div>
      </Box>
      <Box sx={{ border: "1px solid #bbbdbf", mt: 4, borderRadius: 2 }}>
        <Box
          sx={{
            margin: "2px",
            p: "3px",
            borderRadius: 1,
            border: "1px solid #bbbdbf",
          }}
        >
          <p className="head-p-tag">Customer Details</p>
          <select  value={selectedCustomer} ref={selectRef} style={{ width: "100%" }} onChange={handleOptionSelect}>
            <option value="select">Select</option>

            <option value="addNew">Add New</option>

            {clinedOptions.map((option, index) => {
              console.log(option);
              return (
                <option key={index} value={option.value} label={option.label}>
                  {option.label}
                </option>
              );
            })}
          </select>
        </Box>
        <Box
          sx={{
            margin: "2px",
            p: "3px",
            borderRadius: 1,
            border: "1px solid #bbbdbf",
            height: "55%",
          }}
        >
          <p className="head-p-tag">Bill Details</p>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <p>sub Total:</p>
            <p> &#8377; {totalValues}</p>
          </Box>
          <hr
            style={{
              margin: "8px",
              color: "#bbbdbf",
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p className="head-p-tag">
              Total amount :
              {/* <span style={{fontWeight:"lighter", fontSize:"12px"}}>(items:2,Quantity:2)</span>: */}
            </p>
            <p> &#8377; {totalValues}</p>
          </Box>
        </Box>

        <Box
          sx={{
            margin: "2px",
            p: "3px",
            borderRadius: 1,
            border: "1px solid #bbbdbf",
            // height: "100%",
          }}
        >
          <p className="head-p-tag">Cash/UPI</p>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              my: 1,
              alignItems: "center",
            }}
          >
            <p>Payment Method:</p>
            <select
              style={{ width: "50%" }}
              value={selectedOption}
              onChange={(e) => setSelectedOption(event.target.value)}
            >
              {/* {
              .map((_, index) => {
                const option = { value: index, label: `Option ${index}` }; // Define your options here
                return ( */}
              <option value="none" label="None"></option>
              <option value="cash" label="Cash"></option>
              <option value="upi" label="UPI"></option>

              {/* {/* //   ); */}
              {/* // })} */}
            </select>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              my: 1,
            }}
          >
            <p>Amount Received:</p>
            <FormControl
              sx={{
                my: 1,
                width: "50%",
                background: "#F3F6F9",
                borderRadius: 2,
              }}
            >
              <OutlinedInput
                onChange={handleChangeAmout}
                sx={{
                  p: "0 !important",
                }}
                id="standard-adornment-password"
                endAdornment={
                  <InputAdornment position="end">
                    <CurrencyRupeeOutlinedIcon />
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
            <p>Change to Return:</p>
            <p>&#8377;{inputData - totalValues}</p>
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              fontWeight: "bold",
              textTransform: "none",
              bgcolor: "var(--black-button)",
              "&:hover": {
                background: "var(--button-hover)",
              },
              '&:disabled': {
                bgcolor: "var(--black-button)",
                color: 'white', 
              },
            }}
            onClick={handleAddVoucher}
            // onClick={handlepdfgenerate}
            disabled={!isDesabled}
          >
                 {isDesabled? "Save and Print Bill":
            <CircularProgress style={{color:"white",marginBottom:"5px",marginTop:"5px",marginLeft:"35px",marginRight:"35px"}} size={15} />
          }</Button>
        </Box>
      </Box>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <h4> Customer Details</h4>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                my: 1,
              }}
            >
              <InputComponent
                label="Add new "
                value={inputValue}
                handleChange={handleInputChange}
              />
            </Box>
          </Box>
        </Modal>
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
                      <h6>{ generateRandom6Digit(new Date())}</h6>
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid black",
                        borderLeft: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      <h6>Date</h6>
                      <h6>{new Date()?.toLocaleDateString()}</h6>
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

export default SalesPage;
