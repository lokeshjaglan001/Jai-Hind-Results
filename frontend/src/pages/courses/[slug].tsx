import { GetServerSideProps, NextPage } from "next";
import { api } from "@/lib/api";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import CourseHeader from "@/components/courses/CourseHeader";
import CourseEnrollmentCard from "@/components/courses/CourseEnrollmentCard";
import CourseDescription from "@/components/courses/CourseDescription";
import CourseContentAccordion from "@/components/courses/CourseContentAccordion";
// import AdBanner from "@/components/home/AdBanner";
import { useState, useEffect } from "react";
import Head from 'next/head';
import { Card } from "@/components/ui/card";
// --- MODIFICATION START ---
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import { useRouter } from "next/router"; // Import useRouter
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, ExternalLink, FileText, MonitorPlay } from 'lucide-react'; // Import Button for mobile enroll
import { AuthDialog } from "@/components/auth/AuthDialog"; // Import AuthDialog
// --- MODIFICATION END ---


import type { Lesson, Topic } from "@/pages/admin/courses/[id]";
import Image from "next/image";

export interface FullCourseDetails {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    thumbnail_url: string | null;
    intro_video_url: string | null;
    pricing_model: 'free' | 'paid';
    regular_price: number | null;
    sale_price: number | null;
    external_link: string | null; // External link for paid courses
    status: 'draft' | 'published';
    created_at: string;
    updated_at: string;
    total_duration_hhmm: string | null;
    category: { id: string; name: string; slug: string; description: string | null };
    authors: { id: string; full_name: string; email: string; avatar_url?: string | null }[]; // Added optional avatar_url
    tags: { tag: { id: string; name: string; slug: string } }[];
    course_topics: Topic[];
    enrolled_users_count?: number;
    lesson_count?: number;
    // You might need an 'isEnrolled' field from the API if user is logged in
    isEnrolled?: boolean; // Add this if your API provides it
    average_rating?: number; // Add this if API provides rating
    rating_count?: number; // Add this if API provides rating count
}


interface CoursePageProps {
  course: FullCourseDetails;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.params!;
    if (typeof slug !== 'string') {
        return { notFound: true };
    }
    // TODO: Get token from cookies if checking enrollment server-side
    try {
        const course = await api.get(`/courses/slug/${slug}`);
        if (course.status !== 'published') {
             return { notFound: true };
        }
        return { props: { course } };
    } catch (error) {
        console.error(`Failed to fetch course with slug ${slug}:`, error);
        return { notFound: true };
    }
};

// Helper functions (remain the same)
const formatDuration = (totalSeconds?: number | null, hhmm?: string | null): string => {
    if (hhmm) return hhmm;
    if (!totalSeconds || totalSeconds <= 0) return "N/A";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
     // Simple format, adjust as needed
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return "< 1m";
};
const formatLessonDuration = (seconds?: number | null): string => {
    if (!seconds || seconds <= 0) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    // Simple format
    if (mins > 0 && secs > 0) return `${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m`;
    if (secs > 0) return `${secs}s`;
     return "< 1s";
};


