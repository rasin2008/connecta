"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  WalletCards,
  CreditCard,
  Smartphone,
  Landmark,
  RefreshCw,
} from "lucide-react";

import "./wallet.css";

type Payment = {
  _id: string;
  jobId: number;
  amount: number;
  method: string;
  status: "Pending" | "Success" | "Failed";
  createdAt: string;
};

export default function WalletPage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [balance, setBalance] = useState(0);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPayments = async (id: string) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/payment/my?userId=${encodeURIComponent(id)}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to load wallet.");
        return;
      }

      setBalance(Number(data.totalAmount || 0));
      setPayments(data.payments || []);
    } catch (error) {
      console.error("WALLET ERROR:", error);
      setError("Failed to load wallet.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("connectaUser");

    if (!savedUser) {
      router.replace("/");
      return;
    }

    try {
      const user = JSON.parse(savedUser);
      const id = user.id || user._id || "";

      if (!id) {
        router.replace("/");
        return;
      }

      setUserId(id);
      loadPayments(id);
    } catch (error) {
      console.error("USER LOAD ERROR:", error);
      router.replace("/");
    }
  }, [router]);

  const getMethodIcon = (method: string) => {
    if (method === "UPI") {
      return <Smartphone size={20} />;
    }

    if (method === "Card") {
      return <CreditCard size={20} />;
    }

    return <Landmark size={20} />;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="wallet-page">
      <div className="wallet-container">

        {/* Header */}
        <header className="wallet-header">
          <button
            className="wallet-back"
            onClick={() => router.back()}
          >
            <ArrowLeft size={21} />
          </button>

          <div>
            <p>CONNECTA</p>
            <h1>My Wallet</h1>
          </div>

          <button
            className="wallet-refresh"
            onClick={() => userId && loadPayments(userId)}
            disabled={loading}
          >
            <RefreshCw
              size={19}
              className={loading ? "wallet-spin" : ""}
            />
          </button>
        </header>

        {/* Balance */}
        <section className="wallet-balance-card">
          <div className="wallet-balance-top">
            <div className="wallet-icon">
              <WalletCards size={28} />
            </div>

            <span>Available Balance</span>
          </div>

          <h2>
            ₹{balance.toLocaleString("en-IN")}
          </h2>

          <div className="wallet-balance-bottom">
            <span>Demo Wallet</span>
            <span>CONNECTA</span>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="wallet-stats">
          <div className="wallet-stat-card">
            <CheckCircle2 size={20} />
            <div>
              <strong>
                {
                  payments.filter(
                    (payment) => payment.status === "Success"
                  ).length
                }
              </strong>
              <span>Successful</span>
            </div>
          </div>

          <div className="wallet-stat-card">
            <Clock3 size={20} />
            <div>
              <strong>
                {
                  payments.filter(
                    (payment) => payment.status === "Pending"
                  ).length
                }
              </strong>
              <span>Pending</span>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="wallet-error">
            {error}
          </div>
        )}

        {/* Payment History */}
        <section className="payment-history">
          <div className="section-heading">
            <div>
              <p>TRANSACTIONS</p>
              <h2>Payment History</h2>
            </div>

            <span>{payments.length} Payments</span>
          </div>

          {loading ? (
            <div className="wallet-loading">
              <RefreshCw
                size={25}
                className="wallet-spin"
              />
              <p>Loading payments...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="wallet-empty">
              <div className="empty-wallet-icon">
                <WalletCards size={30} />
              </div>

              <h3>No payments yet</h3>

              <p>
                Your successful demo payments will appear here.
              </p>

              <button
                onClick={() =>
                  router.push(
                    "/payment?jobId=1001&amount=800"
                  )
                }
              >
                Make Demo Payment
              </button>
            </div>
          ) : (
            <div className="payment-list">
              {payments.map((payment) => (
                <div
                  className="payment-item"
                  key={payment._id}
                >
                  <div className="payment-method-icon">
                    {getMethodIcon(payment.method)}
                  </div>

                  <div className="payment-info">
                    <strong>
                      Job #{payment.jobId}
                    </strong>

                    <span>
                      {payment.method} •{" "}
                      {formatDate(payment.createdAt)}
                    </span>
                  </div>

                  <div className="payment-right">
                    <strong>
                      + ₹
                      {payment.amount.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                    <span
                      className={
                        payment.status === "Success"
                          ? "payment-success"
                          : payment.status === "Pending"
                          ? "payment-pending"
                          : "payment-failed"
                      }
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Demo Notice */}
        <div className="wallet-demo-notice">
          <WalletCards size={20} />

          <div>
            <strong>Demo Wallet</strong>

            <p>
              This wallet is for CONNECTA demo purposes.
              No real money is transferred.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}