"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Search,
  BookOpen,
  ShieldCheck,
  CreditCard,
  Briefcase,
  User,
  Send,
  CheckCircle2,
} from "lucide-react";

import "./help-support.css";

const faqs = [
  {
    question: "How do I apply for a job?",
    answer:
      "Go to Find Jobs, select a job you are interested in, open the job details and click Apply Now.",
  },
  {
    question: "How can I post a job?",
    answer:
      "Business users can open the Post Job section from their dashboard and submit the job details.",
  },
  {
    question: "How can I check my applications?",
    answer:
      "Open My Applications from the sidebar. You can see your application status and accepted jobs there.",
  },
  {
    question: "How does payment work?",
    answer:
      "When an application is accepted, the Pay Now option becomes available. You can choose UPI, Card or Net Banking.",
  },
  {
    question: "Where can I see my payments?",
    answer:
      "Open Wallet from the sidebar to view successful payments, pending payments and payment history.",
  },
  {
    question: "How do I edit my profile?",
    answer:
      "Open Profile from the sidebar and use the edit option to update your personal information.",
  },
  {
    question: "How do I change my settings?",
    answer:
      "Open Settings from the sidebar. You can manage notifications, job alerts, message alerts and payment alerts.",
  },
  {
    question: "What should I do if something is not working?",
    answer:
      "Check the FAQ first. If the issue continues, use the support form on this page to describe the problem.",
  },
];

export default function HelpSupport() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filteredFaqs = faqs.filter((faq) =>
    `${faq.question} ${faq.answer}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    setSubmitted(true);
    setMessage("");

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <main className="help-page">
      <div className="help-background-orb help-orb-one"></div>
      <div className="help-background-orb help-orb-two"></div>

      {/* Header */}
      <header className="help-header">
        <Link href="/" className="help-back-button">
          <ArrowLeft size={19} />
          <span>Back</span>
        </Link>

        <div className="help-title-area">
          <div className="help-title-icon">
            <HelpCircle size={24} />
          </div>

          <div>
            <h1>Help & Support</h1>
            <p>We&apos;re here to help you</p>
          </div>
        </div>
      </header>

      <div className="help-container">
        {/* Hero */}
        <section className="help-hero">
          <div className="help-hero-content">
            <div className="help-hero-icon">
              <HelpCircle size={42} />
            </div>

            <div>
              <h2>How can we help?</h2>
              <p>
                Find answers to common questions or send us a support request.
              </p>
            </div>
          </div>

          <div className="help-search">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search for help..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        {/* Quick Help */}
        <section className="quick-help-section">
          <div className="section-heading">
            <span className="section-icon">
              <BookOpen size={20} />
            </span>

            <div>
              <h2>Quick Help</h2>
              <p>Quick access to important CONNECTA sections</p>
            </div>
          </div>

          <div className="quick-help-grid">
            <Link href="/find-jobs" className="quick-help-card">
              <div className="quick-card-icon blue">
                <Briefcase size={22} />
              </div>

              <div>
                <h3>Find Jobs</h3>
                <p>Find nearby temporary jobs</p>
              </div>

              <span className="quick-arrow">→</span>
            </Link>

            <Link href="/my-applications" className="quick-help-card">
              <div className="quick-card-icon purple">
                <BookOpen size={22} />
              </div>

              <div>
                <h3>My Applications</h3>
                <p>Check your application status</p>
              </div>

              <span className="quick-arrow">→</span>
            </Link>

            <Link href="/profile" className="quick-help-card">
              <div className="quick-card-icon green">
                <User size={22} />
              </div>

              <div>
                <h3>Profile</h3>
                <p>Manage your profile information</p>
              </div>

              <span className="quick-arrow">→</span>
            </Link>

            <Link href="/wallet" className="quick-help-card">
              <div className="quick-card-icon orange">
                <CreditCard size={22} />
              </div>

              <div>
                <h3>Wallet</h3>
                <p>View your payment history</p>
              </div>

              <span className="quick-arrow">→</span>
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq-section">
          <div className="section-heading">
            <span className="section-icon">
              <HelpCircle size={20} />
            </span>

            <div>
              <h2>Frequently Asked Questions</h2>
              <p>Find answers to the most common questions</p>
            </div>
          </div>

          <div className="faq-list">
            {filteredFaqs.length === 0 ? (
              <div className="faq-empty">
                <Search size={32} />
                <h3>No results found</h3>
                <p>Try searching with a different keyword.</p>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => {
                const actualIndex = faqs.indexOf(faq);
                const isOpen = openFaq === actualIndex;

                return (
                  <div
                    className={`faq-item ${isOpen ? "faq-open" : ""}`}
                    key={index}
                  >
                    <button
                      className="faq-question"
                      onClick={() =>
                        setOpenFaq(isOpen ? null : actualIndex)
                      }
                    >
                      <span>{faq.question}</span>

                      <span className="faq-chevron">
                        <ChevronDown size={20} />
                      </span>
                    </button>

                    <div
                      className={`faq-answer-wrapper ${
                        isOpen ? "answer-visible" : ""
                      }`}
                    >
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Support Cards */}
        <section className="support-options">
          <div className="support-option-card">
            <div className="support-option-icon">
              <MessageCircle size={25} />
            </div>

            <div>
              <h3>Need more help?</h3>
              <p>
                Tell us about your issue and we&apos;ll help you understand
                what to do next.
              </p>
            </div>
          </div>

          <div className="support-option-card">
            <div className="support-option-icon shield">
              <ShieldCheck size={25} />
            </div>

            <div>
              <h3>Account & Safety</h3>
              <p>
                Keep your account information secure and never share your
                password with anyone.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="contact-support-section">
          <div className="section-heading">
            <span className="section-icon">
              <Send size={20} />
            </span>

            <div>
              <h2>Contact Support</h2>
              <p>Describe your problem and submit a support request</p>
            </div>
          </div>

          <form className="support-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>

                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>General</option>
                  <option>Account</option>
                  <option>Jobs</option>
                  <option>Applications</option>
                  <option>Payments</option>
                  <option>Technical Issue</option>
                  <option>Safety</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>

                <input
                  id="subject"
                  type="text"
                  placeholder="Enter your issue"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="support-message">Message</label>

              <textarea
                id="support-message"
                rows={6}
                placeholder="Describe your problem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            {submitted && (
              <div className="support-success">
                <CheckCircle2 size={20} />
                <span>
                  Your support request has been submitted successfully.
                </span>
              </div>
            )}

            <button type="submit" className="support-submit">
              <Send size={18} />
              Submit Request
            </button>
          </form>
        </section>

        {/* Bottom */}
        <section className="help-bottom">
          <h2>Still need help?</h2>
          <p>
            Check the sections above or describe your issue using the support
            form.
          </p>

          <div className="help-bottom-links">
            <Link href="/settings">Open Settings</Link>
            <Link href="/profile">Open Profile</Link>
            <Link href="/">Go Home</Link>
          </div>
        </section>
      </div>
    </main>
  );
}