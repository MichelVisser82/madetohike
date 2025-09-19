import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { SearchPage } from './components/SearchPage';
import { TourDetailPage } from './components/TourDetailPage';
import { AuthModal } from './components/AuthModal';
import { GuideSignupModal } from './components/GuideSignupModal';
import { HikerRegistrationModal } from './components/HikerRegistrationModal';
import { UserDashboard } from './components/UserDashboard';
import { GuideDashboard } from './components/GuideDashboard';
import { BookingFlow } from './components/BookingFlow';
import { DecisionManager } from './components/DecisionManager';
import { WireframePreloader } from './components/WireframePreloader';
import { WireframeNotification } from './components/WireframeNotification';
import { WireframeDesign } from './components/WireframeDesign';
import { AdminDashboard } from './components/AdminDashboard';
import { VerificationFlow } from './components/VerificationFlow';

type Page = 'landing' | 'search' | 'tour-detail' | 'user-dashboard' | 'guide-dashboard' | 'admin-dashboard' | 'verification' | 'booking' | 'settings' | 'wireframe';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'hiker' | 'guide' | 'admin';
  verified: boolean;
  verification_status?: 'pending' | 'approved' | 'rejected' | 'not_requested';
  verification_documents?: string[];
  business_info?: {
    company_name?: string;
    license_number?: string;
    insurance_info?: string;
    experience_years?: number;
  };
}

