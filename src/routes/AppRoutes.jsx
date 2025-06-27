import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Users from "../pages/UserManagement/Users";
import ProtectedRoute from "./ProtectedRoute";
import Projects from "../pages/Projects/Projects";
import Task from "../pages/TaskManagement/Task";
import AssignTasks from "../pages/Projects/AssignTasks";
import QualityAssurance from "../pages/Projects/QuanlityAssuarnce";
import TermsOfService from "../pages/TermsOfService/TermsOfService";
import Pages from "../pages/Pages";
import ProjectInvoices from "../pages/Projects/ProjectInvoices";
import ProjectTask from "../pages/Projects/ProjectTask";
import Homepage from "../pages/Home/Homepage";
import DocumentType from "../pages/DocumentType/DocumentType";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import TermCondition from "../pages/Term&Conditions/TermCondition";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Homepage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermCondition />} />

      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Task />
          </ProtectedRoute>
        }
      />

      {/* Project Management */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projectTasks"
        element={
          <ProtectedRoute>
            <ProjectTask />
          </ProtectedRoute>
        }
      />

      <Route
        path="/document-types"
        element={
          <ProtectedRoute>
            <DocumentType />
          </ProtectedRoute>
        }
      />

      <Route
        path="/invoices"
        element={
          <ProtectedRoute>
            <ProjectInvoices />
          </ProtectedRoute>
        }
      />

      <Route
        path="/assign-tasks"
        element={
          <ProtectedRoute>
            <AssignTasks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quality-assurance"
        element={
          <ProtectedRoute>
            <QualityAssurance />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pages"
        element={
          <ProtectedRoute>
            <Pages />
          </ProtectedRoute>
        }
      />

      <Route
        path="/terms-of-service"
        element={
          <ProtectedRoute>
            <TermsOfService />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
