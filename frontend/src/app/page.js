"use client";

import Link from "next/link";
import "./landing.css";

export default function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-wrapper">
        <div className="landing-header">
          <div className="header-logo">🏃‍♂️</div>
          <h1 className="header-title">Sports Club Management</h1>
          <p className="header-subtitle">Register as an Athlete or Coach</p>
        </div>

        <div className="cards-section">
          <Link href="/register/athlete" className="role-card athlete-card">
            <div className="card-icon">🏃</div>
            <h2 className="card-title">Register as Athlete</h2>
            <p className="card-description">
              Join our sports club and showcase your athletic skills
            </p>
            <div className="card-arrow">→</div>
          </Link>

          <Link href="/register/coach" className="role-card coach-card">
            <div className="card-icon">👨‍🏫</div>
            <h2 className="card-title">Register as Coach</h2>
            <p className="card-description">
              Share your expertise and guide the next generation
            </p>
            <div className="card-arrow">→</div>
          </Link>
        </div>

        <div className="login-section">
          <p className="login-text">Already Registered?</p>
          <Link href="/login" className="login-link">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
