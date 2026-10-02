"use client";

import "./payment.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

  const [userId, setUserId] = useState("");
  const [jobId, setJobId] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);

  const [method, setMethod] =
    useState<PaymentMethod>("UPI");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      /* =========================
         GET LOGGED-IN USER
      ========================= */

      const savedUser =
        localStorage.getItem("connectaUser");

      if (!savedUser) {
        setError(
          "Please login before making a payment."
        );
        return;
      }

      const user = JSON.parse(savedUser);

      const id = user.id || user._id || "";

      if (!id) {
        setError(
          "User ID not found. Please login again."
        );
        return;
      }

      setUserId(String(id));

      /* =========================
         GET URL PARAMETERS
      ========================= */

      const params = new URLSearchParams(
        window.location.search
      );

      const urlJobId = params.get("jobId");
      const urlAmount = params.get("amount");

      const parsedJobId = Number(urlJobId || 0);
      const parsedAmount = Number(urlAmount || 0);

      setJobId(parsedJobId);
      setAmount(parsedAmount);

      if (!parsedJobId) {
        setError("Job ID is missing.");
      }

      if (!parsedAmount || parsedAmount <= 0) {
        setError("Invalid payment amount.");
      }
    } catch (error) {
      console.error(
        "PAYMENT PAGE LOAD ERROR:",
        error
      );

      setError(
        "Unable to load payment details."
      );
    }
  }, []);

  /* =========================
     PAYMENT
  ========================= */

  const handlePayment = async () => {
    setError("");

    if (!userId) {
      setError(
        "User not found. Please login again."
      );
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

      const response = await fetch(
        "/api/payment/create",
        {
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
        }
      );

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      if (
        !contentType.includes(
          "application/json"
        )
      ) {
        setError(
          `Payment API error. Status: ${response.status}`
        );
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Payment failed."
        );
        return;
      }

      setSuccess(true);
    } catch (error) {
      console.error(
        "PAYMENT ERROR:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SUCCESS SCREEN
  ========================= */

  if (success) {
    return (
      <main className="payment-page">
        <div className="payment-success-card">
          <div className="success-icon">
            <CheckCircle2 size={64} />
          </div>

          <h1>
            Payment Successful!
          </h1>

          <p>
            Your demo payment of ₹
            {amount.toLocaleString(
              "en-IN"
            )}{" "}
            has been completed successfully.
          </p>

          <div className="success-details">
            <div>
              <span>
                Payment Method
              </span>

              <strong>
                {method}
              </strong>
            </div>

            <div>
              <span>Job ID</span>

              <strong>
                #{jobId}
              </strong>
            </div>

            <div>
              <span>Status</span>

              <strong className="success-text">
                Success
              </strong>
            </div>
          </div>

          <button
            type="button"
            className="payment-primary-btn"
            onClick={() =>
              router.push(
                "/home-student"
              )
            }
          >
            Go to Home
          </button>

          <button
            type="button"
            className="payment-secondary-btn"
            onClick={() =>
              router.push(
                "/my-applications"
              )
            }
          >
            View Applications
          </button>

          <button
            type="button"
            className="payment-wallet-btn"
            onClick={() =>
              router.push("/wallet")
            }
          >
            <WalletCards size={18} />
            Open Wallet
          </button>
        </div>
      </main>
    );
  }

  /* =========================
     PAYMENT SCREEN
  ========================= */

  return (
    <main className="payment-page">
      <div className="payment-container">

        {/* BACK */}

        <button
          type="button"
          className="back-button"
          onClick={() =>
            router.back()
          }
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* HEADER */}

        <div className="payment-header">
          <div className="payment-logo">
            C
          </div>

          <div>
            <p className="payment-small-title">
              CONNECTA
            </p>

            <h1>
              Demo Payment
            </h1>
          </div>
        </div>

        {/* AMOUNT */}

        <div className="payment-amount-card">
          <span>
            Amount to Pay
          </span>

          <strong>
            ₹
            {amount.toLocaleString(
              "en-IN"
            )}
          </strong>

          <small>
            Demo payment — no real
            money will be charged
          </small>
        </div>

        {/* PAYMENT METHODS */}

        <section className="payment-section">
          <h2>
            Select Payment Method
          </h2>

          <div className="payment-methods">

            {/* UPI */}

            <button
              type="button"
              className={`payment-method ${
                method === "UPI"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setMethod("UPI")
              }
            >
              <div className="method-icon">
                <Smartphone
                  size={25}
                />
              </div>

              <div className="method-content">
                <strong>
                  UPI
                </strong>

                <span>
                  Google Pay,
                  PhonePe, Paytm
                </span>
              </div>

              {method === "UPI" && (
                <CheckCircle2
                  className="selected-icon"
                  size={21}
                />
              )}
            </button>

            {/* CARD */}

            <button
              type="button"
              className={`payment-method ${
                method === "Card"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setMethod("Card")
              }
            >
              <div className="method-icon">
                <CreditCard
                  size={25}
                />
              </div>

              <div className="method-content">
                <strong>
                  Card
                </strong>

                <span>
                  Credit or Debit Card
                </span>
              </div>

              {method === "Card" && (
                <CheckCircle2
                  className="selected-icon"
                  size={21}
                />
              )}
            </button>

            {/* NET BANKING */}

            <button
              type="button"
              className={`payment-method ${
                method ===
                "Net Banking"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setMethod(
                  "Net Banking"
                )
              }
            >
              <div className="method-icon">
                <Landmark size={25} />
              </div>

              <div className="method-content">
                <strong>
                  Net Banking
                </strong>

                <span>
                  All major banks
                </span>
              </div>

              {method ===
                "Net Banking" && (
                <CheckCircle2
                  className="selected-icon"
                  size={21}
                />
              )}
            </button>

          </div>
        </section>

        {/* DEMO NOTICE */}

        <div className="demo-notice">
          <WalletCards size={21} />

          <div>
            <strong>
              Demo Payment
            </strong>

            <p>
              This is a demonstration
              payment. No actual money
              will be transferred.
            </p>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="payment-error">
            {error}
          </div>
        )}

        {/* PAY */}

        <button
          type="button"
          className="pay-now-button"
          onClick={handlePayment}
          disabled={
            loading ||
            !jobId ||
            !amount
          }
        >
          {loading ? (
            <>
              <Loader2
                className="spin"
                size={21}
              />

              Processing...
            </>
          ) : (
            <>
              Pay ₹
              {amount.toLocaleString(
                "en-IN"
              )}
            </>
          )}
        </button>

      </div>
    </main>
  );
}