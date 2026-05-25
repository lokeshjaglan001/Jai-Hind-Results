import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';

export default function SignupRedirectPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect to home page - signup is now done via dialog
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        if (user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        // Redirect non-logged-in users to home
        router.push('/');
      }
    }
  }, [user, authLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Redirecting...</CardTitle>
          <CardDescription>Please wait while we redirect you.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    </div>
  );
}