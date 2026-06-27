"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import "./AthleteDetail.css";

export default function AthleteDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAthlete = async () => {
      try {
        const res = await api.get(`/athletes/${id}`);
        setAthlete(res.data.data || res.data);
        setError("");
      } catch (err) {
        console.error("Failed to load athlete", err);
        setError(
          err?.response?.data?.message || "Failed to load athlete details",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadAthlete();
    }
  }, [id]);

  const getStatusBadge = (status) => {
    const statusMap = {
      Approved: { class: "status-approved", icon: "✅" },
      Rejected: { class: "status-rejected", icon: "❌" },
      Pending: { class: "status-pending", icon: "⏳" },
    };
    const defaultStatus = { class: "status-pending", icon: "⏳" };
    return statusMap[status] || defaultStatus;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="detail-container">
        <div className="loading-wrapper">
          <div className="loading-spinner-large"></div>
          <p className="loading-text">Loading athlete details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-container">
        <div className="error-wrapper">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Something went wrong</h2>
          <p className="error-message">{error}</p>
          <button
            className="back-button"
            onClick={() => router.push("/admin/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="detail-container">
        <div className="empty-wrapper">
          <div className="empty-icon">👤</div>
          <h2 className="empty-title">No athlete found</h2>
          <p className="empty-message">
            The athlete you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            className="back-button"
            onClick={() => router.push("/admin/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusBadge(athlete.status);
  const fullName = athlete.personal?.fullName || "Unknown Athlete";

  return (
    <div className="detail-container">
      <div className="detail-wrapper">
        {/* Header */}
        <div className="detail-header">
          <button
            className="back-button"
            onClick={() => router.push("/admin/dashboard")}
          >
            ← Back to Dashboard
          </button>
          <div className="header-title-section">
            <div className="athlete-avatar-large">{getInitials(fullName)}</div>
            <div>
              <h1 className="athlete-name">{fullName}</h1>
              <div className="athlete-meta">
                <span className={`status-badge ${statusInfo.class}`}>
                  {statusInfo.icon} {athlete.status || "Pending"}
                </span>
                <span className="meta-item">
                  🆔 ID: {athlete._id?.slice(-6) || "N/A"}
                </span>
                <span className="meta-item">
                  📅 Joined: {formatDate(athlete.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="detail-content">
          {/* Left Column - Personal & Guardian Info */}
          <div className="content-left">
            {/* Personal Details */}
            <div className="info-card">
              <div className="card-header">
                <span className="card-icon">👤</span>
                <h3 className="card-title">Personal Information</h3>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label className="info-label">Full Name</label>
                  <p className="info-value">
                    {athlete.personal?.fullName || "N/A"}
                  </p>
                </div>
                <div className="info-item">
                  <label className="info-label">Gender</label>
                  <p className="info-value">
                    {athlete.personal?.gender || "N/A"}
                  </p>
                </div>
                <div className="info-item">
                  <label className="info-label">Date of Birth</label>
                  <p className="info-value">
                    {formatDate(athlete.personal?.dob)}
                  </p>
                </div>
                <div className="info-item">
                  <label className="info-label">Age</label>
                  <p className="info-value">{athlete.personal?.age || "N/A"}</p>
                </div>
                <div className="info-item">
                  <label className="info-label">Mobile</label>
                  <p className="info-value">
                    {athlete.personal?.mobile || "N/A"}
                  </p>
                </div>
                <div className="info-item">
                  <label className="info-label">Email</label>
                  <p className="info-value">
                    {athlete.personal?.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Guardian Details */}
            <div className="info-card">
              <div className="card-header">
                <span className="card-icon">👨‍👩‍👧</span>
                <h3 className="card-title">Guardian Information</h3>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label className="info-label">Guardian Name</label>
                  <p className="info-value">
                    {athlete.guardian?.guardianName || "N/A"}
                  </p>
                </div>
                <div className="info-item">
                  <label className="info-label">Relation</label>
                  <p className="info-value">
                    {athlete.guardian?.relation || "N/A"}
                  </p>
                </div>
                <div className="info-item">
                  <label className="info-label">Mobile</label>
                  <p className="info-value">
                    {athlete.guardian?.mobile || "N/A"}
                  </p>
                </div>
                <div className="info-item">
                  <label className="info-label">Email</label>
                  <p className="info-value">
                    {athlete.guardian?.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="info-card">
              <div className="card-header">
                <span className="card-icon">📍</span>
                <h3 className="card-title">Address</h3>
              </div>
              <div className="info-grid">
                <div className="info-item full-width">
                  <label className="info-label">Address</label>
                  <p className="info-value">
                    {athlete.address?.address || "N/A"}
                  </p>
                </div>
                <div className="info-item">
                  <label className="info-label">District</label>
                  <p className="info-value">
                    {athlete.address?.district || "N/A"}
                  </p>
                </div>
                <div className="info-item">
                  <label className="info-label">State</label>
                  <p className="info-value">
                    {athlete.address?.state || "N/A"}
                  </p>
                </div>
                <div className="info-item">
                  <label className="info-label">Pin Code</label>
                  <p className="info-value">
                    {athlete.address?.pinCode || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Club, Competition & Documents */}
          <div className="content-right">
            {/* Club Details */}
            <div className="info-card">
              <div className="card-header">
                <span className="card-icon">🏛️</span>
                <h3 className="card-title">Club Information</h3>
              </div>
              <div className="info-grid">
                <div className="info-item full-width">
                  <label className="info-label">Club Name</label>
                  <p className="info-value">
                    {athlete.club?.clubName || "N/A"}
                  </p>
                </div>
                <div className="info-item">
                  <label className="info-label">Coach Name</label>
                  <p className="info-value">
                    {athlete.club?.coachName || "N/A"}
                  </p>
                </div>
                <div className="info-item">
                  <label className="info-label">Coach Mobile</label>
                  <p className="info-value">
                    {athlete.club?.coachMobile || "N/A"}
                  </p>
                </div>
                <div className="info-item full-width">
                  <label className="info-label">State Association</label>
                  <p className="info-value">
                    {athlete.club?.stateAssociation || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Competition Details */}
            <div className="info-card">
              <div className="card-header">
                <span className="card-icon">🏆</span>
                <h3 className="card-title">Competition Information</h3>
              </div>
              <div className="info-grid">
                <div className="info-item full-width">
                  <label className="info-label">Competition Name</label>
                  <p className="info-value">
                    {athlete.competition?.competitionName || "N/A"}
                  </p>
                </div>
                <div className="info-item">
                  <label className="info-label">Age Group</label>
                  <p className="info-value">
                    {athlete.competition?.ageGroup || "N/A"}
                  </p>
                </div>
                <div className="info-item">
                  <label className="info-label">Weight Category</label>
                  <p className="info-value">
                    {athlete.competition?.weightCategory || "N/A"}
                  </p>
                </div>
                <div className="info-item full-width">
                  <label className="info-label">Event</label>
                  <p className="info-value">
                    {athlete.competition?.event || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="info-card">
              <div className="card-header">
                <span className="card-icon">📄</span>
                <h3 className="card-title">Documents</h3>
              </div>
              <div className="documents-grid">
                <a
                  href={athlete.documents?.passportPhoto || "#"}
                  target="_blank"
                  className="document-link"
                  rel="noopener noreferrer"
                >
                  <span className="doc-icon">📸</span>
                  Passport Photo
                  <span className="doc-arrow">→</span>
                </a>
                <a
                  href={athlete.documents?.birthCertificate || "#"}
                  target="_blank"
                  className="document-link"
                  rel="noopener noreferrer"
                >
                  <span className="doc-icon">📜</span>
                  Birth Certificate
                  <span className="doc-arrow">→</span>
                </a>
                <a
                  href={athlete.documents?.medicalCertificate || "#"}
                  target="_blank"
                  className="document-link"
                  rel="noopener noreferrer"
                >
                  <span className="doc-icon">🏥</span>
                  Medical Certificate
                  <span className="doc-arrow">→</span>
                </a>
                <a
                  href={athlete.documents?.consentForm || "#"}
                  target="_blank"
                  className="document-link"
                  rel="noopener noreferrer"
                >
                  <span className="doc-icon">📝</span>
                  Consent Form
                  <span className="doc-arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
