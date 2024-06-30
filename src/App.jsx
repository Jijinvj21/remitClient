import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import RigthSideLayout from "./components/RigthSideLayout/RigthSideLayout";
import AddStaff from "./page/AddStaffPage/AddStaffPage";
import AddClient from "./page/AddProjectsPage/AddProjectsPage";
import ManageProductsPage from "./page/ManageProductsPage/ManageProductsPage";
import ProjectsPage from "./page/ProjectsPage/ProjectsPage";
import EmployesPage from "./page/EmployeesPage/EmployeesPage";
import QuotationGeneratorPage from "./page/QuotationGeneratorPage/QuotationGeneratorPage";
import StockJournalPage from "./page/StockJournalPage/StockJournalPage";
import SalesPage from "./page/SalesPage/SalesPage";
import PurchasePage from "./page/PurchasePage/PurchasePage";
import PaymenyIn from "./page/PaymenyIn/PaymenyIn";
import CreditNotePage from "./page/CreditNotePage/CreditNotePage";
import ProjectDataPage from "./page/ProjectDataPage/ProjectDataPage";
import PaymenyOut from "./page/PaymentOut/PaymentOut";
import QuotationView from "./page/QuotationView/QuotationView";
import DebitNotePage from "./page/DebitNotePage/DebitNotePage";
import ExpencePage from "./page/ExpencePage/ExpencePage";
import DeliveryChallan from "./page/DeliveryChallan/DeliveryChallan";
import DeliveryChallanView from "./page/DeliveryChallanView/DeliveryChallanView";
import ExpenseView from "./page/ExpenseView/ExpenseView";
import DebitNoteView from "./page/DebitNoteView/DebitNoteView";
import CreaditNoteView from "./page/CreaditNoteView/CreaditNoteView";
import SignUpPage from "./page/SignUpPage/SignUpPage";
import OtpPage from "./page/OtpPage/OtpPage";
import ReportCreatePage from "./page/ReportCreatePage/ReportCreatePage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root layout */}
        <Route element={<Layout />}>
          <Route path="admin" element={<RigthSideLayout />}>
            <Route path="employees" element={<EmployesPage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="purchase" element={<PurchasePage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="receipt" element={<PaymenyIn />} />
            <Route path="payment-out" element={<PaymenyOut />} />
            <Route path="creadit-note" element={<CreditNotePage />} />
            <Route path="debit-note" element={<DebitNotePage />} />
            <Route path="project-data" element={<ProjectDataPage />} />
            <Route path="Quotation-View" element={<QuotationView />} />
            <Route path="journal-voucher" element={<ExpencePage />} />
            <Route path="delivery-challan" element={<DeliveryChallan />} />
            <Route path="delivery-challan/delivery-challan-view" element={<DeliveryChallanView />}/>
            <Route path="journal-voucher/journal-voucher-view" element={<ExpenseView />} />
            <Route path="debit-note/debit-note-view" element={<DebitNoteView />}/>
            <Route path="creadit-note/creadit-note-view" element={<CreaditNoteView />}/>
            <Route path="employees/add-employes" element={<AddStaff />} />
            <Route path="projects/add-projects" element={<AddClient />} />
            <Route path="stocks" element={<ManageProductsPage />} />
            <Route path="quotation-generator" element={<QuotationGeneratorPage />}/>
            <Route path="stocks/stock-journal" element={<StockJournalPage />} />
            <Route path="reports" element={<ReportCreatePage />} />

          </Route>
        </Route>
            <Route path="sign-up" element={<SignUpPage />} />
            <Route path="otp" element={<OtpPage />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;
