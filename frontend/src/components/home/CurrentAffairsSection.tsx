'use client';

import { useState, useMemo, useEffect } from 'react'; // 1. Import useEffect
import { ArrowUpRight, SlidersHorizontal, User, Loader2 } from 'lucide-react';
import AdBanner from '../shared/AdBanner';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api'; // 2. Import your API utility

// 3. Add the Post type
export type Post = {
  id: string;
  title: string;
  slug: string;
  published_at: string | null;
  created_at: string;
  category_id?: number;
  content_html?: string;
  thumbnail_url?: string | null;
  external_url?: string | null;
  content?: string;
  post_tags?: { post_id: string; tag_id: number }[];
  categories: {
    name: string;
  } | null;
};

// 4. Update categories. "Popular" is removed as it's not in the API data.
const categories = ['Today', 'Week', 'Month'];
const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/334155/ffffff?text=Article';

export default function CurrentAffairsSection() {
    const [activeCategory, setActiveCategory] = useState('All');
    
    // 5. Add state for loading and storing posts
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 6. Add useEffect to fetch data on mount
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          setIsLoading(true);
          const posts = await api.get('/posts'); // Fetch all posts
          setAllPosts(posts || []); // Ensure it's an array
          setError(null);
        } catch (err) {
          console.error("Failed to fetch posts:", err);
          setError("Failed to load articles.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchPosts();
    }, []); // Empty dependency array means this runs once on mount

    // 7. First useMemo: Filter for "current affairs" posts only
    const currentAffairsPosts = useMemo(() => {
      return allPosts.filter(post => post.categories?.name.toLowerCase() === 'current affairs');
    }, [allPosts]);

    // 8. Second useMemo: Filter by selected date-tab
    const filteredArticles = useMemo(() => {
      if (activeCategory === 'All') {
        return currentAffairsPosts;
      }
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      return currentAffairsPosts.filter(post => {
        // Use published_at, fallback to created_at
        const postDate = new Date(post.published_at || post.created_at);
        if (isNaN(postDate.getTime())) return false; // Skip invalid dates

        switch (activeCategory) {
          case 'Today':
            return postDate >= today;
          case 'Week':
            return postDate >= startOfWeek;
          case 'Month':
            return postDate >= startOfMonth;
          default:
            return false;
        }
      });
    }, [activeCategory, currentAffairsPosts]);

    // 9. Helper function to determine the correct link
    const getArticleLink = (post: Post) => {
      if (post.external_url) {
        return post.external_url;
      }
      // Assuming a blog structure. Update this if your path is different.
      return `/posts/${post.slug}`;
    };

    return (
        <section className="bg-white py-12 px-4 md:px-0">
            <div>
                <div className="text-center mb-20">
                    <Image
                        src="/ca.png"
                        alt="Mock Tests"
                        className="inline-block h-20 w-auto"
                        width={300}
                        height={80}
                    />
                </div>

                <div className="hidden md:flex items-center justify-start gap-4 pb-4">
                    <button
                        key="all"
                        onClick={() => setActiveCategory('All')}
                        className={`p-2 rounded-md transition-colors ${ 
                            activeCategory === 'All'
                                ? 'bg-emerald-600 text-white'
                                : 'text-gray-500 hover:bg-gray-200'
                        }`}
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${activeCategory === category
                                    ? 'bg-emerald-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* 10. Add Loading and Error UI states */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                        <span className="ml-3 text-gray-600">Loading articles...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-10 text-red-600">
                        {error}
                    </div>
                ) : filteredArticles.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        {activeCategory === 'All'
                            ? 'No Current Affairs articles found.'
                            : `No articles found for "${activeCategory}".`
                        }
                    </div>
                ) : (
                    <>
                        {/* 11. Update render logic to use dynamic data */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 md:gap-6 gap-3">
                            {filteredArticles.slice(0, 6).map((post) => (
                                <div key={post.id} className="bg-white p-2 rounded-2xl shadow-sm overflow-hidden flex flex-col mb-8">
                                    <Image
                                        src={post.thumbnail_url || PLACEHOLDER_IMAGE}
                                        alt={post.title}
                                        className="w-full h-48 object-contain rounded-2xl"
                                        width={600}
                                        height={400}
                                        unoptimized
                                    />
                                    <div className="py-5 px-2 flex flex-col flex-grow">
                                        <h3 className="md:font-bold font-medium md:text-lg text-gray-800 leading-tight flex-grow mb-4 text-sm line-clamp-3">
                                            {post.title}
                                        </h3>
                                        <Link
                                            href={getArticleLink(post)}
                                            prefetch={false}
                                            target={post.external_url ? "_blank" : "_self"}
                                            rel={post.external_url ? "noopener noreferrer" : ""}
                                            className="shine w-full bg-gradient-to-r from-emerald-900 to-[#237856] text-white text-center rounded-lg px-4 py-2.5 font-semibold text-xs md:text-sm inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                        >
                                            <span>Learn More</span>
                                            <ArrowUpRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <div className="text-center mt-12">
                    <button className="bg-gray-100 border-2 border-gray-300 rounded-xl px-12 py-3 font-semibold text-gray-800 hover:bg-gray-100 hover:border-gray-400 transition-all shadow-sm">
                        View More
                    </button>
                </div>
                <div className='mt-10 mb-10 md:hidden'>
                    {/* <AdBanner text="Google Ads Section" className="h-32" /> */}
                </div>
            </div>
        </section>
    );
}