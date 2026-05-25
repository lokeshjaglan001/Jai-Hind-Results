import { ArrowUpRight, Bookmark, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export type YojnaPost = {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  thumbnail_url?: string | null;
  categories: {
    name: string;
  } | null;
};

interface HaryanaYojnaSectionProps {
  posts: YojnaPost[];
}

export default function HaryanaYojnaSection({ posts }: HaryanaYojnaSectionProps) {
  return (
    <section className="bg-white">
      <div className="">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
          Yojna
        </h2>

        <div className="grid grid-cols-1 gap-8">
          {posts.length > 0 ? (
            posts.map((post) => {
              const thumbnailUrl = post.thumbnail_url;

              return (
                <div key={post.id} className="rounded-2xl overflow-hidden p-2 bg-white shadow-sm">
                  <Image
                    src={thumbnailUrl || 'https://placehold.co/600x400/cccccc/333333?text=Thumbnail+Missing'} 
                    alt={post.title || 'Post thumbnail'}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover aspect-video rounded-2xl"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/600x400/cccccc/333333?text=Thumbnail+Error';
                    }}
                    unoptimized
                  />
                      <div className="my-2 text-sm pl-1">
                        {post.title}
                      </div>
                  <div className="py-2 flex items-center justify-between gap-2">
                    
                      <Link
                        href={`/posts/${post.slug}`} // <-- Fixed hardcoded slug
                        passHref
                        className="shine flex-grow bg-black text-white text-center rounded-lg p-2.5 font-medium text-wrap text-[10px] inline-flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                      >
                        View Yojna
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black transition-colors"
                        aria-label="Bookmark post"
                      >
                        <Bookmark className="w-3 h-3" />
                      </button>
                      <button 
                        className="p-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black transition-colors"
                        aria-label="Share post"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500">No Yojna posts found.</div>
          )}
        </div>

        <div className="text-center mt-8 mb-10">
          <Link
            href="/category/yojna"
            className="bg-gray-100 border-2 border-gray-300 rounded-xl w-full py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 hover:border-gray-400 transition-all block"
          >
            View all Yojna
          </Link>
        </div>

        {/* <AdBanner text="Google Ad Section" className="h-88" /> */}
      </div>
    </section>
  );
}