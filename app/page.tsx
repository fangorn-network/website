'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Waitlist signup error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <nav className="nav">
        <div className="nav-logo">
          <span className="logo-text">Fangorn</span>
        </div>
        <div className="nav-links">
          <Link href="/about">About Us</Link>
          <a href="https://github.com/fangorn-network" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://x.com/Fangorn_network" target="_blank" rel="noopener noreferrer">
            X
          </a>
          <a href="https://discord.gg/P8xtDRWZ" target="_blank" rel="noopener noreferrer">
            Discord
          </a>
        </div>
      </nav>

      <main className="main-content">
        <section className="hero-section">
          <div className="status-badge">In development</div>
          
          <h1 className="main-heading">
            Privacy-preserving access control for the decentralized web
          </h1>

          <p className="main-description">
            Fangorn is building ZK middleware for Lit Protocol, enabling witness encryption 
            without complexity. We're creating data infrastructure where access is programmable, 
            verification happens without surveillance, and there are no gatekeepers.
          </p>
        </section>

        <section className="product-box">
          <h2>Our Product</h2>
          <p>
            We provide composable ZK predicates that define access conditions while keeping 
            them confidential. Verify credentials without exposing identity. Build sophisticated 
            access controls from simple, reusable components.
          </p>
          
          <div className="features-grid">
            <div className="feature-item">
              <h3>Define</h3>
              <p>Create access conditions using composable ZK predicates</p>
            </div>
            <div className="feature-item">
              <h3>Encrypt</h3>
              <p>Secure your data with privacy-preserving encryption</p>
            </div>
            <div className="feature-item">
              <h3>Prove</h3>
              <p>Generate zero-knowledge proofs of access rights</p>
            </div>
            <div className="feature-item">
              <h3>Unlock</h3>
              <p>Access data without revealing sensitive information</p>
            </div>
          </div>
        </section>

        <section className="product-box">
          <h2>What This Enables</h2>
          <ul className="features-list">
            <li>Access conditions that stay confidential</li>
            <li>Verification without identity exposure</li>
            <li>Composable predicates from simple gadgets</li>
            <li>No TEE dependency for security</li>
          </ul>
        </section>

        <section className="product-box">
          <h2>For Builders</h2>
          <ul className="features-list">
            <li>SDK for defining ZK access conditions</li>
            <li>On-chain proof verification</li>
            <li>Drop-in Lit Protocol integration</li>
          </ul>
        </section>

        <section className="signup-section">
          <h2>Stay Updated</h2>
          <p>Get notified when we launch</p>
          
          {!submitted ? (
            <form className="signup-form" onSubmit={handleSubmit}>
              <input
                type="email"
                className="email-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Submitting...' : 'Get updates'}
              </button>
            </form>
          ) : (
            <div className="success-message">
              ✓ Successfully added to waitlist
            </div>
          )}

          {error && <p className="error-message">{error}</p>}
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <strong>Fangorn</strong> — Intent-bound data infrastructure
          </div>
          <div className="footer-right">
            <a href="https://github.com/fangorn-network" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://x.com/Fangorn_network" target="_blank" rel="noopener noreferrer">
              X
            </a>
            <a href="https://discord.gg/P8xtDRWZ" target="_blank" rel="noopener noreferrer">
              Discord
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}