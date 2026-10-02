"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  BriefcaseBusiness,
  MapPin,
  IndianRupee,
  Clock3,
  CalendarDays,
  RefreshCw,
  Search,
  CreditCard,
  CheckCircle2,
  WalletCards,
  Star,
} from "lucide-react";

import "./my-applications.css";

type Application = {
  _id: string;
  jobId: number;
  title: string;
  company: string;
  location: string;
  pay: string;
  duration: string;
  status: "Applied" | "Under Review" | "Accepted";
  createdAt: string;
};

export default function MyApplicationsPage() {
  const [applications, setApplications] =
    useState<Application[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* ============================================
      LOAD APPLICATIONS
  ============================================ */

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const savedUser =
        localStorage.getItem("connectaUser");

      if (!savedUser) {
        setError(
          "Please login to view your applications."
        );

        setLoading(false);
        return;
      }

      const user = JSON.parse(savedUser);

      const userId =
        user?.id ||
        user?._id;

      if (!userId) {
        setError(
          "User information is missing. Please login again."
        );

        setLoading(false);
        return;
      }

      const response = await fetch(
        `/api/applications/my?userId=${encodeURIComponent(
          userId
        )}`,
        {
          cache: "no-store",
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

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load applications."
        );
      }

      setApplications(
        data.applications || []
      );

    } catch (err) {
      console.error(
        "LOAD APPLICATIONS ERROR:",
        err
      );

      setError(
        "Unable to load your applications."
      );

      setApplications([]);

    } finally {
      setLoading(false);
    }
  };

  /* ============================================
      LOAD ON PAGE OPEN
  ============================================ */

  useEffect(() => {
    loadApplications();
  }, []);

  /* ============================================
      STATUS CLASS
  ============================================ */

  const getStatusClass = (
    status: Application["status"]
  ) => {
    if (status === "Accepted") {
      return "status accepted";
    }

    if (status === "Under Review") {
      return "status review";
    }

    return "status applied";
  };

  /* ============================================
      GET PAYMENT AMOUNT
  ============================================ */

  const getPaymentAmount = (
    pay: string
  ) => {
    /*
      Examples:

      ₹800/day
      ₹1,000/day
      ₹1500
    */

    const cleaned = pay.replace(
      /,/g,
      ""
    );

    const match =
      cleaned.match(/\d+(?:\.\d+)?/);

    if (!match) {
      return 0;
    }

    return Number(match[0]);
  };

  /* ============================================
      OPEN PAYMENT PAGE
  ============================================ */

  const handlePayment = (
    application: Application
  ) => {
    const amount =
      getPaymentAmount(
        application.pay
      );

    if (!amount || amount <= 0) {
      alert(
        "Payment amount could not be detected."
      );

      return;
    }

    const paymentUrl =
      `/payment?jobId=${encodeURIComponent(
        application.jobId
      )}&amount=${encodeURIComponent(
        amount
      )}`;

    window.location.href =
      paymentUrl;
  };

  return (
    <main className="applications-page">

      {/* =====================================
          BACKGROUND
      ===================================== */}

      <div className="applications-orb orb-one" />
      <div className="applications-orb orb-two" />
      <div className="applications-orb orb-three" />

      <div className="applications-container">

        {/* =====================================
            TOP BAR
        ===================================== */}

        <header className="applications-header">

          <Link
            href="/find-jobs"
            className="back-button"
          >
            <ArrowLeft size={18} />

            Back to Jobs
          </Link>

          <button
            className="refresh-button"
            onClick={loadApplications}
            disabled={loading}
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? "refresh-spin"
                  : ""
              }
            />

            Refresh
          </button>

        </header>


        {/* =====================================
            TITLE
        ===================================== */}

        <section className="applications-title">

          <div className="title-icon">
            <BriefcaseBusiness size={30} />
          </div>

          <div>

            <span className="section-label">
              CONNECTA
            </span>

            <h1>
              My Applications
            </h1>

            <p>
              Track the jobs you have applied for
              and check your application status.
            </p>

          </div>

        </section>


        {/* =====================================
            STATS
        ===================================== */}

        <section className="application-stats">

          {/* TOTAL */}

          <div className="stat-card">

            <div className="stat-card-icon">
              <BriefcaseBusiness size={21} />
            </div>

            <div>

              <span>
                Total Applications
              </span>

              <strong>
                {loading
                  ? "—"
                  : applications.length}
              </strong>

            </div>

          </div>


          {/* UNDER REVIEW */}

          <div className="stat-card">

            <div className="stat-card-icon">
              <Clock3 size={21} />
            </div>

            <div>

              <span>
                Under Review
              </span>

              <strong>
                {loading
                  ? "—"
                  : applications.filter(
                      (app) =>
                        app.status ===
                        "Under Review"
                    ).length}
              </strong>

            </div>

          </div>


          {/* ACCEPTED */}

          <div className="stat-card">

            <div className="stat-card-icon">
              <CalendarDays size={21} />
            </div>

            <div>

              <span>
                Accepted
              </span>

              <strong>
                {loading
                  ? "—"
                  : applications.filter(
                      (app) =>
                        app.status ===
                        "Accepted"
                    ).length}
              </strong>

            </div>

          </div>

        </section>


        {/* =====================================
            ERROR
        ===================================== */}

        {error && (
          <div className="applications-error">

            <span>
              {error}
            </span>

            <button
              onClick={
                loadApplications
              }
            >
              Try Again
            </button>

          </div>
        )}


        {/* =====================================
            LOADING
        ===================================== */}

        {loading && (
          <section className="applications-loading">

            <div className="loading-spinner" />

            <h3>
              Loading applications...
            </h3>

            <p>
              Please wait while we fetch
              your applications.
            </p>

          </section>
        )}


        {/* =====================================
            APPLICATION LIST
        ===================================== */}

        {!loading &&
          applications.length > 0 && (

          <section className="applications-list">

            {/* LIST HEADER */}

            <div className="list-heading">

              <div>

                <span className="section-label">
                  YOUR ACTIVITY
                </span>

                <h2>
                  Recent Applications
                </h2>

              </div>

              <span className="application-count">
                {applications.length} total
              </span>

            </div>


            {/* APPLICATION GRID */}

            <div className="application-grid">

              {applications.map(
                (application) => (

                <article
                  className="application-card"
                  key={
                    application._id
                  }
                >

                  {/* =================================
                      CARD TOP
                  ================================= */}

                  <div className="application-card-top">

                    <div className="application-job-icon">
                      <BriefcaseBusiness
                        size={24}
                      />
                    </div>

                    <span
                      className={getStatusClass(
                        application.status
                      )}
                    >
                      {application.status}
                    </span>

                  </div>


                  {/* =================================
                      CONTENT
                  ================================= */}

                  <div className="application-content">

                    <h3>
                      {application.title}
                    </h3>

                    <p className="application-company">
                      {application.company}
                    </p>


                    <div className="application-details">

                      {/* LOCATION */}

                      <div className="application-detail">

                        <MapPin size={16} />

                        <span>
                          {application.location}
                        </span>

                      </div>


                      {/* PAY */}

                      <div className="application-detail">

                        <IndianRupee size={16} />

                        <span>
                          {application.pay}
                        </span>

                      </div>


                      {/* DURATION */}

                      <div className="application-detail">

                        <Clock3 size={16} />

                        <span>
                          {application.duration}
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* =================================
                      FOOTER
                  ================================= */}

                  <div className="application-footer">

                    <div className="applied-date">

                      <CalendarDays size={15} />

                      Applied{" "}

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

                    </div>

                    <Link
                      href={`/job-details?id=${application.jobId}`}
                      className="view-application-button"
                    >
                      View Job
                    </Link>

                  </div>


                  {/* =================================
                      ACCEPTED PAYMENT AREA
                  ================================= */}

                  {application.status ===
                    "Accepted" && (

                    <div className="accepted-payment-box">

                      <div className="accepted-payment-info">

                        <div className="accepted-payment-icon">

                          <CheckCircle2
                            size={20}
                          />

                        </div>

                        <div>

                          <strong>
                            Application Accepted
                          </strong>

                          <span>
                            You can proceed with
                            the demo payment.
                          </span>

                        </div>

                      </div>


                      <button
                        type="button"
                        className="pay-now-button"
                        onClick={() =>
                          handlePayment(
                            application
                          )
                        }
                      >

                        <CreditCard
                          size={18}
                        />

                        Pay Now

                      </button>

                    </div>

                  )}


                  {/* =================================
                      APPLIED STATUS
                  ================================= */}

                  {application.status ===
                    "Applied" && (

                    <div className="application-status-note">

                      <Clock3 size={16} />

                      <span>
                        Waiting for business
                        review.
                      </span>

                    </div>

                  )}


                  {/* =================================
                      UNDER REVIEW
                  ================================= */}

                  {application.status ===
                    "Under Review" && (

                    <div className="application-status-note review-note">

                      <Clock3 size={16} />

                      <span>
                        Your application is
                        currently under review.
                      </span>

                    </div>

                  )}

                </article>

              ))}

            </div>

          </section>

        )}


        {/* =====================================
            EMPTY
        ===================================== */}

        {!loading &&
          applications.length === 0 &&
          !error && (

          <section className="empty-applications">

            <div className="empty-icon">
              <Search size={32} />
            </div>

            <h2>
              No Applications Yet
            </h2>

            <p>
              You haven't applied for any jobs
              yet. Find an opportunity and
              start applying.
            </p>

            <Link
              href="/find-jobs"
              className="find-jobs-button"
            >
              Find Jobs
            </Link>

          </section>

        )}


        {/* =====================================
            RATE YOUR EXPERIENCE
        ===================================== */}

        <section className="applications-rating-section">

          <div className="rating-icon-box">

            <Star size={27} />

          </div>


          <div className="rating-content">

            <span className="rating-label">
              YOUR FEEDBACK
            </span>

            <h2>
              Rate Your Experience
            </h2>

            <p>
              Completed a job? Share your experience
              and rate the person you worked with.
            </p>

          </div>


          <a
            href="https://connecta-rating-rasin2008-velora.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="rating-button"
          >

            <Star size={18} />

            Give a Rating

          </a>

        </section>


        {/* =====================================
            WALLET BUTTON
        ===================================== */}

        <div className="applications-wallet-link">

          <Link
            href="/wallet"
            className="wallet-page-button"
          >

            <WalletCards size={18} />

            Open My Wallet

          </Link>

        </div>

      </div>

    </main>
  );
}