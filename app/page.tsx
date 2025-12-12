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
      <div className="grid-bg" />
      
      <nav className="nav">
        <div className="nav-logo">
          <span className="logo-mark">◌</span>
          <span className="logo-text">Fangorn</span>
        </div>
        <div className="nav-links">
          <a href="https://github.com/fangorn-network" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://x.com/Fangorn_network" target="_blank" rel="noopener noreferrer">
            X
          </a>
          <a href="https://discord.gg/P8xtDRWZ" target="_blank" rel="noopener noreferrer">
            Discord
          </a>
          <Link href="/dashboard" className="nav-cta">
            Launch
          </Link>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <div className="status">
            <span className="status-dot" />
            <span className="status-text">In development</span>
          </div>

          <h1 className="headline">
            Programmable
            <br />
            <span className="headline-accent">secrets</span>
          </h1>

          <p className="description">
            Encrypt data with conditions attached. 
            Decrypt only when the conditions are met without revealing anything.
          </p>

          <p className="subdescription">
            A composable ZK-predicate layer for Lit Protocol.
          </p>

          <div className="flow">
            <div className="flow-step">
              <span className="flow-label">Set conditions</span>
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-step">
              <span className="flow-label">Encrypt</span>
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-step">
              <span className="flow-label">Prove</span>
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-step">
              <span className="flow-label">Unlock</span>
            </div>
          </div>

          {!submitted ? (
            <form className="signup" onSubmit={handleSubmit}>
              <input
                type="email"
                className="signup-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <button type="submit" className="signup-button" disabled={loading}>
                {loading ? '...' : 'Get updates'}
              </button>
            </form>
          ) : (
            <div className="success">
              <span className="success-check">✓</span>
              <span>Added.</span>
            </div>
          )}

          {error && <p className="error">{error}</p>}
        </div>

        <aside className="aside">
          <div className="aside-label">Use cases</div>
          <ul className="aside-list">
            <li>
              <span className="aside-bullet">→</span>
              Credential-gated content
            </li>
            <li>
              <span className="aside-bullet">→</span>
              Sealed-bid auctions
            </li>
            <li>
              <span className="aside-bullet">→</span>
              Front-running protection
            </li>
            <li>
              <span className="aside-bullet">→</span>
              Time-released data
            </li>
          </ul>
          
          <div className="aside-divider" />

          {/* <div className="aside-label">Stack</div>
          <ul className="aside-list">
            <li>
              <span className="aside-bullet">◈</span>
              Lit Protocol
            </li>
            <li>
              <span className="aside-bullet">◇</span>
              PLONK / Noir
            </li>
            <li>
              <span className="aside-bullet">◇</span>
              On-chain verification
            </li>
          </ul> */}
        </aside>
      </main>

      <footer className="footer">
        <div className="footer-left">
          <span className="footer-logo">Fangorn</span>
          <span className="footer-divider">/</span>
          <span className="footer-tagline">Intent-bound encryption</span>
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
      </footer>
    </div>
  );
}