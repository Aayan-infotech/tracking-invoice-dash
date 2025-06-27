import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation();
  const { pathname } = location;
  const [openUsers, setOpenUsers] = useState(false);
  const [openTasks, setOpenTasks] = useState(false);
  const [openProjects, setOpenProjects] = useState(false);
  const [openPages, setOpenPages] = useState(false);
  // const [openDocumentType, setOpenDocumentType] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/users")) {
      setOpenUsers(true);
    }
    if (pathname.startsWith("/tasks")) {
      setOpenTasks(true);
    }
    // if (pathname.startsWith("/document-types")) {
    //   setOpenDocumentType(true);
    // }
    if (
      pathname.startsWith("/projects") ||
      pathname.startsWith("/projectTasks") ||
      pathname.startsWith("/assign-tasks") ||
      pathname.startsWith("/quality-assurance") ||
      pathname.startsWith("/invoices")
    ) {
      setOpenProjects(true);
    }
    if (
      pathname.startsWith("/pages") ||
      pathname.startsWith("/terms-of-service")
    ) {
      setOpenPages(true);
    }
  }, [pathname]);

  return (
    <div className="custom-sidebar">
      <h4 className="sidebar-title">
        <i className="bi bi-globe2 me-2"></i>Tracking Invoice
      </h4>

      <ul className="sidebar-nav">
        <li className="sidebar-item">
          <Link to="/dashboard" className="sidebar-link-dash">
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </Link>
        </li>

        {/* Users Dropdown */}
        <li className="sidebar-item">
          <div
            className="sidebar-link"
            onClick={() => setOpenUsers(!openUsers)}
          >
            <span>
              <i className="bi bi-people-fill me-2"></i>User Management
            </span>
            <i
              className={`bi ${
                openUsers ? "bi-chevron-up" : "bi-chevron-down"
              }`}
            ></i>
          </div>
          {openUsers && (
            <ul className="sidebar-submenu">
              <li>
                <Link
                  to="/users"
                  className={`sidebar-sublink ${
                    pathname === "/users" ? "active" : ""
                  }`}
                >
                  All Users
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Users Dropdown */}
        <li className="sidebar-item">
          <div
            className="sidebar-link"
            onClick={() => setOpenTasks(!openTasks)}
          >
            <span>
              <i className="bi bi-list-task me-2"></i>Task Management
            </span>
            <i
              className={`bi ${
                openTasks ? "bi-chevron-up" : "bi-chevron-down"
              }`}
            ></i>
          </div>
          {openTasks && (
            <ul className="sidebar-submenu">
              <li>
                <Link
                  to="/tasks"
                  className={`sidebar-sublink ${
                    pathname === "/tasks" ? "active" : ""
                  }`}
                >
                  All Tasks
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* <li className="sidebar-item">
          <div
            className="sidebar-link"
            onClick={() => setOpenDocumentType(!openDocumentType)}
          >
            <span>
              <i className="bi bi-people-fill me-2"></i>Document Type
            </span>
            <i
              className={`bi ${
                openDocumentType ? "bi-chevron-up" : "bi-chevron-down"
              }`}
            ></i>
          </div>
          {openDocumentType && (
            <ul className="sidebar-submenu">
              <li>
                <Link
                  to="/document-types"
                  className={`sidebar-sublink ${
                    pathname === "/document-types" ? "active" : ""
                  }`}
                >
                  All Document Types
                </Link>
              </li>
            </ul>
          )}
        </li> */}

        {/* Project Management */}
        <li className="sidebar-item">
          <div
            className="sidebar-link"
            onClick={() => setOpenProjects(!openProjects)}
          >
            <span>
              <i className="bi bi-bar-chart-fill me-2"></i>Projects
            </span>
            <i
              className={`bi ${
                openProjects ? "bi-chevron-up" : "bi-chevron-down"
              }`}
            ></i>
          </div>
          {openProjects && (
            <ul className="sidebar-submenu">
              <li>
                <Link
                  to="/projects"
                  className={`sidebar-sublink ${
                    pathname === "/projects" ? "active" : ""
                  }`}
                >
                  All Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/projectTasks"
                  className={`sidebar-sublink ${
                    pathname === "/projectTasks" ? "active" : ""
                  }`}
                >
                  Project Tasks
                </Link>
              </li>
              <li>
                <Link
                  to="/assign-tasks"
                  className={`sidebar-sublink ${
                    pathname === "/assign-tasks" ? "active" : ""
                  }`}
                >
                  Assign Tasks
                </Link>
              </li>
              <li>
                <Link
                  to="/quality-assurance"
                  className={`sidebar-sublink ${
                    pathname === "/quality-assurance" ? "active" : ""
                  }`}
                >
                  Quality Assurance
                </Link>
              </li>
              <li>
                <Link
                  to="/invoices"
                  className={`sidebar-sublink ${
                    pathname === "/invoices" ? "active" : ""
                  }`}
                >
                  Project Invoices
                </Link>
              </li>
            </ul>
          )}
        </li>
        {/* Pages Dropdown */}
        <li className="sidebar-item">
          <div
            className="sidebar-link"
            onClick={() => setOpenPages(!openPages)}
          >
            <span>
              <i className="bi bi-file-text-fill me-2"></i>Pages
            </span>
            <i
              className={`bi ${
                openPages ? "bi-chevron-up" : "bi-chevron-down"
              }`}
            ></i>
          </div>
          {openPages && (
            <ul className="sidebar-submenu">
              <li>
                <Link
                  to="/pages"
                  className={`sidebar-sublink ${
                    pathname === "/pages" ? "active" : ""
                  }`}
                >
                  Pages
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}
