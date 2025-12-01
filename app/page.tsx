'use client';

import { useState } from 'react';
import './page.css';

export default function Home() {
  const [email, setEmail] = useState('');

  return (
    <div className="container">
      <header>
        <div className="logo"><span>//</span> FANGORN</div>
      </header>

      <section className="hero">
        <h1>
          Programmable Access Control
          <span className="highlight"> for Decentralized Storage.</span>
        </h1>
        <p className="subtitle">
          Your files. Your rules. Set conditions for access. Cryptography enforces them.
        </p>

        <div className="signup-box">
          <p>Join the waitlist for early access →</p>
          <form className="signup-form">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Get Early Access</button>
          </form>
        </div>

        <a href="https://github.com/fangorn-network" className="link">View on GitHub →</a>
      </section>

      <section>
        <h2>The Primitive</h2>
        <div className="problem-box">
          <p><strong>Access control today is permission-based.</strong> You ask a server. The server decides.</p>
          <p><strong>Fangorn makes access control cryptographic.</strong> Encrypt under conditions. Proof grants access. No trust required.</p>
        </div>
      </section>

      <footer>
        <a href="https://github.com/fangorn-network">GitHub</a>
        <a href="https://idealabs.network">Ideal Labs</a>
        <p>Built by Ideal Labs · Apache 2.0</p>
      </footer>
    </div>
  );
}
