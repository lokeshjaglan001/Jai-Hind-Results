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
        <title>{`${category.name} | Haryana Job Alert`}</title>
        <meta
          name="description"
          content={category.description || `Browse all posts in ${category.name} category`}
        />
      </Head>

      <Header preloadedCategories={categories} preloadedCarousel={carouselItems} />
      <main className="max-w-6xl mx-auto md:mt-12 grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 mb-10">
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
          
          <div className="grid grid-cols-2 mb-6">
            <div className="flex items-center">
              <div className="flex gap-4 w-full md:w-auto md:flex-shrink-0">
                <div className="md:flex-1 ml-4 md:ml-0">
                  <DropdownMenu>

                    <DropdownMenuTrigger className="p-3 bg-white rounded-full shadow-lg">
                      <ListFilter className="w-5 h-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white p-4 rounded-3xl border-gray-400 shadow-xl z-100">
                      {allTags.map(tag => (
                        <DropdownMenuItem
                          key={tag}
                          onSelect={() => setSelectedTag(tag)}
                          className="capitalize px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-2xl"
                        >
                          {tag === 'all' ? 'Select All' : tag}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="md:flex-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-3 bg-white rounded-full shadow-lg">
                      <ArrowDownUp className="w-5 h-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white p-4 rounded-3xl border-gray-400 shadow-xl z-100">
                      <DropdownMenuItem
                        onSelect={() => setSortOrder('newest')}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-2xl"
                      >
                        Newest
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => setSortOrder('oldest')}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-2xl"
                      >
                        Oldest
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => setSortOrder('title-asc')}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-2xl"
                      >
                        Title: A-Z
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => setSortOrder('title-desc')}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-2xl"
                      >
                        Title: Z-A
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <div className="relative">
              <input
                id="search-posts"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${category.name}...`}
                className="w-full px-2 py-2 pl-10 rounded-3xl border border-gray-200 shadow-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            
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
              <div className="space-y-4">
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
        <div className="lg:col-span-1">
          <div className="mt-12 ml-12">
            <Sidebar yojnaPosts={yojnaPosts} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;