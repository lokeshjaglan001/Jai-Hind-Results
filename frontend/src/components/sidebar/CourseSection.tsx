import { Star, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CourseCategory {
  id: number | string;
  name: string;
}

interface PublicCourse {
  id: number | string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  description?: string | null;
  pricing_model: 'free' | 'paid';
  regular_price?: number | null;
  sale_price?: number | null;
  category?: CourseCategory;
  authors: { full_name: string; avatar_url: string }[];
  tags: { tag: { name: string } }[];
  enrolled_users_count?: number;
  lesson_count?: number;
  total_duration_hhmm?: string | null;
  rating: number;
  reviews: number;
  offerEndsSoon?: boolean;
}

interface CourseSectionProps {
  courses?: PublicCourse[];
}

export default function CourseSection({ courses = [] }: CourseSectionProps) {
  // Show only 2-3 courses
  const displayedCourses = courses.slice(0, 3);

  // Fallback to placeholder if no courses
  if (displayedCourses.length === 0) {
    return null;
  }

  return (
    <section className="bg-white pb-12">
      <div className="">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-10">
          Courses
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {displayedCourses.map((course) => (
            <div key={course.id} className="bg-white p-2 rounded-2xl overflow-hidden flex flex-col shadow-sm">
              <div className="relative">
                <Link href={`/courses/${course.slug}`}>
                  <Image
                    src={course.thumbnail_url || 'https://placehold.co/600x400/3b82f6/ffffff?text=Course&font=inter'}
                    alt={course.title}
                    className="w-full h-auto object-cover aspect-video rounded-2xl"
                    width={600}
                    height={400}
                    unoptimized
                  />
                </Link>
              </div>

              <div className="py-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-md font-bold text-gray-800 leading-tight">
                        <Link href={`/courses/${course.slug}`}>{course.title}</Link>
                    </h3>
                </div>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                  {course.description || `${course.lesson_count || 0} lessons | ${course.total_duration_hhmm || 'Self-paced'}`}
                </p>
                
                {course.authors && course.authors.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                      <Image 
                        src={course.authors[0].avatar_url || '/logo.jpg'} 
                        alt={course.authors[0].full_name} 
                        className="w-7 h-7 rounded-full" 
                        width={40} 
                        height={40} 
                        unoptimized 
                      />
                      <span className="text-xs text-gray-700">By {course.authors.map(author => author.full_name).join(', ')}</span>
                  </div>
                )}

                <div className="flex flex-col gap-3 mb-5">
                  <div>
                    <span className="text-2xl font-bold text-gray-800">
                      {course.pricing_model === 'free'
                        ? 'Free'
                        : `₹${course.sale_price ?? course.regular_price}`
                      }
                    </span>
                    {course.pricing_model === 'paid' && course.sale_price && course.regular_price && course.sale_price < course.regular_price && (
                      <span className="ml-2 text-sm text-gray-400 line-through">₹{course.regular_price}</span>
                    )}
                  </div>
                    {course.offerEndsSoon && (
                      <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-2 rounded-md">
                        Free offer will end soon
                      </span>
                    )}
                </div>

                <div className="mt-auto flex items-center gap-3">
                  <Link
                    href={`/courses/${course.slug}`}
                    className="shine flex-grow bg-gradient-to-r from-red-600 to-gray-800 text-white text-center rounded-lg px-2 py-3 font-semibold text-xs inline-flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    View Course
                  </Link>
                  <button 
                    className="p-3 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length > 3 && (
          <div className="text-center mt-8">
            <Link href="/courses">
              <button className="bg-gray-100 border-2 border-gray-300 rounded-xl w-full text-sm py-3 font-semibold text-gray-800 hover:bg-gray-100 hover:border-gray-400 transition-all shadow-sm">
                View More
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}