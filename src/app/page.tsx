'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useEffect, useState } from 'react'

export default function LandingPage() {
  const router = useRouter()
  const { isAuthenticated, _hasHydrated } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (_hasHydrated && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, _hasHydrated, router])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-old-paper">
      {/* Navigation */}
      <nav className="border-b-4 border-old-ink bg-white shadow-[0px_4px_0px_0px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📚</span>
              <div>
                <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider">Amar Pathagar</h1>
                <p className="text-xs text-old-grey uppercase tracking-wider hidden md:block">Trust-Based Reading Network</p>
              </div>
            </div>
            <div className="flex gap-2 md:gap-3">
              <button
                onClick={() => router.push('/login')}
                className="px-4 md:px-6 py-2 border-2 border-old-ink bg-white text-old-ink font-bold uppercase text-xs md:text-sm
                         hover:bg-old-ink hover:text-old-paper transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/register')}
                className="px-4 md:px-6 py-2 border-2 border-old-ink bg-old-ink text-old-paper font-bold uppercase text-xs md:text-sm
                         hover:bg-gray-800 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="border-b-4 border-old-ink bg-gradient-to-br from-amber-50 to-old-paper py-12 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 text-9xl md:text-[20rem] opacity-5">📖</div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <span className="text-6xl md:text-8xl">📚</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-wider mb-4 md:mb-6">
              Share Books,<br />Build Trust
            </h2>
            <p className="text-lg md:text-xl text-old-grey mb-6 md:mb-8 leading-relaxed">
              A community-driven library where books circulate based on trust and reputation.
              No late fees, no bureaucracy—just readers helping readers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <button
                onClick={() => router.push('/register')}
                className="px-8 md:px-12 py-4 border-4 border-old-ink bg-old-ink text-old-paper font-bold uppercase text-base md:text-lg
                         hover:bg-gray-800 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]"
              >
                Get Started Free
              </button>
              <button
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-8 md:px-12 py-4 border-4 border-old-ink bg-white text-old-ink font-bold uppercase text-base md:text-lg
                         hover:bg-old-paper transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b-4 border-old-ink bg-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <StatCard icon="📖" number="1000+" label="Books Shared" />
            <StatCard icon="👥" number="500+" label="Active Members" />
            <StatCard icon="🔄" number="2500+" label="Exchanges" />
            <StatCard icon="⭐" number="98%" label="Trust Score" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-b-4 border-old-ink bg-old-paper py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-3">How It Works</h3>
            <p className="text-old-grey text-base md:text-lg">Simple, trust-based book sharing</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <StepCard
              number="1"
              icon="📚"
              title="Browse & Request"
              description="Explore our collection and request books you want to read. No fees, no deposits required."
            />
            <StepCard
              number="2"
              icon="🤝"
              title="Connect & Exchange"
              description="Coordinate with book holders through our handover system. Meet up and exchange books."
            />
            <StepCard
              number="3"
              icon="⭐"
              title="Read & Return"
              description="Enjoy your book and return it on time. Build your reputation and unlock more books."
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b-4 border-old-ink bg-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-3">Features</h3>
            <p className="text-old-grey text-base md:text-lg">Everything you need for community reading</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <FeatureCard
              icon="🏆"
              title="Reputation System"
              description="Build trust through timely returns and positive contributions. Your success score unlocks opportunities."
            />
            <FeatureCard
              icon="💬"
              title="Handover Threads"
              description="Coordinate book exchanges with built-in messaging. Discuss meeting points and timing."
            />
            <FeatureCard
              icon="📊"
              title="Reading History"
              description="Track your reading journey. See what you've read, when, and for how long."
            />
            <FeatureCard
              icon="🔖"
              title="Bookmarks & Favorites"
              description="Save books you're interested in. Create your wishlist and get notified when available."
            />
            <FeatureCard
              icon="⭐"
              title="Reviews & Ratings"
              description="Share your thoughts on books. Help others discover great reads."
            />
            <FeatureCard
              icon="🎁"
              title="Donate Books"
              description="Contribute to the community by donating books. Earn reputation points and help others."
            />
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-b-4 border-old-ink bg-gradient-to-br from-old-paper to-amber-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-3">Our Principles</h3>
            <p className="text-old-grey text-base md:text-lg">What makes us different</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <PrincipleCard
              icon="🤝"
              title="Trust-Based"
              description="No deposits, no late fees. We believe in the power of community trust and reputation."
            />
            <PrincipleCard
              icon="📖"
              title="Knowledge Over Hoarding"
              description="Books are meant to be read, not collected. Share your books and discover new ones."
            />
            <PrincipleCard
              icon="⭐"
              title="Reputation Through Contribution"
              description="Build your standing by being reliable, helpful, and engaged in the community."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-b-4 border-old-ink bg-white py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="border-4 border-old-ink bg-gradient-to-br from-amber-50 to-old-paper p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]">
            <span className="text-5xl md:text-6xl mb-4 block">📚</span>
            <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4">
              Ready to Start Reading?
            </h3>
            <p className="text-old-grey text-base md:text-lg mb-6 md:mb-8">
              Join our community of book lovers. Share, discover, and read together.
            </p>
            <button
              onClick={() => router.push('/register')}
              className="px-8 md:px-12 py-4 border-4 border-old-ink bg-old-ink text-old-paper font-bold uppercase text-base md:text-lg
                       hover:bg-gray-800 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]"
            >
              Join Now - It's Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-old-ink text-old-paper py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">📚</span>
                <h4 className="text-xl font-bold uppercase tracking-wider">Amar Pathagar</h4>
              </div>
              <p className="text-old-paper opacity-75 text-sm">
                A trust-based community library where knowledge flows freely and reputation matters.
              </p>
            </div>
            <div>
              <h5 className="font-bold uppercase tracking-wider mb-4 text-sm">Quick Links</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => router.push('/login')}
                    className="text-old-paper opacity-75 hover:opacity-100 transition-opacity"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/register')}
                    className="text-old-paper opacity-75 hover:opacity-100 transition-opacity"
                  >
                    Sign Up
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="text-old-paper opacity-75 hover:opacity-100 transition-opacity"
                  >
                    How It Works
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold uppercase tracking-wider mb-4 text-sm">Contribute</h5>
              <p className="text-old-paper opacity-75 text-sm mb-3">
                This is an open-source project. Help us improve!
              </p>
              <a
                href="https://github.com/nesohq/amar-pathagar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-old-paper bg-transparent text-old-paper font-bold uppercase text-xs
                         hover:bg-old-paper hover:text-old-ink transition-all"
              >
                <span>⭐</span>
                <span>View on GitHub</span>
              </a>
            </div>
          </div>
          <div className="border-t-2 border-old-paper border-opacity-20 pt-6 text-center">
            <p className="text-old-paper opacity-75 text-sm">
              © 2026 Amar Pathagar. A Trust-Based Reading Network by{' '}
              <a
                href="https://github.com/nesohq"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-100"
              >
                NesoHQ
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function StatCard({ icon, number, label }: { icon: string; number: string; label: string }) {
  return (
    <div className="border-4 border-old-ink bg-white p-4 md:p-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] transition-all">
      <div className="text-3xl md:text-4xl mb-2">{icon}</div>
      <div className="text-2xl md:text-3xl font-bold mb-1">{number}</div>
      <div className="text-xs md:text-sm text-old-grey uppercase tracking-wider">{label}</div>
    </div>
  )
}

function StepCard({ number, icon, title, description }: { number: string; icon: string; title: string; description: string }) {
  return (
    <div className="border-4 border-old-ink bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="border-2 border-old-ink bg-old-ink text-old-paper w-10 h-10 flex items-center justify-center font-bold text-xl">
          {number}
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
      <h4 className="text-lg md:text-xl font-bold uppercase tracking-wider mb-2">{title}</h4>
      <p className="text-sm text-old-grey leading-relaxed">{description}</p>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="border-2 border-old-border bg-white p-4 md:p-5 hover:border-old-ink hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all">
      <div className="text-3xl md:text-4xl mb-3">{icon}</div>
      <h4 className="text-base md:text-lg font-bold uppercase tracking-wider mb-2">{title}</h4>
      <p className="text-xs md:text-sm text-old-grey leading-relaxed">{description}</p>
    </div>
  )
}

function PrincipleCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="border-4 border-old-ink bg-white p-6 md:p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
      <div className="text-4xl md:text-5xl mb-4">{icon}</div>
      <h4 className="text-lg md:text-xl font-bold uppercase tracking-wider mb-3">{title}</h4>
      <p className="text-sm text-old-grey leading-relaxed">{description}</p>
    </div>
  )
}
