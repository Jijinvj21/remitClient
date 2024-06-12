import {
  Autocomplete,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TextField,
  Modal,
} from "@mui/material";
import "./PaymenyIn.scss";
import { useEffect, useState } from "react";
import InputComponent from "../../components/InputComponent/InputComponent";
// import ImageAdd from "../../assets/sideBar/ImageAdd.svg";
import { useLocation } from "react-router-dom";
import {
  countryOptionsGetAPI,
  createPartyAPI,
  partyDataGetAPI,
  paymentDataGetAPI,
  paymentInAPI,
  paymentTypeDataAddAPI,
  paymentTypeDataGetAPI,
} from "../../service/api/admin";
import { generateRandom6Digit } from "../../utils/randomWithDate";
import jsPDF from "jspdf";
import { renderToString } from "react-dom/server";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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
function PaymenyIn() {
  const location = useLocation();
  const [textValue, setTextValue] = useState("");
  const [img, setImg] = useState(null);
  const [partyOptions, setPartyOptions] = useState([]);
  const [partySelect, setPartySelect] = useState(0);
  const [paymentSelect, setPaymentSelect] = useState(0);
  const [date, setDate] = useState("");
  const [recived, setRecived] = useState("");
  const [ReceptNo, setReceptNo] = useState("");
  const [paymentData, setPaymenData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isDesabled, setIsDesabled] = useState(true);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [partydataData, setPartyData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    address1: "",
    address2: "",
    postalCode: "",
  });
  const [countryValue, setCountryValue] = useState(""); // State to hold the value of the new input
  const [contryOptions, setContryOptions] = useState([]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentAddData, setPaymentAddData] = useState({
    holder_name: "",
    bank: "",
    ifsc: "",
    account_no: "",
    upi_id: "",
  });


  const handlePartyFormChange = (e) => {
    const { name, value } = e.target;
    setPartyData({ ...partydataData, [name]: value });
  };
  const handlePaymentFormChange = (e) => {
    const { name, value } = e.target;
    setPaymentAddData({ ...paymentAddData, [name]: value });
  };
  const hanldecountrychange = (e) => {
    setCountryValue(e.target.value);
    console.log(e.target.value);
  };
  const addPartyInputArrat = [
    {
      handleChange: handlePartyFormChange,
      intputName: "name",
      label: "Name",
      type: "text",
    },
    {
      handleChange: handlePartyFormChange,
      intputName: "phoneNumber",
      label: "Phone number",
      type: "text",
    },
    {
      handleChange: handlePartyFormChange,
      intputName: "email",
      label: "Email",
      type: "text",
    },
    {
      handleChange: handlePartyFormChange,
      intputName: "address1",
      label: "Address1",
      type: "text",
    },
    {
      handleChange: handlePartyFormChange,
      intputName: "address2",
      label: "Address2",
      type: "text",
    },
    {
      handleChange: hanldecountrychange,
      intputName: "country",
      label: "country",
      type: "text",
      inputOrSelect: "select",
      option: contryOptions,
    },
    {
      handleChange: handlePartyFormChange,
      intputName: "postalCode",
      label: "Pin code",
      type: "text",
    },
  ];


  const handleAddParty = () => {
    const data = {
      name: partydataData.name,
      phonenumber: partydataData.phoneNumber,
      email: partydataData.email,
      address1: partydataData.address1,
      address2: partydataData.address2,
      country: parseInt(countryValue),
      postalCode: partydataData.postalCode,
    };
    console.log(data);
    createPartyAPI(data)
      .then((data) => {
        console.log(data);
        alert("Party Added");
        partyDataGet();
        setOpen(false);
        setPartyData({
          name: "",
          phoneNumber: "",
          email: "",
          address1: "",
          address2: "",
          postalCode: "",
        });
      })
      .catch((err) => {
        console.log(err);
      });
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

  const getpaymentDataGetAPI = () => {
    setLoader(true);
    paymentDataGetAPI({ payment_mode: "IN", project_id: 1 })
      .then((data) => {
        setLoader(false);

        console.log("data.data.responseData", data.data.responseData);
        setPaymenData(data.data.responseData);
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };

  useEffect(() => {
    countryOptionsGetAPI()
      .then((data) => {
        // console.log("country:", data);

        const countryData = data.map((entry) => ({
          value: entry.id,
          label: entry.name,
        }));
        setContryOptions(countryData);
      })
      .catch((err) => {
        console.log(err);
      });

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
    const currentDate = new Date();
    const random6Digit = generateRandom6Digit(currentDate);
    console.log(random6Digit);
    setReceptNo(random6Digit);

    getpaymentDataGetAPI();
  }, []);
  const partyDataGet = () => {
    partyDataGetAPI()
      .then((data) => {
        console.log("partyData:", data);
        // setTaxOptions(data);

        // Transform data and set it to state
        const partyData = data.responseData.map((entry) => ({
          value: entry.id,
          label: entry.name,
        }));
        console.log(partyData);
        setPartyOptions(partyData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    partyDataGet();
  }, []);
  const handleClose = () => setOpen(false);
  const handlePaymentClose = () => setPaymentOpen(false);


  const handleTextChange = (event) => {
    setTextValue(event.target.value);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
  };
  const handleSetParty = (e) => {
    console.log("handleSetParty", e.target.value);
    const selectedOption = e.target.value;

    if (selectedOption === "addNew") {
      setOpen(true);
    } else {
      setOpen(false);
      setPartySelect(e.target.value);
    }
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
  const handleDate = (e) => {
    console.log(e.target.value);
    setDate(e.target.value);
  };
  const handleRecived = (e) => {
    console.log(e.target.value);
    setRecived(e.target.value);
  };

  const leftsideinput = [
    {
      intputName: "receiptno",
      label: "Recipt No",
      type: "text",
      value: ReceptNo,
      disabled: "disabled",
    },
    {
      handleChange: handleDate,
      label: "Date",
      type: "date",
      value: date,
    },
    {
      handleChange: handleRecived,
      intputName: "received",
      label: "Received",
      type: "number",
      value: recived,
    },
  ];
  const handleSave = () => {
    setIsDesabled(false);
    const data = {
      date: date,
      payment_type: parseInt(paymentSelect),
      party_id: parseInt(partySelect),
      project_id: 1,
      amount: parseInt(recived),
      payment_mode: "IN",
      description: textValue,
      ref_no: ReceptNo,
    };
    paymentInAPI(data)
      .then((data) => {
        alert("Receipt added");
        getpaymentDataGetAPI();
        const currentDate = new Date();
        const random6Digit = generateRandom6Digit(currentDate);
        setReceptNo(random6Digit);
        setDate("");
        setPaymentSelect("");
        setPartySelect("select");
        setRecived("");
        setTextValue("");
        setIsDesabled(true);
      })
      .catch((err) => {
        console.log(err);
        setIsDesabled(true);
      });
  };

  const handleCreateReceipt = (row) => {
    const string = renderToString(
      <div id="recept-pdf">
        <div
          className="header-of-receipt"
          style={{ display: "flex", marginBottom: "30px", marginTop: "10px" }}
        >
          <img
            src="https://res.cloudinary.com/dczou8g32/image/upload/v1714668042/DEV/jw8j76cgw2ogtokyoisi.png"
            alt="logo"
            style={{ height: "50px" }}
          />
          <div
            className="address"
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              marginLeft: "25px",
            }}
          >
            <h5 style={{ fontSize: "13px", width: "300px" }}>
              BILTREE FY204-25
            </h5>
            <p style={{ fontSize: "13px", width: "300px" }}>
              54/3175, MANGHAT ARCADE <br /> 1ST FLOOR, KALOOR-KADAVANTHRA ROAD{" "}
              <br /> ERANAKLAM
            </p>
            <p style={{ fontSize: "13px", width: "300px" }}>
              StateName:Kerala, Code:32
            </p>
            <p style={{ fontSize: "13px", width: "300px" }}>
              E-Mail:info@biltree.in
            </p>
          </div>
        </div>
        <h5
          className="resceipt-text"
          style={{ fontSize: "13px", width: "600px", textAlign: "center" }}
        >
          Receipt voucher
        </h5>
        <div
          className="date-no"
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "950px",
          }}
        >
          <p style={{ fontSize: "13px", width: "600px", marginLeft: "10px" }}>
            No:{row?.ref_no}
          </p>
          <p style={{ fontSize: "13px", width: "600px" }}>
            Date:{new Date(row?.date).toLocaleDateString()}
          </p>
        </div>
        <p
          style={{
            fontSize: "13px",
            width: "600px",
            marginTop: "10px",
            marginLeft: "10px",
          }}
        >
          Through: ICICI BANK CA-313254897
        </p>
        <div>
          <div
            style={{
              marginTop: "20px",
              width: "950px",
              marginLeft: "10px",
              display: "flex",
            }}
          >
            <div style={{ width: "40%", borderRight: "1px solid" }}>
              <hr style={{ width: "400px" }} />
              <p style={{ marginLeft: "20px" }}>Particulars</p>
              <hr style={{ width: "400px" }} />
              <p style={{ fontSize: "13px", width: "600px" }}>Account :</p>
              <p
                style={{ marginLeft: "20px", fontSize: "13px", width: "600px" }}
              >
                {row?.party_id}
              </p>
            
            </div>
            <div
              style={{
                width: "20%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <hr style={{ width: "190px" }} />
                <p style={{ marginLeft: "20px", textAlign: "end" }}>Amount</p>
                <hr style={{ width: "190px" }} />
                <p
                  style={{
                    fontSize: "13px",
                    width: "188px",
                    textAlign: "end",
                    marginTop: "20px",
                  }}
                >
                  {row?.amount.toLocaleString("en-IN", {
                    style: "decimal",
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div>
                <hr style={{ width: "190px" }} />
                <p style={{ marginLeft: "25px", textAlign: "end" }}>
                  {row?.amount.toLocaleString("en-IN", {
                    style: "decimal",
                    minimumFractionDigits: 2,
                  })}
                </p>
                <hr style={{ width: "190px" }} />
              </div>
            </div>
          </div>
          <p
            className="resceipt-text"
            style={{
              fontSize: "13px",
              width: "580px",
              textAlign: "end",
              marginTop: "90px",
            }}
          >
            Authorised Signatory
          </p>
          <div style={{ display: "flex", width: "580px", marginTop: "20px" }}>
            <p style={{ marginLeft: "20px", fontSize: "13px", width: "580px" }}>
              Prepared by
            </p>
            <p
              style={{ fontSize: "13px", width: "580px", textAlign: "center" }}
            >
              Checked by
            </p>
            <p style={{ fontSize: "13px", width: "580px", textAlign: "end" }}>
              Verified by
            </p>
          </div>
        </div>
      </div>
    );

    const pdf = new jsPDF("p", "pt", "a4", true);
    pdf.html(string, {
      callback: () => {
        const blobURL = pdf.output("bloburl");
        window.open(blobURL, "_blank");
      },
    });
  };

  return (
    <div className="payment-in-section">
      <h2>Receipt</h2>

      <div className="inner-section">
        <div style={{ display: "flex", gap: "84px", padding: "20px" }}>
          <Box sx={{ width: "50%" }}>
            <Box
              sx={{
                margin: "2px",
                p: "3px",
                borderRadius: 1,
                // border: "1px solid #bbbdbf",
              }}
            >
              <p className="party-name">party Details</p>
              <select
                className="party-details-select"
                value={partySelect}
                style={{ width: "100%" }}
                onChange={handleSetParty}
              >
                <option value="select">Select</option>
                <option value="addNew">Add New</option>
                {partyOptions.map((option, index) => (
                  <option key={index} value={option.value} label={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Box>

            {/* <p style={{ color: "red", fontSize: "12px", fontWeight: "600" }}>
              BAL: 63660
            </p> */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                my: 1,
                alignItems: "center",
              }}
            >
              <InputComponent
                intputName="paymenttype"
                label="Payment type"
                inputOrSelect="select"
                handleChange={handlepaymenttype}
                options={paymentOptions}
              />
            </Box>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label htmlFor="textarea">Description</label>
              <textarea
                id="textarea"
                value={textValue}
                onChange={handleTextChange}
                rows={5} // Set the number of visible rows
                cols={50} // Set the number of visible columns
              />
            </div>
            <Button
              disableRipple
              sx={{
                mt: 2,
                textTransform: "none",
                color: "var(--black-button)",
                "&:hover": {
                  background: "transparent",
                },
              }}
              component="label"
            >
              {/* <img src={ImageAdd} alt="add img" /> */}

              <input type="file" hidden onChange={handleImageChange} />
            </Button>
          </Box>

          <Box
            sx={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
            className="leftsectioninputs"
          >
            <Box
              sx={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              {leftsideinput.slice(0, 2).map((input, index) => {
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
                  />
                );
              })}
            </Box>
            <Box sx={{ width: "50%", marginTop: 10 }}>
              {leftsideinput.slice(2).map((input, index) => {
                return (
                  <InputComponent
                    key={index}
                    label={input.label}
                    type={input.type}
                    handleChange={input.handleChange}
                    intputName={input.intputName}
                    inputOrSelect={input.inputOrSelect}
                  />
                );
              })}
            </Box>
          </Box>
        </div>
        <hr />
        <div style={{ display: "flex", justifyContent: "end" }}>
          {/* <Button
            variant="contained"
            sx={{
              height: 40,
              my: 2,
              marginRight: 2,
              textTransform: "none",
              bgcolor: "var(--black-button)",
            }}
          >
            Print
          </Button> */}
          <Button
            variant="contained"
            sx={{
              height: 40,
              my: 2,
              marginRight: 2,
              textTransform: "none",
              bgcolor: "var(--black-button)",
              "&:disabled": {
                bgcolor: "var(--black-button)",
                color: "white",
              },
            }}
            onClick={() => handleSave()}
            disabled={!isDesabled}
          >
            {isDesabled ? (
              "Save"
            ) : (
              <CircularProgress
                style={{
                  color: "white",
                  marginBottom: "15px",
                  marginTop: "15px",
                }}
                size={20}
              />
            )}
          </Button>
        </div>
      </div>
      <div className="table">
        {loader ? (
          <Box
            sx={{
              my: 2,
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CircularProgress color="inherit" />
          </Box>
        ) : paymentData === null ? (
          // Show a message when no products are available
          <Box
            sx={{
              my: 2,
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <PlaylistAddRoundedIcon
              sx={{ mx: "auto" }}
              style={{ fontSize: "40px" }}
            />
            <p style={{ textAlign: "center" }}>No receipt available</p>
          </Box>
        ) : (
          <TableContainer component={Paper} id="pdf-content">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {Array(1)
                .fill()
                .map((row, index) => ( */}
                {paymentData?.map((row, index) => {
                  console.log("row", row);
                  return (
                    <TableRow key={index + 1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {new Date(row?.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{row?.description}</TableCell>
                      <TableCell>
                        {" "}
                        {row?.amount.toLocaleString("en-IN", {
                          style: "decimal",
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell>
                        <Button
                          disableRipple
                          sx={{
                            textTransform: "none",
                            color: "var(--black-button)",
                            fontWeight: "600",

                            "&:hover": {
                              background: "transparent",
                            },
                          }}
                          onClick={() => handleCreateReceipt(row)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <h4> Add new Party</h4>
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
            {addPartyInputArrat.map((data, index) => (
              <InputComponent
                key={index}
                label={data.label}
                intputName={data.intputName}
                type={data.type}
                value={partydataData[data.intputName]}
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
              onClick={handleAddParty}
            >
              Add party
            </Button>
          </Box>
        </Box>
      </Modal>
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

export default PaymenyIn;
