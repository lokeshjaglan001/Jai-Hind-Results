// This file is your component, e.g., components/home/CourseSection.tsx

import { Star, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Import the types (Ideally, move these to a shared `types/index.ts` file)
import type { Course } from "@/components/admin/courses/CreateCourseForm";
import type { CourseCategory } from "@/pages/admin/course-categories";
import { Button } from '@heroui/button';

// These interfaces just define the props
interface PublicCourse extends Omit<Course, 'tags' | 'authors'> { 
    slug: string; 
    thumbnail_url: string | null;
    category: CourseCategory | undefined; 
    authors: { full_name: string; avatar_url: string }[]; 
    tags: { tag: { name: string } }[]; 
    enrolled_users_count?: number; 
    lesson_count?: number; 
    total_duration_hhmm?: string | null; 
    rating: number;
    reviews: number;
    offerEndsSoon: boolean;
}

interface CoursesHomePageProps {
    courses: PublicCourse[];
}

// 1. Changed from NextPage to React.FC and removed all data-fetching
const CourseSection: React.FC<CoursesHomePageProps> = ({ courses }) => {
    
    // This check is still good!
    if (!courses || courses.length === 0) {
        return (
            <section className="bg-white py-12 px-4 md:px-0">
                <div className="text-center mb-20">
                    <Image
                        src="/courses.png"
                        alt="Courses"
                        className="inline-block h-20 w-auto"
                        width={300}
                        height={80}
                    />
                </div>
                <p className="text-center text-gray-500">No courses are available at this time.</p>
            </section>
        );
    }
    
    return (
        <section className="bg-white py-12 px-4 md:px-0">
            <div>
                <div className="text-center mb-20">
                    <Image
                        src="/courses.png"
                        alt="Mock Tests"
                        className="inline-block h-20 w-auto"
                        width={300}
                        height={80}
                    />
                </div>

                <div className="flex overflow-x-auto scrollbar-hide gap-3 py-2">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-white p-2 rounded-2xl overflow-hidden flex flex-col flex-shrink-0 w-[70%] md:w-[32%] shadow-sm">
                            <div className="relative">
                                    <Image
                                        src={course.thumbnail_url || '/default-thumbnail.png'} // Added fallback
                                        alt={course.title}
                                        className="w-full h-auto object-cover aspect-video rounded-2xl"
                                        width={600}
                                        height={400}
                                        unoptimized
                                    />
                            </div>

                            <div className="py-5 px-1 flex flex-col flex-grow justify-between">
                                <div className="flex justify-between items-start mb-2 flex-col sm:flex-row">
                                    <h3 className="md:text-md text-sm font-bold text-gray-800 leading-tight">
                                        {course.title}
                                    </h3>
                                </div>
                                <p className="md:text-sm text-xs text-gray-500 mb-3 line-clamp-2">{course.description}</p> {/* Added line-clamp */}

                                <div className="flex items-center gap-2 mb-4">
                                    <Image 
                                      src={'/logo.jpg'} // Added fallback
                                      width={40} height={40} 
                                      alt={course.authors?.[0]?.full_name || 'Author'} // Added fallback
                                      className="w-7 h-7 rounded-full" 
                                      unoptimized 
                                    />
                                    <span className="text-sm text-gray-700">By {course.authors?.[0]?.full_name || 'HJA Team'}</span>
                                </div>

                                <div className="flex md:items-center gap-3 mb-5 flex-col sm:flex-row">
                                     <span className="text-2xl font-bold text-gray-800">
                                        {course.pricing_model === 'free'
                                            ? 'Free'
                                            : `₹${course.sale_price ?? course.regular_price}`
                                        }
                                        {course.pricing_model === 'paid' && course.sale_price && course.regular_price && course.sale_price < course.regular_price && (
                                            <span className="ml-2 text-sm text-muted-foreground line-through">₹{course.regular_price}</span>
                                        )}
                                    </span>
                                    {course.offerEndsSoon && (
                                        <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-md">
                                            Free offer will end soon
                                        </span>
                                    )}
                                </div>

                                <div className="mt-auto flex items-center gap-3">
                                    {/* --- 2. BUG FIX: Use course.slug for the link --- */}
                                    <Link
                                        href={`/courses/${course.slug}`}
                                        prefetch={false}
                                        className="shine flex-grow bg-gradient-to-r from-red-600 to-gray-800 text-white text-center rounded-lg px-4 py-3 font-semibold text-xs md:text-sm inline-flex items-center justify-center hover:opacity-90 transition-opacity"
                                    >
                                        View Course
                                    </Link>
                                    <button title='Heart' className="p-3 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors">
                                        <Heart className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/courses" prefetch={false}>
                        <Button variant="bordered" className="bg-gray-100 border-2 border-gray-300 rounded-xl px-12 py-3 font-semibold text-gray-800 hover:bg-gray-100 hover:border-gray-400 transition-all shadow-sm">
                            View More
                        </Button>
                    </Link>
                </div>
                <div className='mt-10 md:hidden'>
                    {/* <AdBanner text="Google Ads Section" className="h-32" /> */}
                </div>
            </div>
        </section>
    );
}

export default CourseSection;