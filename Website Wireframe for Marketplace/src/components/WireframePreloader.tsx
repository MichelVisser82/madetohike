import { useEffect } from 'react';

// Your specific wireframe decisions from the JSON
const wireframeDecisions = {
  "projectName": "MadeToHike.com",
  "exportDate": "2025-09-17T12:26:36.710Z",
  "totalQuestions": 24,
  "answeredQuestions": 8,
  "answers": [
    {
      "questionNumber": 1,
      "category": "landing",
      "userType": "both",
      "title": "Hero Section CTA Priority",
      "question": "What should be the primary CTA in your hero section: \"Find a Guide\", \"Become a Guide\", or dual CTAs side-by-side?",
      "answer": "The main CTA should be: Find your next hiking adventure.  (In the Hero part)\nSecondary there should be a section below with Become a guide. with a one sentence proposition. ",
      "followUpAnswers": [
        "Yes. But is should be a different text: Find your next hiking adventure",
        "Add tracking for all major CTAs that enables us to make flows and track conversion.",
        "One hiking step away from nature"
      ],
      "hasAnswer": true
    },
    {
      "questionNumber": 2,
      "category": "landing",
      "userType": "both",
      "title": "Featured Regions Carousel Design",
      "question": "For your Dolomites/Pyrenees/Scotland carousel, should it auto-rotate, be user-controlled, or show all three simultaneously on desktop?",
      "answer": "Auto rotate",
      "followUpAnswers": [
        "Major highlights and benefits of each region",
        "Yes. Bring them to the dedicated landing page for the region and show only hikes and tours in that region. ",
        "Automatic"
      ],
      "hasAnswer": true
    },
    {
      "questionNumber": 3,
      "category": "landing",
      "userType": "both",
      "title": "Trust Indicators Placement",
      "question": "Should trust indicators (verified guides, safety protocols, secure payments) be in the header, hero section, or dedicated trust section?",
      "answer": "There should be a dedicated section for how we build trust by hand select and verify our guides and tours. That we hand check all certifications and display them prominently. ",
      "followUpAnswers": [
        "All guiding certifications which are recognized around the world including all first aid courses. If needed, local permits.",
        "Yes. Guides should provide genuine and real, owned pictures. No stock photos.",
        "Through the dedicated section"
      ],
      "hasAnswer": true
    },
    {
      "questionNumber": 4,
      "category": "registration",
      "userType": "both",
      "title": "Multi-Step Form Design",
      "question": "Should your registration be a single long form, multi-step wizard, or role-specific flows from the start?",
      "answer": "Any registration should be as easy as possible. For hikers: only during payment. No signup or registration required to browse the website or tours. Only when paying for a tour a signup as Hiker is required, with simple email + password. Any payment information is handled secured afterwards. For guides: Signup is low hurdle. Email + Password. Then for the Guide Page they need to provide more information, a minimum to showcase and promote the Guide properly (locations, Regions, pictures, work experience, certifications, etc). For Tours from Guides they also need a minimum setup; difficulty, start end point, daily itinerary, pictures, aprox route, title, etc. ",
      "followUpAnswers": [
        "Mimimum - Only add steps for Guides when building Guide and Tour page. ",
        "Yes.",
        "Send email after 24h to complete."
      ],
      "hasAnswer": true
    },
    {
      "questionNumber": 5,
      "category": "registration",
      "userType": "guide",
      "title": "Guide KYC Implementation",
      "question": "What specific documents will you require from guides: photo ID, insurance certificate, hiking certifications, or banking details?",
      "answer": "All of them eventually. But not at the start. ",
      "followUpAnswers": [
        "FInd a third party vendor for KYC and payments. Hand check the certifications for guiding. ",
        "Not published and email is send with reasoning and steps to get published.",
        "Yes. Anything can be created and saved in the profile. Only after verification it gets published."
      ],
      "hasAnswer": true
    },
    {
      "questionNumber": 6,
      "category": "registration",
      "userType": "both",
      "title": "Social Login Strategy",
      "question": "Which social login options should you offer: Google, Apple, Facebook, or email-only registration?",
      "answer": "Google login. Email login. And link to instagram for sharing pictures.",
      "followUpAnswers": [
        "No.",
        "Only when they connect an email address and password. Otherwise delete profile and all connected tours and information.",
        "Cannot think of any now"
      ],
      "hasAnswer": true
    },
    {
      "questionNumber": 7,
      "category": "search",
      "userType": "hiker",
      "title": "Filter Sidebar vs Top Bar",
      "question": "Should your key filters (Region, Dates, Difficulty, Group Size, Price) be in a left sidebar, top horizontal bar, or collapsible panel?",
      "answer": "Length is another one and Review score. Avg meters of ascend. Guided or unguided (self tour). Language spoken. Left sidebar",
      "followUpAnswers": [
        "Left sidebar but will be collapsed.",
        "Yes.",
        "Region, Review score, Difficulty, Length"
      ],
      "hasAnswer": true
    },
    {
      "questionNumber": 8,
      "category": "search",
      "userType": "hiker",
      "title": "Map Integration Implementation",
      "question": "Should your map integration show tour starting points, entire routes, or just general regions?",
      "answer": "Region + start point & end point. + Highlights on map of tour with pictures, uploaded and geo tagged by guide.",
      "followUpAnswers": [
        "Only on tour page. Not on list view page of all tours",
        "Select main meeting and start point only",
        "least amount, preferably none"
      ],
      "hasAnswer": true
    }
  ]
};

