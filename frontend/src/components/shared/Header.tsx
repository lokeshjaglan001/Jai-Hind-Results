"use client";

import { useEffect, useRef, useState } from "react";
import {
  Search,
  User,
  Menu,
  X,
  LogOut,
  House,
  ChevronDown,
  ArrowDown,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { api } from "@/lib/api";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { SearchDialog } from "./SearchDialog";
import headerBg from "@/assets/header.png";
import logo from "@/assets/logo.jpg";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Latest Jobs", href: "/category/latest-jobs" },
  { name: "Yojna", href: "/category/yojna" },
  { name: "Mock Tests", href: "/mock-tests" },
  { name: "Courses", href: "/courses" },
  { name: "Offline Forms", href: "/offline-forms" },
  { name: "Results", href: "/category/results" },
  { name: "Admit Cards", href: "/category/admit-cards" },
];

export default function Header({
  preloadedCategories,
  preloadedCarousel,
}: {
  preloadedCategories?: Array<{ id: number | string; name: string; description: string | null }>;
  preloadedCarousel?: any[];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const currentPath = usePathname();
  const { logout } = useAuth();
  const { user } = useAuth();
  const [categories, setCategories] = useState<
    Array<{ id: number | string; name: string; description: string | null }>
  >(preloadedCategories || []);
  const isLoggedIn = !!user;
  const [carouselItems, setCarouselItems] = useState<any[]>(preloadedCarousel || []);

  useEffect(() => {
    const fetchCategories = async () => {
      if (preloadedCategories) return;
      try {
        const res = await api.get("/categories");
        setCategories(res);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const fetchCarouselItems = async () => {
      if (preloadedCarousel) return;
      try {
        const res = await api.get("/carousel");
        setCarouselItems(res);
      } catch (error) {
        console.error("Failed to fetch carousel items:", error);
      }
    };

    fetchCategories();
    fetchCarouselItems();
  }, [user, preloadedCategories, preloadedCarousel]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
  }, [isMenuOpen]);

  return (
    <>
      <style jsx>{`
        .marquee-content {
          display: inline-flex;
          min-width: max-content;
          gap: 1rem;
          animation: marquee 20s linear infinite;
        }
        .marquee-content > div {
          flex: 0 0 auto;
        }
        @keyframes marquee {
          0% {
        transform: translateX(30%);
          }
          100% {
        transform: translateX(calc(-100%));
          }
        }
        @media (max-width: 640px) {
          /* slower on mobile so all items have time to enter the viewport */
          .marquee-content {
        animation-duration: 28s;
          }
        }
      `}</style>

      <header className="bg-white relative h-45 sm:h-60">
        <div className="bg-black text-white py-1 overflow-hidden whitespace-nowrap text-xs">
          <div className="marquee-content flex flex-row-reverse">
            {carouselItems.map((item) => (
              <div
                key={item.id}
                className="px-4"
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>

<div className="relative h-30 sm:h-35 w-full overflow-hidden bg-green-900">
  {/* Background Image */}
  <Image
    src={headerBg}
    alt="Header background"
    fill
    priority
    placeholder="blur" // Add blur placeholder
    quality={50}
    sizes="100vw"
    className="object-cover object-center"
  />
  
  {/* Optional overlay (if needed) */}
  {/* <div className="absolute inset-0 bg-black/20" /> */}

  <ul className="circles relative z-10">
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
  </ul>
{/* 
  <div className="absolute top-6 sm:top-6 left-[45vw] translate-x-[-50%] sm:left-[48vw] flex flex-col items-end z-20">
    <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center">
      <Image
        src={logo}
        alt="Logo"
        width={52}
        height={52}
        className="mr-2.5"
        priority
        placeholder="blur"
      />
      <div className="text-nowrap">
        Haryana <span className="text-[#fdf500]">Job Alert</span>
      </div>
    </h1>

    <Image
      src="/header-arrow.jpg"
      alt=""
      width={160}
      height={24}
      className="h-4 sm:h-auto w-30 sm:w-40 object-cover -mt-2 sm:-mt-3 -mr-10 sm:mr-0 lg:block hidden"
      unoptimized
    />

    <span className="sm:hidden relative inline-flex -top-15 -right-20 items-center justify-center px-2.5 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full ml-2">
      <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-600 animate-ping"></span>
      LIVE
    </span>
  </div>

  <div className="absolute lg:block playfair text-xl !font-light hidden top-14 text-white left-[65vw] z-20">
    theharyana<span className="text-[#fdf500]">jobalert</span>.com
  </div> */}
</div>


        <nav className="lg:container mx-auto px-4 mt-2 sm:mt-5 relative bottom-12 sm:-top-15">
          <div className="flex items-center justify-center h-20">

            <div className="hidden lg:flex items-center justify-center flex-1 z-10">
              <div className="p-2 rounded-xl border border-gray-300 bg-gray-100">
                <div className="bg-white rounded-xl shadow-lg px-4 py-2 flex items-center space-x-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      prefetch={false}
                      className={`px-4 py-2 rounded-xl text-md font-medium transition-colors whitespace-nowrap ${
                        link.href === currentPath
                          ? "bg-black text-white"
                          : "text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <HoverCard openDelay={0} closeDelay={200}>
                    <HoverCardTrigger asChild>
                      <button className="px-4 py-2 rounded-xl text-md font-medium transition-colors text-gray-600 hover:bg-gray-200 whitespace-nowrap">
                        More
                      </button>
                    </HoverCardTrigger>
                     <HoverCardContent className="w-64 p-2 bg-gray-100 border border-gray-300 rounded-2xl mt-2 shadow-lg">
                       <div className="bg-white grid gap-1 p-2 rounded-2xl shadow-lg">
                         
                         <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                           Categories
                         </div>
                         {categories?.length === 0 ? (
                           <div className="px-3 py-2 text-sm text-gray-500">
                             Loading...
                           </div>
                         ) : (
                           categories
                             .filter((cat) => {
                               const name = (cat.name || "").toLowerCase();
                               return name !== "yojna" && name !== "latest jobs" && name !== "results" && name !== "admit cards";
                             })
                             .map((category) => (
                               <Link
                                 key={category.id}
                                 href={`/category/${category.name
                                   .toLowerCase()
                                   .replace(/\s+/g, "-")}`}
                                 prefetch={false}
                                 className="px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                               >
                                 {category.name}
                               </Link>
                             ))
                         )}
                       </div>
                     </HoverCardContent>
                  </HoverCard>
                  <div className="border-l border-gray-200 ml-2 pl-4 flex items-center space-x-3">
                    {isLoggedIn ? (
                      <HoverCard openDelay={0} closeDelay={200}>
                        <HoverCardTrigger asChild>
                          <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                            <Avatar className="min-h-8 min-w-8 bg-blue-500">
                              <AvatarImage
                                src={user?.avatar_url || "/user.png"}
                                alt={user.full_name || "User"}
                              />
                              <AvatarFallback>
                                {user.full_name
                                  ? user.full_name.charAt(0).toUpperCase()
                                  : "U"}
                              </AvatarFallback>
                            </Avatar>
                          </button>
                        </HoverCardTrigger>
                        <HoverCardContent
                          className="w-60 p-2 bg-gray-100 rounded-3xl mt-6 mr-14 border border-gray-300"
                          side="bottom"
                        >
                          <div className="flex flex-col space-y-1 border-2 border-gray-200 rounded-2xl bg-white">
                            <div className="font-bold p-3 pb-0.5">
                              {user.full_name || "User"}
                            </div>
                            <div className="text-sm text-gray-600 pl-3">
                              {user.email || "No Email"}
                            </div>
                            <hr className="my-1 text-gray-300" />
                            <Link
                              href="/dashboard"
                              prefetch={false}
                              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-700 whitespace-nowrap"
                            >
                              <House className="w-4 h-4" />
                              <span>Dashboard</span>
                            </Link>
                            <Link
                              href="/dashboard/profile/edit"
                              prefetch={false}
                              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-700 whitespace-nowrap"
                            >
                              <User className="w-4 h-4" />
                              <span>Profile</span>
                            </Link>
                            <hr className="my-1 text-gray-300" />
                            <button
                              onClick={() => logout()} // Call your logout function
                              className="flex items-center gap-3 p-2 rounded-md hover:bg-red-50 text-sm font-medium text-red-600 w-full whitespace-nowrap"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Logout</span>
                            </button>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ) : (
                      // --- LOGGED-OUT STATE ---
                      // Show original image, open auth dialog on click
                      <button
                        onClick={() => setIsAuthDialogOpen(true)}
                        className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md"
                        aria-label="Login"
                      >
                        <Image
                          src="/profile.png"
                          width={20}
                          height={20}
                          className="min-h-5 min-w-5 w-5"
                          alt="Login"
                          unoptimized
                        />
                      </button>
                    )}
                    <button
                      onClick={() => setIsSearchDialogOpen(true)}
                      className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md transition-colors"
                      aria-label="Search posts"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="lg:hidden z-10 w-full border border-gray-300 rounded-xl p-2 bg-gray-100"
              ref={menuRef}
            >
              <div className="bg-white rounded-lg shadow-lg flex items-center justify-between w-full py-0.5 px-3">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="rounded-md text-gray-700 hover:bg-gray-200"
                >
                  {isMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
                <div className="flex items-center">
                {isLoggedIn ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 p-2">
                        <Avatar className="min-h-6 min-w-6 w-8 h-8 bg-blue-500">
                          <AvatarImage
                            src={user?.avatar_url || "/user.png"}
                            alt={user.full_name || "User"}
                          />
                          <AvatarFallback>
                            {user.full_name
                              ? user.full_name.charAt(0).toUpperCase()
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-60 p-2 bg-gray-100 rounded-3xl mt-5 mr-4">
                      <div className="flex flex-col space-y-1 border-2 border-gray-200 rounded-2xl bg-white">
                        <div className="font-bold p-3 pb-0.5">
                          {user.full_name || "User"}
                        </div>
                        <div className="text-sm text-gray-600 pl-3 truncate">
                          {user.email || "No Email"}
                        </div>
                        <hr className="my-1" />
                        <DropdownMenuItem asChild>
                          <Link
                            href="/dashboard"
                            prefetch={false}
                            className="flex items-center gap-3"
                          >
                            <House className="w-4 h-4" />
                            <span>Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/dashboard/profile/edit"
                            prefetch={false}
                            className="flex items-center gap-3"
                          >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <hr className="my-1" />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => logout()}
                          className="flex items-center gap-3"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  // --- LOGGED-OUT STATE ---
                  // Show original image, open auth dialog on click
                  <button
                    onClick={() => setIsAuthDialogOpen(true)}
                    className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md"
                    aria-label="Login"
                  >
                    <Image
                      src="/profile.png"
                      width={20}
                      height={20}
                      className="min-h-5 min-w-5 w-5 h-5"
                      alt="Login"
                      unoptimized
                    />
                  </button>
                )}
                <button
                  onClick={() => setIsSearchDialogOpen(true)}
                  className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md transition-colors"
                  aria-label="Search posts"
                  >
                  <Search className="w-5 h-5" />
                </button>
                  </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="px-3 relative flex justify-center">

        {isMenuOpen && (
          <div className="lg:hidden border border-gray-300 rounded-2xl bg-gray-100 shadow-lg absolute w-[93%] z-999 -top-11 p-2">
            <div className="flex flex-col space-y-1 px-2 pt-2 pb-3 bg-white shadow-xl rounded-xl">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={false}
                  className={`block px-3 py-2 rounded-md text-base font-medium whitespace-nowrap ${
                    link.href === currentPath
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {/* More (Categories) - Collapsible */}
              <Collapsible
                open={isCategoriesOpen}
                onOpenChange={setIsCategoriesOpen}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 whitespace-nowrap">
                  <span>More</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isCategoriesOpen ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                 <CollapsibleContent className="mt-1">
                   <div className="ml-4 space-y-1">
                     {categories?.length === 0 ? (
                       <div className="px-3 py-2 text-sm text-gray-500">
                         Loading...
                       </div>
                     ) : (
                       categories
                         ?.filter((cat) => {
                           const name = (cat.name || "").toLowerCase();
                           return name !== "yojna" && name !== "latest jobs" && name !== "results" && name !== "admit cards";
                         })
                         .map((category) => (
                           <Link
                             key={category.id}
                             href={`/category/${category.name
                               .toLowerCase()
                               .replace(/\s+/g, "-")}`}
                             prefetch={false}
                             className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                             onClick={() => setIsMenuOpen(false)}
                           >
                             {category.name}
                           </Link>
                         ))
                     )}
                   </div>
                 </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        )}

        </div>
        {/* Auth Dialog */}
        <AuthDialog
          open={isAuthDialogOpen}
          onOpenChange={setIsAuthDialogOpen}
        />

        {/* Search Dialog */}
        <SearchDialog
          open={isSearchDialogOpen}
          onOpenChange={setIsSearchDialogOpen}
        />
      </header>
    </>
  );
}
