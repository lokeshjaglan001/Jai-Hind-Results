import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { User, Mail, Calendar, Award, Clock, Target, TrendingUp, CreditCard, FileText, Download, BookOpen, ArrowRight, Activity } from 'lucide-react';
import { api } from '@/lib/api';

interface Activity {
  id: string;
  type: 'test' | 'payment' | 'file';
  title: string;
  description: string;
  date: string;
  metadata?: any;
}

const ProfilePage: NextPage = () => {
  const { user, isLoading, token } = useAuth();
  console.log(user);
  const router = useRouter();
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    highestScore: 0,
    recentAttempts: 0,
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  // Helper function to calculate percentage for an attempt
  const calculatePercentage = (attempt: {
    score: number | null;
    mock_tests: {
      title: string;
      mock_questions: { marks: number }[];
    } | null;
  }): number => {
    if (!attempt.score || !attempt.mock_tests?.mock_questions) return 0;
    
    const totalMarks = attempt.mock_tests.mock_questions.reduce(
      (sum, q) => sum + (q.marks || 1),
      0
    );
    
    return totalMarks > 0 ? Math.round((attempt.score / totalMarks) * 100) : 0;
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [user, isLoading, router]);

  // Fetch all activity data
  useEffect(() => {
    if (user && token) {
      fetchRecentActivity();
    }
  }, [user, token]);

  const fetchRecentActivity = async () => {
    try {
      setLoadingActivity(true);
      const activities: Activity[] = [];

      // Fetch payments
      try {
        const payments = await api.get(`/payments/user/${user?.id}`, token || undefined);
        const paymentActivities = payments.slice(0, 5).map((payment: any) => ({
          id: `payment-${payment.id}`,
          type: 'payment' as const,
          title: payment.mock_series?.title || 'Mock Series Purchase',
          description: `₹${payment.amount} - ${payment.status}`,
          date: payment.created_at,
          metadata: payment,
        }));
        activities.push(...paymentActivities);
      } catch (err) {
        console.error('Error fetching payments:', err);
      }

      // Fetch file purchases
      try {
        const filePurchases = await api.get(`/files/mine/${user?.id}`, token || undefined);
        const fileActivities = filePurchases.slice(0, 5).map((purchase: any) => ({
          id: `file-${purchase.id}`,
          type: 'file' as const,
          title: purchase.file?.title || 'File Download',
          description: `Downloaded - ₹${purchase.file?.price || 0}`,
          date: purchase.purchased_at,
          metadata: purchase,
        }));
        activities.push(...fileActivities);
      } catch (err) {
        console.error('Error fetching file purchases:', err);
      }

      // Add test attempts (already in user data)
      if (user?.mock_attempts) {
        const testActivities = user.mock_attempts.slice(0, 5).map((attempt: any) => {
          const percentage = calculatePercentage(attempt);
          return {
            id: `test-${attempt.id}`,
            type: 'test' as const,
            title: attempt.mock_tests?.title || 'Mock Test',
            description: `Score: ${percentage}%`,
            date: attempt.completed_at,
            metadata: attempt,
          };
        });
        activities.push(...testActivities);
      }

      // Sort all activities by date and take latest 5
      const sortedActivities = activities
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      setRecentActivity(sortedActivities);
    } catch (err) {
      console.error('Error fetching activity:', err);
    } finally {
      setLoadingActivity(false);
    }
  };

  useEffect(() => {
    if (user?.mock_attempts) {
      const attempts = user.mock_attempts;
      const totalAttempts = attempts.length;
      
      if (totalAttempts > 0) {
        // Calculate percentages based on actual question marks
        const percentages = attempts
          .filter(a => a.score !== null && a.mock_tests?.mock_questions)
          .map(a => {
            const totalMarks = a.mock_tests!.mock_questions.reduce(
              (sum, q) => sum + (q.marks || 1),
              0
            );
            return totalMarks > 0 ? Math.round(((a.score as number) / totalMarks) * 100) : 0;
          });
        
        const averageScore = percentages.length > 0
          ? Math.round(percentages.reduce((sum, score) => sum + score, 0) / percentages.length)
          : 0;
        
        const highestScore = percentages.length > 0 ? Math.max(...percentages) : 0;
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentAttempts = attempts.filter(
          a => new Date(a.completed_at) > thirtyDaysAgo
        ).length;

        setStats({
          totalAttempts,
          averageScore,
          highestScore,
          recentAttempts,
        });
      }
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-300 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Attempts</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalAttempts}</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-300 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Average Score</p>
              <p className="text-3xl font-bold text-gray-800">{stats.averageScore}%</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-300 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Highest Score</p>
              <p className="text-3xl font-bold text-gray-800">{stats.highestScore}%</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-300 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Recent Tests (30d)</p>
              <p className="text-3xl font-bold text-gray-800">{stats.recentAttempts}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <Card className="bg-white rounded-2xl border border-gray-300 shadow-sm mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest activity across tests, purchases, and downloads</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {loadingActivity ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    {/* Icon */}
                    <div className={`p-3 rounded-lg ${
                      activity.type === 'test' ? 'bg-blue-100' :
                      activity.type === 'payment' ? 'bg-green-100' :
                      'bg-purple-100'
                    }`}>
                      {activity.type === 'test' && <Award className="w-5 h-5 text-blue-600" />}
                      {activity.type === 'payment' && <CreditCard className="w-5 h-5 text-green-600" />}
                      {activity.type === 'file' && <Download className="w-5 h-5 text-purple-600" />}
                    </div>

                    {/* Content */}
                    <div className="flex-grow min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">{activity.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                        <span>{activity.description}</span>
                        <span className="text-gray-400">•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(activity.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <div>
                      {activity.type === 'test' && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/results/${activity.metadata.id}`}>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      )}
                      {activity.type === 'payment' && activity.metadata.status === 'success' && (
                        <Badge className="bg-green-600">Success</Badge>
                      )}
                      {activity.type === 'file' && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={activity.metadata.file?.file_url || '#'} target="_blank">
                            <Download className="w-4 h-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">No recent activity found.</p>
                <p className="text-sm text-gray-500">Start by taking a test or purchasing a course!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-gray-300 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/my-courses')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="w-8 h-8 text-indigo-600" />
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">My Courses</h3>
              <p className="text-sm text-gray-600">View your enrolled courses and continue learning</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-300 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/results')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Award className="w-8 h-8 text-blue-600" />
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Test Results</h3>
              <p className="text-sm text-gray-600">View all your test attempts and performance</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-300 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/payments')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <CreditCard className="w-8 h-8 text-green-600" />
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Payments</h3>
              <p className="text-sm text-gray-600">Track your purchases and transaction history</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-300 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/my-files')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Download className="w-8 h-8 text-purple-600" />
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">My Files</h3>
              <p className="text-sm text-gray-600">Access your downloaded files and materials</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;