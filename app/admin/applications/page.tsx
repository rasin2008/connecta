"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Search,
  RefreshCw,
  Trash2,
  UserRound,
  MapPin,
  IndianRupee,
  Clock3,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";
import "./applications.css";

type ApplicationStatus = "Applied" | "Under Review" | "Accepted";

type Application = {
  _id: string;
  userId: string;
  jobId: number;
  title: string;
  company: string;
  location: string;
  pay: string;
  duration: string;
  status: ApplicationStatus;
  createdAt: string;
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | ApplicationStatus
  >("All");

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // --------------------------------------------------
  // LOAD APPLICATIONS
  // --------------------------------------------------

  const loadApplications = async () => {
    try {
      setError("");

      const response = await fetch("/api/applications/all", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `Applications API returned ${response.status}`
        );
      }

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error("Server did not return JSON.");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Failed to load applications."
        );
      }

      setApplications(data.applications || []);
    } catch (error) {
      console.error("ADMIN APPLICATIONS ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load applications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // --------------------------------------------------
  // PAGE LOAD
  // --------------------------------------------------

  useEffect(() => {
    const savedUser = localStorage.getItem("connectaUser");

    /*
     * Demo admin access.
     *
     * Applications page should open even if
     * there is no logged-in user.
     */

    if (!savedUser) {
      loadApplications();
      return;
    }

    try {
      JSON.parse(savedUser);
      loadApplications();
    } catch (error) {
      console.error("ADMIN USER ERROR:", error);
      loadApplications();
    }
  }, []);

  // --------------------------------------------------
  // REFRESH
  // --------------------------------------------------

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
  };

  // --------------------------------------------------
  // UPDATE STATUS
  // --------------------------------------------------

  const updateStatus = async (
    applicationId: string,
    status: ApplicationStatus
  ) => {
    try {
      setUpdatingId(applicationId);
      setError("");

      const response = await fetch("/api/applications/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: applicationId,
          status,
        }),
      });

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error("Server did not return JSON.");
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update application status."
        );
      }

      setApplications((current) =>
        current.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                status,
              }
            : application
        )
      );
    } catch (error) {
      console.error("UPDATE APPLICATION STATUS ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // --------------------------------------------------
  // DELETE APPLICATION
  // --------------------------------------------------

  const deleteApplication = async (applicationId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(applicationId);
      setError("");

      const response = await fetch(
        `/api/applications/delete?id=${encodeURIComponent(
          applicationId
        )}`,
        {
          method: "DELETE",
        }
      );

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error("Server did not return JSON.");
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete application."
        );
      }

      setApplications((current) =>
        current.filter(
          (application) => application._id !== applicationId
        )
      );
    } catch (error) {
      console.error("DELETE APPLICATION ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete application."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesSearch =
        !query ||
        application.title.toLowerCase().includes(query) ||
        application.company.toLowerCase().includes(query) ||
        application.location.toLowerCase().includes(query) ||
        application.userId.toLowerCase().includes(query) ||
        String(application.jobId).includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  // --------------------------------------------------
  // STATS
  // --------------------------------------------------

  const totalApplications = applications.length;

  const appliedCount = applications.filter(
    (application) => application.status === "Applied"
  ).length;

  const reviewCount = applications.filter(
    (application) => application.status === "Under Review"
  ).length;

  const acceptedCount = applications.filter(
    (application) => application.status === "Accepted"
  ).length;

  // --------------------------------------------------
  // STATUS CLASS
  // --------------------------------------------------

  const getStatusClass = (status: ApplicationStatus) => {
    if (status === "Accepted") {
      return "status accepted";
    }

    if (status === "Under Review") {
      return "status review";
    }

    return "status applied";
  };

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

  const formatDate = (date: string) => {
    if (!date) {
      return "Unknown date";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown date";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // --------------------------------------------------
  // VIEW JOB
  // --------------------------------------------------

  const getJobLink = (jobId: number) => {
    return `/job-details?jobId=${encodeURIComponent(jobId)}`;
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <main className="admin-applications-page">
      <div className="admin-applications-orb orb-one" />
      <div className="admin-applications-orb orb-two" />

      <div className="admin-applications-container">
        {/* TOP BAR */}

        <div className="admin-applications-topbar">
          <Link
            href="/admin"
            className="admin-back-button"
          >
            <ArrowLeft size={18} />
            Back to Admin
          </Link>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              size={17}
              className={refreshing ? "spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* HEADER */}

        <section className="admin-applications-header">
          <div>
            <div className="admin-page-badge">
              <BriefcaseBusiness size={16} />
              ADMIN PANEL
            </div>

            <h1>Applications</h1>

            <p>
              Manage student applications and update their
              application status.
            </p>
          </div>
        </section>

        {/* STATS */}

        <section className="admin-application-stats">
          <div className="admin-application-stat">
            <div className="stat-icon total">
              <BriefcaseBusiness size={20} />
            </div>

            <div>
              <span>Total Applications</span>
              <strong>{totalApplications}</strong>
            </div>
          </div>

          <div className="admin-application-stat">
            <div className="stat-icon applied">
              <Clock3 size={20} />
            </div>

            <div>
              <span>Applied</span>
              <strong>{appliedCount}</strong>
            </div>
          </div>

          <div className="admin-application-stat">
            <div className="stat-icon review">
              <Eye size={20} />
            </div>

            <div>
              <span>Under Review</span>
              <strong>{reviewCount}</strong>
            </div>
          </div>

          <div className="admin-application-stat">
            <div className="stat-icon accepted">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Accepted</span>
              <strong>{acceptedCount}</strong>
            </div>
          </div>
        </section>

        {/* SEARCH / FILTER */}

        <section className="admin-applications-toolbar">
          <div className="admin-search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search applications..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="admin-status-filter">
            <button
              type="button"
              className={
                statusFilter === "All"
                  ? "active"
                  : ""
              }
              onClick={() => setStatusFilter("All")}
            >
              All
            </button>

            <button
              type="button"
              className={
                statusFilter === "Applied"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setStatusFilter("Applied")
              }
            >
              Applied
            </button>

            <button
              type="button"
              className={
                statusFilter === "Under Review"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setStatusFilter("Under Review")
              }
            >
              Review
            </button>

            <button
              type="button"
              className={
                statusFilter === "Accepted"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setStatusFilter("Accepted")
              }
            >
              Accepted
            </button>
          </div>
        </section>

        {/* ERROR */}

        {error && (
          <div className="admin-applications-error">
            <XCircle size={19} />
            <span>{error}</span>
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <section className="admin-applications-loading">
            <RefreshCw size={28} className="spin" />
            <p>Loading applications...</p>
          </section>
        ) : filteredApplications.length === 0 ? (
          /* EMPTY */

          <section className="admin-applications-empty">
            <div className="empty-icon">
              <BriefcaseBusiness size={32} />
            </div>

            <h2>No Applications Found</h2>

            <p>
              {applications.length === 0
                ? "There are no applications in the system yet."
                : "No applications match your current search or filter."}
            </p>

            {search || statusFilter !== "All" ? (
              <button
                type="button"
                className="clear-filter-button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
              >
                Clear Filters
              </button>
            ) : null}
          </section>
        ) : (
          /* APPLICATION GRID */

          <section className="admin-applications-grid">
            {filteredApplications.map((application) => (
              <article
                key={application._id}
                className="admin-application-card"
              >
                {/* CARD HEADER */}

                <div className="admin-application-card-header">
                  <div className="application-user">
                    <div className="user-avatar">
                      <UserRound size={20} />
                    </div>

                    <div>
                      <span>Applicant</span>
                      <strong>
                        {application.userId}
                      </strong>
                    </div>
                  </div>

                  <span
                    className={getStatusClass(
                      application.status
                    )}
                  >
                    {application.status}
                  </span>
                </div>

                {/* JOB */}

                <div className="application-job-section">
                  <div className="job-icon">
                    <BriefcaseBusiness size={22} />
                  </div>

                  <div className="job-info">
                    <h2>{application.title}</h2>

                    <p>{application.company}</p>
                  </div>
                </div>

                {/* DETAILS */}

                <div className="application-details">
                  <div className="application-detail">
                    <MapPin size={16} />
                    <span>
                      {application.location}
                    </span>
                  </div>

                  <div className="application-detail">
                    <IndianRupee size={16} />
                    <span>{application.pay}</span>
                  </div>

                  <div className="application-detail">
                    <Clock3 size={16} />
                    <span>{application.duration}</span>
                  </div>

                  <div className="application-detail">
                    <BriefcaseBusiness size={16} />
                    <span>
                      Job ID: {application.jobId}
                    </span>
                  </div>
                </div>

                {/* DATE */}

                <div className="application-date">
                  Applied on {formatDate(application.createdAt)}
                </div>

                {/* STATUS */}

                <div className="application-status-area">
                  <label>Application Status</label>

                  <select
                    value={application.status}
                    disabled={
                      updatingId === application._id
                    }
                    onChange={(event) =>
                      updateStatus(
                        application._id,
                        event.target.value as ApplicationStatus
                      )
                    }
                  >
                    <option value="Applied">
                      Applied
                    </option>

                    <option value="Under Review">
                      Under Review
                    </option>

                    <option value="Accepted">
                      Accepted
                    </option>
                  </select>
                </div>

                {/* ACTIONS */}

                <div className="admin-application-actions">
                  <Link
                    href={getJobLink(application.jobId)}
                    className="view-job-button"
                  >
                    <Eye size={17} />
                    View Job
                  </Link>

                  <button
                    type="button"
                    className="delete-application-button"
                    disabled={
                      deletingId === application._id
                    }
                    onClick={() =>
                      deleteApplication(application._id)
                    }
                  >
                    <Trash2 size={17} />

                    {deletingId === application._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* RESULT COUNT */}

        {!loading && filteredApplications.length > 0 && (
          <div className="admin-applications-result-count">
            Showing{" "}
            <strong>
              {filteredApplications.length}
            </strong>{" "}
            of{" "}
            <strong>{applications.length}</strong>{" "}
            applications
          </div>
        )}
      </div>
    </main>
  );
}