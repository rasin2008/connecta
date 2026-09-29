"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Briefcase,
  CreditCard,
  MessageCircle,
  AlertCircle,
  RefreshCw,
  Home,
  Wallet,
} from "lucide-react";

import "./notifications.css";

type NotificationType =
  | "application"
  | "payment"
  | "job"
  | "message"
  | "system";

type NotificationItem = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string | null;
  updatedAt?: string | null;
};

type UserData = {
  id?: string;
  _id?: string;
  userId?: string;
  email?: string;
  name?: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>([]);

  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = () => {
    try {
      const storedUser =
        localStorage.getItem("connectaUser");

      if (!storedUser) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      const user: UserData =
        JSON.parse(storedUser);

      const id =
        user.id ||
        user._id ||
        user.userId ||
        user.email ||
        "";

      if (!id) {
        setError("User ID not found.");
        setLoading(false);
        return;
      }

      setUserId(String(id));

      loadNotifications(String(id));
    } catch (error) {
      console.error(error);
      setError("Invalid user information.");
      setLoading(false);
    }
  };

  const loadNotifications = async (id: string) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/notifications/my?userId=${encodeURIComponent(
          id
        )}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "Notifications API did not return JSON."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load notifications."
        );
      }

      setNotifications(
        Array.isArray(data.notifications)
          ? data.notifications
          : []
      );

      setUnreadCount(
        Number(data.unreadCount || 0)
      );
    } catch (error) {
      console.error(
        "Notifications loading error:",
        error
      );

      setError(
        "Unable to load notifications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (
    notificationId: string
  ) => {
    try {
      const response = await fetch(
        "/api/notifications/read",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notificationId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === notificationId
            ? {
                ...item,
                read: true,
              }
            : item
        )
      );

      setUnreadCount((previous) =>
        Math.max(0, previous - 1)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    if (!userId || unreadCount === 0) {
      return;
    }

    try {
      const response = await fetch(
        "/api/notifications/read-all",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          read: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotification = async (
    notificationId: string
  ) => {
    try {
      const item = notifications.find(
        (notification) =>
          notification.id === notificationId
      );

      const response = await fetch(
        "/api/notifications/delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notificationId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setNotifications((previous) =>
        previous.filter(
          (notification) =>
            notification.id !== notificationId
        )
      );

      if (item && !item.read) {
        setUnreadCount((previous) =>
          Math.max(0, previous - 1)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clearAll = async () => {
    if (notifications.length === 0) {
      return;
    }

    try {
      await Promise.all(
        notifications.map((item) =>
          fetch("/api/notifications/delete", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              notificationId: item.id,
            }),
          })
        )
      );

      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error(error);
    }
  };

  const getIcon = (
    type: NotificationType
  ) => {
    switch (type) {
      case "application":
        return <Briefcase size={21} />;

      case "payment":
        return <CreditCard size={21} />;

      case "job":
        return <Briefcase size={21} />;

      case "message":
        return <MessageCircle size={21} />;

      default:
        return <AlertCircle size={21} />;
    }
  };

  const getTime = (
    date: string | null
  ) => {
    if (!date) {
      return "";
    }

    const created =
      new Date(date).getTime();

    const now = Date.now();

    const minutes = Math.floor(
      (now - created) / 60000
    );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours} ${
        hours === 1 ? "hour" : "hours"
      } ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    if (days === 1) {
      return "Yesterday";
    }

    if (days < 7) {
      return `${days} days ago`;
    }

    return new Date(
      date
    ).toLocaleDateString();
  };

  return (
    <main className="notifications-page">
      <div className="notifications-container">

        <header className="notifications-header">
          <div className="notifications-title">
            <div className="notifications-title-icon">
              <Bell size={27} />
            </div>

            <div>
              <h1>Notifications</h1>
              <p>
                Stay updated with your CONNECTA activity
              </p>
            </div>
          </div>

          <div className="notifications-actions">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="mark-all-btn"
              >
                <CheckCheck size={18} />
                Mark all as read
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="clear-all-btn"
              >
                <Trash2 size={18} />
                Clear all
              </button>
            )}
          </div>
        </header>

        <div className="notification-summary">
          <div className="summary-card">
            <Bell size={21} />

            <div>
              <span>Total</span>
              <strong>
                {notifications.length}
              </strong>
            </div>
          </div>

          <div className="summary-card">
            <AlertCircle size={21} />

            <div>
              <span>Unread</span>
              <strong>
                {unreadCount}
              </strong>
            </div>
          </div>
        </div>

        {loading && (
          <div className="notification-state">
            <RefreshCw
              size={34}
              className="loading-icon"
            />

            <h3>
              Loading notifications...
            </h3>

            <p>
              Please wait.
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="notification-state">
            <AlertCircle size={40} />

            <h3>{error}</h3>

            <button
              onClick={() => {
                if (userId) {
                  loadNotifications(userId);
                } else {
                  loadUser();
                }
              }}
              className="retry-btn"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          notifications.length === 0 && (
            <div className="notification-state">
              <div className="empty-bell">
                <Bell size={42} />
              </div>

              <h3>
                No notifications yet
              </h3>

              <p>
                Your job, application, payment and
                message updates will appear here.
              </p>

              <Link
                href="/find-jobs"
                className="find-jobs-btn"
              >
                Find Jobs
              </Link>
            </div>
          )}

        {!loading &&
          !error &&
          notifications.length > 0 && (
            <section className="notifications-list">
              {notifications.map((item) => (
                <article
                  key={item.id}
                  className={`notification-card ${
                    item.read
                      ? "notification-read"
                      : "notification-unread"
                  }`}
                >
                  <div className="notification-icon">
                    {getIcon(item.type)}
                  </div>

                  <div className="notification-content">
                    <div className="notification-top">
                      <div>
                        <h3>
                          {item.title}
                        </h3>

                        {!item.read && (
                          <span className="unread-dot" />
                        )}
                      </div>

                      <span className="notification-time">
                        {getTime(
                          item.createdAt
                        )}
                      </span>
                    </div>

                    <p>{item.message}</p>

                    <div className="notification-bottom">
                      {!item.read && (
                        <button
                          className="notification-read-btn"
                          onClick={() =>
                            markAsRead(item.id)
                          }
                        >
                          <Check size={16} />
                          Mark as read
                        </button>
                      )}

                      {item.link && (
                        <Link
                          href={item.link}
                          className="notification-view"
                          onClick={() => {
                            if (!item.read) {
                              markAsRead(item.id);
                            }
                          }}
                        >
                          View
                        </Link>
                      )}

                      <button
                        className="notification-delete-btn"
                        onClick={() =>
                          deleteNotification(
                            item.id
                          )
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}

        <footer className="notifications-footer">
          <Link href="/home-student">
            <Home size={17} />
            Home
          </Link>

          <Link href="/find-jobs">
            <Briefcase size={17} />
            Find Jobs
          </Link>

          <Link href="/wallet">
            <Wallet size={17} />
            Wallet
          </Link>

          <Link href="/messages">
            <MessageCircle size={17} />
            Messages
          </Link>
        </footer>
      </div>
    </main>
  );
}