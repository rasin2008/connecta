"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Users,
  Building2,
  FileText,
  CreditCard,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  RefreshCw,
  Search,
  ArrowRight,
  UserRound,
} from "lucide-react";

import "./admin.css";

type UserData = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: "student" | "business";
  location?: string;
  createdAt?: string;
};

type Job = {
  _id?: string;
  jobId: number;
  title: string;
  company: string;
  location: string;
  pay: string;
  duration: string;
  category: string;
  createdAt?: string;
};

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

type Payment = {
  _id?: string;
  userId: string;
  jobId: number;
  amount: number;
  method: "UPI" | "Card" | "Net Banking";
  status: "Pending" | "Success" | "Failed";
  createdAt?: string;
};

export default function AdminPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");

  const [adminUser, setAdminUser] = useState<UserData | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("connectaUser");

    if (!savedUser) {
      window.location.href = "/";
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      /*
       * Demo admin access.
       *
       * For now, the admin page is accessible from a
       * logged-in CONNECTA account.
       *
       * Later we can add role: "admin" to the User model.
       */

      setAdminUser(user);
      loadAdminData();
    } catch (error) {
      console.error("ADMIN USER ERROR:", error);
      window.location.href = "/";
    }
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);

      const [
        usersResponse,
        jobsResponse,
        applicationsResponse,
      ] = await Promise.all([
        fetch("/api/admin/users", {
          cache: "no-store",
        }),

        fetch("/api/jobs/all", {
          cache: "no-store",
        }),

        fetch("/api/applications/all", {
          cache: "no-store",
        }),
      ]);

      /*
       * USERS
       */

      if (usersResponse.ok) {
        const usersContentType =
          usersResponse.headers.get("content-type");

        if (
          usersContentType?.includes(
            "application/json"
          )
        ) {
          const usersData =
            await usersResponse.json();

          if (
            usersData.success &&
            Array.isArray(usersData.users)
          ) {
            setUsers(usersData.users);
          }
        }
      }

      /*
       * JOBS
       */

      if (jobsResponse.ok) {
        const jobsContentType =
          jobsResponse.headers.get("content-type");

        if (
          jobsContentType?.includes(
            "application/json"
          )
        ) {
          const jobsData =
            await jobsResponse.json();

          if (
            jobsData.success &&
            Array.isArray(jobsData.jobs)
          ) {
            setJobs(jobsData.jobs);
          }
        }
      }

      /*
       * APPLICATIONS
       */

      if (applicationsResponse.ok) {
        const applicationsContentType =
          applicationsResponse.headers.get(
            "content-type"
          );

        if (
          applicationsContentType?.includes(
            "application/json"
          )
        ) {
          const applicationsData =
            await applicationsResponse.json();

          if (
            applicationsData.success &&
            Array.isArray(
              applicationsData.applications
            )
          ) {
            setApplications(
              applicationsData.applications
            );
          }
        }
      }

      /*
       * PAYMENTS
       *
       * Payment API is user-specific, so the admin
       * dashboard keeps payment data empty until
       * the admin payments API is added.
       */

      setPayments([]);
    } catch (error) {
      console.error(
        "ADMIN DATA LOAD ERROR:",
        error
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAdminData();
  };

  const studentCount = users.filter(
    (user) => user.role === "student"
  ).length;

  const businessCount = users.filter(
    (user) => user.role === "business"
  ).length;

  const acceptedCount = applications.filter(
    (application) =>
      application.status === "Accepted"
  ).length;

  const reviewCount = applications.filter(
    (application) =>
      application.status === "Under Review"
  ).length;

  const appliedCount = applications.filter(
    (application) =>
      application.status === "Applied"
  ).length;

  const successfulPayments = payments.filter(
    (payment) => payment.status === "Success"
  );

  const totalPaymentAmount =
    successfulPayments.reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );

  const filteredUsers = users.filter((user) => {
    const text = search
      .trim()
      .toLowerCase();

    if (!text) return true;

    return (
      user.name
        .toLowerCase()
        .includes(text) ||
      user.email
        .toLowerCase()
        .includes(text) ||
      user.role
        .toLowerCase()
        .includes(text)
    );
  });

  const recentJobs = [...jobs]
    .sort((a, b) => {
      const first = a.createdAt
        ? new Date(a.createdAt).getTime()
        : 0;

      const second = b.createdAt
        ? new Date(b.createdAt).getTime()
        : 0;

      return second - first;
    })
    .slice(0, 5);

  const recentApplications = [
    ...applications,
  ]
    .sort((a, b) => {
      const first = new Date(
        a.createdAt
      ).getTime();

      const second = new Date(
        b.createdAt
      ).getTime();

      return second - first;
    })
    .slice(0, 5);

  if (!adminUser) {
    return (
      <main className="admin-page">
        <div className="admin-loading">
          <RefreshCw
            size={32}
            className="admin-loading-icon"
          />

          <h2>Loading Admin Panel...</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">

      {/* Background */}
      <div className="admin-orb admin-orb-one" />
      <div className="admin-orb admin-orb-two" />
      <div className="admin-orb admin-orb-three" />

      <div className="admin-container">

        {/* Header */}

        <header className="admin-header">

          <div className="admin-header-left">

            <Link
              href="/"
              className="admin-back"
            >
              <ArrowLeft size={18} />
              Home
            </Link>

            <div className="admin-title-row">

              <div className="admin-title-icon">
                <ShieldCheck size={30} />
              </div>

              <div>
                <span className="admin-label">
                  CONNECTA ADMIN
                </span>

                <h1>
                  Admin Dashboard
                </h1>

                <p>
                  Manage users, jobs,
                  applications and platform activity.
                </p>
              </div>

            </div>

          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              size={18}
              className={
                refreshing
                  ? "refresh-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </header>

        {/* Welcome */}

        <section className="admin-welcome">

          <div className="welcome-icon">
            <ShieldCheck size={25} />
          </div>

          <div>
            <span>
              ADMIN CONTROL CENTER
            </span>

            <h2>
              Welcome, {adminUser.name || "Admin"}
            </h2>

            <p>
              Monitor CONNECTA activity from
              one place.
            </p>
          </div>

        </section>

        {/* Main Stats */}

        <section className="admin-stats">

          <div className="admin-stat-card purple-card">

            <div className="admin-stat-icon">
              <Users size={23} />
            </div>

            <div>
              <span>Total Users</span>

              <strong>
                {loading ? "..." : users.length}
              </strong>

              <small>
                {studentCount} students
              </small>
            </div>

          </div>

          <div className="admin-stat-card blue-card">

            <div className="admin-stat-icon">
              <Building2 size={23} />
            </div>

            <div>
              <span>Businesses</span>

              <strong>
                {loading
                  ? "..."
                  : businessCount}
              </strong>

              <small>
                Registered businesses
              </small>
            </div>

          </div>

          <div className="admin-stat-card orange-card">

            <div className="admin-stat-icon">
              <BriefcaseBusiness size={23} />
            </div>

            <div>
              <span>Total Jobs</span>

              <strong>
                {loading
                  ? "..."
                  : jobs.length}
              </strong>

              <small>
                Posted opportunities
              </small>
            </div>

          </div>

          <div className="admin-stat-card green-card">

            <div className="admin-stat-icon">
              <FileText size={23} />
            </div>

            <div>
              <span>Applications</span>

              <strong>
                {loading
                  ? "..."
                  : applications.length}
              </strong>

              <small>
                Student applications
              </small>
            </div>

          </div>

        </section>

        {/* Secondary Stats */}

        <section className="admin-secondary-stats">

          <div className="secondary-stat">

            <div className="secondary-icon applied">
              <Clock3 size={20} />
            </div>

            <div>
              <span>New Applications</span>
              <strong>{appliedCount}</strong>
            </div>

          </div>

          <div className="secondary-stat">

            <div className="secondary-icon review">
              <EyeIcon />
            </div>

            <div>
              <span>Under Review</span>
              <strong>{reviewCount}</strong>
            </div>

          </div>

          <div className="secondary-stat">

            <div className="secondary-icon accepted">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Accepted</span>
              <strong>{acceptedCount}</strong>
            </div>

          </div>

          <div className="secondary-stat">

            <div className="secondary-icon payment">
              <CreditCard size={20} />
            </div>

            <div>
              <span>Payments</span>
              <strong>
                ₹{totalPaymentAmount.toLocaleString("en-IN")}
              </strong>
            </div>

          </div>

        </section>

        {/* Main Grid */}

        <section className="admin-main-grid">

          {/* Recent Jobs */}

          <div className="admin-panel">

            <div className="panel-header">

              <div>

                <span>
                  PLATFORM
                </span>

                <h2>
                  Recent Jobs
                </h2>

              </div>

              <Link
                href="/find-jobs"
                className="panel-view-all"
              >
                View All
                <ArrowRight size={16} />
              </Link>

            </div>

            {recentJobs.length === 0 ? (

              <div className="admin-empty">
                <BriefcaseBusiness size={30} />
                <p>No jobs found.</p>
              </div>

            ) : (

              <div className="admin-list">

                {recentJobs.map((job) => (

                  <div
                    className="admin-list-item"
                    key={
                      job._id ||
                      job.jobId
                    }
                  >

                    <div className="list-icon job">
                      <BriefcaseBusiness size={19} />
                    </div>

                    <div className="list-content">

                      <strong>
                        {job.title}
                      </strong>

                      <span>
                        {job.company}
                      </span>

                    </div>

                    <div className="list-meta">

                      <strong>
                        {job.pay}
                      </strong>

                      <span>
                        {job.location}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* Recent Applications */}

          <div className="admin-panel">

            <div className="panel-header">

              <div>

                <span>
                  STUDENTS
                </span>

                <h2>
                  Recent Applications
                </h2>

              </div>

              <Link
                href="/business-applications"
                className="panel-view-all"
              >
                View All
                <ArrowRight size={16} />
              </Link>

            </div>

            {recentApplications.length === 0 ? (

              <div className="admin-empty">
                <FileText size={30} />
                <p>
                  No applications found.
                </p>
              </div>

            ) : (

              <div className="admin-list">

                {recentApplications.map(
                  (application) => (

                    <div
                      className="admin-list-item"
                      key={application._id}
                    >

                      <div className="list-icon application">
                        <UserRound size={19} />
                      </div>

                      <div className="list-content">

                        <strong>
                          Student #
                          {application.userId.slice(-6)}
                        </strong>

                        <span>
                          {application.title}
                        </span>

                      </div>

                      <div className="list-status">

                        <span
                          className={`admin-status ${application.status
                            .toLowerCase()
                            .replace(
                              " ",
                              "-"
                            )}`}
                        >
                          {application.status}
                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </section>

        {/* Users */}

        <section className="admin-panel users-panel">

          <div className="panel-header">

            <div>

              <span>
                ACCOUNTS
              </span>

              <h2>
                Users
              </h2>

            </div>

            <div className="users-count">
              {users.length} users
            </div>

          </div>

          <div className="admin-search">

            <Search size={19} />

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
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

          {filteredUsers.length === 0 ? (

            <div className="admin-empty">
              <Users size={30} />

              <p>
                No users found.
              </p>
            </div>

          ) : (

            <div className="users-table-wrapper">

              <table className="users-table">

                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Location</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredUsers
                    .slice(0, 10)
                    .map((user) => (

                      <tr
                        key={
                          user._id ||
                          user.id ||
                          user.email
                        }
                      >

                        <td>

                          <div className="table-user">

                            <div className="table-avatar">
                              <UserRound size={18} />
                            </div>

                            <strong>
                              {user.name}
                            </strong>

                          </div>

                        </td>

                        <td>
                          {user.email}
                        </td>

                        <td>

                          <span
                            className={`role-badge ${user.role}`}
                          >
                            {user.role}
                          </span>

                        </td>

                        <td>
                          {user.location || "—"}
                        </td>

                      </tr>

                    ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* Quick Actions */}

        <section className="quick-actions">

          <Link
            href="/post-job"
            className="quick-action-card"
          >

            <div className="quick-action-icon purple">
              <BriefcaseBusiness size={22} />
            </div>

            <div>
              <strong>
                Post New Job
              </strong>

              <span>
                Create a new opportunity
              </span>
            </div>

            <ArrowRight size={18} />

          </Link>

          <Link
            href="/business-applications"
            className="quick-action-card"
          >

            <div className="quick-action-icon blue">
              <FileText size={22} />
            </div>

            <div>
              <strong>
                Applications
              </strong>

              <span>
                Review student applications
              </span>
            </div>

            <ArrowRight size={18} />

          </Link>

          <Link
            href="/wallet"
            className="quick-action-card"
          >

            <div className="quick-action-icon green">
              <CreditCard size={22} />
            </div>

            <div>
              <strong>
                Wallet
              </strong>

              <span>
                View payment activity
              </span>
            </div>

            <ArrowRight size={18} />

          </Link>

        </section>

        {/* Footer */}

        <footer className="admin-footer">

          <div className="footer-brand">
            <ShieldCheck size={17} />
            CONNECTA Admin
          </div>

          <span>
            Admin Control Center
          </span>

        </footer>

      </div>

    </main>
  );
}

function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}