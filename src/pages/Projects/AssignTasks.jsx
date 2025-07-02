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
import Loading from "../../components/Loading/Loading";
import { useSelector } from "react-redux";

function AssignTasks() {
  const userState = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [refreshTable, setRefreshTable] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_page: 1,
    per_page: 10,
    total_records: 0,
  });
  const [modalType, setModalType] = useState(null);
  const [formData, setFormData] = useState({
    projectId: "",
    taskId: "",
    userId: "",
  });
  const [disabled, setDisabled] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(
        `${links.BASE_URL}projects/project-dropdown`,
        {
          method: "GET",
        }
      );
      setProjects(response?.data?.data ? response.data.data : []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch projects");
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(
        `${links.BASE_URL}users/all-verified-users`,
        {
          method: "GET",
        }
      );
      setUsers(response?.data?.data ? response.data.data : []);
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || "Failed to fetch users");
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const response = await fetchWithAuth(
        `${links.BASE_URL}projects/tasks/${projectId}`,
        {
          method: "GET",
        }
      );
      setTasks(response?.data?.data ? response.data.data : []);
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || "Failed to fetch tasks");
    }
  };

  const fetchAssignedTasks = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(
        `${links.BASE_URL}projects/assign-tasks`,
        {
          method: "GET",
          params: {
            page: pagination.current_page,
            perPage: pagination.per_page,
          },
        }
      );

      if (response.data.success) {
        setAssignedTasks(response?.data?.data?.tasks || []);
        setPagination({
          current_page: response?.data?.data?.current_page || 1,
          total_page: response?.data?.data?.total_page || 1,
          per_page: response?.data?.data?.per_page || 10,
          total_records: response?.data?.data?.total_records || 0,
        });
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(response.data.message || "Failed to fetch assigned tasks");
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  useEffect(() => {
    if (projects.length <= 0) {
      fetchProjects();
    }
    if (users.length <= 0) {
      fetchUsers();
    }
    fetchAssignedTasks();
  }, [pagination.current_page, refreshTable]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.total_page) {
      setPagination((prev) => ({ ...prev, current_page: newPage }));
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setFormData({
      id: "",
      projectId: "",
      taskId: "",
      userId: "",
      taskName: "",
      taskAmount: "",
      description: "",
    });
  };

  const handleAddTask = () => {
    setModalType("add");
    setFormData({
      projectId: "",
      taskName: "",
      taskAmount: "",
      description: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "projectId" && value) {
      fetchTasks(value);
      setFormData((prev) => ({
        ...prev,
        taskId: "",
      }));
      setTasks([]);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveAssignTask = async () => {
    try {
      setDisabled(true);
      const result = await axios.post(
        `${links.BASE_URL}projects/assign-tasks`,
        {
          projectId: formData.projectId,
          userId: formData.userId,
          taskId: formData.taskId,
        },
        {
          headers: {
            Authorization: `Bearer ${userState.userInfo.accessToken}`,
          },
        }
      );
      toast.success("Task saved successfully");
      setModalType(null);
      setFormData({
        projectId: "",
        taskName: "",
        taskAmount: "",
        description: "",
      });
      setDisabled(false);
      setRefreshTable((prev) => !prev);
    } catch (err) {
      const response = err.response.data;
      setLoading(false);
      setDisabled(false);
      if (response && response.message) {
        toast.error(response.message);
      } else {
        toast.error("Failed to save task details");
      }
    }
  };

  const handleView = (idx) => {
    const assignedTask = assignedTasks[idx];
    setFormData({
      projectName: assignedTask.projectName || "",
      taskName: assignedTask.taskName || "",
      username: assignedTask.username || "",
    });
    setModalType("view");
  };

  const handleEdit = (idx) => {
    const assignedTask = assignedTasks[idx];
    setFormData({
      id: assignedTask._id,
      projectId: assignedTask.projectId || "",
      taskId: assignedTask.taskId || "",
      userId: assignedTask.userId || "",
    });
    fetchTasks(assignedTask.projectId);
    setModalType("edit");
  };

  const updateTaskDetails = async () => {
    try {
      setDisabled(true);
      const result = await axios.put(
        `${links.BASE_URL}projects/assign-tasks/${formData.id}`,
        {
          projectId: formData.projectId,
          userId: formData.userId,
          taskId: formData.taskId,
        },
        {
          headers: {
            Authorization: `Bearer ${userState.userInfo.accessToken}`,
          },
        }
      );
      toast.success("Task updated successfully");
      setModalType(null);
      setFormData({
        id: "",
        userId: "",
        taskId: "",
        projectId: "",
      });
      setDisabled(false);
      setRefreshTable((prev) => !prev);
    } catch (err) {
      setLoading(false);
      setDisabled(false);
      toast.error(err.response.data.message || "Failed to update task");
    }
  };

  const handleDelete = async (assignedTaskId) => {
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
            `${links.BASE_URL}projects/assign-tasks/${assignedTaskId}`,
            {
              headers: {
                Authorization: `Bearer ${userState.userInfo.accessToken}`,
              },
            }
          );
          toast.success("Task deleted successfully");
          setAssignedTasks((prev) =>
            prev.filter((task) => task._id !== assignedTaskId)
          );
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to delete task");
          setLoading(false);
        }
      }
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark">Assign Tasks</h3>
        <Button title="Assign Task" onClick={handleAddTask} variant="primary">
          Assign Task
        </Button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered align-middle text-center table-striped">
          <thead className="table-dark">
            <tr>
              <th>Project Name</th>
              <th>Task Name</th>
              <th>Assign User</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignedTasks.length > 0 ? (
              assignedTasks.map((task, idx) => (
                <tr key={task._id}>
                  <td>{task.projectName || "N/A"}</td>
                  <td>{task.taskName || "N/A"}</td>
                  <td>{task.username || "N/A"}</td>
                  <td>
                    <i
                      className="bi bi-eye text-primary fs-5 me-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleView(idx)}
                      title="View Task"
                    ></i>
                    <i
                      className="bi bi-pencil text-warning fs-5"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEdit(idx)}
                      title="Edit Task"
                    ></i>
                    {/* <i
                          className="bi bi-trash text-danger fs-5 ms-3"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDelete(task._id)}
                          title="Delete Task"
                        ></i> */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No assigned tasks found.
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
                    ? "Assign Task"
                    : modalType === "view"
                    ? "View Assign Task"
                    : "Edit Assign Task"}
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
                        <label htmlFor="Project" className="form-label">
                          Select Project
                        </label>
                        <select
                          name="projectId"
                          className="form-select form-control"
                          id="Project"
                          onChange={handleChange}
                        >
                          <option value="">Select Project</option>
                          {projects.length > 0 &&
                            projects.map((project) => (
                              <option
                                value={project._id}
                                className="dropdown-projects"
                                key={project._id}
                              >
                                {project.projectName}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="Task" className="form-label">
                          Select Task
                        </label>
                        <select
                          name="taskId"
                          className="form-select form-control"
                          id="Task"
                          onChange={handleChange}
                        >
                          <option value="">Select Task</option>
                          {tasks.length > 0 &&
                            tasks.map((task) => (
                              <option
                                value={task._id}
                                className="dropdown-tasks"
                                key={task._id}
                              >
                                {task.taskName}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="User" className="form-label">
                          Select User
                        </label>
                        <select
                          name="userId"
                          className="form-select form-control"
                          id="User"
                          onChange={handleChange}
                        >
                          <option value="">Select User</option>
                          {users.length > 0 &&
                            users.map((user) => (
                              <option
                                value={user.userId}
                                className="dropdown-users"
                                key={user.userId}
                              >
                                {`${user.username} (${
                                  user.name ? user.name : "-"
                                })`}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ) : modalType === "view" ? (
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3 d-flex">
                        <div className="fw-semibold w-25">📌 Project Name:</div>
                        <div className="text-muted">
                          {formData?.projectName || "N/A"}
                        </div>
                      </div>
                      <div className="mb-3 d-flex">
                        <div className="fw-semibold w-25">📝 Task Name:</div>
                        <div className="text-muted">
                          {formData?.taskName || "N/A"}
                        </div>
                      </div>
                      <div className="mb-3 d-flex">
                        <div className="fw-semibold w-25">👤 Username:</div>
                        <div className="text-muted">
                          {formData?.username || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label htmlFor="Project" className="form-label">
                            Select Project
                          </label>
                          <select
                            name="projectId"
                            className="form-select form-control"
                            id="Project"
                            value={formData.projectId}
                            onChange={handleChange}
                          >
                            <option value="">Select Project</option>
                            {projects.length > 0 &&
                              projects.map((project) => (
                                <option
                                  value={project._id}
                                  className="dropdown-projects"
                                  key={project._id}
                                >
                                  {project.projectName}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="Task" className="form-label">
                            Select Task
                          </label>
                          <select
                            name="taskId"
                            className="form-select form-control"
                            id="Task"
                            value={formData.taskId}
                            onChange={handleChange}
                          >
                            <option value="">Select Task</option>
                            {tasks.length > 0 &&
                              tasks.map((task) => (
                                <option
                                  value={task._id}
                                  className="dropdown-tasks"
                                  key={task._id}
                                >
                                  {task.taskName}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="User" className="form-label">
                            Select User
                          </label>
                          <select
                            name="userId"
                            className="form-select form-control"
                            id="User"
                            value={formData.userId}
                            onChange={handleChange}
                          >
                            <option value="">Select User</option>
                            {users.length > 0 &&
                              users.map((user) => (
                                <option
                                  value={user.userId}
                                  className="dropdown-users"
                                  key={user.userId}
                                >
                                  {`${user.username} (${
                                    user.name ? user.name : "-"
                                  })`}
                                </option>
                              ))}
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
                    onClick={saveAssignTask}
                    disabled={disabled}
                  >
                    Save
                  </Button>
                ) : (
                  modalType === "edit" && (
                    <Button
                      variant="primary"
                      onClick={updateTaskDetails}
                      disabled={disabled}
                    >
                      Update
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AssignTasks;
