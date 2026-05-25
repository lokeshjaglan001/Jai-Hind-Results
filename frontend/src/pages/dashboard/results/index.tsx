import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  Award, 
  Calendar, 
  Clock, 
  TrendingUp, 
  FileText,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

interface MockAttempt {
  id: string;
  test_id: string;
  score: number;
  total_marks: number;
  started_at: string;
  completed_at: string;
  mock_tests: {
    title: string;
    description: string;
    duration_minutes: number;
    mock_questions: {
      marks: number;
    }[];
  } | null;
}

const ResultsPage: React.FC = () => {
  const [attempts, setAttempts] = useState<MockAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: authLoading, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/');
      return;
    }

    fetchAttempts();
  }, [user, authLoading, token]);

  const fetchAttempts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user profile which includes mock attempts
      const profile = await api.get('/auth/profile', token || undefined);
      
      if (profile.mock_attempts && profile.mock_attempts.length > 0) {
        // Sort by completion date (most recent first)
        const sortedAttempts = [...profile.mock_attempts].sort((a, b) => 
          new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
        );
        setAttempts(sortedAttempts);
      } else {
        setAttempts([]);
      }
    } catch (err: any) {
      console.error('Error fetching attempts:', err);
      setError(err.message || 'Failed to load test results');
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (score: number, questions: { marks: number }[]) => {
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    if (totalMarks === 0) return 0;
    return Math.round((score / totalMarks) * 100);
  };

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 80) {
      return <Badge className="bg-green-600">Excellent</Badge>;
    } else if (percentage >= 60) {
      return <Badge className="bg-blue-600">Good</Badge>;
    } else if (percentage >= 40) {
      return <Badge className="bg-yellow-600">Average</Badge>;
    } else {
      return <Badge className="bg-red-600">Needs Improvement</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateStats = () => {
    if (attempts.length === 0) return { totalTests: 0, avgScore: 0, highestScore: 0 };

    // Filter out attempts without proper mock_tests data
    const validAttempts = attempts.filter(attempt => 
      attempt.mock_tests && attempt.mock_tests.mock_questions && attempt.mock_tests.mock_questions.length > 0
    );

    if (validAttempts.length === 0) return { totalTests: 0, avgScore: 0, highestScore: 0 };

    const totalTests = validAttempts.length;
    const percentages = validAttempts.map(attempt => 
      calculatePercentage(attempt.score, attempt.mock_tests!.mock_questions)
    );
    
    const avgScore = Math.round(
      percentages.reduce((sum, p) => sum + p, 0) / percentages.length
    );
    
    const highestScore = Math.max(...percentages);

    return { totalTests, avgScore, highestScore };
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading your test results...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Alert className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  const stats = calculateStats();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Test Results</h1>
          <p className="text-gray-600">View all your mock test attempts and performance</p>
        </div>

        {/* Statistics Cards */}
        {attempts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Tests</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalTests}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Average Score</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.avgScore}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Highest Score</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.highestScore}%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Test Results List */}
        {attempts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Test Results Yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't taken any mock tests yet. Start practicing now!
              </p>
              <Button asChild>
                <Link href="/mock-tests">Browse Mock Tests</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {attempts
              .filter(attempt => attempt.mock_tests && attempt.mock_tests.mock_questions && attempt.mock_tests.mock_questions.length > 0)
              .map((attempt) => {
              // Type assertion safe here because of filter above
              const mockTests = attempt.mock_tests!;
              const percentage = calculatePercentage(attempt.score, mockTests.mock_questions);
              const totalMarks = mockTests.mock_questions.reduce((sum, q) => sum + q.marks, 0);
              
              return (
                <Card key={attempt.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Left Section - Test Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {mockTests.title}
                          </h3>
                          {getPerformanceBadge(percentage)}
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                          {mockTests.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(attempt.completed_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(attempt.completed_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>{mockTests.mock_questions.length} Questions</span>
                          </div>
                        </div>
                      </div>

                      {/* Middle Section - Score */}
                      <div className="flex items-center gap-6 md:border-l md:border-r border-gray-200 md:px-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900 mb-1">
                            {percentage}%
                          </div>
                          <div className="text-sm text-gray-600">
                            {attempt.score} / {totalMarks} Marks
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Action */}
                      <div className="flex items-center">
                        <Button asChild>
                          <Link href={`/dashboard/results/${attempt.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResultsPage;
