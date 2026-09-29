"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Save,
  RefreshCw,
  BriefcaseBusiness,
} from "lucide-react";

import "./profile.css";

type UserData = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  education: string;
  role?: "student" | "business";
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [education, setEducation] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const savedUser = localStorage.getItem("connectaUser");

      if (!savedUser) {
        setError("Please login to view your profile.");
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(savedUser);

      const userId = parsedUser?.id || parsedUser?._id;

      if (!userId) {
        setError("User information is missing. Please login again.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `/api/profile?userId=${userId}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load profile."
        );
      }

      const profile = data.user;

      setUser(profile);

      setName(profile.name || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
      setLocation(profile.location || "");
      setEducation(profile.education || "");
    } catch (err) {
      console.error("PROFILE LOAD ERROR:", err);
      setError("Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const userId = user?.id || user?._id;

      if (!userId) {
        setError("User ID is missing. Please login again.");
        return;
      }

      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          name,
          email,
          phone,
          location,
          education,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update profile."
        );
      }

      const updatedUser = {
        ...data.user,
      };

      setUser(updatedUser);

      localStorage.setItem(
        "connectaUser",
        JSON.stringify(updatedUser)
      );

      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("PROFILE UPDATE ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-orb profile-orb-one" />
        <div className="profile-orb profile-orb-two" />

        <div className="profile-loading">
          <div className="profile-spinner" />
          <h2>Loading Profile...</h2>
          <p>Please wait while we fetch your information.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-orb profile-orb-one" />
      <div className="profile-orb profile-orb-two" />
      <div className="profile-orb profile-orb-three" />

      <div className="profile-container">

        {/* TOP BAR */}
        <header className="profile-header">
          <Link
            href="/"
            className="profile-back-button"
          >
            <ArrowLeft size={18} />
            Back
          </Link>

          <button
            className="profile-refresh-button"
            onClick={loadProfile}
            disabled={loading}
          >
            <RefreshCw
              size={17}
              className={loading ? "profile-refresh-spin" : ""}
            />
            Refresh
          </button>
        </header>

        {/* PROFILE HERO */}
        <section className="profile-hero">

          <div className="profile-avatar">
            <User size={48} />
          </div>

          <div className="profile-hero-content">
            <span className="profile-label">
              CONNECTA PROFILE
            </span>

            <h1>{name || "Your Profile"}</h1>

            <p>
              Manage your personal information and
              keep your CONNECTA profile updated.
            </p>

            {user?.role && (
              <span className="profile-role">
                <BriefcaseBusiness size={14} />
                {user.role === "business"
                  ? "Business Account"
                  : "Student Account"}
              </span>
            )}
          </div>

        </section>

        {/* ERROR */}
        {error && (
          <div className="profile-message profile-error">
            <span>{error}</span>
            <button onClick={loadProfile}>
              Try Again
            </button>
          </div>
        )}

        {/* SUCCESS */}
        {message && (
          <div className="profile-message profile-success">
            {message}
          </div>
        )}

        {/* FORM */}
        {!error && (
          <form
            className="profile-form-card"
            onSubmit={handleSave}
          >

            <div className="profile-form-heading">
              <div>
                <span className="profile-label">
                  PERSONAL INFORMATION
                </span>

                <h2>Edit Profile</h2>

                <p>
                  Update your information below.
                </p>
              </div>

              <div className="form-heading-icon">
                <User size={24} />
              </div>
            </div>

            <div className="profile-form-grid">

              {/* NAME */}
              <div className="profile-field">
                <label htmlFor="name">
                  Full Name
                </label>

                <div className="profile-input-box">
                  <User size={19} />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="profile-field">
                <label htmlFor="email">
                  Email Address
                </label>

                <div className="profile-input-box">
                  <Mail size={19} />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* PHONE */}
              <div className="profile-field">
                <label htmlFor="phone">
                  Phone Number
                </label>

                <div className="profile-input-box">
                  <Phone size={19} />

                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* LOCATION */}
              <div className="profile-field">
                <label htmlFor="location">
                  Location
                </label>

                <div className="profile-input-box">
                  <MapPin size={19} />

                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                    placeholder="Kochi, Kerala"
                  />
                </div>
              </div>

              {/* EDUCATION */}
              <div className="profile-field profile-field-full">
                <label htmlFor="education">
                  Education
                </label>

                <div className="profile-input-box">
                  <GraduationCap size={19} />

                  <input
                    id="education"
                    type="text"
                    value={education}
                    onChange={(e) =>
                      setEducation(e.target.value)
                    }
                    placeholder="Enter your education"
                  />
                </div>
              </div>

            </div>

            {/* SAVE */}
            <div className="profile-form-footer">

              <span className="profile-save-note">
                Your information will be saved to your
                CONNECTA account.
              </span>

              <button
                type="submit"
                className="profile-save-button"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="button-spinner" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>

            </div>

          </form>
        )}

      </div>
    </main>
  );
}