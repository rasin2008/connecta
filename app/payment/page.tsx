"use client";
import "./payment.css";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Landmark,
  Loader2,
  Smartphone,
  WalletCards,
} from "lucide-react";

type PaymentMethod = "UPI" | "Card" | "Net Banking";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userId, setUserId] = useState("");
  const [jobId, setJobId] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);

  const [method, setMethod] = useState<PaymentMethod>("UPI");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("connectaUser");

    if (!savedUser) {
      router.replace("/");
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      setUserId(user.id || user._id || "");

      const urlJobId = searchParams.get("jobId");
      const urlAmount = searchParams.get("amount");

      setJobId(Number(urlJobId || 0));
      setAmount(Number(urlAmount || 0));
    } catch (error) {
      console.error("USER LOAD ERROR:", error);
      router.replace("/");
    }
  }, [router, searchParams]);

  const handlePayment = async () => {
    setError("");

    if (!userId) {
      setError("User not found. Please login again.");
      return;
    }

    if (!jobId) {
      setError("Job ID is missing.");
      return;
    }

    if (!amount || amount <= 0) {
      setError("Invalid payment amount.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          jobId,
          amount,
          method,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Payment failed.");
        return;
      }

      setSuccess(true);
    } catch (error) {
      console.error("PAYMENT ERROR:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="payment-page">
        <div className="payment-success-card">
          <div className="success-icon">
            <CheckCircle2 size={64} />
          </div>

          <h1>Payment Successful!</h1>

          <p>
            Your demo payment of ₹{amount.toLocaleString("en-IN")} has
            been completed successfully.
          </p>

          <div className="success-details">
            <div>
              <span>Payment Method</span>
              <strong>{method}</strong>
            </div>

            <div>
              <span>Job ID</span>
              <strong>#{jobId}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong className="success-text">Success</strong>
            </div>
          </div>

          <button
            className="payment-primary-btn"
            onClick={() => router.push("/home-student")}
          >
            Go to Home
          </button>

          <button
            className="payment-secondary-btn"
            onClick={() => router.push("/my-applications")}
          >
            View Applications
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="payment-page">
      <div className="payment-container">
        <button
          className="back-button"
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="payment-header">
          <div className="payment-logo">
            C
          </div>

          <div>
            <p className="payment-small-title">CONNECTA</p>
            <h1>Demo Payment</h1>
          </div>
        </div>

        <div className="payment-amount-card">
          <span>Amount to Pay</span>

          <strong>
            ₹{amount.toLocaleString("en-IN")}
          </strong>

          <small>
            Demo payment — no real money will be charged
          </small>
        </div>

        <section className="payment-section">
          <h2>Select Payment Method</h2>

          <div className="payment-methods">
            <button
              className={`payment-method ${
                method === "UPI" ? "active" : ""
              }`}
              onClick={() => setMethod("UPI")}
            >
              <div className="method-icon">
                <Smartphone size={25} />
              </div>

              <div>
                <strong>UPI</strong>
                <span>Google Pay, PhonePe, Paytm</span>
              </div>

              {method === "UPI" && (
                <CheckCircle2 className="selected-icon" size={21} />
              )}
            </button>

            <button
              className={`payment-method ${
                method === "Card" ? "active" : ""
              }`}
              onClick={() => setMethod("Card")}
            >
              <div className="method-icon">
                <CreditCard size={25} />
              </div>

              <div>
                <strong>Card</strong>
                <span>Credit or Debit Card</span>
              </div>

              {method === "Card" && (
                <CheckCircle2 className="selected-icon" size={21} />
              )}
            </button>

            <button
              className={`payment-method ${
                method === "Net Banking" ? "active" : ""
              }`}
              onClick={() => setMethod("Net Banking")}
            >
              <div className="method-icon">
                <Landmark size={25} />
              </div>

              <div>
                <strong>Net Banking</strong>
                <span>All major banks</span>
              </div>

              {method === "Net Banking" && (
                <CheckCircle2 className="selected-icon" size={21} />
              )}
            </button>
          </div>
        </section>

        <div className="demo-notice">
          <WalletCards size={21} />

          <div>
            <strong>Demo Payment</strong>
            <p>
              This is a demonstration payment. No actual
              money will be transferred.
            </p>
          </div>
        </div>

        {error && (
          <div className="payment-error">
            {error}
          </div>
        )}

        <button
          className="pay-now-button"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="spin" size={21} />
              Processing...
            </>
          ) : (
            <>
              Pay ₹{amount.toLocaleString("en-IN")}
            </>
          )}
        </button>
      </div>
    </main>
  );
}