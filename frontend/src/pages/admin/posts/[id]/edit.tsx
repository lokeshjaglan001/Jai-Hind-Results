import { GetServerSideProps, NextPage } from "next";
import { api } from "@/lib/api";
import { CreatePostForm } from "@/components/admin/posts/CreatePostForm";
import { Category, PostTemplate, Tag } from "@/pages/admin/posts/new";
import { Post } from "@/pages/admin/posts";

interface EditPostPageProps {
  post: Post;
  templates: PostTemplate[];
  categories: Category[];
  tags: Tag[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  try {
    const [post, templates, categories, tags] = await Promise.all([
      api.get(`/posts/${id}`),
      api.get('/post-templates'),
      api.get('/categories'),
      api.get('/tags'),
    ]);

    return {
      props: {
        post,
        templates,
        categories,
        tags,
      },
    };
  } catch (error) {
    console.error(`Failed to fetch data for post ${id}:`, error);
    return { notFound: true }; // Redirect to 404 if post not found
  }
};

const EditPostPage: NextPage<EditPostPageProps> = ({ post, templates, categories, tags }) => {
  return (
    <div className="p-4">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Edit Post</h1>
        {/* We pass the post data to the form component */}
        <CreatePostForm 
            initialData={post} 
            templates={templates} 
            categories={categories} 
            tags={tags} 
        />
    </div>
  );
};

export default EditPostPage;