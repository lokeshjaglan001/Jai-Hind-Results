'use client';

import { useState, useEffect } from 'react';
import { Clock, Globe, Star, Users, Award, ChevronRight } from 'lucide-react'; 
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/button';
import { FileText, Download, CheckCircle, MonitorPlay, ExternalLink } from 'lucide-react';
import CourseEnrollmentCard from './CourseEnrollmentCard';
import { FullCourseDetails } from '@/pages/courses/[slug]';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { api } from '@/lib/api';

type CourseHeaderProps = {
  title: string;
  description: string;
  instructorName: string;
  instructorAvatar: string; 
  lastUpdated: string;
  language: string;
  rating: number; 
  ratingCount: number; 
  studentCount: number; 
  isBestseller: boolean;
  isFree: boolean;
  course: FullCourseDetails;
  isEnrolled: boolean;
  onEnrollOrPurchase: () => void;
  isLoading: boolean;
  error: string | null;
};

export default function CourseHeader({
  title,
  description,
  instructorName,
  instructorAvatar,
  lastUpdated,
  language,
  rating,
  ratingCount,
  studentCount,
  isBestseller,
  isFree,
  course,
  isEnrolled,
  onEnrollOrPurchase,
  isLoading,
  error
}: CourseHeaderProps) { 
  const { user, token, isLoading: isAuthLoading } = useAuth();
  const [formattedRatingCount, setFormattedRatingCount] = useState<string | number>(ratingCount);
  const [formattedStudentCount, setFormattedStudentCount] = useState<string | number>(studentCount);
  
  // This state was the source of the bug:  
  const [isProcessingEnrollment, setIsProcessingEnrollment] = useState(false);
  const router = useRouter();
  const firstAuthor = course.authors?.[0];

  useEffect(() => {
    setFormattedRatingCount(ratingCount.toLocaleString());
    setFormattedStudentCount(studentCount.toLocaleString());
  }, [ratingCount, studentCount]);

  const formatDuration = (totalSeconds?: number | null, hhmm?: string | null): string => {
    if (hhmm) return hhmm;
    if (!totalSeconds || totalSeconds <= 0) return "N/A";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return "< 1m";
  };


  return (
    <section className="bg-[#0b0b0e] text-white p-6 -mt-3 sm:-mt-19 pt-20 sm:pt-30 sm:p-8 relative min-h-[40vh] pb-24 md:pb-32">
      <div className="relative z-10 md:px-18 px-4 lg:max-w-4xl">
        {/* ... (all your existing JSX for breadcrumbs, title, etc.) ... */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-300 mb-12">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><span className="text-gray-500"><ChevronRight size={14}/></span></li>
              <li><Link href="/courses" className="hover:text-white transition-colors">Courses</Link></li>
              <li><span className="text-gray-500"><ChevronRight size={14}/></span></li>
              <li><span className="font-medium text-white line-clamp-1">{title}</span></li>
            </ol>
        </nav>

        <h1 className="text-3xl lg:text-4xl font-bold mb-9">{title}</h1>
        <p className="max-w-2xl text-gray-200 mb-12">{description}</p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6">
            <div className="flex items-center gap-2">
                <Image src={'/js.png'} alt={instructorName} width={48} height={48} className="rounded-full bg-white h-12 w-12 object-cover border-2 border-indigo-300" />
                <span className="font-medium">By {instructorName}</span>
            </div>
            {isBestseller && (
                <span className="shine text-xs font-semibold bg-green-200 text-green-800 px-3 py-1 rounded-md inline-flex items-center gap-1">
                    <Award size={14} /> Bestseller
                </span>
            )}
            {isFree && (
                <span className="shine text-xs font-semibold bg-purple-300 text-purple-800 px-3 py-1 rounded-md">FREE</span>
            )}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-300 border-b border-gray-700 w-fit pb-4">
            <div className="flex items-center gap-1.5"><Clock size={16} /> Last update on {lastUpdated}</div>
            <span className='hidden sm:block text-gray-600'>|</span>
            <div className="flex items-center gap-1.5"><Globe size={16} /> {language}</div>
        </div>
      </div>
      
      <div className="absolute -bottom-16 left-0 right-0 px-8 z-20 hidden xl:block max-w-[60%]">
        {/* ... (your ratings block) ... */}
        <div className=" bg-white text-gray-800 rounded-lg flex flex-col sm:flex-row items-center gap-4 max-w-2xl shadow-lg mx-auto sm:mx-0 sm:ml-6 lg:ml-18">
            <div className="shine flex-shrink-0 bg-gradient-to-r from-[#982920] to-[#fb3d3d] p-6 rounded-l-md">
                <Image src="/logo.jpg" alt="Logo" width={60} height={60} className="rounded-sm bg-none" />
            </div>
            <div className="flex-grow text-center sm:text-left">
                <p className="text-gray-700 leading-tight">Access the best and the latest top content from <span className="text-red-600 font-bold">Haryana Job Alert</span></p>
            </div>
            <div className="text-center flex-shrink-0 pl-4 sm:border-l border-gray-200">
                <p className="text-3xl font-bold text-gray-900">{4.5}</p>
                <div className="flex text-yellow-400 justify-center">
                    <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} className="text-gray-300" />
                </div>
                <p className="text-xs text-gray-500 mt-1">12k+ ratings</p>
            </div>
            <div className="text-center flex items-center flex-col flex-shrink-0 px-7 my-4 sm:border-l border-gray-200">
                <Users size={24} />
                <p className="text-xl font-bold text-gray-900 mt-1 -mb-1">40k+</p>
                <p className="text-xs text-gray-500 mt-1">Learners</p>
            </div>
        </div>
      </div>

      {/* The desktop enrollment card, now receiving the synced state */}
      <div className="absolute top-40 w-[23%] right-45 hidden xl:block">
        <CourseEnrollmentCard
          slug={course.slug}
          // This prop now gets the correctly synced state
          isEnrolled={isEnrolled} 
          pricingModel={course.pricing_model}
          price={course.sale_price ?? course.regular_price}
          regularPrice={course.regular_price}
          externalLink={course.external_link}
          onEnrollOrPurchase={onEnrollOrPurchase}
          // Pass the correct loading states
          isLoading={isProcessingEnrollment || isAuthLoading} 
          error={error}
          title={course.title}
          thumbnailUrl={course.thumbnail_url || "https://via.placeholder.com/400x225"}
          instructorName={firstAuthor?.full_name || 'HJA Team'}
          courseDuration={formatDuration(null, course.total_duration_hhmm)}
          articlesAttached={0}
          downloadableResources={0}
          mockTests={0}
        />
      </div>

      <div className='hidden bottom-0 right-15 xl:block absolute'>
        <Image src="/avatar.png" alt={''} width={120} height={120}/>
      </div>
    </section>
  );
}