import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle, Users, MapPin, Shield, CreditCard, Download, Eye, EyeOff } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface Answer {
  questionId: string;
  answer: string;
  followUpAnswers?: string[];
}

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

const completedAnswers: Answer[] = [
  {
    questionId: 'landing-1',
    answer: 'Dual CTAs side-by-side with "Find a Guide" slightly more prominent (larger button, primary color) to drive demand first, while "Become a Guide" uses secondary styling.',
    followUpAnswers: [
      'Yes, "Find a Guide" should be more prominent as we need hikers first to create demand',
      'A/B testing with conversion tracking and user journey analytics to measure CTA performance',
      'Find a Guide: "Discover Safe Adventures" | Become a Guide: "Share Your Expertise"'
    ]
  },
  {
    questionId: 'landing-2',
    answer: 'User-controlled carousel with auto-advance every 8 seconds, showing all three regions simultaneously on desktop (cards layout), mobile shows one at a time with swipe.',
    followUpAnswers: [
      'Each region card shows: hero image, region name, number of tours, difficulty range, best seasons',
      'Yes, clicking a region immediately filters tours and navigates to search results',
      'Desktop: 3-column grid layout, Mobile: horizontal scroll with snap points'
    ]
  },
  {
    questionId: 'landing-3',
    answer: 'Trust indicators in a dedicated section below hero, with key indicators (verified guides, secure payments, safety protocols) also shown in header.',
    followUpAnswers: [
      'Display: mountain guide certifications, first aid qualifications, insurance coverage, local permits',
      'Yes, showcase verified guide photos with badges and years of experience on homepage',
      'Multi-step verification process: document check → background check → skills assessment → ongoing reviews'
    ]
  },
  {
    questionId: 'registration-1',
    answer: 'Role-specific flows from the start with a role selection screen, then multi-step wizards: 3 steps for hikers, 5 steps for guides.',
    followUpAnswers: [
      'Hikers: 3 steps (Basic Info → Preferences → Emergency Contact) | Guides: 5 steps (Basic Info → Credentials → Banking → Tour Setup → Verification)',
      'Yes, users can save progress at each step and receive email reminders to complete',
      'Send follow-up emails after 24 hours, then weekly for 3 weeks with assistance offers'
    ]
  },
  {
    questionId: 'registration-2',
    answer: 'Require photo ID, mountain guide certification or equivalent, first aid certificate, insurance coverage, and banking details for payment processing.',
    followUpAnswers: [
      'Third-party document verification service + manual review for certifications',
      'Verification failure triggers support contact for document resubmission with guidance',
      'Guides can create draft tours but cannot publish or accept bookings until full verification'
    ]
  },
  {
    questionId: 'registration-3',
    answer: 'Offer Google and Apple social login for convenience, with email registration as fallback. Facebook optional based on regional preferences.',
    followUpAnswers: [
      'Social login skips email verification but not identity verification for guides',
      'Account settings allow unlinking with email/password setup required first',
      'Additional profile data: emergency contact, hiking experience, language preferences, insurance info'
    ]
  },
  {
    questionId: 'search-1',
    answer: 'Left sidebar on desktop for comprehensive filtering, collapsible panel on mobile that slides up from bottom. Key filters always visible.',
    followUpAnswers: [
      'Mobile: collapsible filter panel with most important filters (Region, Dates, Difficulty) always visible',
      'Yes, active filters shown as removable chips above search results',
      'Default sort: relevance score combining location, availability, reviews, and guide activity'
    ]
  },
  {
    questionId: 'search-2',
    answer: 'Show tour starting points on map with cluster markers for density, expandable to show route overview when tour is selected.',
    followUpAnswers: [
      'Combined view: map and list side-by-side on desktop, toggle on mobile',
      'Multiple meeting points shown as numbered markers with selection dropdown',
      'Use Mapbox for custom styling and OpenStreetMap data for hiking trails'
    ]
  },
  {
    questionId: 'search-3',
    answer: 'Use a standardized 1-5 scale globally with region-specific context tooltips (e.g., Via Ferrata grades for Dolomites explained).',
    followUpAnswers: [
      'Multi-difficulty trails shown as ranges (e.g., "2-4" with explanation of variation)',
      'Guides self-assess with verification through review feedback and platform oversight',
      'Include elevation gain, technical skills required, fitness level, and trail conditions'
    ]
  },
  {
    questionId: 'tours-1',
    answer: 'Follow the sequence: Basic Info → Route Details → Pricing & Availability → Equipment & Policies → Review & Publish.',
    followUpAnswers: [
      'Required for publish: Basic Info, Route Details, Pricing. Optional: Equipment lists, detailed policies',
      'Interactive wizard with tooltips, example tours, and progress indicators with save points',
      'Yes, provide templates for: Day Hikes, Multi-day Treks, Via Ferrata, Beginner Tours'
    ]
  },
  {
    questionId: 'tours-2',
    answer: 'Support both: built-in calendar for platform bookings with optional Google Calendar sync for external schedule import.',
    followUpAnswers: [
      'Built-in recurring schedule templates (daily, weekly, seasonal) with bulk availability setting',
      'Yes, guides can block personal time which appears as unavailable for bookings',
      'External conflicts show warnings with manual override options and automatic notifications'
    ]
  },
  {
    questionId: 'tours-3',
    answer: 'Provide guides with weather data and automatic season suggestions, with optional severe weather warnings for tour safety.',
    followUpAnswers: [
      'Use multiple sources: OpenWeatherMap for general conditions, mountain-specific services for each region',
      'No auto-cancel, but send automatic severe weather alerts to guides and hikers with recommendations',
      'In-app notifications + email alerts 48 hours and 24 hours before tour with weather updates'
    ]
  },
  {
    questionId: 'booking-1',
    answer: 'Use Stripe Connect for direct payment splitting: platform takes commission automatically, guides receive remainder minus processing fees.',
    followUpAnswers: [
      'Platform commission: 8% of tour price (competitive with similar marketplaces)',
      'Instant refunds for cancellations > 48 hours, prorated refunds within 48 hours based on guide policy',
      'Guides receive payouts within 2 business days after tour completion'
    ]
  },
  {
    questionId: 'booking-2',
    answer: 'Flexible per-person pricing with guide-set discounts for larger groups (e.g., 10% off for 4+ people, 15% off for 6+ people).',
    followUpAnswers: [
      'Clear pricing table showing cost per person with group size breakdowns and total calculation',
      'Yes, guides can set different pricing for peak season (June-September) vs off-season',
      'Allow group size changes up to 7 days before tour with automatic price recalculation'
    ]
  },
  {
    questionId: 'booking-3',
    answer: 'Optional add-ons during booking with standardized categories: equipment rental, meals, transportation, with guide-set pricing.',
    followUpAnswers: [
      'Suggested price ranges for equipment categories with guides setting final prices within ranges',
      'Guides manage inventory through platform with availability tracking and booking limits',
      'Add-ons unavailable trigger automatic notifications with alternative suggestions or refunds'
    ]
  },
  {
    questionId: 'communication-1',
    answer: 'Hybrid approach: in-app messaging for convenience with email notifications for important safety messages and tour updates.',
    followUpAnswers: [
      'Critical safety messages get both in-app notifications and email delivery with read receipts',
      'Yes, provide message templates for common scenarios: weather updates, meeting point changes, equipment lists',
      'SMS backup for emergency communications when mobile coverage is available'
    ]
  },
  {
    questionId: 'communication-2',
    answer: 'Support direct file sharing in messages for trip documents and photos, with reasonable size limits and file type restrictions.',
    followUpAnswers: [
      'Support: PDF, images (JPG/PNG), GPX files. Size limit: 10MB per file, 50MB per conversation',
      'Photo sharing during tours with automatic gallery creation for group access post-tour',
      'Yes, all group members can access shared files with download capabilities'
    ]
  },
  {
    questionId: 'communication-3',
    answer: 'Emergency contacts receive automatic notifications when tours start/end with option for hikers to customize notification preferences.',
    followUpAnswers: [
      'Tour start/end times, guide contact info, approximate location, expected return time',
      'Support international contacts with time zone appropriate messaging',
      'Future enhancement: partnerships with local mountain rescue services for emergency protocols'
    ]
  },
  {
    questionId: 'reviews-1',
    answer: 'Use simplified 5 categories: Guide Expertise, Safety & Communication, Value for Money, Route Accuracy, Overall Experience.',
    followUpAnswers: [
      'Guide Expertise and Overall Experience required, others optional to encourage completion',
      'Display average scores per category with overall weighted average prominently',
      'Equal weight for all categories except Overall Experience which counts double'
    ]
  },
  {
    questionId: 'reviews-2',
    answer: 'Photo uploads optional but encouraged with small incentives (discount on future booking) to boost authenticity.',
    followUpAnswers: [
      'Automated moderation for inappropriate content + community reporting system',
      'Privacy controls: blur faces option, photo approval before sharing, opt-out capabilities',
      'Guides can respond with their own photos and context for disputed reviews'
    ]
  },
  {
    questionId: 'reviews-3',
    answer: 'Guides can respond publicly to reviews with character limits, plus private messaging option for detailed dispute resolution.',
    followUpAnswers: [
      'Public responses limited to 300 characters, private messages unlimited, one response per review',
      'Community guidelines with reporting system and potential account restrictions for violations',
      'No back-and-forth public responses - private messaging encouraged for extended discussions'
    ]
  },
  {
    questionId: 'backend-1',
    answer: 'Implement RLS policies: guides see only their tours/bookings, hikers see only their bookings, shared data includes public tour info and verified guide profiles.',
    followUpAnswers: [
      'Tours: guides can CRUD their own; Bookings: users see own bookings; Messages: participants only',
      'Admin role with elevated permissions and audit logging for all admin actions',
      'Guides see basic hiker profiles (name, experience level) of confirmed bookings only'
    ]
  },
  {
    questionId: 'backend-2',
    answer: 'Use Supabase real-time for: live chat messages, booking confirmations, availability updates. Use polling for: search results, tour listings.',
    followUpAnswers: [
      'Real-time: chat, bookings, calendar updates. Polling: search (30s cache), tour browsing (5min cache)',
      'Connection pooling, rate limiting, and graceful degradation to polling under high load',
      'Real-time availability updates with 30-second debouncing to prevent excessive updates'
    ]
  },
  {
    questionId: 'backend-3',
    answer: 'Start with Supabase built-in full-text search with custom ranking, evaluate Elasticsearch later if search complexity grows.',
    followUpAnswers: [
      'Target: <200ms for simple searches, <500ms for complex multi-filter searches',
      'Support English, Italian, French, Spanish with language-specific search optimizations',
      'Cache popular search combinations for 5 minutes, precompute region + difficulty combinations'
    ]
  }
];