const CoursePage: NextPage<CoursePageProps> = ({ course }) => {
    console.log("Rendering CoursePage for course:", course);
    // --- MODIFICATION START ---
    const { user, token, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const [isProcessingEnrollment, setIsProcessingEnrollment] = useState(false);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false); // Add auth dialog state
    
    // Initialize state from server prop, default to false.
    const [isEnrolled, setIsEnrolled] = useState(course.isEnrolled || false);
    
    const [error, setError] = useState<string | null>(null);
    const [formattedDate, setFormattedDate] = useState('');
    const [formattedStudentCount, setFormattedStudentCount] = useState<string | number>(course.enrolled_users_count || 0);


    useEffect(() => {
        setFormattedDate(new Date(course.updated_at || course.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
        setFormattedStudentCount((course.enrolled_users_count || 0).toLocaleString());

        const checkEnrollment = async () => {
            // Check if user is logged in
            if (user && token) { 
                 try {
                    const enrollmentStatus = await api.get(`/courses/${course.id}/check-enrollment`, token);
                    // Directly set the state to whatever the API returns
                    setIsEnrolled(enrollmentStatus.enrolled);
                 } catch (err) {
                     console.error("Failed to check course enrollment", err);
                     setIsEnrolled(false); // Assume not enrolled if check fails
                 }
            } else {
                // If user is not logged in, they are not enrolled
                setIsEnrolled(false);
            }
        };

        // Run the check only after auth is resolved
        if (!isAuthLoading) {
           checkEnrollment();
        }
    // Run this effect when auth state changes, or when the course ID changes
    }, [course.id, user, token, isAuthLoading, course.updated_at, course.created_at, course.enrolled_users_count]);

    const handleGoToCourse = () => {
        alert('Navigating to course content...');
        router.push(`/learn/courses/${course.slug}`); // Uncomment when page exists
    };

    // Prepare data for CourseContentAccordion (remains the same)
    const courseContentData = {
        totalSections: course.course_topics?.length || 0,
        totalLectures: course.lesson_count || 0,
        totalLength: formatDuration(null, course.total_duration_hhmm),
        sections: (course.course_topics || []).sort((a,b) => a.order - b.order).map(topic => ({
            title: topic.title,
            lectures: topic.lessons?.length || 0,
            duration: formatDuration(topic.lessons?.reduce((sum, l) => sum + (l.video_duration_sec || 0), 0)),
            items: (topic.lessons || []).sort((a,b) => a.order - b.order).map(lesson => ({
                title: lesson.title,
                duration: formatLessonDuration(lesson.video_duration_sec)
            }))
        }))
    };

    const firstAuthor = course.authors?.[0];

    // --- MODIFICATION START: Enrollment/Purchase Handler ---
    const handleEnrollOrPurchase = async () => {
        setIsProcessingEnrollment(true);
        setError(null);

        if (!user) {
            setIsProcessingEnrollment(false);
            setIsAuthDialogOpen(true); // Open auth dialog instead of redirecting
            return;
        }

        const authToken = token || undefined;

        try {
            if (course.pricing_model === 'free') {
                // Call free enrollment endpoint
                await api.post(`/courses/${course.id}/enroll`, {}, authToken);
                alert("Successfully enrolled!");
                setIsEnrolled(true);
                router.push(`/learn/courses/${course.slug}`);

            } else { // Paid course
                // Redirect to external link
                if (course.external_link) {
                    window.open(course.external_link, '_blank');
                } else {
                    setError("Course purchase link is not available.");
                }
                setIsProcessingEnrollment(false);
            }
        } catch (err: unknown) {
             console.error("Enrollment Error:", err);
             const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
             alert(`Error: ${errorMessage}`);
        } finally {
            setIsProcessingEnrollment(false);
        }
    };
     // --- MODIFICATION END ---


    return (
        <div className="bg-white">
            <Head>
                 <title>{`${course.title} | Haryana Job Alert`}</title>
                 <meta name="description" content={course.description || `Learn about ${course.title} on Haryana Job Alert.`} />
            </Head>

            <Header />
            <div> {/* Added relative positioning */}
                <CourseHeader
                    title={course.title}
                    description={course.description || ''}
                    instructorName={firstAuthor?.full_name || 'HJA Team'}
                    instructorAvatar={firstAuthor?.avatar_url || "/default-avatar.png"} // Use fetched avatar or fallback
                    lastUpdated={formattedDate}
                    language={"English, Hindi"}
                    rating={course.average_rating || 0} // Use fetched rating
                    ratingCount={course.rating_count || 0} // Use fetched count
                    studentCount={course.enrolled_users_count || 0}
                    isBestseller={false} // Determine bestseller status if needed
                    isFree={course.pricing_model === 'free'}
                    isEnrolled={isEnrolled}
                    onEnrollOrPurchase={handleEnrollOrPurchase}
                    isLoading={isProcessingEnrollment || isAuthLoading}
                    error={error}
                    course={course}                 
                />
                 {/* --- MODIFICATION START: Show Enroll/Buy button for mobile/tablet --- */}
                <div className="container mx-auto px-4 xl:hidden mt-[-4rem] mb-8 relative z-20">
                    <Card className="bg-white p-4 shadow-lg rounded-4xl border border-gray-200">
                        <Image src={course.thumbnail_url || ''}
                            alt={course.title}
                            width={400} 
                            height={225}
                            className="w-full h-auto rounded-2xl" />
                        
                        <div className=" space-y-3 text-gray-600">
                            <h4 className="font-bold text-gray-800">This course gives you:</h4>
                            {course.total_duration_hhmm && course.total_duration_hhmm !== 'N/A' && (
                                <div className="flex items-center gap-3 text-sm">
                                    <MonitorPlay size={16} className="text-indigo-500" /> Course Duration: {formatDuration(null, course.total_duration_hhmm)}
                                </div>
                            )}
                                <div className="flex items-center gap-3 text-sm">
                                    <FileText size={16} className="text-indigo-500" /> Articles attached
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Download size={16} className="text-indigo-500" /> Downloadable resources
                                </div>
                            <div className="flex items-center gap-3 text-sm">
                                <CheckCircle size={16} className="text-indigo-500" /> {course.pricing_model === 'free' ? 'Free Course' : 'Paid Course'}
                            </div>
                        </div>
                        {isEnrolled ? (
                             <Button
                                className="w-full text-lg shine bg-gradient-to-r from-green-600 to-green-800"
                                onClick={handleGoToCourse} // Use the correct handler
                             >
                                 Go to Course <ExternalLink className="ml-2 h-4 w-4"/>
                             </Button>
                        ) : (
                            <Button
                                className="w-full rounded-2xl shine bg-gradient-to-r from-indigo-600 to-indigo-300"
                                onClick={handleEnrollOrPurchase}
                                disabled={isProcessingEnrollment || isAuthLoading}
                            >
                                {isProcessingEnrollment ? 'Processing...' : (course.pricing_model === 'free' ? 'Enroll Now' : `Buy Now ${course.sale_price ? `at ₹${course.sale_price}` : ''}`)}
                            </Button>
                         )}
                         {error && <p className="text-sm text-red-600 mt-2 text-center">{error}</p>}
                    </Card>
                </div>
                 {/* --- MODIFICATION END --- */}
            </div>

            <div className="container mx-auto px-4 py-8 pt-0 md:pt-8"> {/* Adjusted padding */}
                <div className="grid grid-cols-1 xl:grid-cols-3 items-start">
                    <main className="lg:col-span-2 space-y-6 lg:mr-8 mr-0 mt-1 sm:mt-12 md:mt-0 p-3 sm:p-18">
                        <CourseDescription description={course.description || "No description provided."} />
                        <CourseContentAccordion content={courseContentData} />
                    </main>

                    {/* <aside className="space-y-8 col-span-1 hidden xl:block sticky top-24">
                        <CourseEnrollmentCard
                            slug={course.slug}                           
                            isEnrolled={isEnrolled}
                            pricingModel={course.pricing_model}
                            price={course.sale_price ?? course.regular_price}
                            regularPrice={course.regular_price}
                            onEnrollOrPurchase={handleEnrollOrPurchase}
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
                    </aside> */}
                </div>
            </div>
            
            {/* Auth Dialog */}
            <AuthDialog
                open={isAuthDialogOpen}
                onOpenChange={setIsAuthDialogOpen}
                redirectAfterLogin="/dashboard"
            />
            
            <Footer />
        </div>
    );
}

export default CoursePage;