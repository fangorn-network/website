'use client'

import { useEffect, useRef, useState } from 'react'

const roadmapItems = [
  {
    phase: 'Phase 1',
    title: 'Foundation',
    status: 'completed',
    timeline: 'Q1 2024',
    items: [
      'Core encryption protocol design',
      'ZK circuit architecture',
      'Initial team formation',
      'Seed funding secured',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Development',
    status: 'in-progress',
    timeline: 'Q2-Q3 2024',
    items: [
      'Testnet deployment',
      'SDK alpha release',
      'Security audit (Round 1)',
      'Developer documentation',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Expansion',
    status: 'upcoming',
    timeline: 'Q4 2024',
    items: [
      'Mainnet beta launch',
      'Multi-chain support',
      'Oracle network integration',
      'Community governance proposal',
      'Test extra item'
    ],
  },
  {
    phase: 'Phase 4',
    title: 'Maturity',
    status: 'upcoming',
    timeline: 'Q1-Q2 2025',
    items: [
      'Full mainnet launch',
      'Enterprise partnerships',
      'DAO transition',
      'Ecosystem grants program',
    ],
  },
]

export default function RoadmapSection() {
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

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-white text-fangorn-black'
      case 'in-progress':
        return 'bg-fangorn-charcoal text-fangorn-ivory border border-white'
      default:
        return 'bg-fangorn-charcoal text-fangorn-ash border border-fangorn-graphite'
    }
  }

  return (
    <section
      ref={sectionRef}
      id="roadmap"
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
            03 / ROADMAP
          </span>
          <h2
            className={`font-display text-responsive-section leading-tight text-fangorn-ivory mb-6 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Growing with <span className="italic text-fangorn-silver">intention</span>
          </h2>
          <p
            className={`text-fangorn-silver leading-relaxed transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Our journey from concept to full ecosystem. Each phase builds on the 
            last, creating a robust foundation for the future of intent-bound data.
          </p>
        </div>

        {/* Roadmap Timeline - Desktop */}
        <div className="hidden lg:block relative">
          {/* Timeline line */}
          <div className="absolute left-0 right-0 top-12 h-px bg-fangorn-graphite" />
          
          {/* Branch connection lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="branchLine" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3a3a3a" />
                <stop offset="100%" stopColor="#1a1a1a" />
              </linearGradient>
            </defs>
          </svg>

          <div className="grid grid-cols-4 gap-8">
            {roadmapItems.map((item, index) => (
              <div
                key={index}
                className={`relative transition-all duration-700 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${300 + index * 150}ms` }}
              >
                {/* Timeline node */}
                <div className="relative mb-8">
                  <div
                    className={`w-6 h-6 rounded-full ${getStatusStyles(item.status)} flex items-center justify-center`}
                  >
                    {item.status === 'completed' && (
                      <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    )}
                    {item.status === 'in-progress' && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </div>
                  <div className="absolute top-8 left-3 w-px h-8 bg-gradient-to-b from-fangorn-graphite to-transparent" />
                </div>

                {/* Content */}
                <div className="pt-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-[10px] tracking-widest text-fangorn-ash uppercase">
                      {item.phase}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase ${
                        item.status === 'completed'
                          ? 'bg-white/10 text-white'
                          : item.status === 'in-progress'
                          ? 'bg-fangorn-charcoal text-fangorn-mist border border-fangorn-slate'
                          : 'text-fangorn-ash'
                      }`}
                    >
                      {item.timeline}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-fangorn-ivory mb-4">
                    {item.title}
                  </h3>
                  <ul className="space-y-2">
                    {item.items.map((listItem, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start gap-2 text-sm text-fangorn-ash"
                      >
                        <span className="mt-1.5 w-1 h-1 bg-fangorn-slate rounded-full flex-shrink-0" />
                        {listItem}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap Timeline - Mobile */}
        <div className="lg:hidden">
          <div className="relative pl-8 border-l border-fangorn-graphite">
            {roadmapItems.map((item, index) => (
              <div
                key={index}
                className={`relative pb-12 last:pb-0 transition-all duration-700 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${300 + index * 150}ms` }}
              >
                {/* Timeline node */}
                <div
                  className={`absolute -left-[17px] w-6 h-6 rounded-full ${getStatusStyles(
                    item.status
                  )} flex items-center justify-center`}
                >
                  {item.status === 'completed' && (
                    <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  )}
                  {item.status === 'in-progress' && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </div>

                {/* Content */}
                <div className="pl-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-[10px] tracking-widest text-fangorn-ash uppercase">
                      {item.phase}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase ${
                        item.status === 'completed'
                          ? 'bg-white/10 text-white'
                          : item.status === 'in-progress'
                          ? 'bg-fangorn-charcoal text-fangorn-mist border border-fangorn-slate'
                          : 'text-fangorn-ash'
                      }`}
                    >
                      {item.timeline}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-fangorn-ivory mb-3">
                    {item.title}
                  </h3>
                  <ul className="space-y-2">
                    {item.items.map((listItem, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start gap-2 text-sm text-fangorn-ash"
                      >
                        <span className="mt-1.5 w-1 h-1 bg-fangorn-slate rounded-full flex-shrink-0" />
                        {listItem}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className={`mt-20 p-8 lg:p-12 border border-fangorn-graphite text-center transition-all duration-700 delay-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h3 className="font-display text-2xl text-fangorn-ivory mb-4">
            Want to build with us?
          </h3>
          <p className="text-fangorn-silver mb-8 max-w-xl mx-auto">
            We're looking for partners, developers, and early adopters who share 
            our vision for a more private and intentional future.
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-4 bg-white text-fangorn-black font-body text-sm tracking-wide hover:bg-fangorn-ivory transition-all duration-300"
          >
            Join Early Access
          </a>
        </div>
      </div>
    </section>
  )
}
