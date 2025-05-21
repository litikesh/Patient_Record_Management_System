import DashboardLayout from "./components/Layout/DashboardLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Pages/Dashboard";
import Patients from "./components/Pages/Patients";
import Records from "./components/Pages/Records";
import SQLInterface from "./components/Pages/SQLInterface";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/patients"
          element={
            <DashboardLayout>
              <Patients />
            </DashboardLayout>
          }
        />
        <Route
          path="/records"
          element={
            <DashboardLayout>
              <Records />
            </DashboardLayout>
          }
        />
        <Route
          path="/sql-interface"
          element={
            <DashboardLayout>
              <SQLInterface />
            </DashboardLayout>
          }
        />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
