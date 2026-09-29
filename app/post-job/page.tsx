"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  BriefcaseBusiness,
  MapPin,
  IndianRupee,
  Clock3,
  FileText,
  Tag,
  Building2,
  Send,
  CheckCircle2,
} from "lucide-react";

import "./post-job.css";

type User = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
};

export default function PostJobPage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [businessName, setBusinessName] = useState("Business");

  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    category: "",
    location: "",
    pay: "",
    duration: "",
  });

  const [loading, setLoading] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* --------------------------------
     CHECK LOGIN + BUSINESS ROLE
  -------------------------------- */

  useEffect(() => {
    const savedUser = localStorage.getItem("connectaUser");

    if (!savedUser) {
      router.replace("/");
      return;
    }

    try {
      const user: User = JSON.parse(savedUser);

      const id = user.id || user._id || "";

      if (!id) {
        setError("User information is incomplete. Please login again.");
        setCheckingUser(false);
        return;
      }

      /* BUSINESS ONLY */

      if (user.role !== "business") {
        setError("Only business accounts can post jobs.");
        setCheckingUser(false);

        setTimeout(() => {
          router.replace("/home-student");
        }, 1200);

        return;
      }

      setUserId(id);

      const name = user.name || "Business";

      setBusinessName(name);

      setForm((previous) => ({
        ...previous,
        company: name,
      }));

      setCheckingUser(false);
    } catch (error) {
      console.error("USER DATA ERROR:", error);

      localStorage.removeItem("connectaUser");

      router.replace("/");
    }
  }, [router]);

  /* --------------------------------
     INPUT CHANGE
  -------------------------------- */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* --------------------------------
     SUBMIT JOB
  -------------------------------- */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (!userId) {
      setError("Please login again before posting a job.");
      return;
    }

    if (
      !form.title.trim() ||
      !form.company.trim() ||
      !form.description.trim() ||
      !form.category.trim() ||
      !form.location.trim() ||
      !form.pay.trim() ||
      !form.duration.trim()
    ) {
      setError("Please fill all job details.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/jobs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title.trim(),
          company: form.company.trim(),
          description: form.description.trim(),
          category: form.category.trim(),
          location: form.location.trim(),
          pay: form.pay.trim(),
          duration: form.duration.trim(),

          /*
            IMPORTANT:
            This is the Business user's MongoDB ID.
            Business Applications uses this value
            to identify which jobs belong to this business.
          */
          postedBy: userId,
        }),
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error("Invalid server response.");
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to post job.");
      }

      setSuccess("Job posted successfully! 🎉");

      setForm({
        title: "",
        company: businessName,
        description: "",
        category: "",
        location: "",
        pay: "",
        duration: "",
      });

      setTimeout(() => {
        router.push("/find-jobs");
      }, 1500);
    } catch (error) {
      console.error("POST JOB ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while posting the job."
      );
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------
     LOADING
  -------------------------------- */

  if (checkingUser) {
    return (
      <main className="post-job-page">
        <div className="post-job-loading">
          <div className="loading-spinner" />
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  /* --------------------------------
     PAGE
  -------------------------------- */

  return (
    <main className="post-job-page">
      <div className="post-job-orb orb-one" />
      <div className="post-job-orb orb-two" />
      <div className="post-job-orb orb-three" />

      <div className="post-job-container">

        {/* TOP BAR */}

        <div className="post-job-top">

          <Link href="/dashboard" className="back-button">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <div className="business-badge">
            <Building2 size={16} />
            Business
          </div>

        </div>

        {/* HEADER */}

        <section className="post-job-header">

          <div className="header-icon">
            <BriefcaseBusiness size={32} />
          </div>

          <div>
            <span>CONNECTA JOB POSTING</span>

            <h1>Post a New Job</h1>

            <p>
              Create a job opportunity and connect with students
              looking for flexible work.
            </p>
          </div>

        </section>

        {/* MAIN */}

        <div className="post-job-layout">

          {/* FORM */}

          <section className="form-card">

            <div className="card-heading">

              <div>
                <span>JOB DETAILS</span>
                <h2>Create Job Listing</h2>
              </div>

              <BriefcaseBusiness size={24} />

            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                {/* JOB TITLE */}

                <div className="input-group full">

                  <label htmlFor="title">
                    <BriefcaseBusiness size={16} />
                    Job Title
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="e.g. Event Assistant"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* COMPANY */}

                <div className="input-group">

                  <label htmlFor="company">
                    <Building2 size={16} />
                    Company / Business
                  </label>

                  <input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Your business name"
                    value={form.company}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* CATEGORY */}

                <div className="input-group">

                  <label htmlFor="category">
                    <Tag size={16} />
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select category
                    </option>

                    <option value="Events">
                      Events
                    </option>

                    <option value="Retail">
                      Retail
                    </option>

                    <option value="Delivery">
                      Delivery
                    </option>

                    <option value="Food & Hospitality">
                      Food & Hospitality
                    </option>

                    <option value="Marketing">
                      Marketing
                    </option>

                    <option value="Technology">
                      Technology
                    </option>

                    <option value="Customer Service">
                      Customer Service
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>

                </div>

                {/* LOCATION */}

                <div className="input-group">

                  <label htmlFor="location">
                    <MapPin size={16} />
                    Location
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g. Kochi, Kerala"
                    value={form.location}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* PAY */}

                <div className="input-group">

                  <label htmlFor="pay">
                    <IndianRupee size={16} />
                    Pay
                  </label>

                  <input
                    id="pay"
                    name="pay"
                    type="text"
                    placeholder="e.g. ₹800/day"
                    value={form.pay}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* DURATION */}

                <div className="input-group">

                  <label htmlFor="duration">
                    <Clock3 size={16} />
                    Duration
                  </label>

                  <input
                    id="duration"
                    name="duration"
                    type="text"
                    placeholder="e.g. 1 Day"
                    value={form.duration}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* DESCRIPTION */}

                <div className="input-group full">

                  <label htmlFor="description">
                    <FileText size={16} />
                    Job Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows={7}
                    placeholder="Describe the job, responsibilities, requirements and other important details..."
                    value={form.description}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              {/* ERROR */}

              {error && (
                <div className="message error-message">
                  <span>!</span>
                  {error}
                </div>
              )}

              {/* SUCCESS */}

              {success && (
                <div className="message success-message">
                  <CheckCircle2 size={20} />
                  {success}
                </div>
              )}

              {/* BUTTON */}

              <button
                type="submit"
                className="submit-job-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="button-spinner" />
                    Posting Job...
                  </>
                ) : (
                  <>
                    <Send size={19} />
                    Post Job
                  </>
                )}
              </button>

            </form>

          </section>

          {/* PREVIEW */}

          <aside className="preview-card">

            <div className="preview-top">

              <span>LIVE PREVIEW</span>

              <div className="preview-dot" />

            </div>

            <div className="preview-job-icon">
              <BriefcaseBusiness size={28} />
            </div>

            <h2>
              {form.title || "Your Job Title"}
            </h2>

            <p className="preview-company">
              {form.company || "Your Business"}
            </p>

            <div className="preview-details">

              <div>
                <MapPin size={17} />
                <span>
                  {form.location || "Job Location"}
                </span>
              </div>

              <div>
                <IndianRupee size={17} />
                <span>
                  {form.pay || "Pay Amount"}
                </span>
              </div>

              <div>
                <Clock3 size={17} />
                <span>
                  {form.duration || "Duration"}
                </span>
              </div>

              <div>
                <Tag size={17} />
                <span>
                  {form.category || "Category"}
                </span>
              </div>

            </div>

            <div className="preview-description">

              <h3>
                Description
              </h3>

              <p>
                {form.description ||
                  "Your job description will appear here. Add clear details so students can understand the opportunity."}
              </p>

            </div>

            <div className="preview-footer">

              <span>
                Posted by
              </span>

              <strong>
                {businessName || "Business"}
              </strong>

            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}