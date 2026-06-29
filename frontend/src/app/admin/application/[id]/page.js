"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "../../../../services/api";
import toast from "react-hot-toast";
import "../../details.css";

export default function ApplicationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchApplication();
  }, [params.id]);

  const fetchApplication = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await api.get(`/admin/application/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setApplication(response.data.application);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response?.status === 401) {
        router.push("/login");
      } else {
        toast.error("Failed to load application details");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (window.confirm("Approve this application?")) {
      try {
        const token = localStorage.getItem("token");
        await api.patch(
          `/admin/application/${params.id}/status`,
          { status: "Approved" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Application approved!");
        router.push("/admin/dashboard");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to approve");
      }
    }
  };

  const handleReject = async () => {
    const reason = prompt("Enter rejection reason:");
    if (reason) {
      try {
        const token = localStorage.getItem("token");
        await api.patch(
          `/admin/application/${params.id}/status`,
          { status: "Rejected", rejectionReason: reason },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Application rejected!");
        router.push("/admin/dashboard");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to reject");
      }
    }
  };

  if (isLoading) {
    return <div className="details-container"><div className="loading">Loading...</div></div>;
  }

  if (!application) {
    return <div className="details-container"><div className="no-data">Application not found</div></div>;
  }

  const profile = application.profileData;

  return (
    <div className="details-container">
      <div className="details-header">
        <button className="back-btn" onClick={() => router.back()}>
          ← Back
        </button>
        <h1 className="details-title">Application Details</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="details-wrapper">
        <div className="info-card">
          <h2 className="card-title">Basic Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Name</span>
              <span className="info-value">{application.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{application.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Mobile</span>
              <span className="info-value">{application.mobile}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role</span>
              <span className={`role-badge role-${application.role.toLowerCase()}`}>
                {application.role}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Status</span>
              <span className={`status-badge status-${application.status.toLowerCase()}`}>
                {application.status}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Registered</span>
              <span className="info-value">{new Date(application.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          {application.status === "Rejected" && application.profileData?.rejectionReason && (
            <div className="rejection-section">
              <h3>Rejection Reason</h3>
              <p>{application.profileData.rejectionReason}</p>
            </div>
          )}
        </div>

        {profile && (
          <>
            {application.role === "Athlete" && (
              <AthleteDetails profile={profile} />
            )}
            {application.role === "Coach" && (
              <CoachDetails profile={profile} />
            )}
          </>
        )}

        <div className="action-buttons">
          {application.status !== "Approved" && (
            <button className="approve-btn" onClick={handleApprove}>
              ✓ Approve
            </button>
          )}
          {application.status !== "Rejected" && (
            <button className="reject-btn" onClick={handleReject}>
              ✕ Reject
            </button>
          )}
          <button className="back-link-btn" onClick={() => router.push("/admin/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function AthleteDetails({ profile }) {
  return (
    <>
      <InfoCard title="Personal Details" data={profile.personal} />
      <InfoCard title="Guardian Details" data={profile.guardian} />
      <InfoCard title="Address Details" data={profile.address} />
      <InfoCard title="Club Details" data={profile.club} />
      <InfoCard title="Competition Details" data={profile.competition} />
      <DocumentsCard documents={profile.documents} />
    </>
  );
}

function CoachDetails({ profile }) {
  return (
    <>
      <InfoCard title="Personal Details" data={profile.personal} />
      <InfoCard title="Address Details" data={profile.address} />
      <InfoCard title="Qualifications" data={profile.qualification} />
      <InfoCard title="Experience" data={profile.experience} />
      <InfoCard title="Club Details" data={profile.club} />
      <DocumentsCard documents={profile.documents} />
    </>
  );
}

function InfoCard({ title, data }) {
  return (
    <div className="info-card">
      <h2 className="card-title">{title}</h2>
      <div className="info-grid">
        {Object.entries(data || {}).map(([key, value]) => (
          <div key={key} className="info-item">
            <span className="info-label">{formatLabel(key)}</span>
            <span className="info-value">{formatValue(key, value) || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentsCard({ documents }) {
  return (
    <div className="info-card">
      <h2 className="card-title">Documents</h2>
      <div className="documents-section">
        {Object.entries(documents || {})
          .filter(([key, value]) => key !== "folderName" && value)
          .map(([key, url]) => (
            <div key={key} className="document-row">
              <span className="document-name">{formatLabel(key)}</span>
              <a href={url} target="_blank" rel="noopener noreferrer" className="document-link">
                📥 Download
              </a>
            </div>
          ))}
      </div>
    </div>
  );
}

function formatLabel(str) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function formatValue(key, value) {
  if (key === "dob") {
    return new Date(value).toLocaleDateString();
  }
  return value;
}
