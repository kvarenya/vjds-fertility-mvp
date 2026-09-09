import React, { useState } from 'react';
import { Menu, X, ArrowRight, ChevronRight, Edit2, CheckCircle } from 'lucide-react';
import { submitIntake, fetchProfile } from './api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // home, intake, profile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Backend state
  const [sessionId, setSessionId] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Intake form state
  const [intakeStep, setIntakeStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState({
    fertility: null,
    location: null,
    budget: null,
    timeline: null,
    flexibility: null,
    documentation: null,
    support: null
  });

  const intakeQuestions = [
    {
      id: 'fertility',
      title: 'What brings you here today?',
      options: [
        { value: 'exploring', label: 'Exploring fertility options' },
        { value: 'ivf', label: 'Interested in IVF' },
        { value: 'donor', label: 'Considering donor options' },
        { value: 'surrogacy', label: 'Exploring surrogacy' },
        { value: 'compare', label: 'Comparing countries & costs' },
        { value: 'unsure', label: 'Not sure yet' }
      ]
    },
    {
      id: 'location',
      title: 'Where are you located?',
      options: [
        { value: 'us', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'eu', label: 'Europe' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      id: 'budget',
      title: 'What is your budget range?',
      options: [
        { value: 'under25', label: 'Under $25,000' },
        { value: '25-50', label: '$25,000 - $50,000' },
        { value: '50-100', label: '$50,000 - $100,000' },
        { value: 'over100', label: 'Over $100,000' },
        { value: 'flexible', label: 'Flexible' }
      ]
    },
    {
      id: 'timeline',
      title: 'What is your timeline?',
      options: [
        { value: 'urgent', label: 'ASAP (within 3 months)' },
        { value: 'soon', label: 'Soon (3-6 months)' },
        { value: 'flexible', label: 'Flexible (6-12 months)' },
        { value: 'exploring', label: 'Just exploring' }
      ]
    },
    {
      id: 'flexibility',
      title: 'How flexible are you with travel?',
      options: [
        { value: 'local', label: 'Local only' },
        { value: 'domestic', label: 'Domestic travel' },
        { value: 'international', label: 'International travel' },
        { value: 'very', label: 'Very flexible' }
      ]
    },
    {
      id: 'documentation',
      title: 'What documentation do you have?',
      options: [
        { value: 'fertility-records', label: 'Fertility records' },
        { value: 'medical-history', label: 'Medical history' },
        { value: 'none', label: 'Still gathering' }
      ]
    },
    {
      id: 'support',
      title: 'What kind of support do you need?',
      options: [
        { value: 'emotional', label: 'Emotional support' },
        { value: 'medical', label: 'Medical guidance' },
        { value: 'logistical', label: 'Logistical planning' },
        { value: 'all', label: 'All of the above' }
      ]
    }
  ];

  const handleAnswerSelect = (questionId, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNextStep = async () => {
    if (intakeStep < intakeQuestions.length - 1) {
      setIntakeStep(intakeStep + 1);
      return;
    }

    // Last step: send answers to the backend, then load the generated profile.
    setIsSubmitting(true);
    setApiError(null);

    try {
      const { sessionId: newSessionId } = await submitIntake(userAnswers);
      setSessionId(newSessionId);

      const profile = await fetchProfile(newSessionId);
      setProfileData(profile);

      setCurrentPage('profile');
      setIntakeStep(0);
    } catch (err) {
      console.error(err);
      // Fall back to showing local answers so the flow still works
      // if the backend is unreachable.
      setApiError('Could not reach the server. Showing your answers locally.');
      setCurrentPage('profile');
      setIntakeStep(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevStep = () => {
    if (intakeStep > 0) {
      setIntakeStep(intakeStep - 1);
    }
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    if (page === 'intake') {
      setIntakeStep(0);
    }
  };

  // Navigation Component
  const Navigation = () => (
    <nav className="sticky top-0 z-50" style={{ backgroundColor: '#f5f3f0' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => navigateTo('home')}
            className="flex-shrink-0 cursor-pointer"
          >
            <span className="text-2xl font-bold" style={{ color: '#a64d79' }}>
              Pathway
            </span>
          </button>

          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => navigateTo('home')}
              className="text-gray-700 hover:text-gray-900 transition"
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('intake')}
              className="text-gray-700 hover:text-gray-900 transition"
            >
              Guided Intake
            </button>
            <button
              onClick={() => navigateTo('profile')}
              className="text-gray-700 hover:text-gray-900 transition"
            >
              My Profile
            </button>
          </div>

          <div className="hidden md:block">
            <button
              onClick={() => navigateTo('intake')}
              className="px-6 py-2 text-white font-medium rounded-full transition hover:shadow-lg"
              style={{ backgroundColor: '#a64d79' }}
            >
              Get Started
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <button
              onClick={() => navigateTo('home')}
              className="block w-full text-left text-gray-700 hover:text-gray-900 py-2"
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('intake')}
              className="block w-full text-left text-gray-700 hover:text-gray-900 py-2"
            >
              Guided Intake
            </button>
            <button
              onClick={() => navigateTo('profile')}
              className="block w-full text-left text-gray-700 hover:text-gray-900 py-2"
            >
              My Profile
            </button>
            <button
              onClick={() => navigateTo('intake')}
              className="w-full px-6 py-2 text-white font-medium rounded-full transition mt-4"
              style={{ backgroundColor: '#a64d79' }}
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </nav>
  );

  // Home Page
  const HomePage = () => (
    <div style={{ backgroundColor: '#f5f3f0' }}>
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full" style={{ backgroundColor: '#f3e5e7' }}>
            <span className="text-sm font-medium" style={{ color: '#a64d79' }}>
              ✓ AI-powered personalized pathways
            </span>
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
            style={{ color: '#4a2c42' }}
          >
            Find the fertility pathway that fits your situation.
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Every fertility journey is unique. Explore in your own time, discover what works for you, and connect with experts when you're ready.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigateTo('intake')}
              className="px-8 py-3 text-white font-semibold rounded-full transition hover:shadow-lg"
              style={{ backgroundColor: '#a64d79' }}
            >
              Start My Pathway
            </button>
            <button
              className="px-8 py-3 font-semibold rounded-full transition border-2"
              style={{
                borderColor: '#a64d79',
                color: '#a64d79',
                backgroundColor: 'transparent'
              }}
            >
              See How It Works
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span style={{ color: '#a64d79' }}>✓</span> Evidence-based
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: '#a64d79' }}>✓</span> Private & secure
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: '#a64d79' }}>✓</span> No pressure
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#e8dfe5' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: '#4a2c42' }}
            >
              Designed for you
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Explore Fertility Options', desc: 'Learn about different fertility pathways available to you with personalized guidance.' },
              { title: 'AI-Powered Insights', desc: 'Get evidence-based recommendations tailored to your unique situation and goals.' },
              { title: 'Expert Support', desc: 'Access professional consultation and connect with fertility specialists when you need them.' }
            ].map((f, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl transition hover:shadow-lg"
                style={{ backgroundColor: '#ffffff' }}
              >
                <h3 className="text-xl font-semibold mb-3" style={{ color: '#4a2c42' }}>
                  {f.title}
                </h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: '#4a2c42' }}
            >
              How it works
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Answer Questions', desc: 'Share your fertility goals' },
              { num: '02', title: 'Get Analysis', desc: 'Our AI analyzes your pathways' },
              { num: '03', title: 'See Options', desc: 'Review recommendations' },
              { num: '04', title: 'Connect', desc: 'Meet with specialists' }
            ].map((s, i) => (
              <div key={i} className="relative">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl mb-4 mx-auto"
                  style={{ backgroundColor: '#f3e5e7', color: '#a64d79' }}
                >
                  {s.num}
                </div>
                <h3 className="text-lg font-semibold text-center mb-2" style={{ color: '#4a2c42' }}>
                  {s.title}
                </h3>
                <p className="text-gray-600 text-center text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  // Guided Intake Page
  const IntakePage = () => {
    const currentQuestion = intakeQuestions[intakeStep];
    const progress = ((intakeStep + 1) / intakeQuestions.length) * 100;
    const isAnswered = userAnswers[currentQuestion.id] !== null;

    return (
      <div style={{ backgroundColor: '#f5f3f0', minHeight: 'calc(100vh - 64px)' }}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-3">
              <h3 style={{ color: '#4a2c42' }} className="font-semibold">
                Step {intakeStep + 1} of {intakeQuestions.length}
              </h3>
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#e0d5da' }}>
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: `${progress}%`, backgroundColor: '#a64d79' }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div
            className="p-8 rounded-2xl mb-8"
            style={{ backgroundColor: '#ffffff' }}
          >
            <h2
              className="text-3xl font-bold mb-8"
              style={{ color: '#4a2c42' }}
            >
              {currentQuestion.title}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswerSelect(currentQuestion.id, option.value)}
                  className={`w-full p-4 rounded-xl text-left font-medium transition border-2 ${
                    userAnswers[currentQuestion.id] === option.value
                      ? 'border-opacity-100'
                      : 'border-opacity-0'
                  }`}
                  style={{
                    borderColor: '#a64d79',
                    backgroundColor:
                      userAnswers[currentQuestion.id] === option.value
                        ? '#f3e5e7'
                        : '#f9f7f6',
                    color: '#4a2c42'
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-between">
            <button
              onClick={handlePrevStep}
              disabled={intakeStep === 0}
              className="px-6 py-3 font-semibold rounded-full transition border-2 disabled:opacity-50"
              style={{
                borderColor: '#a64d79',
                color: '#a64d79',
                backgroundColor: 'transparent'
              }}
            >
              Back
            </button>

            <button
              onClick={handleNextStep}
              disabled={!isAnswered || isSubmitting}
              className="px-8 py-3 text-white font-semibold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              style={{ backgroundColor: '#a64d79' }}
            >
              {isSubmitting
                ? 'Saving...'
                : intakeStep === intakeQuestions.length - 1
                  ? 'See My Profile'
                  : 'Next'}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Case Profile Page
  const ProfilePage = () => {
    // Use the labels the backend returned when available; otherwise fall
    // back to looking them up locally so the page still renders offline.
    const getAnswerLabel = (questionId) => {
      if (profileData?.labels?.[questionId]) {
        return profileData.labels[questionId];
      }
      const value = userAnswers[questionId];
      const question = intakeQuestions.find(q => q.id === questionId);
      if (!question) return 'Not answered';
      const option = question.options.find(o => o.value === value);
      return option ? option.label : 'Not answered';
    };

    return (
      <div style={{ backgroundColor: '#f5f3f0', minHeight: 'calc(100vh - 64px)' }}>
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: '#4a2c42' }}
            >
              Your Fertility Profile
            </h1>
            <p className="text-gray-600">
              Based on your answers, here's your personalized profile
            </p>
            {apiError && (
              <div
                className="mt-4 p-3 rounded-lg text-sm"
                style={{ backgroundColor: '#fdf0f0', color: '#8a3d3d' }}
              >
                {apiError}
              </div>
            )}
          </div>

          {/* Main Profile Card */}
          <div
            className="p-8 rounded-2xl mb-8"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="flex justify-between items-start mb-6">
              <h2
                className="text-2xl font-bold"
                style={{ color: '#4a2c42' }}
              >
                Your Journey Overview
              </h2>
              <button
                className="p-2 rounded-lg transition"
                style={{ backgroundColor: '#f3e5e7', color: '#a64d79' }}
              >
                <Edit2 size={20} />
              </button>
            </div>

            {/* Profile Info Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                { label: 'Primary Goal', key: 'fertility' },
                { label: 'Location', key: 'location' },
                { label: 'Budget Range', key: 'budget' },
                { label: 'Timeline', key: 'timeline' },
                { label: 'Travel Flexibility', key: 'flexibility' },
                { label: 'Support Needed', key: 'support' }
              ].map((item) => (
                <div
                  key={item.key}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: '#f9f7f6' }}
                >
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    {item.label}
                  </p>
                  <p
                    className="font-semibold"
                    style={{ color: '#4a2c42' }}
                  >
                    {getAnswerLabel(item.key)}
                  </p>
                </div>
              ))}
            </div>

            <hr style={{ borderColor: '#e0d5da' }} className="my-8" />

            {/* AI Explanation */}
            <div className="mb-8">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: '#4a2c42' }}
              >
                AI Analysis
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {profileData?.aiOverview ||
                  "Based on your responses, we've identified several fertility pathways that align with your goals, timeline, and budget. Our AI analysis considers your location, flexibility for travel, and support preferences to create a personalized roadmap. This profile will help connect you with relevant resources and specialists who can guide you through the next steps."}
              </p>
            </div>

            {/* Professional Review Notice */}
            <div
              className="p-4 rounded-lg border-l-4"
              style={{
                backgroundColor: '#f9f7f6',
                borderColor: '#a64d79'
              }}
            >
              <div className="flex gap-3">
                <CheckCircle size={20} style={{ color: '#a64d79', flexShrink: 0 }} />
                <div>
                  <p className="font-semibold mb-1" style={{ color: '#4a2c42' }}>
                    Professional Review
                  </p>
                  <p className="text-sm text-gray-600">
                    A fertility specialist will review your profile and provide personalized recommendations within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="px-8 py-3 text-white font-semibold rounded-full transition hover:shadow-lg flex-1"
              style={{ backgroundColor: '#a64d79' }}
            >
              View My Pathway Recommendations
            </button>
            <button
              onClick={() => navigateTo('intake')}
              className="px-8 py-3 font-semibold rounded-full transition border-2"
              style={{
                borderColor: '#a64d79',
                color: '#a64d79',
                backgroundColor: 'transparent'
              }}
            >
              Update My Profile
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f3f0' }}>
      <Navigation />
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'intake' && <IntakePage />}
      {currentPage === 'profile' && <ProfilePage />}

      {/* Footer - only on home page for now */}
      {currentPage === 'home' && (
        <footer
          className="py-8 px-4 sm:px-6 lg:px-8 border-t"
          style={{ borderColor: '#e0d5da' }}
        >
          <div className="max-w-6xl mx-auto text-center text-gray-600 text-sm">
            <p>&copy; 2026 Pathway. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
}
