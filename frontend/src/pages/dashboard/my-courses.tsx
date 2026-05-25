import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { BookOpen, Clock, PlayCircle, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  intro_video_url: string | null;
  pricing_model: string;
  regular_price: string | null;
  sale_price: string | null;
  total_duration_sec: number | null;
  status: string;
  created_at: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  status: string;
  started_at: string;
  courses: Course;
}

const MyCoursesPage: NextPage = () => {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && token) {
      fetchEnrolledCourses();
    }
  }, [user, token]);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      // Fetch user enrollments from the backend
      const response = await api.get(`/courses/user/enrollments`, token || undefined);
      setEnrollments(response);
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
      // For now, show empty state if endpoint doesn't exist yet
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-600">Continue learning where you left off</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => {
              const course = enrollment.courses;
              return (
                <Card key={enrollment.id} className="border border-gray-300 hover:shadow-lg transition-all duration-300 overflow-hidden group pt-0">
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {course.thumbnail_url ? (
                      <Image
                        src={course.thumbnail_url}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                        <BookOpen className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    {enrollment.status === 'active' && (
                      <Badge className="absolute top-3 right-3 bg-green-600">Active</Badge>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {course.title}
                    </CardTitle>
                    {course.category && (
                      <Badge variant="outline" className="w-fit mt-2">
                        {course.category.name}
                      </Badge>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {course.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {course.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {course.total_duration_sec && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(course.total_duration_sec)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(enrollment.started_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700" 
                      asChild
                    >
                      <Link href={`/learn/courses/${course.slug}`}>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Continue Learning
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border border-gray-300">
            <CardContent className="py-16">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Yet</h3>
                <p className="text-gray-600 mb-6">
                  You haven't enrolled in any courses yet. Start learning today!
                </p>
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700" 
                  asChild
                >
                  <Link href="/courses">
                    Browse Courses
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyCoursesPage;
