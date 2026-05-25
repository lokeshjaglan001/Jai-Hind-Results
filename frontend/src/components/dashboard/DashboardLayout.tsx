import { ReactNode, useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardNavbar } from './DashboardNavbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar 
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Navbar */}
        <DashboardNavbar 
          onMenuClick={() => setIsMobileSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>

      </div>
    </div>
  );
}
