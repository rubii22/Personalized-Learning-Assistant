// LocalStorage utility functions for MentorMind AI
import { CompleteUserProfile } from '../components/ui/OnboardingWizard';

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  imageUrl?: string;
}

export interface QuizResult {
  topic: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timestamp: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface LearningSession {
  startTime: string;
  endTime: string;
  duration: number; // in seconds
  topic: string;
  messagesCount: number;
  confidenceBefore: number;
  confidenceAfter: number;
}

export interface UserAnalytics {
  sessions: LearningSession[];
  quizResults: QuizResult[];
  topicsStudied: string[];
  totalTimeSpent: number; // in seconds
  confidenceLevels: Array<{ timestamp: string; level: number; topic: string }>;
  lastActive: string;
}

// Storage keys
const KEYS = {
  USER_PROFILE: 'mentormind_user_profile',
  CHAT_HISTORY: 'mentormind_chat_history',
  ANALYTICS: 'mentormind_analytics',
  CURRENT_SESSION: 'mentormind_current_session',
};

// User Profile Functions
export const saveUserProfile = (profile: CompleteUserProfile): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  }
};

export const getUserProfile = (): CompleteUserProfile | null => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

// Chat History Functions
export const saveChatHistory = (messages: ChatMessage[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEYS.CHAT_HISTORY, JSON.stringify(messages));
  }
};

export const getChatHistory = (): ChatMessage[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(KEYS.CHAT_HISTORY);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const clearChatHistory = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(KEYS.CHAT_HISTORY);
  }
};

// Analytics Functions
export const getAnalytics = (): UserAnalytics => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(KEYS.ANALYTICS);
    if (data) {
      return JSON.parse(data);
    }
  }
  
  // Return default analytics
  return {
    sessions: [],
    quizResults: [],
    topicsStudied: [],
    totalTimeSpent: 0,
    confidenceLevels: [],
    lastActive: new Date().toISOString(),
  };
};

export const saveAnalytics = (analytics: UserAnalytics): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(analytics));
  }
};

// Session Management
export const startSession = (topic: string, confidence: number): void => {
  if (typeof window !== 'undefined') {
    const session = {
      startTime: new Date().toISOString(),
      topic,
      confidenceBefore: confidence,
      messagesCount: 0,
    };
    localStorage.setItem(KEYS.CURRENT_SESSION, JSON.stringify(session));
  }
};

export const endSession = (confidenceAfter: number): void => {
  if (typeof window !== 'undefined') {
    const sessionData = localStorage.getItem(KEYS.CURRENT_SESSION);
    if (sessionData) {
      const session = JSON.parse(sessionData);
      const endTime = new Date().toISOString();
      const duration = Math.floor(
        (new Date(endTime).getTime() - new Date(session.startTime).getTime()) / 1000
      );

      const completedSession: LearningSession = {
        startTime: session.startTime,
        endTime,
        duration,
        topic: session.topic,
        messagesCount: session.messagesCount,
        confidenceBefore: session.confidenceBefore,
        confidenceAfter,
      };

      // Update analytics
      const analytics = getAnalytics();
      analytics.sessions.push(completedSession);
      analytics.totalTimeSpent += duration;
      analytics.lastActive = endTime;
      
      // Add topic if not already tracked
      if (!analytics.topicsStudied.includes(session.topic)) {
        analytics.topicsStudied.push(session.topic);
      }
      
      // Track confidence
      analytics.confidenceLevels.push({
        timestamp: endTime,
        level: confidenceAfter,
        topic: session.topic,
      });

      saveAnalytics(analytics);
      localStorage.removeItem(KEYS.CURRENT_SESSION);
    }
  }
};

export const incrementMessageCount = (): void => {
  if (typeof window !== 'undefined') {
    const sessionData = localStorage.getItem(KEYS.CURRENT_SESSION);
    if (sessionData) {
      const session = JSON.parse(sessionData);
      session.messagesCount += 1;
      localStorage.setItem(KEYS.CURRENT_SESSION, JSON.stringify(session));
    }
  }
};

// Quiz Results
export const saveQuizResult = (result: QuizResult): void => {
  if (typeof window !== 'undefined') {
    const analytics = getAnalytics();
    analytics.quizResults.push(result);
    analytics.lastActive = new Date().toISOString();
    saveAnalytics(analytics);
  }
};

// Clear all data
export const clearAllData = (): void => {
  if (typeof window !== 'undefined') {
    Object.values(KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};

// Export for debugging
export const exportData = () => {
  if (typeof window !== 'undefined') {
    return {
      profile: getUserProfile(),
      chatHistory: getChatHistory(),
      analytics: getAnalytics(),
    };
  }
  return null;
};
