'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {FangornLogo} from '../../public/svg/fangorn-logo'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#technology', label: 'Technology' },
    { href: '#team', label: 'Team' },
    { href: '#roadmap', label: 'Roadmap' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-fangorn-black/90 backdrop-blur-md border-b border-fangorn-graphite/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <FangornLogo/>
            </div>
            <span className="font-display text-2xl tracking-wide text-fangorn-ivory group-hover:text-white transition-colors duration-300">
              Fangorn
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-body text-sm text-fangorn-silver hover:text-white transition-colors duration-300 link-underline"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="font-body text-sm px-6 py-2.5 border border-fangorn-silver text-fangorn-silver hover:bg-white hover:text-fangorn-black hover:border-white transition-all duration-300"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-fangorn-mist transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`w-full h-0.5 bg-fangorn-mist transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-full h-0.5 bg-fangorn-mist transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-fangorn-black/95 backdrop-blur-md border-b border-fangorn-graphite/50 transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-6 py-8 flex flex-col gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-lg text-fangorn-silver hover:text-white transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="font-body text-lg px-6 py-3 border border-fangorn-silver text-fangorn-silver hover:bg-white hover:text-fangorn-black hover:border-white transition-all duration-300 text-center mt-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  )
}
