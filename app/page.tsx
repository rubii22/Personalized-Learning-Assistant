"use client";
import { useState, useEffect } from "react";
import LandingPage from './components/ui/LandingPage';
import OnboardingWizard, { CompleteUserProfile } from './components/ui/OnboardingWizard';
import ChatBox from './components/ui/ChatBox';
import AnalyticsDashboard from './components/ui/AnalyticsDashboard';
import QuizComponent from './components/ui/QuizComponent';
import { getUserProfile, saveUserProfile } from './utils/storage';

type AppView = 'landing' | 'onboarding' | 'chat' | 'analytics' | 'quiz';

export default function Home() {
  const [userProfile, setUserProfile] = useState<CompleteUserProfile | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedProfile = getUserProfile();
    if (savedProfile) {
      setUserProfile(savedProfile);
      setCurrentView('chat');
    } else {
      setCurrentView('landing');
    } 
    setIsLoading(false);
  }, []);

  const handleGetStarted = () => {
    setCurrentView('onboarding');
  };

  const handleOnboardingComplete = (profile: CompleteUserProfile) => {
    setUserProfile(profile);
    saveUserProfile(profile);
    setCurrentView('chat');
  };

  const handleShowAnalytics = () => {
    setCurrentView('analytics');
  };

  const handleShowQuiz = () => {
    setCurrentView('quiz');
  };

  const handleBackToChat = () => {
    setCurrentView('chat');
  };

  const handleQuizComplete = (score: number) => {
    console.log(`Quiz completed with score: ${score}%`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading MentorMind AI...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (currentView === 'onboarding') {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  if (currentView === 'analytics') {
    return (
      <AnalyticsDashboard 
        profile={userProfile}
        onBackToChat={handleBackToChat}
      />
    );
  }

  if (currentView === 'quiz') {
    return (
      <QuizComponent
        profile={userProfile}
        onComplete={handleQuizComplete}
        onBack={handleBackToChat}
      />
    );
  }

  return (
    <div>
      <ChatBox 
        profile={userProfile} 
        onShowAnalytics={handleShowAnalytics}
        onShowQuiz={handleShowQuiz}
      />
    </div>
  );
}