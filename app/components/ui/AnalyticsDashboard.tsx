"use client";
import { useState, useEffect } from "react";
import { CompleteUserProfile } from './OnboardingWizard';
import { getAnalytics, UserAnalytics } from '../../utils/storage';

interface AnalyticsData {
  progress: {
    topicsCompleted: number;
    totalTimeSpent: number; // in minutes
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

interface AnalyticsDashboardProps {
  profile: CompleteUserProfile;
  onBackToChat: () => void;
}

export default function AnalyticsDashboard({ profile, onBackToChat }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // Get real data from localStorage
        const userData: UserAnalytics = getAnalytics();
        
        // Calculate analytics from real user data
        const calculatedAnalytics = calculateAnalyticsFromUserData(userData, profile, timeFrame);
        
        setAnalytics(calculatedAnalytics);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [profile, timeFrame]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading your learning analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold mb-2">No Analytics Yet</h2>
          <p className="text-gray-400 mb-6">Start learning and taking quizzes to see your progress!</p>
          <button
            onClick={onBackToChat}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition"
          >
            Start Learning
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📊 Learning Analytics</h1>
            <p className="text-gray-400">Hello {profile.name}, here&apos;s your learning progress</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeFrame}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTimeFrame(e.target.value as 'week' | 'month' | 'all')}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="all">All Time</option>
            </select>
            <button
              onClick={onBackToChat}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
            >
              Back to Chat
            </button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="text-blue-400 text-2xl mb-2">📚</div>
            <h3 className="text-white font-semibold mb-2">Topics Completed</h3>
            <p className="text-3xl font-bold text-white">{analytics.progress.topicsCompleted}</p>
            <p className="text-gray-400 text-sm">Learning sessions</p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="text-green-400 text-2xl mb-2">⏱️</div>
            <h3 className="text-white font-semibold mb-2">Time Invested</h3>
            <p className="text-3xl font-bold text-white">{analytics.progress.totalTimeSpent}</p>
            <p className="text-gray-400 text-sm">Minutes learning</p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="text-purple-400 text-2xl mb-2">📈</div>
            <h3 className="text-white font-semibold mb-2">Confidence Growth</h3>
            <p className="text-3xl font-bold text-white">
              +{analytics.progress.confidenceGrowth[analytics.progress.confidenceGrowth.length - 1] - analytics.progress.confidenceGrowth[0]}
            </p>
            <p className="text-gray-400 text-sm">Points improvement</p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="text-yellow-400 text-2xl mb-2">🎯</div>
            <h3 className="text-white font-semibold mb-2">Average Score</h3>
            <p className="text-3xl font-bold text-white">{analytics.performance.averageScore}%</p>
            <p className="text-gray-400 text-sm">Quiz performance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Metrics */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">📈 Performance Metrics</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Learning Pace</span>
                  <span className="capitalize">{analytics.performance.learningPace}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      analytics.performance.learningPace === 'fast' ? 'bg-green-500' :
                      analytics.performance.learningPace === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{
                      width: analytics.performance.learningPace === 'fast' ? '90%' :
                            analytics.performance.learningPace === 'moderate' ? '60%' : '30%'
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Quiz Scores Trend</span>
                  <span>Last 5 attempts</span>
                </div>
                <div className="flex items-end space-x-1 h-12">
                  {analytics.performance.quizScores.map((score, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t transition-all hover:opacity-80"
                      style={{ height: `${score}%` }}
                      title={`Score: ${score}%`}
                    ></div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3">Areas Needing Improvement</h4>
                <div className="space-y-2">
                  {analytics.performance.weakAreas.map((area, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-300 text-sm">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">💡 Smart Recommendations</h2>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-green-400 font-semibold mb-3">🎯 Next Topics to Explore</h4>
                <div className="space-y-2">
                  {analytics.recommendations.nextTopics.map((topic, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-300 text-sm">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-blue-400 font-semibold mb-3">📅 Study Schedule</h4>
                <div className="space-y-2">
                  {analytics.recommendations.studySchedule.map((schedule, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-300 text-sm">{schedule}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-purple-400 font-semibold mb-3">🔧 Learning Resources</h4>
                <div className="space-y-2">
                  {analytics.recommendations.resources.map((resource, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-300 text-sm">{resource}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confidence Growth Chart */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mt-8">
          <h2 className="text-xl font-bold text-white mb-6">🚀 Confidence Growth Over Time</h2>
          <div className="flex items-end space-x-4 h-32">
            {analytics.progress.confidenceGrowth.map((confidence, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-green-500 to-blue-500 rounded-t transition-all hover:opacity-80"
                  style={{ height: `${confidence * 20}%` }}
                ></div>
                <span className="text-gray-400 text-xs mt-2">Session {index + 1}</span>
                <span className="text-white text-sm font-semibold">{confidence}/5</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate analytics from localStorage data
function calculateAnalyticsFromUserData(
  userData: UserAnalytics,
  profile: CompleteUserProfile,
  timeFrame: 'week' | 'month' | 'all'
): AnalyticsData {
  // Filter data based on timeFrame
  const now = new Date();
  const filterDate = timeFrame === 'week' 
    ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    : timeFrame === 'month'
    ? new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    : new Date(0); // All time

  const filteredSessions = userData.sessions.filter(
    s => new Date(s.startTime) > filterDate
  );
  const filteredQuizzes = userData.quizResults.filter(
    q => new Date(q.timestamp) > filterDate
  );

  // Calculate progress metrics
  const topicsCompleted = timeFrame === 'all' 
    ? userData.topicsStudied.length 
    : new Set(filteredSessions.map(s => s.topic)).size;
  
  const totalTimeSpent = filteredSessions.reduce((sum, s) => sum + s.duration, 0);
  const totalMinutes = Math.floor(totalTimeSpent / 60);
  
  // Confidence growth (last 3 readings)
  const recentConfidence = userData.confidenceLevels
    .slice(-3)
    .map(c => c.level);
  const confidenceGrowth = recentConfidence.length > 0 
    ? recentConfidence 
    : [profile.confidence];

  // Quiz performance
  const quizScores = filteredQuizzes.length > 0
    ? filteredQuizzes.slice(-5).map(q => q.score)
    : [];
  
  const averageScore = quizScores.length > 0
    ? Math.round(quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length)
    : 0;

  // Identify weak areas (topics with score < 70)
  const weakAreas = filteredQuizzes
    .filter(q => q.score < 70)
    .map(q => q.topic)
    .filter((topic, index, self) => self.indexOf(topic) === index)
    .slice(0, 3);

  // Learning pace based on sessions in last week
  const lastWeekSessions = userData.sessions.filter(
    s => new Date(s.startTime) > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  ).length;
  
  const learningPace: 'slow' | 'moderate' | 'fast' = 
    lastWeekSessions >= 5 ? 'fast' :
    lastWeekSessions >= 2 ? 'moderate' : 'slow';

  // Generate recommendations
  const nextTopics = [
    `${profile.topic} - Advanced Concepts`,
    'Practical Applications',
    'Real-world Case Studies',
    'Problem Solving Techniques'
  ].filter(topic => !userData.topicsStudied.includes(topic)).slice(0, 3);

  const studySchedule = [
    `Study ${profile.topic} for ${profile.sessionLength} daily`,
    `Practice ${profile.studyFrequency} times per week`,
    averageScore < 70 ? 'Focus on foundational concepts' : 'Challenge yourself with harder topics',
    'Take regular quizzes to track progress'
  ];

  const improvementAreas = weakAreas.length > 0
    ? weakAreas.map(area => `Review and practice: ${area}`)
    : ['Keep up the great work!', 'Try more challenging quizzes', 'Explore advanced topics'];

  return {
    progress: {
      topicsCompleted,
      totalTimeSpent: totalMinutes,
      confidenceGrowth,
      sessionsCompleted: filteredSessions.length
    },
    performance: {
      quizScores,
      averageScore,
      weakAreas: weakAreas.length > 0 ? weakAreas : ['No weak areas identified'],
      learningPace
    },
    recommendations: {
      nextTopics,
      studySchedule,
      resources: [
        'AI-generated quizzes',
        'Step-by-step explanations',
        'Interactive chat learning',
        'Progress tracking'
      ],
      improvementAreas
    }
  };
}
