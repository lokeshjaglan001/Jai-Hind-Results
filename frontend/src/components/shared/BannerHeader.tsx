'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, User, Menu, X, LogOut, House } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

// 1. Updated navLinks to match the image
const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Latest Jobs', href: '/category/latest-jobs' },
  { name: 'Admit Cards', href: '/category/admit-cards' },
  { name: 'Offline Forms', href: '/offline-forms' },
  { name: 'Online Forms', href: '/online-forms' },
  { name: 'Answer Keys', href: '/category/answer-keys' },
  { name: 'Mock Test', href: '/mock-tests' },
];

export default function BannerHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const currentPath = usePathname();
  const { logout } = useAuth();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  // Click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Removed isMenuOpen dependency to avoid re-adding listener

  return (
    <>
      <style jsx>{`
        .marquee-content {
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          from { transform: translateX(0%); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      <header className='bg-white relative mb-24'>
        {/* Top Marquee Bar (Unchanged) */}
        <div className="bg-black text-white py-1 overflow-hidden whitespace-nowrap text-sm">
          <div className="marquee-content flex">
            {/* Repeated 5 times for smooth loop */}
            <p className="px-4">You can Now Give MOCK TESTS on Jai Hind result for FREE.</p>
            <p className="px-4">You can Now Give MOCK TESTS on Jai Hind result for FREE.</p>
            <p className="px-4">You can Now Give MOCK TESTS on Jai Hind result for FREE.</p>
            <p className="px-4">You can Now Give MOCK TESTS on Jai Hind result for FREE.</p>
            <p className="px-4">You can Now Give MOCK TESTS on Jai Hind result for FREE.</p>
          </div>
        </div>

        {/* 2. Added Banner Image Section */}
        <div>
          <Link href="/" className="block">
            <Image
              src="/Header2.png" // <-- ASSUMING YOU SAVED YOUR IMAGE HERE
              alt="Jai Hind result Banner"
              width={1200}  // <-- Adjust to your image's width
              height={200} // <-- Adjust to your image's height
              layout="responsive"
              priority // Good for LCP
            />
          </Link>
        </div>

        {/* 3. Updated Navigation Section */}
        <nav className="absolute -bottom-10 lg:container mx-auto px-4 mt-2 sm:mt-5">
          <div className="flex items-center justify-between h-20 ">
            <div className="hidden lg:flex items-center justify-center  flex-1 mr-14">
              <div className='p-2 rounded-xl border bg-gray-100'>
                <div className="bg-white rounded-xl shadow-lg px-4 py-2 flex items-center space-x-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`px-4 py-2 rounded-xl text-md font-medium transition-colors ${link.href === currentPath
                          ? 'bg-black text-white'
                          : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="border-l border-gray-200 ml-2 pl-4 flex items-center space-x-3">
                    {isLoggedIn ? (
        // --- LOGGED-IN STATE ---
        // Show HoverCard with Avatar
        <HoverCard openDelay={0} closeDelay={100}>
          <HoverCardTrigger asChild>
            <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <Avatar className="h-8 w-8">
                {/* Use the user's image */}
                <AvatarImage src={user?.avatar_url || '/avatar2.png'} alt={user.full_name || 'User'} />
                {/* Fallback to user's initials */}
                <AvatarFallback>
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-48 p-1 bg-gray-200 rounded-2xl" side="bottom">
            {/* This is the menu content */}
            <div className="flex flex-col space-y-1 border-2 border-gray-200 rounded-2xl bg-white">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-700"
              >
                <House className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/profile/edit"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-700"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <hr className="my-1" />
              <button
                onClick={() => logout()} // Call your logout function
                className="flex items-center gap-3 p-2 rounded-md hover:bg-red-50 text-sm font-medium text-red-600 w-full"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </HoverCardContent>
        </HoverCard>

      ) : (

        // --- LOGGED-OUT STATE ---
        // Show original image, wrapped in a Link to the login page
        <Link
          href="/auth/login" // <-- Set this to your login/signup page
          className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md"
        >
          <Image src="/profile.png" width={18} height={18} alt='Login'/>
        </Link>
        
      )}
                    <Link href="#" className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md">
                      <Search className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:hidden" ref={menuRef}>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-700 hover:bg-gray-200">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white shadow-lg absolute w-full z-50 origin-top-right">
            <div className="flex flex-col space-y-1 px-2 pt-2 pb-3">
              {/* Updated mobile nav links */}
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)} // Close menu on click
                  className={`block px-3 py-2 rounded-md text-base font-medium ${link.href === currentPath
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <hr className="my-2" />

              {/* Auth links for mobile */}
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md text-base font-medium"
                  >
                    <House className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile/edit"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md text-base font-medium"
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-red-600 hover:bg-red-50 p-2 rounded-md text-base font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md text-base font-medium"
                >
                  <User className="w-5 h-5" />
                  Login / Signup
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}