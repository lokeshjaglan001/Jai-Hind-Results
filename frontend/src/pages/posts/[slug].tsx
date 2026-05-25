import { GetStaticProps, GetStaticPaths, NextPage } from "next";
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
import BannerHeader from "@/components/shared/BannerHeader";
import Script from "next/script";
import { useEffect } from "react";

interface Category {
  id: number;
  name: string;
  description: string | null;
}

interface PostPageProps {
  post: Post;
  yojnaPosts: YojnaPost[];
  categories: Category[];
  carouselItems: any[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params!;
  try {
    const [post, yojnaData, categories, carouselItems] = await Promise.all([
      api.get(`/posts/slug/${slug}`),
      api.get('/categories/slug/yojna/posts?limit=12'),
      api.get('/categories'),
      api.get('/carousel'),
    ]);

    const yojnaPosts = yojnaData?.posts || [];

    return { 
      props: { post, yojnaPosts, categories: categories || [], carouselItems: carouselItems || [] },
      revalidate: 60,
    };
  } catch (error) {
    console.error(`Failed to fetch post with slug ${slug}:`, error);
    return { notFound: true };
  }
};

const PostPage: NextPage<PostPageProps> = ({ post, yojnaPosts, categories, carouselItems }) => {
  const categorySlug = post.categories?.name.toLowerCase().replace(/\s+/g, '-') || 'uncategorized';

  useEffect(() => {
  if (typeof window !== "undefined" && (window as any).wapTag) {
    (window as any).wapTag.Init = (window as any).wapTag.Init || [];
    (window as any).wapTag.Init.push(function () {
      document.querySelectorAll(".futureads").forEach((el) => {
        const slot = el.getAttribute("data-ad-slot");
        if (slot && (window as any).wAPITag) {
          (window as any).wAPITag.display(slot);
        }
      });
    });
  }
}, [post.content_html]);

  return (
    <div className="bg-white">
      <Head>
        <title>{`${post.title} | Haryana Job Alert`}</title>
        {/* You can also add dynamic meta descriptions for SEO */}
        <meta name="description" content={`Details & Information about ${post.title}.`} />
      </Head>
      <Header preloadedCategories={categories} preloadedCarousel={carouselItems} />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* NEW: Breadcrumb Navigation */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
          asChild
          className="hover:text-blue-600 data-[current=true]:text-blue-600"
          data-current={false}
              >
          <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {post.categories && (
              <>
          <BreadcrumbItem>
            <BreadcrumbLink
              asChild
              className="hover:text-blue-600 data-[current=true]:text-blue-600"
              data-current={false}
            >
              <Link href={`/category/${categorySlug}`}>{post.categories.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage className="text-blue-600">{post.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            <div className="lg:col-span-3">
              <div className="futureads" style={{ width: "320px", height: "100px", display: "inline-block" }} data-ad-slot="pw_49947"></div> 
              <Script id="wap-ad-49947" strategy="afterInteractive">
                {`
                  (window.wapTag.Init = window.wapTag.Init || []).push(function () { 
                    if (typeof wAPITag !== 'undefined') {
                      wAPITag.display("pw_49947");
                    }
                  });
                `}
              </Script>
                <article className="text-sm md:text-base h-max-content">
                  <div 
                    className="prose max-w-none overflow-x-auto p-0 rendering-area" 
                    dangerouslySetInnerHTML={{ __html: post.content_html || '' }}
                  />
                </article>
                <div className="futureads" style={{ width: "336px", height: "280px", display: "inline-block" }} data-ad-slot="pw_49868"></div> 
                <Script id="wap-ad-49868" strategy="afterInteractive">
                  {`
                    (window.wapTag.Init = window.wapTag.Init || []).push(function () { 
                      if (typeof wAPITag !== 'undefined') {
                        wAPITag.display("pw_49868");
                      }
                    });
                  `}
                </Script>
            </div>
            <aside>
                <Sidebar yojnaPosts={yojnaPosts} />
            </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostPage;