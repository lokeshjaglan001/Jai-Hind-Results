import { GetServerSideProps, NextPage } from "next";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import LearnSidebar from "@/components/courses/LearnSidebar";
import LessonContent from "@/components/courses/LessonContent";
import { FullCourseDetails } from "@/pages/courses/[slug]"; // Reuse this type
import { Lesson, Topic } from "@/pages/admin/courses/[id]"; // Reuse this type
import { AlertCircle, AlertTriangle, Book, Video } from "lucide-react";
import { Button } from "@heroui/button";
import {Tabs, Tab} from "@heroui/tabs";
import Link from "next/link";

interface CourseLearnPageProps {
  slug: string;
}

// 1. getServerSideProps only passes the slug. Data fetching is done client-side.
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.params!;
    if (typeof slug !== 'string') {
        return { notFound: true };
    }
    return { props: { slug } };
};


const CourseLearnPage: NextPage<CourseLearnPageProps> = ({ slug }) => {
    const { user, token, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    // State for data
    const [course, setCourse] = useState<FullCourseDetails | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 2. useEffect handles fetching data and checking auth/enrollment
    useEffect(() => {
        const loadCourseData = async () => {
            if (!isAuthLoading && !token) {
                // Not logged in, redirect to login
                router.replace(`/auth/login?redirect=${router.asPath}`);
                return;
            }

            if (token) {
                try {
                    setIsLoading(true);
                    setError(null);

                    // First, get course ID and check enrollment (requires backend endpoints)
                    const basicCourse = await api.get(`/courses/slug/${slug}`, token);
                    if (!basicCourse || !basicCourse.id) {
                         throw new Error("Course not found.");
                    }

                    const enrollmentStatus = await api.get(`/courses/${basicCourse.id}/check-enrollment`, token);
                    
                    if (!enrollmentStatus.enrolled) {
                        // Not enrolled, redirect back to course info page
                        setError("You are not enrolled in this course.");
                        router.replace(`/courses/${slug}`);
                        return;
                    }

                    // Enrolled! Set the full course data
                    // We sort topics/lessons here
                    const sortedTopics = (basicCourse.course_topics || []).sort((a: Topic, b: Topic) => a.order - b.order);
                    sortedTopics.forEach((topic: Topic) => {
                        if (topic.lessons) {
                            topic.lessons.sort((a, b) => a.order - b.order);
                        }
                    });
                    basicCourse.course_topics = sortedTopics;

                    setCourse(basicCourse);
                    // Set the first lesson as the default
                    setSelectedLesson(basicCourse.course_topics?.[0]?.lessons?.[0] || null);

                } catch (err: unknown) {
                    console.error("Failed to load course content:", err);
                    setError(err instanceof Error ? err.message : "Failed to load course content.");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadCourseData();
    }, [slug, token, isAuthLoading, router]);

    // 3. Render loading/error/content states
    if (isLoading || isAuthLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <h2 className="text-xl font-semibold">Loading Course...</h2>
            </div>
        );
    }
    
    if (error) {
        return (
             <div className="flex h-screen items-center justify-center flex-col gap-4">
                <AlertTriangle className="h-12 w-12 text-red-500" />
                <h2 className="text-xl font-semibold">Error Loading Course</h2>
                <p className="text-gray-500">{error}</p>
                <Button onPress={() => router.push('/courses')}>Go back to Courses</Button>
            </div>
        );
    }
    
    if (!course) {
        return <div className="flex h-screen items-center justify-center">Course not found.</div>;
    }

    // 4. Render the NEW two-column layout
    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <Head>
                <title>Learning: {course.title}</title>
            </Head>
            
            {/* Enhanced header for the learn page */}
            <header className="flex-shrink-0 bg-gray-950 shadow-sm">
                <div className="px-4 py-4 flex justify-between items-center">
                    <Link 
                        href="/dashboard" 
                        className="flex items-center gap-2 hover:text-gray-400 transition-colors group text-white pr-5 pl-2 rounded-full py-1"
                    >
                        <svg 
                            className="w-5 h-5 group-hover:-translate-x-1 transition-transform" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-semibold hidden sm:inline">Back to Dashboard</span>
                    </Link>
                    <h1 className="text-lg md:text-xl text-white truncate max-w-[200px] md:max-w-md lg:max-w-2xl">
                        {course.title}
                    </h1>
                </div>
            </header>
            
            <div className="flex-1 grid grid-cols-12 overflow-y-auto lg:overflow-hidden">
                {/* Main Content (Video + Tabs) */}
                <main className="col-span-12 lg:col-span-9 flex flex-col bg-white overflow-y-auto">
                    {/* Enhanced Video Player Area */}
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black relative">
                        <LessonContent lesson={selectedLesson} />
                    </div>

                    {/* Enhanced Tabs Area */}
                    <div className="p-4 md:p-8 lg:p-10 flex flex-col items-center">
                        <div className="mt-6 w-full space-y-6">
                            {selectedLesson ? (
                                <>
                                    <div className="border-l-4 border-gray-800 pl-6">
                                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                                            {selectedLesson.title}
                                        </h1>
                                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-4">
                                            <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                                                <Video className="w-4 h-4 text-gray-700" />
                                                Lesson {selectedLesson.order + 1}
                                            </span>
                                        </div>
                                    </div>
                                    {selectedLesson.description ? (
                                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
                                            <div 
                                                className="prose prose-lg max-w-none text-gray-700 prose-headings:text-gray-900 prose-a:text-gray-800 hover:prose-a:text-gray-900 prose-strong:text-gray-900"
                                                dangerouslySetInnerHTML={{ __html: selectedLesson.description }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-500 text-lg">No description available for this lesson.</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-16 bg-gray-100 rounded-xl border border-gray-200">
                                    <div className="animate-pulse mb-4">
                                        <Video className="w-16 h-16 text-gray-400 mx-auto" />
                                    </div>
                                    <p className="text-gray-600 text-lg font-medium">Select a lesson from the curriculum below</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Sidebar - Below Content */}
                    <div className="lg:hidden border-t border-gray-200">
                        <LearnSidebar
                            course={course}
                            selectedLessonId={selectedLesson?.id || null}
                            onSelectLesson={(lesson) => setSelectedLesson(lesson)}
                        />
                    </div>
                </main>
                
                {/* Desktop Sidebar (on the right) */}
                <aside className="col-span-12 lg:col-span-3 h-full overflow-y-auto bg-white shadow-sm hidden lg:block">
                    <LearnSidebar
                        course={course}
                        selectedLessonId={selectedLesson?.id || null}
                        onSelectLesson={(lesson) => setSelectedLesson(lesson)}
                    />
                </aside>
            </div>
        </div>
    );
};

export default CourseLearnPage;