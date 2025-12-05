'use client';

import React, { useState } from 'react';
import './page.css';

export default function Page() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_WAITLIST_URL || 'https://script.google.com/macros/s/AKfycbyk7RMReJQPxdWGQ8JqVi-ECQguE4teqxP7Wq2NUGp97Dd51SiRCMC1t-440DMQXbMC/exec';

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // With no-cors we can't read the response, but if it didn't throw, assume success
      setSubmitted(true);
    } catch (err) {
      console.error('Waitlist signup error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coming-soon">
      <div className="glow-top" />
      <div className="glow-bottom" />

      <nav className="cs-nav">
        <div className="cs-logo">Fangorn</div>
        <div className="cs-nav-links">
          <a href="https://github.com/fangorn-network" target="_blank" rel="noopener noreferrer" className="cs-nav-link">GitHub</a>
          <a href="https://x.com/Fangorn_network" target="_blank" rel="noopener noreferrer" className="cs-nav-link">X</a>
          <a href="https://discord.gg/P8xtDRWZ" target="_blank" rel="noopener noreferrer" className="cs-nav-link">Discord</a>
        </div>
      </nav>

      <main className="cs-main">
        <div className="cs-badge">Coming Soon</div>

        <h1 className="cs-title">
          Turn access into<br /><em>liquid assets</em>
        </h1>

        <p className="cs-subtitle">
          Tokenize access to your content with perpetual royalties.
          Threshold encryption meets tradeable access rights.
        </p>

        <div className="cs-features">
          <div className="cs-feature">
            {/* <span className="cs-feature-icon">🔐</span> */}
            <span className="cs-feature-text">Threshold Encryption</span>
          </div>
          <div className="cs-feature-divider" />
          <div className="cs-feature">
            {/* <span className="cs-feature-icon">🎫</span> */}
            <span className="cs-feature-text">Tradeable Access</span>
          </div>
          <div className="cs-feature-divider" />
          <div className="cs-feature">
            {/* <span className="cs-feature-icon">♻️</span> */}
            <span className="cs-feature-text">Perpetual Royalties</span>
          </div>
        </div>

        {!submitted ? (
          <form className="cs-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="cs-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <button type="submit" className="cs-button" disabled={loading}>
              {loading ? 'Joining...' : 'Join Waitlist'}
            </button>
          </form>
        ) : (
          <div className="cs-success">
            <span className="cs-success-icon">✓</span>
            <span>You&apos;re on the list. We&apos;ll be in touch.</span>
          </div>
        )}

        <p className="cs-note">
          Be the first to know when we launch.
        </p>

        {error && (
          <p className="cs-error">{error}</p>
        )}
      </main>

      <footer className="cs-footer">
        <div className="cs-footer-brand">
          <span className="cs-footer-logo">Fangorn</span>
        </div>
        <div className="cs-footer-links">
          <a href="https://github.com/fangorn-network" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://x.com/Fangorn_network" target="_blank" rel="noopener noreferrer">X</a>
          <a href="https://discord.gg/P8xtDRWZ" target="_blank" rel="noopener noreferrer">Discord</a>
        </div>
      </footer>
    </div>
  );
}
