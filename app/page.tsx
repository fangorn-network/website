'use client';

import { useState } from 'react';
import './page.css';

export default function Home() {
  const [email, setEmail] = useState('');

  return (
    <>
    <div className="grain"></div>
    <div className="container">
      <header>
        <div className="logo"><span>//</span> FANGORN</div>
      </header>

      <section className="hero">
        <h1>
          Publish once.
          <span className="highlight"> Set the terms forever.</span>
        </h1>
        <p className="subtitle">
          You decide who can access your data and under what conditions.
          Cryptography enforces it. No platform can change the deal.
        </p>

        <div className="signup-box">
          <p>Be the first to know when we launch →</p>
          <form className="signup-form">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Get Updates</button>
          </form>
        </div>

        <a href="https://github.com/fangorn-network" className="link">View on GitHub →</a>
      </section>

      <section>
        <h2>The Problem</h2>
        <div className="problem-box">
          <p>
            <strong>Platforms own the relationship between you and your audience.</strong> They
            control who sees your work, take their cut, and can change the rules whenever they want.
            Your content lives on their terms, not yours.
          </p>
          <p>
            <strong>Fangorn removes the middleman.</strong> Encrypt your data under conditions you
            define — age verification, token ownership, proof of humanity, anything. Anyone who
            proves they meet your conditions gets access. No platform in the loop. No permission
            required.
          </p>
          <p>
            Powered by threshold encryption. Built for a post-platform world.
          </p>
        </div>
      </section>

      <footer>
        <a href="https://github.com/fangorn-network">GitHub</a>
        <a href="https://idealabs.network">Ideal Labs</a>
        <p>Built by Ideal Labs · Apache 2.0</p>
      </footer>
    </div>
    </>
  );
}
