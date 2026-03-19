// src/components/Sidebar.tsx

import React, { useState, useEffect } from "react";
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  ShoppingBag
} from "lucide-react";

/* ---------------- TYPES ---------------- */

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  badge?: number | string;
  badgeColor?: "blue" | "red" | "green" | "yellow" | "purple";
  children?: MenuItem[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface SidebarProps {
  menuItems: MenuItem[];
  userProfile: UserProfile;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout?: () => void;
  onMenuItemClick?: (item: MenuItem) => void;
  activePath?: string;
  showMobileMenu?: boolean;
  onMobileMenuClose?: () => void;
  shopName?: string;
}

/* ---------------- BADGE ---------------- */

const Badge: React.FC<{ value: number | string; color?: string }> = ({
  value,
  color = "blue"
}) => {
  const colors: Record<string, string> = {
    blue: "bg-blue-500",
    red: "bg-red-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500"
  };

  return (
    <span
      className={`${colors[color]} text-white text-xs px-2 py-0.5 rounded-full ml-auto`}
    >
      {value}
    </span>
  );
};

/* ---------------- SHOP LOGO ---------------- */

const ShopLogo: React.FC<{ isCollapsed: boolean; shopName?: string }> = ({
  isCollapsed,
  shopName = "MyShop"
}) => {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      {/* Logo mark */}
      <div className="relative flex-shrink-0 w-9 h-9 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-200 dark:shadow-orange-900/40">
        <ShoppingBag className="w-5 h-5 text-white" strokeWidth={2} />
        {/* Decorative dot */}
        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full opacity-80" />
      </div>

      {/* Shop name — hidden when collapsed */}
      {!isCollapsed && (
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight tracking-tight truncate">
            {shopName}
          </p>
          <p className="text-[10px] text-orange-500 font-semibold uppercase tracking-widest">
            Store Admin
          </p>
        </div>
      )}
    </div>
  );
};

/* ---------------- MENU ITEM ---------------- */

const MenuItemComponent: React.FC<{
  item: MenuItem;
  isCollapsed: boolean;
  activePath?: string;
  onItemClick?: (item: MenuItem) => void;
}> = ({ item, isCollapsed, activePath, onItemClick }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.path && activePath === item.path;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasChildren) {
      setOpen(!open);
    } else {
      onItemClick?.(item);
    }
  };

  return (
    <div>
      <a
        href={item.path || "#"}
        onClick={handleClick}
        className={`flex items-center px-3 py-2.5 mx-2 rounded-xl transition-all duration-150
          ${
            isActive
              ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md shadow-orange-200 dark:shadow-orange-900/40"
              : "text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400"
          }
          ${isCollapsed ? "justify-center" : ""}`}
      >
        <span className={`flex-shrink-0 ${isCollapsed ? "" : "mr-3"}`}>
          {item.icon}
        </span>

        {!isCollapsed && (
          <>
            <span className="flex-1 text-sm font-medium">{item.label}</span>

            {item.badge && (
              <Badge value={item.badge} color={item.badgeColor} />
            )}

            {hasChildren && (
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            )}
          </>
        )}
      </a>

      {hasChildren && open && !isCollapsed && (
        <div className="ml-5 mt-1 border-l-2 border-orange-100 dark:border-gray-700 pl-2">
          {item.children?.map((child) => (
            <MenuItemComponent
              key={child.id}
              item={child}
              isCollapsed={false}
              activePath={activePath}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------------- SIDEBAR ---------------- */

export const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  userProfile,
  isCollapsed,
  onToggleCollapse,
  onLogout,
  onMenuItemClick,
  activePath,
  showMobileMenu = false,
  onMobileMenuClose,
  shopName = "MyShop"
}) => {
  const [mobileOpen, setMobileOpen] = useState(showMobileMenu);

  useEffect(() => {
    setMobileOpen(showMobileMenu);
  }, [showMobileMenu]);

  const closeMobile = () => {
    setMobileOpen(false);
    onMobileMenuClose?.();
  };

  /* ---------- MOBILE SIDEBAR ---------- */

  if (mobileOpen) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobile}
        />

        <div className="fixed left-0 top-0 h-full w-72 bg-white dark:bg-gray-900 z-50 shadow-2xl lg:hidden">
          <div className="flex justify-between items-center px-4 h-16 border-b border-gray-100 dark:border-gray-800">
            <ShopLogo isCollapsed={false} shopName={shopName} />
            <button
              onClick={closeMobile}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <SidebarContent
            menuItems={menuItems}
            userProfile={userProfile}
            isCollapsed={false}
            onLogout={onLogout}
            onMenuItemClick={onMenuItemClick}
            activePath={activePath}
          />
        </div>
      </>
    );
  }

  /* ---------- DESKTOP SIDEBAR (fixed) ---------- */

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 ease-in-out z-30
        ${isCollapsed ? "w-[72px]" : "w-72"}`}
    >
      {/* Header with logo */}
      <div
        className={`flex items-center h-16 px-4 border-b border-gray-100 dark:border-gray-800 ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        <ShopLogo isCollapsed={isCollapsed} shopName={shopName} />

        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="absolute -right-3 top-[18px] w-6 h-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition text-gray-500"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <SidebarContent
        menuItems={menuItems}
        userProfile={userProfile}
        isCollapsed={isCollapsed}
        onLogout={onLogout}
        onMenuItemClick={onMenuItemClick}
        activePath={activePath}
      />
    </aside>
  );
};

/* ---------------- SIDEBAR CONTENT ---------------- */

const SidebarContent: React.FC<{
  menuItems: MenuItem[];
  userProfile: UserProfile;
  isCollapsed: boolean;
  onLogout?: () => void;
  onMenuItemClick?: (item: MenuItem) => void;
  activePath?: string;
}> = ({
  menuItems,
  userProfile,
  isCollapsed,
  onLogout,
  onMenuItemClick,
  activePath
}) => {
  return (
    <div className="flex flex-col h-[calc(100%-64px)]">
      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-3 space-y-0.5 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
        {menuItems.map((item) => (
          <MenuItemComponent
            key={item.id}
            item={item}
            isCollapsed={isCollapsed}
            activePath={activePath}
            onItemClick={onMenuItemClick}
          />
        ))}
      </div>

      {/* User profile footer */}
      <div className="border-t border-gray-100 dark:border-gray-800 p-3">
        <div
          className={`flex items-center rounded-xl p-2 hover:bg-orange-50 dark:hover:bg-gray-800 transition cursor-pointer ${
            isCollapsed ? "justify-center" : "gap-3"
          }`}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0 w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow">
            {userProfile.avatar ? (
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              userProfile.name.charAt(0).toUpperCase()
            )}
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white dark:border-gray-900 rounded-full" />
          </div>

          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-tight">
                  {userProfile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {userProfile.role}
                </p>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex-shrink-0 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------------- MOBILE TOGGLE BUTTON ---------------- */

export const MobileSidebarToggle: React.FC<{ onClick: () => void }> = ({
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition"
      aria-label="Open menu"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
};