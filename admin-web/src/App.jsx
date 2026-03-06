import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);
import { Box, CircularProgress, CssBaseline } from "@mui/material";

import theme from "./theme";
import Layout from "./components/Layout";

// Lazy Loaded Pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AddStaff = lazy(() => import("./pages/AddStaff"));
const ListStaff = lazy(() => import("./pages/ListStaff"));
const AddStudent = lazy(() => import("./pages/AddStudent"));
const ListStudents = lazy(() => import("./pages/ListStudents"));
const Login = lazy(() => import("./pages/Login"));
const AddLeads = lazy(() => import("./pages/AddLeads"));
const ListLead = lazy(() => import("./pages/ListLead"));
const StudentDetails = lazy(() => import("./pages/StudentDetails"));
const AddPayment = lazy(() => import("./pages/AddPayment"));
const AddCourse = lazy(() => import("./pages/AddCourse"));
const AddBatch = lazy(() => import("./pages/AddBatch"));
const BatchList = lazy(() => import("./pages/BatchList"));
const TransactionHistory = lazy(() => import("./pages/TransactionHistory"));
const TransactionDetails = lazy(() => import("./pages/ViewTransactions"));
const ListCourses = lazy(() => import("./pages/ListCourse"));
const BatchScheduler = lazy(() => import("./pages/BatchScheduler"));
const ListRole = lazy(() => import("./pages/ListRole"));
const AddRole = lazy(() => import("./pages/AddRole"));
const AddUser = lazy(() => import("./pages/AddUser"));
const ListUsers = lazy(() => import("./pages/ListUsers"));
const BatchStudents = lazy(() => import("./pages/BatchStudents"));
const StaffDetails = lazy(() => import("./pages/StaffDetails.jsx"))



function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Router>
        <Suspense fallback={<Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>}>

          <Routes>

            <Route path="/" element={<Login />} />

            <Route element={<Layout />}>

              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/staff/add" element={<AddStaff />} />
              <Route path="/staff/list" element={<ListStaff />} />
              <Route path="/staff/edit/:id" element={<AddStaff />} />
              <Route path="/staff/view/:id" element={<StaffDetails />} />

              <Route path="/students/add" element={<AddStudent />} />
              <Route path="/students/list" element={<ListStudents />} />
              <Route path="/students/edit/:id" element={<AddStudent />} />
              <Route path="/students/view/:id" element={<StudentDetails />} />

              <Route path="/leads/add" element={<AddLeads />} />
              <Route path="/leads/list" element={<ListLead />} />

              <Route path="/courses/add" element={<AddCourse />} />
              <Route path="/courses/edit/:id" element={<AddCourse />} />
              <Route path="/courses/list" element={<ListCourses />} />

              <Route path="/payments/add" element={<AddPayment />} />
              <Route path="/payments/history" element={<TransactionHistory />} />
              <Route path="/transactions/view/:id" element={<TransactionDetails />} />

              <Route path="/batch/add" element={<AddBatch />} />
              <Route path="/batch/edit/:id" element={<AddBatch />} />
              <Route path="/batch/view/:id" element={<BatchStudents />} />
              <Route path="/batch/list" element={<BatchList />} />

              <Route path="/batches/:id/students" element={<BatchStudents />} />

              <Route path="/batch/scheduler" element={<BatchScheduler />} />

              <Route path="/roles/add" element={<AddRole />} />
              <Route path="/roles/edit/:id" element={<AddRole />} />
              <Route path="/roles/list" element={<ListRole />} />

              <Route path="/user/add" element={<AddUser />} />
              <Route path="/user/list" element={<ListUsers />} />

            </Route>

          </Routes>

        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