const questions: Question[] = [
  {
    id: 'landing-1',
    title: 'Hero Section CTA Priority',
    description: 'Primary call-to-action hierarchy',
    question: 'What should be the primary CTA in your hero section: "Find a Guide", "Become a Guide", or dual CTAs side-by-side?',
    category: 'landing',
    userType: 'both'
  },
  {
    id: 'landing-2',
    title: 'Featured Regions Carousel Design',
    description: 'How to implement the regions showcase',
    question: 'For your Dolomites/Pyrenees/Scotland carousel, should it auto-rotate, be user-controlled, or show all three simultaneously on desktop?',
    category: 'landing',
    userType: 'both'
  },
  {
    id: 'landing-3',
    title: 'Trust Indicators Placement',
    description: 'Where to display credibility signals',
    question: 'Should trust indicators (verified guides, safety protocols, secure payments) be in the header, hero section, or dedicated trust section?',
    category: 'landing',
    userType: 'both'
  },
  {
    id: 'registration-1',
    title: 'Multi-Step Form Design',
    description: 'Registration flow structure',
    question: 'Should your registration be a single long form, multi-step wizard, or role-specific flows from the start?',
    category: 'registration',
    userType: 'both'
  },
  {
    id: 'registration-2',
    title: 'Guide KYC Implementation',
    description: 'Know Your Customer requirements for guides',
    question: 'What specific documents will you require from guides: photo ID, insurance certificate, hiking certifications, or banking details?',
    category: 'registration',
    userType: 'guide'
  },
  {
    id: 'registration-3',
    title: 'Social Login Strategy',
    description: 'Third-party authentication integration',
    question: 'Which social login options should you offer: Google, Apple, Facebook, or email-only registration?',
    category: 'registration',
    userType: 'both'
  },
  {
    id: 'search-1',
    title: 'Filter Sidebar vs Top Bar',
    description: 'Search interface layout design',
    question: 'Should your key filters (Region, Dates, Difficulty, Group Size, Price) be in a left sidebar, top horizontal bar, or collapsible panel?',
    category: 'search',
    userType: 'hiker'
  },
  {
    id: 'search-2',
    title: 'Map Integration Implementation',
    description: 'Visual tour discovery interface',
    question: 'Should your map integration show tour starting points, entire routes, or just general regions?',
    category: 'search',
    userType: 'hiker'
  },
  {
    id: 'search-3',
    title: 'Difficulty Rating System',
    description: 'Standardized difficulty communication',
    question: 'Should you use a 1-5 scale, beginner/intermediate/advanced, or region-specific scales (like Via Ferrata grades for Dolomites)?',
    category: 'search',
    userType: 'hiker'
  },
  {
    id: 'tours-1',
    title: 'Tour Creation Steps',
    description: 'Specific workflow implementation',
    question: 'Should your tour creation follow: Basic Info → Route Details → Pricing → Availability → Equipment → Policies, or a different sequence?',
    category: 'tours',
    userType: 'guide'
  },
  {
    id: 'tours-2',
    title: 'Calendar Integration Choice',
    description: 'Availability management system',
    question: 'Should guides manage availability through your built-in calendar, integrate with Google Calendar, or support both?',
    category: 'tours',
    userType: 'guide'
  },
  {
    id: 'tours-3',
    title: 'Weather API Integration',
    description: 'Seasonal planning implementation',
    question: 'Should weather integration automatically suggest optimal seasons, warn about conditions, or just provide guides with weather data?',
    category: 'tours',
    userType: 'guide'
  },
  {
    id: 'booking-1',
    title: 'Stripe Integration Architecture',
    description: 'Payment processing implementation',
    question: 'Should you use Stripe Connect to split payments between platform and guides, or collect then distribute payments?',
    category: 'booking',
    userType: 'both'
  },
  {
    id: 'booking-2',
    title: 'Dynamic Pricing Implementation',
    description: 'Group size pricing structure',
    question: 'Should pricing decrease per person as group size increases, or have fixed per-person rates regardless of group size?',
    category: 'booking',
    userType: 'both'
  },
  {
    id: 'booking-3',
    title: 'Add-ons and Equipment Pricing',
    description: 'Additional services structure',
    question: 'Should equipment rental, meals, and transport be optional add-ons during booking, or bundled into tour packages?',
    category: 'booking',
    userType: 'both'
  },
  {
    id: 'communication-1',
    title: 'In-App Messaging vs Email',
    description: 'Communication channel strategy',
    question: 'Should pre-trip communication happen primarily in-app with push notifications, via email, or hybrid approach?',
    category: 'communication',
    userType: 'both'
  },
  {
    id: 'communication-2',
    title: 'File Sharing Implementation',
    description: 'Document and photo sharing',
    question: 'Should the platform support sharing trip documents, route maps, and photos directly in messages, or via external links?',
    category: 'communication',
    userType: 'both'
  },
  {
    id: 'communication-3',
    title: 'Emergency Contact Integration',
    description: 'Safety communication features',
    question: 'Should emergency contacts be automatically notified when tours start/end, or only alerted if something goes wrong?',
    category: 'communication',
    userType: 'both'
  },
  {
    id: 'reviews-1',
    title: 'Review Categories Structure',
    description: 'Specific rating criteria implementation',
    question: 'Should you use the 7 categories from your wireframe (Guide expertise, Safety, Communication, Value, Route accuracy, Equipment, Overall), or simplify to fewer categories?',
    category: 'reviews',
    userType: 'both'
  },
  {
    id: 'reviews-2',
    title: 'Photo Upload Requirements',
    description: 'Visual review authenticity',
    question: 'Should photo uploads be required, optional, or encouraged with incentives for review authenticity?',
    category: 'reviews',
    userType: 'both'
  },
  {
    id: 'reviews-3',
    title: 'Guide Response System',
    description: 'Review response implementation',
    question: 'Should guides be able to respond publicly to reviews, privately message reviewers, or both?',
    category: 'reviews',
    userType: 'both'
  },
  {
    id: 'backend-1',
    title: 'Supabase RLS Policies',
    description: 'Database security implementation',
    question: 'How will you structure Row Level Security policies in Supabase to ensure guides only see their tours and hikers only see their bookings?',
    category: 'backend',
    userType: 'both'
  },
  {
    id: 'backend-2',
    title: 'Real-time Features Implementation',
    description: 'Live updates and notifications',
    question: 'Should you use Supabase real-time subscriptions for live chat, booking updates, and availability changes?',
    category: 'backend',
    userType: 'both'
  },
  {
    id: 'backend-3',
    title: 'Search Performance Strategy',
    description: 'Search and filtering optimization',
    question: 'Should you implement full-text search using Supabase\'s built-in search, add Elasticsearch, or use simpler database queries?',
    category: 'backend',
    userType: 'both'
  }
];

