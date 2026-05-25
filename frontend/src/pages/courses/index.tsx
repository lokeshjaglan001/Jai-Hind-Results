import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Users, Search, Filter, X } from "lucide-react"; // Import icons
import { useState, useMemo } from "react";

// Reuse the Course type, ensure it includes necessary fields for display
import type { Course } from "@/components/admin/courses/CreateCourseForm";
import type { CourseCategory } from "@/pages/admin/course-categories";

// Define the shape of data coming from GET /courses (public)
interface PublicCourse extends Omit<Course, 'tags' | 'authors'> { // Omit admin-specific relations if needed
    slug: string; // Ensure slug is included
    thumbnail_url: string | null;
    category: CourseCategory | undefined; // Expect category object
    authors: { full_name: string; avatar_url: string }[]; // Expect authors with names
    tags: { tag: { name: string } }[]; // Expect tags nested like this
    enrolled_users_count?: number; // Optional count
    lesson_count?: number; // Optional count
    total_duration_hhmm?: string | null; // Optional duration
    rating: number;
    reviews: number;
    offerEndsSoon: boolean;
    // Add calculated rating if provided by API, otherwise handle client-side if needed
}

interface CoursesHomePageProps {
    courses: PublicCourse[];
    headerCategories: any[];
    carouselItems: any[];
}

export const getStaticProps: GetStaticProps = async () => {
    try {
        // Fetch only published courses for the public page
        const [courses, categories, carouselItems] = await Promise.all([
            api.get('/courses?status=published'),
            api.get('/categories'),
            api.get('/carousel'),
        ]);
        return { 
            props: { courses, headerCategories: categories || [], carouselItems: carouselItems || [] },
            revalidate: 60,
        };
    } catch (error) {
        console.error("Failed to fetch published courses:", error);
        return { 
            props: { courses: [], headerCategories: [], carouselItems: [] },
            revalidate: 60,
        };
    }
};

const CoursesHomePage: NextPage<CoursesHomePageProps> = ({ courses, headerCategories, carouselItems }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedPricing, setSelectedPricing] = useState<string>("all");

    // Extract unique categories from courses
    const categories = useMemo(() => {
        const uniqueCategories = new Set<string>();
        courses.forEach(course => {
            if (course.category?.name) {
                uniqueCategories.add(course.category.name);
            }
        });
        return Array.from(uniqueCategories).sort();
    }, [courses]);

    // Filter courses based on search, category, and pricing
    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            // Search filter
            const matchesSearch = searchQuery.trim() === "" || 
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.authors.some(author => author.full_name.toLowerCase().includes(searchQuery.toLowerCase()));

            // Category filter
            const matchesCategory = selectedCategory === "all" || 
                course.category?.name === selectedCategory;

            // Pricing filter
            const matchesPricing = selectedPricing === "all" ||
                (selectedPricing === "free" && course.pricing_model === "free") ||
                (selectedPricing === "paid" && course.pricing_model === "paid");

            return matchesSearch && matchesCategory && matchesPricing;
        });
    }, [courses, searchQuery, selectedCategory, selectedPricing]);

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
        setSelectedPricing("all");
    };

    return (
        <div className="bg-white min-h-screen">
            <Header preloadedCategories={headerCategories} preloadedCarousel={carouselItems} />
            <main className="container mx-auto px-4 py-8 mt-5">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Available Courses</h1>
                    <p className="text-gray-600 text-lg">
                        Explore our comprehensive collection of courses
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-2 space-y-4">
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search courses by title, description, category, or instructor..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-gray-800"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                aria-label="Clear search"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Category and Pricing Filters */}
                    <div className="flex flex-col gap-4">
                        {/* Category Filter */}
                        <div className="flex flex-nowrap items-center justify-center gap-3">
                            <div className="flex flex-nowrap items-center gap-2 text-gray-600 font-medium">
                                <Filter className="w-4 h-4" />
                                <span className="text-sm text-nowrap">Category:</span>
                            </div>
                            <div className="max-w-180 overflow-x-auto flex space-x-2 flex-nowrap">
                                <button
                                onClick={() => setSelectedCategory("all")}
                                className={`px-4 py-2 rounded-lg font-medium text-nowrap text-sm transition-all ${
                                    selectedCategory === "all"
                                        ? "bg-indigo-600 text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                All Categories
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-lg font-medium text-nowrap text-sm transition-all ${
                                        selectedCategory === category
                                            ? "bg-indigo-600 text-white shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                            </div>
                        </div>

                        {/* Pricing Filter */}
                        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 mt-8">
                            <button
                                onClick={() => setSelectedPricing("all")}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                    selectedPricing === "all"
                                        ? "bg-black text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                ALL
                            </button>
                            <button
                                onClick={() => setSelectedPricing("free")}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                    selectedPricing === "free"
                                        ? "bg-black text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                FREE
                            </button>
                            <button
                                onClick={() => setSelectedPricing("paid")}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                    selectedPricing === "paid"
                                        ? "bg-black text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                PAID
                            </button>
                        </div>
                    </div>

                    
                </div>

                {filteredCourses.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg mb-2">No courses found</p>
                        <p className="text-gray-400 text-sm mb-4">
                            Try adjusting your search or filters
                        </p>
                        {(searchQuery || selectedCategory !== "all" || selectedPricing !== "all") && (
                            <button
                                onClick={clearFilters}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 scrollbar-hide gap-5 py-2">
                        {filteredCourses.map((course) => (
                        <div key={course.id} className="bg-white p-2 rounded-2xl overflow-hidden flex flex-col flex-shrink-0 shadow-sm">
                            <div className="relative">
                                <Image
                                    src={course?.thumbnail_url || ''}
                                    alt={course?.title}
                                    className="w-full h-auto object-cover aspect-video rounded-2xl"
                                    width={600}
                                    height={400}
                                    unoptimized
                                />
                            </div>

                            <div className="py-5 px-1 flex flex-col flex-grow justify-between">
                                <div className="flex justify-between items-start mb-2 flex-col sm:flex-row">
                                    <h3 className="text-xl font-bold text-gray-800 leading-tight">
                                        {course?.title}
                                    </h3>
                                </div>
                                <p className="md:text-sm text-xs text-gray-500 mb-3">{course?.description}</p>

                                <div className="flex items-center gap-2 mb-4">
                                    <Image src={'/logo.jpg'} width={40} height={40} alt={course.authors?.[0]?.full_name || 'Instructor'} className="w-9 h-9 rounded-full" unoptimized />
                                    <span className="text-sm text-gray-700">By {course.authors.map(name => name.full_name ).join(', ') || 'Unknown Instructor'}</span>
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
                                    <Link
                                        href={`/courses/${course.id}`}
                                        className="shine flex-grow bg-gradient-to-r from-red-600 to-gray-800 text-white text-center rounded-lg px-4 py-3 font-semibold text-xs md:text-sm inline-flex items-center justify-center hover:opacity-90 transition-opacity"
                                    >
                                        View Course
                                    </Link>
                                    <button 
                                        className="p-3 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors"
                                        aria-label="Add to favorites"
                                    >
                                        <Heart className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                )}

                {/* Results Count */}
                <div className="text-center text-sm text-gray-600 mt-5">
                    Showing {filteredCourses.length} of {courses.length} courses
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CoursesHomePage;
