import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Users, MapPin, Shield, CreditCard, AlertCircle, Save } from 'lucide-react';

interface Question {
  id: string;
  title: string;
  description: string;
  question: string;
  context?: string;
  followUp?: string[];
  category: 'landing' | 'registration' | 'search' | 'tours' | 'booking' | 'communication' | 'reviews' | 'backend';
  userType: 'guide' | 'hiker' | 'both';
}

const questions: Question[] = [
  // Landing Page Implementation Questions
  {
    id: 'landing-1',
    title: 'Hero Section CTA Priority',
    description: 'Primary call-to-action hierarchy',
    question: 'What should be the primary CTA in your hero section: "Find a Guide", "Become a Guide", or dual CTAs side-by-side?',
    context: 'Based on your wireframe showing dual value props, you need to decide the visual hierarchy of your main calls-to-action.',
    followUp: [
      'Should the "Find a Guide" CTA be more prominent to drive demand first?',
      'How will you measure which CTA performs better?',
      'What secondary messaging supports each CTA?'
    ],
    category: 'landing',
    userType: 'both'
  },
  {
    id: 'landing-2',
    title: 'Featured Regions Carousel Design',
    description: 'How to implement the regions showcase',
    question: 'For your Dolomites/Pyrenees/Scotland carousel, should it auto-rotate, be user-controlled, or show all three simultaneously on desktop?',
    context: 'Your wireframe mentions a featured regions carousel. The implementation affects user engagement and geographic awareness.',
    followUp: [
      'What key information should each region card show?',
      'Should clicking a region filter tours immediately?',
      'How will you handle mobile vs desktop layouts?'
    ],
    category: 'landing',
    userType: 'both'
  },
  {
    id: 'landing-3',
    title: 'Trust Indicators Placement',
    description: 'Where to display credibility signals',
    question: 'Should trust indicators (verified guides, safety protocols, secure payments) be in the header, hero section, or dedicated trust section?',
    context: 'Your wireframe emphasizes trust signals. Placement affects first impression and conversion rates.',
    followUp: [
      'What specific certifications will you display (insurance, first aid, local permits)?',
      'Should you show real guide photos and credentials on homepage?',
      'How will you communicate your safety verification process?'
    ],
    category: 'landing',
    userType: 'both'
  },
  
  // Registration & Onboarding Implementation
  {
    id: 'registration-1',
    title: 'Multi-Step Form Design',
    description: 'Registration flow structure',
    question: 'Should your registration be a single long form, multi-step wizard, or role-specific flows from the start?',
    context: 'Your wireframe shows multi-step forms with progress indicators. Need to decide the specific flow structure.',
    followUp: [
      'How many steps for guide registration vs hiker registration?',
      'Should users be able to save progress and return later?',
      'What happens if users abandon mid-registration?'
    ],
    category: 'registration',
    userType: 'both'
  },
  {
    id: 'registration-2',
    title: 'Guide KYC Implementation',
    description: 'Know Your Customer requirements for guides',
    question: 'What specific documents will you require from guides: photo ID, insurance certificate, hiking certifications, or banking details?',
    context: 'Your wireframe mentions KYC requirements for guides handling payments. This affects legal compliance and onboarding friction.',
    followUp: [
      'How will you verify document authenticity?',
      'What happens if verification fails?',
      'Should guides be able to create tours before full verification?'
    ],
    category: 'registration',
    userType: 'guide'
  },
  {
    id: 'registration-3',
    title: 'Social Login Strategy',
    description: 'Third-party authentication integration',
    question: 'Which social login options should you offer: Google, Apple, Facebook, or email-only registration?',
    context: 'Your wireframe mentions social login integration. Choice affects user convenience and data collection.',
    followUp: [
      'Should social login skip any verification steps?',
      'How will you handle users who later want to disconnect social accounts?',
      'What additional profile data do you need beyond social login?'
    ],
    category: 'registration',
    userType: 'both'
  },

  // Search & Discovery Implementation
  {
    id: 'search-1',
    title: 'Filter Sidebar vs Top Bar',
    description: 'Search interface layout design',
    question: 'Should your key filters (Region, Dates, Difficulty, Group Size, Price) be in a left sidebar, top horizontal bar, or collapsible panel?',
    context: 'Your wireframe lists specific key filters. The layout affects usability on mobile and desktop.',
    followUp: [
      'How will filters work on mobile devices?',
      'Should you show active filters as removable chips?',
      'What\'s the default sort order for search results?'
    ],
    category: 'search',
    userType: 'hiker'
  },
  {
    id: 'search-2',
    title: 'Map Integration Implementation',
    description: 'Visual tour discovery interface',
    question: 'Should your map integration show tour starting points, entire routes, or just general regions?',
    context: 'Your wireframe mentions map integration for visual discovery. Implementation affects performance and user experience.',
    followUp: [
      'Should map and list views be separate or combined?',
      'How will you handle tours with multiple meeting points?',
      'What map data will you need to license?'
    ],
    category: 'search',
    userType: 'hiker'
  },
  {
    id: 'search-3',
    title: 'Difficulty Rating System',
    description: 'Standardized difficulty communication',
    question: 'Should you use a 1-5 scale, beginner/intermediate/advanced, or region-specific scales (like Via Ferrata grades for Dolomites)?',
    context: 'Your focus on three different regions means different hiking cultures and difficulty standards.',
    followUp: [
      'How will you handle trails that cross difficulty levels?',
      'Should guides self-assess or do you verify difficulty ratings?',
      'What additional info supports difficulty ratings (elevation gain, technical skills)?'
    ],
    category: 'search',
    userType: 'hiker'
  },

  // Tour Management Dashboard Implementation
  {
    id: 'tours-1',
    title: 'Tour Creation Steps',
    description: 'Specific workflow implementation',
    question: 'Should your tour creation follow: Basic Info → Route Details → Pricing → Availability → Equipment → Policies, or a different sequence?',
    context: 'Your wireframe shows a specific workflow. Need to decide the optimal step sequence for guide success.',
    followUp: [
      'Which steps should be required vs optional for initial publication?',
      'How will you guide new tour creators through the process?',
      'Should there be tour templates for common hike types?'
    ],
    category: 'tours',
    userType: 'guide'
  },
  {
    id: 'tours-2',
    title: 'Calendar Integration Choice',
    description: 'Availability management system',
    question: 'Should guides manage availability through your built-in calendar, integrate with Google Calendar, or support both?',
    context: 'Your wireframe mentions calendar integration. Implementation affects guide workflow and booking reliability.',
    followUp: [
      'How will you handle recurring tour schedules?',
      'Should guides be able to block out personal time?',
      'What happens when external calendar conflicts with platform bookings?'
    ],
    category: 'tours',
    userType: 'guide'
  },
  {
    id: 'tours-3',
    title: 'Weather API Integration',
    description: 'Seasonal planning implementation',
    question: 'Should weather integration automatically suggest optimal seasons, warn about conditions, or just provide guides with weather data?',
    context: 'Your wireframe mentions weather API integration for seasonal planning across three distinct mountain regions.',
    followUp: [
      'Which weather service provides best data for your regions?',
      'Should tours auto-cancel for severe weather conditions?',
      'How will weather warnings be communicated to booked hikers?'
    ],
    category: 'tours',
    userType: 'guide'
  },

  // Booking & Payment Flow Implementation
  {
    id: 'booking-1',
    title: 'Stripe Integration Architecture',
    description: 'Payment processing implementation',
    question: 'Should you use Stripe Connect to split payments between platform and guides, or collect then distribute payments?',
    context: 'Your wireframe shows Stripe integration and escrow system. Implementation affects cash flow and compliance.',
    followUp: [
      'What percentage commission will you charge guides?',
      'How will you handle refunds and cancellations?',
      'Should guides receive instant payouts or scheduled payments?'
    ],
    category: 'booking',
    userType: 'both'
  },
  {
    id: 'booking-2',
    title: 'Dynamic Pricing Implementation',
    description: 'Group size pricing structure',
    question: 'Should pricing decrease per person as group size increases, or have fixed per-person rates regardless of group size?',
    context: 'Your wireframe mentions dynamic pricing based on group size. This affects guide economics and hiker expectations.',
    followUp: [
      'How will you display pricing options clearly to hikers?',
      'Should guides set different pricing for peak vs off-season?',
      'What happens if group size changes after booking?'
    ],
    category: 'booking',
    userType: 'both'
  },
  {
    id: 'booking-3',
    title: 'Add-ons and Equipment Pricing',
    description: 'Additional services structure',
    question: 'Should equipment rental, meals, and transport be optional add-ons during booking, or bundled into tour packages?',
    context: 'Your wireframe shows add-ons in the payment flow. Implementation affects pricing transparency and booking complexity.',
    followUp: [
      'How will you standardize equipment pricing across guides?',
      'Should guides manage their own equipment inventory?',
      'What happens if add-ons are unavailable close to tour date?'
    ],
    category: 'booking',
    userType: 'both'
  },

  // Communication System Implementation
  {
    id: 'communication-1',
    title: 'In-App Messaging vs Email',
    description: 'Communication channel strategy',
    question: 'Should pre-trip communication happen primarily in-app with push notifications, via email, or hybrid approach?',
    context: 'Your wireframe shows in-app messaging with push notifications. Need to decide primary communication strategy.',
    followUp: [
      'How will you ensure hikers see important safety messages?',
      'Should you provide guides with message templates for common communications?',
      'What happens if users have poor mobile coverage?'
    ],
    category: 'communication',
    userType: 'both'
  },
  {
    id: 'communication-2',
    title: 'File Sharing Implementation',
    description: 'Document and photo sharing',
    question: 'Should the platform support sharing trip documents, route maps, and photos directly in messages, or via external links?',
    context: 'Your wireframe mentions file sharing for trip documents. Implementation affects user experience and storage costs.',
    followUp: [
      'What file types and size limits will you support?',
      'How will you handle photo sharing during and after tours?',
      'Should shared files be accessible to all group members?'
    ],
    category: 'communication',
    userType: 'both'
  },
  {
    id: 'communication-3',
    title: 'Emergency Contact Integration',
    description: 'Safety communication features',
    question: 'Should emergency contacts be automatically notified when tours start/end, or only alerted if something goes wrong?',
    context: 'Your wireframe emphasizes emergency contact integration. Implementation affects safety perception and user experience.',
    followUp: [
      'What information should emergency contacts receive by default?',
      'How will you handle international emergency contacts?',
      'Should the platform integrate with local mountain rescue services?'
    ],
    category: 'communication',
    userType: 'both'
  },

  // Review System Implementation
  {
    id: 'reviews-1',
    title: 'Review Categories Structure',
    description: 'Specific rating criteria implementation',
    question: 'Should you use the 7 categories from your wireframe (Guide expertise, Safety, Communication, Value, Route accuracy, Equipment, Overall), or simplify to fewer categories?',
    context: 'Your wireframe specifies detailed review categories. Need to balance comprehensiveness with user completion rates.',
    followUp: [
      'Should each category be required or optional?',
      'How will you display aggregate scores across categories?',
      'Should different categories have different weights in overall rating?'
    ],
    category: 'reviews',
    userType: 'both'
  },
  {
    id: 'reviews-2',
    title: 'Photo Upload Requirements',
    description: 'Visual review authenticity',
    question: 'Should photo uploads be required, optional, or encouraged with incentives for review authenticity?',
    context: 'Your wireframe mentions photo uploads for review authenticity. Implementation affects trust and user experience.',
    followUp: [
      'What photo moderation will you need?',
      'How will you handle privacy concerns with photos of other hikers?',
      'Should guides be able to respond with their own photos?'
    ],
    category: 'reviews',
    userType: 'both'
  },
  {
    id: 'reviews-3',
    title: 'Guide Response System',
    description: 'Review response implementation',
    question: 'Should guides be able to respond publicly to reviews, privately message reviewers, or both?',
    context: 'Your wireframe shows a response system for guides to address feedback. Implementation affects reputation management.',
    followUp: [
      'Should there be limits on response length or frequency?',
      'How will you handle inappropriate responses from guides?',
      'Should hiker responses to guide responses be allowed?'
    ],
    category: 'reviews',
    userType: 'both'
  },

  // Backend & Security Implementation
  {
    id: 'backend-1',
    title: 'Supabase RLS Policies',
    description: 'Database security implementation',
    question: 'How will you structure Row Level Security policies in Supabase to ensure guides only see their tours and hikers only see their bookings?',
    context: 'You have Supabase set up with your backend. Need to implement proper data access controls for your marketplace.',
    followUp: [
      'What RLS policies do you need for the tours, bookings, and messages tables?',
      'How will you handle admin access for customer support?',
      'Should guides be able to see hiker profiles of booked participants?'
    ],
    category: 'backend',
    userType: 'both'
  },
  {
    id: 'backend-2',
    title: 'Real-time Features Implementation',
    description: 'Live updates and notifications',
    question: 'Should you use Supabase real-time subscriptions for live chat, booking updates, and availability changes?',
    context: 'Your messaging system and booking flows could benefit from real-time updates using Supabase\'s real-time features.',
    followUp: [
      'Which features need real-time updates vs periodic polling?',
      'How will you handle real-time performance with many concurrent users?',
      'Should tour availability updates be real-time or cached?'
    ],
    category: 'backend',
    userType: 'both'
  },
  {
    id: 'backend-3',
    title: 'Search Performance Strategy',
    description: 'Search and filtering optimization',
    question: 'Should you implement full-text search using Supabase\'s built-in search, add Elasticsearch, or use simpler database queries?',
    context: 'Your search interface with multiple filters needs to perform well across tours, locations, and descriptions.',
    followUp: [
      'What search response time targets do you have?',
      'How will you handle search across multiple languages in your regions?',
      'Should you pre-compute popular search combinations?'
    ],
    category: 'backend',
    userType: 'both'
  }
];

