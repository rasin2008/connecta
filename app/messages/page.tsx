"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  MessageCircle,
  User,
  Check,
  CheckCheck,
} from "lucide-react";

import "./messages.css";

type UserData = {
  id?: string;
  _id?: string;
  userId?: string;
  name?: string;
  email?: string;
};

type Conversation = {
  conversationId: string;
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
};

type Message = {
  _id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function MessagesPage() {
  const [user, setUser] = useState<UserData | null>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [selectedUser, setSelectedUser] =
    useState<Conversation | null>(null);

  const [messageText, setMessageText] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("connectaUser");

    if (!storedUser) {
      window.location.href = "/";
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch {
      localStorage.removeItem("connectaUser");
      window.location.href = "/";
    }
  }, []);

  const getUserId = () => {
    if (!user) return "";

    return String(
      user.id ||
        user._id ||
        user.userId ||
        user.email ||
        ""
    );
  };

  const loadConversations = async () => {
    const userId = getUserId();

    if (!userId) return;

    try {
      setLoading(true);

      const response = await fetch(
        `/api/messages/conversations?userId=${encodeURIComponent(
          userId
        )}`
      );

      const data = await response.json();

      if (data.success) {
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const openConversation = async (
    conversation: Conversation
  ) => {
    const userId = getUserId();

    if (!userId) return;

    setSelectedUser(conversation);

    try {
      const response = await fetch(
        `/api/messages/conversation?userId=${encodeURIComponent(
          userId
        )}&otherUserId=${encodeURIComponent(
          conversation.userId
        )}`
      );

      const data = await response.json();

      if (data.success) {
        setMessages(data.messages || []);
      }

      await fetch("/api/messages/read", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          otherUserId: conversation.userId,
        }),
      });

      setConversations((prev) =>
        prev.map((item) =>
          item.conversationId ===
          conversation.conversationId
            ? {
                ...item,
                unreadCount: 0,
              }
            : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async () => {
    const cleanMessage = messageText.trim();

    if (!cleanMessage || !selectedUser || sending) {
      return;
    }

    const senderId = getUserId();

    if (!senderId) return;

    setSending(true);

    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId,
          senderName: user?.name || "User",

          receiverId: selectedUser.userId,
          receiverName: selectedUser.userName,

          message: cleanMessage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          data.message,
        ]);

        setMessageText("");

        await loadConversations();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="messages-page">
      <div className="messages-background" />

      <header className="messages-header">
        <div className="messages-header-left">
          <Link href="/" className="back-button">
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1>
              <MessageCircle size={26} />
              Messages
            </h1>

            <p>
              Connect with students and businesses
            </p>
          </div>
        </div>

        <Link
          href="/home-student"
          className="messages-home-button"
        >
          Home
        </Link>
      </header>

      <section className="messages-container">
        {/* Conversations */}
        <aside className="conversation-panel">
          <div className="conversation-title">
            <h2>Conversations</h2>
            <span>{conversations.length}</span>
          </div>

          {loading ? (
            <div className="messages-loading">
              Loading...
            </div>
          ) : conversations.length === 0 ? (
            <div className="empty-conversations">
              <MessageCircle size={42} />

              <h3>No messages yet</h3>

              <p>
                Your conversations will appear here.
              </p>

              <Link href="/find-jobs">
                Find Jobs
              </Link>
            </div>
          ) : (
            <div className="conversation-list">
              {conversations.map((conversation) => (
                <button
                  key={conversation.conversationId}
                  className={`conversation-item ${
                    selectedUser?.conversationId ===
                    conversation.conversationId
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    openConversation(conversation)
                  }
                >
                  <div className="conversation-avatar">
                    <User size={20} />
                  </div>

                  <div className="conversation-info">
                    <div className="conversation-name-row">
                      <h3>
                        {conversation.userName}
                      </h3>

                      {conversation.unreadCount > 0 && (
                        <span className="unread-badge">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>

                    <p>
                      {conversation.lastMessage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </aside>

        {/* Chat */}
        <section className="chat-panel">
          {!selectedUser ? (
            <div className="chat-empty">
              <div className="chat-empty-icon">
                <MessageCircle size={46} />
              </div>

              <h2>Select a conversation</h2>

              <p>
                Choose a conversation from the left
                to start messaging.
              </p>
            </div>
          ) : (
            <>
              <div className="chat-header">
                <div className="chat-user-avatar">
                  <User size={22} />
                </div>

                <div>
                  <h2>
                    {selectedUser.userName}
                  </h2>

                  <p>CONNECTA member</p>
                </div>
              </div>

              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div className="no-messages">
                    <MessageCircle size={35} />

                    <p>
                      Start the conversation
                    </p>
                  </div>
                ) : (
                  messages.map((item) => {
                    const isMine =
                      item.senderId === getUserId();

                    return (
                      <div
                        key={item._id}
                        className={`message-row ${
                          isMine ? "mine" : "theirs"
                        }`}
                      >
                        <div className="message-bubble">
                          <p>{item.message}</p>

                          <div className="message-meta">
                            <span>
                              {formatTime(
                                item.createdAt
                              )}
                            </span>

                            {isMine &&
                              (item.read ? (
                                <CheckCheck
                                  size={14}
                                />
                              ) : (
                                <Check size={14} />
                              ))}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="message-input-area">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) =>
                    setMessageText(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                />

                <button
                  onClick={sendMessage}
                  disabled={
                    !messageText.trim() || sending
                  }
                >
                  <Send size={19} />

                  {sending ? "Sending" : "Send"}
                </button>
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  );
}