"use client";
import { useState } from "react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <span className="text-white text-2xl font-bold">MentorMind AI</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-300 hover:text-white transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-300 hover:text-white transition"
            >
              How It Works
            </a>
            <a
              href="#benefits"
              className="text-gray-300 hover:text-white transition"
            >
              Benefits
            </a>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-20">
          {/* <div className="inline-block mb-6">
            <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold border border-blue-500/30">
              🚀 AI-Powered Learning for Pakistan
            </span>
          </div> */}

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your Personal
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              Learning Companion
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Experience personalized, AI-powered education in{" "}
            <strong>English</strong> and <strong>Urdu</strong>. Get step-by-step
            explanations, take adaptive quizzes, and track your progress—all
            designed for Pakistani students.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={onGetStarted}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
            >
              <span className="relative z-10 flex items-center">
                Get Started
                <svg
                  className={`ml-2 w-5 h-5 transition-transform ${
                    isHovered ? "translate-x-1" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div
          id="features"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          <FeatureCard
            icon="🎯"
            title="Personalized Learning"
            description="AI adapts to your learning style, pace, and confidence level for a truly customized experience."
          />
          <FeatureCard
            icon="🗣️"
            title="Bilingual Support"
            description="Learn in English or Urdu—switch seamlessly based on your comfort and preference."
          />
          <FeatureCard
            icon="📚"
            title="AI-Generated Quizzes"
            description="Take adaptive quizzes tailored to your knowledge level with instant feedback."
          />
          <FeatureCard
            icon="📊"
            title="Progress Analytics"
            description="Track your learning journey with detailed insights and performance metrics."
          />
          <FeatureCard
            icon="🖼️"
            title="Visual Learning"
            description="Get AI-generated images and diagrams to understand concepts better."
          />
          <FeatureCard
            icon="💬"
            title="Interactive Chat"
            description="Ask questions anytime and get step-by-step explanations from your AI tutor."
          />
        </div>

        {/* How It Works */}
        <div
          id="how-it-works"
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 mb-20 border border-white/10"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="2"
              title="Start Learning"
              description="Chat with AI, ask questions, get explanations"
            />
            <StepCard
              number="3"
              title="Take Quizzes"
              description="Test your knowledge with adaptive assessments"
            />
            <StepCard
              number="4"
              title="Track Progress"
              description="Monitor your growth and celebrate achievements"
            />
          </div>
        </div>

        {/* Benefits */}
        {/* <div id="benefits" className="text-center mb-20">
          <h2 className="text-4xl font-bold text-white mb-6">
            Why Choose MentorMind AI?
          </h2>
          <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
            Built specifically for Pakistani students to make quality education
            accessible to everyone, everywhere.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <BenefitCard
              title="No Cost"
              description="Completely free—no hidden fees or subscriptions"
            />
            <BenefitCard
              title="Works Offline"
              description="Data stored locally, works in low-bandwidth areas"
            />
            <BenefitCard
              title="Mobile Friendly"
              description="Learn on any device—phone, tablet, or computer"
            />
            <BenefitCard
              title="Culturally Relevant"
              description="Examples and content tailored for Pakistani context"
            />
          </div>
        </div> */}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of students learning smarter with AI
          </p>
          <button
            onClick={onGetStarted}
            className="px-10 py-4 bg-white text-blue-600 font-bold rounded-xl text-lg hover:scale-105 transition-transform duration-300 hover:shadow-2xl"
          >
            Start Learning Now →
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function BenefitCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-left">
      <div className="flex items-start">
        <div className="text-green-400 text-2xl mr-3">✓</div>
        <div>
          <h4 className="text-white font-semibold mb-1">{title}</h4>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}
