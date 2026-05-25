import { useRouter } from "next/router";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Home,
  FileText,
  Award,
  BookOpen,
  Download,
  CreditCard,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "My Mock Tests",
    href: "/dashboard/mock-tests",
    icon: FileText,
  },
  {
    title: "Test Results",
    href: "/dashboard/results",
    icon: Award,
  },
  {
    title: "My Files",
    href: "/dashboard/my-files",
    icon: Download,
  },
  {
    title: "Courses",
    href: "/dashboard/my-courses",
    icon: BookOpen,
  },
  {
    title: "Payment History",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
];

interface DashboardSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function DashboardSidebar({
  isMobileOpen,
  onMobileClose,
}: DashboardSidebarProps = {}) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return router.pathname === "/dashboard";
    }
    return router.pathname.startsWith(href);
  };

  const handleLinkClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Haryana Jobs</h2>
            <p className="text-xs text-gray-500">Student Portal</p>
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                active
                  ? "bg-blue-50 text-blue-600 font-medium shadow-sm border border-blue-100"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  active ? "text-blue-600" : "text-gray-500",
                )}
              />
              <span className="text-sm">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar - Sheet */}
      {isMobileOpen && (
        <Sheet
          open={isMobileOpen}
          onOpenChange={(open) => !open && onMobileClose?.()}
        >
          <SheetContent side="left" className="p-0 w-[280px] sm:w-[320px]">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
