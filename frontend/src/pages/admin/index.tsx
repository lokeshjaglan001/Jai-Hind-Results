// pages/admin/index.tsx
import type { GetServerSideProps, NextPage } from 'next';
import { api } from '@/lib/api';
import { Card, CardHeader, CardBody } from "@heroui/card";
import {
  BookCopy,
  Library,
  FileText,
  LayoutDashboard,
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
  PlusCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@heroui/button';

// Import our chart components
import { EnrollmentTrendChart } from '@/components/admin/EnrollmentTrendChart';
import { PopularContentChart } from '@/components/admin/PopularContentChart';

// --- DATA TYPES (matching our new props) ---

interface KpiData {
  courseCount: number;
  seriesCount: number;
  testCount: number;
  postCount: number;
  totalCourseEnrollments: number;
  totalSeriesEnrollments: number;
  recentPosts: { id: string; title: string }[];
  recentCourses: { id: string; title: string; slug: string }[];
  // totalUsers: number; // REMOVED
  totalRevenue: number; // Will be 0 for now
}

interface TrendData {
  date: string;
  Courses: number;
  "Test Series": number;
}

interface PopularData {
  name: string;
  enrollments: number;
}

interface RecentPost {
  id: string;
  title: string;
}

interface AdminDashboardProps {
  kpis: KpiData;
  enrollmentTrend: TrendData[]; // This will be dummy data
  popularCourses: PopularData[];
  popularSeries: PopularData[];
  recentPosts: RecentPost[];
}

// --- COMPONENTS ---

const StatCard = ({ title, value, icon, isCurrency = false }: { title: string, value: number, icon: React.ReactNode, isCurrency?: boolean }) => {
  const formattedValue = isCurrency
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
    : new Intl.NumberFormat('en-IN').format(value);

  return (
    <Card className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h2 className="text-sm font-medium text-gray-600">{title}</h2>
        {icon}
      </CardHeader>
      <CardBody>
        <div className="text-3xl font-bold">{formattedValue}</div>
      </CardBody>
    </Card>
  );
};

// --- MAIN PAGE ---

const AdminIndex: NextPage<AdminDashboardProps> = ({
  kpis,
  enrollmentTrend,
  popularCourses,
  popularSeries,
  recentPosts,
}) => {
  return (
    <div className="p-4 md:p-8 bg-gray-50/50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>

      </div>

      {/* KPI Cards Grid */}
      {/* We removed "Total Users" to prevent the auth error */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Courses"
          value={kpis.courseCount}
          icon={<BookCopy className="h-5 w-5 text-gray-500" />}
        />
        <StatCard
          title="Test Series"
          value={kpis.seriesCount}
          icon={<Library className="h-5 w-5 text-gray-500" />}
        />
        <StatCard
          title="Mock Tests"
          value={kpis.testCount}
          icon={<FileText className="h-5 w-5 text-gray-500" />}
        />
        <StatCard
          title="Total Posts"
          value={kpis.postCount}
          icon={<LayoutDashboard className="h-5 w-5 text-gray-500" />}
        />
        <StatCard
          title="Course Enrollments"
          value={kpis.totalCourseEnrollments}
          icon={<Users className="h-5 w-5 text-gray-500" />}
        />
        <StatCard
          title="Series Enrollments"
          value={kpis.totalSeriesEnrollments}
          icon={<UserCheck className="h-5 w-5 text-gray-500" />}
        />
      </div>

      {/* Main Dashboard Layout (Charts + Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* We've changed this to "Recent Posts" */}
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <h3 className="text-lg font-semibold">Recent Posts</h3>
          </CardHeader>
          <CardBody>
            <ul className="divide-y divide-gray-200">
              {recentPosts?.length > 0 ? recentPosts.map(post => (
                <li key={post.id} className="py-3">
                  <p className="text-sm font-medium text-gray-900">{post.title}</p>
                </li>
              )) : (
                <p className="text-sm text-gray-500">No recent posts.</p>
              )}
            </ul>
          </CardBody>
        </Card>

        {/* Sidebar Column (1/3 width) */}
        <PopularContentChart data={popularCourses} title="Most Popular Courses" />
        <PopularContentChart data={popularSeries} title="Most Popular Test Series" />
      </div>
    </div>
  );
};

// --- Updated getServerSideProps ---

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // 1. Fetch all the raw data from your existing endpoints
    // NOTE: We have REMOVED the api.get('/users') call
    const [
      coursesRes,
      mockSeriesRes,
      mockTestsRes,
      postsRes,
    ] = await Promise.all([
      api.get('/courses'),
      api.get('/mock-series'),
      api.get('/mock-tests'),
      api.get('/posts?limit=6'), // Fetch enough for "Recent Posts" (5 needed)
    ]);

    // Helper to safely get the data (in case it's wrapped, e.g., res.data)
    const getData = (res: any) => res.data || res;

    const courses = getData(coursesRes);
    const mockSeries = getData(mockSeriesRes);
    const mockTests = getData(mockTestsRes);
    
    // Handle Paginated Posts Response
    // postsRes structure: { data: Post[], meta: { total, ... } }
    const posts = postsRes.data || [];
    const postCount = postsRes.meta?.total || posts.length;

    const totalCourseEnrollments = courses.reduce((sum: number, course: any) =>
      sum + (course.enrolled_users_count || 0), 0
    );

    const totalSeriesEnrollments = mockSeries.reduce((sum: number, series: any) =>
      sum + (series.enrolled_users_count || 0), 0
    );

    // 2. Build the KPIs
    const kpis = {
      courseCount: courses.length,
      seriesCount: mockSeries.length,
      testCount: mockTests.length,
      postCount: postCount, // Use the total from metadata
      totalCourseEnrollments,
      totalSeriesEnrollments,
    };

    // 3. Build the Popular Courses list
    // We use your `enrolled_users_count` field!
    const popularCourses = [...courses]
      .sort((a: any, b: any) => (b.enrolled_users_count || 0) - (a.enrolled_users_count || 0))
      .slice(0, 5)
      .map((course: any) => ({
        name: course.title,
        enrollments: course.enrolled_users_count || 0,
      }));

    // 4. Build the Popular Series list
    // We use your `enrolled_users_count` field!
    const popularSeries = [...mockSeries]
      .sort((a: any, b: any) => (b.enrolled_users_count || 0) - (a.enrolled_users_count || 0))
      .slice(0, 5)
      .map((series: any) => ({
        name: series.title,
        enrollments: series.enrolled_users_count || 0,
      }));

    // 5. Get Recent Posts (as a fallback for "Recent Enrollments")
    const recentPosts = posts
      // .sort(...) // Already sorted by backend (created_at desc)
      .slice(0, 5)
      .map((post: any) => ({
        id: post.id,
        title: post.title,
      }));

    return {
      props: {
        kpis,
        popularCourses,
        popularSeries,
        recentPosts, 
      }
    };

  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    // This will catch auth errors (e.g., if you can't access /users)
    return {
      props: {
        kpis: { courseCount: 0, seriesCount: 0, testCount: 0, postCount: 0, totalRevenue: 0, totalCourseEnrollments: 0, totalSeriesEnrollments: 0 },
        popularCourses: [],
        popularSeries: [],
        recentPosts: [],
      }
    };
  }
};

export default AdminIndex;