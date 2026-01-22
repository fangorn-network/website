'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { label: 'Technology', href: '#technology' },
      // { label: 'Documentation (Coming Soon)', href: '#' },
      // { label: 'SDK (Coming Soon)', href: '#' },
      // { label: 'API Reference', href: '#' },
    ],
    company: [
      { label: 'Team', href: '#team' },
      { label: 'Roadmap', href: '#roadmap' },
      { label: 'Blog', href: 'https://paragraph.com/0x9069d1daaae05d9d70bb1f782f01786397326801' },
    ],
    resources: [
      // { label: 'Whitepaper (coming soon)', href: '#' },
      { label: 'GitHub', href: 'https://github.com/fangorn-network' },
      { label: 'Discord', href: 'https://discord.gg/JDj8RdCVyU' },
    ],
  }

  return (
    <footer className="relative py-16 border-t border-fangorn-graphite">
      {/* Tree pattern background */}
      <div className="absolute inset-0 tree-pattern opacity-30" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="/" className="flex items-center gap-3 group mb-6">
              <div className="relative w-8 h-8">
                <svg
                  viewBox="0 0 40 40"
                  className="w-full h-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 38V20M20 20L8 28M20 20L32 28M20 20V8M20 8L12 14M20 8L28 14M20 8V2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="text-fangorn-mist group-hover:text-white transition-colors duration-300"
                  />
                  <circle
                    cx="20"
                    cy="2"
                    r="2"
                    className="fill-fangorn-mist group-hover:fill-white transition-colors duration-300"
                  />
                </svg>
              </div>
              <span className="font-display text-xl tracking-wide text-fangorn-ivory group-hover:text-white transition-colors duration-300">
                Fangorn
              </span>
            </a>
            <p className="text-fangorn-ash text-sm leading-relaxed mb-6 max-w-xs">
              Intent-bound data encryption for the decentralized future. 
              Privacy-preserving. Trustless. Inevitable.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: 'github', url: 'https://github.com/fangorn-network' },
                { icon: 'twitter', url: 'https://twitter.com/Fangorn_network' },
                { icon: 'discord', url: 'https://discord.gg/JDj8RdCVyU' },
              ].map((social) => (
                <a
                  key={social.icon}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-fangorn-graphite flex items-center justify-center text-fangorn-ash hover:text-white hover:border-fangorn-slate transition-all duration-300"
                  aria-label={social.icon}
                >
                  {social.icon === 'github' && (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  )}
                  {social.icon === 'twitter' && (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  )}
                  {social.icon === 'discord' && (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-mono text-xs tracking-widest text-fangorn-mist mb-4 uppercase">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-fangorn-ash text-sm hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-mono text-xs tracking-widest text-fangorn-mist mb-4 uppercase">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target='#'
                    className="text-fangorn-ash text-sm hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-mono text-xs tracking-widest text-fangorn-mist mb-4 uppercase">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target='_blank'
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-fangorn-ash text-sm hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-fangorn-graphite flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-fangorn-ash text-xs">
            © {currentYear} Fangorn. All rights reserved.
          </p>
          <p className="text-fangorn-slate text-xs font-mono">
            Built with intention. Rooted in privacy.
          </p>
        </div>
      </div>
    </footer>
  )
}
