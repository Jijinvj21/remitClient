import  { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import DateRangePicker from "../../../../components/DateRangePicker/DateRangePicker";
import "./ProfitAndLose.scss";
import {   profitLossDataGetByIdAPI, projectGetAPI } from "../../../../service/api/admin";
import dayjs from "dayjs";
import { formatter } from "../../../../utils/moneyFormatter";
import SimCardDownloadOutlinedIcon from '@mui/icons-material/SimCardDownloadOutlined';


function ProfitAndLose({report,setReport,selectedToDate,setSelectedToDate,selectedFromDate,setSelectedFromDate}) {
 
  const [partySelect, setPartySelect] = useState(0);
  const [partyOptions, setPartyOptions] = useState([]);

  const handleSetParty = (e) => {
    setPartySelect(e.target.value);
    profitLossDataGetByIdAPI({project_id:parseInt(e.target.value), date_range:{from: selectedFromDate, to: selectedToDate}}).then((response)=>{
      console.log(response.data.responseData
        , "profitLossDataGetAPI");
      setReport(response.data.responseData);
    })
    .catch((err)=>{
      console.log(err)
    })
  };
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
  useEffect(() => {
    // const partyDataGet = () => {
      projectGetAPI()
      .then((data) => {
        console.log("partyData:", data);

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
    // };
  }, []);
  

  const generateCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
  
    // Adding headers
    csvContent += "Section,Particular,Amount\n";
  
    // Adding tax payable section
    csvContent += "Tax Payable,GST Payable,-" + formatter.format(report?.tax_payable?.gst_payable || 0) + "\n";
    csvContent += "Tax Payable,TCS Payable,-" + formatter.format(report?.tax_payable?.tcs_payable || 0) + "\n";
  
    // Adding tax receivable section
    csvContent += "Tax Receivable,GST Receivable,+" + formatter.format(report?.tax_receivable?.gst_receivable || 0) + "\n";
    csvContent += "Tax Receivable,TCS Receivable,+" + formatter.format(report?.tax_receivable?.tcs_receivable || 0) + "\n";
  
    // Adding stocks section
    csvContent += "Stocks,Opening Stock,-" + formatter.format(report?.stocks?.opening_stock || 0) + "\n";
    csvContent += "Stocks,Closing Stock,+" + formatter.format(report?.stocks?.closing_stock || 0) + "\n";
    csvContent += "Stocks,Opening Stock FA,-" + formatter.format(report?.stocks?.opening_stock_fa || 0) + "\n";
    csvContent += "Stocks,Closing Stock FA,+" + formatter.format(report?.stocks?.closing_stock_fa || 0) + "\n";
  
    // Adding trade account section
    csvContent += "Trade Account,Gross Profit," + formatter.format(report?.trade_account?.gross_profit || 0) + "\n";
    csvContent += "Trade Account,Gross Loss," + formatter.format(report?.trade_account?.gross_loss || 0) + "\n";
  
    // Adding other income section
    if (report?.profit_and_loss_account?.credit.length > 0) {
      report.profit_and_loss_account.credit.forEach((item) => {
        csvContent += `Other Income,${item.particular},+${formatter.format(item.amount + item.tax)}\n`;
      });
    } else {
      csvContent += "Other Income,No Data,0.00\n";
    }
  
    // Adding indirect expenses section
    if (report?.profit_and_loss_account?.debit.length > 0) {
      report.profit_and_loss_account.debit.forEach((item) => {
        csvContent += `Indirect Expenses,${item.particular},-${formatter.format(item.amount + item.tax)}\n`;
      });
    } else {
      csvContent += "Indirect Expenses,No Data,0.00\n";
    }
  
    // Adding net profit/net loss section
    const netProfit = report?.profit_and_loss_account?.net_profit || 0;
    const netLoss = report?.profit_and_loss_account?.net_loss || 0;
  
    if (netLoss > netProfit) {
      csvContent += `Net Profit/Net Loss,Net Loss,-${formatter.format(netLoss)}\n`;
    } else {
      csvContent += `Net Profit/Net Loss,Net Profit,+${formatter.format(netProfit)}\n`;
    }
  
    // Creating the CSV file
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "profit_and_loss_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (
    <div className="profit-and-lose-container">
      <div className="head-with-icon">
      <h4>PROFIT AND LOSS REPORT</h4>
      <div className="icon-with-text">
      <SimCardDownloadOutlinedIcon onClick={generateCSV} />
      <h5>Download CSV</h5>
      </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
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
        <Box
          sx={{
            margin: "12px",
            p: "3px",
            borderRadius: 1,
          }}
        >
          <p className="party-name">Project</p>
          <select
            className="party-details-select"
            value={partySelect}
            style={{ width: "100%" }}
            onChange={handleSetParty}
          >
            <option value="select">Select</option>
            {partyOptions.map((option, index) => (
              <option key={index} value={option.value} label={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </Box>
      </div>

      <div>
        <Accordion sx={{ margin: "0px" }}>
          <AccordionSummary aria-controls="panel2-content" id="panel2-header">
            <h5>Tax payable(-)</h5>
          </AccordionSummary>
          <AccordionDetails sx={{ background: "#f3f6f9" }}>
            <div className="tax-payable-accordion">
              <div className="gst-payable">
                <h5>Gst payable(-)</h5>
                <p>{formatter.format((report?.tax_payable?.gst_payable||0))}</p>
              </div>
              <div className="tcs-payable">
                <h5>TCS payable(-)</h5>
                <p>{formatter.format((report?.tax_payable?.tcs_payable||0))}</p>
                

              </div>
            </div>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ margin: "0px" }}>
          <AccordionSummary aria-controls="panel2-content" id="panel2-header">
            <h5>Tax Receivable(+)</h5>
          </AccordionSummary>
          <AccordionDetails sx={{ background: "#f3f6f9" }}>
            <div className="tax-payable-accordion-receivable">
              <div className="gst-payable">
                <h5>Gst Receivable(+)</h5>
                <p>{formatter.format((report?.tax_receivable?.gst_receivable||0))}</p>
              </div>
              <div className="tcs-payable">
                <h5>TCS Receivable(+)</h5>
                <p>{formatter.format((report?.tax_receivable?.tcs_receivable||0))}</p>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
      <div className="stock-with-fixed">
        <div className="opening-stock">
          <h5>Opening Stock(-)</h5>
          <p>{formatter.format((report?.stocks?.opening_stock||0))}</p>
        </div>
        <div className="closing-stock">
          <h5>Closing Stock(+)</h5>
          <p>{formatter.format((report?.stocks?.closing_stock||0))}</p>
        </div>
        <div className="opening-stock-fa">
          <h5>Opening Stock FA(-)</h5>
          <p>{formatter.format((report?.stocks?.opening_stock_fa||0))}</p>
        </div>
        <div className="closing-stock-fa">
          <h5>Closing Stock FA(+)</h5>
          <p>{formatter.format((report?.stocks?.closing_stock_fa||0))}</p>
        </div>
      </div>

      <div className="total-amount">
        <hr />
        <div className="gross-profit">
  {report?.trade_account?.gross_loss > report?.trade_account?.gross_profit ? (
    <>
      <h5>Gross loss</h5>
      <p>{formatter.format((report?.trade_account?.gross_loss||0))}</p>
    </>
  ) : (
    <>
      <h5>Gross profit</h5>
      <p>{formatter.format((report?.trade_account?.gross_profit||0))}</p>
    </>
  )}
</div>

        <hr />
        <div className="">
          
          <Accordion sx={{ margin: "0px" }}>
          <AccordionSummary aria-controls="panel2-content" id="panel2-header">
            <h5>Other income(+)</h5>
          </AccordionSummary>
          <AccordionDetails sx={{ background: "#f3f6f9" }}>
            
                  <div className="table-container">

    {   report?.profit_and_loss_account?.credit.length>0?    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ACCOUNT</TableCell>
            <TableCell align="right">AMOUNT</TableCell>
            {/* <TableCell align="right">CREDIT</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {report?.profit_and_loss_account?.credit?.map((row,index) => (
            <TableRow key={index}>
            <TableCell>{row.particular}</TableCell>
            <TableCell align="right">{formatter.format(row.amount+row.tax)}</TableCell>
            {/* <TableCell align="right">0</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>:<p style={{textAlign:"center"}}>No Data</p>}
            </div>
          </AccordionDetails>
        </Accordion>
        </div>
      </div>

      <div>
        <Accordion sx={{ margin: "0px" }}>
          <AccordionSummary aria-controls="panel2-content" id="panel2-header">
            <h5>Indirect Expenses(-)</h5>
          </AccordionSummary>
          <AccordionDetails sx={{ background: "#f3f6f9" }}>
            
                  <div className="table-container">

         {report?.profit_and_loss_account?.debit.length >0 ?   <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ACCOUNT</TableCell>
            <TableCell align="right">AMOUNT</TableCell>
            {/* <TableCell align="right">CREDIT</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {report?.profit_and_loss_account?.debit?.map((row,index) => (
            <TableRow key={index}>
            <TableCell>{row.particular}</TableCell>
            <TableCell align="right">{formatter.format(row.amount+row.tax)}</TableCell>
            {/* <TableCell align="right">0</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>:<p style={{textAlign:"center"}}>No Data</p>}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
      <div className="total-net-profit">
        
        {report?.profit_and_loss_account?.net_loss > report?.profit_and_loss_account?.net_profit ? (
    <>
      <h5>Net loss</h5>
      <p>{formatter.format((report?.profit_and_loss_account?.net_loss||0))}</p>
    </>
  ) : (
    <>
      <h5>Net Profit</h5>
      <p>{formatter.format((report?.profit_and_loss_account?.net_profit||0))}</p>
    </>
  )}
      </div>
      
    </div>
  );
}

export default ProfitAndLose;