interface Tour {
  id: string;
  title: string;
  guide_id: string;
  guide_name: string;
  guide_avatar: string;
  region: 'dolomites' | 'pyrenees' | 'scotland';
  difficulty: 'easy' | 'moderate' | 'challenging' | 'expert';
  duration: string;
  group_size: number;
  price: number;
  currency: 'EUR' | 'GBP';
  description: string;
  highlights: string[];
  includes: string[];
  meeting_point: string;
  images: string[];
  available_dates: string[];
  rating: number;
  reviews_count: number;
  created_at: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showGuideSignupModal, setShowGuideSignupModal] = useState(false);
  const [showHikerRegistrationModal, setShowHikerRegistrationModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    region: '',
    difficulty: '',
    dateRange: '',
    maxPrice: ''
  });
  const [wireframeDecisions, setWireframeDecisions] = useState<any>(null);

  // Mock user authentication - in real app this would use Supabase auth
  useEffect(() => {
    const savedUser = localStorage.getItem('madetohike-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Load wireframe decisions
    const savedDecisions = localStorage.getItem('madetohike-wireframe-decisions');
    if (savedDecisions) {
      try {
        setWireframeDecisions(JSON.parse(savedDecisions));
      } catch (e) {
        console.error('Failed to load wireframe decisions:', e);
      }
    }

    // Initialize sample users for testing
    const sampleUsers = [
      {
        id: 'admin',
        email: 'admin@madetohike.com',
        name: 'Admin User',
        role: 'admin',
        verified: true,
        verification_status: 'approved'
      },
      {
        id: 'guide1',
        email: 'marco@alpineguides.com',
        name: 'Marco Alpine',
        role: 'guide',
        verified: false,
        verification_status: 'pending',
        business_info: {
          company_name: 'Alpine Adventures Italy',
          license_number: 'IT-AG-2024-001',
          insurance_info: 'Professional Liability: €2M, Public Liability: €5M',
          experience_years: 8
        }
      },
      {
        id: 'guide2',
        email: 'sarah@scotlandtreks.co.uk',
        name: 'Sarah Mountain',
        role: 'guide',
        verified: false,
        verification_status: 'pending',
        business_info: {
          company_name: 'Scotland Highland Treks',
          license_number: 'UK-SHT-2024-002',
          insurance_info: 'Professional Indemnity: £3M, Public Liability: £6M',
          experience_years: 12
        }
      }
    ];

    const existingUsers = localStorage.getItem('madetohike-users');
    if (!existingUsers) {
      localStorage.setItem('madetohike-users', JSON.stringify(sampleUsers));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('madetohike-user', JSON.stringify(userData));
    setShowAuthModal(false);
  };

  const handleGuideSignup = (userData: User) => {
    setUser(userData);
    localStorage.setItem('madetohike-user', JSON.stringify(userData));
    setShowGuideSignupModal(false);
  };

  const handleHikerRegistration = (userData: User) => {
    setUser(userData);
    localStorage.setItem('madetohike-user', JSON.stringify(userData));
    setShowHikerRegistrationModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('madetohike-user');
    setCurrentPage('landing');
  };

  const navigateToSearch = (filters = {}) => {
    setSearchFilters({ ...searchFilters, ...filters });
    setCurrentPage('search');
  };

  const navigateToTour = (tour: Tour) => {
    setSelectedTour(tour);
    setCurrentPage('tour-detail');
  };

  const navigateToBooking = (tour: Tour) => {
    setSelectedTour(tour);
    if (!user) {
      setShowHikerRegistrationModal(true);
    } else {
      setCurrentPage('booking');
    }
  };

  const navigateToDashboard = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (user.role === 'admin') {
      setCurrentPage('admin-dashboard');
    } else if (user.role === 'guide') {
      setCurrentPage('guide-dashboard');
    } else {
      setCurrentPage('user-dashboard');
    }
  };

  const navigateToVerification = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setCurrentPage('verification');
  };

  const handleApplyDecisions = (decisions: any) => {
    setWireframeDecisions(decisions);
    if (decisions) {
      console.log('Applied wireframe decisions:', decisions);
      // Here you would apply the decisions to customize the marketplace
      // This could involve updating design tokens, feature flags, etc.
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage 
            onNavigateToSearch={navigateToSearch}
            onShowAuth={() => setShowAuthModal(true)}
            onShowGuideSignup={() => setShowGuideSignupModal(true)}
            user={user}
            onNavigateToDashboard={navigateToDashboard}
          />
        );
      case 'search':
        return (
          <SearchPage 
            filters={searchFilters}
            onFiltersChange={setSearchFilters}
            onTourClick={navigateToTour}
            onBookTour={navigateToBooking}
          />
        );
      case 'tour-detail':
        return selectedTour ? (
          <TourDetailPage 
            tour={selectedTour}
            onBookTour={navigateToBooking}
            onBackToSearch={() => setCurrentPage('search')}
          />
        ) : null;
      case 'user-dashboard':
        return user ? (
          <UserDashboard 
            user={user}
            onNavigateToSearch={navigateToSearch}
            onTourClick={navigateToTour}
          />
        ) : null;
      case 'guide-dashboard':
        return user ? (
          <GuideDashboard 
            user={user}
            onTourClick={navigateToTour}
            onStartVerification={navigateToVerification}
          />
        ) : null;
      case 'admin-dashboard':
        return user && user.role === 'admin' ? (
          <AdminDashboard 
            user={user}
          />
        ) : null;
      case 'verification':
        return user && user.role === 'guide' ? (
          <VerificationFlow 
            user={user}
            onComplete={() => setCurrentPage('guide-dashboard')}
            onCancel={() => setCurrentPage('guide-dashboard')}
          />
        ) : null;
      case 'booking':
        return selectedTour && user ? (
          <BookingFlow 
            tour={selectedTour}
            user={user}
            onComplete={() => setCurrentPage('user-dashboard')}
            onCancel={() => setCurrentPage('tour-detail')}
          />
        ) : null;
      case 'settings':
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-8">Marketplace Settings</h1>
              <DecisionManager onApplyDecisions={handleApplyDecisions} />
            </div>
          </div>
        );
      case 'wireframe':
        return <WireframeDesign />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Auto-load wireframe decisions */}
      <WireframePreloader />
      
      {/* Global Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setCurrentPage('landing')}
              className="flex items-center gap-2 hover:opacity-80"
            >
              <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,6L10.25,11L14,16L15.5,14.5L13.25,11L15.5,7.5L14,6M9.5,6L8,7.5L10.25,11L8,14.5L9.5,16L13.25,11L9.5,6Z"/>
                <path d="M4.5,3C3.67,3 3,3.67 3,4.5V19.5C3,20.33 3.67,21 4.5,21H19.5C20.33,21 21,20.33 21,19.5V4.5C21,3.67 20.33,3 19.5,3H4.5Z"/>
              </svg>
              <div>
                <div className="text-lg font-semibold">MadeToHike</div>
                <div className="text-xs text-muted-foreground">Guided Adventures</div>
              </div>
            </button>

            <div className="flex items-center gap-4">
              {currentPage !== 'search' && (
                <button 
                  onClick={() => navigateToSearch()}
                  className="text-sm hover:text-primary"
                >
                  Find Tours
                </button>
              )}
              
              <button 
                onClick={() => setCurrentPage('settings')}
                className="text-sm hover:text-primary"
              >
                Settings
              </button>
              
              <button 
                onClick={() => setCurrentPage('wireframe')}
                className="text-sm hover:text-primary"
              >
                Wireframes
              </button>

              {user && user.role === 'admin' && (
                <button 
                  onClick={() => setCurrentPage('admin-dashboard')}
                  className="text-sm hover:text-primary"
                >
                  Admin Panel
                </button>
              )}
              
              {user ? (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={navigateToDashboard}
                    className="text-sm hover:text-primary"
                  >
                    Dashboard
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowAuthModal(true)}
                    className="text-sm hover:text-primary"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => setShowGuideSignupModal(true)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90"
                  >
                    Become a Guide
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>
        {renderCurrentPage()}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      )}

      {/* Guide Signup Modal */}
      {showGuideSignupModal && (
        <GuideSignupModal 
          onClose={() => setShowGuideSignupModal(false)}
          onSignup={handleGuideSignup}
        />
      )}

      {/* Hiker Registration Modal */}
      {showHikerRegistrationModal && selectedTour && (
        <HikerRegistrationModal 
          onClose={() => {
            setShowHikerRegistrationModal(false);
            setSelectedTour(null);
          }}
          onRegister={(user) => {
            handleHikerRegistration(user);
            // Don't change page immediately, let the booking flow handle it
            setShowHikerRegistrationModal(false);
            setCurrentPage('booking');
          }}
          tourTitle={selectedTour.title}
        />
      )}

      {/* Wireframe Decisions Notification */}
      <WireframeNotification />
    </div>
  );
}