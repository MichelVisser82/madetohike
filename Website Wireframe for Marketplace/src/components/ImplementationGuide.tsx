import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Users, MapPin, Shield, CreditCard, AlertCircle, Save, Code, Rocket, TestTube, TrendingUp } from 'lucide-react';

interface Question {
  id: string;
  title: string;
  description: string;
  question: string;
  context?: string;
  followUp?: string[];
  category: 'development' | 'mvp' | 'testing' | 'launch' | 'operations' | 'growth' | 'monetization' | 'scaling';
  userType: 'technical' | 'business' | 'both';
  priority: 'high' | 'medium' | 'low';
}

const implementationQuestions: Question[] = [
  // Development & Technical Implementation
  {
    id: 'dev-1',
    title: 'A/B Testing Infrastructure for CTA Performance',
    description: 'Implementation of your dual CTA testing strategy',
    question: 'How will you implement A/B testing for your "Find a Guide" vs "Become a Guide" CTA prominence to measure conversion performance as planned?',
    context: 'You decided on dual CTAs with "Find a Guide" more prominent, and planned A/B testing with conversion tracking. You need the technical infrastructure to implement this.',
    followUp: [
      'What A/B testing tools will you integrate (Google Optimize, PostHog, custom solution)?',
      'How will you track the user journey from CTA click to successful registration?',
      'What sample size and testing duration will give you statistical significance?'
    ],
    category: 'development',
    userType: 'technical',
    priority: 'high'
  },
  {
    id: 'dev-2',
    title: 'Role-Specific Registration Flow Implementation',
    description: 'Building your decided multi-step registration system',
    question: 'How will you implement the role selection → multi-step wizard flow (3 steps for hikers, 5 steps for guides) with progress saving?',
    context: 'You decided on role-specific flows from the start with different step counts: Hikers (Basic Info → Preferences → Emergency Contact) vs Guides (Basic Info → Credentials → Banking → Tour Setup → Verification).',
    followUp: [
      'What state management approach will handle the multi-step form data and progress saving?',
      'How will you implement the email reminder system for incomplete registrations?',
      'What URL structure will allow users to resume registration at specific steps?'
    ],
    category: 'development',
    userType: 'technical',
    priority: 'high'
  },
  {
    id: 'dev-3',
    title: 'Responsive Filter Implementation Strategy',
    description: 'Building your left sidebar desktop + mobile collapsible design',
    question: 'How will you implement the responsive transition from left sidebar filters (desktop) to bottom slide-up panel (mobile) with persistent key filters?',
    context: 'You decided on left sidebar for desktop with comprehensive filtering, and mobile collapsible panel with key filters (Region, Dates, Difficulty) always visible, plus removable filter chips.',
    followUp: [
      'What CSS/JavaScript approach will handle the smooth sidebar-to-panel transition?',
      'How will you implement the filter chips with removal functionality?',
      'What caching strategy will maintain filter state during navigation?'
    ],
    category: 'development',
    userType: 'technical',
    priority: 'high'
  },
  {
    id: 'dev-4',
    title: 'Mapbox Integration for Tour Discovery',
    description: 'Implementing your map + list combined view design',
    question: 'How will you implement the Mapbox integration showing tour starting points with cluster markers, expandable route overviews, and side-by-side desktop layout?',
    context: 'You decided on showing tour starting points with cluster markers, expandable route overviews when selected, combined map/list view on desktop, toggle on mobile, using Mapbox with OpenStreetMap trail data.',
    followUp: [
      'What clustering algorithm will handle dense tour marker areas efficiently?',
      'How will you implement the expandable route overlay when tours are selected?',
      'What performance optimizations are needed for loading trail data on map interactions?'
    ],
    category: 'development',
    userType: 'technical',
    priority: 'medium'
  },
  {
    id: 'dev-5',
    title: 'Document Verification System Implementation',
    description: 'Building your third-party + manual review KYC process',
    question: 'How will you implement the document verification workflow: third-party service integration + manual review for guide certifications (ID, certs, insurance, banking)?',
    context: 'You decided on requiring photo ID, mountain guide certification, first aid certificate, insurance coverage, and banking details, with third-party verification + manual review and draft tour creation before full verification.',
    followUp: [
      'What third-party verification service will you integrate (Jumio, Onfido, etc.)?',
      'How will you build the manual review dashboard for your team?',
      'What notification system will handle verification status updates and resubmission requests?'
    ],
    category: 'development',
    userType: 'technical',
    priority: 'medium'
  },

  // MVP Feature Prioritization
  {
    id: 'mvp-1',
    title: 'Stripe Connect Implementation Timeline',
    description: 'Prioritizing your 8% commission payment system',
    question: 'Should you implement the full Stripe Connect payment splitting (8% commission, 2-day guide payouts) in MVP, or start with manual payment coordination?',
    context: 'You decided on Stripe Connect for direct payment splitting with 8% platform commission and guides receiving payouts within 2 business days after tour completion, with instant refunds for >48hr cancellations.',
    followUp: [
      'What manual workarounds can bridge the gap if payment implementation is delayed?',
      'How will you handle the guide onboarding to Stripe Connect during beta?',
      'What testing strategy will validate payment flows before live transactions?'
    ],
    category: 'mvp',
    userType: 'business',
    priority: 'high'
  },
  {
    id: 'mvp-2',
    title: 'Tour Creation Wizard Implementation Priority',
    description: 'Building your 5-step guide tour creation workflow',
    question: 'Should you implement the complete tour creation sequence (Basic Info → Route Details → Pricing & Availability → Equipment & Policies → Review & Publish) in MVP or start with simplified version?',
    context: 'You planned the specific sequence with templates for Day Hikes, Multi-day Treks, Via Ferrata, Beginner Tours, with interactive wizard, tooltips, and save points. Required: Basic Info, Route Details, Pricing.',
    followUp: [
      'Which tour templates should be prioritized for initial launch?',
      'How will you implement the progress saving and resume functionality?',
      'What guided help system will support new guides through their first tour creation?'
    ],
    category: 'mvp',
    userType: 'business',
    priority: 'high'
  },
  {
    id: 'mvp-3',
    title: 'Real-time Features Implementation Scope',
    description: 'Implementing your Supabase real-time decisions',
    question: 'Should you implement all planned real-time features (live chat, booking confirmations, availability updates) in MVP or phase them?',
    context: 'You decided to use Supabase real-time for live chat messages, booking confirmations, and availability updates, with polling for search results (30s cache) and tour browsing (5min cache), plus connection pooling and rate limiting.',
    followUp: [
      'Which real-time features are most critical for initial user experience?',
      'How will you implement graceful degradation when real-time connections fail?',
      'What monitoring will track real-time performance and connection stability?'
    ],
    category: 'mvp',
    userType: 'both',
    priority: 'medium'
  },
  {
    id: 'mvp-4',
    title: 'Multi-language Search Implementation',
    description: 'Building your 4-language search optimization system',
    question: 'Should you implement the full multi-language search support (English, Italian, French, Spanish) in MVP or start with English + one regional language?',
    context: 'You planned language-specific search optimizations for all four languages with <200ms simple search and <500ms complex multi-filter search targets, plus 5-minute caching for popular combinations.',
    followUp: [
      'Which regional language should be prioritized based on your target market?',
      'How will you handle search result ranking across different languages?',
      'What content moderation strategies will work across multiple languages?'
    ],
    category: 'mvp',
    userType: 'both',
    priority: 'medium'
  },

  // Testing & Quality Assurance
  {
    id: 'testing-1',
    title: 'Review System Implementation Testing',
    description: 'Validating your 5-category review system design',
    question: 'How will you test the 5-category review system (Guide Expertise, Safety & Communication, Value, Route Accuracy, Overall Experience) with weighted scoring?',
    context: 'You decided on simplified 5 categories with Guide Expertise + Overall Experience required, others optional, and Overall Experience counting double weight, plus optional photo uploads with incentives.',
    followUp: [
      'What user testing will validate that the category structure captures meaningful feedback?',
      'How will you test the photo upload incentive system effectiveness?',
      'What A/B testing will optimize the review completion rates?'
    ],
    category: 'testing',
    userType: 'both',
    priority: 'high'
  },
  {
    id: 'testing-2',
    title: 'Group Size Pricing Logic Testing',
    description: 'Validating your flexible per-person + group discount system',
    question: 'How will you test the flexible per-person pricing with guide-set group discounts (10% off 4+, 15% off 6+) and 7-day change policy?',
    context: 'You decided on per-person pricing with guide-configurable group discounts, clear pricing tables, seasonal pricing options, and group size changes up to 7 days before tour with automatic recalculation.',
    followUp: [
      'What edge cases need testing for the automatic price recalculation system?',
      'How will you test the seasonal pricing transitions and guide configuration interface?',
      'What user testing will validate the pricing table clarity and understanding?'
    ],
    category: 'testing',
    userType: 'technical',
    priority: 'medium'
  },
  {
    id: 'testing-3',
    title: 'Emergency Contact System Testing',
    description: 'Validating your automatic notification + customization system',
    question: 'How will you test the emergency contact notification system (tour start/end alerts, guide contact info, location, expected return) across international contacts?',
    context: 'You decided on automatic tour start/end notifications with customizable preferences, including tour times, guide contact, location, expected return, with international contact support and time zone appropriate messaging.',
    followUp: [
      'What testing scenarios will validate international time zone handling?',
      'How will you test the notification delivery across different communication channels?',
      'What emergency simulation testing will validate the complete safety communication flow?'
    ],
    category: 'testing',
    userType: 'technical',
    priority: 'medium'
  },

  // Launch Strategy
  {
    id: 'launch-1',
    title: 'User-Controlled Carousel Implementation',
    description: 'Building your 3-region showcase with auto-advance',
    question: 'How will you implement the user-controlled carousel with 8-second auto-advance, desktop 3-column grid, and mobile swipe with snap points?',
    context: 'You decided on user-controlled carousel with auto-advance every 8 seconds, showing all three regions simultaneously on desktop, mobile one at a time with swipe, including hero image, region name, tour count, difficulty range, and best seasons.',
    followUp: [
      'What carousel library or custom implementation will handle the auto-advance + user control interaction?',
      'How will you implement the smooth mobile swipe with snap points?',
      'What performance optimizations will handle the region hero images and dynamic tour count updates?'
    ],
    category: 'launch',
    userType: 'business',
    priority: 'high'
  },
  {
    id: 'launch-2',
    title: 'Calendar Integration Implementation Strategy',
    description: 'Building your dual calendar system with Google sync',
    question: 'How will you implement the built-in calendar + optional Google Calendar sync with conflict warnings and manual overrides?',
    context: 'You decided on both built-in calendar for platform bookings with Google Calendar sync for external schedules, recurring templates, personal time blocking, and conflict warnings with manual override options.',
    followUp: [
      'What Google Calendar API integration approach will handle real-time sync?',
      'How will you implement the conflict detection and warning system?',
      'What user interface will make calendar management intuitive for guides?'
    ],
    category: 'launch',
    userType: 'business',
    priority: 'high'
  },
  {
    id: 'launch-3',
    title: 'Hybrid Communication System Implementation',
    description: 'Building your in-app + email + SMS communication strategy',
    question: 'How will you implement the hybrid communication system: in-app messaging with email for safety messages and SMS backup for emergencies?',
    context: 'You decided on hybrid approach with in-app messaging for convenience, email notifications for important safety messages with read receipts, message templates for common scenarios, and SMS backup for emergency communications.',
    followUp: [
      'What messaging infrastructure will handle the multi-channel approach reliably?',
      'How will you implement the message template system for guides?',
      'What triggers will determine when to escalate from in-app to email to SMS?'
    ],
    category: 'launch',
    userType: 'business',
    priority: 'medium'
  },

  // Operations & Support
  {
    id: 'ops-1',
    title: 'File Sharing System Implementation',
    description: 'Building your in-message document and photo sharing',
    question: 'How will you implement the file sharing system supporting PDFs, images, GPX files with 10MB/file and 50MB/conversation limits?',
    context: 'You decided on direct file sharing in messages for trip documents and photos, supporting PDF, images (JPG/PNG), GPX files with size limits, automatic gallery creation for tours, and group member access.',
    followUp: [
      'What cloud storage solution will handle the file uploads and delivery efficiently?',
      'How will you implement the automatic tour gallery creation and sharing?',
      'What file type validation and virus scanning will protect users?'
    ],
    category: 'operations',
    userType: 'business',
    priority: 'medium'
  },
  {
    id: 'ops-2',
    title: 'Weather API Integration Implementation',
    description: 'Building your multi-source weather data system',
    question: 'How will you implement the weather API integration using OpenWeatherMap + mountain-specific services with 48hr and 24hr automatic alerts?',
    context: 'You decided to provide weather data and automatic season suggestions with optional severe weather warnings, using multiple sources for accuracy, no auto-cancel but automatic alerts 48hr and 24hr before tours.',
    followUp: [
      'What mountain-specific weather services will provide the most accurate data for each region?',
      'How will you implement the alert system with appropriate severity thresholds?',
      'What weather data visualization will help guides make informed decisions?'
    ],
    category: 'operations',
    userType: 'both',
    priority: 'medium'
  },
  {
    id: 'ops-3',
    title: 'Add-ons Inventory Management System',
    description: 'Implementing your equipment rental + meal + transport system',
    question: 'How will you implement the add-ons system with standardized categories, guide inventory management, and automatic availability tracking?',
    context: 'You decided on optional add-ons during booking with standardized categories (equipment, meals, transportation), suggested price ranges, guide inventory management with availability tracking, and automatic notifications for unavailable items.',
    followUp: [
      'What inventory management interface will guides use to track equipment availability?',
      'How will you implement the price range suggestions and validation system?',
      'What notification system will handle add-on availability changes and alternatives?'
    ],
    category: 'operations',
    userType: 'both',
    priority: 'low'
  },

  // Growth & Scaling
  {
    id: 'growth-1',
    title: 'RLS Policy Implementation Strategy',
    description: 'Building your Supabase Row Level Security architecture',
    question: 'How will you implement the RLS policies ensuring guides see only their tours/bookings, hikers see only their bookings, with admin audit logging?',
    context: 'You decided on RLS policies where guides can CRUD their own tours, users see own bookings, messages restricted to participants only, with admin role having elevated permissions and audit logging.',
    followUp: [
      'What RLS policy testing will validate security boundaries are properly enforced?',
      'How will you implement the admin audit logging for compliance and security?',
      'What policy update procedures will handle schema changes safely?'
    ],
    category: 'growth',
    userType: 'business',
    priority: 'low'
  },
  {
    id: 'growth-2',
    title: 'Trust Indicators System Implementation',
    description: 'Building your verification badge and credentials display',
    question: 'How will you implement the trust indicators system with verified guide photos, certifications, and multi-step verification process display?',
    context: 'You decided on trust indicators in dedicated section below hero + key indicators in header, displaying mountain guide certifications, first aid qualifications, insurance coverage, local permits, with verified guide photos and badges.',
    followUp: [
      'What verification badge system will clearly communicate guide credential status?',
      'How will you implement the verification process progress tracking for users?',
      'What visual design will make trust indicators prominent without overwhelming the interface?'
    ],
    category: 'growth',
    userType: 'both',
    priority: 'low'
  },
  {
    id: 'growth-3',
    title: 'Guide Response System Implementation',
    description: 'Building your 300-character public + unlimited private response system',
    question: 'How will you implement the guide response system with 300-character public responses, unlimited private messaging, and community guidelines enforcement?',
    context: 'You decided guides can respond publicly to reviews with 300-character limit, plus private messaging for detailed disputes, one response per review, with community guidelines and reporting system for violations.',
    followUp: [
      'What moderation tools will help enforce the community guidelines for guide responses?',
      'How will you implement the character limit interface with helpful guidance?',
      'What dispute resolution workflow will handle escalated private message conversations?'
    ],
    category: 'growth',
    userType: 'business',
    priority: 'low'
  }
];

