"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../services/api";
import toast from "react-hot-toast";
import Navbar from "../../../components/Navbar";
import { FaDownload } from "react-icons/fa";
import "./dashboard.css";

export default function AthleteDashboard() {
  const router = useRouter();
  const [athlete, setAthlete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    guardian: true,
    address: true,
    club: true,
    competition: true,
    documents: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchAthletProfile();
  }, []);

  const fetchAthletProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await api.get("/athlete/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setAthlete(response.data.athlete);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
      } else {
        toast.error("Failed to load profile");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section) => {
    // Sections always expanded
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (isLoading) {
    return (
      <>
        <Navbar showBackButton={false} title="Sports Club Management" />
        <div className="athlete-dashboard">
          <div className="loading">Loading profile...</div>
        </div>
      </>
    );
  }

  if (!athlete) {
    return (
      <>
        <Navbar showBackButton={false} title="Sports Club Management" />
        <div className="athlete-dashboard">
          <div className="no-data">Profile not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar showBackButton={false} title="Sports Club Management" />
      <div className="athlete-dashboard">
        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">Athlete Dashboard</h1>
            <p className="welcome-text">
              Welcome, {athlete.personal?.fullName}!
            </p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="status-banner">
          <span
            className={`status-badge status-${athlete.status?.toLowerCase()}`}
          >
            {athlete.status}
          </span>
          {athlete.status === "Rejected" && athlete.rejectionReason && (
            <div className="rejection-reason">
              <strong>Rejection Reason:</strong> {athlete.rejectionReason}
            </div>
          )}
        </div>

        <div className="profile-sections">
          <ProfileSection
            title="Personal Details"
            section="personal"
            expanded={expandedSections.personal}
            onToggle={toggleSection}
            data={athlete.personal}
            fields={[
              "fullName",
              "gender",
              "dob",
              "mobile",
              "email",
              "bloodGroup",
            ]}
          />

          <ProfileSection
            title="Guardian Details"
            section="guardian"
            expanded={expandedSections.guardian}
            onToggle={toggleSection}
            data={athlete.guardian}
            fields={["guardianName", "relation", "mobile", "email"]}
          />

          <ProfileSection
            title="Address Details"
            section="address"
            expanded={expandedSections.address}
            onToggle={toggleSection}
            data={athlete.address}
            fields={["address", "district", "state", "pinCode"]}
          />

          <ProfileSection
            title="Club Details"
            section="club"
            expanded={expandedSections.club}
            onToggle={toggleSection}
            data={athlete.club}
            fields={[
              "clubName",
              "coachName",
              "coachMobile",
              "stateAssociation",
            ]}
          />

          <ProfileSection
            title="Competition Details"
            section="competition"
            expanded={expandedSections.competition}
            onToggle={toggleSection}
            data={athlete.competition}
            fields={["competitionName", "ageGroup", "weightCategory", "event"]}
          />

          <DocumentsSection documents={athlete.documents} />
        </div>

        <div className="action-buttons">
          <button
            className="action-btn edit-btn"
            onClick={() => router.push("/athlete/edit")}
          >
            ✏️ Edit Profile
          </button>
          <button
            className="action-btn password-btn"
            onClick={() => router.push("/athlete/change-password")}
          >
            🔐 Change Password
          </button>
        </div>
      </div>
    </>
  );
}

function ProfileSection({ title, section, expanded, onToggle, data, fields }) {
  return (
    <div className="profile-section">
      <div className="section-header" onClick={() => onToggle(section)}>
        <h2 className="section-title">{title}</h2>
        <span className="toggle-icon">{expanded ? "▼" : "▶"}</span>
      </div>
      {expanded && (
        <div className="section-content">
          <div className="field-grid">
            {fields.map((field) => (
              <div key={field} className="field-item">
                <label className="field-label">{formatLabel(field)}</label>
                <p className="field-value">
                  {data?.[field] ? formatValue(field, data[field]) : "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DocumentsSection({ documents }) {
  const docFiles = [
    { key: "passportPhoto", label: "Passport Photo" },
    { key: "birthCertificate", label: "Birth Certificate" },
    { key: "medicalCertificate", label: "Medical Certificate" },
    { key: "consentForm", label: "Consent Form" },
  ];

  return (
    <div className="profile-section">
      <div className="section-header">
        <h2 className="section-title">Uploaded Documents</h2>
      </div>
      <div className="section-content">
        <div className="documents-list">
          {docFiles.map((doc) => (
            <div key={doc.key} className="document-item">
              <span className="document-label">{doc.label}</span>
              {documents?.[doc.key] ? (
                <a
                  href={documents[doc.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="document-link"
                >
                  <FaDownload />
                  Download
                </a>
              ) : (
                <span className="document-empty">Not uploaded</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatLabel(field) {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function formatValue(field, value) {
  if (field === "dob") {
    return new Date(value).toLocaleDateString();
  }
  return value;
}
