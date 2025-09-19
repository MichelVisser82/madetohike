import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X, Mail, Lock, User, Mountain, Shield, Star, CheckCircle } from 'lucide-react';

interface GuideSignupModalProps {
  onClose: () => void;
  onSignup: (user: any) => void;
}

export function GuideSignupModal({ onClose, onSignup }: GuideSignupModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      setLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create new guide user
    const newGuide = {
      id: Date.now().toString(),
      email: formData.email,
      name: formData.name,
      role: 'guide' as const,
      verified: false,
      verification_status: 'not_requested' as const,
      created_at: new Date().toISOString()
    };

    // Save to localStorage (in real app this would be handled by backend)
    const existingUsers = JSON.parse(localStorage.getItem('madetohike-users') || '[]');
    const updatedUsers = [...existingUsers, newGuide];
    localStorage.setItem('madetohike-users', JSON.stringify(updatedUsers));

    onSignup(newGuide);
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 hover:bg-muted rounded-full"
        >
          <X className="h-4 w-4" />
        </button>

        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Mountain className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Become a Guide</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Join MadeToHike's community of professional hiking guides
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Benefits Section */}
          <div className="bg-gradient-to-r from-primary/5 to-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Why guides choose MadeToHike:
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Easy signup - build your profile over time</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Create tours as drafts, publish when ready</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>15% platform fee - competitive rates</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Connect your Instagram for authentic photos</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  className="pl-10"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg text-sm space-y-2">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-800 font-medium">What happens next:</p>
                  <ol className="text-blue-700 mt-1 space-y-1 list-decimal list-inside ml-2">
                    <li>Create your account instantly</li>
                    <li>Build your guide profile at your own pace</li>
                    <li>Add certifications and business info</li>
                    <li>Create tours and save as drafts</li>
                    <li>Complete verification to publish tours</li>
                  </ol>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Your Guide Account...' : 'Sign Up as Guide'}
            </Button>
          </form>

          <div className="flex items-center gap-4">
            <div className="flex-1 border-t"></div>
            <span className="text-sm text-muted-foreground">or continue with</span>
            <div className="flex-1 border-t"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              type="button" 
              variant="outline" 
              disabled={loading}
              onClick={() => {
                // Google OAuth would go here
                console.log('Google signup');
              }}
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              disabled={loading}
              onClick={() => {
                // Instagram connection would go here
                console.log('Instagram connect');
              }}
            >
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardContent>
      </Card>
    </div>
  );
}