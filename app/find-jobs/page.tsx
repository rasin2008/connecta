"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  Search,
  MapPin,
  IndianRupee,
  Clock3,
  BriefcaseBusiness,
  ArrowRight,
  SlidersHorizontal,
  RefreshCw,
  X,
} from "lucide-react";

import "./find-jobs.css";

type Job = {
  _id?: string;
  jobId: number;
  title: string;
  company: string;
  description: string;
  category: string;
  location: string;
  pay: string;
  duration: string;
  postedBy?: string;
  createdAt?: string;
};

const fallbackJobs: Job[] = [
  {
    jobId: 1,
    title: "Event Assistant",
    company: "Connect Events",
    description:
      "Help with event setup, guest support and general event activities.",
    category: "Events",
    location: "Kochi, Kerala",
    pay: "₹800/day",
    duration: "1 Day",
  },
  {
    jobId: 2,
    title: "Delivery Partner",
    company: "QuickGo",
    description:
      "Deliver packages to customers within the assigned local area.",
    category: "Delivery",
    location: "Ernakulam, Kerala",
    pay: "₹1000/day",
    duration: "2 Days",
  },
  {
    jobId: 3,
    title: "Retail Assistant",
    company: "Urban Store",
    description:
      "Assist customers, arrange products and support daily store activities.",
    category: "Retail",
    location: "Kochi, Kerala",
    pay: "₹700/day",
    duration: "1 Week",
  },
  {
    jobId: 4,
    title: "Social Media Assistant",
    company: "Pixel Media",
    description:
      "Help create social media content and manage daily social posts.",
    category: "Marketing",
    location: "Remote",
    pay: "₹1200/day",
    duration: "3 Days",
  },
  {
    jobId: 5,
    title: "Cafe Assistant",
    company: "Cafe Corner",
    description:
      "Support cafe operations, customer service and basic counter activities.",
    category: "Food & Hospitality",
    location: "Kakkanad, Kerala",
    pay: "₹900/day",
    duration: "2 Days",
  },
  {
    jobId: 6,
    title: "Tech Support Assistant",
    company: "TechHub",
    description:
      "Assist the team with basic technical support and computer-related tasks.",
    category: "Technology",
    location: "Kochi, Kerala",
    pay: "₹1500/day",
    duration: "3 Days",
  },
];

const categories = [
  "All",
  "Events",
  "Retail",
  "Delivery",
  "Food & Hospitality",
  "Marketing",
  "Technology",
  "Customer Service",
];

const locations = [
  "All",
  "Kochi",
  "Ernakulam",
  "Kakkanad",
  "Remote",
];

const payOptions = [
  "All",
  "Under ₹800",
  "₹800 - ₹1000",
  "₹1000 - ₹1500",
  "Above ₹1500",
];

const durationOptions = [
  "All",
  "1 Day",
  "2 Days",
  "3 Days",
  "1 Week",
];

