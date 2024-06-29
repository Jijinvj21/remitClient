import { useEffect } from "react";
import dayjs from "dayjs";
import DateRangePicker from "../../../../components/DateRangePicker/DateRangePicker";
import "./TrialBalance.scss";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper  } from "@mui/material";
import SimCardDownloadOutlinedIcon from '@mui/icons-material/SimCardDownloadOutlined';

function TrialBalance({
  setReport,
  report,
  selectedToDate,
  setSelectedToDate,
  selectedFromDate,
  setSelectedFromDate,
}) {
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
  console.log(report?.trial_balance,"reportData")
  const generateCSV = () => {
    const headers = ["Particular", "Debit", "Credit"];
    const rows = report?.trial_balance?.map(row => [row.particular, row.debit, row.credit]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "trial_balance.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="trial-balance-container">
      <div className="head-with-icon">
      <h4>TRIAL BALANCE REPORT</h4>
      <div className="icon-with-text">
      <SimCardDownloadOutlinedIcon onClick={generateCSV} />
      <h5>Download CSV</h5>
      </div>
      </div>
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

      <div className="table-container">
   

<TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ACCOUNT</TableCell>
            <TableCell align="right">DEBIT</TableCell>
            <TableCell align="right">CREDIT</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {report?.trial_balance?.map((row,index) => (
            <TableRow key={index}>
              <TableCell>{row.account}</TableCell>
              <TableCell align="right">{row.debit}</TableCell>
              <TableCell align="right">{row.credit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

      </div>
    </div>
  );
}

export default TrialBalance;
