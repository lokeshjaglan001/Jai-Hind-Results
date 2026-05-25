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
  CreditCard, 
  Calendar, 
  CheckCircle2,
  XCircle,
  Clock,
  IndianRupee,
  FileText,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

interface Payment {
  id: string;
  amount: number;
  payment_method: string;
  status: string;
  transaction_id: string;
  created_at: string;
  mock_series_id: number;
  mock_series: {
    id: number;
    title: string;
    description: string;
    slug: string;
    mock_categories: {
      name: string;
      slug: string;
    };
  };
}

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
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

    fetchPayments();
  }, [user, authLoading, token]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/payments/user/${user?.id}`, token || undefined);
      setPayments(response);
    } catch (err: any) {
      console.error('Error fetching payments:', err);
      // If endpoint returns 404 or empty, show empty state
      if (err.message.includes('404')) {
        setPayments([]);
      } else {
        setError(err.message || 'Failed to load payment history');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return (
          <Badge className="bg-green-600">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Success
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-600">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-600">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
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
    const totalSpent = payments
      .filter(p => p.status === 'success')
      .reduce((sum, p) => sum + Number(p.amount), 0);
    
    const successfulPayments = payments.filter(p => p.status === 'success').length;
    const pendingPayments = payments.filter(p => p.status === 'pending').length;

    return { totalSpent, successfulPayments, pendingPayments };
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading payment history...</p>
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
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
          <Card>
            <CardContent className="p-12 text-center">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payment History</h3>
              <p className="text-gray-600 mb-6">
                You haven't made any purchases yet.
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

  const stats = calculateStats();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment History</h1>
          <p className="text-gray-600">View all your transactions and purchase history</p>
        </div>

        {/* Statistics Cards */}
        {payments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                    <p className="text-3xl font-bold text-gray-900">₹{stats.totalSpent}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <IndianRupee className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Successful</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.successfulPayments}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.pendingPayments}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payments List */}
        {payments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payments Yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't made any purchases yet. Start exploring our mock test series!
              </p>
              <Button asChild>
                <Link href="/mock-tests">Browse Mock Tests</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div 
                    key={payment.id} 
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    {/* Left Section - Payment Info */}
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {payment.mock_series?.title || 'Mock Test Series'}
                          </h4>
                          {payment.mock_series?.mock_categories && (
                            <p className="text-sm text-gray-600 mb-2">
                              {payment.mock_series.mock_categories.name}
                            </p>
                          )}
                        </div>
                        <div className="ml-3">
                          {getStatusBadge(payment.status)}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(payment.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(payment.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-4 h-4" />
                          <span className="capitalize">{payment.payment_method}</span>
                        </div>
                      </div>
                      
                      {payment.transaction_id && (
                        <div className="mt-2 text-xs text-gray-500 font-mono">
                          Transaction ID: {payment.transaction_id}
                        </div>
                      )}
                    </div>

                    {/* Right Section - Amount & Action */}
                    <div className="flex items-center justify-between md:justify-end gap-6 md:border-l md:pl-6">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 flex items-center">
                          <IndianRupee className="w-5 h-5" />
                          {Number(payment.amount).toFixed(2)}
                        </div>
                      </div>
                      
                      {payment.status === 'success' && payment.mock_series && (
                        <Button asChild variant="outline" size="sm">
                          <Link 
                            href={`/mock-tests/${payment.mock_series.mock_categories.slug}/${payment.mock_series.slug}`}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Series
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        {payments.length > 0 && (
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Need Help with a Payment?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    If you have any questions about a transaction or need a refund, please contact our support team.
                  </p>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PaymentsPage;
