"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  RefreshCw,
  BriefcaseBusiness,
  User,
  MapPin,
  IndianRupee,
} from "lucide-react";

import "./applications.css";

type Application = {
  _id: string;
  userId: string;
  jobId: number;
  title: string;
  company: string;
  location: string;
  pay: string;
  duration: string;
  status: "Applied" | "Under Review" | "Accepted";
  createdAt: string;
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadApplications = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/applications/all", {
        cache: "no-store",
      });

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error("API returned HTML instead of JSON");
      }

      const data = await response.json();

      if (data.success) {
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error("APPLICATION LOAD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const updateStatus = async (
    applicationId: string,
    status: Application["status"]
  ) => {
    try {
      setUpdating(applicationId);

      const response = await fetch(
        "/api/applications/status",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            applicationId,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        alert(data.message || "Failed to update status");
        return;
      }

      setApplications((prev) =>
        prev.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                status,
              }
            : application
        )
      );
    } catch (error) {
      console.error("STATUS UPDATE ERROR:", error);
      alert("Something went wrong");
    } finally {
      setUpdating(null);
    }
  };

  const deleteApplication = async (
    applicationId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;

    try {
      setDeleting(applicationId);

      const response = await fetch(
        `/api/applications/delete?id=${encodeURIComponent(
          applicationId
        )}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!data.success) {
        alert(data.message || "Failed to delete application");
        return;
      }

      setApplications((prev) =>
        prev.filter(
          (application) =>
            application._id !== applicationId
        )
      );
    } catch (error) {
      console.error("DELETE APPLICATION ERROR:", error);
      alert("Something went wrong");
    } finally {
      setDeleting(null);
    }
  };

  const getStatusClass = (
    status: Application["status"]
  ) => {
    if (status === "Accepted") return "status-accepted";

    if (status === "Under Review") {
      return "status-review";
    }

    return "status-applied";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const totalApplications = applications.length;

  const acceptedApplications = applications.filter(
    (item) => item.status === "Accepted"
  ).length;

  const reviewApplications = applications.filter(
    (item) => item.status === "Under Review"
  ).length;

  const appliedApplications = applications.filter(
    (item) => item.status === "Applied"
  ).length;

  return (
    <main className="admin-applications-page">
      <div className="admin-applications-bg" />

      <header className="admin-applications-header">
        <div className="admin-header-left">
          <Link
            href="/admin"
            className="admin-back-button"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1>Applications</h1>
            <p>
              Manage all student job applications
            </p>
          </div>
        </div>

        <button
          className="refresh-button"
          onClick={loadApplications}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={loading ? "refresh-spin" : ""}
          />
          Refresh
        </button>
      </header>

      <section className="application-stats">
        <div className="application-stat-card">
          <div className="stat-icon purple">
            <BriefcaseBusiness size={21} />
          </div>

          <div>
            <span>Total Applications</span>
            <strong>{totalApplications}</strong>
          </div>
        </div>

        <div className="application-stat-card">
          <div className="stat-icon blue">
            <Clock size={21} />
          </div>

          <div>
            <span>Applied</span>
            <strong>{appliedApplications}</strong>
          </div>
        </div>

        <div className="application-stat-card">
          <div className="stat-icon orange">
            <Clock size={21} />
          </div>

          <div>
            <span>Under Review</span>
            <strong>{reviewApplications}</strong>
          </div>
        </div>

        <div className="application-stat-card">
          <div className="stat-icon green">
            <CheckCircle size={21} />
          </div>

          <div>
            <span>Accepted</span>
            <strong>{acceptedApplications}</strong>
          </div>
        </div>
      </section>

      <section className="applications-section">
        <div className="applications-section-header">
          <div>
            <h2>All Applications</h2>
            <p>
              Review and manage submitted applications
            </p>
          </div>

          <span className="application-count">
            {applications.length} applications
          </span>
        </div>

        {loading ? (
          <div className="applications-loading">
            <div className="loading-spinner" />
            <p>Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="applications-empty">
            <BriefcaseBusiness size={48} />

            <h3>No applications found</h3>

            <p>
              Student applications will appear here.
            </p>

            <button onClick={loadApplications}>
              Refresh
            </button>
          </div>
        ) : (
          <div className="applications-table-wrapper">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Job</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Pay</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((application) => (
                  <tr key={application._id}>
                    <td>
                      <div className="student-cell">
                        <div className="student-avatar">
                          <User size={17} />
                        </div>

                        <div>
                          <strong>
                            {application.userId}
                          </strong>

                          <small>
                            Student ID
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="job-cell">
                        <strong>
                          {application.title}
                        </strong>

                        <small>
                          Job #{application.jobId}
                        </small>
                      </div>
                    </td>

                    <td>
                      <span className="company-text">
                        {application.company}
                      </span>
                    </td>

                    <td>
                      <span className="location-text">
                        <MapPin size={14} />
                        {application.location}
                      </span>
                    </td>

                    <td>
                      <span className="pay-text">
                        <IndianRupee size={13} />
                        {application.pay}
                      </span>
                    </td>

                    <td>
                      <span className="duration-text">
                        {application.duration}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          application.status
                        )}`}
                      >
                        {application.status ===
                          "Accepted" && (
                          <CheckCircle size={13} />
                        )}

                        {application.status ===
                          "Under Review" && (
                          <Clock size={13} />
                        )}

                        {application.status ===
                          "Applied" && (
                          <Clock size={13} />
                        )}

                        {application.status}
                      </span>
                    </td>

                    <td>
                      <span className="date-text">
                        {formatDate(
                          application.createdAt
                        )}
                      </span>
                    </td>

                    <td>
                      <div className="application-actions">
                        <button
                          className="review-action"
                          title="Under Review"
                          disabled={
                            updating ===
                            application._id
                          }
                          onClick={() =>
                            updateStatus(
                              application._id,
                              "Under Review"
                            )
                          }
                        >
                          <Clock size={15} />
                        </button>

                        <button
                          className="accept-action"
                          title="Accept"
                          disabled={
                            updating ===
                            application._id
                          }
                          onClick={() =>
                            updateStatus(
                              application._id,
                              "Accepted"
                            )
                          }
                        >
                          <CheckCircle size={15} />
                        </button>

                        <button
                          className="delete-action"
                          title="Delete"
                          disabled={
                            deleting ===
                            application._id
                          }
                          onClick={() =>
                            deleteApplication(
                              application._id
                            )
                          }
                        >
                          {deleting ===
                          application._id ? (
                            <span className="mini-spinner" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}