"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Loader2,
  MapPin,
  User,
  AlertCircle,
} from "lucide-react";

import "./job-details.css";

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

type ConnectaUser = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
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

function JobDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const [job, setJob] = useState<Job | null>(null);
  const [user, setUser] = useState<ConnectaUser | null>(null);

  const [loading, setLoading] = useState(true);
  const [checkingApplication, setCheckingApplication] = useState(true);
  const [applying, setApplying] = useState(false);

  const [applied, setApplied] = useState(false);

  const [applyError, setApplyError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /*
  ============================================
  LOAD USER
  ============================================
  */

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("connectaUser");

      if (!savedUser) {
        setUser(null);
        return;
      }

      const parsedUser = JSON.parse(savedUser);

      setUser(parsedUser);
    } catch (error) {
      console.error("USER LOAD ERROR:", error);
      setUser(null);
    }
  }, []);

  /*
  ============================================
  LOAD JOB
  ============================================
  */

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        setApplyError("");

        if (!id) {
          setJob(null);
          return;
        }

        const jobId = Number(id);

        if (Number.isNaN(jobId)) {
          setJob(null);
          return;
        }

        /*
        ========================================
        GET JOBS FROM MONGODB
        ========================================
        */

        try {
          const response = await fetch("/api/jobs/all", {
            method: "GET",
            cache: "no-store",
          });

          const contentType =
            response.headers.get("content-type");

          if (contentType?.includes("application/json")) {
            const data = await response.json();

            if (
              response.ok &&
              data.success &&
              Array.isArray(data.jobs)
            ) {
              const databaseJob = data.jobs.find(
                (item: Job) =>
                  Number(item.jobId) === jobId
              );

              if (databaseJob) {
                setJob(databaseJob);
                return;
              }
            }
          }
        } catch (error) {
          console.error(
            "DATABASE JOB LOAD ERROR:",
            error
          );
        }

        /*
        ========================================
        FALLBACK JOB
        ========================================
        */

        const fallbackJob = fallbackJobs.find(
          (item) => Number(item.jobId) === jobId
        );

        if (fallbackJob) {
          setJob(fallbackJob);
        } else {
          setJob(null);
        }
      } catch (error) {
        console.error("LOAD JOB ERROR:", error);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  /*
  ============================================
  CHECK EXISTING APPLICATION
  ============================================
  */

  useEffect(() => {
    const checkApplication = async () => {
      try {
        setCheckingApplication(true);

        if (!job) {
          return;
        }

        const savedUser =
          localStorage.getItem("connectaUser");

        if (!savedUser) {
          return;
        }

        const parsedUser = JSON.parse(savedUser);

        const userId =
          parsedUser?.id ||
          parsedUser?._id;

        if (!userId) {
          return;
        }

        const response = await fetch(
          `/api/applications/my?userId=${encodeURIComponent(
            userId
          )}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const contentType =
          response.headers.get("content-type");

        if (!contentType?.includes("application/json")) {
          return;
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          return;
        }

        if (!Array.isArray(data.applications)) {
          return;
        }

        const alreadyApplied =
          data.applications.some(
            (application: { jobId?: number }) =>
              Number(application.jobId) ===
              Number(job.jobId)
          );

        setApplied(alreadyApplied);
      } catch (error) {
        console.error(
          "CHECK APPLICATION ERROR:",
          error
        );
      } finally {
        setCheckingApplication(false);
      }
    };

    checkApplication();
  }, [job]);

  /*
  ============================================
  APPLY JOB
  ============================================
  */

  const handleApply = async () => {
    try {
      setApplyError("");
      setSuccessMessage("");

      /*
      ========================================
      JOB CHECK
      ========================================
      */

      if (!job) {
        setApplyError(
          "Job information is missing."
        );
        return;
      }

      /*
      ========================================
      LOGIN CHECK
      ========================================
      */

      const savedUser =
        localStorage.getItem("connectaUser");

      if (!savedUser) {
        setApplyError(
          "Please login to apply for this job."
        );

        return;
      }

      /*
      ========================================
      PARSE USER
      ========================================
      */

      let parsedUser: ConnectaUser;

      try {
        parsedUser = JSON.parse(savedUser);
      } catch {
        setApplyError(
          "Your login session is invalid. Please login again."
        );

        return;
      }

      const userId =
        parsedUser?.id ||
        parsedUser?._id;

      if (!userId) {
        setApplyError(
          "User information is missing. Please login again."
        );

        return;
      }

      /*
      ========================================
      ALREADY APPLIED
      ========================================
      */

      if (applied) {
        return;
      }

      /*
      ========================================
      START APPLY
      ========================================
      */

      setApplying(true);

      /*
      ========================================
      CREATE APPLICATION
      ========================================
      */

      const response = await fetch(
        "/api/applications/create",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId,
            jobId: job.jobId,
            title: job.title,
            company: job.company,
            location: job.location,
            pay: job.pay,
            duration: job.duration,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error(
          "Invalid server response."
        );
      }

      const data = await response.json();

      /*
      ========================================
      SUCCESS
      ========================================
      */

      if (response.ok && data.success) {
        setApplied(true);

        setSuccessMessage(
          "Your application has been submitted successfully."
        );

        setApplyError("");

        return;
      }

      /*
      ========================================
      DUPLICATE
      ========================================
      */

      if (response.status === 409) {
        setApplied(true);

        setSuccessMessage(
          "You have already applied for this job."
        );

        setApplyError("");

        return;
      }

      throw new Error(
        data.message ||
          "Failed to submit application."
      );
    } catch (error) {
      console.error(
        "APPLY JOB ERROR:",
        error
      );

      setApplyError(
        error instanceof Error
          ? error.message
          : "Failed to apply for this job."
      );
    } finally {
      setApplying(false);
    }
  };

  /*
  ============================================
  LOADING SCREEN
  ============================================
  */

  if (loading) {
    return (
      <main className="job-details-page">

        <div className="job-details-orb orb-one" />
        <div className="job-details-orb orb-two" />
        <div className="job-details-orb orb-three" />

        <div className="job-details-loading">

          <div className="job-loading-spinner">
            <Loader2 size={30} />
          </div>

          <h2>
            Loading job...
          </h2>

          <p>
            Finding the opportunity for you.
          </p>

        </div>

      </main>
    );
  }

  /*
  ============================================
  JOB NOT FOUND
  ============================================
  */

  if (!job) {
    return (
      <main className="job-details-page">

        <div className="job-details-orb orb-one" />
        <div className="job-details-orb orb-two" />

        <div className="job-details-error-page">

          <div className="job-error-icon">
            <BriefcaseBusiness size={38} />
          </div>

          <h1>
            Job Not Found
          </h1>

          <p>
            This job does not exist or may have
            been removed.
          </p>

          <Link
            href="/find-jobs"
            className="back-to-jobs"
          >
            <ArrowLeft size={18} />
            Back to Jobs
          </Link>

        </div>

      </main>
    );
  }

  /*
  ============================================
  MAIN PAGE
  ============================================
  */

  return (
    <main className="job-details-page">

      {/* BACKGROUND */}

      <div className="job-details-orb orb-one" />
      <div className="job-details-orb orb-two" />
      <div className="job-details-orb orb-three" />

      <div className="job-details-container">

        {/* =====================================
            TOP BAR
        ===================================== */}

        <div className="job-details-topbar">

          <Link
            href="/find-jobs"
            className="back-button"
          >
            <ArrowLeft size={18} />

            <span>
              Back to Jobs
            </span>
          </Link>

          <div className="connecta-mini-logo">

            <div className="mini-logo">
              <BriefcaseBusiness size={21} />
            </div>

            <span>
              CONNECTA
            </span>

          </div>

        </div>

        {/* =====================================
            HERO
        ===================================== */}

        <section className="job-details-hero">

          <div className="job-hero-left">

            <div className="job-main-icon">
              <BriefcaseBusiness size={42} />
            </div>

            <div>

              <span className="job-category-badge">
                {job.category}
              </span>

              <h1>
                {job.title}
              </h1>

              <p className="job-company-large">
                {job.company}
              </p>

              <div className="job-hero-location">

                <MapPin size={18} />

                <span>
                  {job.location}
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================
            CONTENT
        ===================================== */}

        <div className="job-details-layout">

          {/* ===================================
              LEFT CONTENT
          =================================== */}

          <div className="job-details-main">

            {/* ABOUT */}

            <section className="details-card">

              <div className="details-card-title">

                <div className="title-icon">
                  <BriefcaseBusiness size={21} />
                </div>

                <h2>
                  About this job
                </h2>

              </div>

              <p className="job-full-description">
                {job.description}
              </p>

            </section>

            {/* JOB INFORMATION */}

            <section className="details-card">

              <div className="details-card-title">

                <div className="title-icon">
                  <CalendarDays size={21} />
                </div>

                <h2>
                  Job Information
                </h2>

              </div>

              <div className="job-info-grid">

                {/* LOCATION */}

                <div className="job-info-item">

                  <div className="info-icon">
                    <MapPin size={19} />
                  </div>

                  <div>

                    <span>
                      Location
                    </span>

                    <strong>
                      {job.location}
                    </strong>

                  </div>

                </div>

                {/* PAY */}

                <div className="job-info-item">

                  <div className="info-icon">
                    <IndianRupee size={19} />
                  </div>

                  <div>

                    <span>
                      Pay
                    </span>

                    <strong className="pay-highlight">
                      {job.pay}
                    </strong>

                  </div>

                </div>

                {/* DURATION */}

                <div className="job-info-item">

                  <div className="info-icon">
                    <Clock3 size={19} />
                  </div>

                  <div>

                    <span>
                      Duration
                    </span>

                    <strong>
                      {job.duration}
                    </strong>

                  </div>

                </div>

                {/* CATEGORY */}

                <div className="job-info-item">

                  <div className="info-icon">
                    <BriefcaseBusiness size={19} />
                  </div>

                  <div>

                    <span>
                      Category
                    </span>

                    <strong>
                      {job.category}
                    </strong>

                  </div>

                </div>

              </div>

            </section>

            {/* HOW IT WORKS */}

            <section className="details-card">

              <div className="details-card-title">

                <div className="title-icon">
                  <CheckCircle2 size={21} />
                </div>

                <h2>
                  How it works
                </h2>

              </div>

              <div className="job-steps">

                <div className="job-step">

                  <div className="step-number">
                    01
                  </div>

                  <div>
                    <strong>
                      Apply
                    </strong>

                    <span>
                      Submit your application for this job.
                    </span>
                  </div>

                </div>

                <div className="job-step">

                  <div className="step-number">
                    02
                  </div>

                  <div>
                    <strong>
                      Get Selected
                    </strong>

                    <span>
                      The business reviews your application.
                    </span>
                  </div>

                </div>

                <div className="job-step">

                  <div className="step-number">
                    03
                  </div>

                  <div>
                    <strong>
                      Work
                    </strong>

                    <span>
                      Complete the temporary job successfully.
                    </span>
                  </div>

                </div>

                <div className="job-step">

                  <div className="step-number">
                    04
                  </div>

                  <div>
                    <strong>
                      Get Paid
                    </strong>

                    <span>
                      Receive your payment through CONNECTA.
                    </span>
                  </div>

                </div>

              </div>

            </section>

          </div>

          {/* ===================================
              RIGHT SIDEBAR
          =================================== */}

          <aside className="job-details-sidebar">

            {/* APPLY CARD */}

            <section className="apply-card">

              <div className="apply-card-top">

                <div className="apply-card-icon">
                  <BriefcaseBusiness size={23} />
                </div>

                <div>

                  <span>
                    INTERESTED?
                  </span>

                  <h3>
                    Apply for this job
                  </h3>

                </div>

              </div>

              {/* USER */}

              <div className="apply-user">

                <div className="apply-user-icon">
                  <User size={20} />
                </div>

                <div>

                  <span>
                    Applying as
                  </span>

                  <strong>
                    {user?.name || "Student"}
                  </strong>

                </div>

              </div>

              {/* LOGIN MESSAGE */}

              {!user && (
                <div className="login-required-box">

                  <AlertCircle size={18} />

                  <span>
                    Please login before applying.
                  </span>

                </div>
              )}

              {/* APPLY BUTTON */}

              <button
                type="button"
                className={
                  applied
                    ? "apply-button applied"
                    : "apply-button"
                }
                onClick={handleApply}
                disabled={
                  applying ||
                  applied ||
                  checkingApplication
                }
              >

                {applying ? (
                  <>
                    <Loader2
                      size={18}
                      className="apply-spinner"
                    />

                    Applying...
                  </>
                ) : checkingApplication ? (
                  <>
                    <Loader2
                      size={18}
                      className="apply-spinner"
                    />

                    Checking...
                  </>
                ) : applied ? (
                  <>
                    <CheckCircle2 size={18} />

                    Applied
                  </>
                ) : (
                  <>
                    Apply Job

                    <ArrowRight size={18} />
                  </>
                )}

              </button>

              {/* VIEW APPLICATIONS */}

              <Link
                href="/my-applications"
                className="view-applications-button"
              >

                <BriefcaseBusiness size={18} />

                <span>
                  View My Applications
                </span>

                <ArrowRight size={17} />

              </Link>

              {/* SUCCESS */}

              {successMessage && (
                <div className="application-success">

                  <CheckCircle2 size={18} />

                  <span>
                    {successMessage}
                  </span>

                </div>
              )}

              {/* ERROR */}

              {applyError && (
                <div className="job-apply-error">

                  <AlertCircle size={17} />

                  <span>
                    {applyError}
                  </span>

                </div>
              )}

              <p className="apply-note">
                By applying, your application will
                be saved to your CONNECTA account.
              </p>

            </section>

            {/* JOB DETAILS CARD */}

            <section className="posted-card">

              <span>
                JOB DETAILS
              </span>

              <div className="posted-row">

                <span>
                  Company
                </span>

                <strong>
                  {job.company}
                </strong>

              </div>

              <div className="posted-row">

                <span>
                  Category
                </span>

                <strong>
                  {job.category}
                </strong>

              </div>

              <div className="posted-row">

                <span>
                  Location
                </span>

                <strong>
                  {job.location}
                </strong>

              </div>

              <div className="posted-row">

                <span>
                  Pay
                </span>

                <strong className="pay-highlight">
                  {job.pay}
                </strong>

              </div>

              <div className="posted-row">

                <span>
                  Duration
                </span>

                <strong>
                  {job.duration}
                </strong>

              </div>

            </section>

            {/* DEMO PAYMENT FLOW */}

            {applied && (
              <section className="next-step-card">

                <div className="next-step-icon">
                  <CheckCircle2 size={21} />
                </div>

                <div>

                  <span>
                    NEXT STEP
                  </span>

                  <h3>
                    Track your application
                  </h3>

                  <p>
                    Check your application status
                    from your dashboard.
                  </p>

                </div>

                <Link
                  href="/my-applications"
                  className="next-step-button"
                >
                  View Status
                  <ArrowRight size={16} />
                </Link>

              </section>
            )}

          </aside>

        </div>

      </div>

    </main>
  );
}

/*
============================================
SUSPENSE WRAPPER
============================================
*/

export default function JobDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="job-details-page">

          <div className="job-details-orb orb-one" />
          <div className="job-details-orb orb-two" />

          <div className="job-details-loading">

            <div className="job-loading-spinner">
              <Loader2 size={30} />
            </div>

            <h2>
              Loading job...
            </h2>

            <p>
              Please wait...
            </p>

          </div>

        </main>
      }
    >
      <JobDetailsContent />
    </Suspense>
  );
}