'use client'

import { useEffect, useRef, useState } from 'react'

const technologies = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <path
          d="M24 4L4 14v20l20 10 20-10V14L24 4z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M4 14l20 10 20-10M24 44V24" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: 'Conditional Encryption',
    description:
      'Encrypt data with programmable unlock conditions. Whether it\'s a specific block height, oracle data, or multi-party consensus—your data stays sealed until the moment is right.',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M24 8v32M8 24h32M12 12l24 24M36 12L12 36"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: 'Zero-Knowledge Proofs',
    description:
      'Prove that conditions are met without revealing sensitive data. Our ZK infrastructure enables trustless verification while maintaining complete privacy.',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <rect x="8" y="8" width="32" height="32" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8 16h32M8 24h32M8 32h32M16 8v32M24 8v32M32 8v32"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
        />
        <path d="M16 16l8 8-8 8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: 'On-Chain Integration',
    description:
      'Native support for Ethereum, Solana, and other major chains. Smart contract conditions seamlessly integrate with our encryption layer.',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <path d="M24 4v40" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 12l12 12 12-12M8 24l16 16 16-16"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <circle cx="24" cy="4" r="2" fill="currentColor" />
        <circle cx="24" cy="44" r="2" fill="currentColor" />
      </svg>
    ),
    title: 'Off-Chain Oracles',
    description:
      'Connect real-world data to your encryption conditions. Time-based releases, external API triggers, and custom oracle networks supported.',
  },
]

export default function TechnologySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="technology"
      className="relative py-32 overflow-hidden"
    >
      {/* Section divider */}
      <div className="section-divider mb-32" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <span
            className={`inline-block font-mono text-xs tracking-widest text-fangorn-ash mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            01 / TECHNOLOGY
          </span>
          <h2
            className={`font-display text-responsive-section leading-tight text-fangorn-ivory mb-6 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Where cryptography meets{' '}
            <span className="italic text-fangorn-silver">intention</span>
          </h2>
          <p
            className={`text-fangorn-silver leading-relaxed transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Like the ancient Ents of Fangorn Forest, our technology is patient, 
            deliberate, and deeply rooted. Data remains protected in the roots of 
            our network, emerging only when the right conditions bloom.
          </p>
        </div>

        {/* Technology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-fangorn-graphite">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className={`bg-fangorn-black p-8 lg:p-12 card-hover transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <div className="text-fangorn-mist mb-6">{tech.icon}</div>
              <h3 className="font-display text-xl lg:text-2xl text-fangorn-ivory mb-4">
                {tech.title}
              </h3>
              <p className="text-fangorn-ash leading-relaxed text-sm lg:text-base">
                {tech.description}
              </p>
            </div>
          ))}
        </div>

        {/* How It Works Diagram */}
        <div
          className={`mt-24 p-8 lg:p-12 border border-fangorn-graphite transition-all duration-700 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h3 className="font-mono text-xs tracking-widest text-fangorn-ash mb-8">
            HOW IT WORKS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {[
              { step: '01', label: 'Define Conditions', desc: 'Set unlock parameters' },
              { step: '→', label: '', desc: '' },
              { step: '02', label: 'Encrypt Data', desc: 'Seal with intent-bound key' },
              { step: '→', label: '', desc: '' },
              { step: '03', label: 'Verify & Unlock', desc: 'ZK proof triggers release' },
            ].map((item, index) =>
              item.label ? (
                <div key={index} className="text-center">
                  <div className="font-mono text-fangorn-mist text-2xl mb-2">
                    {item.step}
                  </div>
                  <div className="font-display text-fangorn-ivory text-lg mb-1">
                    {item.label}
                  </div>
                  <div className="text-fangorn-ash text-xs">{item.desc}</div>
                </div>
              ) : (
                <div key={index} className="hidden md:flex justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-6 h-6 text-fangorn-slate"
                  >
                    <path
                      d="M5 12h14M14 7l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
