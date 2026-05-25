import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  FileText, 
  Calendar, 
  CheckCircle2,
  Lock,
  TrendingUp,
  BookOpen,
  Award,
  IndianRupee
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

interface MockSeries {
  id: number;
  title: string;
  description: string;
  price: number;
  slug: string;
  mock_categories: {
    name: string;
    slug: string;
  };
  mock_series_tests: {
    series_id: number;
    test_id: number;
    slug: string;
    test: {
      id: string;
      title: string;
      description: string;
      duration_minutes: number;
      total_marks: number;
    };
  }[];
}

interface Payment {
  id: string;
  mock_series_id: number;
  amount: number;
  status: string;
  created_at: string;
  mock_series: MockSeries;
}

const MyMockTestsPage: React.FC = () => {
  const [purchasedSeries, setPurchasedSeries] = useState<MockSeries[]>([]);
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

    fetchPurchasedSeries();
  }, [user, authLoading, token]);

  const fetchPurchasedSeries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch payments made by the user
      const response = await api.get(`/payments/user/${user?.id}`, token || undefined);
      
      // Filter successful payments and extract unique series
      const successfulPayments = response.filter((payment: Payment) => 
        payment.status === 'success' && payment.mock_series
      );
      
      // Extract unique series (in case of multiple payments for same series)
      const seriesMap = new Map<number, MockSeries>();
      successfulPayments.forEach((payment: Payment) => {
        if (!seriesMap.has(payment.mock_series_id)) {
          seriesMap.set(payment.mock_series_id, payment.mock_series);
        }
      });
      
      setPurchasedSeries(Array.from(seriesMap.values()));
    } catch (err: any) {
      console.error('Error fetching purchased series:', err);
      // If endpoint doesn't exist, show empty state
      if (err.message.includes('404')) {
        setPurchasedSeries([]);
      } else {
        setError(err.message || 'Failed to load your mock tests');
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading your mock tests...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Alert className="bg-red-50 border-red-200 mb-6">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
          <Card>
            <CardContent className="p-12 text-center">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Mock Tests Purchased</h3>
              <p className="text-gray-600 mb-6">
                Purchase mock test series to start practicing and improve your skills.
              </p>
              <Button asChild>
                <Link href="/mock-tests">Browse Mock Tests</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Mock Tests</h1>
          <p className="text-gray-600">
            Access all your purchased mock test series and track your progress
          </p>
        </div>

        {/* Statistics */}
        {purchasedSeries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Purchased Series</p>
                    <p className="text-3xl font-bold text-gray-900">{purchasedSeries.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Available Tests</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {purchasedSeries.reduce((sum, series) => 
                        sum + (series.mock_series_tests?.length || 0), 0
                      )}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Investment</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ₹{purchasedSeries.reduce((sum, series) => sum + Number(series.price || 0), 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <IndianRupee className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Purchased Series List */}
        {purchasedSeries.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Mock Tests Purchased Yet</h3>
              <p className="text-gray-600 mb-6">
                Purchase mock test series to start practicing and ace your exams!
              </p>
              <Button asChild>
                <Link href="/mock-tests">Browse Mock Tests</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {purchasedSeries.map((series) => (
              <Card key={series.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-green-600">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Purchased
                    </Badge>
                    <Badge variant="outline">
                      {series.mock_categories.name}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">{series.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {series.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Series Info */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FileText className="w-4 h-4" />
                        <span>{series.mock_series_tests?.length || 0} Tests</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-gray-900">
                        <IndianRupee className="w-4 h-4" />
                        <span>{series.price}</span>
                      </div>
                    </div>

                    {/* Tests List Preview */}
                    {series.mock_series_tests && series.mock_series_tests.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <p className="text-xs font-semibold text-gray-700 uppercase">
                          Available Tests
                        </p>
                        <div className="space-y-1">
                          {series.mock_series_tests.slice(0, 3).map((testItem) => (
                            <div 
                              key={testItem.test_id} 
                              className="text-sm text-gray-600 flex items-start gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-1">{testItem.test.title}</span>
                            </div>
                          ))}
                          {series.mock_series_tests.length > 3 && (
                            <p className="text-xs text-gray-500 pl-6">
                              +{series.mock_series_tests.length - 3} more tests
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button asChild className="flex-1">
                        <Link href={`/mock-tests/${series.mock_categories.slug}/${series.slug}`}>
                          <FileText className="w-4 h-4 mr-2" />
                          View Tests
                        </Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href="/dashboard/results">
                          <Award className="w-4 h-4 mr-2" />
                          Results
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Browse More Section */}
        {purchasedSeries.length > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Want More Practice?
              </h3>
              <p className="text-gray-600 mb-4">
                Explore more mock test series to enhance your preparation
              </p>
              <Button asChild>
                <Link href="/mock-tests">Browse All Mock Tests</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyMockTestsPage;
