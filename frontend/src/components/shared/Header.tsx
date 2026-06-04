"use client";

import { useEffect, useRef, useState } from "react";
import { Search, User, Menu, X, LogOut, House, ChevronDown, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
  { name: "Free Books", href: "/free-books" },
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
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const currentPath = usePathname();
  const { logout, user } = useAuth();
  const isLoggedIn = !!user;

  const [categories, setCategories] = useState<
    Array<{ id: number | string; name: string; description: string | null }>
  >(preloadedCategories || []);

  const [carouselItems, setCarouselItems] = useState<any[]>(
    preloadedCarousel || []
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCategories = categories.filter((cat) => {
    const name = (cat.name || "").toLowerCase();
    return (
      name !== "yojna" &&
      name !== "latest jobs" &&
      name !== "results" &&
      name !== "admit cards"
    );
  });

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
          0% { transform: translateX(30%); }
          100% { transform: translateX(calc(-100%)); }
        }
        @media (max-width: 640px) {
          .marquee-content { animation-duration: 28s; }
        }
      `}</style>

      <header className="bg-white">
        {/* Marquee ticker */}
        <div className="bg-black text-white py-1 overflow-hidden whitespace-nowrap text-xs">
          <div className="marquee-content flex flex-row-reverse">
            {carouselItems.map((item) => (
              <div key={item.id} className="px-4">{item.text}</div>
            ))}
          </div>
        </div>

        {/* ── Desktop navbar ── */}
        <nav className="hidden lg:block bg-white shadow-sm">
          {/* ROW 1 — Logo centered */}
          <div className="flex justify-center pt-1 pb-0">
            <Link href="/">
              <Image
                src={jaihindtitle}
                priority
                width={200}
                height={54}
                alt="Jai Hind Result"
                className="object-contain"
              />
            </Link>
          </div>

          {/* ROW 2 — Nav links centered + actions right */}
          <div className="max-w-screen-xl mx-auto px-2 xl:px-6 h-[52px] flex items-center justify-between gap-4">

            {/* CENTER — Nav links */}
            <div className="flex-1 flex justify-end min-w-0 pr-2 xl:pr-4">
              <div className="flex items-center gap-1 xl:gap-1.5 overflow-x-auto no-scrollbar bg-white bg-zinc-200/60 p-2 rounded-full">
                {navLinks.filter(link => link.name !== "Free Books").map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    prefetch={false}
                    className={`
                      px-3.5 xl:px-5 py-2 rounded-full text-xs xl:text-sm font-semibold transition-all duration-200 whitespace-nowrap
                      ${link.href === currentPath
                        ? "bg-black text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-zinc-100"
                      }
                    `}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* More dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 px-3.5 xl:px-5 py-2 rounded-full text-xs xl:text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-zinc-100 transition-all duration-200 outline-none whitespace-nowrap">
                      More <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className="w-56 p-2 bg-white border border-gray-100 rounded-2xl shadow-xl mt-1"
                  >
                    <DropdownMenuItem asChild className="focus:bg-zinc-100 focus:text-zinc-900">
                      <Link
                        href="/free-books"
                        prefetch={false}
                        className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 cursor-pointer block"
                      >
                        Free Books
                      </Link>
                    </DropdownMenuItem>

                    <div className="h-px bg-gray-100 my-1.5" />

                    <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Categories
                    </div>
                    {filteredCategories.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-400">Loading…</div>
                    ) : (
                      filteredCategories.map((category) => (
                        <DropdownMenuItem key={category.id} asChild className="focus:bg-zinc-100 focus:text-zinc-900">
                          <Link
                            href={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                            prefetch={false}
                            className="px-3 py-2 rounded-xl text-sm text-gray-700 cursor-pointer"
                          >
                            {category.name}
                          </Link>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* RIGHT — Search, Profile */}
            <div className="flex items-center gap-3 z-10 shrink-0">
              {/* Search */}
              <button
                onClick={() => setIsSearchDialogOpen(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              {/* Profile */}
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 outline-none">
                      <Avatar className="h-7 w-7">
                        <AvatarImage
                          src={user?.avatar_url || "/user.png"}
                          alt={user?.full_name || "User"}
                        />
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-700 font-semibold">
                          {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left leading-tight hidden xl:block">
                        <div className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                          {user?.full_name?.split(" ")[0] || "User"}
                        </div>
                        <div className="text-[11px] text-gray-400 truncate max-w-[120px]">
                          {user?.email || ""}
                        </div>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-60 p-2 bg-white border border-gray-100 rounded-2xl shadow-xl mt-1"
                  >
                    <div className="px-3 py-2 mb-1">
                      <div className="font-semibold text-gray-800">{user.full_name || "User"}</div>
                      <div className="text-xs text-gray-400 truncate">{user.email || ""}</div>
                    </div>
                    <div className="h-px bg-gray-100 mb-1" />
                    <DropdownMenuItem
                      asChild
                      className="focus:bg-zinc-100 focus:text-zinc-900 data-[highlighted]:bg-zinc-100"
                    >
                      <Link
                        href="/dashboard"
                        prefetch={false}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 cursor-pointer"
                      >
                        <House className="w-4 h-4 text-gray-400" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      asChild
                      className="focus:bg-zinc-100 focus:text-zinc-900 data-[highlighted]:bg-zinc-100"
                    >
                      <Link
                        href="/dashboard/profile/edit"
                        prefetch={false}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 cursor-pointer"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={() => setIsAuthDialogOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-zinc-900 transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  Login
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* ── Mobile navbar ── */}
        <nav className="lg:hidden bg-white shadow-sm" ref={menuRef}>
          <div className="px-4 h-14 flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <Image
                src={jaihindtitle}
                width={140}
                height={40}
                alt="Jai Hind Result"
                priority
                className="object-contain"
              />
            </Link>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsSearchDialogOpen(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all"
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-full focus:outline-none">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar_url || "/user.png"} alt={user.full_name || "User"} />
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-700 font-semibold">
                          {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60 p-2 bg-white border border-gray-100 rounded-2xl shadow-xl mt-2 mr-2">
                    <div className="px-3 py-2 mb-1">
                      <div className="font-semibold text-gray-800">{user.full_name || "User"}</div>
                      <div className="text-xs text-gray-400 truncate">{user.email || ""}</div>
                    </div>
                    <div className="h-px bg-gray-100 mb-1" />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" prefetch={false} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700">
                        <House className="w-4 h-4 text-gray-400" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile/edit" prefetch={false} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700">
                        <User className="w-4 h-4 text-gray-400" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <div className="h-px bg-gray-100 my-1" />
                    <DropdownMenuItem variant="destructive" onClick={() => logout()} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm">
                      <LogOut className="w-4 h-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={() => setIsAuthDialogOpen(true)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all"
                  aria-label="Login"
                >
                  <User className="w-[18px] h-[18px]" />
                </button>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all"
                aria-label="Menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu dropdown */}
          {isMenuOpen && (
            <div className="border-t border-gray-100 bg-white px-4 py-3">
              <div className="flex flex-col gap-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    prefetch={false}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${link.href === currentPath
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <Collapsible open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all">
                    <span>More</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? "rotate-180" : ""}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 ml-4 space-y-0.5">
                    {filteredCategories.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-400">Loading…</div>
                    ) : (
                      filteredCategories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                          prefetch={false}
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-all"
                        >
                          {category.name}
                        </Link>
                      ))
                    )}
                  </CollapsibleContent>
                </Collapsible>

                <div className="h-px bg-gray-100 my-1" />
                <Link
                  href="/dashboard/settings"
                  prefetch={false}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <Settings className="w-4 h-4" /> Settings
                </Link>
              </div>
            </div>
          )}
        </nav>

        <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
        <SearchDialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen} />
      </header>
    </>
  );
}