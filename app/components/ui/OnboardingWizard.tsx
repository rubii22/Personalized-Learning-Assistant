"use client";
import { useState } from "react";

// Define all types explicitly
export type MotivationType = 'career' | 'hobby' | 'exam' | 'curiosity';
export type KnowledgeLevel = 'none' | 'beginner' | 'intermediate' | 'advanced';
export type FormatPreference = 'images' | 'videos' | 'audio' | 'text' | 'interactive' | 'hands-on';
export type SessionLength = '<5min' | '5-15min' | '15-30min' | '30+min';
export type DeviceType = 'mobile' | 'tablet' | 'laptop' | 'desktop';
export type ExampleType = 'real-world' | 'simple' | 'technical' | 'visual';
export type AssessmentType = 'quizzes' | 'quick-checks' | 'projects' | 'none';
export type FeedbackType = 'instant' | 'delayed' | 'both';

export interface CompleteUserProfile {
  // Basic Info
  name: string;
  topic: string;
  
  // Learning Context
  motivation: MotivationType;
  priorKnowledge: KnowledgeLevel;
  confidence: number;
  
  // Preferences
  formatPreferences: FormatPreference[];
  sessionLength: SessionLength;
  studyFrequency: number;
  
  // Device & Accessibility
  device: DeviceType;
  accessibility: string[];
  
  // Content Preferences
  exampleTypes: ExampleType[];
  wantsReferences: boolean;
  
  // Assessment
  assessmentPref: AssessmentType[];
  feedbackPref: FeedbackType;
  
  // Consent
  consent: boolean;
}

interface OnboardingWizardProps {
  onComplete: (profile: CompleteUserProfile) => void;
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<CompleteUserProfile>({
    name: '',
    topic: '',
    motivation: 'curiosity',
    priorKnowledge: 'beginner',
    confidence: 3,
    formatPreferences: ['text', 'images'],
    sessionLength: '15-30min',
    studyFrequency: 3,
    device: 'laptop',
    accessibility: [],
    exampleTypes: ['real-world'],
    wantsReferences: true,
    assessmentPref: ['quizzes'],
    feedbackPref: 'instant',
    consent: false
  });

