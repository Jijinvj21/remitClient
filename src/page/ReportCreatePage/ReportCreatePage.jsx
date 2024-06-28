import { styled } from "@mui/material";
import "./ReportCreatePage.scss";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import ProfitAndLose from "./component/ProfitAndLose/ProfitAndLose";
import BalanceSheet from "./component/BalanceSheet/BalanceSheet";
import TrialBalance from "./component/TrialBalance/TrialBalance";
import { profitLossDataGetAPI } from "../../service/api/admin";

function ReportCreatePage() {
  const StyledAddIcon = styled(AddIcon)(({ theme }) => ({
    "& .css-1slsi4y-MuiChip-root .MuiChip-icon": {
      color: "white", // Change icon color to white
    },
    backgroundColor: "white",
    borderRadius: "50%",
    padding: theme.spacing(0.5),
    fontSize: "1rem",
  }));

  const [activeTab, setActiveTab] = useState("Tab1");
  const [report, setReport] = useState([]);
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedOfBalanceToDate, setSelectedOfBalanceToDate] = useState(null);
  const [selectedOfBalanceFromDate, setSelectedOfBalanceFromDate] = useState(null);
  const [selectedOfTrialToDate, setSelectedOfTrialToDate] = useState(null);
  const [selectedOfTrialFromDate, setSelectedOfTrialFromDate] = useState(null);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };
  useEffect(() => {
    profitLossDataGetAPI({ from: selectedFromDate, to: selectedToDate })
      .then((response) => {
        setReport(response.data.responseData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedFromDate, selectedToDate,selectedOfBalanceToDate,selectedOfBalanceFromDate ]);
  return (
    <div className="report-cteate-section">
      <h2>Report</h2>
      <div className="chipMenus">
        <button
          className={`tablinks ${activeTab === "Tab3" ? "active" : ""}`}
          onClick={() => handleTabClick("Tab3")}
        >
          <StyledAddIcon /> <span>Trial Balance</span>
        </button>
        <button
          className={`tablinks ${activeTab === "Tab2" ? "active" : ""}`}
          onClick={() => handleTabClick("Tab2")}
        >
          <StyledAddIcon /> <span>Balance Sheet</span>
        </button>
        <button
          className={`tablinks ${activeTab === "Tab1" ? "active" : ""}`}
          onClick={() => handleTabClick("Tab1")}
        >
          <StyledAddIcon /> <span>Profit and Loss</span>
        </button>
      </div>
      <div className="inner-section">
        <div
          className={`tabcontent ${activeTab === "Tab1" ? "active" : ""}`}
          id="Tab1"
        >
          <ProfitAndLose
            setReport={setReport}
            report={report}
            selectedToDate={selectedToDate}
            setSelectedToDate={setSelectedToDate}
            selectedFromDate={selectedFromDate}
            setSelectedFromDate={setSelectedFromDate}
          />
        </div>
        <div
          className={`tabcontent ${activeTab === "Tab2" ? "active" : ""}`}
          id="Tab2"
        >
          <BalanceSheet
            setReport={setReport}
            report={report}
            selectedToDate={selectedOfBalanceToDate}
            setSelectedToDate={setSelectedOfBalanceToDate}
            selectedFromDate={selectedOfBalanceFromDate}
            setSelectedFromDate={setSelectedOfBalanceFromDate}
          />
        </div>
        <div
          className={`tabcontent ${activeTab === "Tab3" ? "active" : ""}`}
          id="Tab3"
        >
          <TrialBalance
          setReport={setReport}
          report={report}
          selectedToDate={selectedOfTrialToDate}
          setSelectedToDate={setSelectedOfTrialToDate}
          selectedFromDate={selectedOfTrialFromDate}
          setSelectedFromDate={setSelectedOfTrialFromDate}
          />
        </div>
      </div>
    </div>
  );
}

export default ReportCreatePage;
