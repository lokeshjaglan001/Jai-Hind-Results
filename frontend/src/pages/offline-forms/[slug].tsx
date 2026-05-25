import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Download, IndianRupee, CheckCircle2, Loader2, Lock, FileText, UserPlus } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { AuthDialog } from '@/components/auth/AuthDialog';

interface DownloadableFile {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail_url?: string;
  price: number;
  downloads_count: number;
  created_at: string;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

interface Payment {
  id: string;
  razorpay_order_id: string;
}

interface Purchase {
  id: string;
  file_id: string;
  user_id: number;
  purchased_at: string;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

interface SingleFilePageProps {
  file: DownloadableFile | null;
}

const SingleFilePage: React.FC<SingleFilePageProps> = ({ file: initialFile }) => {
  const [file] = useState<DownloadableFile | null>(initialFile);
  const [purchasing, setPurchasing] = useState<boolean>(false);
  const [purchased, setPurchased] = useState<boolean>(false);
  const [alreadyPurchased, setAlreadyPurchased] = useState<boolean>(false);
  const [checkingPurchase, setCheckingPurchase] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showAuthDialog, setShowAuthDialog] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [downloading, setDownloading] = useState<boolean>(false);
  
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.razorpay.com/widgets/trusted-business/bundle.js';
    script.setAttribute('data-id', 'rzp_live_ROHcOBQ5rXFy6f');
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Check if user has already purchased
  React.useEffect(() => {
    const checkPurchase = async () => {
      if (!user || !file) {
        setCheckingPurchase(false);
        return;
      }

      try {
        const response = await api.get(`/files/${file.id}/check-purchase/${user.id}`);
        if (response.hasPurchased) {
          setAlreadyPurchased(true);
          // Get the purchased file details to retrieve file_url
          const purchasedFiles = await api.get(`/files/mine/${user.id}`);
          const purchasedFile = purchasedFiles.find((p: any) => p.file_id === file.id);
          if (purchasedFile?.file?.file_url) {
            setFileUrl(purchasedFile.file.file_url);
          }
        }
      } catch (error) {
        console.error('Error checking purchase:', error);
      } finally {
        setCheckingPurchase(false);
      }
    };

    checkPurchase();
  }, [user, file]);

  const handlePurchase = async () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    if (!file) return;

    try {
      setPurchasing(true);
      setError('');

      const response: { purchase?: Purchase; order?: RazorpayOrder; payment?: Payment; file: DownloadableFile } = 
        await api.post('/files/purchase', {
          fileId: file.id,
          userId: user.id,
        });

      // Free file - direct purchase
      if (response.purchase && !response.order) {
        setPurchased(true);
        setAlreadyPurchased(true);
        return;
      }

      // Paid file - initiate Razorpay
      if (response.order && response.payment) {
        initiateRazorpayPayment(response.order, response.payment);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to initiate purchase');
    } finally {
      setPurchasing(false);
    }
  };