interface Answer {
  questionId: string;
  answer: string;
  followUpAnswers?: string[];
}

const STORAGE_KEY = 'madetohike-guide-answers';
const CURRENT_STATE_KEY = 'madetohike-guide-state';

export function InteractiveGuide() {
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

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

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
      console.warn('Failed to load saved guide data:', error);
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
      case 'landing': return <Users className="h-4 w-4" />;
      case 'registration': return <Circle className="h-4 w-4" />;
      case 'search': return <MapPin className="h-4 w-4" />;
      case 'tours': return <MapPin className="h-4 w-4" />;
      case 'booking': return <CreditCard className="h-4 w-4" />;
      case 'communication': return <Users className="h-4 w-4" />;
      case 'reviews': return <CheckCircle className="h-4 w-4" />;
      case 'backend': return <Shield className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  const getUserTypeBadge = (userType: string) => {
    if (userType === 'guide') return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Guide Flow</Badge>;
    if (userType === 'hiker') return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Hiker Flow</Badge>;
    return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Both Users</Badge>;
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
      
      if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setShowFollowUp(false);
        
        // Load existing answer if available
        const existingAnswer = answers.find(a => a.questionId === questions[nextIndex].id);
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
        const prevAnswer = answers.find(a => a.questionId === questions[prevIndex].id);
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
      const jumpAnswer = answers.find(a => a.questionId === questions[index].id);
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
        exportDate: new Date().toISOString(),
        totalQuestions: questions.length,
        answeredQuestions: latestAnswers.filter((a: Answer) => a.answer && a.answer.trim()).length,
        answers: questions.map(q => {
          const answer = latestAnswers.find((a: Answer) => a.questionId === q.id);
          return {
            questionNumber: questions.indexOf(q) + 1,
            category: q.category,
            userType: q.userType,
            title: q.title,
            question: q.question,
            answer: answer?.answer || '',
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
      link.download = `madetohike-wireframe-decisions-${new Date().toISOString().split('T')[0]}.json`;
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
    if (confirm('Are you sure you want to clear all your answers? This cannot be undone.')) {
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

  const getSavedAnswersDisplay = () => {
    try {
      const savedAnswers = localStorage.getItem(STORAGE_KEY);
      if (!savedAnswers) return [];
      
      const parsedAnswers = JSON.parse(savedAnswers);
      return questions.map(q => {
        const answer = parsedAnswers.find((a: Answer) => a.questionId === q.id);
        return {
          question: q,
          answer: answer?.answer || '',
          followUpAnswers: answer?.followUpAnswers || [],
          hasAnswer: !!(answer?.answer && answer.answer.trim())
        };
      });
    } catch (error) {
      console.error('Error retrieving saved answers:', error);
      return [];
    }
  };

  const debugLocalStorage = () => {
    const savedAnswers = localStorage.getItem(STORAGE_KEY);
    const savedState = localStorage.getItem(CURRENT_STATE_KEY);
    
    console.log('=== LOCALSTORAGE DEBUG ===');
    console.log('Storage Key:', STORAGE_KEY);
    console.log('State Key:', CURRENT_STATE_KEY);
    console.log('Raw Answers Data:', savedAnswers);
    console.log('Raw State Data:', savedState);
    
    if (savedAnswers) {
      try {
        const parsed = JSON.parse(savedAnswers);
        console.log('Parsed Answers:', parsed);
        console.log('Answer Count:', parsed.length);
      } catch (e) {
        console.log('Error parsing answers:', e);
      }
    }
    
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        console.log('Parsed State:', parsed);
      } catch (e) {
        console.log('Error parsing state:', e);
      }
    }
    
    console.log('Current React State:');
    console.log('- Answers:', answers);
    console.log('- Current Answer:', currentAnswer);
    console.log('- Question Index:', currentQuestionIndex);
    console.log('=========================');
  };

  // Answers view
  if (showAnswersView) {
    const savedAnswersDisplay = getSavedAnswersDisplay();
    const sections1to4 = savedAnswersDisplay.filter((item, index) => index < 12); // First 12 questions cover sections 1-4
    
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Your Saved Answers (Sections 1-4)
              <Button variant="outline" onClick={() => setShowAnswersView(false)}>
                Back to Guide
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {sections1to4.map((item, index) => (
                <div key={item.question.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {item.question.category}
                    </Badge>
                    <Badge variant={item.question.userType === 'guide' ? 'outline' : item.question.userType === 'hiker' ? 'secondary' : 'default'} className="text-xs">
                      {item.question.userType}
                    </Badge>
                  </div>
                  <h4 className="mb-2">
                    Q{index + 1}: {item.question.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {item.question.question}
                  </p>
                  {item.hasAnswer ? (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-800">{item.answer}</p>
                      {item.followUpAnswers.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-green-700">Follow-up responses:</p>
                          {item.followUpAnswers.map((followUp, i) => (
                            <p key={i} className="text-xs text-green-600 pl-2 border-l-2 border-green-200">
                              {followUp}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 italic">Not answered yet</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => {
                          setShowAnswersView(false);
                          jumpToQuestion(index);
                        }}
                      >
                        Answer This Question
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t flex gap-3 justify-center">
              <Button onClick={exportAnswers}>
                Export All Answers
              </Button>
              <Button variant="outline" onClick={() => setShowAnswersView(false)}>
                Continue Guide
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    const answeredCount = answers.filter(a => a.answer && a.answer.trim()).length;
    
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-green-700">
            🎉 Wireframe Planning Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>You've answered {answeredCount} out of {questions.length} questions about your MadeToHike platform.</p>
          <p>Your responses will guide the development of your marketplace architecture.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button onClick={exportAnswers}>
              Export All Decisions as JSON
            </Button>
            <Button variant="outline" onClick={() => setShowAnswersView(true)}>
              View All Answers
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Question {currentQuestionIndex + 1} of {questions.length}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">{Math.round(progress)}% complete</span>
              {isAutoSaving && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <Save className="h-3 w-3 animate-pulse" />
                  Saving...
                </div>
              )}
              {lastSaved && !isAutoSaving && (
                <div className="text-xs text-green-600">
                  ✓ Saved {lastSaved.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {getCategoryIcon(currentQuestion.category)}
              <span className="text-sm capitalize text-muted-foreground">{currentQuestion.category}</span>
            </div>
            {getUserTypeBadge(currentQuestion.userType)}
          </div>
          <CardTitle>{currentQuestion.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{currentQuestion.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Context */}
          {currentQuestion.context && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">{currentQuestion.context}</p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 p-4 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}

          {/* Main Question */}
          <div>
            <h4 className="mb-2">{currentQuestion.question}</h4>
            <Textarea
              placeholder="Share your thoughts and decision... (minimum 5 characters)"
              value={currentAnswer}
              onChange={(e) => {
                setCurrentAnswer(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              rows={4}
              className={errorMessage ? 'border-red-300 focus:border-red-500' : ''}
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
              <span>{currentAnswer.length} characters</span>
              {currentAnswer.length >= 5 && (
                <span className="text-green-600">✓ Ready to continue</span>
              )}
            </div>
          </div>

          {/* Follow-up Questions */}
          {currentQuestion.followUp && (
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFollowUp(!showFollowUp)}
              >
                {showFollowUp ? 'Hide' : 'Show'} Follow-up Questions ({currentQuestion.followUp.length})
              </Button>
              
              {showFollowUp && (
                <div className="mt-4 space-y-3">
                  <h5 className="text-sm">Follow-up considerations:</h5>
                  {currentQuestion.followUp.map((followUp, index) => (
                    <div key={index}>
                      <p className="text-sm mb-2">{followUp}</p>
                      <Textarea
                        placeholder="Your thoughts..."
                        value={followUpAnswers[index] || ''}
                        onChange={(e) => {
                          const newFollowUps = [...followUpAnswers];
                          newFollowUps[index] = e.target.value || '';
                          setFollowUpAnswers(newFollowUps);
                        }}
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <Button 
              onClick={nextQuestion}
              disabled={!currentAnswer || currentAnswer.trim().length < 5}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next'}
              {currentQuestionIndex < questions.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Answer Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {questions.map((q, index) => {
              const hasAnswer = answers.find(a => a.questionId === q.id && a.answer && a.answer.trim());
              const isCurrent = index === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => jumpToQuestion(index)}
                  className={`p-2 rounded text-center transition-colors cursor-pointer hover:opacity-80 ${
                    isCurrent 
                      ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-300' 
                      : hasAnswer 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {index + 1}. {q.title}
                </button>
              );
            })}
          </div>
          <div className="mt-4 space-y-2">
            <div className="text-xs text-muted-foreground text-center">
              Click any question to jump directly to it. 
              Answered: {answers.filter(a => a.answer && a.answer.trim()).length}/{questions.length}
            </div>
            <div className="flex gap-2 justify-center flex-wrap">
              <Button size="sm" variant="outline" onClick={() => setShowAnswersView(true)}>
                View Answers (1-4)
              </Button>
              <Button size="sm" variant="outline" onClick={exportAnswers}>
                Export Progress
              </Button>
              <Button size="sm" variant="outline" onClick={debugLocalStorage}>
                Debug Storage
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