"use client";
import AnalyticsDashboard from '../components/ui/AnalyticsDashboard';
import { CompleteUserProfile } from '../components/ui/OnboardingWizard';

export default function AnalyticsPage() {
  // In real app, you'd fetch the user profile from context or API
  // For now, using mock data for demonstration
  const mockProfile: CompleteUserProfile = {
    name: "Student",
    topic: "General Learning",
    motivation: "curiosity",
    priorKnowledge: "beginner",
    confidence: 3,
    formatPreferences: ["text", "images"],
    sessionLength: "15-30min",
    studyFrequency: 3,
    device: "laptop",
    accessibility: [],
    exampleTypes: ["real-world"],
    wantsReferences: true,
    assessmentPref: ["quizzes"],
    feedbackPref: "instant",
    consent: true
  };

  return (
    <AnalyticsDashboard 
      profile={mockProfile}
      onBackToChat={() => window.history.back()}
    />
  );
}