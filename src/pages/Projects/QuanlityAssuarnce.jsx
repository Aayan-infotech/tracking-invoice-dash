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

function QualityAssurance() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [document, setDocument] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_page: 1,
    per_page: 10,
    total_records: 0,
  });
  const [modalType, setModalType] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [selectedDocIndex, setSelectedDocIndex] = useState(null);
  const [formData, setFormData] = useState({
    projectId: "",
    documentTypeId: "",
    documentFile: null,
  });
  const [documentTypes, setDocumentTypes] = useState([]);

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

  const fetchDocumentTypes = async () => {
    try {
      const response = await fetchWithAuth(
        `${links.BASE_URL}projects/get-document-type-dropdown`,
        {
          method: "GET",
        }
      );
      if (response?.data?.data) {
        setDocumentTypes(response.data.data);
      } else {
        setDocumentTypes([]);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to fetch document types"
      );
    }
  };

  const fetchDocument = async () => {
    try {
      const response = await fetchWithAuth(
        `${links.BASE_URL}projects/quality-assurance`,
        {
          method: "GET",
        }
      );
      setLoading(false);
      setDocument(
        response?.data?.data?.qualityAssurances
          ? response.data.data.qualityAssurances
          : []
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch documents");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projects.length === 0) {
      fetchProjects();
    }
    if (documentTypes.length === 0) {
      fetchDocumentTypes();
    }
    fetchDocument();
  }, []);

  const handleAddDoc = () => {
    setModalType("add");
    setFormData({
      projectId: "",
      documentTypeId: "",
      documentDescription: "",
    });
  };

  const handleView = (index) => {
    const selectedDoc = document[index];
    setSelectedDocIndex(index);
    setFormData({
      projectId: selectedDoc.projectId || "",
      projectName: selectedDoc.projectName || "",
      documentName: selectedDoc.documentName || "",
      documentFile: selectedDoc.documentFile || null,
      status: selectedDoc.status || false,
      _id: selectedDoc._id || "",
    });
    setModalType("view");
  };

  const handleEdit = (index) => {
    const selectedDoc = document[index];
    setSelectedDocIndex(index);
    setFormData({
      projectId: selectedDoc.projectId || "",
      projectName: selectedDoc.projectName || "",
      documentTypeId: selectedDoc.documentTypeId || "",
      documentFile: null,
      status: selectedDoc.status || false,
      _id: selectedDoc._id || "",
    });
    setModalType("edit");
  };

  const handleDelete = async (documentId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(
          `${links.BASE_URL}projects/quality-assurance/${documentId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (response.status === 200) {
          toast.success("Document deleted successfully");
          fetchDocument();
          Swal.fire("Deleted!", "Your document has been deleted.", "success");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete document");
      Swal.fire("Error!", "Failed to delete the document.", "error");
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setDisabled(false);
    setSelectedDocIndex(null);
    setFormData({
      projectId: "",
      documentName: "",
      documentDescription: "",
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        documentFile: file,
      }));
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.total_page) {
      setPagination((prev) => ({ ...prev, current_page: newPage }));
    }
  };

  const saveDocument = async () => {
    if (!formData.projectId || !formData.documentTypeId) {
      if (!formData.projectId) {
        toast.error("Please select a project.");
      } else if (!formData.documentTypeId) {
        toast.error("Please select a document type.");
      }
      return;
    }
    setDisabled(true);
    const data = {
      projectId: formData.projectId,
      documentTypeId: formData.documentTypeId,
      documentFile: formData.documentFile,
    };
    try {
      const formData = new FormData();
      formData.append("projectId", data.projectId);
      formData.append("documentTypeId", data.documentTypeId);
      formData.append("documentFile", data.documentFile);

      const response = await axios.post(
        `${links.BASE_URL}projects/quality-assurance`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Document saved successfully");
      fetchDocument();
      handleCloseModal();
      setDisabled(false);
    } catch (err) {
      setDisabled(false);
      toast.error(err.response?.data?.message || "Failed to save document");
      return;
    }
  };

  const updateDocument = async () => {
    if (!formData.projectId || !formData.documentTypeId) {
      if (!formData.projectId) {
        toast.error("Please select a project.");
      } else if (!formData.documentTypeId) {
        toast.error("Please Select a document type.");
      }
      return;
    }

    setDisabled(true);
    const data = {
      projectId: formData.projectId,
      documentTypeId: formData.documentTypeId,
      documentFile: formData.documentFile,
    };

    const updatedFormData = new FormData();
    updatedFormData.append("projectId", data.projectId);
    updatedFormData.append("documentTypeId", data.documentTypeId);
    if (data.documentFile) {
      updatedFormData.append("documentFile", data.documentFile);
    }

    try {
      const response = await axios.put(
        `${links.BASE_URL}projects/quality-assurance/${formData._id}`,
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Document updated successfully");
      fetchDocument();
      handleCloseModal();
      setDisabled(false);
    } catch (err) {
      setDisabled(false);
      toast.error(err.response?.data?.message || "Failed to update document");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark">Quality Assurance</h3>
        <Button title="Add Document" onClick={handleAddDoc} variant="primary">
          Add Doc
        </Button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered align-middle text-center table-striped">
          <thead className="table-dark">
            <tr>
              <th>Project Name</th>
              <th>Document Name</th>
              <th>Document File</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {document.length > 0 ? (
              document.map((doc, idx) => (
                <tr key={doc._id}>
                  <td>{doc.projectName || "N/A"}</td>
                  <td>{doc.documentName || "N/A"}</td>
                  <td>
                    {doc.documentFile ? (
                      <a
                        href={`${doc.documentFile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Document
                      </a>
                    ) : (
                      "No Document"
                    )}
                  </td>
                  <td>
                    {doc.status ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-warning">Pending</span>
                    )}
                  </td>
                  <td>
                    <i
                      className="bi bi-eye text-primary fs-5 me-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleView(idx)}
                      title="View Document"
                    ></i>
                    <i
                      className="bi bi-pencil text-warning fs-5"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEdit(idx)}
                      title="Edit Document"
                    ></i>
                    <i
                      className="bi bi-trash text-danger fs-5 ms-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(doc._id)}
                      title="Delete Document"
                    ></i>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No documents found.
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
                    ? "Add Quality Assurance Document"
                    : modalType === "view"
                    ? "View Quality Assurance Document"
                    : "Edit Quality Assurance Document"}
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
                          Select Project *
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
                        <label htmlFor="documentName" className="form-label">
                          Select Document Type *
                        </label>
                        <select
                          name="documentTypeId"
                          className="form-select form-control"
                          id="documentTypeId"
                          value={formData.documentTypeId}
                          onChange={handleChange}
                        >
                          <option value="">Select Document Type</option>
                          {documentTypes.length > 0 &&
                            documentTypes.map((docType) => (
                              <option value={docType._id} key={docType._id}>
                                {docType.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="formFile" className="form-label">
                          Upload Document *
                        </label>
                        <input
                          className="form-control"
                          type="file"
                          accept="application/pdf"
                          id="formFile"
                          name="documentFile"
                          onChange={handleFileChange}
                        />
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
                        <div className="fw-semibold w-25">
                          📝 Document Name:
                        </div>
                        <div className="text-muted">
                          {formData?.documentName || "N/A"}
                        </div>
                      </div>
                      <div className="mb-3 d-flex">
                        <div className="fw-semibold w-25">📊 Status:</div>
                        <div className="text-muted">
                          {formData?.status ? (
                            <span className="badge bg-success">Active</span>
                          ) : (
                            <span className="badge bg-warning">Pending</span>
                          )}
                        </div>
                      </div>
                      {/* <div className="mb-3">
                            <div className="fw-semibold mb-2">
                              📄 Description:
                            </div>
                            <div
                              className="border p-3 rounded bg-light"
                              style={{ minHeight: "100px" }}
                              dangerouslySetInnerHTML={{
                                __html:
                                  formData?.documentDescription ||
                                  "No description available",
                              }}
                            />
                          </div> */}
                      <div className="mb-3 d-flex">
                        <div className="fw-semibold w-25">
                          📂 Document File:
                        </div>
                        <div className="text-muted">
                          {formData?.documentFile ? (
                            <a
                              href={`${formData.documentFile}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Document
                            </a>
                          ) : (
                            "No Document"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Edit Mode
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label htmlFor="Project" className="form-label">
                          Select Project *
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
                        <label htmlFor="documentName" className="form-label">
                          Select Document Type *
                        </label>
                        <select
                          name="documentTypeId"
                          className="form-select form-control"
                          id="documentTypeId"
                          value={formData.documentTypeId}
                          onChange={handleChange}
                        >
                          <option value="">Select Document Type</option>
                          {documentTypes.length > 0 &&
                            documentTypes.map((docType) => (
                              <option value={docType._id} key={docType._id}>
                                {docType.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* <div className="mb-3">
                            <label
                              htmlFor="documentDescription"
                              className="form-label"
                            >
                              Document Description
                            </label>
                            <div className="text-editor-container mb-5">
                              <Editor
                                name="documentDescription"
                                value={formData.documentDescription}
                                onChange={handleChange}
                                placeholder="Enter document description..."
                              />
                            </div>
                          </div> */}
                      <div className="mb-3">
                        <label htmlFor="formFile" className="form-label">
                          Upload Document *
                        </label>
                        <input
                          className="form-control"
                          type="file"
                          accept="application/pdf"
                          id="formFile"
                          name="documentFile"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  </div>
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
                    onClick={saveDocument}
                    disabled={disabled}
                  >
                    {disabled ? "Saving..." : "Save"}
                  </Button>
                ) : modalType === "edit" ? (
                  <Button
                    variant="primary"
                    onClick={updateDocument}
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

export default QualityAssurance;
