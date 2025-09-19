import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Upload, FileText, CheckCircle, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';

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

interface VerificationFlowProps {
  user: User;
  onComplete: () => void;
  onCancel: () => void;
}

interface DocumentUpload {
  type: string;
  file: File | null;
  uploaded: boolean;
}

export function VerificationFlow({ user, onComplete, onCancel }: VerificationFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [businessInfo, setBusinessInfo] = useState({
    company_name: user.business_info?.company_name || '',
    license_number: user.business_info?.license_number || '',
    insurance_info: user.business_info?.insurance_info || '',
    experience_years: user.business_info?.experience_years || 0,
    description: ''
  });

  const [documents, setDocuments] = useState<DocumentUpload[]>([
    { type: 'Business License', file: null, uploaded: false },
    { type: 'Insurance Certificate', file: null, uploaded: false },
    { type: 'Professional Certifications', file: null, uploaded: false },
    { type: 'ID Verification', file: null, uploaded: false }
  ]);

  const [submitting, setSubmitting] = useState(false);

  const handleFileUpload = (index: number, file: File) => {
    const updatedDocs = [...documents];
    updatedDocs[index] = { ...updatedDocs[index], file, uploaded: true };
    setDocuments(updatedDocs);
  };

  const removeFile = (index: number) => {
    const updatedDocs = [...documents];
    updatedDocs[index] = { ...updatedDocs[index], file: null, uploaded: false };
    setDocuments(updatedDocs);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return businessInfo.company_name && businessInfo.license_number && businessInfo.insurance_info && businessInfo.experience_years > 0;
      case 2:
        return documents.filter(doc => doc.uploaded).length >= 3; // At least 3 documents required
      case 3:
        return businessInfo.description.length >= 100; // At least 100 characters
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create verification request
    const verificationRequest = {
      id: Date.now().toString(),
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      status: 'pending',
      submitted_at: new Date().toISOString(),
      documents: {
        business_license: documents[0].file?.name,
        insurance_certificate: documents[1].file?.name,
        certifications: documents[2].file?.name ? [documents[2].file.name] : [],
        id_verification: documents[3].file?.name
      },
      business_info: businessInfo
    };

    // Save to localStorage (in real app, this would go to backend)
    const existingRequests = JSON.parse(localStorage.getItem('madetohike-verification-requests') || '[]');
    existingRequests.push(verificationRequest);
    localStorage.setItem('madetohike-verification-requests', JSON.stringify(existingRequests));

    // Update user's verification status
    const updatedUser = {
      ...user,
      verification_status: 'pending',
      business_info: businessInfo
    };
    localStorage.setItem('madetohike-user', JSON.stringify(updatedUser));

    setSubmitting(false);
    onComplete();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Business Information</h2>
              <p className="text-muted-foreground">Provide your business details and credentials</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Company Name *</label>
                <Input
                  value={businessInfo.company_name}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, company_name: e.target.value })}
                  placeholder="Your guiding company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Business License Number *</label>
                <Input
                  value={businessInfo.license_number}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, license_number: e.target.value })}
                  placeholder="Official license/registration number"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Insurance Information *</label>
                <Textarea
                  value={businessInfo.insurance_info}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, insurance_info: e.target.value })}
                  placeholder="Professional liability, public liability coverage details"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Years of Experience *</label>
                <Input
                  type="number"
                  value={businessInfo.experience_years}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, experience_years: parseInt(e.target.value) || 0 })}
                  placeholder="Years of guiding experience"
                  min="0"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Document Upload</h2>
              <p className="text-muted-foreground">Upload required documents for verification</p>
            </div>

            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="font-medium">{doc.type}</span>
                      {index < 3 && <span className="text-red-500">*</span>}
                    </div>
                    {doc.uploaded && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Uploaded
                      </Badge>
                    )}
                  </div>

                  {!doc.uploaded ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Click to upload or drag and drop
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(index, file);
                        }}
                        className="hidden"
                        id={`file-${index}`}
                      />
                      <label
                        htmlFor={`file-${index}`}
                        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:bg-primary/90"
                      >
                        Choose File
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">{doc.file?.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Document Requirements</p>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• All documents must be clear and legible</li>
                    <li>• Accepted formats: PDF, JPG, PNG</li>
                    <li>• Maximum file size: 10MB per document</li>
                    <li>• Documents must be current and valid</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Professional Description</h2>
              <p className="text-muted-foreground">Tell us about your guiding experience and expertise</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Describe Your Experience & Specializations *
              </label>
              <Textarea
                value={businessInfo.description}
                onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })}
                placeholder="Describe your guiding experience, specializations, regions you operate in, certifications, and what makes you unique as a guide..."
                rows={8}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground mt-2">
                {businessInfo.description.length}/100 characters minimum
              </p>
            </div>

            <div className="bg-gray-50 border rounded-lg p-4">
              <p className="font-medium mb-2">Include information about:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Regions and trails you specialize in</li>
                <li>• Types of tours you offer (day hikes, multi-day treks, etc.)</li>
                <li>• Relevant certifications and training</li>
                <li>• Languages you speak</li>
                <li>• Safety protocols and emergency procedures</li>
                <li>• What makes your tours unique</li>
              </ul>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Review & Submit</h2>
              <p className="text-muted-foreground">Please review your information before submitting</p>
            </div>

            <div className="space-y-6">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Business Information</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Company:</span>
                    <p className="font-medium">{businessInfo.company_name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">License:</span>
                    <p className="font-medium">{businessInfo.license_number}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Experience:</span>
                    <p className="font-medium">{businessInfo.experience_years} years</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-muted-foreground">Insurance:</span>
                    <p className="font-medium">{businessInfo.insurance_info}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3">Uploaded Documents</h3>
                <div className="space-y-2">
                  {documents.filter(doc => doc.uploaded).map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>{doc.type}: {doc.file?.name}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3">Professional Description</h3>
                <p className="text-sm">{businessInfo.description}</p>
              </Card>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Verification Process</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    After submission, our team will review your application within 3-5 business days. 
                    You'll receive an email notification once the review is complete.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = (currentStep / 4) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Guide Verification</h1>
          <p className="text-muted-foreground">Complete the verification process to start offering tours</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>Step {currentStep} of 4</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="p-8 mb-8">
          {renderStep()}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceedToNext()}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceedToNext() || submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? 'Submitting...' : 'Submit for Review'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}