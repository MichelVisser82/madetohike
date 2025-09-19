import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Users, MapPin, Shield, CreditCard, AlertCircle, Save, Code, Rocket, TestTube, TrendingUp, Download } from 'lucide-react';

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

const genericImplementationQuestions: Question[] = [
  // Development & Technical Implementation
  {
    id: 'dev-1',
    title: 'Technology Stack Selection',
    description: 'Choose your core development technologies',
    question: 'What technology stack will you use for frontend, backend, and database? Consider React ecosystem, backend frameworks, and database choices.',
    context: 'This foundational decision affects development speed, scalability, team hiring, and long-term maintenance.',
    followUp: [
      'What hosting platform will you use (Vercel, AWS, Google Cloud, etc.)?',
      'How will you handle authentication and user management?',
      'What payment processing solution fits your business model?'
    ],
    category: 'development',
    userType: 'technical',
    priority: 'high'
  },
  {
    id: 'dev-2',
    title: 'User Registration & Onboarding Flow',
    description: 'Design your user acquisition process',
    question: 'How will you handle user registration for both guides and hikers? What verification will be required and when?',
    context: 'Consider the balance between reducing friction for quick signup and gathering necessary information for trust and safety.',
    followUp: [
      'What documents or verifications will guides need to provide?',
      'How will you handle incomplete registrations and follow-up?',
      'What onboarding tutorial or guidance will new users receive?'
    ],
    category: 'development',
    userType: 'both',
    priority: 'high'
  },
  {
    id: 'dev-3',
    title: 'Search & Discovery Architecture',
    description: 'Build your tour discovery system',
    question: 'How will users search and filter tours? What search criteria are most important for your marketplace?',
    context: 'Search is critical for user experience and conversion. Consider performance, relevance, and filter options.',
    followUp: [
      'Will you implement map-based search or just list-based?',
      'What search performance targets will you set?',
      'How will you handle search result ranking and relevance?'
    ],
    category: 'development',
    userType: 'technical',
    priority: 'high'
  },
  {
    id: 'dev-4',
    title: 'Tour Creation & Management Interface',
    description: 'Enable guides to create and manage tours',
    question: 'What will the tour creation process look like? How many steps and what information will be required?',
    context: 'This directly impacts guide adoption and the quality of tours on your platform.',
    followUp: [
      'How will guides manage availability and pricing?',
      'What templates or guidance will help new guides?',
      'How will you handle tour photos and descriptions?'
    ],
    category: 'development',
    userType: 'business',
    priority: 'high'
  },
  {
    id: 'dev-5',
    title: 'Payment & Commission System',
    description: 'Design your marketplace payment flow',
    question: 'What commission structure will you use and how will payments be processed? When will guides receive their payouts?',
    context: 'Your payment system affects pricing competitiveness, cash flow, and guide satisfaction.',
    followUp: [
      'What payment methods will you accept from customers?',
      'How will you handle refunds and cancellations?',
      'What payment splitting solution will you implement?'
    ],
    category: 'development',
    userType: 'business',
    priority: 'high'
  },

  // MVP Feature Prioritization
  {
    id: 'mvp-1',
    title: 'MVP Feature Scope Definition',
    description: 'Define your minimum viable product features',
    question: 'What core features must be included in your MVP launch? Which features can be delayed to post-launch?',
    context: 'Focusing on essential features helps you launch faster and gather user feedback sooner.',
    followUp: [
      'What user flows are absolutely essential for MVP?',
      'Which nice-to-have features can be saved for version 2?',
      'How will you handle feature requests from early users?'
    ],
    category: 'mvp',
    userType: 'business',
    priority: 'high'
  },
  {
    id: 'mvp-2',
    title: 'Regional Launch Strategy',
    description: 'Choose your initial market focus',
    question: 'Which geographic region will you launch in first? How will you validate market demand before expanding?',
    context: 'Starting with one region allows you to perfect your model before scaling.',
    followUp: [
      'How many guides will you need for a successful regional launch?',
      'What market research will validate demand in your chosen region?',
      'What expansion criteria will determine when to add new regions?'
    ],
    category: 'mvp',
    userType: 'business',
    priority: 'high'
  },
  {
    id: 'mvp-3',
    title: 'Communication System Implementation',
    description: 'Enable guide-hiker communication',
    question: 'How will guides and hikers communicate before, during, and after tours? What channels will you provide?',
    context: 'Good communication builds trust and improves the tour experience, but also requires moderation and safety considerations.',
    followUp: [
      'Will you use in-app messaging, email, or external platforms?',
      'How will you handle inappropriate communications or disputes?',
      'What emergency communication features are needed?'
    ],
    category: 'mvp',
    userType: 'both',
    priority: 'medium'
  },

  // Testing & Quality Assurance
  {
    id: 'testing-1',
    title: 'User Testing Strategy',
    description: 'Plan your user validation approach',
    question: 'How will you test your platform with real users before launch? What feedback mechanisms will you implement?',
    context: 'User testing reveals usability issues and validates your assumptions about user behavior.',
    followUp: [
      'Will you recruit beta testers from your target regions?',
      'What specific user journeys will you test most thoroughly?',
      'How will you prioritize and implement feedback from testing?'
    ],
    category: 'testing',
    userType: 'both',
    priority: 'high'
  },
  {
    id: 'testing-2',
    title: 'Review & Trust System Design',
    description: 'Build credibility and quality assurance',
    question: 'How will your review system work? What categories or criteria will reviews include?',
    context: 'Reviews are crucial for marketplace trust, but the system design affects completion rates and usefulness.',
    followUp: [
      'Will reviews be required, optional, or incentivized?',
      'How will you handle fake reviews or review manipulation?',
      'Can guides respond to reviews? What moderation will you provide?'
    ],
    category: 'testing',
    userType: 'both',
    priority: 'medium'
  },
  {
    id: 'testing-3',
    title: 'Safety & Emergency Protocols',
    description: 'Ensure hiker safety and risk management',
    question: 'What safety measures and emergency protocols will you implement? How will you handle liability and insurance?',
    context: 'Outdoor activities carry inherent risks that require careful planning and clear policies.',
    followUp: [
      'What emergency contact systems will you provide?',
      'How will you verify guide certifications and insurance?',
      'What liability protection will the platform provide?'
    ],
    category: 'testing',
    userType: 'business',
    priority: 'high'
  },

  // Launch Strategy
  {
    id: 'launch-1',
    title: 'Guide Recruitment Strategy',
    description: 'Build your supply side first',
    question: 'How will you recruit your initial set of guides? What incentives or support will you offer early adopters?',
    context: 'A marketplace needs good supply (guides) to attract demand (hikers). Guide quality determines platform success.',
    followUp: [
      'What channels will you use to find and recruit guides?',
      'Will you offer reduced commissions or other launch incentives?',
      'How will you support guides through their first tours?'
    ],
    category: 'launch',
    userType: 'business',
    priority: 'high'
  },
  {
    id: 'launch-2',
    title: 'Customer Acquisition Strategy',
    description: 'Drive demand for your marketplace',
    question: 'How will you attract your first customers? What marketing channels and messaging will you use?',
    context: 'Customer acquisition is often the biggest challenge for new marketplaces.',
    followUp: [
      'What digital marketing channels will you prioritize?',
      'How will you leverage local tourism boards or hiking communities?',
      'What content marketing strategy will build authority and SEO?'
    ],
    category: 'launch',
    userType: 'business',
    priority: 'high'
  },
  {
    id: 'launch-3',
    title: 'Launch Metrics & Success Criteria',
    description: 'Define what success looks like',
    question: 'What metrics will you track to measure launch success? What targets will indicate you\'re ready to scale?',
    context: 'Clear success metrics help you focus efforts and make data-driven decisions about scaling.',
    followUp: [
      'How many tours need to be completed for a successful launch?',
      'What customer satisfaction scores will indicate product-market fit?',
      'What revenue or booking targets will justify expansion?'
    ],
    category: 'launch',
    userType: 'business',
    priority: 'medium'
  },

  // Operations & Support
  {
    id: 'ops-1',
    title: 'Customer Support System',
    description: 'Handle user questions and issues',
    question: 'How will you provide customer support for both guides and hikers? What channels and response time targets will you set?',
    context: 'Good support builds trust and helps resolve issues before they become problems.',
    followUp: [
      'Will you provide phone, email, chat, or in-app support?',
      'How will you handle urgent issues during tours?',
      'What self-service resources will reduce support volume?'
    ],
    category: 'operations',
    userType: 'business',
    priority: 'medium'
  },
  {
    id: 'ops-2',
    title: 'Content Moderation Strategy',
    description: 'Maintain platform quality and safety',
    question: 'How will you moderate tour listings, reviews, and user communications? What guidelines will you enforce?',
    context: 'Moderation ensures quality but requires resources and clear policies.',
    followUp: [
      'What automated tools will help with content screening?',
      'How will you handle disputes between guides and customers?',
      'What community guidelines will you establish?'
    ],
    category: 'operations',
    userType: 'business',
    priority: 'medium'
  },

  // Growth & Scaling
  {
    id: 'growth-1',
    title: 'Geographic Expansion Planning',
    description: 'Scale to new regions',
    question: 'How will you expand to new regions? What criteria will determine expansion priorities?',
    context: 'Geographic expansion requires local market knowledge and adapted marketing strategies.',
    followUp: [
      'Will you expand to similar regions or diversify to different hiking markets?',
      'How will you handle different languages, currencies, and regulations?',
      'What local partnerships will accelerate expansion?'
    ],
    category: 'growth',
    userType: 'business',
    priority: 'low'
  },
  {
    id: 'growth-2',
    title: 'Feature Enhancement Roadmap',
    description: 'Plan future platform improvements',
    question: 'What major features or improvements will you add after launch? How will you prioritize development based on user feedback?',
    context: 'Post-launch development should be driven by user needs and business impact.',
    followUp: [
      'What advanced features might differentiate you from competitors?',
      'How will you balance new features vs platform stability?',
      'What user feedback mechanisms will guide development priorities?'
    ],
    category: 'growth',
    userType: 'both',
    priority: 'low'
  },
  {
    id: 'growth-3',
    title: 'Revenue Optimization Strategy',
    description: 'Maximize marketplace profitability',
    question: 'How will you optimize your revenue model over time? What additional revenue streams might you explore?',
    context: 'Mature marketplaces often expand beyond transaction fees to subscription models, advertising, or premium services.',
    followUp: [
      'Could you offer premium features to guides or enterprise solutions?',
      'What advertising opportunities might exist for outdoor gear companies?',
      'How might you optimize commission rates based on market data?'
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

export function GenericImplementationGuide() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpAnswers, setFollowUpAnswers] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const currentQuestion = genericImplementationQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / genericImplementationQuestions.length) * 100;

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
      
      if (currentQuestionIndex < genericImplementationQuestions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setShowFollowUp(false);
        
        // Load existing answer if available
        const existingAnswer = answers.find(a => a.questionId === genericImplementationQuestions[nextIndex].id);
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
        const prevAnswer = answers.find(a => a.questionId === genericImplementationQuestions[prevIndex].id);
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

  const downloadAnswers = () => {
    try {
      const exportData = {
        answers,
        completedAt: new Date().toISOString(),
        totalQuestions: genericImplementationQuestions.length,
        answeredQuestions: answers.length
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `madetohike-implementation-answers-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Failed to download answers:', error);
      setErrorMessage('Failed to download answers. Please try again.');
    }
  };

  if (isComplete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Implementation Planning Complete!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Congratulations! You've completed all {genericImplementationQuestions.length} implementation planning questions. 
            You now have a comprehensive roadmap for building your MadeToHike marketplace.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{answers.length}</div>
              <div className="text-sm text-green-700">Questions Answered</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-blue-700">Implementation Plan Complete</div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={downloadAnswers}>
              <Download className="h-4 w-4 mr-2" />
              Download Implementation Plan
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsComplete(false);
                setCurrentQuestionIndex(0);
                const firstAnswer = answers.find(a => a.questionId === genericImplementationQuestions[0].id);
                if (firstAnswer) {
                  setCurrentAnswer(firstAnswer.answer || '');
                  setFollowUpAnswers((firstAnswer.followUpAnswers || []).map(a => a || ''));
                }
              }}
            >
              Review Answers
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {getCategoryIcon(currentQuestion.category)}
              Question {currentQuestionIndex + 1} of {genericImplementationQuestions.length}
            </CardTitle>
            <div className="flex items-center gap-2">
              {getUserTypeBadge(currentQuestion.userType)}
              {getPriorityBadge(currentQuestion.priority)}
            </div>
          </div>
          <Progress value={progress} className="mt-2" />
          <div className="text-sm text-muted-foreground mt-1">
            {Math.round(progress)}% Complete • {answers.length} answered
          </div>
        </CardHeader>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle>{currentQuestion.title}</CardTitle>
          <p className="text-muted-foreground">{currentQuestion.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800 mb-2">{currentQuestion.question}</p>
            {currentQuestion.context && (
              <p className="text-sm text-blue-700 italic">{currentQuestion.context}</p>
            )}
          </div>

          <Textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Share your thoughts and decisions..."
            className="min-h-[120px]"
          />

          {/* Follow-up Questions */}
          {currentQuestion.followUp && currentQuestion.followUp.length > 0 && (
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFollowUp(!showFollowUp)}
                className="mb-3"
              >
                {showFollowUp ? 'Hide' : 'Show'} Follow-up Questions ({currentQuestion.followUp.length})
              </Button>

              {showFollowUp && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Consider these additional questions to develop your answer further:
                  </p>
                  {currentQuestion.followUp.map((followUp, index) => (
                    <div key={index} className="space-y-2">
                      <p className="text-sm font-medium">{followUp}</p>
                      <Textarea
                        value={followUpAnswers[index] || ''}
                        onChange={(e) => {
                          const newFollowUpAnswers = [...followUpAnswers];
                          newFollowUpAnswers[index] = e.target.value;
                          setFollowUpAnswers(newFollowUpAnswers);
                        }}
                        placeholder="Optional: Add your thoughts..."
                        className="min-h-[80px]"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              {errorMessage}
            </div>
          )}

          {/* Auto-save Status */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>
              {isAutoSaving ? 'Saving...' : lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString()}` : ''}
            </div>
            <Button variant="ghost" size="sm" onClick={saveAnswer}>
              <Save className="h-3 w-3 mr-1" />
              Save Answer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <Button onClick={nextQuestion}>
          {currentQuestionIndex === genericImplementationQuestions.length - 1 ? 'Complete' : 'Next'}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}