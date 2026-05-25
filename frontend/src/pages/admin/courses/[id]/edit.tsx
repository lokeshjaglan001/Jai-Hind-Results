import { GetServerSideProps, NextPage } from "next";
import { api } from "@/lib/api";
import { CreateCourseForm, Course } from "@/components/admin/courses/CreateCourseForm";
import type { CourseCategory } from "@/pages/admin/course-categories";
import type { CourseTag } from "@/pages/admin/course-tags";
import type { User } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface EditCoursePageProps {
  courseId: string; // Only pass the ID from the server
}

// This function now ONLY gets the ID from the URL and passes it as a prop.
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params!;
    if (typeof id !== 'string') {
        return { notFound: true };
    }
    // Just pass the ID, don't fetch data here
    return { props: { courseId: id } };
};

const EditCoursePage: NextPage<EditCoursePageProps> = ({ courseId }) => {
    const { token, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    // State to hold all our fetched data
    const [course, setCourse] = useState<Course | null>(null);
    const [categories, setCategories] = useState<CourseCategory[]>([]);
    const [tags, setTags] = useState<CourseTag[]>([]);
    const [authors, setAuthors] = useState<User[]>([]); // Authors are fetched client-side in the form
    const [isLoading, setIsLoading] = useState(true); // Page loading state
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            // Wait for auth to be resolved AND token to be available
            if (!isAuthLoading && token) {
                try {
                    setIsLoading(true);
                    setError(null);
                    
                    // Fetch all required data in parallel *with the token*
                    // Note: authors are fetched inside CreateCourseForm
                    const [courseData, categoriesData, tagsData] = await Promise.all([
                        api.get(`/courses/id/${courseId}`, token), // Fetch course with token
                        api.get('/course-categories', token),    // Fetch categories
                        api.get('/course-tags', token)          // Fetch tags
                    ]);
                    
                    setCourse(courseData);
                    setCategories(categoriesData || []);
                    setTags(tagsData || []);

                } catch (err: unknown) {
                    console.error("Failed to fetch data for edit page:", err);
                    setError(err instanceof Error ? err.message : "Failed to load data");
                } finally {
                    setIsLoading(false);
                }
            } else if (!isAuthLoading && !token) {
                 // Auth is resolved, but user is not logged in
                 router.push('/login');
            }
        };
        
        fetchData();
    }, [token, isAuthLoading, courseId, router]); // Re-run if auth or ID changes

    // Show a loading state while fetching data
    if (isLoading || isAuthLoading || !course) {
         return <div className="flex h-screen items-center justify-center">Loading course data...</div>;
    }

    // Show error if fetching failed
    if (error) {
         return <div className="flex h-screen items-center justify-center text-red-500">Error: {error}</div>;
    }
    
    // Once data is loaded, render the page
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Edit Course</h1>
            {/* CreateCourseForm will fetch its own authors.
              We pass the successfully fetched course, categories, and tags.
            */}
            <CreateCourseForm
                initialData={course}
                categories={categories}
                tags={tags}
                authors={[]} // Pass empty, form will fetch its own
            />
        </div>
    );
};

export default EditCoursePage;