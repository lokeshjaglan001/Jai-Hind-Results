import { NextPage } from "next";
import { api } from "@/lib/api";
import { PostsClient } from "@/components/admin/posts/PostsClient";
import React, { useCallback, useEffect, useState } from "react";

export type Post = {
  id: string;
  title: string;
  slug: string;
  published_at: string | null;
  created_at: string;
  meta_title?: string;
  meta_description?: string;
  template_id?: string;
  meta_keywords?: string;
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

const AllPostsPage: NextPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
      page: 1,
      limit: 20,
      totalPages: 1,
      total: 0,
    });
    const [search, setSearch] = useState("");
  
    const fetchPosts = useCallback(async (page: number, searchQuery: string) => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: "20",
        });
        if (searchQuery) queryParams.append("search", searchQuery);

        const res = await api.get(`/posts?${queryParams.toString()}`);
        
        // Backend returns: { data: Post[], meta: { total, page, limit, totalPages } }
        if (res.data && res.meta) {
            setPosts(res.data);
            setPagination({
                page: Number(res.meta.page),
                limit: Number(res.meta.limit),
                totalPages: Number(res.meta.totalPages),
                total: Number(res.meta.total),
            });
        } else {
             // Fallback for previous structure if backend deploy lags
             setPosts(Array.isArray(res) ? res : []);
        }
      } catch (err) {
          console.error(err);
      } finally {
          setLoading(false);
      }
    }, []);
  
    useEffect(() => {
      fetchPosts(1, "");
    }, [fetchPosts]);
  
    const handlePageChange = useCallback((newPage: number) => {
      fetchPosts(newPage, search);
    }, [fetchPosts, search]);
    
    const handleSearch = useCallback((query: string) => {
      setSearch(query);
      fetchPosts(1, query);
    }, [fetchPosts]);
  
    return (
      <div className="py-4 px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">All Posts</h1>
          {/* We can add a "Create New" button here later */}
        </div>
        <PostsClient 
          data={posts} 
          categories={[]} // Categories filter temporarily disabled or fetch if needed
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          loading={loading}
        />
      </div>
    );
};

export default AllPostsPage;