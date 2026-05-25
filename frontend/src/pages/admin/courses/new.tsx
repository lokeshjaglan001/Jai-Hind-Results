import { api } from "@/lib/api";
import { GetServerSideProps, NextPage } from "next";
import { CreateCourseForm } from "@/components/admin/courses/CreateCourseForm";
import type { CourseCategory } from "@/pages/admin/course-categories/index"; // Reuse types
import type { CourseTag } from "@/pages/admin/course-tags";

interface CreateCoursePageProps {
  categories: CourseCategory[];
  tags: CourseTag[];
  // Remove authors from here
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // Fetch token securely if needed on server-side (e.g., from cookies)
    // const token = context.req.cookies.authToken; // Example
    const token = undefined; // For client-side auth, token is handled by useAuth

    try {
        const [categories, tags] = await Promise.all([
            api.get('/course-categories'),
            api.get('/course-tags')
        ]);

        return {
            props: {
                categories,
                tags
            },
        };
    } catch (error) {
        console.error("Failed to fetch data for create course page:", error);
        return {
            props: {
                categories: [],
                tags: []
            },
        };
    }
};

const CreateCoursePage: NextPage<CreateCoursePageProps> = ({ categories, tags }) => {
  return (
    <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Course</h1>
        <CreateCourseForm categories={categories} tags={tags} authors={[]} />
    </div>
  );
};

export default CreateCoursePage;