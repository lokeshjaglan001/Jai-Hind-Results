'use client'; // Required for hooks and event handlers
import { useEffect, useState } from 'react'; // useMemo is no longer needed
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, HelpCircle, BarChart2, FileText, Lock } from 'lucide-react'; // Added Lock icon
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { api } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type MockTestWithSlug = {
  id: string;
  title: string;
  slug: string; 
  description: string | null;
  duration_minutes: number;
  total_marks: number;
  is_free: boolean;
};

export default function TestLists({ tests, seriesId }: { tests: MockTestWithSlug[], seriesId: string }) {
  const { user, token, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [loadingTestId, setLoadingTestId] = useState<string | null>(null);
  const isLoggedIn = !!user;
  const [isEnrolled, setIsEnrolled] = useState(false);
  
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

  const handleStartTest = async (test: MockTestWithSlug) => {
    const authToken = token || undefined;
    const testUrl = `${router.asPath}/${test.slug}`;

    if (test.is_free) {
      router.push(testUrl);
      return;
    }

    if (!user) {
      alert('Please login to access this test.');
      return;
    }

    setLoadingTestId(test.id);
    try {
      const { enrolled } = await api.get(`/mock-series/${seriesId}/check-enrollment`, authToken);
      
      if (enrolled) {
        router.push(testUrl);
      } else {
        alert("You have not purchased this test series. Please buy a package to continue.");
      }
    } catch (error) {
      alert("Could not verify your enrollment status. Please try again.");
      console.error("Enrollment check failed:", error);
    } finally {
      setLoadingTestId(null);
    }
  };

  const freeTests = tests.filter(test => test.is_free);
  const paidTests = tests.filter(test => !test.is_free);

  if (isAuthLoading) {
    return <div>Loading user status...</div>;
  }

  const renderTestList = (testList: MockTestWithSlug[]) => {
    if (testList.length === 0) {
      return <p className="text-center text-gray-500 py-8">No tests available in this section.</p>;
    }

    return (
      <div className="space-y-4">
        {testList.map((test) => (
          <div key={test.id} className="bg-white rounded-lg shadow-xl border-gray-400 overflow-hidden relative">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 p-4">
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{test.title}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1.5"><Clock size={14} /> {test.duration_minutes} Mins</div>
                  <div className="flex items-center gap-1.5"><HelpCircle size={14} /> {test.total_marks} Questions</div>
                  <div className="flex items-center gap-1.5"><FileText size={14} /> {test.total_marks} Marks</div>
                </div>
              </div>
              <button 
                onClick={() => handleStartTest(test)}
                disabled={loadingTestId === test.id}
                className="shine flex-shrink-0 w-full sm:w-auto bg-gradient-to-r from-red-600 to-gray-800 text-white font-semibold py-2.5 px-6 rounded-lg inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loadingTestId === test.id ? (
        'Loading...'
      ) : test.is_free ? (
        'Start Free Test'
      ) : isEnrolled ? ( 
        'Start Test'     
      ) : (
        <>
          <Lock size={16} /> 
          Unlock Test      
        </>
      )}
              </button>
            </div>
            <div className={`p-1 border-t border-gray-200/80 ${test.is_free ? 'bg-green-100' : 'bg-red-100'} rounded-bl-lg rounded-br-lg`}>
                <span className={`text-xs font-semibold ${test.is_free ? 'text-green-700' : 'text-red-700'} px-2.5 py-1`}>
                  {test.is_free ? 'Free' : 'Paid'}
                </span>
            </div>
            {loadingTestId === test.id && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg z-10">
                <p className="font-semibold text-gray-700">Checking access...</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };


  return (
    <section className="bg-white py-4 md:py-6 rounded-lg">
      <Tabs defaultValue="all" className="w-full">
        <div className=''>
          <TabsList className="grid w-fit grid-cols-3 mb-4 bg-white">
            <TabsTrigger value="all">
              All tests ({tests.length})
            </TabsTrigger>
            <TabsTrigger value="free">
              Free tests ({freeTests.length})
            </TabsTrigger>
            <TabsTrigger value="paid">
              Paid Tests ({paidTests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {renderTestList(tests)}
          </TabsContent>
          <TabsContent value="free">
            {renderTestList(freeTests)}
          </TabsContent>
          <TabsContent value="paid">
            {renderTestList(paidTests)}
          </TabsContent>
        </div>
      </Tabs>
 
    </section>
  );
}