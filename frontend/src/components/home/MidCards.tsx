import { CheckCircle2, ArrowRight, ArrowUpRight } from "lucide-react";
import AdBanner from "../shared/AdBanner";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import tick from "@/assets/tick.jpg";

// Simplified post type for summary data
interface PostSummary {
  id: number;
  title: string;
  slug: string;
  category_id: number;
  created_at: string;
}

// Category with posts
interface CategoryWithPosts {
  id: number;
  name: string;
  description?: string;
  posts: PostSummary[];
}

// Define the props for the main section component
interface MidCardSectionProps {
  categoriesWithPosts: CategoryWithPosts[];
}

// Define the props for a single card
interface MidCardProps {
  title: string;
  description: string;
  posts: PostSummary[];
  index: number;
  categorySlug: string;
}

// Reusable component for a single card
const MidCard = ({
  title,
  description,
  posts,
  index,
  categorySlug,
}: MidCardProps) => {
  const maxPosts = 15;
  const displayedPosts = posts.slice(0, maxPosts);
  const hasMorePosts = posts.length === maxPosts;

  return (
    <div className="flex flex-col h-full">
      {(() => {
        const gradientOptions = [
          "from-[#f14a0d] to-[#f14a0d]",
          "from-[#ffffff] to-[#ffffff]",
          "from-[#007a33] to-[#007a33]",
          "from-[#f14a0d] to-[#f14a0d]",
          "from-[#ffffff] to-[#ffffff]",
          "from-[#007a33] to-[#007a33]",
        ];
        const chosen = gradientOptions[index % gradientOptions.length];
        return (
          <div
            className={`
              bg-gradient-to-r
              ${chosen}
              text-center
              md:font-bold
              font-bold
              text-lg
              md:text-2xl
              py-4
              rounded-t-2xl
              shadow-lg
              ${
                chosen.includes("#ffffff")
                  ? "text-black border border-gray-300"
                  : "text-white"
              }
            `}
          >
            {title}
          </div>
        );
      })()}
      <div className="bg-black shadow text-white text-center text-xs py-2 px-2 whitespace-nowrap truncate">
        {description}
      </div>
      <div className="bg-white shadow-lg py-6 px-2 sm:px-4 rounded-b-2xl flex-grow">
        <ul className="space-y-4">
          {displayedPosts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/posts/${post.slug}`}
                legacyBehavior
                prefetch={false}
              >
                <a className="flex items-start gap-2 text-gray-700 hover:text-indigo-600 group text-xs md:text-sm">
                  <Image
                    src={tick}
                    alt="tick"
                    width={16}
                    height={16}
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    placeholder="blur"
                  />
                  <span className="flex-grow text-blue-500 hover:underline">
                    {post.title} <ArrowUpRight className="w-4 h-4 inline" />
                  </span>
                </a>
              </Link>
            </li>
          ))}

          {posts.length === 0 && (
            <li className="text-gray-500">No posts available</li>
          )}
        </ul>

        {hasMorePosts && (
          <div className="mt-6 text-center">
            <Link
              href={`/category/${categorySlug}`}
              legacyBehavior
              prefetch={false}
            >
              <a className="inline-flex text-xs items-center gap-2 px-5 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:shadow-lg">
                View More
                <ArrowRight className="w-4 h-4" />
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default function MidCardSection({
  categoriesWithPosts,
}: MidCardSectionProps) {
  const categoryOrder = [
    "Latest Jobs",
    "Results",
    "Admit Cards",
    "Documents",
    "Answer Keys",
  ];

  const sortedCategories = [...categoriesWithPosts].sort((a, b) => {
    const indexA = categoryOrder.indexOf(a.name);
    const indexB = categoryOrder.indexOf(b.name);

    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  console.log(sortedCategories);

  return (
    <section className="bg-white pb-12 pt-0 sm:pt-5 px-2 sm:px-0">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8">
          {sortedCategories.map((category, index) => (
            <div key={category.id}>
              <MidCard
                title={category.name}
                description={
                  category.description || `Latest updates on ${category.name}`
                }
                index={index}
                categorySlug={category.name.toLowerCase().replace(/\s+/g, "-")}
                posts={category.posts}
              />{" "}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
