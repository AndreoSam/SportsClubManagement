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
  const [athletes, setAthletes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
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
        api.get("/athletes"),
        api.get("/athletes/analytics/summary"),
      ]);

      const athletesData = athletesRes.data.data || athletesRes.data || [];
      setAthletes(athletesData);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.patch(`/athletes/${id}/status`, { status });

      setAthletes((prevAthletes) =>
        prevAthletes.map((athlete) =>
          athlete._id === id ? { ...athlete, status } : athlete,
        ),
      );

      const statsRes = await api.get("/athletes/analytics/summary");
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
      console.error("Status update failed", err);
      await fetchData();
    } finally {
      setUpdatingId(null);
    }
  };

  const exportExcel = () => {
    if (!athletes.length) {
      alert("No data to export");
      return;
    }

    const formattedData = athletes.map((a) => ({
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
            <button onClick={fetchData} className="icon-btn" disabled={loading}>
              {loading ? "⏳" : "🔄"}
            </button>
            <button onClick={exportExcel} className="btn btn-success">
              📊 Export
            </button>
            <button onClick={handleLogout} className="btn btn-danger">
              🚪 Logout
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
              <span className="table-count">{athletes.length} total</span>
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
                  ) : athletes.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        <div className="empty-icon">📋</div>
                        <p>No athletes found</p>
                      </td>
                    </tr>
                  ) : (
                    athletes.map((a) => (
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
                            <button
                              onClick={() =>
                                router.push(`/admin/athlete/${a._id}`)
                              }
                              className="action-btn view-btn"
                            >
                              👁️
                            </button>
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
                                onClick={() => updateStatus(a._id, "Rejected")}
                                disabled={updatingId === a._id}
                                className="action-btn reject-btn"
                              >
                                {updatingId === a._id ? "..." : "Reject"}
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
          </div>
        </div>
      </main>
    </div>
  );
}