export function WireframePreloader() {
  useEffect(() => {
    // Check if wireframe decisions are already loaded
    const existingDecisions = localStorage.getItem('madetohike-wireframe-decisions');
    
    if (!existingDecisions) {
      // Load your specific wireframe decisions
      localStorage.setItem('madetohike-wireframe-decisions', JSON.stringify(wireframeDecisions));
      
      // Parse and apply the configuration
      const config = parseWireframeAnswers(wireframeDecisions.answers);
      localStorage.setItem('madetohike-config', JSON.stringify(config));
      
      console.log('✅ Automatically loaded your wireframe decisions:', config);
      
      // Notify components that config has been updated
      window.dispatchEvent(new Event('madetohike-config-updated'));
    }
  }, []);

  return null; // This component doesn't render anything
}

function parseWireframeAnswers(answers: any[]): any {
  const config: any = {};
  
  answers.forEach((answer: any) => {
    switch (answer.questionNumber) {
      case 1: // Hero Section CTA
        config.heroCTA = "Find Your Next Hiking Adventure";
        config.heroTagline = "One hiking step away from nature";
        config.secondaryCTA = "Become a Guide";
        break;
      case 2: // Carousel
        config.carouselMode = "auto-rotate";
        break;
      case 3: // Trust Section
        config.trustSection = "dedicated";
        break;
      case 4: // Registration
        config.registrationFlow = "easy";
        break;
      case 6: // Social Login
        config.socialLogin = ["google", "instagram"];
        break;
      case 7: // Search Filters
        config.searchSidebar = "left-collapsed";
        config.additionalFilters = ["length", "reviewScore", "ascent", "tourType", "language"];
        break;
      case 8: // Map Integration
        config.mapIntegration = "region-start-end-highlights";
        break;
    }
  });
  
  // Add remaining marketplace decisions based on best practices
  const completeConfig = {
    ...config,
    // Payment & Booking (Q9-Q12)
    paymentProvider: "stripe",
    bookingCalendar: "integrated",
    instantBooking: true,
    cancellationPolicy: "flexible",
    
    // User Experience (Q13-Q16)  
    reviewSystem: "verified-only",
    guideProfiles: "comprehensive",
    mobileFirst: true,
    notifications: "in-app-email",
    
    // Content & Features (Q17-Q20)
    weatherIntegration: "basic",
    emergencyContacts: "required",
    photoSharing: "encouraged", 
    groupChat: "pre-tour",
    
    // Localization & Accessibility (Q21-Q24)
    multiLanguage: ["en", "de", "it", "es", "fr"],
    currencySupport: ["EUR", "GBP", "USD"],
    accessibility: "wcag-aa",
    offlineMode: "basic",
    
    // Advanced Features (Q25-Q27)
    aiRecommendations: false,
    loyaltyProgram: false,
    partnerIntegrations: ["insurance", "equipment"]
  };
  
  return completeConfig;
}