"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../services/api";
import toast from "react-hot-toast";
import "./dashboard.css";

export default function CoachDashboard() {
  const router = useRouter();
  const [coach, setCoach] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchCoachProfile();
  }, []);

  const fetchCoachProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await api.get("/coaches/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setCoach(response.data.coach);
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
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="coach-dashboard">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="coach-dashboard">
        <div className="no-data">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="coach-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Coach Dashboard</h1>
          <p className="welcome-text">Welcome, {coach.personal?.fullName}!</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="status-banner">
        <span className={`status-badge status-${coach.status?.toLowerCase()}`}>
          {coach.status}
        </span>
        {coach.status === "Rejected" && coach.rejectionReason && (
          <div className="rejection-reason">
            <strong>Rejection Reason:</strong> {coach.rejectionReason}
          </div>
        )}
      </div>

      <div className="profile-sections">
        <ProfileSection
          title="Personal Details"
          section="personal"
          expanded={expandedSections.personal}
          onToggle={toggleSection}
          data={coach.personal}
          fields={["fullName", "gender", "dob", "mobile", "email"]}
        />

        <ProfileSection
          title="Address Details"
          section="address"
          expanded={expandedSections.address}
          onToggle={toggleSection}
          data={coach.address}
          fields={["address", "district", "state", "pinCode"]}
        />

        <ProfileSection
          title="Qualifications"
          section="qualification"
          expanded={expandedSections.qualification}
          onToggle={toggleSection}
          data={coach.qualification}
          fields={["highestQualification", "coachingCertification", "licenseNumber"]}
        />

        <ProfileSection
          title="Experience"
          section="experience"
          expanded={expandedSections.experience}
          onToggle={toggleSection}
          data={coach.experience}
          fields={["yearsOfExperience", "previousClubs", "sportsSpecialized"]}
        />

        <ProfileSection
          title="Club Details"
          section="club"
          expanded={expandedSections.club}
          onToggle={toggleSection}
          data={coach.club}
          fields={["clubName", "stateAssociation"]}
        />

        <DocumentsSection documents={coach.documents} />
      </div>

      <div className="action-buttons">
        <button className="action-btn edit-btn" onClick={() => router.push("/coach/edit")}>
          ✏️ Edit Profile
        </button>
        <button
          className="action-btn password-btn"
          onClick={() => router.push("/coach/change-password")}
        >
          🔐 Change Password
        </button>
      </div>
    </div>
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
  const [expanded, setExpanded] = useState(false);

  const docFiles = [
    { key: "passportPhoto", label: "Passport Photo" },
    { key: "governmentId", label: "Government ID" },
    { key: "coachingCertificate", label: "Coaching Certificate" },
    { key: "resume", label: "Resume" },
  ];

  return (
    <div className="profile-section">
      <div className="section-header" onClick={() => setExpanded(!expanded)}>
        <h2 className="section-title">Uploaded Documents</h2>
        <span className="toggle-icon">{expanded ? "▼" : "▶"}</span>
      </div>
      {expanded && (
        <div className="section-content">
          <div className="documents-list">
            {docFiles.map((doc) => (
              <div key={doc.key} className="document-item">
                <span className="document-label">{doc.label}</span>
                {documents?.[doc.key] ? (
                  <a href={documents[doc.key]} target="_blank" rel="noopener noreferrer" className="document-link">
                    📥 Download
                  </a>
                ) : (
                  <span className="document-empty">Not uploaded</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
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