interface Answer {
  questionId: string;
  answer: string;
  followUpAnswers?: string[];
}

const STORAGE_KEY = 'madetohike-implementation-answers';
const CURRENT_STATE_KEY = 'madetohike-implementation-state';

export function ImplementationGuide() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpAnswers, setFollowUpAnswers] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [showAnswersView, setShowAnswersView] = useState(false);

  const currentQuestion = implementationQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / implementationQuestions.length) * 100;

  // Load saved data on component mount
  useEffect(() => {
    try {
      const savedAnswers = localStorage.getItem(STORAGE_KEY);
      const savedState = localStorage.getItem(CURRENT_STATE_KEY);
      
      if (savedAnswers) {
        const parsedAnswers = JSON.parse(savedAnswers);
        setAnswers(parsedAnswers);
      }
      
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setCurrentQuestionIndex(parsedState.currentQuestionIndex || 0);
        setCurrentAnswer(parsedState.currentAnswer || '');
        setFollowUpAnswers((parsedState.followUpAnswers || []).map((a: any) => a || ''));
        setIsComplete(parsedState.isComplete || false);
      }
    } catch (error) {
      console.warn('Failed to load saved implementation data:', error);
    }
  }, []);

  // Auto-save function with error handling
  const autoSave = useCallback(async () => {
    try {
      setIsAutoSaving(true);
      
      // Save current answer to answers array
      const currentAnswerData: Answer = {
        questionId: currentQuestion.id,
        answer: currentAnswer || '',
        followUpAnswers: followUpAnswers.filter(a => a && typeof a === 'string' && a.trim() !== '')
      };

      const updatedAnswers = [...answers];
      const existingIndex = updatedAnswers.findIndex(a => a.questionId === currentQuestion.id);
      
      if (existingIndex >= 0) {
        updatedAnswers[existingIndex] = currentAnswerData;
      } else if (currentAnswer && currentAnswer.trim()) {
        updatedAnswers.push(currentAnswerData);
      }

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnswers));
      localStorage.setItem(CURRENT_STATE_KEY, JSON.stringify({
        currentQuestionIndex,
        currentAnswer,
        followUpAnswers,
        isComplete
      }));

      setAnswers(updatedAnswers);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  }, [currentQuestion.id, currentAnswer, followUpAnswers, answers, currentQuestionIndex, isComplete]);

  // Auto-save whenever critical data changes
  useEffect(() => {
    if (currentAnswer && currentAnswer.trim()) {
      const timeoutId = setTimeout(autoSave, 1000); // Debounced auto-save
      return () => clearTimeout(timeoutId);
    }
  }, [currentAnswer, followUpAnswers, autoSave]);

  // Save immediately when changing questions
  useEffect(() => {
    autoSave();
  }, [currentQuestionIndex]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'development': return <Code className="h-4 w-4" />;
      case 'mvp': return <Rocket className="h-4 w-4" />;
      case 'testing': return <TestTube className="h-4 w-4" />;
      case 'launch': return <TrendingUp className="h-4 w-4" />;
      case 'operations': return <Shield className="h-4 w-4" />;
      case 'growth': return <TrendingUp className="h-4 w-4" />;
      case 'monetization': return <CreditCard className="h-4 w-4" />;
      case 'scaling': return <Users className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  const getUserTypeBadge = (userType: string) => {
    if (userType === 'technical') return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Technical</Badge>;
    if (userType === 'business') return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Business</Badge>;
    return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Both</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'high') return <Badge variant="destructive" className="text-xs">High Priority</Badge>;
    if (priority === 'medium') return <Badge variant="default" className="text-xs">Medium Priority</Badge>;
    return <Badge variant="secondary" className="text-xs">Low Priority</Badge>;
  };

  const saveAnswer = () => {
    try {
      const newAnswer: Answer = {
        questionId: currentQuestion.id,
        answer: currentAnswer || '',
        followUpAnswers: followUpAnswers.filter(a => a && typeof a === 'string' && a.trim() !== '')
      };

      setAnswers(prev => {
        const existing = prev.findIndex(a => a.questionId === currentQuestion.id);
        let updated;
        if (existing >= 0) {
          updated = [...prev];
          updated[existing] = newAnswer;
        } else {
          updated = [...prev, newAnswer];
        }
        
        // Immediately save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save answer:', error);
      setErrorMessage('Failed to save your answer. Please try again.');
    }
  };

  const nextQuestion = async () => {
    setErrorMessage('');
    
    try {
      // Validate answer
      if (!currentAnswer || currentAnswer.trim().length < 5) {
        setErrorMessage('Please provide a meaningful answer (at least 5 characters) before continuing.');
        return;
      }

      // Always save before navigating
      saveAnswer();
      await autoSave();
      
      if (currentQuestionIndex < implementationQuestions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setShowFollowUp(false);
        
        // Load existing answer if available
        const existingAnswer = answers.find(a => a.questionId === implementationQuestions[nextIndex].id);
        if (existingAnswer) {
          setCurrentAnswer(existingAnswer.answer || '');
          setFollowUpAnswers((existingAnswer.followUpAnswers || []).map(a => a || ''));
        } else {
          setCurrentAnswer('');
          setFollowUpAnswers([]);
        }
      } else {
        setIsComplete(true);
        // Save completion state
        localStorage.setItem(CURRENT_STATE_KEY, JSON.stringify({
          currentQuestionIndex,
          currentAnswer,
          followUpAnswers,
          isComplete: true
        }));
      }
    } catch (error) {
      console.error('Error navigating to next question:', error);
      setErrorMessage('Something went wrong. Your answer has been saved, please try again.');
    }
  };

  const previousQuestion = async () => {
    setErrorMessage('');
    
    try {
      if (currentQuestionIndex > 0) {
        // Always save before navigating
        saveAnswer();
        await autoSave();
        
        const prevIndex = currentQuestionIndex - 1;
        setCurrentQuestionIndex(prevIndex);
        setShowFollowUp(false);
        
        // Load previous answer
        const prevAnswer = answers.find(a => a.questionId === implementationQuestions[prevIndex].id);
        if (prevAnswer) {
          setCurrentAnswer(prevAnswer.answer || '');
          setFollowUpAnswers((prevAnswer.followUpAnswers || []).map(a => a || ''));
        } else {
          setCurrentAnswer('');
          setFollowUpAnswers([]);
        }
      }
    } catch (error) {
      console.error('Error navigating to previous question:', error);
      setErrorMessage('Something went wrong. Your answer has been saved, please try again.');
    }
  };

  const jumpToQuestion = async (index: number) => {
    setErrorMessage('');
    
    try {
      // Always save before jumping
      saveAnswer();
      await autoSave();
      
      setCurrentQuestionIndex(index);
      setShowFollowUp(false);
      
      // Load answer for jumped-to question
      const jumpAnswer = answers.find(a => a.questionId === implementationQuestions[index].id);
      if (jumpAnswer) {
        setCurrentAnswer(jumpAnswer.answer || '');
        setFollowUpAnswers((jumpAnswer.followUpAnswers || []).map(a => a || ''));
      } else {
        setCurrentAnswer('');
        setFollowUpAnswers([]);
      }
    } catch (error) {
      console.error('Error jumping to question:', error);
      setErrorMessage('Something went wrong. Your answer has been saved, please try again.');
    }
  };

  const exportAnswers = async () => {
    try {
      // Make sure current answer is saved
      saveAnswer();
      await autoSave();
      
      // Get latest answers from localStorage to ensure we have everything
      const savedAnswers = localStorage.getItem(STORAGE_KEY);
      const latestAnswers = savedAnswers ? JSON.parse(savedAnswers) : answers;
      
      const exportData = {
        projectName: 'MadeToHike.com',
        phase: 'Implementation Planning',
        exportDate: new Date().toISOString(),
        totalQuestions: implementationQuestions.length,
        answeredQuestions: latestAnswers.filter((a: Answer) => a.answer && a.answer.trim()).length,
        decisions: implementationQuestions.map(q => {
          const answer = latestAnswers.find((a: Answer) => a.questionId === q.id);
          return {
            questionNumber: implementationQuestions.indexOf(q) + 1,
            category: q.category,
            userType: q.userType,
            priority: q.priority,
            title: q.title,
            question: q.question,
            decision: answer?.answer || '',
            followUpAnswers: answer?.followUpAnswers || [],
            hasAnswer: !!answer?.answer
          };
        })
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `madetohike-implementation-decisions-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      setErrorMessage('Export failed. Please try again.');
    }
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all your implementation answers? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CURRENT_STATE_KEY);
      setAnswers([]);
      setCurrentAnswer('');
      setFollowUpAnswers([]);
      setCurrentQuestionIndex(0);
      setIsComplete(false);
      setLastSaved(null);
    }
  };

  // Completion view
  if (isComplete) {
    const answeredCount = answers.filter(a => a.answer && a.answer.trim()).length;
    
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-green-700">
            🚀 Implementation Planning Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>You've answered {answeredCount} out of {implementationQuestions.length} implementation questions for your MadeToHike platform.</p>
          <p>Your responses provide a comprehensive roadmap for building and launching your marketplace.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button onClick={exportAnswers}>
              Export Implementation Plan
            </Button>
            <Button variant="outline" onClick={() => {
              setIsComplete(false);
              setCurrentQuestionIndex(0);
            }}>
              Review & Edit Answers
            </Button>
            <Button variant="destructive" onClick={clearAllData}>
              Clear All Data
            </Button>
          </div>
          {lastSaved && (
            <p className="text-xs text-muted-foreground">
              Last saved: {lastSaved.toLocaleTimeString()}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  // Main question interface
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                {getCategoryIcon(currentQuestion.category)}
                Implementation Planning
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Question {currentQuestionIndex + 1} of {implementationQuestions.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getPriorityBadge(currentQuestion.priority)}
              {getUserTypeBadge(currentQuestion.userType)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {currentQuestion.category}
            </Badge>
            {currentQuestion.title}
          </CardTitle>
          <p className="text-muted-foreground">{currentQuestion.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="">{currentQuestion.question}</p>
          </div>
          
          {currentQuestion.context && (
            <div className="bg-gray-50 p-3 rounded text-sm">
              <strong>Context:</strong> {currentQuestion.context}
            </div>
          )}

          <div className="space-y-2">
            <label className="block">Your Implementation Decision:</label>
            <Textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Describe your implementation approach and rationale..."
              className="min-h-[100px]"
            />
          </div>

          {currentQuestion.followUp && currentQuestion.followUp.length > 0 && (
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => setShowFollowUp(!showFollowUp)}
                className="w-full"
              >
                {showFollowUp ? 'Hide' : 'Show'} Follow-up Questions ({currentQuestion.followUp.length})
              </Button>
              
              {showFollowUp && (
                <div className="space-y-3 bg-amber-50 p-4 rounded-lg">
                  {currentQuestion.followUp.map((followUp, index) => (
                    <div key={index} className="space-y-2">
                      <p className="text-sm">{followUp}</p>
                      <Textarea
                        value={followUpAnswers[index] || ''}
                        onChange={(e) => {
                          const newFollowUpAnswers = [...followUpAnswers];
                          newFollowUpAnswers[index] = e.target.value;
                          setFollowUpAnswers(newFollowUpAnswers);
                        }}
                        placeholder="Your response..."
                        className="text-sm"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded">
              <AlertCircle className="h-4 w-4" />
              {errorMessage}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {isAutoSaving && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Save className="h-3 w-3 animate-spin" />
                  Saving...
                </div>
              )}
              {lastSaved && (
                <span className="text-xs text-muted-foreground">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>

            <Button
              onClick={nextQuestion}
              className="flex items-center gap-2"
            >
              {currentQuestionIndex === implementationQuestions.length - 1 ? 'Complete' : 'Next'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress indicators */}
          <div className="mt-4 pt-4 border-t">
            <div className="text-center text-sm text-muted-foreground mb-2">
              Progress: {answers.filter(a => a.answer && a.answer.trim()).length} / {implementationQuestions.length} questions answered
            </div>
            <div className="flex gap-1 justify-center flex-wrap">
              <Button size="sm" variant="outline" onClick={exportAnswers}>
                Export Progress
              </Button>
              <Button size="sm" variant="outline" onClick={clearAllData}>
                Clear All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}