import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import { fetchWithAuth } from "../../utils/authFetch";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";
import Button from "react-bootstrap/Button";
import axios from "axios";

import { links } from "../../contstants";
import Loading from "../../components/Loading/Loading";

function ProjectInvoices() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_page: 1,
    per_page: 10,
    total_records: 0,
  });
  const [modalType, setModalType] = useState(null);
  const [formData, setFormData] = useState({
    invoiceId: "",
    status: "",
  });
  const [disabled, setDisabled] = useState(false);

  const fetchProjectInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(
        `${links.BASE_URL}projects/invoice`,
        {
          method: "GET",
          params: {
            page: pagination.current_page,
            limit: pagination.per_page,
          },
        }
      );

      setInvoices(
        response?.data?.data?.invoices ? response.data.data.invoices : []
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
    fetchProjectInvoices();
  }, [pagination.current_page]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.total_page) {
      setPagination((prev) => ({ ...prev, current_page: newPage }));
    }
  };

  const handleEdit = (idx) => {
    const invoice = invoices[idx];
    setFormData({
      invoiceId: invoice._id,
      status: invoice.status,
    });
    setModalType("edit");
  };

  const handleCloseModal = () => {
    setModalType(null);
    setFormData({
      invoiceId: "",
      status: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "documentType") {
      setDocumentType(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateInvoiceStatus = async () => {
    try {
      setDisabled(true);
      const result = await axios.put(
        `${links.BASE_URL}projects/update-invoice`,
        {
          invoiceId: formData.invoiceId,
          status: formData.status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Invoice updated successfully");
      setModalType(null);
      setFormData({
        invoiceId: "",
        status: "",
      });
      setDisabled(false);
      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice._id === result.data.data._id ? result.data.data : invoice
        )
      );
    } catch (err) {
      const response = err?.response?.data;
      setLoading(false);
      setDisabled(false);
      if (response && response.message) {
        toast.error(response.message);
      } else {
        toast.error("Failed to update invoice details");
      }
    }
  };

    if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark">Invoice Management</h3>
        {/* <Button
              title="Add Project"
              onClick={handleAddProject}
              variant="primary"
            >
              Add Project
            </Button> */}
      </div>

      <div className="table-responsive">
        <table className="table table-bordered align-middle text-center table-striped">
          <thead className="table-dark">
            <tr>
              <th>Project Name</th>
              <th>Invoice Number</th>
              <th>Invoice</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 ? (
              invoices.map((invoice, idx) => (
                <tr key={invoice._id}>
                  <td>{invoice.projectName}</td>
                  <td>{invoice.invoiceNumber}</td>
                  <td>
                    <a
                      href={invoice.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Invoice
                    </a>
                  </td>
                  <td>
                    {invoice.status === "paid" ? (
                      <span className="badge bg-success">Paid</span>
                    ) : invoice.status === "unpaid" ? (
                      <span className="badge bg-danger">Unpaid</span>
                    ) : invoice.status === "draft" ? (
                      <span className="badge bg-warning">Draft</span>
                    ) : (
                      <span className="badge bg-secondary">Pending</span>
                    )}
                  </td>
                  <td>
                    <i
                      className="bi bi-pencil text-warning fs-5"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEdit(idx)}
                      title="Edit Invoice"
                    ></i>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No invoices found
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
                  {modalType === "edit" ? "Update Invoice Status" : ""}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                {modalType === "edit" ? (
                  // Edit Mode
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label htmlFor="InvoiceStatus">Invoice Status</label>
                        <select
                          className="form-select"
                          id="InvoiceStatus"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="">Select Status</option>
                          <option value="paid">Paid</option>
                          <option value="unpaid">Unpaid</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
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
                {modalType === "edit" ? (
                  <Button
                    variant="primary"
                    onClick={updateInvoiceStatus}
                    disabled={disabled}
                  >
                    {disabled ? "Updating..." : "Update"}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectInvoices;
