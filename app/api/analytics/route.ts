import { NextResponse } from "next/server";

// Define proper TypeScript interfaces
interface Session {
  timestamp: string;
  duration: number;
  topic: string;
  confidenceBefore: number;
  confidenceAfter: number;
}

interface QuizScore {
  timestamp: string;
  score: number;
  topic: string;
  totalQuestions: number;
}

interface ConfidenceLevel {
  timestamp: string;
  level: number;
  topic: string;
}

interface UserAnalyticsData {
  sessions: Session[];
  quizScores: QuizScore[];
  timeSpent: number;
  topicsCompleted: string[];
  confidenceLevels: ConfidenceLevel[];
  createdAt: string;
}

interface AnalyticsData {
  progress: {
    topicsCompleted: number;
    totalTimeSpent: number;
    confidenceGrowth: number[];
    sessionsCompleted: number;
  };
  performance: {
    quizScores: number[];
    averageScore: number;
    weakAreas: string[];
    learningPace: 'slow' | 'moderate' | 'fast';
  };
  recommendations: {
    nextTopics: string[];
    studySchedule: string[];
    resources: string[];
    improvementAreas: string[];
  };
}

// Mock database for analytics (in real app, use actual database)
const userAnalytics = new Map<string, UserAnalyticsData>();

export async function POST(req: Request) {
  try {
    const { userId, action, data } = await req.json();

    // Initialize user analytics if not exists
    if (!userAnalytics.has(userId)) {
      userAnalytics.set(userId, {
        sessions: [],
        quizScores: [],
        timeSpent: 0,
        topicsCompleted: [],
        confidenceLevels: [],
        createdAt: new Date().toISOString()
      });
    }

    const userData = userAnalytics.get(userId);

    if (!userData) {
      return NextResponse.json({ error: 'User data not found' }, { status: 404 });
    }

    switch (action) {
      case 'track_session':
        userData.sessions.push({
          timestamp: new Date().toISOString(),
          duration: data.duration,
          topic: data.topic,
          confidenceBefore: data.confidenceBefore,
          confidenceAfter: data.confidenceAfter
        });
        userData.timeSpent += data.duration;
        break;

      case 'track_quiz':
        userData.quizScores.push({
          timestamp: new Date().toISOString(),
          score: data.score,
          topic: data.topic,
          totalQuestions: data.totalQuestions
        });
        break;

      case 'track_topic_completion':
        if (!userData.topicsCompleted.includes(data.topic)) {
          userData.topicsCompleted.push(data.topic);
        }
        break;

      case 'track_confidence':
        userData.confidenceLevels.push({
          timestamp: new Date().toISOString(),
          level: data.level,
          topic: data.topic
        });
        break;

      case 'get_analytics':
        // Calculate analytics from user data
        const analytics = calculateAnalytics(userData);
        return NextResponse.json({ analytics });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    userAnalytics.set(userId, userData);

    return NextResponse.json({ success: true, message: 'Analytics updated' });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to process analytics' },
      { status: 500 }
    );
  }
}

// Helper function to calculate analytics from user data
function calculateAnalytics(userData: UserAnalyticsData): AnalyticsData {
  const sessions = userData.sessions || [];
  const quizScores = userData.quizScores || [];
  const confidenceLevels = userData.confidenceLevels || [];

  // Calculate average quiz score
  const averageScore = quizScores.length > 0 
    ? quizScores.reduce((sum: number, quiz: QuizScore) => sum + quiz.score, 0) / quizScores.length
    : 0;

  // Calculate confidence growth
  const confidenceGrowth = confidenceLevels
    .slice(-5) // Last 5 confidence readings
    .map((c: ConfidenceLevel) => c.level);

  // Determine learning pace
  const sessionsLastWeek = sessions.filter((s: Session) => {
    const sessionDate = new Date(s.timestamp);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return sessionDate > weekAgo;
  }).length;

  let learningPace: 'slow' | 'moderate' | 'fast';
  if (sessionsLastWeek >= 5) learningPace = 'fast';
  else if (sessionsLastWeek >= 2) learningPace = 'moderate';
  else learningPace = 'slow';

  // Identify weak areas based on quiz scores
  const weakAreas = quizScores
    .filter((quiz: QuizScore) => quiz.score < 70)
    .map((quiz: QuizScore) => quiz.topic)
    .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index)
    .slice(0, 3); // Top 3 weak areas

  return {
    progress: {
      topicsCompleted: userData.topicsCompleted.length,
      totalTimeSpent: Math.round(userData.timeSpent / 60), // Convert to minutes
      confidenceGrowth,
      sessionsCompleted: sessions.length
    },
    performance: {
      quizScores: quizScores.slice(-5).map((q: QuizScore) => q.score),
      averageScore: Math.round(averageScore),
      weakAreas: weakAreas.length > 0 ? weakAreas : ['No weak areas identified yet'],
      learningPace
    },
    recommendations: {
      nextTopics: generateNextTopics(userData.topicsCompleted),
      studySchedule: generateStudySchedule(sessions.length, learningPace),
      resources: ['Interactive tutorials', 'Video explanations', 'Practice exercises'],
      improvementAreas: weakAreas.map(area => `Focus more on ${area}`)
    }
  };
}

function generateNextTopics(completedTopics: string[]): string[] {
  const allTopics = [
    'Advanced Concepts',
    'Practical Applications', 
    'Real-world Case Studies',
    'Problem Solving Techniques',
    'Industry Best Practices'
  ];
  
  return allTopics
    .filter(topic => !completedTopics.includes(topic))
    .slice(0, 3);
}

function generateStudySchedule(sessionsCount: number, pace: 'slow' | 'moderate' | 'fast'): string[] {
  const baseSchedule = [
    'Study for 15-30 minutes daily',
    'Take practice quizzes weekly',
    'Review previous topics bi-weekly'
  ];

  if (pace === 'fast') {
    baseSchedule.push('Complete advanced exercises weekly');
  } else if (pace === 'slow') {
    baseSchedule.push('Focus on foundational concepts');
  }

  return baseSchedule;
}

// GET method to retrieve analytics (optional)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  if (!userAnalytics.has(userId)) {
    return NextResponse.json({ error: 'No analytics data found' }, { status: 404 });
  }

  const userData = userAnalytics.get(userId);
  
  if (!userData) {
    return NextResponse.json({ error: 'User data not found' }, { status: 404 });
  }

  const analytics = calculateAnalytics(userData);

  return NextResponse.json({ analytics });
}