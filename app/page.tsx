"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Home,
  Search,
  BriefcaseBusiness,
  MessageCircle,
  WalletCards,
  Bell,
  User,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Menu,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserRound,
  ArrowRight,
  Sparkles,
  MapPin,
  Users,
} from "lucide-react";

import {
  FaGoogle,
  FaApple,
  FaFacebookF,
} from "react-icons/fa";

type AuthMode = "login" | "register";

export default function HomePage() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [education, setEducation] = useState("");

  const [role, setRole] = useState<"student" | "business">("student");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  /* =====================================================
     CHECK LOGIN
  ===================================================== */

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("connectaUser");

      if (savedUser) {
        const user = JSON.parse(savedUser);

        setLoggedIn(true);
        setUserRole(user.role || "");
        setName(user.name || "");
        setEmail(user.email || "");
      }
    } catch (error) {
      console.error("LOGIN CHECK ERROR:", error);
      localStorage.removeItem("connectaUser");
    }
  }, []);

  /* =====================================================
     SIDEBAR NAVIGATION
  ===================================================== */

  const navigateTo = (path: string) => {
    /*
      Login ചെയ്തിട്ടില്ലെങ്കിൽ
      page open ചെയ്യാതെ Login panel open ചെയ്യും.
    */

    if (!loggedIn) {
      setAuthMode("login");
      setAuthOpen(true);
      setSidebarOpen(true);
      return;
    }

    /*
      Login ചെയ്തിട്ടുണ്ടെങ്കിൽ
      requested page open ചെയ്യും.
    */

    setSidebarOpen(false);
    setAuthOpen(false);

    router.push(path);
  };

  /* =====================================================
     OPEN LOGIN
  ===================================================== */

  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
    setSidebarOpen(true);
  };

  /* =====================================================
     OPEN REGISTER
  ===================================================== */

  const openRegister = () => {
    setAuthMode("register");
    setAuthOpen(true);
    setSidebarOpen(true);
  };

  /* =====================================================
     CLOSE AUTH
  ===================================================== */

  const closeAuth = () => {
    setAuthOpen(false);
  };

  /* =====================================================
     REGISTER
  ===================================================== */

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Name, email and password are required.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          location,
          education,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Registration failed.");
        return;
      }

      localStorage.setItem(
        "connectaUser",
        JSON.stringify(data.user)
      );

      setLoggedIn(true);
      setUserRole(data.user.role || "");
      setAuthOpen(false);
      setSidebarOpen(false);

      if (data.user.role === "business") {
        router.push("/dashboard");
      } else {
        router.push("/home-student");
      }
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOGIN
  ===================================================== */

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Invalid email or password.");
        return;
      }

      localStorage.setItem(
        "connectaUser",
        JSON.stringify(data.user)
      );

      setLoggedIn(true);
      setUserRole(data.user.role || "");
      setAuthOpen(false);
      setSidebarOpen(false);

      if (data.user.role === "business") {
        router.push("/dashboard");
      } else {
        router.push("/home-student");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("connectaUser");

    setLoggedIn(false);
    setUserRole("");

    setSidebarOpen(false);
    setAuthOpen(false);

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    router.replace("/");
  };

  /* =====================================================
     MOBILE SIDEBAR CLOSE
  ===================================================== */

  const closeSidebarMobile = () => {
    if (window.innerWidth <= 760) {
      setSidebarOpen(false);
    }
  };

  return (
    <main
      className={`connecta ${
        sidebarOpen ? "sidebar-is-open" : ""
      } ${authOpen ? "auth-is-open" : ""}`}
    >
      {/* =================================================
          MENU BUTTON
      ================================================= */}

      {!sidebarOpen && (
        <button
          className="sidebar-menu-button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={30} />
        </button>
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`connecta-sidebar ${
          sidebarOpen ? "sidebar-visible" : ""
        }`}
      >
        {/* LOGO */}

        <div className="sidebar-logo">
          <img
            src="/connecta-logo.png"
            alt="CONNECTA"
            className="sidebar-connecta-logo"
          />
        </div>

        {/* CLOSE BUTTON */}

        <button
          className="sidebar-close-button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        >
          <X size={25} />
        </button>

        {/* MENU */}

        <nav className="menu">

          {/* HOME */}

          <Link
            href="/"
            className="sidebar-item active"
            onClick={closeSidebarMobile}
          >
            <Home size={24} />
            <span>Home</span>
          </Link>

          {/* FIND JOBS */}

          <button
            type="button"
            className="sidebar-item"
            onClick={() => {
              closeSidebarMobile();
              navigateTo("/find-jobs");
            }}
          >
            <Search size={24} />
            <span>Find Jobs</span>
          </button>

          {/* MY APPLICATIONS */}

          <button
            type="button"
            className="sidebar-item"
            onClick={() => {
              closeSidebarMobile();
              navigateTo("/my-applications");
            }}
          >
            <BriefcaseBusiness size={24} />
            <span>My Applications</span>
          </button>

          {/* MESSAGES */}

          <button
            type="button"
            className="sidebar-item"
            onClick={() => {
              closeSidebarMobile();
              navigateTo("/messages");
            }}
          >
            <MessageCircle size={24} />
            <span>Messages</span>
          </button>

          {/* WALLET */}

          <button
            type="button"
            className="sidebar-item"
            onClick={() => {
              closeSidebarMobile();
              navigateTo("/wallet");
            }}
          >
            <WalletCards size={24} />
            <span>Wallet</span>
          </button>

          {/* NOTIFICATIONS */}

          <button
            type="button"
            className="sidebar-item"
            onClick={() => {
              closeSidebarMobile();
              navigateTo("/notifications");
            }}
          >
            <Bell size={24} />
            <span>Notifications</span>
          </button>

          {/* PROFILE */}

          <button
            type="button"
            className="sidebar-item"
            onClick={() => {
              closeSidebarMobile();
              navigateTo("/profile");
            }}
          >
            <User size={24} />
            <span>Profile</span>
          </button>

          {/* SETTINGS */}

          <button
            type="button"
            className="sidebar-item"
            onClick={() => {
              closeSidebarMobile();
              navigateTo("/settings");
            }}
          >
            <Settings size={24} />
            <span>Settings</span>
          </button>
        </nav>

        {/* =================================================
            SIDEBAR BOTTOM
        ================================================= */}

        <div className="sidebar-bottom">

          {/* HELP */}

          <button
            type="button"
            className="sidebar-item"
            onClick={() => {
              closeSidebarMobile();
              navigateTo("/help-support");
            }}
          >
            <HelpCircle size={24} />
            <span>Help & Support</span>
          </button>

          {/* LOGIN */}

          {!loggedIn && (
            <button
              type="button"
              className="sidebar-item login-item"
              onClick={openLogin}
            >
              <LogOut size={24} />
              <span>Login</span>
            </button>
          )}

          {/* LOGOUT */}

          {loggedIn && (
            <button
              type="button"
              className="sidebar-item logout-item"
              onClick={handleLogout}
            >
              <LogOut size={24} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </aside>

      {/* =================================================
          HOME
      ================================================= */}

      <section className="home">

        <div className="home-overlay" />

        <div className="home-content">

          {/* BADGE */}

          <div className="top-badge">
            <Sparkles size={14} />
            THE FUTURE OF FLEXIBLE WORK
          </div>

          {/* STUDENT LINE */}

          <div className="student-line">
            <span>For Students.</span>
            <span>By Students.</span>
          </div>

          {/* TITLE */}

          <h1>CONNECTA</h1>

          <h2>Work. Earn. Grow.</h2>

          <div className="small-line" />

          {/* DESCRIPTION */}

          <p>
            Find flexible, nearby jobs that fit your schedule.
            Connect with opportunities, build experience and
            grow your future.
          </p>

          {/* FIND JOBS BUTTON */}

          <div className="hero-action">
            <button
              type="button"
              className="find-jobs-button"
              onClick={() => navigateTo("/find-jobs")}
            >
              Find Jobs
              <ArrowRight size={20} />
            </button>
          </div>

          {/* STATS */}

          <div className="stats">

            <div className="stat">
              <strong>10K+</strong>
              <span>Jobs Posted</span>
            </div>

            <div className="stat">
              <strong>25K+</strong>
              <span>Students</span>
            </div>

            <div className="stat">
              <strong>150+</strong>
              <span>Cities</span>
            </div>

          </div>

          {/* TRUST */}

          <div className="trust-box">

            <div className="trust-shield">
              <Users size={20} />
            </div>

            <div className="trust-rating">

              <strong>
                Trusted by our community
              </strong>

              <span>
                ★ ★ ★ ★ ★
                <b className="rating-number">
                  4.8/5
                </b>
              </span>

            </div>

          </div>

          {/* DOTS */}

          <div className="slider-dots">
            <span className="active" />
            <span />
            <span />
          </div>

        </div>

        {/* =================================================
            3D GLASS CARDS
        ================================================= */}

        <div className="hero-3d">

          <div className="glass-card glass-card-top">

            <div className="glass-icon">
              <BriefcaseBusiness size={20} />
            </div>

            <div>
              <strong>Flexible Jobs</strong>

              <span>
                Work around your schedule
              </span>
            </div>

          </div>

          <div className="glass-card glass-card-location">

            <div className="glass-icon">
              <MapPin size={20} />
            </div>

            <div>
              <strong>
                Nearby Opportunities
              </strong>

              <span>
                Discover jobs around you
              </span>
            </div>

          </div>

          <div className="glass-card glass-card-students">

            <div className="glass-icon">
              <Users size={20} />
            </div>

            <div>
              <strong>
                25K+ Students
              </strong>

              <span>
                Growing community
              </span>
            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          AUTH PANEL
      ================================================= */}

      <aside
        className={`auth-panel ${
          authOpen ? "auth-visible" : ""
        }`}
      >

        {/* CLOSE AUTH */}

        <button
          className="close-auth"
          onClick={closeAuth}
          aria-label="Close authentication"
        >
          <X size={24} />
        </button>

        <div
          className={`auth-content ${
            authMode === "register"
              ? "register"
              : ""
          }`}
        >

          {/* AUTH LOGO */}

          <div className="auth-logo">

            <img
              src="/connecta-logo.png"
              alt="CONNECTA"
              className="auth-connecta-logo"
            />

          </div>

          {/* TITLE */}

          <h1>
            {authMode === "login"
              ? "Welcome back"
              : "Create your account"}
          </h1>

          <p className="auth-subtitle">
            {authMode === "login"
              ? "Login to continue with CONNECTA."
              : "Join CONNECTA and discover flexible opportunities."}
          </p>

          {/* =================================================
              REGISTER FIELDS
          ================================================= */}

          {authMode === "register" && (
            <>

              {/* NAME */}

              <div className="field">

                <label>Full Name</label>

                <div className="input-box">

                  <UserRound size={18} />

                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                  />

                </div>

              </div>

              {/* PHONE */}

              <div className="field">

                <label>Phone</label>

                <div className="input-box">

                  <Mail size={18} />

                  <input
                    type="text"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                  />

                </div>

              </div>

              {/* LOCATION */}

              <div className="field">

                <label>Location</label>

                <div className="input-box">

                  <MapPin size={18} />

                  <input
                    type="text"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                  />

                </div>

              </div>

              {/* EDUCATION */}

              <div className="field">

                <label>Education</label>

                <div className="input-box">

                  <UserRound size={18} />

                  <input
                    type="text"
                    placeholder="Enter education"
                    value={education}
                    onChange={(e) =>
                      setEducation(e.target.value)
                    }
                  />

                </div>

              </div>

              {/* ACCOUNT TYPE */}

              <div className="field">

                <label>Account Type</label>

                <div className="role-selector">

                  <button
                    type="button"
                    className={
                      role === "student"
                        ? "role-option active"
                        : "role-option"
                    }
                    onClick={() =>
                      setRole("student")
                    }
                  >
                    Student
                  </button>

                  <button
                    type="button"
                    className={
                      role === "business"
                        ? "role-option active"
                        : "role-option"
                    }
                    onClick={() =>
                      setRole("business")
                    }
                  >
                    Business
                  </button>

                </div>

              </div>

            </>
          )}

          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="field">

            <label>Email</label>

            <div className="input-box">

              <Mail size={18} />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>

          </div>

          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="field">

            <label>Password</label>

            <div className="input-box">

              <Lock size={18} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                type="button"
                className="eye"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>

          {/* =================================================
              CONFIRM PASSWORD
          ================================================= */}

          {authMode === "register" && (
            <div className="field">

              <label>
                Confirm Password
              </label>

              <div className="input-box">

                <Lock size={18} />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  className="eye"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>
          )}

          {/* =================================================
              REMEMBER ME
          ================================================= */}

          {authMode === "login" && (
            <div className="remember">

              <label>

                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) =>
                    setRemember(
                      e.target.checked
                    )
                  }
                />

                Remember me

              </label>

              <button type="button">
                Forgot password?
              </button>

            </div>
          )}

          {/* =================================================
              MAIN BUTTON
          ================================================= */}

          <button
            className="login-button"
            onClick={
              authMode === "login"
                ? handleLogin
                : handleRegister
            }
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : authMode === "login"
              ? "Login"
              : "Create Account"}
          </button>

          {/* =================================================
              SOCIAL LOGIN
          ================================================= */}

          {authMode === "login" && (
            <>

              <div className="or">

                <span />

                <p>
                  OR CONTINUE WITH
                </p>

                <span />

              </div>

              <div className="social">

                <button type="button">
                  <FaGoogle />
                </button>

                <button type="button">
                  <FaApple />
                </button>

                <button type="button">
                  <FaFacebookF />
                </button>

              </div>

            </>
          )}

          {/* =================================================
              SWITCH LOGIN / REGISTER
          ================================================= */}

          <div className="switch-auth">

            <span>
              {authMode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>

            <button
              type="button"
              onClick={() => {
                if (authMode === "login") {
                  openRegister();
                } else {
                  openLogin();
                }
              }}
            >
              {authMode === "login"
                ? "Register"
                : "Login"}
            </button>

          </div>

        </div>

      </aside>

    </main>
  );
}