import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import "./Projects.css";
import axios from "axios";
import { fetchWithAuth } from "../../utils/authFetch";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Pagination from "../../components/Pagination";
import { links } from "../../contstants";

function Projects() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_page: 1,
    per_page: 10,
    total_records: 0,
  });
  const [modalType, setModalType] = useState(null);
  const [projectData, setProjectData] = useState({
    projectName: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [disabled, setDisabled] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${links.BASE_URL}projects`, {
        method: "GET",
        params: {
          page: pagination.current_page,
          limit: pagination.per_page,
        },
      });

      setProjects(
        response?.data?.data?.projects ? response.data.data.projects : []
      );
      setPagination({
        current_page: response?.data?.data?.current_page || 1,
        total_page: response?.data?.data?.total_page || 1,
        per_page: response?.data?.data?.per_page || 10,
        total_records: response?.data?.data?.total_records || 0,
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      toast.error("Failed to fetch projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [pagination.current_page]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.total_page) {
      setPagination((prev) => ({ ...prev, current_page: newPage }));
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setProjectData({
      projectName: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const handleAddProject = () => {
    setModalType("add");
    setProjectData({
      projectName: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveProjectDetails = async () => {
    try {
      setDisabled(true);
      const result = await axios.post(
        `${links.BASE_URL}projects`,
        {
          projectName: projectData.projectName,
          startDate: projectData.startDate,
          endDate: projectData.endDate,
          description: projectData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Project saved successfully");
      setModalType(null);
      setProjectData({
        projectName: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      setDisabled(false);
      setProjects((prev) => [...prev, result.data.data]);
    } catch (err) {
      const response = err.response.data;
      setLoading(false);
      setDisabled(false);
      if (response && response.message) {
        toast.error(response.message);
      } else {
        toast.error("Failed to save project details");
      }
    }
  };

  const handleView = (idx) => {
    const project = projects[idx];
    setProjectData({
      projectName: project.projectName,
      startDate: project.startDate
        ? new Date(project.startDate).toISOString().split("T")[0]
        : "",
      endDate: project.endDate
        ? new Date(project.endDate).toISOString().split("T")[0]
        : "",
      description: project.description || "",
    });
    setModalType("view");
  };

  const handleEdit = (idx) => {
    const project = projects[idx];
    setProjectData({
      id: project._id,
      projectName: project.projectName,
      startDate: project.startDate
        ? new Date(project.startDate).toISOString().split("T")[0]
        : "",
      endDate: project.endDate
        ? new Date(project.endDate).toISOString().split("T")[0]
        : "",
      description: project.description || "",
      status: project.status || "active",
    });
    setModalType("edit");
  };

  const updateProjectDetails = async () => {
    try {
      setDisabled(true);
      const result = await axios.put(
        `${links.BASE_URL}projects/update/${projectData.id}`,
        {
          projectName: projectData.projectName,
          startDate: projectData.startDate,
          endDate: projectData.endDate,
          description: projectData.description,
          status: projectData.status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Project updated successfully");
      setModalType(null);
      setProjectData({
        projectName: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      setDisabled(false);
      setProjects((prev) =>
        prev.map((project) =>
          project._id === result.data.data._id ? result.data.data : project
        )
      );
    } catch (err) {
      const response = err.response.data;
      setLoading(false);
      setDisabled(false);
      if (response && response.message) {
        toast.error(response.message);
      } else {
        toast.error("Failed to update project details");
      }
    }
  };

  const handleDelete = async (projectId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${links.BASE_URL}projects/delete/${projectId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );
          toast.success("Project deleted successfully");
          setProjects((prev) =>
            prev.filter((project) => project._id !== projectId)
          );
        } catch (err) {
          const response = err.response.data;
          if (response && response.message) {
            toast.error(response.message);
          } else {
            toast.error("Failed to delete project");
          }
        }
      }
    });
  };


  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark">Project Management</h3>
        <Button
          title="Add Project"
          onClick={handleAddProject}
          variant="primary"
        >
          Add Project
        </Button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered align-middle text-center table-striped">
          <thead className="table-dark">
            <tr>
              <th>Project Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project, idx) => (
                <tr key={project._id}>
                  <td>{project.projectName}</td>
                  <td>
                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          }
                        )
                      : "N/A"}
                  </td>
                  <td>
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td>
                    {/* 'active', 'completed', 'on hold', 'cancelled */}
                    {project.status === "active" ? (
                      <span className="badge bg-success">Active</span>
                    ) : project.status === "completed" ? (
                      <span className="badge bg-primary">Completed</span>
                    ) : project.status === "on hold" ? (
                      <span className="badge bg-warning">On Hold</span>
                    ) : (
                      <span className="badge bg-danger">Cancelled</span>
                    )}
                  </td>
                  <td>
                    <i
                      className="bi bi-eye text-primary fs-5 me-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleView(idx)}
                      title="View Project"
                    ></i>
                    <i
                      className="bi bi-pencil text-warning fs-5"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEdit(idx)}
                      title="Edit Project"
                    ></i>
                    {/* <i
                          className="bi bi-trash text-danger fs-5 ms-3"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDelete(project._id)}
                          title="Delete Project"
                        ></i> */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No projects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        onPageChange={(page) =>
          setPagination((prev) => ({ ...prev, current_page: page }))
        }
        currentPage={pagination.current_page}
        totalPageCount={pagination.total_page}
      />

      {/* Modal */}
      {modalType && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === "add"
                    ? "Add Project"
                    : modalType === "view"
                    ? "View Project"
                    : "Edit Project"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                {modalType === "add" ? (
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Project Name</label>
                        <input
                          type="text"
                          name="projectName"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Project Description
                        </label>
                        <textarea
                          name="description"
                          className="form-control"
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                ) : modalType === "view" ? (
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3 d-flex">
                        <div className="fw-semibold w-25">📌 Project Name:</div>
                        <div className="text-muted">
                          {projectData.projectName || "N/A"}
                        </div>
                      </div>

                      <div className="mb-3 d-flex">
                        <div className="fw-semibold w-25">📅 Start Date:</div>
                        <div className="text-muted">
                          {projectData.startDate
                            ? new Date(
                                projectData.startDate
                              ).toLocaleDateString("en-GB")
                            : "N/A"}
                        </div>
                      </div>

                      <div className="mb-3 d-flex">
                        <div className="fw-semibold w-25">📅 End Date:</div>
                        <div className="text-muted">
                          {projectData.endDate
                            ? new Date(projectData.endDate).toLocaleDateString(
                                "en-GB"
                              )
                            : "N/A"}
                        </div>
                      </div>

                      <div className="mb-3 d-flex">
                        <div className="fw-semibold w-25">📝 Description:</div>
                        <div className="text-muted">
                          {projectData.description || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Project Name</label>
                          <input
                            type="text"
                            name="projectName"
                            className="form-control"
                            value={projectData.projectName}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Start Date</label>
                          <input
                            type="date"
                            name="startDate"
                            className="form-control"
                            value={projectData.startDate}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">End Date</label>
                          <input
                            type="date"
                            name="endDate"
                            className="form-control"
                            value={projectData.endDate}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            Project Description
                          </label>
                          <textarea
                            name="description"
                            className="form-control"
                            onChange={handleChange}
                            value={projectData.description}
                          ></textarea>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Project Status</label>
                          <select
                            name="status"
                            className="form-select"
                            value={projectData.status}
                            onChange={handleChange}
                          >
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="on hold">On Hold</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                {modalType === "add" ? (
                  <Button
                    variant="primary"
                    onClick={saveProjectDetails}
                    disabled={disabled}
                  >
                    Save Project
                  </Button>
                ) : (
                  modalType === "edit" && (
                    <Button
                      variant="primary"
                      onClick={updateProjectDetails}
                      disabled={disabled}
                    >
                      Update Project
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;
