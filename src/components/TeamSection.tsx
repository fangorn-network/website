'use client'

import { useEffect, useRef, useState } from 'react'

const team = [
  {
    name: 'Tony Riemer',
    role: 'Co-Founder',
    bio: `
      Tony is an architect of secure systems with a career spanning enterprise fintech at Capital One and deep blockchain infrastructure at Ideal Labs. 
      Through multiple Web3 Foundation grants, he has demonstrated a mastery of advanced cryptography, ensuring Fangorn’s foundations are technically uncompromising. 
      He specializes in translating complex cryptographic theory into the production-ready code required to solve real-world architectural challenges.
      `,
    image: 'team/tony.jpg',
    links: {
      twitter: '#',
      linkedin: 'https://www.linkedin.com/in/tony-riemer/',
      github: 'https://github.com/driemworks',
    },
  },
  {
    name: 'Coleman Irby',
    role: 'Co-Founder',
    bio: 'Full stack engineer with a Masters degree in Physics. Building the future of the internet one block at a time.',
    image: 'team/coleman.jpg',
    links: {
      // twitter: '#',
      linkedin: 'https://www.linkedin.com/in/coleman-irby',
      github: 'https://github.com/colemanirby',
    },
  }
]

const values = [
  {
    title: 'Privacy First',
    description: 'We believe data privacy is a fundamental right. Every decision we make prioritizes user control and data sovereignty.',
  },
  {
    title: 'Transparent Innovation',
    description: 'Open-source by default. We build in public and share our research with the community.',
  },
  {
    title: 'Patient Progress',
    description: 'We take the long view. Quality and security over speed.',
  },
]

export default function TeamSection() {
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
      id="team"
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
            02 / TEAM
          </span>
          <h2
            className={`font-display text-responsive-section leading-tight text-fangorn-ivory mb-6 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Meet the <span className="italic text-fangorn-silver">team</span>
          </h2>
          <p
            className={`text-fangorn-silver leading-relaxed transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            We are a team of cryptography and mathematics enthusiasts united by 
            shared interests and a shared vision: a world where individuals have true control over 
            their data.
          </p>
        </div>

        {/* Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {team.map((member, index) => (
            <div
              key={index}
              className={`group transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              {/* Avatar placeholder */}
              <div className="relative aspect-[4/5] mb-6 overflow-hidden bg-fangorn-charcoal">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:grayscale"
                  />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-fangorn-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  {Object.entries(member.links).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      className="w-10 h-10 border border-fangorn-slate flex items-center justify-center text-fangorn-mist hover:text-white hover:border-white transition-colors duration-300"
                      aria-label={platform}
                    >
                      {platform === 'twitter' && (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      )}
                      {platform === 'linkedin' && (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      )}
                      {platform === 'github' && (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              </div>
              <h3 className="font-display text-xl text-fangorn-ivory mb-1">
                {member.name}
              </h3>
              <p className="font-mono text-xs tracking-wider text-fangorn-ash mb-4 uppercase">
                {member.role}
              </p>
              <p className="text-fangorn-silver text-sm leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>

        {/* Our Values */}
        <div
          className={`border-t border-fangorn-graphite pt-20 transition-all duration-700 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h3 className="font-mono text-xs tracking-widest text-fangorn-ash mb-12">
            OUR VALUES
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value, index) => (
              <div key={index}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-px bg-fangorn-slate" />
                  <h4 className="font-display text-lg text-fangorn-ivory">
                    {value.title}
                  </h4>
                </div>
                <p className="text-fangorn-ash text-sm leading-relaxed pl-12">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
