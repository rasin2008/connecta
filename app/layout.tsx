import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CONNECTA",
  description: "Flexible jobs for students and local businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col`}
      >
        <div className="connecta-layout">
          {children}

          <footer className="connecta-footer">
            <div className="footer-container">

              <div className="footer-brand">
                <h2>CONNECTA</h2>
                <p>
                  Flexible jobs for students and local businesses.
                </p>
              </div>

              <div className="footer-links">
                <a href="/">Home</a>
                <a href="/find-jobs">Find Jobs</a>
                <a href="/my-applications">Applications</a>
                <a href="/messages">Messages</a>
              </div>

              <div className="footer-links">
                <a href="/profile">Profile</a>
                <a href="/wallet">Wallet</a>
                <a href="/notifications">Notifications</a>
                <a href="/help-support">Help & Support</a>
              </div>

            </div>

            <div className="footer-bottom">
              <span>© 2026 CONNECTA. All rights reserved.</span>
              <span>Built for Students & Businesses</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}