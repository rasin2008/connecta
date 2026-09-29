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
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("connectaUser");

    if (!savedUser) {
      router.replace("/");
      return;
    }

    loadJobs();
  }, [router]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/jobs/all");

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load jobs");
      }

      setJobs(data.jobs || []);
    } catch (error) {
      console.error("LOAD JOBS ERROR:", error);
      setMessage("Unable to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id: string, title: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setMessage("");

      const response = await fetch(`/api/admin/jobs?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete job");
      }

      setJobs((currentJobs) =>
        currentJobs.filter((job) => job._id !== id)
      );

      setMessage("Job deleted successfully.");
    } catch (error) {
      console.error("DELETE JOB ERROR:", error);
      setMessage("Failed to delete job.");
    } finally {
      setDeletingId(null);
    }
  };

  const categories = useMemo(() => {
    const uniqueCategories = jobs
      .map((job) => job.category)
      .filter(Boolean);

    return ["all", ...Array.from(new Set(uniqueCategories))];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        job.title?.toLowerCase().includes(searchValue) ||
        job.company?.toLowerCase().includes(searchValue) ||
        job.location?.toLowerCase().includes(searchValue) ||
        job.category?.toLowerCase().includes(searchValue);

      const matchesCategory =
        categoryFilter === "all" ||
        job.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [jobs, search, categoryFilter]);

  return (
    <main className="admin-jobs-page">
      <div className="admin-jobs-background">
        <div className="admin-jobs-glow jobs-glow-one" />
        <div className="admin-jobs-glow jobs-glow-two" />
      </div>

      <section className="admin-jobs-container">

        {/* Header */}
        <header className="admin-jobs-header">

          <button
            className="jobs-back-button"
            onClick={() => router.push("/admin")}
          >
            <ArrowLeft size={19} />
            <span>Admin Dashboard</span>
          </button>

          <div className="jobs-header-title">

            <div className="jobs-title-icon">
              <BriefcaseBusiness size={25} />
            </div>

            <div>
              <p className="jobs-small-label">
                CONNECTA ADMIN
              </p>

              <h1>Jobs Management</h1>

              <p>
                Manage all jobs posted on CONNECTA.
              </p>
            </div>

          </div>

          <div className="jobs-header-actions">

            <button
              className="jobs-refresh-button"
              onClick={loadJobs}
            >
              <RefreshCw size={18} />
              Refresh
            </button>

            <button
              className="jobs-post-button"
              onClick={() => router.push("/post-job")}
            >
              <Plus size={18} />
              Post Job
            </button>

          </div>

        </header>

        {/* Stats */}
        <section className="jobs-stats">

          <div className="jobs-stat-card">

            <div className="jobs-stat-icon purple">
              <BriefcaseBusiness size={22} />
            </div>

            <div>
              <span>Total Jobs</span>
              <strong>{jobs.length}</strong>
            </div>

          </div>

          <div className="jobs-stat-card">

            <div className="jobs-stat-icon blue">
              <MapPin size={22} />
            </div>

            <div>
              <span>Locations</span>
              <strong>
                {
                  new Set(
                    jobs
                      .map((job) => job.location)
                      .filter(Boolean)
                  ).size
                }
              </strong>
            </div>

          </div>

          <div className="jobs-stat-card">

            <div className="jobs-stat-icon pink">
              <UserRound size={22} />
            </div>

            <div>
              <span>Companies</span>
              <strong>
                {
                  new Set(
                    jobs
                      .map((job) => job.company)
                      .filter(Boolean)
                  ).size
                }
              </strong>
            </div>

          </div>

        </section>

        {/* Toolbar */}
        <section className="jobs-toolbar">

          <div className="jobs-search-box">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search jobs, companies, location..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="jobs-category-buttons">

            {categories.slice(0, 7).map((category) => (
              <button
                key={category}
                className={
                  categoryFilter === category
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setCategoryFilter(category)
                }
              >
                {category === "all"
                  ? "All"
                  : category}
              </button>
            ))}

          </div>

        </section>

        {/* Message */}
        {message && (
          <div className="jobs-message">
            {message}
          </div>
        )}

        {/* Jobs */}
        <section className="admin-jobs-card">

          <div className="admin-jobs-card-header">

            <div>
              <h2>Posted Jobs</h2>

              <p>
                Showing {filteredJobs.length} of{" "}
                {jobs.length} jobs
              </p>
            </div>

            <span className="jobs-count-badge">
              {filteredJobs.length}
            </span>

          </div>

          {loading ? (
            <div className="jobs-loading">

              <RefreshCw
                className="jobs-loading-icon"
                size={30}
              />

              <p>Loading jobs...</p>

            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="jobs-empty">

              <BriefcaseBusiness size={45} />

              <h3>No jobs found</h3>

              <p>
                Try changing your search or category.
              </p>

            </div>
          ) : (
            <div className="jobs-grid">

              {filteredJobs.map((job) => (

                <article
                  className="admin-job-card"
                  key={job._id}
                >

                  <div className="job-card-top">

                    <div className="job-company-icon">
                      {job.company
                        ?.charAt(0)
                        .toUpperCase() || "C"}
                    </div>

                    <div className="job-heading">

                      <h3>{job.title}</h3>

                      <p>{job.company}</p>

                    </div>

                    <span className="job-category-badge">
                      {job.category}
                    </span>

                  </div>

                  <p className="job-description">
                    {job.description}
                  </p>

                  <div className="job-details-grid">

                    <div className="job-detail">

                      <MapPin size={16} />

                      <div>
                        <span>Location</span>
                        <strong>
                          {job.location}
                        </strong>
                      </div>

                    </div>

                    <div className="job-detail">

                      <IndianRupee size={16} />

                      <div>
                        <span>Pay</span>
                        <strong>
                          {job.pay}
                        </strong>
                      </div>

                    </div>

                    <div className="job-detail">

                      <Clock3 size={16} />

                      <div>
                        <span>Duration</span>
                        <strong>
                          {job.duration}
                        </strong>
                      </div>

                    </div>

                    <div className="job-detail">

                      <UserRound size={16} />

                      <div>
                        <span>Posted By</span>
                        <strong>
                          {job.postedBy}
                        </strong>
                      </div>

                    </div>

                  </div>

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

                    <button
                      className="job-delete-button"
                      onClick={() =>
                        deleteJob(
                          job._id,
                          job.title
                        )
                      }
                      disabled={
                        deletingId === job._id
                      }
                    >
                      <Trash2 size={16} />

                      {deletingId === job._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>

                </article>

              ))}

            </div>
          )}

        </section>

      </section>
    </main>
  );
}