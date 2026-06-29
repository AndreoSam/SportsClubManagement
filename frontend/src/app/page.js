"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import "./landing.css";

export default function LandingPage() {
  return (
    <>
      <Navbar showBackButton={false} title="Sports Club Management" />
      <div className="landing-container">
        <div className="landing-content">
          <div className="landing-hero">
            <h1 className="hero-title">Welcome to Sports Club Management</h1>
            <p className="hero-subtitle">
              Register today and join our thriving sports community
            </p>
          </div>

          <div className="cards-grid">
            <Link href="/register/athlete" className="card athlete-card">
              <div className="card-header">
                <span className="card-icon">🏃</span>
                <h2 className="card-title">Athlete</h2>
              </div>
              <p className="card-text">
                Register as an athlete and start your journey with us
              </p>
              <div className="card-footer">
                <span className="card-action">Get Started →</span>
              </div>
            </Link>

            <Link href="/register/coach" className="card coach-card">
              <div className="card-header">
                <span className="card-icon">👨‍🏫</span>
                <h2 className="card-title">Coach</h2>
              </div>
              <p className="card-text">
                Share your expertise and mentor the next generation
              </p>
              <div className="card-footer">
                <span className="card-action">Get Started →</span>
              </div>
            </Link>
          </div>

          <div className="login-prompt">
            <p className="prompt-text">Already have an account?</p>
            <Link href="/login" className="login-button">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
