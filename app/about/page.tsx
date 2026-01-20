'use client';

import React from 'react';
import Link from 'next/link';
import './about.css';

export default function AboutPage() {
  return (
    <div className="page">
      <nav className="nav">
        <div className="nav-logo">
          <span className="logo-text">Fangorn</span>
        </div>
        <div className="nav-links">
          <Link href="/">Home</Link>
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
        <section className="about-header">
          <h1>About Fangorn</h1>
          <p className="about-intro">
            Our journey began with a simple question: How can we give people true control 
            over their data while maintaining privacy? Traditional access control systems 
            force a choice between security and transparency. We believe there's a better way.
          </p>
        </section>

        <section className="origin-box">
          <h2>How We Started</h2>
          <p>Fangorn was founded by Tony Riemer and Coleman Irby, longtime collaborators with over 
            ten years of shared history. The two met through a mutual friend while working at Fannie 
            Mae and quickly developed a strong working relationship built on shared interests in 
            technology, systems design, and problem-solving. Over the years, they maintained close contact, 
            building trust through both professional collaboration and personal experience.
          </p>
          <p>
            Their first major venture together began at Ideal Labs, where they built infrastructure 
            for a next-generation blockchain network. Over roughly one year, the team designed and 
            delivered a production-grade system, raising $300k through a highly competitive, community-driven 
            funding process and shipping a fully functional network comparable in complexity to modern 
            blockchain scaling solutions. The project was delivered on time and beyond its original technical scope.
          </p>
          <p>
            Despite strong execution, the founders recognized that the broader ecosystem they were operating in 
            showed limited long-term adoption and growth potential. Rather than continuing to invest resources into 
            a shrinking market, they made the disciplined decision to shut down the project—demonstrating a willingness 
            to prioritize market reality over sunk cost.
          </p>
          <p>
            Shortly thereafter, Tony and Coleman began exploring a new approach to secure data infrastructure. In the 
            final two weeks of a six-week hackathon, they built a prototype that won first place across all categories, 
            validating both the technical direction and the founders’ ability to move quickly from idea to execution. This 
            project became the foundation for Fangorn.
          </p>
          <p>
            Following the win, the founders chose to build on Ethereum, harnessing its liquidity, developer ecosystem, 
            and real-world adoption as critical factors for long-term success. Fangorn focuses on building pragmatic 
            cryptographic infrastructure that enables secure, programmable data usage, with immediate applicability across 
            decentralized applications.
          </p>
          <p>
            Tony and Coleman combine deep technical capability with strong product judgment. They have repeatedly 
            demonstrated the ability to ship complex systems, evaluate markets honestly, and adapt strategy when 
            conditions change. Their long-standing partnership, execution track record, and disciplined decision-making 
            position Fangorn to build durable infrastructure with meaningful real-world impact.
          </p>
        </section>

        <section className="team-section">
          <h2>Our Team</h2>
          
          <div className="founder-grid">
            {/* Founder 1 */}
            <div className="founder-card">
              <div className="founder-image-placeholder">
                <span>Photo</span>
              </div>
              <div className="founder-info">
                <h3>Founder Name</h3>
                <p className="founder-title">Co-Founder & CEO</p>
                <p className="founder-bio">
                  [Add your personal story here - what drives you, your background, why you're 
                  passionate about privacy and decentralization, and what you bring to Fangorn. 
                  This is your space to share your journey and vision.]
                </p>
              </div>
            </div>

            {/* Founder 2 */}
            <div className="founder-card">
              <div className="founder-image-placeholder">
                <span>Photo</span>
              </div>
              <div className="founder-info">
                <h3>Founder Name</h3>
                <p className="founder-title">Co-Founder & CTO</p>
                <p className="founder-bio">
                  [Share your technical background, what problems you've solved, what excites 
                  you about the technology you're building, and your vision for Fangorn's 
                  technical future. Let people know who you are beyond the code.]
                </p>
              </div>
            </div>

            {/* Team Member 1 */}
            <div className="founder-card">
              <div className="founder-image-placeholder">
                <span>Photo</span>
              </div>
              <div className="founder-info">
                <h3>Team Member Name</h3>
                <p className="founder-title">Role/Title</p>
                <p className="founder-bio">
                  [Tell your story - your expertise, what you're working on at Fangorn, 
                  and why this mission matters to you. Share what makes you unique and 
                  what you're excited to build.]
                </p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="founder-card">
              <div className="founder-image-placeholder">
                <span>Photo</span>
              </div>
              <div className="founder-info">
                <h3>Team Member Name</h3>
                <p className="founder-title">Role/Title</p>
                <p className="founder-bio">
                  [Share your background, what drives you in this space, and what you're 
                  contributing to the team. This is your opportunity to connect with people 
                  who share your vision.]
                </p>
              </div>
            </div>

            {/* Add more team members as needed */}
          </div>
        </section>

        <section className="values-box">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <h3>Privacy First</h3>
              <p>We believe privacy is a fundamental right, not a feature.</p>
            </div>
            <div className="value-item">
              <h3>No Gatekeepers</h3>
              <p>True decentralization means removing intermediaries and giving control to users.</p>
            </div>
            <div className="value-item">
              <h3>Open Source</h3>
              <p>Transparency builds trust. Our code is open for anyone to verify and improve.</p>
            </div>
            <div className="value-item">
              <h3>Developer Empowerment</h3>
              <p>We build tools that make complex cryptography accessible to all developers.</p>
            </div>
          </div>
        </section>

        <section className="join-box">
          <h2>Join Us</h2>
          <p>
            We're always looking for talented people who share our vision for a more private, 
            user-controlled internet. If you're passionate about zero-knowledge proofs, 
            decentralization, or privacy-preserving technologies, we'd love to hear from you.
          </p>
          <div className="join-links">
            <a href="https://discord.gg/P8xtDRWZ" target="_blank" rel="noopener noreferrer" className="join-link">
              Join our Discord
            </a>
            <a href="https://github.com/fangorn-network" target="_blank" rel="noopener noreferrer" className="join-link">
              Contribute on GitHub
            </a>
          </div>
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