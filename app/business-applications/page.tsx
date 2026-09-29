"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  BriefcaseBusiness,
  MapPin,
  IndianRupee,
  Clock3,
  User,
  CheckCircle2,
  Eye,
  Search,
  Loader2,
  RefreshCw,
} from "lucide-react";

import "./business-applications.css";

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

type Job = {
  _id?: string;
  jobId: number;
  title: string;
  company: string;
  postedBy?: string;
};

type UserData = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
};

export default function BusinessApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>(
    []
  );

  const [filteredApplications, setFilteredApplications] =
    useState<Application[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      /* ================================
         GET LOGGED-IN BUSINESS
      ================================= */

      const savedUser =
        localStorage.getItem("connectaUser");

      if (!savedUser) {
        window.location.href = "/";
        return;
      }

      let user: UserData;

      try {
        user = JSON.parse(savedUser);
      } catch {
        localStorage.removeItem("connectaUser");
        window.location.href = "/";
        return;
      }

      if (user.role !== "business") {
        window.location.href = "/home-student";
        return;
      }

      const businessId =
        user.id ||
        user._id;

      if (!businessId) {
        throw new Error(
          "Business account information is missing."
        );
      }

      /* ================================
         GET JOBS
      ================================= */

      const jobsResponse = await fetch(
        "/api/jobs/all",
        {
          cache: "no-store",
        }
      );

      const jobsContentType =
        jobsResponse.headers.get("content-type");

      if (
        !jobsContentType?.includes(
          "application/json"
        )
      ) {
        throw new Error(
          "Invalid jobs server response."
        );
      }

      const jobsData =
        await jobsResponse.json();

      if (
        !jobsResponse.ok ||
        !jobsData.success
      ) {
        throw new Error(
          jobsData.message ||
            "Failed to load jobs."
        );
      }

      const allJobs: Job[] =
        Array.isArray(jobsData.jobs)
          ? jobsData.jobs
          : [];

      /* ================================
         BUSINESS JOBS ONLY
      ================================= */

      const businessJobs =
        allJobs.filter(
          (job) =>
            String(job.postedBy) ===
            String(businessId)
        );

      const businessJobIds =
        new Set(
          businessJobs.map(
            (job) => Number(job.jobId)
          )
        );

      /* ================================
         GET ALL APPLICATIONS
      ================================= */

      const applicationsResponse =
        await fetch(
          "/api/applications/all",
          {
            cache: "no-store",
          }
        );

      const applicationsContentType =
        applicationsResponse.headers.get(
          "content-type"
        );

      if (
        !applicationsContentType?.includes(
          "application/json"
        )
      ) {
        throw new Error(
          "Invalid applications server response."
        );
      }

      const applicationsData =
        await applicationsResponse.json();

      if (
        !applicationsResponse.ok ||
        !applicationsData.success
      ) {
        throw new Error(
          applicationsData.message ||
            "Failed to load applications."
        );
      }

      const allApplications: Application[] =
        Array.isArray(
          applicationsData.applications
        )
          ? applicationsData.applications
          : [];

      /* ================================
         FILTER BUSINESS APPLICATIONS
      ================================= */

      const businessApplications =
        allApplications.filter(
          (application) =>
            businessJobIds.has(
              Number(application.jobId)
            )
        );

      setApplications(
        businessApplications
      );
    } catch (error) {
      console.error(
        "LOAD BUSINESS APPLICATIONS ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     INITIAL LOAD
  ================================= */

  useEffect(() => {
    const checkUser = () => {
      const savedUser =
        localStorage.getItem("connectaUser");

      if (!savedUser) {
        window.location.href = "/";
        return;
      }

      try {
        const user: UserData =
          JSON.parse(savedUser);

        if (user.role !== "business") {
          window.location.href =
            "/home-student";

          return;
        }

        loadApplications();
      } catch (error) {
        console.error(
          "USER ERROR:",
          error
        );

        localStorage.removeItem(
          "connectaUser"
        );

        window.location.href = "/";
      }
    };

    checkUser();
  }, []);

  /* ================================
     SEARCH + STATUS FILTER
  ================================= */

  useEffect(() => {
    const searchText =
      search.trim().toLowerCase();

    const result =
      applications.filter(
        (application) => {
          const matchesSearch =
            !searchText ||
            application.title
              .toLowerCase()
              .includes(searchText) ||
            application.company
              .toLowerCase()
              .includes(searchText) ||
            application.location
              .toLowerCase()
              .includes(searchText);

          const matchesStatus =
            statusFilter === "All" ||
            application.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );

    setFilteredApplications(result);
  }, [
    applications,
    search,
    statusFilter,
  ]);

  /* ================================
     UPDATE APPLICATION STATUS
  ================================= */

  const updateStatus = async (
    applicationId: string,
    status:
      | "Under Review"
      | "Accepted"
  ) => {
    try {
      setUpdatingId(applicationId);
      setMessage("");
      setError("");

      const response =
        await fetch(
          "/api/applications/status",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              applicationId,
              status,
            }),
          }
        );

      const contentType =
        response.headers.get(
          "content-type"
        );

      if (
        !contentType?.includes(
          "application/json"
        )
      ) {
        throw new Error(
          "Invalid server response."
        );
      }

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to update application."
        );
      }

      setApplications(
        (previous) =>
          previous.map(
            (application) =>
              application._id ===
              applicationId
                ? {
                    ...application,
                    status,
                  }
                : application
          )
      );

      setMessage(
        `Application marked as ${status}.`
      );
    } catch (error) {
      console.error(
        "UPDATE STATUS ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update application."
      );
    } finally {
      setUpdatingId("");
    }
  };

  /* ================================
     STATS
  ================================= */

  const totalApplications =
    applications.length;

  const appliedCount =
    applications.filter(
      (application) =>
        application.status === "Applied"
    ).length;

  const reviewCount =
    applications.filter(
      (application) =>
        application.status ===
        "Under Review"
    ).length;

  const acceptedCount =
    applications.filter(
      (application) =>
        application.status ===
        "Accepted"
    ).length;

  /* ================================
     UI
  ================================= */

  return (
    <main className="business-applications-page">
      <div className="applications-orb applications-orb-one" />
      <div className="applications-orb applications-orb-two" />
      <div className="applications-orb applications-orb-three" />

      <div className="business-applications-container">

        {/* HEADER */}

        <header className="applications-header">

          <div>

            <Link
              href="/dashboard"
              className="applications-back"
            >
              <ArrowLeft size={18} />
              Dashboard
            </Link>

            <div className="applications-title-row">

              <div className="applications-title-icon">
                <BriefcaseBusiness size={29} />
              </div>

              <div>

                <span className="applications-label">
                  CONNECTA BUSINESS
                </span>

                <h1>
                  Applications
                </h1>

                <p>
                  Review student applications
                  and manage your hiring process.
                </p>

              </div>

            </div>

          </div>

          <Link
            href="/post-job"
            className="post-new-job-button"
          >
            <BriefcaseBusiness size={18} />
            Post New Job
          </Link>

        </header>

        {/* STATS */}

        <section className="application-stats">

          <div className="application-stat-card">

            <div className="stat-icon purple">
              <User size={21} />
            </div>

            <div>
              <span>
                Total Applications
              </span>

              <strong>
                {totalApplications}
              </strong>
            </div>

          </div>

          <div className="application-stat-card">

            <div className="stat-icon blue">
              <Clock3 size={21} />
            </div>

            <div>
              <span>
                New Applications
              </span>

              <strong>
                {appliedCount}
              </strong>
            </div>

          </div>

          <div className="application-stat-card">

            <div className="stat-icon orange">
              <Eye size={21} />
            </div>

            <div>
              <span>
                Under Review
              </span>

              <strong>
                {reviewCount}
              </strong>
            </div>

          </div>

          <div className="application-stat-card">

            <div className="stat-icon green">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>
                Accepted
              </span>

              <strong>
                {acceptedCount}
              </strong>
            </div>

          </div>

        </section>

        {/* SEARCH */}

        <section className="applications-toolbar">

          <div className="applications-search">

            <Search size={20} />

            <input
              type="text"
              placeholder="Search applications..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
              >
                ×
              </button>
            )}

          </div>

          <div className="status-filters">

            {[
              "All",
              "Applied",
              "Under Review",
              "Accepted",
            ].map((status) => (

              <button
                key={status}
                className={
                  statusFilter === status
                    ? "status-filter active"
                    : "status-filter"
                }
                onClick={() =>
                  setStatusFilter(status)
                }
              >
                {status}
              </button>

            ))}

          </div>

        </section>

        {/* MESSAGES */}

        {error && (
          <div className="applications-message error">
            <span>!</span>
            {error}
          </div>
        )}

        {message && (
          <div className="applications-message success">
            <CheckCircle2 size={18} />
            {message}
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="applications-loading">

            <Loader2
              className="loading-icon"
              size={32}
            />

            <p>
              Loading applications...
            </p>

          </div>
        )}

        {/* APPLICATION LIST */}

        {!loading &&
          filteredApplications.length > 0 && (
            <section className="applications-list">

              <div className="applications-list-heading">

                <div>

                  <span>
                    STUDENT APPLICATIONS
                  </span>

                  <h2>
                    {filteredApplications.length}{" "}
                    Application
                    {filteredApplications.length !==
                    1
                      ? "s"
                      : ""}
                  </h2>

                </div>

                <button
                  className="refresh-applications"
                  onClick={loadApplications}
                  type="button"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>

              </div>

              {filteredApplications.map(
                (application) => (

                  <article
                    className="application-card"
                    key={application._id}
                  >

                    {/* STUDENT */}

                    <div className="student-section">

                      <div className="student-avatar">
                        <User size={25} />
                      </div>

                      <div>

                        <span className="student-label">
                          STUDENT APPLICATION
                        </span>

                        <h3>
                          Student #
                          {application.userId.slice(-6)}
                        </h3>

                        <p>
                          Applied for{" "}
                          <strong>
                            {application.title}
                          </strong>
                        </p>

                      </div>

                    </div>

                    {/* JOB */}

                    <div className="application-job">

                      <div className="job-small-icon">
                        <BriefcaseBusiness size={19} />
                      </div>

                      <div>

                        <span>
                          JOB
                        </span>

                        <h4>
                          {application.title}
                        </h4>

                        <p>
                          {application.company}
                        </p>

                      </div>

                    </div>

                    {/* DETAILS */}

                    <div className="application-details">

                      <div>
                        <MapPin size={16} />
                        <span>
                          {application.location}
                        </span>
                      </div>

                      <div>
                        <IndianRupee size={16} />
                        <span>
                          {application.pay}
                        </span>
                      </div>

                      <div>
                        <Clock3 size={16} />
                        <span>
                          {application.duration}
                        </span>
                      </div>

                    </div>

                    {/* STATUS */}

                    <div className="application-status">

                      <span
                        className={`status-badge ${application.status
                          .toLowerCase()
                          .replace(
                            " ",
                            "-"
                          )}`}
                      >
                        {application.status}
                      </span>

                      <small>
                        {new Date(
                          application.createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </small>

                    </div>

                    {/* ACTIONS */}

                    <div className="application-actions">

                      {application.status ===
                        "Applied" && (

                        <button
                          className="review-button"
                          disabled={
                            updatingId ===
                            application._id
                          }
                          onClick={() =>
                            updateStatus(
                              application._id,
                              "Under Review"
                            )
                          }
                        >

                          {updatingId ===
                          application._id ? (
                            <Loader2
                              className="button-loading"
                              size={17}
                            />
                          ) : (
                            <Eye size={17} />
                          )}

                          Review

                        </button>

                      )}

                      {application.status ===
                        "Under Review" && (

                        <button
                          className="accept-button"
                          disabled={
                            updatingId ===
                            application._id
                          }
                          onClick={() =>
                            updateStatus(
                              application._id,
                              "Accepted"
                            )
                          }
                        >

                          {updatingId ===
                          application._id ? (
                            <Loader2
                              className="button-loading"
                              size={17}
                            />
                          ) : (
                            <CheckCircle2 size={17} />
                          )}

                          Accept

                        </button>

                      )}

                      {application.status ===
                        "Accepted" && (

                        <div className="accepted-state">

                          <CheckCircle2 size={17} />

                          Hired

                        </div>

                      )}

                    </div>

                  </article>

                )
              )}

            </section>
          )}

        {/* EMPTY */}

        {!loading &&
          filteredApplications.length === 0 && (

            <section className="applications-empty">

              <div className="empty-applications-icon">
                <BriefcaseBusiness size={32} />
              </div>

              <h2>
                No applications found
              </h2>

              <p>
                {applications.length === 0
                  ? "Students who apply for your jobs will appear here."
                  : "Try changing your search or status filter."}
              </p>

              {applications.length === 0 ? (

                <Link href="/post-job">
                  Post a Job
                </Link>

              ) : (

                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                >
                  Clear Filters
                </button>

              )}

            </section>
          )}

      </div>
    </main>
  );
}