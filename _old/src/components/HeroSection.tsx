'use client'

import { useEffect, useState } from 'react'

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(true)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated tree structure in background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute w-full h-full opacity-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="30" fill="url(#heroGlow)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-32 text-center">
        {/* Tagline */}
        <div
          className={`mb-8 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
        </div>

        {/* Main Headline */}
        <h1
          className={`font-display text-responsive-hero leading-[0.9] tracking-tight mb-8 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="block text-fangorn-ivory">{'{ proof > permission }'}</span>
        </h1>

        {/* Subheadline */}
        <p
          className={`max-w-2xl mx-auto text-fangorn-silver text-responsive-body leading-relaxed mb-12 transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Fangorn is the if-statement for Web3; a programmable logic layer for encrypted data. 
          No middleman imposing policies, no server storing a password, and nobody who can usurp your own agency.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 transition-all duration-1000 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <a
            href="#technology"
            className="px-8 py-4 bg-white text-fangorn-black font-body text-sm tracking-wide hover:bg-fangorn-ivory transition-all duration-300"
          >
            Explore Technology
          </a>
          <a
            href="#contact"
            className="px-8 py-4 border border-fangorn-slate text-fangorn-mist font-body text-sm tracking-wide hover:border-white hover:text-white transition-all duration-300"
          >
            Contact Us
          </a>
        </div>

        {/* Key Features */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto transition-all duration-1000 delay-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {[
            {
              title: 'Programmable Secrets',
              description: 'Encrypt data using logical conditions, not secret keys.',
            },
            {
              title: 'Zero-Knowledge',
              description: 'Privacy preserved through cryptographic proofs',
            },
            {
              title: 'Trustless',
              description: 'No intermediaries, no central points of failure',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 border-t border-fangorn-graphite"
            >
              <h3 className="font-mono text-xs tracking-widest text-fangorn-mist mb-3 uppercase">
                {feature.title}
              </h3>
              <p className="text-fangorn-ash text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
        <span className="text-fangorn-ash text-xs font-mono tracking-wider">SCROLL</span>
        <div className="w-px h-8 bg-gradient-to-b from-fangorn-ash to-transparent" />
      </div>
    </section>
  )
}
