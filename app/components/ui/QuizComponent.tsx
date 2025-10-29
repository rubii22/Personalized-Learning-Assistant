/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { CompleteUserProfile } from "./OnboardingWizard";
import { saveQuizResult } from "../../utils/storage";

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
}

interface Quiz {
  quizTitle: string;
  topic: string;
  difficulty: string;
  questions: QuizQuestion[];
}

interface QuizComponentProps {
  profile: CompleteUserProfile;
  onComplete: (score: number) => void;
  onBack: () => void;
}

export default function QuizComponent({ profile, onComplete, onBack }: QuizComponentProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Generate quiz on mount
  useEffect(() => {
    generateQuiz();
  }, []);

  const generateQuiz = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: profile.topic,
          difficulty: profile.priorKnowledge,
          questionCount: 5,
          language: "english",
          profile,
        }),
      });

      const data = await response.json();
      
      if (data.success && data.quiz) {
        setQuiz(data.quiz);
      } else {
        throw new Error(data.error || "Failed to generate quiz");
      }
    } catch (error) {
      console.error("Quiz generation error:", error);
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return; // Prevent changing answer after submission
    
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answer,
    });
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswers[currentQuestion]) {
      alert("Please select an answer!");
      return;
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
      calculateScore();
    }
  };

  const calculateScore = () => {
    if (!quiz) return;

    let correctCount = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = (correctCount / quiz.questions.length) * 100;
    setScore(finalScore);
    setQuizCompleted(true);

    // Save quiz result to localStorage
    const quizResult: any = {
      topic: quiz.topic,
      score: finalScore,
      totalQuestions: quiz.questions.length,
      correctAnswers: correctCount,
      timestamp: new Date().toISOString(),
      difficulty: profile.priorKnowledge,
    };
    
    saveQuizResult(quizResult);
    onComplete(finalScore);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Generating your personalized quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Failed to load quiz</p>
          <button
            onClick={generateQuiz}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Quiz completed view
  if (quizCompleted) {
    const correctCount = quiz.questions.filter(
      (q, i) => selectedAnswers[i] === q.correctAnswer
    ).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-700 p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {score >= 80 ? "🎉" : score >= 60 ? "👏" : "💪"}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Quiz Completed!</h2>
            <p className="text-gray-400 mb-6">Great job, {profile.name}!</p>
            
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-6">
              <div className="text-5xl font-bold text-white mb-2">{score.toFixed(0)}%</div>
              <div className="text-blue-100">
                {correctCount} out of {quiz.questions.length} correct
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Performance Breakdown</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Correct Answers:</span>
                    <span className="text-green-400 font-semibold">{correctCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wrong Answers:</span>
                    <span className="text-red-400 font-semibold">{quiz.questions.length - correctCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Difficulty Level:</span>
                    <span className="text-blue-400 font-semibold capitalize">{quiz.difficulty}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4 text-left">
                <h3 className="text-white font-semibold mb-2">💡 Feedback</h3>
                <p className="text-gray-300 text-sm">
                  {score >= 80
                    ? "Excellent work! You have a strong understanding of this topic."
                    : score >= 60
                    ? "Good effort! Review the explanations and practice more."
                    : "Keep practicing! Review the material and try again."}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onBack}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                Back to Chat
              </button>
              <button
                onClick={() => {
                  setQuizCompleted(false);
                  setCurrentQuestion(0);
                  setSelectedAnswers({});
                  setScore(0);
                  generateQuiz();
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                Take Another Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz question view
  const question = quiz.questions[currentQuestion];
  const isCorrect = selectedAnswers[currentQuestion] === question.correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{quiz.quizTitle}</h1>
              <p className="text-gray-400 text-sm">Topic: {quiz.topic}</p>
            </div>
            <button
              onClick={onBack}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
            >
              Exit Quiz
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-sm">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </div>
            <div className="flex gap-2">
              {quiz.questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-8 h-2 rounded-full ${
                    index < currentQuestion
                      ? selectedAnswers[index] === quiz.questions[index].correctAnswer
                        ? "bg-green-500"
                        : "bg-red-500"
                      : index === currentQuestion
                      ? "bg-blue-500"
                      : "bg-gray-600"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6">{question.question}</h2>

          <div className="space-y-3 mb-6">
            {Object.entries(question.options).map(([key, value]) => {
              const isSelected = selectedAnswers[currentQuestion] === key;
              const isCorrectAnswer = key === question.correctAnswer;
              
              let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition ";
              
              if (showFeedback) {
                if (isCorrectAnswer) {
                  buttonClass += "border-green-500 bg-green-500/20 text-white";
                } else if (isSelected && !isCorrectAnswer) {
                  buttonClass += "border-red-500 bg-red-500/20 text-white";
                } else {
                  buttonClass += "border-gray-600 bg-gray-700 text-gray-400";
                }
              } else {
                buttonClass += isSelected
                  ? "border-blue-500 bg-blue-500/20 text-white"
                  : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500";
              }

              return (
                <button
                  key={key}
                  onClick={() => handleAnswerSelect(key)}
                  disabled={showFeedback}
                  className={buttonClass}
                >
                  <div className="flex items-center">
                    <span className="font-bold mr-3">{key}.</span>
                    <span>{value}</span>
                    {showFeedback && isCorrectAnswer && (
                      <span className="ml-auto text-green-400">✓ Correct</span>
                    )}
                    {showFeedback && isSelected && !isCorrectAnswer && (
                      <span className="ml-auto text-red-400">✗ Wrong</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback Section */}
          {showFeedback && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                isCorrect ? "bg-green-500/20 border border-green-500" : "bg-red-500/20 border border-red-500"
              }`}
            >
              <div className="flex items-start">
                <div className="text-2xl mr-3">{isCorrect ? "✓" : "✗"}</div>
                <div>
                  <h3 className={`font-semibold mb-2 ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </h3>
                  <p className="text-gray-300 text-sm">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {!showFeedback ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswers[currentQuestion]}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                {currentQuestion < quiz.questions.length - 1 ? "Next Question →" : "Finish Quiz"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
