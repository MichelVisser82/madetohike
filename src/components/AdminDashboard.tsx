import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar } from './ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { CheckCircle, XCircle, Clock, Eye, FileText, Shield, Users, TrendingUp, Download, ExternalLink, MapPin, Star } from 'lucide-react';

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
  created_at?: string;
}

interface VerificationRequest {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  documents: {
    business_license?: string;
    insurance_certificate?: string;
    certifications?: string[];
    id_verification?: string;
  };
  business_info: {
    company_name: string;
    license_number: string;
    insurance_info: string;
    experience_years: number;
    description: string;
  };
  rejection_reason?: string;
}

interface Tour {
  id: string;
  title: string;
  guide_id: string;
  guide_name: string;
  guide_email: string;
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
  status: 'pending_approval' | 'approved' | 'rejected' | 'active' | 'draft';
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
}

interface AdminDashboardProps {
  user: User;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{type: string, filename: string} | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVerificationRequests();
    loadPendingTours();
  }, []);

  const loadVerificationRequests = () => {
    // Mock data - in real app this would come from backend
    const mockRequests: VerificationRequest[] = [
      {
        id: '1',
        user_id: 'guide1',
        user_name: 'Marco Alpine',
        user_email: 'marco@alpineguides.com',
        status: 'pending',
        submitted_at: '2024-01-15T10:30:00Z',
        documents: {
          business_license: 'license_001.pdf',
          insurance_certificate: 'insurance_001.pdf',
          certifications: ['mountain_guide_cert.pdf', 'first_aid_cert.pdf'],
          id_verification: 'id_001.pdf'
        },
        business_info: {
          company_name: 'Alpine Adventures Italy',
          license_number: 'IT-AG-2024-001',
          insurance_info: 'Professional Liability: €2M, Public Liability: €5M',
          experience_years: 8,
          description: 'Certified mountain guide specializing in Dolomites tours with 8+ years experience.'
        }
      },
      {
        id: '2',
        user_id: 'guide2',
        user_name: 'Sarah Mountain',
        user_email: 'sarah@scotlandtreks.co.uk',
        status: 'pending',
        submitted_at: '2024-01-14T14:15:00Z',
        documents: {
          business_license: 'license_002.pdf',
          insurance_certificate: 'insurance_002.pdf',
          certifications: ['wilderness_first_aid.pdf'],
          id_verification: 'id_002.pdf'
        },
        business_info: {
          company_name: 'Scotland Highland Treks',
          license_number: 'UK-SHT-2024-002',
          insurance_info: 'Professional Indemnity: £3M, Public Liability: £6M',
          experience_years: 12,
          description: 'Experienced guide leading treks through Scottish Highlands and Islands.'
        }
      },
      {
        id: '3',
        user_id: 'guide3',
        user_name: 'Jean-Pierre Montagne',
        user_email: 'jp@pyreneesguides.fr',
        status: 'approved',
        submitted_at: '2024-01-10T09:00:00Z',
        reviewed_at: '2024-01-12T16:30:00Z',
        reviewed_by: 'admin@madetohike.com',
        documents: {
          business_license: 'license_003.pdf',
          insurance_certificate: 'insurance_003.pdf',
          certifications: ['guide_cert_fr.pdf', 'mountain_rescue.pdf'],
          id_verification: 'id_003.pdf'
        },
        business_info: {
          company_name: 'Pyrenees Adventure Tours',
          license_number: 'FR-PAT-2024-003',
          insurance_info: 'RC Professionnelle: €4M, RC Civile: €8M',
          experience_years: 15,
          description: 'Professional mountain guide with extensive experience in Pyrenees region.'
        }
      }
    ];

    const saved = localStorage.getItem('madetohike-verification-requests');
    if (saved) {
      try {
        setVerificationRequests(JSON.parse(saved));
      } catch (e) {
        setVerificationRequests(mockRequests);
        localStorage.setItem('madetohike-verification-requests', JSON.stringify(mockRequests));
      }
    } else {
      setVerificationRequests(mockRequests);
      localStorage.setItem('madetohike-verification-requests', JSON.stringify(mockRequests));
    }
  };

  const loadPendingTours = () => {
    // Mock tour data - in real app this would come from backend
    const mockTours: Tour[] = [
      {
        id: '1',
        title: 'Tre Cime di Lavaredo Sunrise Trek',
        guide_id: 'guide1',
        guide_name: 'Marco Alpine',
        guide_email: 'marco@alpineguides.com',
        region: 'dolomites',
        difficulty: 'moderate',
        duration: '10 hours',
        group_size: 8,
        price: 125,
        currency: 'EUR',
        description: 'Experience the iconic Three Peaks at sunrise with this early morning adventure. We\'ll start before dawn to witness one of the most spectacular sunrises in the Dolomites.',
        highlights: [
          'Sunrise views from Tre Cime di Lavaredo',
          'Professional photography tips',
          'Traditional mountain breakfast',
          'Small group experience (max 8 people)'
        ],
        includes: [
          'Professional mountain guide',
          'Safety equipment',
          'Mountain breakfast',
          'Transportation to trailhead',
          'Photography guide'
        ],
        meeting_point: 'Auronzo Hut Parking Area',
        status: 'pending_approval',
        created_at: '2024-01-16T08:30:00Z'
      },
      {
        id: '2',
        title: 'Ben Nevis Winter Climbing Course',
        guide_id: 'guide2',
        guide_name: 'Sarah Mountain',
        guide_email: 'sarah@scotlandtreks.co.uk',
        region: 'scotland',
        difficulty: 'expert',
        duration: '2 days',
        group_size: 4,
        price: 450,
        currency: 'GBP',
        description: 'Learn winter climbing techniques on Britain\'s highest peak. This intensive 2-day course covers ice axe techniques, crampon use, and winter navigation.',
        highlights: [
          'Winter climbing instruction',
          'Ben Nevis summit attempt',
          'Ice axe and crampon training',
          'Winter survival skills',
          'Small group (max 4 people)'
        ],
        includes: [
          'Certified mountain instructor',
          'All technical equipment',
          'Accommodation in mountain hut',
          'Meals and hot drinks',
          'Certificate of completion'
        ],
        meeting_point: 'Ben Nevis Visitor Centre, Fort William',
        status: 'pending_approval',
        created_at: '2024-01-15T14:20:00Z'
      },
      {
        id: '3',
        title: 'Pic du Midi Photography Workshop',
        guide_id: 'guide3',
        guide_name: 'Jean-Pierre Montagne',
        guide_email: 'jp@pyreneesguides.fr',
        region: 'pyrenees',
        difficulty: 'moderate',
        duration: '8 hours',
        group_size: 6,
        price: 180,
        currency: 'EUR',
        description: 'Combine hiking with photography in this specialized workshop in the Pyrenees. Perfect for photographers of all levels.',
        highlights: [
          'Photography instruction',
          'Stunning mountain views',
          'Technical camera tips',
          'Post-processing basics'
        ],
        includes: [
          'Professional photographer guide',
          'Photography instruction',
          'Lunch and refreshments',
          'Digital photo review session'
        ],
        meeting_point: 'Pic du Midi Cable Car Station',
        status: 'approved',
        created_at: '2024-01-12T11:15:00Z',
        reviewed_at: '2024-01-14T09:30:00Z',
        reviewed_by: 'admin@madetohike.com'
      }
    ];

    const saved = localStorage.getItem('madetohike-tours');
    if (saved) {
      try {
        const allTours = JSON.parse(saved);
        setTours(allTours.filter((tour: Tour) => 
          tour.status === 'pending_approval' || tour.status === 'approved' || tour.status === 'rejected'
        ));
      } catch (e) {
        setTours(mockTours);
        localStorage.setItem('madetohike-tours', JSON.stringify(mockTours));
      }
    } else {
      setTours(mockTours);
      localStorage.setItem('madetohike-tours', JSON.stringify(mockTours));
    }
  };

  const handleApproveRequest = (requestId: string) => {
    setLoading(true);
    
    const updatedRequests = verificationRequests.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: 'approved' as const, 
            reviewed_at: new Date().toISOString(),
            reviewed_by: user.email 
          }
        : req
    );
    
    setVerificationRequests(updatedRequests);
    localStorage.setItem('madetohike-verification-requests', JSON.stringify(updatedRequests));
    
    // Update the user's verification status
    const users = JSON.parse(localStorage.getItem('madetohike-users') || '[]');
    const updatedUsers = users.map((u: User) => 
      u.id === verificationRequests.find(r => r.id === requestId)?.user_id
        ? { ...u, verified: true, verification_status: 'approved' }
        : u
    );
    localStorage.setItem('madetohike-users', JSON.stringify(updatedUsers));
    
    setLoading(false);
    setSelectedRequest(null);
  };

  const handleRejectRequest = (requestId: string, reason: string) => {
    setLoading(true);
    
    const updatedRequests = verificationRequests.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: 'rejected' as const, 
            reviewed_at: new Date().toISOString(),
            reviewed_by: user.email,
            rejection_reason: reason
          }
        : req
    );
    
    setVerificationRequests(updatedRequests);
    localStorage.setItem('madetohike-verification-requests', JSON.stringify(updatedRequests));
    
    // Update the user's verification status
    const users = JSON.parse(localStorage.getItem('madetohike-users') || '[]');
    const updatedUsers = users.map((u: User) => 
      u.id === verificationRequests.find(r => r.id === requestId)?.user_id
        ? { ...u, verified: false, verification_status: 'rejected' }
        : u
    );
    localStorage.setItem('madetohike-users', JSON.stringify(updatedUsers));
    
    setLoading(false);
    setSelectedRequest(null);
  };

  const handleApproveTour = (tourId: string) => {
    setLoading(true);
    
    const updatedTours = tours.map(tour => 
      tour.id === tourId 
        ? { 
            ...tour, 
            status: 'approved' as const, 
            reviewed_at: new Date().toISOString(),
            reviewed_by: user.email 
          }
        : tour
    );
    
    setTours(updatedTours);
    localStorage.setItem('madetohike-tours', JSON.stringify(updatedTours));
    
    setLoading(false);
    setSelectedTour(null);
  };

  const handleRejectTour = (tourId: string, reason: string) => {
    setLoading(true);
    
    const updatedTours = tours.map(tour => 
      tour.id === tourId 
        ? { 
            ...tour, 
            status: 'rejected' as const, 
            reviewed_at: new Date().toISOString(),
            reviewed_by: user.email,
            rejection_reason: reason
          }
        : tour
    );
    
    setTours(updatedTours);
    localStorage.setItem('madetohike-tours', JSON.stringify(updatedTours));
    
    setLoading(false);
    setSelectedTour(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
      case 'pending_approval':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'EUR' ? '€' : '£';
    return `${symbol}${price}`;
  };

  const pendingCount = verificationRequests.filter(req => req.status === 'pending').length;
  const approvedCount = verificationRequests.filter(req => req.status === 'approved').length;
  const rejectedCount = verificationRequests.filter(req => req.status === 'rejected').length;
  
  const pendingToursCount = tours.filter(tour => tour.status === 'pending_approval').length;
  const approvedToursCount = tours.filter(tour => tour.status === 'approved').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage guide verification requests, tour approvals, and platform administration</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Guides</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved Guides</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Tours</p>
                <p className="text-2xl font-bold text-orange-600">{pendingToursCount}</p>
              </div>
              <MapPin className="w-8 h-8 text-orange-600" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved Tours</p>
                <p className="text-2xl font-bold text-blue-600">{approvedToursCount}</p>
              </div>
              <Star className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-purple-600">{verificationRequests.length + 156}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>

        <Tabs defaultValue="guides" className="space-y-6">
          <TabsList>
            <TabsTrigger value="guides">
              Guide Verification
            </TabsTrigger>
            <TabsTrigger value="tours">
              Tour Approval ({pendingToursCount} pending)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guides">
            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList>
                <TabsTrigger value="pending">
                  Pending ({pendingCount})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({approvedCount})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({rejectedCount})
                </TabsTrigger>
                <TabsTrigger value="all">
                  All Requests ({verificationRequests.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <VerificationRequestsList 
                  requests={verificationRequests.filter(req => req.status === 'pending')}
                  onViewRequest={setSelectedRequest}
                />
              </TabsContent>

              <TabsContent value="approved">
                <VerificationRequestsList 
                  requests={verificationRequests.filter(req => req.status === 'approved')}
                  onViewRequest={setSelectedRequest}
                />
              </TabsContent>

              <TabsContent value="rejected">
                <VerificationRequestsList 
                  requests={verificationRequests.filter(req => req.status === 'rejected')}
                  onViewRequest={setSelectedRequest}
                />
              </TabsContent>

              <TabsContent value="all">
                <VerificationRequestsList 
                  requests={verificationRequests}
                  onViewRequest={setSelectedRequest}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="tours">
            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList>
                <TabsTrigger value="pending">
                  Pending Approval ({pendingToursCount})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({approvedToursCount})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <ToursList 
                  tours={tours.filter(tour => tour.status === 'pending_approval')}
                  onViewTour={setSelectedTour}
                  getDifficultyColor={getDifficultyColor}
                  formatPrice={formatPrice}
                />
              </TabsContent>

              <TabsContent value="approved">
                <ToursList 
                  tours={tours.filter(tour => tour.status === 'approved')}
                  onViewTour={setSelectedTour}
                  getDifficultyColor={getDifficultyColor}
                  formatPrice={formatPrice}
                />
              </TabsContent>

              <TabsContent value="rejected">
                <ToursList 
                  tours={tours.filter(tour => tour.status === 'rejected')}
                  onViewTour={setSelectedTour}
                  getDifficultyColor={getDifficultyColor}
                  formatPrice={formatPrice}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>

        {/* Verification Request Detail Modal */}
        {selectedRequest && (
          <VerificationRequestDetail
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            onApprove={() => handleApproveRequest(selectedRequest.id)}
            onReject={(reason) => handleRejectRequest(selectedRequest.id, reason)}
            onViewDocument={setSelectedDocument}
            loading={loading}
          />
        )}

        {/* Tour Detail Modal */}
        {selectedTour && (
          <TourDetail
            tour={selectedTour}
            onClose={() => setSelectedTour(null)}
            onApprove={() => handleApproveTour(selectedTour.id)}
            onReject={(reason) => handleRejectTour(selectedTour.id, reason)}
            loading={loading}
            getDifficultyColor={getDifficultyColor}
            formatPrice={formatPrice}
          />
        )}

        {/* Document Viewer Modal */}
        {selectedDocument && (
          <DocumentViewer
            document={selectedDocument}
            onClose={() => setSelectedDocument(null)}
          />
        )}
      </div>
    </div>
  );
}

function VerificationRequestsList({ 
  requests, 
  onViewRequest 
}: { 
  requests: VerificationRequest[];
  onViewRequest: (request: VerificationRequest) => void;
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (requests.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No verification requests</h3>
        <p className="text-muted-foreground">No requests found in this category.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12 bg-primary/10">
                <div className="w-full h-full flex items-center justify-center">
                  {request.user_name.charAt(0).toUpperCase()}
                </div>
              </Avatar>
              
              <div>
                <h3 className="font-semibold">{request.user_name}</h3>
                <p className="text-sm text-muted-foreground">{request.user_email}</p>
                <p className="text-sm text-muted-foreground">{request.business_info.company_name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Submitted: {new Date(request.submitted_at).toLocaleDateString()}
                </p>
                {request.reviewed_at && (
                  <p className="text-sm text-muted-foreground">
                    Reviewed: {new Date(request.reviewed_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              {getStatusBadge(request.status)}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewRequest(request)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
            <span>Experience: {request.business_info.experience_years} years</span>
            <span>License: {request.business_info.license_number}</span>
            <span>Documents: {Object.keys(request.documents).length} files</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ToursList({ 
  tours, 
  onViewTour,
  getDifficultyColor,
  formatPrice
}: { 
  tours: Tour[];
  onViewTour: (tour: Tour) => void;
  getDifficultyColor: (difficulty: string) => string;
  formatPrice: (price: number, currency: string) => string;
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (tours.length === 0) {
    return (
      <Card className="p-8 text-center">
        <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No tours</h3>
        <p className="text-muted-foreground">No tours found in this category.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tours.map((tour) => (
        <Card key={tour.id} className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{tour.title}</h3>
                  <p className="text-muted-foreground">
                    by {tour.guide_name} • {tour.region.charAt(0).toUpperCase() + tour.region.slice(1)} • {tour.duration}
                  </p>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(tour.status)}
                  <Badge className={getDifficultyColor(tour.difficulty)}>
                    {tour.difficulty}
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tour.description}</p>
              
              <div className="grid md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <div className="text-muted-foreground">Price</div>
                  <div className="font-medium">{formatPrice(tour.price, tour.currency)}/person</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Group Size</div>
                  <div className="font-medium">Max {tour.group_size}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Submitted</div>
                  <div className="font-medium">{new Date(tour.created_at).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Guide Email</div>
                  <div className="font-medium text-xs">{tour.guide_email}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onViewTour(tour)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Review Tour
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function VerificationRequestDetail({
  request,
  onClose,
  onApprove,
  onReject,
  onViewDocument,
  loading
}: {
  request: VerificationRequest;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
  onViewDocument: (doc: {type: string, filename: string}) => void;
  loading: boolean;
}) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Verification Request Details</h2>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Guide Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Guide Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p>{request.user_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p>{request.user_email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Company</label>
                <p>{request.business_info.company_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Experience</label>
                <p>{request.business_info.experience_years} years</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">License Number</label>
                <p>{request.business_info.license_number}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Insurance Information</label>
                <p>{request.business_info.insurance_info}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p>{request.business_info.description}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Submitted Documents</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(request.documents).map(([type, filename]) => (
                <div key={type} className="flex items-center gap-3 p-3 border rounded-lg">
                  <FileText className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium capitalize">{type.replace('_', ' ')}</p>
                    <p className="text-sm text-muted-foreground">
                      {Array.isArray(filename) ? `${filename.length} files` : filename}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onViewDocument({
                      type: type.replace('_', ' '),
                      filename: Array.isArray(filename) ? filename[0] : filename || ''
                    })}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Status and Actions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Request Status</h3>
            <div className="flex items-center gap-4 mb-4">
              <span>Status:</span>
              {request.status === 'pending' && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Clock className="w-3 h-3 mr-1" />Pending Review
                </Badge>
              )}
              {request.status === 'approved' && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />Approved
                </Badge>
              )}
              {request.status === 'rejected' && (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  <XCircle className="w-3 h-3 mr-1" />Rejected
                </Badge>
              )}
            </div>

            {request.status === 'pending' && (
              <div className="flex gap-3">
                <Button 
                  onClick={onApprove}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Guide
                </Button>
                
                <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={loading}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Request
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reject Verification Request</AlertDialogTitle>
                      <AlertDialogDescription>
                        Please provide a reason for rejecting this verification request. This will be sent to the guide.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                      <textarea 
                        className="w-full p-3 border rounded-lg resize-none"
                        rows={4}
                        placeholder="Enter rejection reason..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => {
                          onReject(rejectionReason);
                          setShowRejectDialog(false);
                          setRejectionReason('');
                        }}
                        disabled={!rejectionReason.trim()}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Reject Request
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            {request.rejection_reason && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-medium text-red-800">Rejection Reason:</p>
                <p className="text-red-700">{request.rejection_reason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TourDetail({
  tour,
  onClose,
  onApprove,
  onReject,
  loading,
  getDifficultyColor,
  formatPrice
}: {
  tour: Tour;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
  loading: boolean;
  getDifficultyColor: (difficulty: string) => string;
  formatPrice: (price: number, currency: string) => string;
}) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Tour Review</h2>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Tour Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tour Details</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-2xl">{tour.title}</h4>
                <p className="text-muted-foreground">
                  by {tour.guide_name} • {tour.guide_email}
                </p>
              </div>
              
              <div className="flex gap-3">
                <Badge className={getDifficultyColor(tour.difficulty)}>
                  {tour.difficulty}
                </Badge>
                <Badge variant="outline">
                  {tour.region.charAt(0).toUpperCase() + tour.region.slice(1)}
                </Badge>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Duration</label>
                  <p>{tour.duration}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Group Size</label>
                  <p>Max {tour.group_size} people</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Price</label>
                  <p>{formatPrice(tour.price, tour.currency)} per person</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="mt-1">{tour.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Highlights</label>
                <ul className="mt-1 space-y-1">
                  {tour.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Includes</label>
                <ul className="mt-1 space-y-1">
                  {tour.includes.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Meeting Point</label>
                <p className="mt-1">{tour.meeting_point}</p>
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Review Status</h3>
            <div className="flex items-center gap-4 mb-4">
              <span>Status:</span>
              {tour.status === 'pending_approval' && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Clock className="w-3 h-3 mr-1" />Pending Approval
                </Badge>
              )}
              {tour.status === 'approved' && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />Approved
                </Badge>
              )}
              {tour.status === 'rejected' && (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  <XCircle className="w-3 h-3 mr-1" />Rejected
                </Badge>
              )}
            </div>

            {tour.status === 'pending_approval' && (
              <div className="flex gap-3">
                <Button 
                  onClick={onApprove}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Tour
                </Button>
                
                <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={loading}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Tour
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reject Tour</AlertDialogTitle>
                      <AlertDialogDescription>
                        Please provide a reason for rejecting this tour. This will be sent to the guide.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                      <textarea 
                        className="w-full p-3 border rounded-lg resize-none"
                        rows={4}
                        placeholder="Enter rejection reason..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => {
                          onReject(rejectionReason);
                          setShowRejectDialog(false);
                          setRejectionReason('');
                        }}
                        disabled={!rejectionReason.trim()}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Reject Tour
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            {tour.rejection_reason && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-medium text-red-800">Rejection Reason:</p>
                <p className="text-red-700">{tour.rejection_reason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentViewer({
  document,
  onClose
}: {
  document: {type: string, filename: string};
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Document Viewer</h2>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <FileText className="w-12 h-12 text-primary" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">{document.type}</h3>
              <p className="text-muted-foreground">{document.filename}</p>
            </div>

            {/* Mock document preview */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 bg-gray-50">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-32 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Document preview would appear here in a real application
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}