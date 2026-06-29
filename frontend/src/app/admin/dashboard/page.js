"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../services/api";
import toast from "react-hot-toast";
import "./dashboard.css";

export default function AdminDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalApplications: 0,
    totalAthletes: 0,
    totalCoaches: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingApplicationId, setRejectingApplicationId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchApplications = async (pageNum = 1) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await api.get("/admin/applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search,
          role: roleFilter,
          status: statusFilter,
          page: pageNum,
          limit: 10,
        },
      });

      if (response.data.success) {
        setApplications(response.data.data);
        setTotalPages(response.data.pagination.pages);
        setPage(pageNum);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
      } else {
        toast.error("Failed to fetch applications");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/admin/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setAnalytics(response.data.analytics);
      }
    } catch (error) {
      console.error("Analytics error:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchAnalytics();
    fetchApplications(1);
  }, []);

  useEffect(() => {
    fetchApplications(1);
  }, [search, roleFilter, statusFilter]);

  const handleApprove = async (id) => {
    if (window.confirm("Are you sure you want to approve this application?")) {
      try {
        const token = localStorage.getItem("token");

        await api.patch(
          `/admin/application/${id}/status`,
          { status: "Approved" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Application approved!");
        fetchApplications(page);
        fetchAnalytics();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to approve");
      }
    }
  };

  const handleRejectClick = (id) => {
    setRejectingApplicationId(id);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/admin/application/${rejectingApplicationId}/status`,
        {
          status: "Rejected",
          rejectionReason: rejectionReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Application rejected!");
      setShowRejectModal(false);
      setRejectingApplicationId(null);
      setRejectionReason("");
      fetchApplications(page);
      fetchAnalytics();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        const token = localStorage.getItem("token");

        await api.delete(`/admin/application/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Application deleted!");
        fetchApplications(page);
        fetchAnalytics();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete");
      }
    }
  };

  const handleViewProfile = (id) => {
    router.push(`/admin/application/${id}`);
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/admin/applications/export", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
        params: {
          role: roleFilter,
          status: statusFilter,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "applications.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentChild.removeChild(link);

      toast.success("Exported successfully!");
    } catch (error) {
      toast.error("Export failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="analytics-section">
        <div className="analytics-card">
          <div className="card-label">Total Applications</div>
          <div className="card-value">{analytics.totalApplications}</div>
        </div>
        <div className="analytics-card">
          <div className="card-label">Athletes</div>
          <div className="card-value">{analytics.totalAthletes}</div>
        </div>
        <div className="analytics-card">
          <div className="card-label">Coaches</div>
          <div className="card-value">{analytics.totalCoaches}</div>
        </div>
        <div className="analytics-card status-pending">
          <div className="card-label">Pending</div>
          <div className="card-value">{analytics.pending}</div>
        </div>
        <div className="analytics-card status-approved">
          <div className="card-label">Approved</div>
          <div className="card-value">{analytics.approved}</div>
        </div>
        <div className="analytics-card status-rejected">
          <div className="card-label">Rejected</div>
          <div className="card-value">{analytics.rejected}</div>
        </div>
      </div>

      <div className="filter-section">
        <input
          type="text"
          placeholder="Search by name, email, or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Roles</option>
          <option value="Athlete">Athlete</option>
          <option value="Coach">Coach</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <button className="export-btn" onClick={handleExport}>
          📥 Export Excel
        </button>
      </div>

      <div className="table-section">
        {isLoading ? (
          <div className="loading">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="no-data">No applications found</div>
        ) : (
          <>
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Registered Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.name}</td>
                    <td>{app.email}</td>
                    <td>{app.mobile}</td>
                    <td>
                      <span className={`role-badge role-${app.role.toLowerCase()}`}>
                        {app.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${app.status.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button
                        className="action-btn view-btn"
                        onClick={() => handleViewProfile(app.id)}
                      >
                        View
                      </button>
                      {app.status !== "Approved" && (
                        <button
                          className="action-btn approve-btn"
                          onClick={() => handleApprove(app.id)}
                        >
                          Approve
                        </button>
                      )}
                      {app.status !== "Rejected" && (
                        <button
                          className="action-btn reject-btn"
                          onClick={() => handleRejectClick(app.id)}
                        >
                          Reject
                        </button>
                      )}
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(app.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button
                onClick={() => fetchApplications(page - 1)}
                disabled={page <= 1}
                className="pagination-btn"
              >
                ← Previous
              </button>
              <span className="page-info">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => fetchApplications(page + 1)}
                disabled={page >= totalPages}
                className="pagination-btn"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>

      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Reject Application</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowRejectModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-description">
                Please provide a clear reason for rejecting this application. This will be shown to the applicant.
              </p>

              <div className="form-group">
                <label className="form-label">Rejection Reason *</label>
                <textarea
                  className="form-textarea"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter the reason for rejection..."
                  rows="5"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="modal-btn cancel-btn"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-btn submit-btn"
                onClick={handleRejectSubmit}
              >
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
