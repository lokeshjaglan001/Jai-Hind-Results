import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Calendar, Loader2, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

interface PurchasedFile {
  id: string;
  file_id: string;
  user_id: number;
  purchased_at: string;
  file: {
    id: string;
    title: string;
    description: string;
    file_url: string;
    thumbnail_url: string | null;
    price: number;
  };
}

const MyFilesPage: React.FC = () => {
  const [purchases, setPurchases] = useState<PurchasedFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to finish loading before checking user
    if (authLoading) {
      return;
    }

    // Redirect if not authenticated
    if (!user) {
      router.push('/');
      return;
    }

    const fetchPurchases = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/files/mine/${user.id}`);
        setPurchases(data);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user, authLoading, router]);

  const handleDownload = (fileUrl: string, title: string) => {
    // Open file in new tab for download
    window.open(fileUrl, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Show loading state while checking authentication
  if (authLoading || (!user && loading)) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Downloads</h1>
          <p className="text-gray-600">All your purchased files in one place</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : purchases.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">No Downloads Yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't purchased any files yet. Browse our collection to get started.
              </p>
              <Button 
                className="bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-700 hover:to-blue-400 text-white"
                onClick={() => router.push('/files')}
              >
                Browse Files
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.map((purchase) => (
              <Card key={purchase.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  {purchase.file.thumbnail_url ? (
                    <div className="w-full h-40 rounded-lg overflow-hidden mb-3">
                      <img 
                        src={purchase.file.thumbnail_url} 
                        alt={purchase.file.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-3">
                      <FileText className="w-16 h-16 text-blue-400" />
                    </div>
                  )}
                  <CardTitle className="text-lg line-clamp-2">{purchase.file.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {purchase.file.description || 'No description available'}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <Calendar className="w-3 h-3" />
                    <span>Purchased on {formatDate(purchase.purchased_at)}</span>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-700 hover:to-blue-400 text-white"
                    onClick={() => handleDownload(purchase.file.file_url, purchase.file.title)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download File
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Additional Actions */}
        {purchases.length > 0 && (
          <div className="mt-12 text-center">
            <Button
              variant="outline"
              onClick={() => router.push('/offline-forms')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Browse More Files
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyFilesPage;
