import Navigation from '@/components/Navigation'
import TreeBackground from '@/components/TreeBackground'
import HeroSection from '@/components/HeroSection'
import TechnologySection from '@/components/TechnologySection'
import TeamSection from '@/components/TeamSection'
import RoadmapSection from '@/components/RoadmapSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="relative min-h-screen bg-fangorn-black">
      {/* Animated tree background */}
      <TreeBackground />

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Technology Section */}
      <TechnologySection />

      {/* Team Section */}
      <TeamSection />

      {/* Roadmap Section */}
      <RoadmapSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </main>
  )
}
