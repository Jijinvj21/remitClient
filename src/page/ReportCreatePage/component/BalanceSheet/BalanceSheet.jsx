import { useEffect } from "react";
import DateRangePicker from "../../../../components/DateRangePicker/DateRangePicker";
import dayjs from "dayjs";
import "./BalanceSheet.scss";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

function BalanceSheet({setReport,report,selectedToDate,setSelectedToDate,selectedFromDate,setSelectedFromDate }) {

  useEffect(() => {
    const currentMonth = dayjs().month();
    const currentYear = dayjs().year();
    let startOfFinancialYear;

    if (currentMonth >= 3) {
      // April to December: current financial year starts on April 1st
      startOfFinancialYear = dayjs(`${currentYear}-04-01`);
    } else {
      // January to March: previous financial year starts on April 1st
      startOfFinancialYear = dayjs(`${currentYear - 1}-04-01`);
    }

    setSelectedFromDate(startOfFinancialYear); // Corrected this line
    setSelectedToDate(dayjs());
  }, []);
  return (
    <div className="balance-sheet-container">
      <h4>BALANCE SHEET REPORT</h4>
      <div className="from-to-date">
        <DateRangePicker
          lable="From"
          selectedDate={selectedFromDate}
          setSelectedDate={setSelectedFromDate}
        />
        <DateRangePicker
          lable="To"
          selectedDate={selectedToDate}
          setSelectedDate={setSelectedToDate}
        />
      </div>

      <div className="balance-sheet-table">
        <div className="assets-account-data border-right">
          <div className="t-heading">
            <h5> ACCOUNT</h5>
            <h5> AMOUNT</h5>
          </div>

          <div className="assets-section">
            <h5 className="assets-head">ASSETS</h5>
            <div className="accordion-section">
            <Accordion sx={{ margin: "0px" }}>
              <AccordionSummary
                aria-controls="panel2-content"
                
                id="panel2-header"
                >
                <h5>Fixed Assets</h5>
              </AccordionSummary>
              <AccordionDetails sx={{ background: "#f3f6f9" }}>
                <div className="fixed-assets-accordion">
                  <div className="items">
                    <h5>test</h5>
                    <p>0</p>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ margin: "0px" }}>
              <AccordionSummary
                aria-controls="panel2-content"
                id="panel2-header"
                >
                <h5>Current Assets</h5>
              </AccordionSummary>
              <AccordionDetails sx={{ background: "#f3f6f9" }}>
                <div className="fixed-assets-accordion">
                  <div className="items">
                    <h5>test</h5>
                    <p>0</p>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ margin: "0px" }}>
              <AccordionSummary
                aria-controls="panel2-content"
                id="panel2-header"
                >
                <h5>Cash Account</h5>
              </AccordionSummary>
              <AccordionDetails sx={{ background: "#f3f6f9" }}>
                <div className="fixed-assets-accordion">
                  <div className="items">
                    <h5>test</h5>
                    <p>0</p>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
                </div>
          </div>
          <div>
          <div style={{display:"flex" , justifyContent:"space-between", margin:"10px",padding:"6px", borderRadius:"7px", background:"#f3f6f9"}}>
                    <h5>Total Assets</h5>
                    <p>0</p>
                  </div>
          </div>
        </div>
        <div className="assets-account-data">
          <div className="t-heading">
            <h5> ACCOUNT</h5>
            <h5> AMOUNT</h5>
          </div>

          <div className="assets-section">
            <h5 className="assets-head"> EQUITIES & LIABILITIES</h5>
            <div className="accordion-section">

            <Accordion sx={{ margin: "0px" }}>
              <AccordionSummary
                aria-controls="panel2-content"
                id="panel2-header"
              >
                <h5>Fixed Assets</h5>
              </AccordionSummary>
              <AccordionDetails sx={{ background: "#f3f6f9" }}>
                <div className="fixed-assets-accordion">
                  <div className="items">
                    <h5>test</h5>
                    <p>0</p>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ margin: "0px" }}>
              <AccordionSummary
                aria-controls="panel2-content"
                id="panel2-header"
                >
                <h5>Current Assets</h5>
              </AccordionSummary>
              <AccordionDetails sx={{ background: "#f3f6f9" }}>
                <div className="fixed-assets-accordion">
                  <div className="items">
                    <h5>test</h5>
                    <p>0</p>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ margin: "0px" }}>
              <AccordionSummary
                aria-controls="panel2-content"
                id="panel2-header"
                >
                <h5>Cash Account</h5>
              </AccordionSummary>
              <AccordionDetails sx={{ background: "#f3f6f9" }}>
                <div className="fixed-assets-accordion">
                  <div className="items">
                    <h5>test</h5>
                    <p>0</p>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
                </div>
          </div>
          <div style={{display:"flex" , justifyContent:"space-between", margin:"10px",padding:"6px", borderRadius:"7px", background:"#f3f6f9"}}>
                    <h5>Total Equities & Liabilities</h5>
                    <p>0</p>
                  </div>
                  
        </div>

      </div>
    </div>
  );
}

export default BalanceSheet;
