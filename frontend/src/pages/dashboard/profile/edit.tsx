import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowLeft, User, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default function EditProfilePage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Only send fields that have changed
      const updates: { full_name?: string; email?: string } = {};
      
      if (fullName !== user?.full_name) {
        updates.full_name = fullName;
      }
      
      if (email !== user?.email) {
        updates.email = email;
      }

      // If nothing changed, don't make the request
      if (Object.keys(updates).length === 0) {
        setSuccess('No changes to save.');
        setIsLoading(false);
        return;
      }

      await api.put('/auth/profile', updates, token!);
      
      setSuccess('Profile updated successfully! Refreshing your information...');
      
      // Refresh the page after a short delay to reload user data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update profile.');
      setIsLoading(false);
    }
  };

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Don't render form if user is not loaded
  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-2">Update your personal information</p>
        </div>

        {/* Profile Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your account details below</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  Full Name
                </Label>
                <Input 
                  id="fullName" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  required 
                  disabled={isLoading}
                  className="h-11"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  Email Address
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  disabled={isLoading}
                  className="h-11"
                  placeholder="Enter your email"
                />
                <p className="text-xs text-gray-500">
                  You'll need to use this email to log in if you change it.
                </p>
              </div>

              {/* Account Info */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Account Information</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Role:</span> {user.role === 'admin' ? 'Administrator' : 'Student'}</p>
                  <p><span className="font-medium">Account Created:</span> {new Date(user.created_at || '').toLocaleDateString()}</p>
                  <p><span className="font-medium">User ID:</span> {user.id}</p>
                </div>
              </div>

              {/* Success Message */}
              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              {/* Error Message */}
              {error && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full h-11 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              <p>Need help? <Link href="/contact" className="text-blue-600 hover:text-blue-700">Contact Support</Link></p>
            </div>
          </CardFooter>
        </Card>

        {/* Mock Test History Card */}
        {user.mock_attempts && user.mock_attempts.length > 0 && (
          <Card className="mt-6 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Mock Test Attempts</CardTitle>
              <CardDescription>Your recent test performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user.mock_attempts.slice(0, 5).map((attempt) => (
                  <div 
                    key={attempt.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {attempt.mock_tests?.title || 'Unknown Test'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(attempt.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">
                        {attempt.score !== null ? `${attempt.score}%` : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">Score</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