export function CompletedPlanningGuide() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const categories = ['all', 'landing', 'registration', 'search', 'tours', 'booking', 'communication', 'reviews', 'backend'];
  
  const filteredQuestions = selectedCategory === 'all' 
    ? questions 
    : questions.filter(q => q.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'landing': return <Users className="h-4 w-4" />;
      case 'registration': return <Users className="h-4 w-4" />;
      case 'search': return <MapPin className="h-4 w-4" />;
      case 'tours': return <MapPin className="h-4 w-4" />;
      case 'booking': return <CreditCard className="h-4 w-4" />;
      case 'communication': return <Users className="h-4 w-4" />;
      case 'reviews': return <CheckCircle className="h-4 w-4" />;
      case 'backend': return <Shield className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getUserTypeBadge = (userType: string) => {
    if (userType === 'guide') return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Guide Flow</Badge>;
    if (userType === 'hiker') return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Hiker Flow</Badge>;
    return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Both Users</Badge>;
  };

  const getCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const toggleQuestionDetails = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const exportDecisions = () => {
    const exportData = {
      projectName: 'MadeToHike.com',
      exportDate: new Date().toISOString(),
      status: 'Completed',
      totalQuestions: questions.length,
      answeredQuestions: completedAnswers.length,
      decisions: questions.map(q => {
        const answer = completedAnswers.find(a => a.questionId === q.id);
        return {
          category: q.category,
          userType: q.userType,
          title: q.title,
          question: q.question,
          decision: answer?.answer || '',
          followUpAnswers: answer?.followUpAnswers || []
        };
      })
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `madetohike-completed-decisions-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Save completed answers to localStorage for consistency
  useEffect(() => {
    localStorage.setItem('madetohike-guide-answers', JSON.stringify(completedAnswers));
    localStorage.setItem('madetohike-guide-state', JSON.stringify({
      currentQuestionIndex: questions.length - 1,
      currentAnswer: '',
      followUpAnswers: [],
      isComplete: true
    }));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Completion Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-6 w-6" />
            Planning Complete! 🎉
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={100} className="h-2" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">
                  All {questions.length} planning decisions have been completed for your MadeToHike marketplace.
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Ready to start development with clear technical requirements.
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDetailedView(!showDetailedView)}
                  className="flex items-center gap-2"
                >
                  {showDetailedView ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showDetailedView ? 'Hide Details' : 'View Details'}
                </Button>
                <Button onClick={exportDecisions} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Decisions
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Decision Summary by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex items-center gap-2"
              >
                {category !== 'all' && getCategoryIcon(category)}
                {category === 'all' ? 'All Categories' : getCategoryName(category)}
                <Badge variant="secondary">
                  {category === 'all' ? questions.length : questions.filter(q => q.category === category).length}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Questions and Decisions */}
      <ScrollArea className="h-96 w-full">
        <div className="space-y-4">
          {filteredQuestions.map((question, index) => {
            const answer = completedAnswers.find(a => a.questionId === question.id);
            const isExpanded = expandedQuestions.has(question.id);
            
            return (
              <Card key={question.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <Badge variant="outline" className="text-xs">
                          {getCategoryName(question.category)}
                        </Badge>
                        {getUserTypeBadge(question.userType)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleQuestionDetails(question.id)}
                    >
                      {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <CardTitle className="text-base">
                    Q{filteredQuestions.indexOf(question) + 1}: {question.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showDetailedView && (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">{question.question}</p>
                    </div>
                  )}
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="text-sm text-green-800 mb-2">✅ Decision Made:</h4>
                    <p className="text-sm text-green-700">{answer?.answer}</p>
                  </div>

                  {isExpanded && answer?.followUpAnswers && answer.followUpAnswers.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <h4 className="text-sm text-muted-foreground">Follow-up considerations:</h4>
                      {answer.followUpAnswers.map((followUp, i) => (
                        <div key={i} className="bg-blue-50 p-2 rounded text-sm text-blue-700 border-l-2 border-blue-200">
                          {followUp}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Recommended Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="text-blue-700 mb-2">1. Technical Setup</h4>
              <p className="text-sm text-blue-600">Implement Supabase backend, authentication, and database schema based on decisions</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="text-green-700 mb-2">2. MVP Development</h4>
              <p className="text-sm text-green-600">Build core flows: registration, tour creation, search, and booking based on specifications</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="text-purple-700 mb-2">3. Regional Launch</h4>
              <p className="text-sm text-purple-600">Start with Dolomites region, onboard initial guides, gather feedback</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}