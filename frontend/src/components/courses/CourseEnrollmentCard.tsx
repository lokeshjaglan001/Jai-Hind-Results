import Image from 'next/image';
import { FileText, Download, CheckCircle, MonitorPlay, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/router';
import { Button } from '../ui/button';

type CourseEnrollmentCardProps = {
  // courseId: number;
  title: string;
  isEnrolled: boolean;
  thumbnailUrl: string;
  instructorName: string;
  courseDuration: string;
  articlesAttached: number;
  downloadableResources: number;
  mockTests: number;
  pricingModel: string;
  price: number | null;
  regularPrice: number | null;
  externalLink: string | null;
  onEnrollOrPurchase: () => void;
  isLoading: boolean;
  error?: string | null;
  slug: string;
};

export default function CourseEnrollmentCard({
  slug,
  title,
  isEnrolled,
  thumbnailUrl,
  instructorName,
  courseDuration,
  articlesAttached,
  downloadableResources,
  mockTests,
  pricingModel,
  price,
  regularPrice,
  externalLink,
  onEnrollOrPurchase,
  isLoading,
  error,
}: CourseEnrollmentCardProps) {

  const router = useRouter(); 

  const handleGoToCourse = () => {
    // --- FIX: Use slug to navigate, not courseId ---
    router.push(`/learn/courses/${slug}`);
  };

  const renderEnrollButton = () => {
    if (isEnrolled) {
      console.log("User is already enrolled, showing 'Go to Course' button.");
      return (
        <Button
          className="w-full text-lg shine bg-gradient-to-r from-green-600 to-green-800"
          onClick={handleGoToCourse} // <-- This is the navigation function
        >
          Go to Course <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      );
    }
    
  return (
      <Button
        className="w-full text-lg shine bg-gradient-to-r from-indigo-600 to-indigo-300 hover:from-indigo-700"
        onClick={onEnrollOrPurchase} // <-- This is the purchase function
        disabled={isLoading}
      >
        {isLoading
          ? 'Processing...'
          : pricingModel === 'free'
          ? 'Enroll Now'
          : externalLink
          ? 'Buy Now'
          : 'Purchase Now'}
      </Button>
    );
  };
  
  return (
    <div>
      {/* This div was causing layout issues, removed sticky/absolute positioning */}
      <div className="bg-white relative rounded-xl shadow-lg border border-gray-200/80">
        {
          pricingModel === 'free' ? <img src="/free-ribbon.jpg" alt="" className='absolute -top-17 z-10 w-[100px] -left-21' /> : <img src="/paid-ribbon.jpg" alt="" className='absolute -top-17 z-10 w-[100px] -left-21' />
        }
        <div className="relative">
          <Image
            src={thumbnailUrl}
            alt={title}
            width={400}
            height={225}
            className="w-full h-auton rounded-t-xl"
          />
          
        </div>

        <div className="p-6">
          {/* --- FIX: Dynamic Price Display --- */}
          <div className="text-3xl font-bold text-gray-800 mb-4 text-right">
            {pricingModel === 'free' ? '' : `₹${price}`}
            {pricingModel === 'paid' && price && regularPrice && price < regularPrice && (
                <span className="ml-2 text-base text-muted-foreground line-through">₹{regularPrice}</span>
            )}
          </div>
          
          {/* --- FIX: Call the renderEnrollButton function --- */}
          {renderEnrollButton()}

          {/* Display error if it exists */}
          {error ? (
            <div className="mt-3 text-sm text-red-600" role="alert">
              {error}
            </div>
          ) : null}

          <div className="mt-6 space-y-3 text-gray-600">
            <h4 className="font-bold text-gray-800">This course gives you:</h4>
            {courseDuration && courseDuration !== 'N/A' && (
              <div className="flex items-center gap-3 text-sm">
                <MonitorPlay size={16} className="text-indigo-500" /> Course Duration: {courseDuration}
              </div>
            )}
              <div className="flex items-center gap-3 text-sm">
                <FileText size={16} className="text-indigo-500" /> Articles attached: {articlesAttached}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Download size={16} className="text-indigo-500" /> Downloadable resources: {downloadableResources}
              </div>
            <div className="flex items-center gap-3 text-sm">
                <CheckCircle size={16} className="text-indigo-500" /> {pricingModel === 'free' ? 'Free Course' : 'Paid Course'}
            </div>
              <div className="flex items-center gap-3 text-sm">
                <FileText size={16} className="text-indigo-500" /> Mock tests: {mockTests}
              </div>
          </div>
        </div>
      </div>
      
      {/* This image was positioned absolutely, which is likely not what you want. Removed. */}
      {/* <div className="absolute bottom-46 right-0">
        <Image src="/avatar.png" alt="" width={120} height={120} />
      </div> */}
    </div>
  );
}