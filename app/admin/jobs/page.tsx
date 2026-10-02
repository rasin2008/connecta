"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Search,
  RefreshCw,
  Trash2,
  MapPin,
  IndianRupee,
  Clock3,
  UserRound,
  Plus,
} from "lucide-react";

import "./jobs.css";

type Job = {
  _id: string;
  jobId: number;
  title: string;
  company: string;
  description: string;
  category: string;
  location: string;
  pay: string;
  duration: string;
  postedBy: string;
  createdAt?: string;
};

export default function AdminJobsPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("all");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] =
    useState<string | null>(null);
  const [message, setMessage] = useState("");

  /* =========================================
     LOAD JOBS WHEN PAGE OPENS
  ========================================= */

  useEffect(() => {
    const savedUser =
      localStorage.getItem("connectaUser");

    /*
     * Demo Admin Access
     *
     * Even if no user is logged in,
     * /admin/jobs should open.
     */

    if (!savedUser) {
      loadJobs();
      return;
    }

    try {
      JSON.parse(savedUser);

      loadJobs();
    } catch (error) {
      console.error(
        "ADMIN JOB USER ERROR:",
        error
      );

      /*
       * Invalid localStorage data should
       * not redirect to Home.
       */

      loadJobs();
    }
  }, []);

  /* =========================================
     LOAD JOBS
  ========================================= */

  const loadJobs = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "/api/jobs/all",
        {
          cache: "no-store",
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

      const data = await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to load jobs"
        );
      }

      setJobs(
        Array.isArray(data.jobs)
          ? data.jobs
          : []
      );
    } catch (error) {
      console.error(
        "LOAD JOBS ERROR:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     DELETE JOB
  ========================================= */

  const deleteJob = async (
    id: string,
    title: string
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${title}"?`
      );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setMessage("");

      const response =
        await fetch(
          `/api/admin/jobs?id=${id}`,
          {
            method: "DELETE",
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
            "Failed to delete job"
        );
      }

      setJobs(
        (currentJobs) =>
          currentJobs.filter(
            (job) =>
              job._id !== id
          )
      );

      setMessage(
        "Job deleted successfully."
      );
    } catch (error) {
      console.error(
        "DELETE JOB ERROR:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete job."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================================
     GET CATEGORIES
  ========================================= */

  const categories = useMemo(() => {
    const uniqueCategories =
      jobs
        .map(
          (job) =>
            job.category
        )
        .filter(Boolean);

    return [
      "all",
      ...Array.from(
        new Set(uniqueCategories)
      ),
    ];
  }, [jobs]);

  /* =========================================
     FILTER JOBS
  ========================================= */

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchValue =
        search
          .toLowerCase()
          .trim();

      const matchesSearch =
        !searchValue ||
        job.title
          ?.toLowerCase()
          .includes(searchValue) ||
        job.company
          ?.toLowerCase()
          .includes(searchValue) ||
        job.location
          ?.toLowerCase()
          .includes(searchValue) ||
        job.category
          ?.toLowerCase()
          .includes(searchValue);

      const matchesCategory =
        categoryFilter ===
          "all" ||
        job.category ===
          categoryFilter;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    jobs,
    search,
    categoryFilter,
  ]);

  /* =========================================
     PAGE
  ========================================= */

  return (
    <main className="admin-jobs-page">

      {/* =====================================
          BACKGROUND
      ===================================== */}

      <div className="admin-jobs-background">

        <div className="admin-jobs-glow jobs-glow-one" />

        <div className="admin-jobs-glow jobs-glow-two" />

      </div>

      {/* =====================================
          MAIN CONTAINER
      ===================================== */}

      <section className="admin-jobs-container">

        {/* ===================================
            HEADER
        =================================== */}

        <header className="admin-jobs-header">

          {/* Back */}

          <button
            type="button"
            className="jobs-back-button"
            onClick={() =>
              router.push("/admin")
            }
          >
            <ArrowLeft size={19} />

            <span>
              Admin Dashboard
            </span>
          </button>

          {/* Title */}

          <div className="jobs-header-title">

            <div className="jobs-title-icon">
              <BriefcaseBusiness
                size={25}
              />
            </div>

            <div>

              <p className="jobs-small-label">
                CONNECTA ADMIN
              </p>

              <h1>
                Jobs Management
              </h1>

              <p>
                Manage all jobs posted
                on CONNECTA.
              </p>

            </div>

          </div>

          {/* Header Actions */}

          <div className="jobs-header-actions">

            {/* Refresh */}

            <button
              type="button"
              className="jobs-refresh-button"
              onClick={loadJobs}
              disabled={loading}
            >
              <RefreshCw
                size={18}
                className={
                  loading
                    ? "jobs-refresh-spinning"
                    : ""
                }
              />

              {loading
                ? "Loading..."
                : "Refresh"}
            </button>

            {/* Post Job */}

            <button
              type="button"
              className="jobs-post-button"
              onClick={() =>
                router.push(
                  "/post-job"
                )
              }
            >
              <Plus size={18} />

              Post Job
            </button>

          </div>

        </header>

        {/* ===================================
            STATS
        =================================== */}

        <section className="jobs-stats">

          {/* Total Jobs */}

          <div className="jobs-stat-card">

            <div className="jobs-stat-icon purple">

              <BriefcaseBusiness
                size={22}
              />

            </div>

            <div>

              <span>
                Total Jobs
              </span>

              <strong>
                {jobs.length}
              </strong>

            </div>

          </div>

          {/* Locations */}

          <div className="jobs-stat-card">

            <div className="jobs-stat-icon blue">

              <MapPin size={22} />

            </div>

            <div>

              <span>
                Locations
              </span>

              <strong>
                {
                  new Set(
                    jobs
                      .map(
                        (job) =>
                          job.location
                      )
                      .filter(Boolean)
                  ).size
                }
              </strong>

            </div>

          </div>

          {/* Companies */}

          <div className="jobs-stat-card">

            <div className="jobs-stat-icon pink">

              <UserRound size={22} />

            </div>

            <div>

              <span>
                Companies
              </span>

              <strong>
                {
                  new Set(
                    jobs
                      .map(
                        (job) =>
                          job.company
                      )
                      .filter(Boolean)
                  ).size
                }
              </strong>

            </div>

          </div>

        </section>

        {/* ===================================
            TOOLBAR
        =================================== */}

        <section className="jobs-toolbar">

          {/* Search */}

          <div className="jobs-search-box">

            <Search size={19} />

            <input
              type="text"
              placeholder="Search jobs, companies, location..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

          {/* Category Buttons */}

          <div className="jobs-category-buttons">

            {categories
              .slice(0, 7)
              .map(
                (category) => (

                  <button
                    type="button"
                    key={category}
                    className={
                      categoryFilter ===
                      category
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setCategoryFilter(
                        category
                      )
                    }
                  >

                    {category ===
                    "all"
                      ? "All"
                      : category}

                  </button>

                )
              )}

          </div>

        </section>

        {/* ===================================
            MESSAGE
        =================================== */}

        {message && (
          <div className="jobs-message">
            {message}
          </div>
        )}

        {/* ===================================
            JOBS CARD
        =================================== */}

        <section className="admin-jobs-card">

          {/* Card Header */}

          <div className="admin-jobs-card-header">

            <div>

              <h2>
                Posted Jobs
              </h2>

              <p>
                Showing{" "}
                {filteredJobs.length}{" "}
                of{" "}
                {jobs.length} jobs
              </p>

            </div>

            <span className="jobs-count-badge">
              {filteredJobs.length}
            </span>

          </div>

          {/* =================================
              LOADING
          ================================= */}

          {loading ? (

            <div className="jobs-loading">

              <RefreshCw
                className="jobs-loading-icon"
                size={30}
              />

              <p>
                Loading jobs...
              </p>

            </div>

          ) : filteredJobs.length ===
            0 ? (

            /* ===============================
               EMPTY
            =============================== */

            <div className="jobs-empty">

              <BriefcaseBusiness
                size={45}
              />

              <h3>
                No jobs found
              </h3>

              <p>
                Try changing your
                search or category.
              </p>

            </div>

          ) : (

            /* ===============================
               JOB GRID
            =============================== */

            <div className="jobs-grid">

              {filteredJobs.map(
                (job) => (

                  <article
                    className="admin-job-card"
                    key={job._id}
                  >

                    {/* Job Top */}

                    <div className="job-card-top">

                      <div className="job-company-icon">

                        {job.company
                          ?.charAt(0)
                          .toUpperCase() ||
                          "C"}

                      </div>

                      <div className="job-heading">

                        <h3>
                          {job.title}
                        </h3>

                        <p>
                          {job.company}
                        </p>

                      </div>

                      <span className="job-category-badge">

                        {job.category}

                      </span>

                    </div>

                    {/* Description */}

                    <p className="job-description">
                      {job.description}
                    </p>

                    {/* Job Details */}

                    <div className="job-details-grid">

                      {/* Location */}

                      <div className="job-detail">

                        <MapPin
                          size={16}
                        />

                        <div>

                          <span>
                            Location
                          </span>

                          <strong>
                            {job.location}
                          </strong>

                        </div>

                      </div>

                      {/* Pay */}

                      <div className="job-detail">

                        <IndianRupee
                          size={16}
                        />

                        <div>

                          <span>
                            Pay
                          </span>

                          <strong>
                            {job.pay}
                          </strong>

                        </div>

                      </div>

                      {/* Duration */}

                      <div className="job-detail">

                        <Clock3
                          size={16}
                        />

                        <div>

                          <span>
                            Duration
                          </span>

                          <strong>
                            {job.duration}
                          </strong>

                        </div>

                      </div>

                      {/* Posted By */}

                      <div className="job-detail">

                        <UserRound
                          size={16}
                        />

                        <div>

                          <span>
                            Posted By
                          </span>

                          <strong>
                            {job.postedBy}
                          </strong>

                        </div>

                      </div>

                    </div>

                    {/* Footer */}

                    <div className="job-card-footer">

                      <span className="job-posted-date">

                        Posted{" "}

                        {job.createdAt
                          ? new Date(
                              job.createdAt
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "—"}

                      </span>

                      {/* Delete */}

                      <button
                        type="button"
                        className="job-delete-button"
                        onClick={() =>
                          deleteJob(
                            job._id,
                            job.title
                          )
                        }
                        disabled={
                          deletingId ===
                          job._id
                        }
                      >

                        <Trash2
                          size={16}
                        />

                        {deletingId ===
                        job._id
                          ? "Deleting..."
                          : "Delete"}

                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>

      </section>

    </main>
  );
}