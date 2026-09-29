"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Lock,
  User,
  ShieldCheck,
  LogOut,
  Save,
  Settings as SettingsIcon,
  CheckCircle2,
} from "lucide-react";
import "./settings.css";

interface ConnectaUser {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  education?: string;
  role?: "student" | "business";
}

export default function SettingsPage() {
  const [user, setUser] = useState<ConnectaUser | null>(null);

  const [notifications, setNotifications] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);

  const [darkMode, setDarkMode] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  /* =========================================
     LOAD USER + SETTINGS
  ========================================= */

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("connectaUser");

      if (!savedUser) {
        window.location.href = "/";
        return;
      }

      const parsedUser = JSON.parse(savedUser);

      setUser(parsedUser);

      const savedSettings =
        localStorage.getItem("connectaSettings");

      if (savedSettings) {
        const settings = JSON.parse(savedSettings);

        setNotifications(
          settings.notifications ?? true
        );

        setJobAlerts(
          settings.jobAlerts ?? true
        );

        setMessageAlerts(
          settings.messageAlerts ?? true
        );

        setPaymentAlerts(
          settings.paymentAlerts ?? true
        );

        setDarkMode(
          settings.darkMode ?? true
        );
      }
    } catch (error) {
      console.error("SETTINGS LOAD ERROR:", error);

      localStorage.removeItem("connectaUser");

      window.location.href = "/";
    }
  }, []);

  /* =========================================
     SAVE SETTINGS
  ========================================= */

  const handleSave = () => {
    try {
      setSaving(true);
      setSaved(false);

      const settings = {
        notifications,
        jobAlerts,
        messageAlerts,
        paymentAlerts,
        darkMode,
      };

      localStorage.setItem(
        "connectaSettings",
        JSON.stringify(settings)
      );

      setTimeout(() => {
        setSaving(false);
        setSaved(true);

        setTimeout(() => {
          setSaved(false);
        }, 2500);
      }, 500);
    } catch (error) {
      console.error("SAVE SETTINGS ERROR:", error);

      alert("Failed to save settings.");
      setSaving(false);
    }
  };

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    localStorage.removeItem("connectaUser");

    window.location.href = "/";
  };

  /* =========================================
     TOGGLE
  ========================================= */

  const Toggle = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: () => void;
  }) => {
    return (
      <button
        type="button"
        className={`settings-toggle ${
          checked ? "active" : ""
        }`}
        onClick={onChange}
        aria-label="Toggle setting"
      >
        <span />
      </button>
    );
  };

  return (
    <main className="settings-page">

      {/* BACKGROUND ORBS */}
      <div className="settings-orb settings-orb-one" />
      <div className="settings-orb settings-orb-two" />
      <div className="settings-orb settings-orb-three" />

      {/* HEADER */}
      <header className="settings-header">

        <Link
          href="/"
          className="settings-back"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>

        <div className="settings-title-wrap">
          <div className="settings-title-icon">
            <SettingsIcon size={22} />
          </div>

          <div>
            <h1>Settings</h1>
            <p>
              Manage your CONNECTA account
            </p>
          </div>
        </div>

        <div className="settings-user-mini">
          <div className="settings-avatar">
            {user?.name
              ? user.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div>
            <strong>
              {user?.name || "User"}
            </strong>

            <span>
              {user?.role === "business"
                ? "Business"
                : "Student"}
            </span>
          </div>
        </div>

      </header>

      {/* MAIN */}
      <section className="settings-container">

        {/* ACCOUNT */}
        <div className="settings-card">

          <div className="settings-card-header">
            <div className="settings-section-icon">
              <User size={21} />
            </div>

            <div>
              <h2>Account</h2>
              <p>
                Your CONNECTA account information
              </p>
            </div>
          </div>

          <div className="account-info-grid">

            <div className="account-info">
              <span>Name</span>
              <strong>
                {user?.name || "Not available"}
              </strong>
            </div>

            <div className="account-info">
              <span>Email</span>
              <strong>
                {user?.email || "Not available"}
              </strong>
            </div>

            <div className="account-info">
              <span>Phone</span>
              <strong>
                {user?.phone || "Not added"}
              </strong>
            </div>

            <div className="account-info">
              <span>Location</span>
              <strong>
                {user?.location || "Not added"}
              </strong>
            </div>

            <div className="account-info">
              <span>Education</span>
              <strong>
                {user?.education || "Not added"}
              </strong>
            </div>

            <div className="account-info">
              <span>Account Type</span>

              <strong className="role-badge">
                {user?.role === "business"
                  ? "Business Account"
                  : "Student Account"}
              </strong>
            </div>

          </div>

          <Link
            href="/profile"
            className="settings-profile-btn"
          >
            <User size={17} />
            Edit Profile
          </Link>

        </div>

        {/* NOTIFICATIONS */}
        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-section-icon">
              <Bell size={21} />
            </div>

            <div>
              <h2>Notifications</h2>
              <p>
                Control how CONNECTA notifies you
              </p>
            </div>

          </div>

          <div className="settings-options">

            {/* ALL NOTIFICATIONS */}
            <div className="settings-option">

              <div className="settings-option-content">
                <div className="option-icon">
                  <Bell size={18} />
                </div>

                <div>
                  <h3>Push Notifications</h3>
                  <p>
                    Receive notifications from CONNECTA
                  </p>
                </div>
              </div>

              <Toggle
                checked={notifications}
                onChange={() =>
                  setNotifications(!notifications)
                }
              />

            </div>

            {/* JOB ALERTS */}
            <div className="settings-option">

              <div className="settings-option-content">

                <div className="option-icon">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <h3>Job Alerts</h3>
                  <p>
                    Get notified about matching jobs
                  </p>
                </div>

              </div>

              <Toggle
                checked={jobAlerts}
                onChange={() =>
                  setJobAlerts(!jobAlerts)
                }
              />

            </div>

            {/* MESSAGE ALERTS */}
            <div className="settings-option">

              <div className="settings-option-content">

                <div className="option-icon">
                  <User size={18} />
                </div>

                <div>
                  <h3>Message Alerts</h3>
                  <p>
                    Receive alerts for new messages
                  </p>
                </div>

              </div>

              <Toggle
                checked={messageAlerts}
                onChange={() =>
                  setMessageAlerts(!messageAlerts)
                }
              />

            </div>

            {/* PAYMENT ALERTS */}
            <div className="settings-option">

              <div className="settings-option-content">

                <div className="option-icon">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <h3>Payment Alerts</h3>
                  <p>
                    Get notified about payment updates
                  </p>
                </div>

              </div>

              <Toggle
                checked={paymentAlerts}
                onChange={() =>
                  setPaymentAlerts(!paymentAlerts)
                }
              />

            </div>

          </div>

        </div>

        {/* APPEARANCE */}
        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-section-icon">
              <SettingsIcon size={21} />
            </div>

            <div>
              <h2>Appearance</h2>
              <p>
                Customize your CONNECTA experience
              </p>
            </div>

          </div>

          <div className="settings-option">

            <div className="settings-option-content">

              <div className="option-icon">
                <SettingsIcon size={18} />
              </div>

              <div>
                <h3>Dark Mode</h3>
                <p>
                  Use CONNECTA's dark interface
                </p>
              </div>

            </div>

            <Toggle
              checked={darkMode}
              onChange={() =>
                setDarkMode(!darkMode)
              }
            />

          </div>

        </div>

        {/* SECURITY */}
        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-section-icon">
              <Lock size={21} />
            </div>

            <div>
              <h2>Security</h2>
              <p>
                Keep your account protected
              </p>
            </div>

          </div>

          <div className="security-row">

            <div>
              <h3>Password</h3>
              <p>
                Update your password from your profile.
              </p>
            </div>

            <Link
              href="/profile"
              className="security-btn"
            >
              Manage
            </Link>

          </div>

        </div>

        {/* SAVE */}
        <div className="settings-save-area">

          {saved && (
            <div className="settings-success">
              <CheckCircle2 size={18} />
              Settings saved successfully
            </div>
          )}

          <button
            className="save-settings-btn"
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={18} />

            {saving
              ? "Saving..."
              : "Save Settings"}
          </button>

        </div>

        {/* LOGOUT */}
        <div className="logout-card">

          <div className="logout-content">

            <div className="logout-icon">
              <LogOut size={21} />
            </div>

            <div>
              <h2>Logout</h2>
              <p>
                Sign out of your CONNECTA account
              </p>
            </div>

          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </section>

    </main>
  );
}