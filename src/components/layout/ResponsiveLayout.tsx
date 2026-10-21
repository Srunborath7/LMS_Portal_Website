// src/components/layout/ResponsiveLayout.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((open) => !open);

  return (
    <>
      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
          <aside className="relative z-50 w-64 h-full bg-[var(--bg-sidebar)] text-[var(--text-sidebar)]">
            <div className="flex h-[var(--topbar-height)] items-center justify-between border-b border-[var(--border-default)] px-4">
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-sidebar)" }}>
                Menu
              </h2>
              <button
                onClick={toggleSidebar}
                className="lg:hidden flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--bg-surface-hover)]"
                aria-label="Close sidebar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="space-y-2 p-4">
              <Link href="/dashboard" className="block rounded-md px-3 py-2 text-sm hover:bg-[var(--bg-surface-hover)]">
                Dashboard
              </Link>
              <Link href="/students" className="block rounded-md px-3 py-2 text-sm hover:bg-[var(--bg-surface-hover)]">
                Students
              </Link>
              <Link href="/courses" className="block rounded-md px-3 py-2 text-sm hover:bg-[var(--bg-surface-hover)]">
                Courses
              </Link>
            </nav>
          </aside>
        </div>
      )}
      {/* Main layout container */}
      <div className="flex min-h-screen">
        {/* Desktop sidebar – always visible on lg+, hidden on mobile */}
        <div className="hidden lg:block">
          <Sidebar collapsed={false} onToggle={() => {}} />
        </div>
        <div className="flex flex-1 flex-col">
          <Topbar
            collapsed={!sidebarOpen && typeof window !== "undefined" && window.innerWidth < 1024}
            onMenuToggle={toggleSidebar}
          />
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </>
  );
}
