import { CreatePostForm } from "@/components/admin/posts/CreatePostForm";
import { api } from "@/lib/api";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";

export type PostTemplate = {
  id: string;
  name: string;
  structure: string; // FIX: This is now a string to hold HTML
};

export type Category = {
  id: string;
  name: string;
};

export type Tag = {
  id: string;
  name: string;
};

interface CreatePostPageProps {
  templates: PostTemplate[];
  categories: Category[];
  tags: Tag[];
}

const CreatePostPage: NextPage = () => {
    const [data, setData] = useState<CreatePostPageProps>({
        templates: [],
        categories: [],
        tags: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
             try {
                const [templates, categories, tags] = await Promise.all([
                  api.get('/post-templates'),
                  api.get('/categories'),
                  api.get('/tags'),
                ]);
                setData({ templates, categories, tags });
             } catch (e) {
                 console.error(e);
             } finally {
                 setLoading(false);
             }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <HashLoader color="#8a79ab" size={60} />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-4 px-8">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Post</h1>
            <CreatePostForm templates={data.templates} categories={data.categories} tags={data.tags} />
        </div>
    );
};

export default CreatePostPage;