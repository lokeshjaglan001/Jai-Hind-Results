import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tag,
  Users,
  Image,
  BookOpen,
  PlusCircle,
  TestTube,
  GraduationCap,
  Star,
} from "lucide-react";

export interface MenuItem {
  title: string;
  type: "link" | "title";
  link?: string;
  icon?: React.ReactNode;
  badge?: string;
}

export const menus: MenuItem[] = [
  // Getting Started
  { title: "Getting Started", type: "title" },
  { title: "Dashboard", icon: <LayoutDashboard size={20} />, type: "link", link: "/admin" },
  { title: "Categories", icon: <FolderOpen size={20} />, type: "link", link: "/admin/getting-started/categories" },
  { title: "Online Forms", icon: <FileText size={20} />, type: "link", link: "/admin/getting-started/online-forms" },
  { title: "Offline Forms", icon: <FileText size={20} />, type: "link", link: "/admin/getting-started/offline-forms" },
  { title: "Tags", icon: <Tag size={20} />, type: "link", link: "/admin/getting-started/tags" },
  { title: "Users", icon: <Users size={20} />, type: "link", link: "/admin/getting-started/users" },
  { title: "Carousel", icon: <Image size={20} />, type: "link", link: "/admin/getting-started/carousel" },

  // Content
  { title: "Content", type: "title" },
  { title: "Post Templates", icon: <FileText size={20} />, type: "link", link: "/admin/posts/post-templates" },
  { title: "All Posts", icon: <BookOpen size={20} />, type: "link", link: "/admin/posts" },
  { title: "Add New Post", icon: <PlusCircle size={20} />, type: "link", link: "/admin/posts/new" },

  // Mock Tests
  { title: "Mock Tests", type: "title" },
  { title: "Categories", icon: <FolderOpen size={20} />, type: "link", link: "/admin/mock-tests/mock-categories" },
  { title: "Tags", icon: <Tag size={20} />, type: "link", link: "/admin/mock-tests/mock-tags" },
  { title: "Test Series", icon: <TestTube size={20} />, type: "link", link: "/admin/mock-tests/mock-test-series" },
  { title: "Mock Tests", icon: <TestTube size={20} />, type: "link", link: "/admin/mock-tests" },

  // Courses
  { title: "Courses", type: "title" },
  { title: "All Courses", icon: <GraduationCap size={20} />, type: "link", link: "/admin/courses" },
  { title: "Add New Course", icon: <PlusCircle size={20} />, type: "link", link: "/admin/courses/new" },
  { title: "Categories", icon: <FolderOpen size={20} />, type: "link", link: "/admin/course-categories" },
  { title: "Tags", icon: <Tag size={20} />, type: "link", link: "/admin/course-tags" },
];