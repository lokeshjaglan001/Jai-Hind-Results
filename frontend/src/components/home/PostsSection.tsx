import {
  ArrowUpRight,
  Newspaper,
  ShieldCheck,
  File,
  Trophy,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { Post } from "@/pages/admin/posts";

const colors = [
  "linear-gradient(90deg, #f14a0d 0%, #f14a0d 100%)",
  "linear-gradient(90deg, #ffffff 0%, #ffffff 100%)",
  "linear-gradient(90deg, #ffffff 0%, #ffffff 50%, #ffffff 100%)",
  "linear-gradient(90deg, #007a33 0%, #007a33 100%)",
  "linear-gradient(90deg, #f14a0d 0%, #f14a0d 100%)",
  "linear-gradient(90deg, #ffffff 0%, #ffffff 100%)",
  "linear-gradient(90deg, #ffffff 0%, #ffffff 100%)",
  "linear-gradient(90deg, #007a33 0%, #007a33 100%)",
];

const features = [
  {
    icon: Newspaper,
    title: "Current Affairs",
    subtitle: "Daily Learning Content",
  },
  {
    icon: ShieldCheck,
    title: "Quality Mock Tests",
    subtitle: "Test your Knowledge",
  },
  {
    icon: File,
    title: "Exclusive Courses",
    subtitle: "Enroll Now (Designed for You)",
  },
  {
    icon: Trophy,
    title: "We Deliver Quality",
    subtitle: "Quality Information",
  },
];

export default function PostsSection({ posts }: { posts: Post[] }) {
  return (
    <section className="bg-white px-2">
      <div className="max-w-6xl mx-auto">
        {/* POSTS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {posts.slice(0, 8).map((post, index) => {
            const currentColor = colors[index % colors.length];

            const isWhiteCard =
              currentColor.includes("#ffffff") || currentColor.includes("#fff");

            return (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                passHref
                legacyBehavior
                prefetch={false}
              >
                <a
                  className={`
                    shine
                    relative
                    py-5
                    sm:py-6
                    px-4
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    overflow-hidden
                    shadow-lg
                    hover:scale-[1.02]
                    transition-all
                    duration-300
                    text-center
                    border
                    ${isWhiteCard ? "border-gray-300" : "border-transparent"}
                    ${index >= 6 ? "hidden lg:flex" : ""}
                  `}
                  style={{
                    background: currentColor,
                    color: isWhiteCard ? "#111111" : "#ffffff",
                  }}
                >
                  {/* Shine Effect */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="absolute top-0 right-8 h-full w-10 rotate-12 bg-white/20 blur-md"></div>
                  </div>

                  {/* Text */}
                  <div className="relative z-10">
                    <h3
                      className={`
                        font-bold
                        text-[13px]
                        md:text-[16px]
                        leading-tight
                        line-clamp-2
                        ${isWhiteCard ? "text-black" : "text-white"}
                      `}
                    >
                      {post.title}
                    </h3>
                  </div>

                  {/* Arrow */}
                  <div
                    className={`
                      absolute
                      top-2
                      right-2
                      w-7
                      h-7
                      rounded-full
                      flex
                      items-center
                      justify-center
                      backdrop-blur-sm
                      ${isWhiteCard ? "bg-black/10" : "bg-white/20"}
                    `}
                  >
                    <ArrowUpRight
                      className={`
                        w-4
                        h-4
                        ${isWhiteCard ? "text-black" : "text-white"}
                      `}
                    />
                  </div>
                </a>
              </Link>
            );
          })}
        </div>

        {/* FEATURES SECTION */}
        {/*
        <div className="bg-[#0d0625] rounded-full px-2 py-4 shadow-xl hidden md:block mt-8">
          <div className="flex items-center justify-between gap-4 px-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-white justify-center w-full"
              >
                <div className="flex-grow-0">
                  <feature.icon className="w-7 h-7 text-[#8c52ff]" />
                </div>

                <div className="w-full">
                  <p className="text-[13px] leading-tight">
                    {feature.title}
                  </p>

                  <p className="text-[10px] text-gray-400">
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        */}

        {/* STATEWISE SECTION */}
        <h1 className="text-3xl font-bold my-8 text-center">
          Statewise Notifications
        </h1>

        <div className="bg-white">
          {(() => {
            const states = [
              "Haryana",
              "Punjab",
              "Uttar Pradesh",
              "Bihar",
              "Rajasthan",
              "Odisha",
              "Chhattisgarh",
              "West Bengal",
              "Uttarakhand",
              "Jharkhand",
              "Assam",
              "Manipur",
              "Meghalaya",
              "Mizoram",
              "Nagaland",
              "Sikkim",
              "Tripura",
              "Gujarat",
              "Goa",
              "Kerala",
              "Tamil Nadu",
              "Delhi",
              "Chandigarh",
              "Jammu and Kashmir",
              "Himachal Pradesh",
              "Madhya Pradesh",
              "Arunachal Pradesh",
            ];

            const stateColors = [
              "from-[#f14a0d] to-[#f14a0d]",
              "from-[#ffffff] to-[#ffffff]",
              "from-[#007a33] via-[#007a33] to-[#007a33]",
            ];

            return (
              <>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  <input
                    id="toggle-states"
                    type="checkbox"
                    title="Show More"
                    className="hidden peer"
                  />

                  {states.map((state, idx) => (
                    <Link
                      key={state}
                      href={`/tag/${encodeURIComponent(
                        state.toLowerCase().replace(/\s+/g, "-"),
                      )}`}
                      prefetch={false}
                      className={`
                        px-3
                        py-2
                        rounded-lg
                        flex-1
                        text-center
                        text-sm
                        font-medium
                        transition-colors
                        bg-gradient-to-b
                        ${
                          stateColors[idx % stateColors.length].includes(
                            "#ffffff",
                          )
                            ? "text-black border border-gray-300"
                            : "text-white"
                        }
                        truncate
                        ${stateColors[idx % stateColors.length]}
                        ${
                          idx >= 6 && idx < 12
                            ? "hidden lg:block peer-checked:block"
                            : ""
                        }
                        ${idx >= 12 ? "hidden peer-checked:block" : ""}
                        ${idx >= states.length - 3 ? "sm:col-span-2" : ""}
                      `}
                    >
                      {state}
                    </Link>
                  ))}

                  {states.length > 6 && (
                    <>
                      <label
                        htmlFor="toggle-states"
                        className="mt-4 col-span-full justify-center hidden items-center gap-2 px-4 py-2 rounded-full text-sm text-black cursor-pointer select-none peer-checked:inline-flex transition-transform duration-300"
                      >
                        View Less
                        <ChevronUp className="w-4 h-4" />
                      </label>

                      <label
                        htmlFor="toggle-states"
                        className="mt-4 col-span-full justify-center inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-black cursor-pointer select-none peer-checked:hidden transition-transform duration-300"
                      >
                        View More
                        <ChevronDown className="w-4 h-4" />
                      </label>
                    </>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
