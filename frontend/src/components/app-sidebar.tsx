"use client";

import React from "react";
import NavbarMenus from "./navbar-menus";
import { menus } from "@/config/menus";

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({}: SidebarProps = {}) {
  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden lg:block">
        <NavbarMenus menus={menus} />
      </div>
    </>
  );
}