export default function FindJobsPage() {
  const [jobs, setJobs] = useState<Job[]>(fallbackJobs);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [selectedLocation, setSelectedLocation] =
    useState("All");

  const [selectedPay, setSelectedPay] =
    useState("All");

  const [selectedDuration, setSelectedDuration] =
    useState("All");

  const [showFilters, setShowFilters] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/jobs/all", {
        method: "GET",
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
          data.message || "Failed to load jobs."
        );
      }

      if (
        Array.isArray(data.jobs) &&
        data.jobs.length > 0
      ) {
        setJobs(data.jobs);
      } else {
        setJobs(fallbackJobs);
      }
    } catch (error) {
      console.error("LOAD JOBS ERROR:", error);

      setError(
        "Unable to load latest jobs. Showing available demo jobs."
      );

      setJobs(fallbackJobs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const getPayAmount = (pay: string) => {
    const numbers = pay.match(/\d+(?:,\d+)?/g);

    if (!numbers || numbers.length === 0) {
      return 0;
    }

    return Number(numbers[0].replace(/,/g, ""));
  };

  const filteredJobs = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return jobs.filter((job) => {
      /* SEARCH */
      const matchesSearch =
        !searchText ||
        job.title
          .toLowerCase()
          .includes(searchText) ||
        job.company
          .toLowerCase()
          .includes(searchText) ||
        job.location
          .toLowerCase()
          .includes(searchText) ||
        job.category
          .toLowerCase()
          .includes(searchText) ||
        job.description
          .toLowerCase()
          .includes(searchText);

      /* CATEGORY */
      const matchesCategory =
        selectedCategory === "All" ||
        job.category.toLowerCase() ===
          selectedCategory.toLowerCase();

      /* LOCATION */
      const jobLocation =
        job.location.toLowerCase();

      const matchesLocation =
        selectedLocation === "All" ||
        jobLocation.includes(
          selectedLocation.toLowerCase()
        );

      /* PAY */
      const pay = getPayAmount(job.pay);

      let matchesPay = true;

      if (selectedPay === "Under ₹800") {
        matchesPay = pay < 800;
      }

      if (selectedPay === "₹800 - ₹1000") {
        matchesPay = pay >= 800 && pay <= 1000;
      }

      if (selectedPay === "₹1000 - ₹1500") {
        matchesPay = pay > 1000 && pay <= 1500;
      }

      if (selectedPay === "Above ₹1500") {
        matchesPay = pay > 1500;
      }

      /* DURATION */
      const jobDuration =
        job.duration.toLowerCase();

      let matchesDuration = true;

      if (selectedDuration === "1 Day") {
        matchesDuration =
          jobDuration.includes("1 day");
      }

      if (selectedDuration === "2 Days") {
        matchesDuration =
          jobDuration.includes("2 day");
      }

      if (selectedDuration === "3 Days") {
        matchesDuration =
          jobDuration.includes("3 day");
      }

      if (selectedDuration === "1 Week") {
        matchesDuration =
          jobDuration.includes("1 week");
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesPay &&
        matchesDuration
      );
    });
  }, [
    jobs,
    search,
    selectedCategory,
    selectedLocation,
    selectedPay,
    selectedDuration,
  ]);

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedLocation("All");
    setSelectedPay("All");
    setSelectedDuration("All");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedCategory !== "All" ||
    selectedLocation !== "All" ||
    selectedPay !== "All" ||
    selectedDuration !== "All";

  return (
    <main className="find-jobs-page">
      {/* Background */}
      <div className="find-jobs-orb orb-one" />
      <div className="find-jobs-orb orb-two" />
      <div className="find-jobs-orb orb-three" />

      <div className="find-jobs-container">
        {/* Header */}
        <section className="find-jobs-header">
          <div className="find-jobs-heading">
            <div className="find-jobs-icon">
              <BriefcaseBusiness size={30} />
            </div>

            <div>
              <span className="section-label">
                CONNECTA OPPORTUNITIES
              </span>

              <h1>Find Jobs</h1>

              <p>
                Discover flexible jobs near you and
                find opportunities that fit your
                schedule.
              </p>
            </div>
          </div>

          <button
            className="refresh-button"
            onClick={loadJobs}
            disabled={loading}
            title="Refresh jobs"
          >
            <RefreshCw
              size={18}
              className={
                loading ? "refresh-spin" : ""
              }
            />

            <span>Refresh</span>
          </button>
        </section>

        {/* Search */}
        <section className="search-section">
          <div className="search-box">
            <Search size={21} />

            <input
              type="text"
              placeholder="Search jobs, companies, locations..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                className="clear-search"
                onClick={() => setSearch("")}
                type="button"
              >
                ×
              </button>
            )}
          </div>

          <button
            className={
              showFilters
                ? "filter-button active"
                : "filter-button"
            }
            onClick={() =>
              setShowFilters(!showFilters)
            }
            type="button"
          >
            <SlidersHorizontal size={19} />
            <span>Filter</span>
          </button>
        </section>

        {/* Filter Panel */}
        {showFilters && (
          <section className="advanced-filter-panel">
            {/* Location */}
            <div className="filter-group">
              <label>
                <MapPin size={16} />
                Location
              </label>

              <select
                value={selectedLocation}
                onChange={(e) =>
                  setSelectedLocation(
                    e.target.value
                  )
                }
              >
                {locations.map((location) => (
                  <option
                    key={location}
                    value={location}
                  >
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="filter-group">
              <label>
                <BriefcaseBusiness size={16} />
                Category
              </label>

              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value
                  )
                }
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Pay */}
            <div className="filter-group">
              <label>
                <IndianRupee size={16} />
                Pay
              </label>

              <select
                value={selectedPay}
                onChange={(e) =>
                  setSelectedPay(e.target.value)
                }
              >
                {payOptions.map((pay) => (
                  <option
                    key={pay}
                    value={pay}
                  >
                    {pay}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div className="filter-group">
              <label>
                <Clock3 size={16} />
                Duration
              </label>

              <select
                value={selectedDuration}
                onChange={(e) =>
                  setSelectedDuration(
                    e.target.value
                  )
                }
              >
                {durationOptions.map(
                  (duration) => (
                    <option
                      key={duration}
                      value={duration}
                    >
                      {duration}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Reset */}
            {hasActiveFilters && (
              <button
                className="reset-filter-button"
                onClick={resetFilters}
                type="button"
              >
                <X size={17} />
                Reset Filters
              </button>
            )}
          </section>
        )}

        {/* Categories */}
        <section className="categories-section">
          <div className="categories-scroll">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  selectedCategory === category
                    ? "category-button active"
                    : "category-button"
                }
                onClick={() =>
                  setSelectedCategory(category)
                }
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="jobs-error">
            <span>{error}</span>

            <button onClick={loadJobs}>
              Try Again
            </button>
          </div>
        )}

        {/* Top row */}
        <section className="jobs-top-row">
          <div>
            <span className="section-label">
              AVAILABLE NOW
            </span>

            <h2>
              {loading
                ? "Loading jobs..."
                : `${filteredJobs.length} Jobs Available`}
            </h2>
          </div>

          <div className="jobs-count">
            {filteredJobs.length} results
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <div className="jobs-loading">
            <div className="jobs-spinner" />

            <p>
              Finding the latest opportunities...
            </p>
          </div>
        )}

        {/* Jobs */}
        {!loading &&
          filteredJobs.length > 0 && (
            <section className="jobs-grid">
              {filteredJobs.map((job) => (
                <article
                  className="job-card"
                  key={job._id || job.jobId}
                >
                  {/* Card top */}
                  <div className="job-card-top">
                    <div className="job-icon">
                      <BriefcaseBusiness size={24} />
                    </div>

                    <span className="job-category">
                      {job.category}
                    </span>
                  </div>

                  {/* Job info */}
                  <div className="job-card-content">
                    <h3>{job.title}</h3>

                    <p className="job-company">
                      {job.company}
                    </p>

                    <p className="job-description">
                      {job.description}
                    </p>

                    {/* Details */}
                    <div className="job-details">
                      <div className="job-detail">
                        <MapPin size={17} />
                        <span>
                          {job.location}
                        </span>
                      </div>

                      <div className="job-detail">
                        <IndianRupee size={17} />
                        <span>{job.pay}</span>
                      </div>

                      <div className="job-detail">
                        <Clock3 size={17} />
                        <span>
                          {job.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="job-card-footer">
                    <div className="posted-info">
                      {job.createdAt
                        ? `Posted ${new Date(
                            job.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                            }
                          )}`
                        : "Available now"}
                    </div>

                    <Link
                      href={`/job-details?id=${job.jobId}`}
                      className="view-job-button"
                    >
                      View Job
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              ))}
            </section>
          )}

        {/* Empty */}
        {!loading &&
          filteredJobs.length === 0 && (
            <section className="empty-jobs">
              <div className="empty-icon">
                <Search size={30} />
              </div>

              <h2>No jobs found</h2>

              <p>
                Try changing your search or filters.
              </p>

              <button
                onClick={resetFilters}
              >
                Clear Filters
              </button>
            </section>
          )}
      </div>
    </main>
  );
}