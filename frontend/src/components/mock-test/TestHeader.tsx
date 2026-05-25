'use client';

import { ChevronDown, Clock, Users, Globe, ChevronRight, Smartphone, CircleCheck, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import AdBanner from '../shared/AdBanner';
import Image from 'next/image';
import { Button } from '@/components/ui/button'; // Import Button
import { Input } from '@/components/ui/input'; // Import Input
import { useRouter } from 'next/router'; // Import the router
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { MobileLoginCard } from '../auth/LoginCard';
import { AuthDialog } from '../auth/AuthDialog';


// Define the types for the props this component will accept
type TestHeaderProps = {
   seriesId: string;
   seriesName: string;
   description: string;
  logo: string;
  title: string;
  price: number | null;
  level: string;
  lastUpdated: string;
  totalTests: number;
  freeTests: number;
  users: number;
  categories: any[];
  language: string;
  features: string[];
  seriesCategory: string;
};

export default function TestHeader({
  seriesId,
  seriesName,
  description,
  title,
  logo,
  price,
  level,
  lastUpdated,
  totalTests,
  freeTests,
  users,
  categories,
  language,
  features,
  seriesCategory,
}: TestHeaderProps) {
  // Split features for the two-column layout
  // const midPoint = Math.ceil(features.length / 2);
  const chunk = (arr: string[], size: number) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  const featureGroups = chunk(features, 2);
  const [selectedLevel, setSelectedLevel] = useState(level);

  // --- NEW LOGIC ---
  const { user, token } = useAuth();
  const isLoggedIn = !!user;
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    const checkEnrollment = async () => {
      const authToken = token || undefined;
      if (isLoggedIn) {
        try {
          const response = await api.get(`/mock-series/${seriesId}/check-enrollment`, authToken);
          setIsEnrolled(response.enrolled);
        } catch (error) {
          console.error('Error checking enrollment:', error);
        }
      }
    };

    checkEnrollment();
  }, [isLoggedIn, seriesId, token]);

  const handlePurchase = async () => {
    const authToken = token || undefined;
    if (!isLoggedIn) {
      setShowAuthDialog(true);
      return;
    }
    setIsLoading(true);
    try {
      const order = await api.post('/payments/create-order', { mock_series_id: Number(seriesId) }, authToken);
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your Razorpay Key ID
        amount: order.amount,
        currency: "INR",
        name: "Haryana Job Alert",
        description: `Purchase: ${order.series_title}`,
        order_id: order.order_id,
        handler: function (response: any) {
          alert("Payment successful! You now have access to this series.");
          router.reload();
        },
        prefill: {
            name: user?.full_name,
            email: user?.email,
        },
        theme: {
            color: "#3399cc"
        }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err) {
        alert("Payment failed. Please try again.");
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Please use the Sign Up option in the header to create an account.');
  };

  const handleStartTestFlow = () => {
    if (isLoggedIn) {
      alert('You are logged in! Click "Start Test" on an individual test below to begin.');
    } else {
      alert('Please login to start the test.');
    }
  };

  return (
    <section className="bg-white py-4 mb-10">
      <div className="flex flex-col lg:flex-row gap-8 justify-between">
        
        {/* Left Side: Main Content */}
        <div className='w-full'>
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-12 hidden md:block">
            <ol className="flex items-center space-x-2 text-nowrap">
              <li><Link href="/" className="hover:text-indigo-600">Home</Link></li>
              <li><span className="text-gray-400"><ChevronRight /></span></li>
              <li><Link href="/mock-tests" className="hover:text-indigo-600">Mock Tests</Link></li>
              <li><span className="text-gray-400"><ChevronRight /></span></li>
              {/* <li aria-current="page"><span className="font-medium text-gray-700">SSC Exam</span></li> */}
              <li><Link href="/mock-tests/exams/{id}/{id}" className="hover:text-indigo-600 font-medium text-gray-700">{seriesCategory}</Link></li>
              <li><span className="text-gray-400"><ChevronRight /></span></li>
              <li><Link href="/mock-tests/{id}" className="hover:text-indigo-600">{title}</Link></li>
            </ol>
          </nav>

          {/* Title Section */}
          <div className="flex flex-wrap items-start justify-start gap-12 mb-8">
            <div className="flex items-start gap-4">
              <div>
                <div className='flex gap-2 items-center'>
                  <Image src={logo ? logo : "https://placehold.co/60x60/e2e8f0/334155?text=Mock"} width={60} height={60} alt="Test Logo" className="w-14 h-14 rounded-full" unoptimized />
                  <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-8 lg:ml-18">
                  <Clock size={14} />
                  <span>Last update on {lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>

          <div className='lg:ml-18'>
            {/* Info Tags */}
            <div className="w-fit flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-700 font-medium mb-6 border-b-1 pb-6 px-2 border-gray-400">
              <span className="flex items-center gap-1.5">{totalTests} Total Tests</span>
              <span className='text-gray-400'>|</span>
              <span className="shine bg-gradient-to-r from-green-950 to-green-600 text-white px-3 py-1 rounded-md">{freeTests} FREE Test</span>
              <span className='text-gray-400'>|</span>
              <div className="flex items-center gap-1.5"><Users size={16} /> {users} Users</div>
              <span className='text-gray-400'>|</span>
              <div className="flex items-center gap-1.5 text-blue-400">
                <Image src="/lang.png" width={18} height={18} alt='lang' />
                {language}</div>
            </div>

            <div>
              <p className='text-sm list-disc grid grid-cols-3'>{description.split("\n").map((line, index) => (
                <li key={index} className="flex items-center gap-2">
                    <span className="text-indigo-500 text-lg leading-none">•</span>
                    <span className="line-clamp-1">{line}</span>
                </li>
              ))}</p>
            </div>
            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-gray-800 font-medium mb-12">
              {featureGroups.map((group, groupIndex) => (
                <ul key={groupIndex} className="list-disc list-inside">
                  {group.map((feature, featureIndex) => (
                    <li key={featureIndex}>
                      {/* <span className="text-gray-700 mt-1">•</span> */}
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>

            {price && price > 0 ? (
          isEnrolled ? (
            <div className="md:max-w-xl text-center w-full bg-gradient-to-r from-[#1c1e47] via-[#2b2d6c] to-[#34387e] text-white font-bold py-3 px-12 rounded-lg">
              You are enrolled in this series
            </div>
          ) : (
            <Button
              onClick={handlePurchase}
              disabled={isLoading}
              className="shine md:max-w-lg w-full bg-gradient-to-r from-green-600 to-green-800 text-white font-bold py-3 px-12 rounded-lg hover:opacity-90 transition-opacity text-lg"
            >
              {isLoading ? 'Processing...' : `Buy Now for ₹${price}`}
            </Button>
          )
        ) : (
                <div className="md:max-w-xl text-center w-full bg-gradient-to-r from-gray-600 to-gray-800 text-white font-bold py-3 px-12 rounded-lg">
                    This Series is Free
                </div>
            )}
          </div>
          {/* <AdBanner text={'Google Ads'} className='h-48 mt-12 w-full md:w-[80%] md:ml-18'/> */}
        </div>

        {/* --- CONDITIONAL SIGN UP SECTION --- */}
        <div className='hidden lg:flex flex-col gap-4 w-full lg:w-[50%]'>
        {!isLoggedIn ? ( // Use the dynamic isLoggedIn state
          <div className="min-w-full ">
            <MobileLoginCard />
          </div>
        ):(
          <div className="flex-shrink-0 w-full">
            <div className="bg-gradient-to-b from-[#1c1e47] via-[#2b2d6c] to-[#34387e] p-4 flex flex-col items-center rounded-2xl min-h-[550px] relative">
              <img src="/card-bg.jpg" alt="" className="w-full absolute top-0" />
              <img src="/bow-ribbon.jpg" alt="" className='absolute -right-10 -top-5 w-35'/>
              <img src="/header-logo.jpg" alt="" className="w-12 h-12 object-cover rounded-xl z-50 mt-2" />
              <h1 className="text-center text-2xl font-semibold z-10 text-white mt-3">
                Haryana <span className="text-[#f7f900]">
                  Job Alert
                </span>
              </h1>

              <div className="text-lg playfair text-center z-10 text-white mt-1 !font-medium">
                theharyana<span className="text-[#f7f900]">jobalert</span>.com
              </div>
              <img src="/header-arrow.jpg" alt="" className='z-10 w-[55%] ml-3 -mt-6' />


              <a href='https://softricity.in' className="text-white rounded-xl h-8 shine flex items-center mt-16 text-sm">
                Powered by <img src="/softricity.png" alt="" className='ml-2 h-15 w-[100px] object-cover' />
              </a>
              <div className="rounded-xl bg-[#2b2e6c] p-2 mt-4.5 w-full">
                <div className="rounded-xl bg-[#2c306f] flex justify-between items-center p-2 divide-x-2 divide-white">
                  <div className="w-1/2 flex flex-col justify-center items-center gap-3">
                    <img src="/star.png" alt="" className="w-6 h-6 rounded-full" />
                    <h1 className="text-lg playfair !font-light text-white">
                      Mock Tests
                    </h1>
                  </div>
                  <div className="w-1/2">
                    <div className="text-white text-xs px-3">
                      Use <span className="text-[#f7f900] font-semibold">Haryana Job Alert</span> Platform to practice for exams using mock tests.
                    </div>
                  </div>
                </div>
              </div>

              <img src="/loved.jpg" alt="" className="w-3/4 mt-4.5" />

              <Link href="/mock-tests" className="shine w-full text-center mt-8 bg-gradient-to-r from-[#c31432] to-[#414345] rounded-xl p-3 text-white">
                Explore More
              </Link>
            </div>
          </div>
        )}
        {/* <AdBanner text={'Google Ads'} className='h-48 md:hidden'/> */}
        </div>
      </div>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </section>
  );
}