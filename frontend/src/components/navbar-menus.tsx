"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuItem } from "@/config/menus";
import {
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

type MenuGroup = {
  title: string;
  items: MenuItem[];
};

export default function NavbarMenus({
  menus,
}: {
  menus: MenuItem[];
}) {
  const currentMenu = usePathname();
  const { logout } = useAuth();

  /* ─────────────────────────────
      GROUP MENUS
  ───────────────────────────── */
  const groupedMenus: MenuGroup[] = [];

  let currentGroup: MenuGroup | null = null;

  menus.forEach((menu) => {
    if (menu.type !== "link") {
      currentGroup = {
        title: menu.title,
        items: [],
      };

      groupedMenus.push(currentGroup);
    } else {
      if (!currentGroup) {
        currentGroup = {
          title: "Menu",
          items: [],
        };

        groupedMenus.push(currentGroup);
      }

      currentGroup.items.push(menu);
    }
  });

  return (
    <nav
      className="
        fixed top-0 left-0 right-0
        h-16
        bg-white/80
        backdrop-blur-xl
        border-b border-slate-200/70
        z-50
        shadow-[0_1px_25px_rgba(15,23,42,0.04)]
      "
    >
      <div className="h-full max-w-[1800px] mx-auto px-6">
        
        {/* ─────────────────────────────
            MAIN NAVBAR
        ───────────────────────────── */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-full">
          
          {/* ─────────────────────────────
              LEFT SIDE
          ───────────────────────────── */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-3"
            >
              {/* Logo */}
              <div
                className="
                  relative
                  w-11 h-11
                  rounded-2xl
                  bg-gradient-to-br
                  from-violet-600
                  to-purple-700
                  flex items-center justify-center
                  text-white font-bold text-sm
                  shadow-lg shadow-violet-500/20
                  overflow-hidden
                "
              >
                <div className="absolute inset-0 bg-white/10" />

                <span className="relative z-10">
                  HJ
                </span>
              </div>

              {/* Brand */}
              <div className="hidden lg:flex flex-col leading-tight">
                <span className="text-[15px] font-semibold text-slate-900 tracking-tight">
                  Jai Hind Result
                </span>

                <span className="text-[11px] text-slate-500 font-medium">
                  Admin Dashboard
                </span>
              </div>
            </Link>
          </div>

          {/* ─────────────────────────────
              CENTER NAVIGATION
          ───────────────────────────── */}
          <div className="hidden xl:flex items-center justify-center gap-3">
            {groupedMenus.map((group, index) => {
              const isActiveGroup = group.items.some(
                (item) => item.link === currentMenu
              );

              return (
                <div
                  key={index}
                  className="relative group"
                >
                  {/* Main Category */}
                  <button
                    className={`
                      flex items-center gap-2
                      px-5 h-11
                      rounded-2xl
                      text-sm font-semibold
                      transition-all duration-200
                      border
                      whitespace-nowrap
                      ${
                        isActiveGroup
                          ? `
                            bg-gradient-to-br
                            from-violet-600
                            to-purple-700
                            text-white
                            border-violet-500
                            shadow-lg shadow-violet-500/20
                          `
                          : `
                            bg-white/70
                            border-slate-200
                            text-slate-700
                            hover:bg-slate-100
                          `
                      }
                    `}
                  >
                    <span className="uppercase tracking-[0.14em] text-[11px]">
                      {group.title}
                    </span>

                    <ChevronDown
                      size={15}
                      className="
                        transition-transform duration-200
                        group-hover:rotate-180
                      "
                    />
                  </button>

                  {/* ─────────────────────────────
                      DROPDOWN MENU
                  ───────────────────────────── */}
                  <div
                    className="
                      absolute left-1/2 -translate-x-1/2
                      top-[120%]
                      opacity-0 invisible
                      translate-y-2
                      group-hover:opacity-100
                      group-hover:visible
                      group-hover:translate-y-0
                      transition-all duration-200
                      z-50
                    "
                  >
                    <div
                      className="
                        w-[300px]
                        rounded-3xl
                        border border-slate-200/80
                        bg-white/95
                        backdrop-blur-2xl
                        shadow-[0_20px_50px_rgba(15,23,42,0.12)]
                        p-3
                      "
                    >
                      {/* Header */}
                      <div className="px-3 pb-3">
                        <span
                          className="
                            text-[11px]
                            uppercase
                            tracking-[0.18em]
                            text-slate-400
                            font-bold
                          "
                        >
                          {group.title}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="flex flex-col gap-1">
                        {group.items.map((item, itemIndex) => (
                          <Link
                            key={itemIndex}
                            href={item.link ?? ""}
                            className={`
                              relative
                              flex items-center gap-3
                              px-4 py-3
                              rounded-2xl
                              transition-all duration-200
                              border
                              ${
                                currentMenu === item.link
                                  ? `
                                    bg-gradient-to-br
                                    from-violet-600
                                    to-purple-700
                                    text-white
                                    border-violet-500
                                  `
                                  : `
                                    border-transparent
                                    text-slate-700
                                    hover:bg-slate-100
                                  `
                              }
                            `}
                          >
                            {/* Active Glow */}
                            {currentMenu === item.link && (
                              <div
                                className="
                                  absolute inset-0
                                  rounded-2xl
                                  bg-white/10
                                "
                              />
                            )}

                            {/* Icon */}
                            <span
                              className="
                                relative z-10
                                text-[18px]
                                flex items-center justify-center
                              "
                            >
                              {item.icon}
                            </span>

                            {/* Text */}
                            <div className="relative z-10 flex flex-col">
                              <span className="text-sm font-semibold">
                                {item.title}
                              </span>

                              <span
                                className={`
                                  text-[11px]
                                  ${
                                    currentMenu === item.link
                                      ? "text-white/70"
                                      : "text-slate-400"
                                  }
                                `}
                              >
                                Manage {item.title.toLowerCase()}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ─────────────────────────────
              RIGHT SIDE
          ───────────────────────────── */}
          <div className="flex items-center justify-end">
            
            {/* Profile Dropdown */}
            <div className="relative group">
              
              {/* Main Button */}
              <button
                className="
                  flex items-center gap-3
                  pl-2 pr-3 h-11
                  rounded-2xl
                  border border-slate-200
                  bg-white/80
                  hover:bg-slate-50
                  transition-all duration-200
                  shadow-sm
                "
              >
                {/* Avatar */}
                <div
                  className="
                    w-8 h-8
                    rounded-xl
                    bg-gradient-to-br
                    from-violet-600
                    to-purple-700
                    text-white
                    flex items-center justify-center
                    text-sm font-semibold
                  "
                >
                  A
                </div>

                {/* User Info */}
                <div className="hidden xl:flex flex-col text-left leading-tight">
                  <span className="text-[13px] font-semibold text-slate-800">
                    Admin
                  </span>
                </div>

                <ChevronDown
                  size={16}
                  className="
                    text-slate-400
                    transition-transform duration-200
                    group-hover:rotate-180
                  "
                />
              </button>

              {/* Dropdown */}
              <div
                className="
                  absolute right-0 top-[120%]
                  opacity-0 invisible
                  translate-y-2
                  group-hover:opacity-100
                  group-hover:visible
                  group-hover:translate-y-0
                  transition-all duration-200
                  z-50
                "
              >
                <div
                  className="
                    w-[260px]
                    rounded-3xl
                    border border-slate-200/80
                    bg-white/95
                    backdrop-blur-2xl
                    shadow-[0_20px_50px_rgba(15,23,42,0.12)]
                    p-3
                  "
                >
                  {/* Profile */}
                  <Link
                    href="/dashboard/profile/edit"
                    className="
                      flex items-center gap-3
                      px-4 py-3
                      rounded-2xl
                      text-slate-700
                      hover:bg-slate-100
                      transition-all duration-200
                    "
                  >
                    <div
                      className="
                        w-10 h-10
                        rounded-2xl
                        bg-slate-100
                        flex items-center justify-center
                      "
                    >
                      <User className="w-5 h-5 text-slate-600" />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        Profile Settings
                      </span>

                      <span className="text-[11px] text-slate-400">
                        Manage your account
                      </span>
                    </div>
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={logout}
                    className="
                      w-full
                      flex items-center gap-3
                      px-4 py-3
                      rounded-2xl
                      text-red-600
                      hover:bg-red-50
                      transition-all duration-200
                    "
                  >
                    <div
                      className="
                        w-10 h-10
                        rounded-2xl
                        bg-red-50
                        flex items-center justify-center
                      "
                    >
                      <LogOut className="w-5 h-5 text-red-500" />
                    </div>

                    <div className="flex flex-col text-left">
                      <span className="text-sm font-semibold">
                        Logout
                      </span>

                      <span className="text-[11px] text-red-400">
                        Sign out from dashboard
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}