"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BriefcaseBusiness,
  Users,
  Clock3,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  MapPin,
  IndianRupee,
  Sparkles,
  FileText,
} from "lucide-react";

import "./dashboard.css";

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
  createdAt: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState("Business");

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const savedUser = localStorage.getItem("connectaUser");

      if (!savedUser) {
        router.replace("/");
        return;
      }

      let user;

      try {
        user = JSON.parse(savedUser);
      } catch {
        localStorage.removeItem("connectaUser");
        router.replace("/");
        return;
      }

      if (user.role !== "business") {
        router.replace("/");
        return;
      }

      const businessId =
        user.id ||
        user._id ||
        user.userId;

      setBusinessName(user.name || "Business");

      if (!businessId) {
        console.error("Business ID missing");
        setLoading(false);
        return;
      }

      // -----------------------------------------
      // FETCH APPLICATIONS
      // -----------------------------------------

      const applicationsResponse = await fetch(
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
          "Invalid applications response"
        );
      }

      const applicationsData =
        await applicationsResponse.json();

      if (
        applicationsResponse.ok &&
        applicationsData.success
      ) {
        const allApplications =
          applicationsData.applications || [];

        setApplications(allApplications);
      } else {
        setApplications([]);
      }

      // -----------------------------------------
      // FETCH JOBS
      // -----------------------------------------

      const jobsResponse = await fetch(
        "/api/jobs/all",
        {
          cache: "no-store",
        }
      );

      const jobsContentType =
        jobsResponse.headers.get(
          "content-type"
        );

      if (
        !jobsContentType?.includes(
          "application/json"
        )
      ) {
        throw new Error(
          "Invalid jobs response"
        );
      }

      const jobsData = await jobsResponse.json();

      if (jobsResponse.ok && jobsData.success) {
        const allJobs: Job[] =
          jobsData.jobs || [];

        // Only jobs posted by this business
        const businessJobs = allJobs.filter(
          (job) =>
            String(job.postedBy) ===
            String(businessId)
        );

        setJobs(businessJobs);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error(
        "Dashboard loading error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [router]);

  // -----------------------------------------
  // APPLICATION STATS
  // -----------------------------------------

  const totalApplications =
    applications.length;

  const applied = applications.filter(
    (item) => item.status === "Applied"
  ).length;

  const underReview = applications.filter(
    (item) =>
      item.status === "Under Review"
  ).length;

  const accepted = applications.filter(
    (item) => item.status === "Accepted"
  ).length;

  // -----------------------------------------
  // REAL JOB COUNT
  // -----------------------------------------

  const totalJobs = jobs.length;

  // -----------------------------------------
  // APPLICATION PERCENTAGES
  // -----------------------------------------

  const appliedPercentage =
    totalApplications > 0
      ? (applied / totalApplications) * 100
      : 0;

  const reviewPercentage =
    totalApplications > 0
      ? (underReview / totalApplications) * 100
      : 0;

  const acceptedPercentage =
    totalApplications > 0
      ? (accepted / totalApplications) * 100
      : 0;

  return (
    <main className="dashboard-page">

      {/* 3D BACKGROUND */}
      <div className="dashboard-orb orb-1" />
      <div className="dashboard-orb orb-2" />
      <div className="dashboard-orb orb-3" />

      <div className="dashboard-wrapper">

        {/* HEADER */}
        <header className="dashboard-header">

          <div>
            <div className="dashboard-tag">
              <Sparkles size={14} />
              CONNECTA BUSINESS
            </div>

            <h1>
              Welcome back,{" "}
              <span>{businessName}</span>
            </h1>

            <p>
              Manage your applications and hiring
              activity from one dashboard.
            </p>
          </div>

          <button
            className="refresh-btn"
            onClick={loadDashboard}
            disabled={loading}
          >
            <RefreshCw
              size={18}
              className={
                loading ? "rotate" : ""
              }
            />

            Refresh
          </button>

        </header>

        {/* STATS */}
        <section className="stats-grid">

          {/* TOTAL JOBS */}
          <div className="stat-card blue">

            <div className="stat-icon">
              <BriefcaseBusiness size={25} />
            </div>

            <span>Total Jobs</span>

            <strong>
              {loading ? "..." : totalJobs}
            </strong>

            <small>
              Jobs posted by your business
            </small>

          </div>

          {/* APPLICATIONS */}
          <div className="stat-card purple">

            <div className="stat-icon">
              <FileText size={25} />
            </div>

            <span>Total Applications</span>

            <strong>
              {loading
                ? "..."
                : totalApplications}
            </strong>

            <small>
              Applications received
            </small>

          </div>

          {/* UNDER REVIEW */}
          <div className="stat-card orange">

            <div className="stat-icon">
              <Clock3 size={25} />
            </div>

            <span>Under Review</span>

            <strong>
              {loading
                ? "..."
                : underReview}
            </strong>

            <small>
              Waiting for decision
            </small>

          </div>

          {/* ACCEPTED */}
          <div className="stat-card green">

            <div className="stat-icon">
              <CheckCircle2 size={25} />
            </div>

            <span>Accepted</span>

            <strong>
              {loading
                ? "..."
                : accepted}
            </strong>

            <small>
              Successfully accepted
            </small>

          </div>

        </section>

        {/* MAIN CONTENT */}
        <section className="dashboard-content">

          {/* APPLICATIONS */}
          <div className="applications-box">

            <div className="box-header">

              <div>

                <span>
                  APPLICATION ACTIVITY
                </span>

                <h2>
                  Recent Applications
                </h2>

                <p>
                  Students who recently applied
                  for your jobs.
                </p>

              </div>

              <Link
                href="/business-applications"
                className="view-all-btn"
              >
                View All
                <ArrowRight size={16} />
              </Link>

            </div>

            {/* LOADING */}
            {loading ? (

              <div className="loading-box">

                <div className="loading-spinner" />

                <p>
                  Loading applications...
                </p>

              </div>

            ) : applications.length === 0 ? (

              /* EMPTY */
              <div className="empty-box">

                <div className="empty-icon">
                  <Users size={30} />
                </div>

                <h3>
                  No applications yet
                </h3>

                <p>
                  Student applications will
                  appear here.
                </p>

              </div>

            ) : (

              /* APPLICATION LIST */
              <div className="application-list">

                {applications
                  .slice(0, 6)
                  .map((application) => (

                    <div
                      className="application-card"
                      key={application._id}
                    >

                      <div className="app-avatar">
                        {application.title
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="app-details">

                        <h3>
                          {application.title}
                        </h3>

                        <p>
                          <MapPin size={14} />
                          {application.location}
                        </p>

                        <div className="app-meta">

                          <span>
                            <IndianRupee size={12} />
                            {application.pay}
                          </span>

                          <span>
                            {application.duration}
                          </span>

                        </div>

                      </div>

                      <div
                        className={`status ${application.status
                          .toLowerCase()
                          .replace(
                            " ",
                            "-"
                          )}`}
                      >
                        {application.status}
                      </div>

                    </div>

                  ))}

              </div>

            )}

          </div>

          {/* RIGHT SIDE */}
          <aside className="dashboard-side">

            {/* STATUS */}
            <div className="status-box">

              <span>
                APPLICATION STATUS
              </span>

              <h2>
                Hiring Overview
              </h2>

              <div className="status-circle">

                <div>

                  <strong>
                    {loading
                      ? "..."
                      : totalApplications}
                  </strong>

                  <small>
                    Applications
                  </small>

                </div>

              </div>

              <div className="status-list">

                {/* APPLIED */}
                <div className="status-line">

                  <div>
                    <i className="dot blue-dot" />
                    Applied
                  </div>

                  <strong>
                    {applied}
                  </strong>

                </div>

                <div className="progress">

                  <div
                    style={{
                      width:
                        loading
                          ? "0%"
                          : `${appliedPercentage}%`,
                    }}
                    className="progress-blue"
                  />

                </div>

                {/* UNDER REVIEW */}
                <div className="status-line">

                  <div>
                    <i className="dot orange-dot" />
                    Under Review
                  </div>

                  <strong>
                    {underReview}
                  </strong>

                </div>

                <div className="progress">

                  <div
                    style={{
                      width:
                        loading
                          ? "0%"
                          : `${reviewPercentage}%`,
                    }}
                    className="progress-orange"
                  />

                </div>

                {/* ACCEPTED */}
                <div className="status-line">

                  <div>
                    <i className="dot green-dot" />
                    Accepted
                  </div>

                  <strong>
                    {accepted}
                  </strong>

                </div>

                <div className="progress">

                  <div
                    style={{
                      width:
                        loading
                          ? "0%"
                          : `${acceptedPercentage}%`,
                    }}
                    className="progress-green"
                  />

                </div>

              </div>

            </div>

            {/* QUICK ACTION */}
            <div className="quick-card">

              <div className="quick-icon">
                <Users size={25} />
              </div>

              <span>
                HIRING
              </span>

              <h3>
                Manage Applications
              </h3>

              <p>
                Review students and update
                their application status.
              </p>

              <Link href="/business-applications">
                Open Applications
                <ArrowRight size={16} />
              </Link>

            </div>

          </aside>

        </section>

        {/* BOTTOM */}
        <section className="bottom-grid">

          {/* ACTIVE JOBS */}
          <div className="bottom-card">

            <div className="bottom-icon blue-icon">
              <BriefcaseBusiness size={22} />
            </div>

            <div>

              <span>
                ACTIVE JOBS
              </span>

              <strong>
                {loading
                  ? "..."
                  : totalJobs}
              </strong>

              <p>
                Jobs posted by business
              </p>

            </div>

          </div>

          {/* CANDIDATES */}
          <div className="bottom-card">

            <div className="bottom-icon purple-icon">
              <Users size={22} />
            </div>

            <div>

              <span>
                CANDIDATES
              </span>

              <strong>
                {loading
                  ? "..."
                  : totalApplications}
              </strong>

              <p>
                Students applied
              </p>

            </div>

          </div>

          {/* HIRED */}
          <div className="bottom-card">

            <div className="bottom-icon green-icon">
              <CheckCircle2 size={22} />
            </div>

            <div>

              <span>
                HIRED
              </span>

              <strong>
                {loading
                  ? "..."
                  : accepted}
              </strong>

              <p>
                Accepted applications
              </p>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}