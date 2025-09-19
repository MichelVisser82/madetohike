import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X, Mail, Lock, Mountain } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: any) => void;
}

export function AuthModal({ onClose, onLogin }: AuthModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check for admin login
    if (formData.email === 'admin@madetohike.com' && formData.password === 'admin123') {
      const adminUser = {
        id: 'admin',
        email: 'admin@madetohike.com',
        name: 'Admin User',
        role: 'admin' as const,
        verified: true,
        verification_status: 'approved' as const
      };
      onLogin(adminUser);
      setLoading(false);
      return;
    }

    // Check existing users in localStorage
    const users = JSON.parse(localStorage.getItem('madetohike-users') || '[]');
    const existingUser = users.find((u: any) => u.email === formData.email);

    if (existingUser) {
      // Simulate password validation (in real app this would be handled by auth service)
      onLogin(existingUser);
    } else {
      // User not found - show error in real app
      alert('User not found. Please sign up first or check your credentials.');
    }

    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 hover:bg-muted rounded-full"
        >
          <X className="h-4 w-4" />
        </button>

        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Mountain className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Sign In</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Welcome back! Sign in to your MadeToHike account
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                />
              </div>
            </div>

            {/* Admin Login Helper */}
            {formData.email === 'admin@madetohike.com' && (
              <div className="bg-blue-50 p-3 rounded-lg text-sm">
                <p className="text-blue-800 font-medium">Admin Login Detected</p>
                <p className="text-blue-700">Use password: admin123</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            {/* Quick Admin Login */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    email: 'admin@madetohike.com',
                    password: 'admin123'
                  });
                }}
                className="text-sm text-muted-foreground hover:text-primary underline"
              >
                Quick Admin Login
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardContent>
      </Card>
    </div>
  );
}