  const updateProfile = (updates: Partial<CompleteUserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  // Step 1: Basic Info
  if (step === 1) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-700/50">
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-t-3xl p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
                <span className="text-4xl">🎯</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome to MentorMind AI</h1>
              <p className="text-blue-50 text-lg">Let&apos;s personalize your learning journey</p>
            </div>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-400">Step 1 of 6</div>
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '16%' }}></div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  What should I call you? *
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={profile.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  What would you like to learn? *
                </label>
                <select
                  value={profile.topic}
                  onChange={(e) => updateProfile({ topic: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
                >
                  <option value="" disabled>Select a subject</option>
                  <optgroup label="Sciences">
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="General Science">General Science</option>
                  </optgroup>
                  <optgroup label="Mathematics">
                    <option value="Mathematics">Mathematics</option>
                    <option value="Algebra">Algebra</option>
                    <option value="Geometry">Geometry</option>
                    <option value="Calculus">Calculus</option>
                    <option value="Statistics">Statistics</option>
                  </optgroup>
                  <optgroup label="Computer Science">
                    <option value="Programming">Programming</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Cyber Security">Cyber Security</option>
                  </optgroup>
                  <optgroup label="Languages">
                    <option value="English">English</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Arabic">Arabic</option>
                  </optgroup>
                  <optgroup label="Social Studies">
                    <option value="Pakistan Studies">Pakistan Studies</option>
                    <option value="History">History</option>
                    <option value="Geography">Geography</option>
                    <option value="Islamic Studies">Islamic Studies</option>
                    <option value="Civics">Civics</option>
                  </optgroup>
                  <optgroup label="Business & Economics">
                    <option value="Business Studies">Business Studies</option>
                    <option value="Economics">Economics</option>
                    <option value="Accounting">Accounting</option>
                  </optgroup>
                  <optgroup label="Other">
                    <option value="General Knowledge">General Knowledge</option>
                    <option value="Critical Thinking">Critical Thinking</option>
                    <option value="Study Skills">Study Skills</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  Why are you learning this? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['career', 'hobby', 'exam', 'curiosity'] as MotivationType[]).map((motivation) => (
                    <button
                      key={motivation}
                      onClick={() => updateProfile({ motivation })}
                      className={`p-3 rounded-lg border-2 text-left transition ${
                        profile.motivation === motivation
                          ? 'border-blue-500 bg-blue-500/10 text-white'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium capitalize">{motivation}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={nextStep}
                disabled={!profile.name || !profile.topic}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Prior Knowledge
  if (step === 2) {
    const knowledgeLevels: { value: KnowledgeLevel; label: string }[] = [
      { value: 'none', label: 'No, completely new' },
      { value: 'beginner', label: 'A little bit' },
      { value: 'intermediate', label: 'Moderately' },
      { value: 'advanced', label: 'A lot' }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-700/50">
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-t-3xl p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <h1 className="text-2xl font-bold text-white">📚 Your Learning Background</h1>
            </div>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-400">Step 2 of 6</div>
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '33%' }}></div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  Have you studied this topic before? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {knowledgeLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => updateProfile({ priorKnowledge: level.value })}
                      className={`p-4 rounded-lg border-2 text-left transition ${
                        profile.priorKnowledge === level.value
                          ? 'border-blue-500 bg-blue-500/10 text-white'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium">{level.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  How confident are you? <span className="text-blue-400">{profile.confidence}/5</span>
                </label>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={profile.confidence}
                    onChange={(e) => updateProfile({ confidence: Number(e.target.value) })}
                    className="w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Not confident</span>
                    <span>Very confident</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                className="bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-600 transition"
              >
                ← Back
              </button>
              <button
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Learning Preferences
  if (step === 3) {
    const formatOptions: { value: FormatPreference; label: string; emoji: string }[] = [
      { value: 'images', label: 'Images & Diagrams', emoji: '🖼️' },
      { value: 'text', label: 'Text & Notes', emoji: '📝' },
      { value: 'interactive', label: 'Interactive Sims', emoji: '🎮' },
      { value: 'hands-on', label: 'Hands-on Exercises', emoji: '🔧' }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-700/50">
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-t-3xl p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <h1 className="text-2xl font-bold text-white">🎨 Learning Preferences</h1>
            </div>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-400">Step 3 of 6</div>
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  Which formats help you learn best? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {formatOptions.map((format) => (
                    <button
                      key={format.value}
                      onClick={() => {
                        const updated = profile.formatPreferences.includes(format.value)
                          ? profile.formatPreferences.filter(f => f !== format.value)
                          : [...profile.formatPreferences, format.value];
                        updateProfile({ formatPreferences: updated });
                      }}
                      className={`p-3 rounded-lg border-2 text-left transition ${
                        profile.formatPreferences.includes(format.value)
                          ? 'border-green-500 bg-green-500/10 text-white'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium">{format.emoji} {format.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Session Length *
                  </label>
                  <select
                    value={profile.sessionLength}
                    onChange={(e) => updateProfile({ sessionLength: e.target.value as SessionLength })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="<5min">Less than 5 min</option>
                    <option value="5-15min">5-15 minutes</option>
                    <option value="15-30min">15-30 minutes</option>
                    <option value="30+min">30+ minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Study Days/Week *
                  </label>
                  <select
                    value={profile.studyFrequency}
                    onChange={(e) => updateProfile({ studyFrequency: Number(e.target.value) })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    {[1,2,3,4,5,6,7].map(num => (
                      <option key={num} value={num}>{num} day{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                className="bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-600 transition"
              >
                ← Back
              </button>
              <button
                onClick={nextStep}
                disabled={profile.formatPreferences.length === 0}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Device & Examples
  if (step === 4) {
    const exampleOptions: { value: ExampleType; label: string; emoji: string }[] = [
      { value: 'real-world', label: 'Real-world Cases', emoji: '🌍' },
      { value: 'simple', label: 'Simple Examples', emoji: '🔰' },
      { value: 'technical', label: 'Technical/Code', emoji: '💻' },
      { value: 'visual', label: 'Visual/Diagrams', emoji: '📊' }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-700/50">
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-t-3xl p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <h1 className="text-2xl font-bold text-white">📱 Device & Content</h1>
            </div>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-400">Step 4 of 6</div>
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '66%' }}></div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  Which device will you mostly use? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['mobile', 'tablet', 'laptop', 'desktop'] as DeviceType[]).map((device) => (
                    <button
                      key={device}
                      onClick={() => updateProfile({ device })}
                      className={`p-4 rounded-lg border-2 text-left transition ${
                        profile.device === device
                          ? 'border-blue-500 bg-blue-500/10 text-white'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium capitalize">{device}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  Which examples interest you most?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {exampleOptions.map((example) => (
                    <button
                      key={example.value}
                      onClick={() => {
                        const updated = profile.exampleTypes.includes(example.value)
                          ? profile.exampleTypes.filter(e => e !== example.value)
                          : [...profile.exampleTypes, example.value];
                        updateProfile({ exampleTypes: updated });
                      }}
                      className={`p-3 rounded-lg border-2 text-left transition ${
                        profile.exampleTypes.includes(example.value)
                          ? 'border-green-500 bg-green-500/10 text-white'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium">{example.emoji} {example.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="references"
                  checked={profile.wantsReferences}
                  onChange={(e) => updateProfile({ wantsReferences: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="references" className="text-gray-300 text-sm">
                  Include references for further reading
                </label>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                className="bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-600 transition"
              >
                ← Back
              </button>
              <button
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 5: Assessment Preferences
  if (step === 5) {
    const assessmentOptions: { value: AssessmentType; label: string; emoji: string }[] = [
      { value: 'quizzes', label: 'Quizzes', emoji: '📝' },
      { value: 'quick-checks', label: 'Quick Checks', emoji: '⚡' },
      { value: 'projects', label: 'Projects', emoji: '🎯' },
      { value: 'none', label: 'No Assessment', emoji: '🚫' }
    ];

    const feedbackOptions: { value: FeedbackType; label: string; emoji: string }[] = [
      { value: 'instant', label: 'Instant', emoji: '⚡' },
      { value: 'delayed', label: 'Delayed', emoji: '📅' },
      { value: 'both', label: 'Both', emoji: '🔄' }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-700/50">
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-t-3xl p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <h1 className="text-2xl font-bold text-white">🎯 Assessment & Feedback</h1>
            </div>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-400">Step 5 of 6</div>
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '83%' }}></div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  How do you want to be assessed?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {assessmentOptions.map((assessment) => (
                    <button
                      key={assessment.value}
                      onClick={() => {
                        const updated = profile.assessmentPref.includes(assessment.value)
                          ? profile.assessmentPref.filter(a => a !== assessment.value)
                          : [...profile.assessmentPref, assessment.value];
                        updateProfile({ assessmentPref: updated });
                      }}
                      className={`p-3 rounded-lg border-2 text-left transition ${
                        profile.assessmentPref.includes(assessment.value)
                          ? 'border-green-500 bg-green-500/10 text-white'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium">{assessment.emoji} {assessment.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  Feedback Preference *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {feedbackOptions.map((feedback) => (
                    <button
                      key={feedback.value}
                      onClick={() => updateProfile({ feedbackPref: feedback.value })}
                      className={`p-3 rounded-lg border-2 text-center transition ${
                        profile.feedbackPref === feedback.value
                          ? 'border-blue-500 bg-blue-500/10 text-white'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium">{feedback.emoji} {feedback.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                className="bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-600 transition"
              >
                ← Back
              </button>
              <button
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 6: Consent & Completion
  if (step === 6) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-700/50">
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-t-3xl p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <h1 className="text-2xl font-bold text-white">✅ Almost Done!</h1>
            </div>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-400">Step 6 of 6</div>
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                <h3 className="text-white font-semibold mb-4">Your Learning Profile Summary:</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div><strong>Name:</strong> {profile.name}</div>
                  <div><strong>Topic:</strong> {profile.topic}</div>
                  <div><strong>Motivation:</strong> {profile.motivation}</div>
                  <div><strong>Level:</strong> {profile.priorKnowledge} (Confidence: {profile.confidence}/5)</div>
                  <div><strong>Formats:</strong> {profile.formatPreferences.join(', ')}</div>
                  <div><strong>Session:</strong> {profile.sessionLength}, {profile.studyFrequency} days/week</div>
                  <div><strong>Device:</strong> {profile.device}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="consent"
                  checked={profile.consent}
                  onChange={(e) => updateProfile({ consent: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 mt-1"
                />
                <label htmlFor="consent" className="text-gray-300 text-sm">
                  I consent to saving my learning preferences for personalized content. 
                  I understand that my data will be used solely to improve my learning experience.
                </label>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                className="bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-600 transition"
              >
                ← Back
              </button>
              <button
                onClick={() => onComplete(profile)}
                disabled={!profile.consent}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition disabled:opacity-50"
              >
                🚀 Start Learning!
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}