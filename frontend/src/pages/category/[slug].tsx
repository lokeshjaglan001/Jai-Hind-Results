import { GetServerSideProps, NextPage } from "next";
import Head from 'next/head';
import Link from "next/link";
import { api } from "@/lib/api";
import { Post } from "@/pages/admin/posts";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Sidebar from "@/components/shared/Sidebar";
import { YojnaPost } from "@/components/sidebar/HaryanaYojnaSection";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowDownUp, ArrowRight, CalendarDays, Eye, ListFilter, Search } from "lucide-react";
import AdBanner from "@/components/shared/AdBanner";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import BannerHeader from "@/components/shared/BannerHeader";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import Script from "next/dist/client/script";
import GoogleAd from "@/components/shared/GoogleAds";


interface Category {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  logoUrl: string;
  organization: string;
}

interface CategoryPageProps {
  category: Category;
  posts: Post[];
  yojnaPosts: YojnaPost[];
  totalPosts: number;
  currentPage: number;
  totalPages: number;
  categories: Category[];
  carouselItems: any[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;
  const page = Number(context.query.page) || 1;
  const limit = 20;

  try {
    const [data, yojnaData, categories, carouselItems] = await Promise.all([
      api.get(`/categories/slug/${slug}/posts?page=${page}&limit=${limit}`),
      api.get('/categories/slug/yojna/posts?limit=12'),
      api.get('/categories'),
      api.get('/carousel'),
    ]);

    const yojnaPosts = yojnaData?.posts || [];

    return {
      props: JSON.parse(JSON.stringify({
        category: data.category,
        posts: data.posts || [],
        yojnaPosts,
        totalPosts: data.meta?.total || 0,
        currentPage: data.meta?.page || 1,
        totalPages: data.meta?.totalPages || 1,
        categories: categories || [],
        carouselItems: carouselItems || [],
      }))
    };
  } catch (error) {
    console.error(`Failed to fetch category with slug ${slug}:`, error);
    return { notFound: true };
  }
};

const CategoryPage: NextPage<CategoryPageProps> = ({ category, posts, yojnaPosts, totalPosts, currentPage, totalPages, categories, carouselItems }) => {

  // set state query from url into selectedTag
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const params = useSearchParams();
  const router = useRouter();
  const [selectedTag, setSelectedTag] = useState("all");
  
  const getLogoText = (categoryName?: string) => {
    if (!categoryName) return 'MT';
    return categoryName.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const tagFromUrl = params.get('state');
    if (tagFromUrl) {
      setSelectedTag(tagFromUrl);
    }
  }, [params]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage },
    }, undefined, { scroll: true });
  };

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      post.post_tags?.forEach(pt => {
        tagSet.add((pt as any).tags.name);
      });
    });
    return ['all', ...Array.from(tagSet).sort()];
  }, [posts]);

  const processedPosts = useMemo(() => {
    let tempPosts = [...posts];

    if (selectedTag !== "all") {
      tempPosts = tempPosts.filter(post =>
        post.post_tags?.some(pt => (pt as any).tags.name.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      tempPosts = tempPosts.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(query);
        const tagMatch = post.post_tags?.some(pt =>
          (pt as any).tags.name.toLowerCase().includes(query)
        );
        return titleMatch || tagMatch;
      });
    }

    // 3. Sort
    switch (sortOrder) {
      case 'title-asc':
        tempPosts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        tempPosts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'oldest':
        tempPosts.sort((a, b) =>
          new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime()
        );
        break;
      case 'newest':
      default:
        tempPosts.sort((a, b) =>
          new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
        );
        break;
    }

    return tempPosts;
  }, [posts, selectedTag, searchQuery, sortOrder]);

  return (
    <div className="bg-white w-full min-h-screen">
      <Head>
        <title>{`${category.name} | Jai Hind result`}</title>
        <meta
          name="description"
          content={category.description || `Browse all posts in ${category.name} category`}
        />
      </Head>

      <Header preloadedCategories={categories} preloadedCarousel={carouselItems} />
      <main className="max-w-6xl mx-auto md:mt-12 grid gap-8 px-4 mb-10">
        <div className="lg:col-span-3">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="hover:text-blue-600">
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-blue-600">
                  {category.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
         {/* Hero Section */}
<div className="rounded-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white p-8 md:p-10 mb-8">
  <div className="max-w-3xl">
    <h1 className="text-3xl md:text-5xl font-bold mb-3">
      {category.name}
    </h1>

    <p className="text-gray-300 text-base md:text-lg mb-6">
      Browse the latest updates, notifications, admit cards,
      results and opportunities related to {category.name}.
    </p>

    <div className="flex flex-wrap gap-4">
      <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl">
        <p className="text-2xl font-bold">{totalPosts}</p>
        <p className="text-sm text-gray-300">Total Posts</p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl">
        <p className="text-2xl font-bold">{allTags.length - 1}</p>
        <p className="text-sm text-gray-300">Categories</p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl">
        <p className="text-2xl font-bold">Daily</p>
        <p className="text-sm text-gray-300">Updates</p>
      </div>
    </div>
  </div>
</div>

{/* Search */}
<div className="relative mb-6">
  <input
    type="search"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder={`Search in ${category.name}...`}
    className="w-full h-14 rounded-2xl border border-gray-200 bg-white pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
  />

  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
</div>

{/* Filter Chips */}
<div className="flex gap-3 overflow-x-auto pb-2 mb-8 scrollbar-hide">
  {allTags.map((tag) => (
    <button
      key={tag}
      onClick={() => setSelectedTag(tag)}
      className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all
        ${
          selectedTag === tag
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
    >
      {tag === "all" ? "All" : tag}
    </button>
  ))}
</div>

{/* Sort Buttons */}
<div className="flex flex-wrap gap-3 mb-8">
  <button
    onClick={() => setSortOrder("newest")}
    className={`px-4 py-2 rounded-xl text-sm ${
      sortOrder === "newest"
        ? "bg-black text-white"
        : "bg-gray-100"
    }`}
  >
    Newest
  </button>

  <button
    onClick={() => setSortOrder("oldest")}
    className={`px-4 py-2 rounded-xl text-sm ${
      sortOrder === "oldest"
        ? "bg-black text-white"
        : "bg-gray-100"
    }`}
  >
    Oldest
  </button>

  <button
    onClick={() => setSortOrder("title-asc")}
    className={`px-4 py-2 rounded-xl text-sm ${
      sortOrder === "title-asc"
        ? "bg-black text-white"
        : "bg-gray-100"
    }`}
  >
    A-Z
  </button>

  <button
    onClick={() => setSortOrder("title-desc")}
    className={`px-4 py-2 rounded-xl text-sm ${
      sortOrder === "title-desc"
        ? "bg-black text-white"
        : "bg-gray-100"
    }`}
  >
    Z-A
  </button>
</div>

          <div>
            {posts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500 text-lg">
                    No posts found in this category yet.
                  </p>
                </CardContent>
              </Card>

            ) : processedPosts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500 text-lg">
                    No posts found matching your criteria.
                  </p>
                </CardContent>
              </Card>

            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {processedPosts.map((post, index) => {
                   return (
                    <Link href={`/posts/${post.slug}`} key={post.id} className="block bg-white group transition-all duration-200 rounded-lg shadow-xl border-gray-200 overflow-hidden relative">
                      <div className="flex flex-row justify-between items-end md:items-center gap-4 px-4 py-2 w-full h-full">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-all duration-200">{post.title}</h3>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-1">
                            {post.post_tags && post.post_tags.length > 0 && (
                              <div className="flex flex-wrap mt-2">
                                {post.post_tags
                                  .map(pt => (pt as any).tags.name)
                                  .map((tagName: string) => {
                                    const styles = [
                                      "text-xs bg-pink-100 text-pink-800",
                                      "text-xs bg-blue-100 text-blue-800",
                                      "text-xs bg-green-100 text-green-800",
                                      "text-xs bg-yellow-100 text-yellow-800",
                                      "text-xs bg-indigo-100 text-indigo-800",
                                      "text-xs bg-purple-100 text-purple-800",
                                      "text-xs bg-amber-100 text-amber-800",
                                      "text-xs bg-rose-100 text-rose-800"
                                    ];
                                    const hash = Array.from(tagName).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
                                    const cls = styles[hash % styles.length];
                                    return (
                                      <span
                                        key={tagName}
                                        className={`${cls} px-2 py-1 rounded-full mr-2 mb-2`}
                                      >
                                        {tagName}
                                      </span>
                                    );
                                  })}
                              </div>
                            )}
                            {post.created_at && (
                              <p className="text-xs text-gray-500 mt-2">
                                Created: {new Date(post.created_at).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                            )}
                           </div>
                        </div>
                        <div className="hidden sm:block w-auto flex-shrink-0">
                          <div
                            className='shine bg-gradient-to-r from-[#f97316] via-white to-[#15803d] text-black md:px-6 py-3 rounded-lg font-semibold text-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2 group mt-auto text-sm md:text-md'
                          >
                            Learn More
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                         <div className="inline sm:hidden mb-4">
                          <div
                            className='bg-gradient-to-r from-green-600 to-gray-800 text-white font-semibold text-center flex items-center justify-center min-w-7 min-h-7 w-7 h-7 p-1 rounded'
                          >
                            <Eye className="w-4 h-4" />
                          </div>

                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
                  .map((p, index, array) => (
                    <>
                      {index > 0 && array[index - 1] !== p - 1 && <span className="px-2">...</span>}
                      <Button
                        key={p}
                        variant={p === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(p)}
                        className={p === currentPage ? "bg-black text-white hover:bg-black/90" : ""}
                      >
                        {p}
                      </Button>
                    </>
                  ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Next
              </Button>
            </div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;