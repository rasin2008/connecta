"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  GraduationCap,
  Search,
  Trash2,
  Users,
  RefreshCw,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

import "./users.css";

type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  education?: string;
  role: "student" | "business";
  createdAt?: string;
};

export default function AdminUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  /* =========================================
     LOAD USERS
  ========================================= */

  useEffect(() => {
    const savedUser = localStorage.getItem("connectaUser");

    /*
     * Demo Admin Access
     *
     * Admin Users page should open even when
     * no CONNECTA user is logged in.
     *
     * So we do NOT redirect to Home here.
     */

    if (!savedUser) {
      loadUsers();
      return;
    }

    try {
      JSON.parse(savedUser);

      loadUsers();
    } catch (error) {
      console.error("USER ERROR:", error);

      /*
       * Invalid localStorage data should not
       * redirect the user back to Home.
       */

      loadUsers();
    }
  }, []);

  /* =========================================
     LOAD USERS FROM API
  ========================================= */

  const loadUsers = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/admin/users", {
        cache: "no-store",
      });

      const contentType =
        response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error("Invalid server response.");
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load users"
        );
      }

      setUsers(
        Array.isArray(data.users)
          ? data.users
          : []
      );
    } catch (error) {
      console.error(
        "LOAD USERS ERROR:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     DELETE USER
  ========================================= */

  const deleteUser = async (
    id: string,
    name: string
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setMessage("");

      const response = await fetch(
        `/api/admin/users?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const contentType =
        response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error("Invalid server response.");
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to delete user"
        );
      }

      setUsers((currentUsers) =>
        currentUsers.filter(
          (user) => user._id !== id
        )
      );

      setMessage(
        "User deleted successfully."
      );
    } catch (error) {
      console.error(
        "DELETE USER ERROR:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete user."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================================
     FILTER USERS
  ========================================= */

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchValue =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        user.name
          ?.toLowerCase()
          .includes(searchValue) ||
        user.email
          ?.toLowerCase()
          .includes(searchValue) ||
        user.location
          ?.toLowerCase()
          .includes(searchValue);

      const matchesRole =
        roleFilter === "all" ||
        user.role === roleFilter;

      return (
        matchesSearch &&
        matchesRole
      );
    });
  }, [
    users,
    search,
    roleFilter,
  ]);

  /* =========================================
     COUNTS
  ========================================= */

  const studentCount = users.filter(
    (user) =>
      user.role === "student"
  ).length;

  const businessCount = users.filter(
    (user) =>
      user.role === "business"
  ).length;

  /* =========================================
     PAGE
  ========================================= */

  return (
    <main className="admin-users-page">

      {/* =====================================
          BACKGROUND
      ===================================== */}

      <div className="admin-users-background">

        <div className="admin-users-glow glow-one" />

        <div className="admin-users-glow glow-two" />

      </div>

      {/* =====================================
          MAIN CONTAINER
      ===================================== */}

      <section className="admin-users-container">

        {/* ===================================
            HEADER
        =================================== */}

        <header className="admin-users-header">

          {/* Back Button */}

          <button
            type="button"
            className="back-button"
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

          <div className="header-title">

            <div className="title-icon">
              <Users size={25} />
            </div>

            <div>

              <p className="small-label">
                CONNECTA ADMIN
              </p>

              <h1>
                User Management
              </h1>

              <p>
                Manage all registered
                CONNECTA users.
              </p>

            </div>

          </div>

          {/* Refresh */}

          <button
            type="button"
            className="refresh-button"
            onClick={loadUsers}
            disabled={loading}
          >
            <RefreshCw
              size={18}
              className={
                loading
                  ? "refresh-spinning"
                  : ""
              }
            />

            {loading
              ? "Loading..."
              : "Refresh"}
          </button>

        </header>

        {/* ===================================
            STATS
        =================================== */}

        <section className="user-stats">

          {/* Total Users */}

          <div className="user-stat-card">

            <div className="stat-icon purple">
              <Users size={22} />
            </div>

            <div>

              <span>
                Total Users
              </span>

              <strong>
                {users.length}
              </strong>

            </div>

          </div>

          {/* Students */}

          <div className="user-stat-card">

            <div className="stat-icon blue">
              <GraduationCap size={22} />
            </div>

            <div>

              <span>
                Students
              </span>

              <strong>
                {studentCount}
              </strong>

            </div>

          </div>

          {/* Businesses */}

          <div className="user-stat-card">

            <div className="stat-icon pink">
              <BriefcaseBusiness
                size={22}
              />
            </div>

            <div>

              <span>
                Businesses
              </span>

              <strong>
                {businessCount}
              </strong>

            </div>

          </div>

        </section>

        {/* ===================================
            TOOLBAR
        =================================== */}

        <section className="users-toolbar">

          {/* Search */}

          <div className="search-box">

            <Search size={19} />

            <input
              type="text"
              placeholder="Search name, email or location..."
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
                className="clear-search"
                onClick={() =>
                  setSearch("")
                }
              >
                ×
              </button>
            )}

          </div>

          {/* Filters */}

          <div className="filter-buttons">

            <button
              type="button"
              className={
                roleFilter === "all"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setRoleFilter("all")
              }
            >
              All
            </button>

            <button
              type="button"
              className={
                roleFilter === "student"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setRoleFilter("student")
              }
            >
              Students
            </button>

            <button
              type="button"
              className={
                roleFilter === "business"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setRoleFilter("business")
              }
            >
              Businesses
            </button>

          </div>

        </section>

        {/* ===================================
            MESSAGE
        =================================== */}

        {message && (
          <div className="users-message">

            {message}

          </div>
        )}

        {/* ===================================
            USERS CARD
        =================================== */}

        <section className="users-card">

          {/* Card Header */}

          <div className="users-card-header">

            <div>

              <h2>
                Registered Users
              </h2>

              <p>
                Showing{" "}
                {filteredUsers.length}{" "}
                of{" "}
                {users.length} users
              </p>

            </div>

            <span className="user-count-badge">
              {filteredUsers.length}
            </span>

          </div>

          {/* =================================
              LOADING
          ================================= */}

          {loading ? (

            <div className="users-loading">

              <RefreshCw
                className="loading-icon"
                size={30}
              />

              <p>
                Loading users...
              </p>

            </div>

          ) : filteredUsers.length === 0 ? (

            /* ===============================
               EMPTY
            =============================== */

            <div className="users-empty">

              <Users size={42} />

              <h3>
                No users found
              </h3>

              <p>
                Try changing your search
                or filter.
              </p>

            </div>

          ) : (

            /* ===============================
               TABLE
            =============================== */

            <div className="users-table-wrapper">

              <table className="users-table">

                <thead>

                  <tr>

                    <th>
                      User
                    </th>

                    <th>
                      Contact
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Role
                    </th>

                    <th>
                      Joined
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredUsers.map(
                    (user) => (

                      <tr
                        key={user._id}
                      >

                        {/* USER */}

                        <td>

                          <div className="user-profile">

                            <div className="user-avatar">

                              {user.name
                                ?.charAt(0)
                                .toUpperCase() ||
                                "U"}

                            </div>

                            <div>

                              <strong>
                                {user.name}
                              </strong>

                              <span>
                                {user.education ||
                                  "CONNECTA Member"}
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* CONTACT */}

                        <td>

                          <div className="contact-info">

                            <span>

                              <Mail size={14} />

                              {user.email}

                            </span>

                            {user.phone && (
                              <span>

                                <Phone
                                  size={14}
                                />

                                {user.phone}

                              </span>
                            )}

                          </div>

                        </td>

                        {/* LOCATION */}

                        <td>

                          <div className="location-info">

                            <MapPin size={15} />

                            <span>

                              {user.location ||
                                "Not provided"}

                            </span>

                          </div>

                        </td>

                        {/* ROLE */}

                        <td>

                          <span
                            className={`role-badge ${
                              user.role ===
                              "business"
                                ? "business-role"
                                : "student-role"
                            }`}
                          >

                            {user.role ===
                            "business" ? (

                              <BriefcaseBusiness
                                size={14}
                              />

                            ) : (

                              <GraduationCap
                                size={14}
                              />

                            )}

                            {user.role}

                          </span>

                        </td>

                        {/* JOINED */}

                        <td>

                          <span className="joined-date">

                            {user.createdAt
                              ? new Date(
                                  user.createdAt
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "—"}

                          </span>

                        </td>

                        {/* DELETE */}

                        <td>

                          <button
                            type="button"
                            className="delete-user-button"
                            onClick={() =>
                              deleteUser(
                                user._id,
                                user.name
                              )
                            }
                            disabled={
                              deletingId ===
                              user._id
                            }
                          >

                            <Trash2
                              size={16}
                            />

                            {deletingId ===
                            user._id
                              ? "Deleting..."
                              : "Delete"}

                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </section>

    </main>
  );
}