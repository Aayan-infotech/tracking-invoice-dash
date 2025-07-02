import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Users from "../pages/UserManagement/Users";
// import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../pages/admin/AdminLayout";
import Projects from "../pages/Projects/Projects";
import Task from "../pages/TaskManagement/Task";
import AssignTasks from "../pages/Projects/AssignTasks";
import QualityAssurance from "../pages/Projects/QuanlityAssuarnce";
import TermsOfService from "../pages/TermsOfService/TermsOfService";
import Pages from "../pages/Pages";
import ProjectInvoices from "../pages/Projects/ProjectInvoices";
import ProjectTask from "../pages/Projects/ProjectTask";
import Homepage from "../pages/Home/Homepage";
// import DocumentType from "../pages/DocumentType/DocumentType";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import TermCondition from "../pages/Term&Conditions/TermCondition";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Homepage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermCondition />} />
      <Route path="*" element={<h1>Page Not Found</h1>} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="tasks" element={<Task />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projectTasks" element={<ProjectTask />} />
        <Route path="invoices" element={<ProjectInvoices />} />
        <Route path="assign-tasks" element={<AssignTasks />} />
        <Route path="quality-assurance" element={<QualityAssurance />} />
        <Route path="pages" element={<Pages />} />
        <Route path="terms-of-service" element={<TermsOfService />} />
      </Route>
    </Routes>
  );
}
