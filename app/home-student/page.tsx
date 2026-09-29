"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  MapPin,
  Search,
  SlidersHorizontal,
  Bell,
  BriefcaseBusiness,
  Clock3,
  ChevronRight,
  Home,
  ClipboardList,
  MessageCircle,
  UserRound,
  LogOut,
} from "lucide-react";

import "./home-student.css";

const jobs = [
  {
    id: 1,
    title: "Cafe Helper",
    company: "Brew Haven Cafe",
    distance: "0.6 km",
    pay: "₹450/day",
    duration: "4 hrs",
    time: "Today, 10:00 AM",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
  },
  {
    id: 2,
    title: "Event Staff",
    company: "Dreams Events",
    distance: "1.2 km",
    pay: "₹800/day",
    duration: "8 hrs",
    time: "This Weekend",
    image:
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800",
  },
];

type SavedUser = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
};

export default function HomeStudentPage() {
  const router = useRouter();

  const [user, setUser] = useState<SavedUser | null>(null);
  const [search, setSearch] = useState("");

  /* =================================================
      CHECK LOGIN
  ================================================= */

  useEffect(() => {
    const savedUser = localStorage.getItem("connectaUser");

    if (!savedUser) {
      router.replace("/");
      return;
    }

    try {
      const parsedUser: SavedUser = JSON.parse(savedUser);

      if (!parsedUser?.id && !parsedUser?.email) {
        localStorage.removeItem("connectaUser");
        router.replace("/");
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error("User data error:", error);

      localStorage.removeItem("connectaUser");
      router.replace("/");
    }
  }, [router]);

  /* =================================================
      LOGOUT
  ================================================= */

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    localStorage.removeItem("connectaUser");

    setUser(null);

    router.replace("/");
  };

  /* =================================================
      SEARCH FILTER
  ================================================= */

  const filteredJobs = jobs.filter((job) => {
    const value = search.toLowerCase();

    return (
      job.title.toLowerCase().includes(value) ||
      job.company.toLowerCase().includes(value)
    );
  });

  return (
    <main className="student-home">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="student-header">

        <div className="brand-area">

          <div className="mini-logo">
            C
          </div>

          <div className="brand-details">

            <strong>
              CONNECTA
            </strong>

            <div className="location">

              <MapPin size={13} />

              <span>
                Kozhikode, Kerala
              </span>

              <span className="location-arrow">
                ⌄
              </span>

            </div>

          </div>

        </div>


        <button
          className="notification-button"
          type="button"
          aria-label="Notifications"
        >
          <Bell size={21} />
        </button>

      </header>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="student-container">


        {/* =================================================
            WELCOME
        ================================================= */}

        <div
          style={{
            marginBottom: "18px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#777",
            }}
          >
            Welcome back{user?.name ? "," : ""}
          </p>

          {user?.name && (
            <h2
              style={{
                margin: "3px 0 0",
                fontSize: "22px",
                fontWeight: 700,
              }}
            >
              {user.name}
            </h2>
          )}
        </div>


        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="search-row">

          <div className="search-box">

            <Search size={19} />

            <input
              type="text"
              placeholder="Search jobs near you..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>


          <button
            className="filter-button"
            type="button"
            aria-label="Filter jobs"
          >
            <SlidersHorizontal size={20} />
          </button>

        </div>


        {/* =================================================
            HERO BANNER
        ================================================= */}

        <section className="job-banner">

          <div className="banner-content">

            <span className="banner-small-title">
              Find Local Jobs
            </span>

            <h1>
              That Fit Your Time
            </h1>

            <p>
              Flexible. Trusted. Nearby.
            </p>

          </div>


          <div className="banner-person">

            <div className="person-circle">
              👨🏻‍💻
            </div>

          </div>

        </section>


        {/* =================================================
            RECOMMENDED
        ================================================= */}

        <section className="recommended-section">

          <div className="section-heading">

            <h2>
              Recommended for you
            </h2>

            <Link href="/find-jobs">
              See all
            </Link>

          </div>


          {/* =================================================
              JOBS
          ================================================= */}

          <div className="jobs-list">

            {filteredJobs.length > 0 ? (

              filteredJobs.map((job) => (

                <Link
                  key={job.id}
                  href={`/job-details?id=${job.id}`}
                  className="job-card"
                >

                  {/* IMAGE */}

                  <img
                    src={job.image}
                    alt={job.title}
                  />


                  {/* INFO */}

                  <div className="job-info">

                    <div className="job-title-row">

                      <h3>
                        {job.title}
                      </h3>

                      <span className="new-badge">
                        New
                      </span>

                    </div>


                    <p className="company">
                      {job.company}
                    </p>


                    <div className="job-meta">

                      <span>
                        <MapPin size={13} />

                        {job.distance}
                      </span>

                      <span>
                        <BriefcaseBusiness size={13} />

                        {job.pay}
                      </span>

                    </div>


                    <div className="job-meta">

                      <span>
                        <Clock3 size={13} />

                        {job.duration}
                      </span>

                      <span>
                        {job.time}
                      </span>

                    </div>

                  </div>


                  {/* ARROW */}

                  <ChevronRight
                    size={20}
                    className="job-arrow"
                  />

                </Link>

              ))

            ) : (

              <div
                style={{
                  textAlign: "center",
                  padding: "35px 10px",
                  color: "#777",
                }}
              >
                <Search
                  size={35}
                  style={{
                    marginBottom: "10px",
                  }}
                />

                <p
                  style={{
                    margin: 0,
                  }}
                >
                  No jobs found
                </p>
              </div>

            )}

          </div>

        </section>

      </div>


      {/* =================================================
          BOTTOM NAVIGATION
      ================================================= */}

      <nav className="student-bottom-nav">

        {/* HOME */}

        <Link
          href="/home-student"
          className="bottom-nav-item active"
        >

          <Home size={21} />

          <span>
            Home
          </span>

        </Link>


        {/* JOBS */}

        <Link
          href="/find-jobs"
          className="bottom-nav-item"
        >

          <BriefcaseBusiness size={21} />

          <span>
            Jobs
          </span>

        </Link>


        {/* APPLICATIONS */}

        <Link
          href="/my-applications"
          className="bottom-nav-item"
        >

          <ClipboardList size={21} />

          <span>
            Applications
          </span>

        </Link>


        {/* CHATS */}

        <Link
          href="/messages"
          className="bottom-nav-item"
        >

          <MessageCircle size={21} />

          <span>
            Chats
          </span>

        </Link>


        {/* PROFILE */}

        <Link
          href="/profile"
          className="bottom-nav-item"
        >

          <UserRound size={21} />

          <span>
            Profile
          </span>

        </Link>


        {/* LOGOUT */}

        <button
          type="button"
          className="bottom-nav-item logout-nav-button"
          onClick={handleLogout}
        >

          <LogOut size={21} />

          <span>
            Logout
          </span>

        </button>

      </nav>

    </main>
  );
}