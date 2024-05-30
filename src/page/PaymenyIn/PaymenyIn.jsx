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
} from "@mui/material";
import "./PaymenyIn.scss";
import { useEffect, useState } from "react";
import InputComponent from "../../components/InputComponent/InputComponent";
// import ImageAdd from "../../assets/sideBar/ImageAdd.svg";
import { useLocation } from "react-router-dom";
import {
  partyDataGetAPI,
  paymentDataGetAPI,
  paymentInAPI,
  paymentTypeDataGetAPI,
} from "../../service/api/admin";
import { generateRandom6Digit } from "../../utils/randomWithDate";
import jsPDF from "jspdf";
import { renderToString } from "react-dom/server";
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded';


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
  const [loader, setLoader]=useState(false)
  const [isDesabled, setIsDesabled] = useState(true);
  const [paymentOptions,setPaymentOptions]= useState([]);



  const getpaymentDataGetAPI = () => {
    setLoader(true)
    paymentDataGetAPI({ payment_mode: "IN", project_id: 1 })
      .then((data) => {
        setLoader(false)

        console.log("data.data.responseData",data.data.responseData);
        setPaymenData(data.data.responseData);
      })
      .catch((err) => {
        setLoader(false)
        console.log(err);

      });
  };

  useEffect(() => {
    paymentTypeDataGetAPI().then((res)=>{
      const paymentType = res.data.responseData.map((entry) => ({
        value: entry.id,
        label: entry.name,
      }));
  console.log(paymentType)
  paymentType.unshift({ value: -2, label: "Select" })
  setPaymentOptions(paymentType)
    })
    .catch((err)=>{
  console.log(err)
    })
    const currentDate = new Date();
    const random6Digit = generateRandom6Digit(currentDate);
    console.log(random6Digit);
    setReceptNo(random6Digit);

    getpaymentDataGetAPI();
  }, []);

  useEffect(() => {
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
  }, []);

  const handleTextChange = (event) => {
    setTextValue(event.target.value);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
  };
  const handleSetParty = (e, data) => {
    setPartySelect(data.value);
  };
  const handlepaymenttype = (e) => {
    setPaymentSelect(e.target.value);
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
    },
    {
      handleChange: handleRecived,
      intputName: "received",
      label: "Received",
      type: "number",
    },
  ];
  const handleSave = () => {
    setIsDesabled(false)

    const data = {
      date: date,
      payment_type: parseInt(paymentSelect),
      party_id: partySelect,
      project_id: 1,
      amount: parseInt(recived),
      payment_mode: "IN",
      description: textValue,
      ref_no: ReceptNo,
    };
    console.log(data);
    paymentInAPI(data)
      .then((data) => {
        console.log("paymentInAPI", data);
        alert("Receipt added")
  
        getpaymentDataGetAPI();
        const currentDate = new Date();
        const random6Digit = generateRandom6Digit(currentDate);
        console.log(random6Digit);
        setReceptNo(random6Digit);
        setDate("");
        setPaymentSelect("");
        setPartySelect(0);
        setRecived("");
        setTextValue("");
        setIsDesabled(true)

      })
      .catch((err) => {
        console.log(err);
        setIsDesabled(true)

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
              {/*  <p
            style={{ marginLeft: "20px", fontSize: "13px", width: "600px" }}
          >
            Aqst Ref BT/24-25/1 40,075.00Cr
          </p>
          <p
            style={{ marginLeft: "20px", fontSize: "13px", width: "600px" }}
          >
            New Ref BT/24-25/1 40,075.00Cr
          </p>
          <p
            style={{
              marginLeft: "20px",
              fontSize: "13px",
              width: "600px",
              marginTop: "60px",
            }}
          >
            On Account of :
          </p>
          <p
            style={{ marginLeft: "30px", fontSize: "13px", width: "350px" }}
          >
            {" "}
            RTGS-FDRLR52024042300253193-VIVID DIAGNOSTICS PRIVATE
            LIMITED-16080200005241 -FDRL0001608
          </p>
          <p
            style={{ marginLeft: "20px", fontSize: "13px", width: "600px" }}
          >
            Amount (in worde):
          </p>
          <p
            style={{ marginLeft: "30px", fontSize: "13px", width: "350px" }}
          >
            INR Three Lakh Only
          </p> */}
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
                disablePortal
                id="custom-input-demo"
                options={partyOptions}
                //   value={selectedProduct}
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
              '&:disabled': {
                bgcolor: "var(--black-button)",
                color: 'white', 
              },
            }}
            onClick={() => handleSave()}
            disabled={!isDesabled}

          >
            {isDesabled? "Save":
            <CircularProgress style={{color:"white",marginBottom:"15px",marginTop:"15px"}} size={20} />
          }</Button>
        </div>
      </div>
      <div className="table">
      {
         loader ? <Box  sx={{ 
          my: 2, 
          mx: "auto", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center" 
        }}><CircularProgress color="inherit" /></Box> : 
        paymentData===null? (
          // Show a message when no products are available
          <Box 
            sx={{ 
              my: 2, 
              mx: "auto", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center" 
            }}
          >
            <PlaylistAddRoundedIcon sx={{ mx: "auto" }} style={{ fontSize: "40px" }} />
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
      )
    }
    </div>

      <div></div>
    </div>
  );
}

export default PaymenyIn;
