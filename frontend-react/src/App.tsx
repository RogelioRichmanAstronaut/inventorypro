import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import LoginButton from "./auth/LoginButton";
import Profile from "./auth/Profile";
import Sales from "./Sales";
import Inventory from "./inventory";
import NewSale from "./NewSale";
import EditProduct from "./EditProduct";
import CreateProduct from "./CreateProduct";
import Reports from "./Reports";
import CreateReport from "./CreateReport";
import ReportDetails from "./ReportDetails";

const App = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <Router>
      <div>
        <Profile />
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<Inventory />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/newSale" element={<NewSale />} />
            <Route path="/editProduct/:productId" element={<EditProduct />} />
            <Route path="/createProduct" element={<CreateProduct />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/createReport" element={<CreateReport />} />
            <Route
              path="/reportDetails/:reportId"
              element={<ReportDetails />}
            />
          </Routes>
        ) : (
          <LoginButton />
        )}
      </div>
    </Router>
  );
};

export default App;
