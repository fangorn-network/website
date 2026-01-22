# Fangorn - Intent-Bound Data for Web3

A visually stunning Next.js web application for Fangorn, a Web3 startup focused on intent-bound data encryption using zero-knowledge proofs.

![Fangorn](https://img.shields.io/badge/Web3-Intent%20Bound%20Data-black)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-black)

## 🌳 About

Fangorn enables intent-bound encryption—your data remains sealed until on-chain or off-chain conditions are met. Privacy-preserving. Trustless. Powered by zero-knowledge proofs.

Inspired by the ancient Ent from Lord of the Rings, our design philosophy reflects patience, deep roots, and deliberate action.

## ✨ Features

- **Responsive Design**: Fully optimized for desktop and mobile browsers
- **Black & White Theme**: Elegant, minimal aesthetic with tree-inspired design elements
- **Animated Tree Background**: Dynamic SVG branches that grow on page load
- **Scroll Animations**: Intersection Observer-based reveal animations
- **Modern Stack**: Next.js 14, TypeScript, Tailwind CSS

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/fangorn-xyz/website.git
cd fangorn
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
fangorn/
├── src/
│   ├── app/
│   │   ├── globals.css      # Global styles and animations
│   │   ├── layout.tsx       # Root layout with metadata
│   │   └── page.tsx         # Main page component
│   └── components/
│       ├── Navigation.tsx    # Responsive navbar
│       ├── TreeBackground.tsx # Animated SVG tree
│       ├── HeroSection.tsx   # Landing hero
│       ├── TechnologySection.tsx # Tech features
│       ├── TeamSection.tsx   # Team & values
│       ├── RoadmapSection.tsx # Project timeline
│       ├── ContactSection.tsx # Contact form
│       └── Footer.tsx        # Site footer
├── public/                   # Static assets
├── tailwind.config.ts        # Tailwind configuration
├── next.config.js            # Next.js configuration
└── package.json
```

## 🎨 Design System

### Colors

The site uses a carefully crafted grayscale palette:

| Name     | Hex       | Usage                    |
|----------|-----------|--------------------------|
| Black    | `#0a0a0a` | Background               |
| Charcoal | `#1a1a1a` | Card backgrounds         |
| Graphite | `#2a2a2a` | Borders, dividers        |
| Slate    | `#3a3a3a` | Secondary borders        |
| Ash      | `#6a6a6a` | Body text                |
| Silver   | `#9a9a9a` | Secondary text           |
| Mist     | `#cacaca` | Accent text              |
| Bone     | `#e8e8e8` | Light accent             |
| Ivory    | `#f5f5f5` | Headings                 |
| White    | `#fafafa` | Primary accent           |

### Typography

- **Display**: Cormorant Garamond (elegant serif for headings)
- **Body**: Syne (modern geometric sans-serif)
- **Mono**: JetBrains Mono (technical/code elements)

### Animations

- Tree branch drawing animation
- Scroll-triggered fade-in effects
- Hover state transitions
- Floating elements
- Pulsing status indicators

## 🔧 Customization

### Updating Team Members

Edit the `team` array in `src/components/TeamSection.tsx`:

```typescript
const team = [
  {
    name: 'Your Name',
    role: 'Your Role',
    bio: 'Your bio...',
    links: {
      twitter: 'https://twitter.com/...',
      linkedin: 'https://linkedin.com/in/...',
      github: 'https://github.com/...',
    },
  },
  // Add more team members...
]
```

### Updating Roadmap

Edit the `roadmapItems` array in `src/components/RoadmapSection.tsx`:

```typescript
const roadmapItems = [
  {
    phase: 'Phase 1',
    title: 'Your Phase Title',
    status: 'completed' | 'in-progress' | 'upcoming',
    timeline: 'Q1 2024',
    items: ['Item 1', 'Item 2', ...],
  },
  // Add more phases...
]
```

### Updating Contact Information

Edit the contact details in `src/components/ContactSection.tsx`.

## 📄 License

Copyright © 2024 Fangorn. All rights reserved.

---

*Built with intention. Rooted in privacy.*
