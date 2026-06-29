"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./dashboard.css";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{payload[0].name}</p>
        <p className="tooltip-value">{payload[0].value} athletes</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [allAthletes, setAllAthletes] = useState([]);
  const [filteredAthletes, setFilteredAthletes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedAthleteId, setSelectedAthleteId] = useState(null);
  const [review, setReview] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [chartData, setChartData] = useState([
    { name: "Pending", value: 0 },
    { name: "Approved", value: 0 },
    { name: "Rejected", value: 0 },
  ]);
  const router = useRouter();

  const COLORS = ["#facc15", "#22c55e", "#ef4444"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [athletesRes, statsRes] = await Promise.all([
        api.get("/athletes", { params: { limit: 10000 } }),
        api.get("/athletes/analytics/summary"),
      ]);

      const athletesData = athletesRes.data.data || athletesRes.data || [];
      setAllAthletes(athletesData);
      setFilteredAthletes(athletesData);

      const statsData = statsRes.data.data || statsRes.data;
      const newStats = {
        pending: statsData.pending || 0,
        approved: statsData.approved || 0,
        rejected: statsData.rejected || 0,
      };
      setStats(newStats);

      setChartData([
        { name: "Pending", value: newStats.pending },
        { name: "Approved", value: newStats.approved },
        { name: "Rejected", value: newStats.rejected },
      ]);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const filtered = allAthletes.filter((athlete) => {
      const matchesSearch =
        athlete.personal?.fullName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        athlete.personal?.mobile
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        athlete.personal?.email
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "All" || athlete.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

    setFilteredAthletes(filtered);
    setCurrentPage(1);
  }, [searchQuery, filterStatus, allAthletes]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  const totalPages = Math.ceil(filteredAthletes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAthletes = filteredAthletes.slice(startIndex, endIndex);

  const updateStatus = async (id, status, reviewText = "") => {
    setUpdatingId(id);

    try {
      await api.patch(`/athletes/${id}/status`, {
        status,
        review: reviewText,
      });

      setAllAthletes((prev) =>
        prev.map((athlete) =>
          athlete._id === id ? { ...athlete, status } : athlete,
        ),
      );

      setShowRejectModal(false);
      setSelectedAthleteId(null);
      setReview("");
    } catch (err) {
      console.error("Status update failed", err);

      alert(err.response?.data?.message || "Failed to update athlete status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const exportExcel = () => {
    if (!filteredAthletes.length) {
      alert("No data to export");
      return;
    }

    const formattedData = filteredAthletes.map((a) => ({
      Name: a.personal?.fullName || "",
      Mobile: a.personal?.mobile || "",
      Email: a.personal?.email || "",
      Gender: a.personal?.gender || "",
      Age: a.personal?.age || "",
      GuardianName: a.guardian?.guardianName || "",
      GuardianMobile: a.guardian?.mobile || "",
      Address: a.address?.address || "",
      State: a.address?.state || "",
      District: a.address?.district || "",
      PinCode: a.address?.pinCode || "",
      Club: a.club?.clubName || "",
      Coach: a.club?.coachName || "",
      Competition: a.competition?.competitionName || "",
      AgeGroup: a.competition?.ageGroup || "",
      Event: a.competition?.event || "",
      Status: a.status || "",
      CreatedAt: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "",
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const colWidths = Object.keys(formattedData[0] || {}).map((key) => ({
      wch: Math.max(
        key.length,
        ...formattedData.map((row) =>
          row[key] ? row[key].toString().length : 10,
        ),
      ),
    }));
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Athletes");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `athletes_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-icon">🏃</div>
            <div>
              <h1 className="title">Athlete Dashboard</h1>
              <p className="subtitle">Manage and monitor all athletes</p>
            </div>
          </div>
          <div className="header-right">
            <button
              onClick={fetchData}
              className="header-btn refresh-btn"
              disabled={loading}
              title="Refresh data"
            >
              <span className={`refresh-icon ${loading ? "spinning" : ""}`}>
                ↻
              </span>
              <span className="btn-text">
                {loading ? "Refreshing" : "Refresh"}
              </span>
            </button>
            <button
              onClick={exportExcel}
              className="header-btn export-btn"
              title="Export to Excel"
            >
              <span className="btn-icon">📊</span>
              <span className="btn-text">Export</span>
            </button>
            <button
              onClick={handleLogout}
              className="header-btn logout-btn"
              title="Logout"
            >
              <span className="btn-icon">🚪</span>
              <span className="btn-text">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="stats-grid">
          <div className="stat-card stat-card-pending">
            <div className="stat-card-content">
              <div>
                <p className="stat-label">Pending Applications</p>
                <p className="stat-value stat-value-pending">
                  {stats?.pending || 0}
                </p>
              </div>
              <div className="stat-icon stat-icon-pending">⏳</div>
            </div>
          </div>
          <div className="stat-card stat-card-approved">
            <div className="stat-card-content">
              <div>
                <p className="stat-label">Approved Athletes</p>
                <p className="stat-value stat-value-approved">
                  {stats?.approved || 0}
                </p>
              </div>
              <div className="stat-icon stat-icon-approved">✅</div>
            </div>
          </div>
          <div className="stat-card stat-card-rejected">
            <div className="stat-card-content">
              <div>
                <p className="stat-label">Rejected Applications</p>
                <p className="stat-value stat-value-rejected">
                  {stats?.rejected || 0}
                </p>
              </div>
              <div className="stat-icon stat-icon-rejected">❌</div>
            </div>
          </div>
        </div>

        <div className="bottom-section">
          <div className="chart-card">
            <h3 className="section-title">Status Distribution</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={true}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="pie-cell"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="table-card">
            <div className="table-header">
              <h3 className="section-title">Athletes List</h3>
              <span className="table-count">
                {filteredAthletes.length} of {allAthletes.length} total
              </span>
            </div>

            <div className="table-controls">
              <div className="search-wrapper">
                <input
                  type="text"
                  placeholder="🔍 Search by name, mobile, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="filter-wrapper">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Age</th>
                    <th>Competition</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        <div className="spinner"></div>
                        <p>Loading...</p>
                      </td>
                    </tr>
                  ) : paginatedAthletes.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        <div className="empty-icon">📋</div>
                        <p>
                          {searchQuery || filterStatus !== "All"
                            ? "No athletes match your filters"
                            : "No athletes found"}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedAthletes.map((a) => (
                      <tr
                        key={a._id}
                        className="table-row"
                        onClick={() => router.push(`/admin/athlete/${a._id}`)}
                      >
                        <td>
                          <div className="name-cell">
                            <div className="avatar">
                              {a.personal?.fullName?.charAt(0) || "?"}
                            </div>
                            <span>{a.personal?.fullName || "N/A"}</span>
                          </div>
                        </td>
                        <td>{a.personal?.mobile || "N/A"}</td>
                        <td>{a.personal?.age || "N/A"}</td>
                        <td>{a.competition?.competitionName || "N/A"}</td>
                        <td>
                          <span
                            className={`badge badge-${a.status?.toLowerCase() || "pending"}`}
                          >
                            {a.status === "Approved"
                              ? "✅"
                              : a.status === "Rejected"
                                ? "❌"
                                : "⏳"}{" "}
                            {a.status || "Pending"}
                          </span>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="action-buttons">
                            {a.status !== "Approved" && (
                              <button
                                onClick={() => updateStatus(a._id, "Approved")}
                                disabled={updatingId === a._id}
                                className="action-btn approve-btn"
                              >
                                {updatingId === a._id ? "..." : "Approve"}
                              </button>
                            )}
                            {a.status !== "Rejected" && (
                              <button
                                onClick={() => {
                                  setSelectedAthleteId(a._id);
                                  setShowRejectModal(true);
                                }}
                                className="action-btn reject-btn"
                              >
                                Reject
                              </button>
                            )}
                            {a.status !== "Pending" && (
                              <button
                                onClick={() => updateStatus(a._id, "Pending")}
                                disabled={updatingId === a._id}
                                className="action-btn reset-btn"
                              >
                                {updatingId === a._id ? "..." : "Reset"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {filteredAthletes.length > 0 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  ← Previous
                </button>
                <div className="pagination-info">
                  Page {currentPage} of {totalPages} • Showing{" "}
                  {Math.min(itemsPerPage, filteredAthletes.length - startIndex)}{" "}
                  of {filteredAthletes.length}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Reject Athlete</h2>

            <p>Please provide a reason for rejecting this athlete.</p>

            <textarea
              rows={5}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Enter rejection reason..."
            />

            <div className="modal-actions">
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (!review.trim()) {
                    alert("Rejection reason is required.");
                    return;
                  }

                  updateStatus(selectedAthleteId, "Rejected", review);
                }}
              >
                Reject Athlete
              </button>

              <button
                className="btn"
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedAthleteId(null);
                  setReview("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
