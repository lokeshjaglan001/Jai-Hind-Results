import { GetServerSideProps, NextPage } from "next";
import { api } from "@/lib/api";
import { CoursesClient } from "@/components/admin/courses/CoursesClient";
import type { Course } from "@/components/admin/courses/CreateCourseForm"; // Import Course type

interface CoursesPageProps {
  courses: Course[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // Fetch token securely if needed
    const token = undefined; // Handled client-side by useAuth
    try {
        // Fetch published and draft courses for admin view
        const courses = await api.get('/courses', token); // Use query param if API supports it
        return {
            props: { courses },
        };
    } catch (error) {
        console.error("Failed to fetch courses:", error);
        return {
            props: { courses: [] }, // Return empty array on error
        };
    }
};

const AllCoursesPage: NextPage<CoursesPageProps> = ({ courses }) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">All Courses</h1>
        {/* Button is now inside CoursesClient */}
      </div>
      <CoursesClient data={courses} />
    </div>
  );
};

export default AllCoursesPage;