import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { ArrowUpRight, User, Search, Filter, X } from "lucide-react";
import BannerHeader from "@/components/shared/BannerHeader";
import Image from "next/image";
import { useState, useMemo } from "react";

export type MockSeries = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number | null;
  enrolled_users_count: number;
  thumbnail_url: string
  mock_categories: {
    name: string;
    slug: string;
  } | null;
  mock_series_tags: {
    tag: {
      name: string;
    };
  }[];
  mock_series_tests?: Array<{
    test_id: number;
    slug: string;
    test: {
      created_at: string;
      description: string | null;
      duration_minutes: number;
      id: string;
      is_free: boolean;
      slug: string;
      title: string;
      total_marks: number;
    };
  }>;
};

interface MockTestsHomePageProps {
  series: MockSeries[];
  headerCategories: any[];
  carouselItems: any[];
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [series, categories, carouselItems] = await Promise.all([
      api.get('/mock-series'),
      api.get('/categories'),
      api.get('/carousel'),
    ]);
    return { 
      props: { series, headerCategories: categories || [], carouselItems: carouselItems || [] },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Failed to fetch mock series:", error);
    return { 
      props: { series: [], headerCategories: [], carouselItems: [] },
      revalidate: 60,
    };
  }
};

const MockTestsHomePage: NextPage<MockTestsHomePageProps> = ({ series, headerCategories, carouselItems }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const getLogoText = (categoryName?: string) => {
    if (!categoryName) return 'MT';
    return categoryName.charAt(0).toUpperCase();
  };

  const getTestCount = (mockSeries: MockSeries) => {
    return mockSeries.mock_series_tests?.length || 0;
  };

  const getUserCount = (mockSeries: MockSeries) => {
        return mockSeries.enrolled_users_count || 0;
    };

  const formatLanguages = (tags: { tag: { name: string } }[]) => {
    if (!tags || tags.length === 0) return 'English, Hindi';
    return tags.map((t) => t.tag.name).join(', ');
  };

  const formatPrice = (price: number | null) => {
    return price === null || price === 0 ? 'Free' : `₹${price}`;
  };

  const getLogo = (mockSeries: MockSeries) => {
      return mockSeries.thumbnail_url || ''
    }

  // Extract unique categories from series
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    series.forEach(s => {
      if (s.mock_categories?.name) {
        uniqueCategories.add(s.mock_categories.name);
      }
    });
    return Array.from(uniqueCategories).sort();
  }, [series]);

  // Filter series based on search and category
  const filteredSeries = useMemo(() => {
    return series.filter(s => {
      // Search filter
      const matchesSearch = searchQuery.trim() === "" || 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.mock_categories?.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === "all" || 
        s.mock_categories?.name === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [series, searchQuery, selectedCategory]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <div className="bg-white min-h-screen">
      <Header preloadedCategories={headerCategories} preloadedCarousel={carouselItems} />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            All Mock Test Series
          </h1>
          <p className="text-gray-600 text-lg">
            Choose from our comprehensive collection of mock test series
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search mock test series..."
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

          {/* Category Filter */}
          <div className="flex flex-nowrap items-center justify-center gap-3">
            <div className="flex flex-nowrap items-center gap-2 text-gray-600 font-medium">
              <Filter className="w-4 h-4" />
              <span className="text-sm text-nowrap">Filter by:</span>
            </div>
            <div className="w-180 max-w-180 overflow-x-auto flex space-x-2 whitespace-nowrap">
              <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg font-medium text-sm text-nowrap transition-all ${
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
                className={`px-4 py-2 rounded-lg font-medium text-sm text-nowrap transition-all ${
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
        </div>

        {filteredSeries.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg mb-2">No mock test series found</p>
            <p className="text-gray-400 text-sm mb-4">
              Try adjusting your search or filters
            </p>
            {(searchQuery || selectedCategory !== "all") && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeries.map((s) => {
              const testCount = getTestCount(s);
              const categorySlug = s.mock_categories?.slug || 'category';
              const detailUrl = `/mock-tests/${categorySlug}/${s.slug}`;
              const logoText = getLogoText(s.mock_categories?.name);
              const userCount = getUserCount(s);
              const logo = getLogo(s);

              return (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl border-4 border-gray-200/90 shadow-sm p-5 flex flex-col hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                      {logo ?
                        <Image src={logo} width={128} height={128} alt='logo' className='w-12 h-12 rounded-full object-cover'/>
                        :
                        <span className="rounded-full bg-gradient-to-br from-slate-200 to-slate-300  px-4 py-2 text-slate-700 font-bold text-lg">{logoText}</span>
                      }
                    </div>
                    <div className="flex items-center gap-1 text-md font-semibold text-gray-700 bg-white border border-gray-300 px-1.5 py-1.5 rounded-full shadow-sm">
                      <Image src="/bolt.png" width={18} height={18} alt='bolt' />
                      <span className='text-[12px]'>{userCount}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-800 leading-tight mb-1.5 line-clamp-2">
                    {s.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-2">
                    {testCount} Total Tests | {testCount > 0 ? '5' : '0'} Free Tests
                  </p>

                  {s.mock_categories && (
                    <div className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-md self-start mb-3">
                      {s.mock_categories.name}
                    </div>
                  )}

                  <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md self-start mb-4">
                    {formatLanguages(s.mock_series_tags)}
                  </div>

                  <ul className="space-y-1.5 text-sm text-gray-600 mb-5 flex-grow">
                    {s.description ? (
                        s.description
                        .split(/\r?\n/)
                        .map((line) => line.trim())
                        .filter(Boolean)
                        .map((line, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span className="line-clamp-3">{line}</span>
                            </li>
                        ))
                    ) : (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>Comprehensive test series</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>Pattern-based questions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>Detailed solutions provided</span>
                        </li>
                      </>
                    )}
                  </ul>

                  <div className="space-y-2">
                    <div className="text-lg font-bold text-gray-800">
                      {formatPrice(s.price)}
                    </div>
                    <Link href={detailUrl}>
                      <button className="shine w-full bg-gradient-to-r from-indigo-800 to-indigo-500 hover:from-indigo-700 hover:to-indigo-400 text-white text-center rounded-lg px-4 py-2.5 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all">
                        <span>View test series</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Results Count */}
        <div className="text-center text-sm text-gray-600 mt-3">
          Showing {filteredSeries.length} of {series.length} test series
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MockTestsHomePage;