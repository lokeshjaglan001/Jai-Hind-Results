import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Search, ChevronDown, User, Settings, LogOut, X, Menu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardNavbarProps {
  onMenuClick?: () => void;
}

export function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getPageTitle = () => {
    const path = router.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/dashboard/results' || path.startsWith('/dashboard/results/')) return 'Test Results';
    if (path === '/dashboard/mock-tests') return 'My Mock Tests';
    if (path === '/dashboard/payments') return 'Payment History';
    if (path === '/dashboard/my-files') return 'My Files';
    if (path === '/dashboard/profile/edit') return 'Profile Settings';
    return 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-6">
        {/* Left Section - Menu Button + Page Title */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors -ml-2"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
            {getPageTitle()}
          </h1>
        </div>

        {/* Center Section - Search (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tests, courses, files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </form>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-1 sm:space-x-3">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle search"
          >
            {showMobileSearch ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Search className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 sm:space-x-3 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md text-sm sm:text-base">
                  {user?.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.full_name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 hidden lg:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-semibold">{user?.full_name}</p>
                  <p className="text-xs text-gray-500 font-normal truncate">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                <User className="w-4 h-4 mr-2" />
                My Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/profile/edit')}>
                <Settings className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar - Expandable */}
      {showMobileSearch && (
        <div className="md:hidden px-3 pb-3 border-t border-gray-100 pt-3 bg-gray-50">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tests, courses, files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="pl-9 pr-4 py-2 w-full text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