  const initiateRazorpayPayment = (order: RazorpayOrder, payment: Payment): void => {
    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
      amount: order.amount,
      currency: order.currency,
      name: file!.title,
      description: file!.description?.slice(0, 20) || 'File Purchase',
      order_id: order.id,
      handler: async (response: RazorpayResponse) => {
        try {
          await api.post('/files/verify-payment', {
            paymentId: payment.id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          });

          setPurchased(true);
          setAlreadyPurchased(true);
        } catch (error) {
          setError('Payment verification failed');
        }
      },
      prefill: {
        name: user?.full_name || '',
        email: user?.email || '',
      },
      theme: {
        color: '#3b82f6'
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleDownload = async () => {
    if (fileUrl) {
      // Direct download
      setDownloading(true);
      try {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = file?.title || 'download';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Download error:', error);
      } finally {
        setDownloading(false);
      }
    } else {
      // Fallback to dashboard
      router.push('/dashboard/my-files');
    }
  };

  const handleCopyLink = () => {
    if (file) {
      const link = `${window.location.origin}/offline-forms/${file.slug}`;
      navigator.clipboard.writeText(link);
    }
  };

  if (!file) {
    return (
      <div className="bg-gray-100 min-h-screen">
        {/* <Header /> */}
        <div className="container mx-auto px-6 py-12 max-w-2xl">
          <Card className="shadow-lg border-4 border-red-200">
            <CardContent className="p-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-red-700" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">File Not Found</h2>
              <p className="text-gray-600 text-lg mb-8">
                The file you're looking for doesn't exist or has been removed.
              </p>
              <Button 
                className="w-full h-12 bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-700 hover:to-blue-400 text-white"
                onClick={() => router.push('/offline-forms')}
              >
                View All Files
              </Button>
            </CardContent>
          </Card>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }

  // Success view
  if (purchased) {
    return (
      <div className="bg-gray-100 min-h-screen">
        {/* <Header /> */}
        <div className="container mx-auto px-6 py-12 max-w-2xl">
          <Card className="shadow-lg border-4 border-green-200">
            <CardContent className="p-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-200 to-green-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-700" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Purchase Successful!</h2>
              <p className="text-gray-600 text-lg mb-8">
                Your purchase is complete! Go to your dashboard to download the file.
              </p>
              <div className="space-y-3">
                <Button 
                  className="w-full h-12 bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-700 hover:to-blue-400 text-white"
                  onClick={() => router.push('/dashboard/my-files')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Go to My Downloads
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12"
                  onClick={() => router.push('/offline-forms')}
                >
                  Browse More Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }

  // Already purchased view
  if (alreadyPurchased && !checkingPurchase) {
    return (
      <div className="bg-gray-100 min-h-screen">
        {/* <Header /> */}
        <div className="container mx-auto px-6 py-12 max-w-2xl">
          <Card className="shadow-lg border-4 border-yellow-200">
            <CardContent className="p-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-yellow-700" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Already Purchased</h2>
              <p className="text-gray-600 text-lg mb-8">
                You've already purchased this file. Download it now or access it from your downloads page.
              </p>
              <div className="space-y-3">
                <Button 
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white"
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {downloading ? 'Downloading...' : 'Download File Now'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12"
                  onClick={() => router.push('/offline-forms')}
                >
                  Browse More Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }

  return (
    <div className="min-h-screen image-bg">
      {/* <Header /> */}
      <main className="container mx-auto sm:px-4 p-0 py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-4">
          <Link href="/" className="flex justify-center items-center gap-2 text-gray-300 p-1 pr-3 rounded-full border">
            <img src="/logo.jpg" alt="" className='w-8 h-8 rounded-full' />
            <span className="text-md font-medium">Haryana Job Alerts</span>
          </Link>
          <div className="flex items-center gap-2">
            {
              user ? (
                <Button 
                  className="flex items-center gap-2 h-10 bg-black border rounded-xl"
                  onClick={()=> router.push('/dashboard')}
                >
                  <Lock className="w-4 h-4" />
                  Go to Profile
                </Button>
              ) : (
                <Button 
                  className="flex items-center gap-2 h-10 bg-black border rounded-full"
                  onClick={() => setShowAuthDialog(true)}
                >
                  <UserPlus className="w-4 h-4" />
                  Login / Register
                </Button>
              )
            }
          </div>
        </div>
        {/* Main Grid Layout - Two Columns */}
        <div className="grid lg:grid-cols-3 gap-8 bg-white border shadow-sm rounded-4xl p-3 sm:p-6">
          {/* Left Column - File Details (2/3 width) */}
          <div className="lg:col-span-2">
            <div>
              {file.thumbnail_url && (
                <div className="w-full rounded-2xl overflow-hidden h-80 bg-gradient-to-br from-blue-100 to-blue-50">
                  <img 
                    src={file.thumbnail_url} 
                    alt={file.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardContent className="px-3 sm:px-8 py-8">
                {/* Title */}
                <div className="mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{file.title}</h1>
                </div>

                {/* Description */}
                {file.description && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">ABOUT THE PAGE</h2>
                    <ul className="prose prose-gray max-w-none pl-4">
                      {file.description.split(/\r?\n/).map((line, idx) => (
                        line.trim() && (
                          <li key={idx} className="text-gray-700 list-disc text-sm leading-relaxed mb-2">
                            {line}
                          </li>
                        )
                      ))}
                    </ul>
                  </div>
                )}

                {/* What You'll Get Section */}
                <div className="pt-6 border-t border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">WHAT YOU'LL GET</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Number of resources</span>
                      <span className="font-medium text-gray-900">1</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Resource content</span>
                      <span className="font-medium text-gray-900">File</span>
                    </div>
                  </div>
                </div>

                {/* Invite Network */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">INVITE YOUR NETWORK</p>
                        <Button variant="outline" className="w-full" onClick={handleCopyLink}>
                          <FileText className="w-4 h-4 mr-2" />
                          Copy link
                        </Button>
                      </div>
              </CardContent>
            </div>
          </div>

          {/* Right Column - Purchase Card (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="sticky bottom-4 sm:top-8">
              <Card className="shadow-lg border bg-white rounded-2xl">
                <CardContent className="p-6">
                  {/* Error Alert */}
                  {error && (
                    <Alert className="mb-4 border-red-200 bg-red-50">
                      <AlertTitle className="text-red-700">Error</AlertTitle>
                      <AlertDescription className="text-red-600">{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Non-Logged-In User Purchase Prompt */}
                  {!user ? (
                    // Show purchase form trigger for non-logged users
                    <div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-4">To purchase this form you have to login or register on Haryana Job Alert</p>
                      </div>

                      {/* Price Summary */}
                      <div className="py-4 border-y border-gray-200 space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Sub Total</span>
                          <span className="text-gray-900">
                            {file.price === 0 ? '₹0' : `₹${file.price}`} 
                          </span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-900">Total</span>
                          <span className="text-gray-900">
                            {file.price === 0 ? '₹0' : `₹${file.price}`}
                          </span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-black hover:bg-gray-800 text-white h-12"
                        onClick={handlePurchase}
                        disabled={checkingPurchase}
                      >
                        {checkingPurchase ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Checking...
                          </>
                        ) : (
                          'Register to Purchase →'
                        )}
                      </Button>

                      <p className="text-center text-xs text-gray-600 mt-3">
                        Click the button above to login or create a new account
                      </p>

                      {/* Invite Network */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">INVITE YOUR NETWORK</p>
                        <Button variant="outline" className="w-full" onClick={handleCopyLink}>
                          <FileText className="w-4 h-4 mr-2" />
                          Copy link
                        </Button>
                      </div>
                    </div>
                  ) : alreadyPurchased && !checkingPurchase ? (
                    // Already purchased - show download button
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center gap-2 text-green-600 mb-4">
                          <CheckCircle2 className="w-5 h-5" />
                          <p className="text-sm font-medium">You own this file</p>
                        </div>
                        <Input
                          value={user.email}
                          disabled
                          className="w-full mb-3"
                        />
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white h-12"
                        onClick={handleDownload}
                        disabled={downloading}
                      >
                        {downloading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Download File Now
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full mt-3 h-12"
                        onClick={() => router.push('/dashboard/my-files')}
                      >
                        View All My Downloads
                      </Button>

                      {/* Invite Network */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">INVITE YOUR NETWORK</p>
                        <Button variant="outline" className="w-full" onClick={handleCopyLink}>
                          <FileText className="w-4 h-4 mr-2" />
                          Copy link
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Logged-in user purchase form
                    <div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-4">To purchase this form you have to login or register on Haryana Job Alert</p>
                        <Input
                          value={user.email}
                          disabled
                          className="w-full mb-3"
                        />
                      </div>

                      {/* Price Summary */}
                      <div className="">
                        <div className="py-4 border-y border-gray-200 space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Sub Total</span>
                          <span className="text-gray-900">
                            {file.price === 0 ? '₹0' : `₹${file.price}`}<span className="ml-3 text-gray-400 line-through">
                                {file.price === 0 ? '₹0' : `₹${file.price * 1.5}`}
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-900">Total</span>
                          <span className="text-gray-900">
                            {file.price === 0 ? '₹0' : `₹${file.price}`}
                          </span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-black hover:bg-gray-800 text-white h-12"
                        onClick={handlePurchase}
                        disabled={purchasing || checkingPurchase}
                      >
                        {purchasing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Get it now ' + (file.price === 0 ? 'Free' : `₹${file.price}`)
                        )}
                      </Button>
                      </div>

                      
                    </div>
                  )}

                  {/* Security Badge */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                      <Lock className="w-3 h-3" />
                      <span>Secure payment powered by Razorpay</span>
                      {/* <razorpay-trusted-business key="rzp_live_ROHcOBQ5rXFy6f"></razorpay-trusted-business> */}
                      <div id="razorpay-trusted-business-widget"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  try {
    const file: DownloadableFile = await api.get(`/files/slug/${slug}`);

    return {
      props: {
        file,
      },
    };
  } catch (error) {
    console.error('Error fetching file:', error);
    return {
      props: {
        file: null,
      },
    };
  }
};

export default SingleFilePage;