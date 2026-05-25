"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Check, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { DialogOverlay } from "@radix-ui/react-dialog";

interface Post {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  published_at: string;
  categories: {
    name: string;
  } | null;
  post_tags: Array<{
    tags: {
      name: string;
    };
  }>;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMore, setShowMore] = useState(false);
  const itemsPerPage = 7;
  const maxVisiblePages = 4;

  // Debounce search query with 500ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setPosts([]);
      setCurrentPage(1);
      setShowMore(false);
    }
  }, [open]);

  // Fetch posts based on debounced search query
  useEffect(() => {
    if (debouncedSearchQuery.trim() === "") {
      setPosts([]);
      setCurrentPage(1);
      return;
    }

    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/posts/search?q=${encodeURIComponent(debouncedSearchQuery)}`);
        setPosts(response);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [debouncedSearchQuery]);

  const handlePostClick = () => {
    onOpenChange(false);
  };

  // Pagination logic
  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = showMore ? posts.length : startIndex + itemsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 2) {
      return [1, 2, 3, 4];
    }

    if (currentPage >= totalPages - 1) {
      return [totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  const visiblePages = getVisiblePages();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogOverlay className="fixed inset-0 bg-black/30 bg-opacity-50 backdrop-blur-sm z-40" />
      <DialogContent className="min-w-[300px] sm:min-w-[80vw] bg-gradient-to-b sm:bg-gradient-to-r from-[#f14a0d] to-[#007a33] border-0 rounded-3xl shadow-lg [&>button]:hidden p-5 sm:p-6 h-150 sm:h-auto">
        {/* Search Input */}
        <div className="lg:mb-3 -mb-20">
          <div className="relative bg-white border-2 border-gray-300 outline-5 outline-gray-200 rounded-2xl">
            <img src="/sflc.jpg" alt="" className="w-8 h-8 absolute left-4 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-12 py-4 playfair text-lg focus-visible:outline-none"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Results Container */}
        <div className="grid grid-cols-1 sm:grid-cols-7 mt-3 h-auto">
          <div className={`rounded-3xl col-span-5 lg:overflow-hidden min-h-96 lg:bg-white ${searchQuery.trim() === "" ? "bg-transparent" : "bg-white"}`}>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              </div>
            ) : posts.length === 0 ? (
                searchQuery.trim() === "" ? (
                    <>
                <div className="flex flex-col col-span-2 items-center relative h-full lg:hidden">
                    <img src="/search-bg.jpg" alt="" className="absolute bottom-0 h-[480px] z-0" />
                    <img src="/baccha.jpg" alt="" className="absolute bottom-0 h-70 -left-5" />
                    <img src="/cloud.jpg" alt="" className="absolute h-35 left-32 bottom-50" />
                    <div className="absolute left-45 bottom-63 !font-semibold text-xl playfair text-[#237a57]">
                        Search <br /> karo...
                    </div>
                    <a href="https://softricity.in" target="_blank" rel="noopener noreferrer">
                      <img src="/poweredBy.jpg" alt="" className="absolute bottom-5 h-12 right-0" />
                    </a>
                    <h1 className="text-[40px] text-nowrap playfair !font-semibold text-center text-white z-10">
                    Jai Hind <span className="text-[#f7f900] text-nowrap">Result</span>
                    </h1>

                    <div className="flex items-center text-white text-sm mt-3 z-10">
                    Fast | Reliable | Accurate <img src="/india.png" alt="India Flag" className="inline h-7 w-[45px] object-cover ml-3" />
                    </div>
                </div>
                    <div className="h-full bg-white lg:block hidden">
                        <div className="flex flex-col justify-center items-center space-y-2 h-full">
                            <Search className="w-16 h-16" />
                            <p className="text-xl playfair">Start typing to search posts</p>
                        </div>
                    </div>
                    </>
            ) : (
                    <div className="py-16 px-8 text-center h-full">
                  <div className="text-[#237a57] flex flex-col justify-center items-center">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-12 h-12" />
                    </div>
                    <p className="text-xl mb-2 playfair !font-bold">No posts found</p>
                    <p className="playfair">Try different keywords</p>
                  </div>
                  </div>
                )
            ) : (
              <>
                {/* Results List */}
                <div className="p-2 h-100 sm:h-80 overflow-y-auto bg-white sm:bg-transparent">
                  {currentPosts.map((post, index) => (
                    <Link
                      key={post.id}
                      href={`/posts/${post.slug}`}
                      onClick={handlePostClick}
                      className="flex items-center gap-4 p-2 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center">
                        <img src="/tick.jpg" alt="" className="w-5 h-5" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-gray-800 text-base leading-relaxed group-hover:text-teal-700 transition-colors">
                          {post.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-8 py-4 flex items-center justify-end bg-white sm:bg-transparent">

                    {/* Page Numbers */}
                    <div className="flex items-center gap-2">
                      {visiblePages.map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-[32px] h-8 rounded-md font-medium text-sm transition-colors ${
                            currentPage === page
                              ? "bg-[#093028] text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      {totalPages > maxVisiblePages && currentPage < totalPages - 1 && (
                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          className="min-w-[32px] h-8 rounded-md text-gray-600 hover:bg-gray-100 flex items-center justify-center"
                          aria-label="Next page"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="hidden lg:flex flex-col col-span-2 items-center relative">
            <img src="/search-bg.jpg" alt="" className="absolute bottom-0 h-[380px] z-0" />
            <img src="/baccha.jpg" alt="" className="absolute bottom-0 h-50 left-0" />
            <img src="/cloud.jpg" alt="" className="absolute h-35 left-22 bottom-35" />
            <div className="absolute left-35 bottom-48 !font-semibold text-xl playfair text-[#237a57]">
                Search <br /> karo...
            </div>
            <a href="https://softricity.in" target="_blank" rel="noopener noreferrer">
              <img src="/poweredBy.jpg" alt="" className="absolute bottom-0 h-12 right-0" />
            </a>
            <h1 className="text-3xl playfair text-center text-white !font-semibold z-10">
                Jai Hind <span className="text-[#f7f900]">Results</span>
            </h1>

            <div className="flex items-center text-white text-sm mt-3 z-10">
                Fast | Reliable | Accurate <img src="/india.png" alt="India Flag" className="inline h-7 w-[45px] object-cover ml-3" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
