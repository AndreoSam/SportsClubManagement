"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import "./navbar.css";

export default function Navbar({ showBackButton = false, title = "Sports Club Management" }) {
  const router = useRouter();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-left">
            {showBackButton && (
              <button
                className="back-button"
                onClick={() => router.back()}
                title="Go back"
              >
                ← Back
              </button>
            )}
            <Link href="/" className="navbar-logo">
              <span className="logo-icon">🏃‍♂️</span>
              <span className="logo-text">{title}</span>
            </Link>
          </div>

          <div className="navbar-right">
            <Link href="/login" className="navbar-link login-link">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
