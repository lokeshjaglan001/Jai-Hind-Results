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
import jaihindtitle from "../../../public/jai-hind-title.png";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Latest Jobs", href: "/category/latest-jobs" },
  { name: "Yojna", href: "/category/yojna" },
  { name: "Mock Tests", href: "/mock-tests" },
  { name: "Courses", href: "/courses" },
  { name: "Offline Forms", href: "/offline-forms" },
  { name: "Results", href: "/category/results" },
  { name: "Admit Cards", href: "/category/admit-cards" },
  { name: "Free Books", href: "/free-books" }
];

export default function Header({
  preloadedCategories,
  preloadedCarousel,
}: {
  preloadedCategories?: Array<{
    id: number | string;
    name: string;
    description: string | null;
  }>;
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
  const [carouselItems, setCarouselItems] = useState<any[]>(
    preloadedCarousel || [],
  );

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

      <header className="bg-white relative">
        <div className="bg-black text-white py-1 overflow-hidden whitespace-nowrap text-xs">
          <div className="marquee-content flex flex-row-reverse">
            {carouselItems.map((item) => (
              <div key={item.id} className="px-4">
                {item.text}
              </div>
            ))}
          </div>
        </div>

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
        <nav className="sticky top-2 max-w-7xl mx-auto px-3 lg:px-4 z-50">
          <div className="flex justify-center">
            <div className="hidden lg:flex flex-col items-center w-full z-20 pt-1 pb-1">
              <div className="-mb-4">
                <Image
                  src={jaihindtitle}
                  priority
                  width={220}
                  height={60}
                  alt="Jai Hind Result"
                  className="object-contain"
                />
              </div>
              {/* navbar */}
              <div
                className={`
                  w-fit
                  rounded-[28px]
                  bg-white
                  border
                  border-gray-100
                  shadow-lg
                  px-4
                  py-3
                `}
              >
                <div className="flex items-center gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      prefetch={false}
                      className={`
                        px-5
                        py-3
                        rounded-2xl
                        text-sm
                        font-semibold
                        transition-all
                        duration-300
                        whitespace-nowrap
                        ${link.href === currentPath
                          ? "bg-black text-white shadow-md"
                          : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                        }
                      `}
                    >
                      {link.name}
                    </Link>
                  ))}
                  {/* More Dropdown */}
                  <HoverCard openDelay={0} closeDelay={200}>
                    <HoverCardTrigger asChild>
                      <button className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all">
                        More
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-72 p-3 bg-white border border-gray-100 rounded-3xl shadow-2xl">
                      <div className="grid gap-1">
                        <div className="px-3 py-2 text-xs font-semibold uppercase text-gray-400">
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
                              return (
                                name !== "yojna" &&
                                name !== "latest jobs" &&
                                name !== "results" &&
                                name !== "admit cards"
                              );
                            })
                            .map((category) => (
                              <Link
                                key={category.id}
                                href={`/category/${category.name

                                  .toLowerCase()

                                  .replace(/\s+/g, "-")}`}
                                prefetch={false}
                                className="

                                  px-4

                                  py-3

                                  rounded-xl

                                  text-sm

                                  font-medium

                                  text-gray-700

                                  hover:bg-green-50

                                  hover:text-green-700

                                  transition-all

                                "
                              >
                                {category.name}
                              </Link>
                            ))
                        )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  {/* Right Actions */}

                  <div className="border-l border-gray-100 ml-3 pl-4 flex items-center gap-2">
                    {isLoggedIn ? (
                      <HoverCard openDelay={0} closeDelay={200}>
                        <HoverCardTrigger asChild>
                          <button className="rounded-full">
                            <Avatar className="h-10 w-10 bg-blue-500">
                              <AvatarImage
                                src={user?.avatar_url || "/user.png"}
                                alt={user?.full_name || "User"}
                              />

                              <AvatarFallback>
                                {user?.full_name
                                  ? user.full_name.charAt(0).toUpperCase()
                                  : "U"}
                              </AvatarFallback>
                            </Avatar>
                          </button>
                        </HoverCardTrigger>

                        <HoverCardContent className="w-64 p-2 bg-white rounded-3xl border border-gray-100 shadow-2xl">
                          {/* Keep your existing profile menu here */}
                        </HoverCardContent>
                      </HoverCard>
                    ) : (
                      <button
                        onClick={() => setIsAuthDialogOpen(true)}
                        className={`

                          w-11

                          h-11

                          rounded-2xl

                          bg-gray-50

                          hover:bg-orange-50

                          flex

                          items-center

                          justify-center

                          transition-all

                          duration-300

                        `}
                      >
                        <Image
                          src="/profile.png"
                          width={20}
                          height={20}
                          alt="Login"
                          unoptimized
                        />
                      </button>
                    )}

                    <button
                      onClick={() => setIsAuthDialogOpen(true)}
                      className="w-11 h-11 rounded-2xl bg-gray-50 hover:bg-orange-50 flex items-center justify-center transition-all duration-300"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center pt-2 pb-1">
            <Link href="/">
              <Image
                src={jaihindtitle}
                width={180}
                height={50}
                alt="Jai Hind Result"
                priority
                className="object-contain"
              />
            </Link>
          </div>
          <div
            className="lg:hidden z-20 w-full"
            ref={menuRef}
          >
            <div className="bg-white/95 backdrop-blur-md shadow-lg rounded-2xl px-3 py-2 border border-gray-200">
              <div className="flex items-center justify-between">
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
            <div className="lg:hidden absolute left-0 right-0 top-3 px-3 z-[999]">
              <div className="flex flex-col gap-1 p-3 bg-white rounded-3xl shadow-2xl border border-gray-100">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    prefetch={false}
                    className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${link.href === currentPath
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-green-50 hover:text-green-700"
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
                      className={`w-4 h-4 transition-transform ${isCategoriesOpen ? "rotate-180" : ""
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
                            return (
                              name !== "yojna" &&
                              name !== "latest jobs" &&
                              name !== "results" &&
                              name !== "admit cards"
                            );
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