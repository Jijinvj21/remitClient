import { Autocomplete, Box, Button, CircularProgress, Modal, Typography } from "@mui/material";
import "./CreditNotePage.scss";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useEffect, useState } from "react";
import ImageAdd from "../../assets/sideBar/ImageAdd.svg";
// import { AiOutlineFileAdd } from "react-icons/ai";
import TransactionTable from "../../components/TransactionTable/TransactionTable";
import { categeryGetAPI, creditDataAddAPI, gstOptionsGetAPI, partyDataGetAPI, paymentTypeDataAddAPI, paymentTypeDataGetAPI, productAddAPI, productGetAPI, projectGetAPI, stateDataGetAPI, unitsDataGetAPI } from "../../service/api/admin";
import AddProductDrawer from "../../components/AddProductDrawer/AddProductDrawer";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Link } from "react-router-dom";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
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

function CreditNotePage() {
  const [partyOptions, setPartytOptions] = useState([]);
  const [textValue, setTextValue] = useState("");
  const [billingTextValue, setBillingTextValue] = useState("");

  const [selectedProductDetails, setSelectedProductDetails] = useState(null); // State to hold selected product
  const [totalValues, setTotalValues] = useState([]);
  const [rows, setRows] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // State to hold selected product
  const [tableRows, setTableRows] = useState([]); // State to hold table rows
  const [state, setState] = useState({
    right: false,
  });
  const [selectedValue, setSelectedValue] = useState('');
  const [categoryOptions,setCategoryOptions]=useState([])
  const [projectOptions,setProjectOptions]=useState([])
  const [unitOptions,setUnitOptions]=useState([])
  const [taxRateValue, setTaxRateValue] = useState({});
  const [ProductDrawerFormData, setProductDrawerFormData] = useState({
    name:"",
    quantity:"",
    rate:0,
    hsn:"",
  });
  const [projectValue, setProjectValue] = useState('');
  const [categoryValue, setCategoryValue] = useState('');
  const [img, setImg] = useState(null);
  const [taxOptions,setTaxOptions]=useState([])
  const [toggle, setToggle] = useState(true);
  const [partySelect, setPartySelect] = useState();
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [receiptNo, setReceiptNo] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [date, setDate] = useState("");
    const [stateOfSupply, setStateOfSupply] = useState("");
    const [stateOPtions, setStateOPtions] = useState();

    const [paymentSelect, setPaymentSelect] = useState(0);
    const [imgCredit, setImgCredit] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [roundOff, setRoundOff] = useState(0);
    const [isDesabled, setIsDesabled] = useState(true);
    const [clientData,setclientData]= useState({});
    const [paymentOptions,setPaymentOptions]= useState([]);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [paymentAddData, setPaymentAddData] = useState({
      holder_name: "",
      bank: "",
      ifsc: "",
      account_no: "",
      upi_id: "",
    });
  
    const handlePaymentClose = () => setPaymentOpen(false);

    const handlePaymentFormChange = (e) => {
      const { name, value } = e.target;
      setPaymentAddData({ ...paymentAddData, [name]: value });
    };
  
  
    const addPaymentInputArrat = [
      {
        handleChange: handlePaymentFormChange,
        intputName: "holder_name",
        label: "Holder Name",
        type: "text",
      },
      {
        handleChange: handlePaymentFormChange,
        intputName: "bank",
        label: "Bank",
        type: "text",
      },
    
      {
        handleChange: handlePaymentFormChange,
        intputName: "ifsc",
        label: "IFSC",
        type: "text",
      },
      {
        handleChange: handlePaymentFormChange,
        intputName: "account_no",
        label: "Account Number",
        type: "text",
      },
      {
        handleChange: handlePaymentFormChange,
        intputName: "upi_id",
        label: "UPI ID",
        type: "text",
       
      },
     
    ];
  
    const handleAddPayment = () => {
      // const data = {
      //   name: partydataData.name,
      //   phonenumber: partydataData.phoneNumber,
      //   email: partydataData.email,
      //   address1: partydataData.address1,
      //   address2: partydataData.address2,
      //   country: parseInt(countryValue),
      //   postalCode: partydataData.postalCode,
      // };
      // console.log(data);
      paymentTypeDataAddAPI(paymentAddData)
        .then((data) => {
          console.log(data);
          alert("Payment Added");
          // partyDataGet();
          setPaymentOpen(false);
          setPaymentAddData({
            holder_name: "",
            bank: "",
            ifsc: "",
            account_no: "",
            upi_id: "",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };

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
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      setImgCredit(file);
    };
    const handlepaymenttype = (e) => {
      const selectedOption = e.target.value;
  
      if (selectedOption === "-1") {
        setPaymentOpen(true);
      } else {
        setPaymentOpen(false);
        // setPartySelect(e.target.value);
      setPaymentSelect(e.target.value);
      }
    };

    const handleCheckboxChange = (event) => {
      setIsChecked(event.target.checked);
    }
  const handleDrawerImageChange = (e) => {
    const file = e.target.files[0];

    setImg(file);
  };
  const handleTaxRateChange = (event) => {
    console.log(event.target.value)
    const selectedOptionObject = taxOptions.find(option => option.taxlabel == event.target.value);
    console.log(selectedOptionObject);
    // setTaxRateValue({
    //   label: selectedOptionObject ? selectedOptionObject.label : "", // Handle case where selectedOptionObject is undefined
    //   value: event.target.value
    // });
    setTaxRateValue(selectedOptionObject)
  };
  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
    console.log(event.target.value)
  };

  const handleSelectProject = (event) => {
    setProjectValue(event.target.value);
    console.log(event.target.value)
  };

  const handleSelectCatogary = (event) => {
    setCategoryValue(event.target.value);
    console.log(event.target.value)
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

  const handleDrawerAddProducts = () => {
    const formData = new FormData();
  
    formData.append('name', ProductDrawerFormData.name);
    formData.append('hsn', ProductDrawerFormData.hsn);
    formData.append('rate', parseInt(ProductDrawerFormData.rate));
    formData.append('quantity', parseInt(ProductDrawerFormData.quantity));
    formData.append('unit', selectedValue);
    formData.append('projectid', parseInt(projectValue));
    formData.append('is_master_product', toggle);
    // formData.append('category_id', categoryValue);
    // formData.append('gst', ((parseInt(ProductDrawerFormData.rate) * parseInt(ProductFormData.quantity)) * (taxRateValue.value?.replace("%", ""))) / 100);
    formData.append('tax_rate', taxRateValue.id);
    formData.append('image', img);
  
    productAddAPI(formData)
      .then((data) => {
        fetchData()
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
    gstOptionsGetAPI().then((data) => {
      console.log("tax:", data);
      // setTaxOptions(data);

      // Transform data and set it to state
      const transformedData = data.map(entry => ({
        value: entry.percentage,
        label: entry.name?`${entry.name} ${entry.percentage}` :"none",
        taxlabel: entry.percentage,
        id:entry.id

      }));
      console.log(transformedData)
      setTaxOptions(transformedData);
    }).catch((err) => {
      console.log(err);
    });
  }

  const getCategeryOptionsFormAPI = () => {
    categeryGetAPI()
      .then((data) => {
        console.log("category:", data);
        
        // Transform data and set it to state
        const categoryOptions = data?.responseData.map(entry => ({
          value: entry.id,
          label:`${entry.name}`,
          
        }));
        categoryOptions.unshift({ value: 0, label: "None" });
  
        console.log("categoryOptions",categoryOptions);
        setCategoryOptions(categoryOptions);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const getClientOptionsFormAPI = () => {
    projectGetAPI()
      .then((data) => {
        console.log("projects:", data);
        
        // Transform data and set it to state
        const projectdData = data?.responseData.map(entry => ({
          value: entry.id,
          label:`${entry.name} ( ${entry.client_name} )`,
          
        }));
        projectdData.unshift({ value: 0, label: "None" });
  
        console.log("projectdData",projectdData);
        setProjectOptions(projectdData);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const getUnitOptionsFormAPI = () => {
    unitsDataGetAPI()
      .then((data) => {
        console.log("units:", data);
        
        // Transform data and set it to state
        const unitsdData = data?.responseData.map(entry => ({
          value: entry.id,
          label: entry.name ,
          
        }));
        unitsdData.unshift({ value: 0, label: "None" })
        console.log("unitsdData",unitsdData);
        setUnitOptions(unitsdData);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const partyDataGet=()=>{
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
      console.log("partyData",partyData);
      setPartytOptions(partyData);
    })
    .catch((err) => {
      console.log(err);
    });
  }



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

  paymentTypeDataGetAPI()
  .then((res) => {
    const paymentType = res.data.responseData.map((entry) => ({
      value: entry.id,
      label: `${entry.bank} (${entry.holder_name})`,
    }));
    console.log(paymentType);
    paymentType.unshift({ value: -1, label: "Add" });
    paymentType.unshift({ value: 5, label: "Cash " });
    paymentType.unshift({ value: -2, label: "Select" });

    setPaymentOptions(paymentType);
  })
  .catch((err) => {
    console.log(err);
    setPaymentOptions([{ value: -2, label: "Select" },{ value: -1, label: "Add" },{ value: 5, label: "Cash " }])
  });
  partyDataGet()
  fetchData();
  setProductOptions([{ value: -2, label: "Add" }])
  getTaxOptionsFormAPI()
    getCategeryOptionsFormAPI()
    getClientOptionsFormAPI()
    getUnitOptionsFormAPI()

}, []);

const toggleDrawer = (anchor, open) => (event) =>{
  console.log(event)
  console.log("Toggle Drawer:", anchor, open);
  if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
    return;
  }
  setState({ ...state, [anchor]: open });
};

  const handleTextChange = (event) => {
    setTextValue(event.target.value);
  };
  const handleBillingTextChange = (event) => {
    setBillingTextValue(event.target.value);
  }
  
const handleReceiptNoChange = (event) => {
  setReceiptNo(event.target.value);
};

const handleInvoiceNoChange = (event) => {
  setInvoiceNo(event.target.value);
};

const handleInvoiceDateChange = (event) => {
  setInvoiceDate(event.target.value);
};

const handleDateChange = (event) => {
  setDate(event.target.value);
};

const handleStateOfSupplyChange = (e) => {
  console.log("firste.target.value",e.target.value)
  setStateOfSupply(e.target.value);
};
  const topleftsideinput = [
    {handleChange:handleReceiptNoChange,
      intputName: "receiptno",
      label: "Recipes No",
      type: "number",
      value:receiptNo,
    },
    {handleChange:handleInvoiceNoChange,
      intputName: "invoiceno",
      label: "Invoice Number",
      type: "number",
      value:invoiceNo,
    },
    {handleChange:handleInvoiceDateChange,
      intputName: "invoicedate",
      label: "Invoice Date",
      type: "date",
      value:invoiceDate,
    },
    {handleChange:handleDateChange,
      intputName: "data",
      label: "Date",
      type: "date",
      value:date,
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
    {handleChange:handleTaxRateChange,
      intputName: "taxrate",
      label: "Tax Rate",
      

      inputOrSelect:"select",
      options:taxOptions 
    },
    {
      intputName: "taxvalue",
      label: " Tax Value",
      // type: "number",
      value: (((parseFloat(ProductDrawerFormData.rate || 0)) * parseFloat(ProductDrawerFormData.quantity || 0)) * (parseFloat(taxRateValue.value?.replace("%", "")) || 0) / 100),

      disabled:"disabled"
      
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

      inputOrSelect:"select",
      options: unitOptions,
      
      
    },
    {
      handleChange: handleSelectProject,
      intputName: "project",
      label: "Projects",
      // type: "text",
      // value:selectedValue,

      inputOrSelect:"select",
      options: projectOptions,
      
      
    },
    // {
    //   handleChange: handleSelectCatogary,
    //   intputName: "categery",
    //   label: "Categerys",
    //   // type: "text",
    //   // value:selectedValue,

    //   inputOrSelect:"select",
    //   options: categoryOptions,
      
      
    // },
    
  ];





  const handleSelectedProductChange = async (event, newValue) => {
    if (!newValue) {
      // Handle the case where newValue is not defined
      return;
    }
    if(newValue.value===-2){
      console.log(newValue.value===-2);
      toggleDrawer("right", true)();
    }else{

   

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


  const handleDrawerSelectChange = (event) => {
    setSelectedValue(event.target.value);
    console.log(event.target.value)
  };
  const handleSelectedPartyChange=(event, newValue)=>{
  console.log("firstnewValue",newValue)
    setclientData(newValue)
    setPartySelect(newValue)
  }
  const handlePhoneNumber=(e)=>{
    console.log(e.target.value)
    setPhoneNumber(e.target.value)
   }

   const addCreditData = async () => {
    setIsDesabled(false)
    const newArray = await rows.map((item) => ({
        product_id: item.id,
        quantity: item.qty,
        Price: item.qty * item.rate,
        unit_id:parseInt(item.unitid),
        discount: parseFloat(item?.descountvalue || 0),
        tax_rate_id: (item.taxId || 1) 
    }));

    const creditdata = {
        party: partySelect.value,
        billing_address: billingTextValue,
        date: date,
        invoice_date: invoiceDate,
        invoice_no: invoiceNo,
        total_amount: "",
        payment_type: paymentSelect,
        description: textValue,
        state_id: stateOfSupply,
        product_details: newArray,
    };

    // Convert creditdata object to FormData
    const formData = new FormData();
    formData.append('party', creditdata.party);
    formData.append('billing_address', creditdata.billing_address);
    formData.append('date', creditdata.date);
    formData.append('invoice_date', creditdata.invoice_date);
    formData.append('invoice_no', creditdata.invoice_no);
    formData.append('total_amount', creditdata.total_amount);
    formData.append('payment_type', creditdata.payment_type);
    formData.append('description', creditdata.description);
    formData.append('state', creditdata.state_id);
    formData.append('phone', phoneNumber);
    formData.append('image', imgCredit);

    
    // Append product details
        formData.append(`product_details`, JSON.stringify(creditdata.product_details));
     
    // Send the FormData using the API function
    creditDataAddAPI(formData).then((res) => {
        console.log(res);
        alert("creditnote added")
        setPhoneNumber("");
        setReceiptNo("");
        setInvoiceNo("");
        setInvoiceDate("");
        setDate("");
        setRows([]);
        setTextValue("");
        setBillingTextValue("")
        setIsDesabled(true)
    }).catch((err) => {
        console.log(err);
        setIsDesabled(true)
    });
};



  return (
    <div className="creaditnotepage">
      <h2>Credit Note</h2>
      <div style={{display :"flex",justifyContent:"end",marginRight:"10px"}}>
      <Link
            to={"/admin/creadit-note/creadit-note-view"}
            style={{display: "flex",
              textDecoration: "none",fontSize:"14px",marginLeft:"9px",marginTop:"10px",fontWeight:500}}
          >
            <RemoveRedEyeOutlinedIcon style={{color:"black"}} />
            <Typography
              variant="string"
              sx={{ color: "black", fontWeight: "700 ", paddingLeft: 1,paddingTop:"2px" }}
            >
              {" "}
             Credit Note View
            </Typography>
          </Link>      </div>
      <div className="inner-section">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            padding: "20px",
          }}
        >
          <div
            className="top-section"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <div className="right">
              <div style={{ display: "flex" }}>
                <div style={{ width: "100%", marginBottom: "10px" }}>
                  <p className="party-name">Party</p>

                  <Autocomplete
                    style={{
                      display: "inline-block",
                      "& input": {
                        width: "100%",

                        border: "none",
                        bgcolor: "var(--inputbg-color) !important",
                        color: (theme) =>
                          theme.palette.getContrastText(
                            theme.palette.background.paper
                          ),
                      },
                     
                    }}
                    id="custom-input-demo"
                    options={partyOptions}
                    value={partySelect}
                    onChange={handleSelectedPartyChange}
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
                          style={{ height: "41px" }}
                        />
                      </div>
                    )}
                  />
                  {/* <p
                    style={{
                      color: "red",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    BAL: 63660
                  </p> */}
                </div>

                <InputComponent
                  label="Phone No"
                  type="tel"
                  intputName="phoneno"
                  value={phoneNumber}
                  handleChange={handlePhoneNumber}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label style={{ fontSize: "12px" }} htmlFor="textarea">
                  Billing Address
                </label>
                <textarea
                  id="textarea"
                  value={billingTextValue}
                  onChange={handleBillingTextChange}
                  rows={5} // Set the number of visible rows
                  cols={30} // Set the number of visible columns
                />
              </div>
            </div>
            <div className="left" style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex", gap:10}}>
  {topleftsideinput.slice(0,2).map((input, index) => {
    return (
      <InputComponent
        key={index}
        handleChange={input.handleChange}
        label={input.label}
        type={input.type}
        intputName={input.intputName}
        inputOrSelect={input.inputOrSelect}
        options={input.options}
        value={input.value} // Add this line to pass the value prop
      />
    );
  })}
</div>
<div style={{display:"flex", gap:10}}>
  {topleftsideinput.slice(2,4).map((input, index) => {
    return (
      <InputComponent
        key={index}
        handleChange={input.handleChange}
        label={input.label}
        type={input.type}
        intputName={input.intputName}
        inputOrSelect={input.inputOrSelect}
        options={input.options}
        value={input.value} // Add this line to pass the value prop
      />
    );
  })}
</div>
                <InputComponent
                    handleChange={topleftsideinput[4].handleChange}
                    state={topleftsideinput[4].state}
                    label={topleftsideinput[4].label}
                    type={topleftsideinput[4].type}
                    intputName={topleftsideinput[4].intputName}
                    inputOrSelect={topleftsideinput[4].inputOrSelect}
                    options={topleftsideinput[4].options}
                    />
            </div>
          </div>
          <div className="center-section">
          <Box sx={{ width: "100%", marginBottom: "10px", "& .css-g6k71e-MuiAutocomplete-root":{
                        width: "100% !important",
                        paddingTop:"10px",
                      },
                      "& .css-6oxs1k-MuiAutocomplete-root":{
                        width: "100% !important"
                      },
                      // "& .css-74bi4q-MuiDataGrid-overlayWrapper":{
                      //   height: "60px",
                      // },
                      
                      }}>
          <p className="party-name">products</p>

          <Autocomplete
            sx={{
              display: "inline-block",
              "& input": {
                width: "100% !important ",
                height:"41px",
                
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
            <TransactionTable  
            selectedProductData={selectedProductDetails}
            totalValues={totalValues}
            rows={rows}
            setRows={setRows}
            />
          </div>
          <div
            className="bottom-section"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div
              className="left"
              style={{
                display: "flex",
                flexDirection: "column",
                width: "50%",
                gap: 1,
                alignItems: "flex-start",
              }}
            >
              <div>
                <InputComponent
                  intputName="paymenttype"
                  label="Payment type"
                  inputOrSelect="select"
                  handleChange={handlepaymenttype}

                  options={paymentOptions}
                />
              </div>
              

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label style={{ fontSize: "12px" }} htmlFor="textarea">
                  Description
                </label>
                <textarea
                  id="descriptiontextarea"
                  value={textValue}
                  onChange={handleTextChange}
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
                    pl: 1,
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
              className="right"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
                gap: 1,
              }}
            >
               <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
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
              {/* <div style={{ display: "flex", flexDirection: "row", gap: 1 }}>
                <InputComponent type="checkbox" />
                <InputComponent
                  label="Paid amount"
                  type="number"
                  intputName="paidamount"
                />
              </div> */}

              {/* <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "45%",
                  fontWeight: 700,
                }}
              >
                <p>Balance:</p>
                <p>5284</p>
              </div> */}
            </div>
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
                color: 'white', 
              },
              
            }}
            onClick={addCreditData}
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
                      <h6>{invoiceNo}</h6>
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid black",
                        borderLeft: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      <h6>Date</h6>
                     {date&& <h6>{new Date(date)?.toLocaleDateString()}</h6>}
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
      <Modal
        open={paymentOpen}
        onClose={handlePaymentClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <h4> Add new Payment type</h4>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              my: 1,
              gap: 1,
            }}
          >
            {addPaymentInputArrat.map((data, index) => (
              <InputComponent
                key={index}
                label={data.label}
                intputName={data.intputName}
                type={data.type}
                value={paymentAddData[data.intputName]}
                handleChange={data.handleChange}
                inputOrSelect={data.inputOrSelect}
                options={data.option}
              />
            ))}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mt: 3,
                fontWeight: "bold",
                textTransform: "none",
                bgcolor: "var(--black-button)",
                "&:hover": {
                  background: "var(--button-hover)",
                },
              }}
              onClick={handleAddPayment}
            >
              Add payment type
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default CreditNotePage;
