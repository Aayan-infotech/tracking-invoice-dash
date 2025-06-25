import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import "./Task.css";
import axios from "axios";
import { fetchWithAuth } from "../../api/authFetch";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { links } from "../../contstants";

function Task() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [refreshTable, setRefreshTable] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_page: 1,
    per_page: 10,
    total_records: 0,
  });
  const [modalType, setModalType] = useState(null);
  const [taskData, setTaskData] = useState({
    taskName: "",
    amount: "",
    status: "",
    description: "",
  });
  const [disabled, setDisabled] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(
        `${links.BASE_URL}projects/tasks`,
        {
          method: "GET",
          params: {
            page: pagination.current_page,
            limit: pagination.per_page,
          },
        }
      );

      setTasks(response?.data?.data?.tasks ? response.data.data.tasks : []);
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
      toast.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [pagination.current_page, refreshTable]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.total_page) {
      setPagination((prev) => ({ ...prev, current_page: newPage }));
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setTaskData({
      projectId: "",
      taskName: "",
      taskAmount: "",
      description: "",
    });
  };

  const handleAddTask = () => {
    setModalType("add");
    setTaskData({
      taskName: "",
      description: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveTaskDetails = async () => {
    try {
      setDisabled(true);
      const result = await axios.post(
        `${links.BASE_URL}projects/tasks`,
        {
          taskName: taskData.taskName,
          amount: taskData.amount,
          status: taskData.status,
          description: taskData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Task saved successfully");
      setModalType(null);
      setTaskData({
        taskName: "",
        amount: "",
        status: "",
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

  const handleView = async (idx) => {
    const task = tasks[idx];
    setTaskData({
      taskName: task.taskName,
      description: task.description || "N/A",
      amount: task.amount || "N/A",
      status: task.status || "N/A",
    });
    setModalType("view");
  };

  const handleEdit = (idx) => {
    const task = tasks[idx];
    setTaskData({
      description: task.description || "",
      taskName: task.taskName || "",
      amount: task.amount || "",
      status: task.status || "",
      id: task._id || "",
    });
    setModalType("edit");
  };

  const updateTaskDetails = async () => {
    try {
      setDisabled(true);
      const result = await axios.put(
        `${links.BASE_URL}projects/tasks/${taskData.id}`,
        {
          taskName: taskData.taskName,
          amount: taskData.amount,
          status: taskData.status,
          description: taskData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Task updated successfully");
      setModalType(null);
      setTaskData({
        taskName: "",
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
        toast.error("Failed to update task details");
      }
    }
  };

  const handleDelete = async (taskId) => {
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
            `${links.BASE_URL}projects/tasks/${taskId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );
          toast.success("Task deleted successfully");
          setTasks((prev) => prev.filter((task) => task._id !== taskId));
        } catch (err) {
          const response = err.response.data;
          if (response && response.message) {
            toast.error(response.message);
          } else {
            toast.error("Failed to delete task");
          }
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 bg-light">
          <Topbar />
          <div className="p-4 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 bg-light">
          <Topbar />
          <div className="p-4 text-center text-danger">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 bg-light">
        <Topbar />
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold text-dark">Task Management</h3>
            <Button title="Add Task" onClick={handleAddTask} variant="primary">
              Add Task
            </Button>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered align-middle text-center table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Task Name</th>
                  <th>Task Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length > 0 ? (
                  tasks.map((task, idx) => (
                    <tr key={task._id}>
                      <td>{task.taskName}</td>
                      <td>
                        {task.amount ? (
                          <span className="text-success fw-semibold">
                            ${task.amount.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td>
                        {task.status === "active" ? (
                          <span className="badge bg-success">Active</span>
                        ) : (
                          <span className="badge bg-danger">Blocked</span>
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
                        <i
                          className="bi bi-trash text-danger fs-5 ms-3"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDelete(task._id)}
                          title="Delete Project"
                        ></i>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.total_page > 1 && (
            <nav aria-label="Page navigation">
              <ul className="pagination justify-content-center">
                <li
                  className={`page-item ${
                    pagination.current_page === 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      handlePageChange(pagination.current_page - 1)
                    }
                  >
                    Previous
                  </button>
                </li>

                {Array.from(
                  { length: pagination.total_page },
                  (_, i) => i + 1
                ).map((page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      page === pagination.current_page ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${
                    pagination.current_page === pagination.total_page
                      ? "disabled"
                      : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      handlePageChange(pagination.current_page + 1)
                    }
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}

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
                        ? "Add Task"
                        : modalType === "view"
                        ? "View Task"
                        : "Edit Task"}
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
                            <label className="form-label">Task Name</label>
                            <input
                              type="text"
                              name="taskName"
                              className="form-control"
                              onChange={handleChange}
                              placeholder="Enter task name"
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Task Amount</label>
                            <input
                              type="number"
                              name="amount"
                              className="form-control"
                              onChange={handleChange}
                              placeholder="Enter task amount"
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">
                              Task Description
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
                            <div className="fw-semibold w-25">
                              📝 Task Name:
                            </div>
                            <div className="text-muted">
                              {taskData?.taskName || "N/A"}
                            </div>
                          </div>
                          <div className="mb-3 d-flex">
                            <div className="fw-semibold w-25">💰 Amount:</div>
                            <div className="text-muted">
                              $
                              {taskData?.amount
                                ? taskData.amount.toFixed(2)
                                : "N/A"}
                            </div>
                          </div>
                          <div className="mb-3 d-flex">
                            <div className="fw-semibold w-25">📊 Status:</div>
                            <div className="text-muted">
                              {taskData.status === "active" ? (
                                <span className="badge bg-success">Active</span>
                              ) : (
                                <span className="badge bg-danger">Blocked</span>
                              )}
                            </div>
                          </div>
                          <div className="mb-3 d-flex">
                            <div className="fw-semibold w-25">
                              📖 Description:
                            </div>
                            <div className="text-muted">
                              {taskData?.description || "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <form>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Task Name</label>
                              <input
                                type="text"
                                name="taskName"
                                className="form-control"
                                value={taskData.taskName}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Task Amount</label>
                              <input
                                type="number"
                                name="amount"
                                className="form-control"
                                value={taskData.amount}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="mb-3">
                              <label
                                htmlFor="TaskDescription"
                                className="form-label"
                              >
                                Task Description
                              </label>
                              <textarea
                                id="TaskDescription"
                                name="description"
                                className="form-control"
                                onChange={handleChange}
                                value={taskData.description}
                              ></textarea>
                            </div>

                            <div className="mb-3">
                              <label className="form-label">Status</label>
                              <select
                                name="status"
                                className="form-select"
                                value={taskData.status}
                                onChange={handleChange}
                              >
                                <option value="">Select Status</option>
                                <option value="active">Active</option>
                                <option value="blocked">Blocked</option>
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
                        onClick={saveTaskDetails}
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
        </div>
      </div>
    </div>
  );
}

export default Task;
