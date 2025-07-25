import { useState, useEffect } from "react";
import "./Users.css";
import axios from "axios";
import { fetchWithAuth } from "../../utils/authFetch";
import { toast } from "react-toastify";
import { images, links } from "../../contstants";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading/Loading";
import { useSelector } from "react-redux";

const Users = () => {
  const userState = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    username: "",
    password: "",
    profile_image: "",
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_page: 1,
    per_page: 10,
    total_records: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.current_page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(
        `${links.BASE_URL}users/get-all-users`,
        {
          method: "GET",
          params: {
            page: pagination.current_page,
            limit: pagination.per_page,
          },
        }
      );

      setUsers(response.data.data.users);
      setPagination({
        current_page: response.data.data.current_page,
        total_page: response.data.data.total_page,
        per_page: response.data.data.per_page,
        total_records: response.data.data.total_records,
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
      setLoading(false);
      toast.error("Failed to fetch users");
    }
  };

  const handleView = (index) => {
    setSelectedUserIndex(index);
    setFormData({
      name: users[index].name,
      email: users[index].email,
      mobile: users[index].mobile,
      address: users[index].address,
      username: users[index].username,
      password: "",
      profile_image: users[index].profile_image || images.placeholder,
    });
    setModalType("view");
  };

  const handleEdit = (index) => {
    setSelectedUserIndex(index);
    setFormData({
      name: users[index].name,
      email: users[index].email,
      mobile: users[index].mobile,
      address: users[index].address,
      username: users[index].username,
      password: "",
      profile_image: users[index].profile_image || images.placeholder,
    });
    setModalType("edit");
  };

  const handleCloseModal = () => {
    setSelectedUserIndex(null);
    setModalType(null);
    setFormData({
      name: "",
      email: "",
      mobile: "",
      address: "",
      username: "",
      password: "",
      profile_image: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userId = users[selectedUserIndex].userId;
      await axios
        .put(`${links.BASE_URL}users/update-user-detail/${userId}`, formData, {
          headers: {
            Authorization: `Bearer ${userState.userInfo.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            const updatedUser = response?.data?.data;
            const updatedUsers = [...users];
            updatedUsers[selectedUserIndex] = updatedUser;
            setUsers(updatedUsers);
            setLoading(false);
            handleCloseModal();
            toast.success("User updated successfully!");
          } else {
            toast.error("Failed to update user");
          }
        })
        .catch((error) => {
          setLoading(false);
          error?.response?.data?.message
            ? toast.error(error.response.data.message)
            : toast.error("Failed to update user");
        });
    } catch (err) {
      setLoading(false);
      toast.error("Failed to update user");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <h3 className="mb-4 fw-bold text-dark">👥 User Management</h3>

      <div className="table-responsive">
        <table className="table table-bordered align-middle text-center table-striped">
          <thead className="table-dark">
            <tr>
              <th>Avatar & Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Email Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, idx) => (
                <tr key={user._id}>
                  <td className="d-flex align-items-center gap-2 justify-content-start">
                    <img
                      src={user.profile_image || images.placeholder}
                      alt="avatar"
                      className="rounded-circle"
                      width="40"
                      height="40"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = images.placeholder;
                      }}
                    />
                    <span>{user.name}</span>
                  </td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td className="text-success">{user.mobile}</td>
                  <td>
                    {user.isVerified ? (
                      <span className="badge bg-success">verified</span>
                    ) : (
                      <span className="badge bg-danger">unverified</span>
                    )}
                  </td>
                  <td>
                    <i
                      className="bi bi-eye text-primary fs-5 me-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleView(idx)}
                      title="View User"
                    ></i>
                    <i
                      className="bi bi-pencil text-warning fs-5"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEdit(idx)}
                      title="Edit User"
                    ></i>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No users found
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
                  {modalType === "view" ? "👁️ View User" : "✏️ Edit User"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                {modalType === "view" ? (
                  <div className="row">
                    <div className="col-md-4 text-center">
                      <img
                        src={formData.profile_image || images.placeholder}
                        alt="profile"
                        className="img-fluid rounded-circle mb-3"
                        style={{
                          width: "200px",
                          height: "200px",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = images.placeholder;
                        }}
                      />
                    </div>
                    <div className="col-md-8">
                      <p>
                        <strong>Name:</strong> {formData.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {formData.email}
                      </p>
                      <p>
                        <strong>Mobile:</strong> {formData.mobile}
                      </p>
                      <p>
                        <strong>Gender:</strong> {formData.gender}
                      </p>
                      <p>
                        <strong>Country:</strong> {formData.country}
                      </p>
                      <p>
                        <strong>State:</strong> {formData.state}
                      </p>
                      <p>
                        <strong>City:</strong> {formData.city}
                      </p>
                      <p>
                        <strong>About Me:</strong> {formData.aboutMe}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Mobile</label>
                          <input
                            type="text"
                            name="mobile"
                            className="form-control"
                            value={formData.mobile}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Username</label>
                          <input
                            type="text"
                            name="username"
                            className="form-control"
                            value={formData.username}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Password</label>
                          <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Address</label>
                          <input
                            type="text"
                            name="address"
                            className="form-control"
                            value={formData.address}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Profile Image URL
                          </label>
                          <input
                            type="file"
                            name="profile_image"
                            className="form-control"
                            onChange={handleChange}
                          />
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
                {modalType === "edit" && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
