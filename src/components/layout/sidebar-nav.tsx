
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutList, ListChecks, Settings2, PenSquare, FileCode2, History, Globe, PackageCheck } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { allTools } from '@/lib/tool-definitions'; // Import allTools

// Filter for existing tools to display in the sidebar
const navItemsFromTools = allTools
  .filter(tool => tool.isExisting && !tool.isComingSoon)
  .map(tool => ({
    href: tool.link,
    label: tool.title,
    icon: tool.icon,
  }));

const staticNavItems = [
  { href: '/', label: 'Home', icon: Globe },
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  // Other static items like View Comparisons and History can be added here if not covered by tools
  { href: '/comparisons', label: 'View Comparisons', icon: ListChecks },
  { href: '/history', label: 'Content History', icon: History },
];

// Combine and ensure Dashboard is near the top, and Home is first.
const combinedNavItems = [
  staticNavItems.find(item => item.href === '/')!,
  staticNavItems.find(item => item.href === '/dashboard')!,
  ...navItemsFromTools.filter(item => item.href !== '/dashboard'), // Add tool-based items, avoid duplicating dashboard
  ...staticNavItems.filter(item => item.href !== '/' && item.href !== '/dashboard' && !navItemsFromTools.find(t => t.href === item.href)), // Add remaining static items not covered by tools
].filter(Boolean); // Remove undefined entries if any

// Deduplicate based on href, preferring the order established above
const uniqueNavItems = combinedNavItems.reduce((acc, current) => {
  const x = acc.find(item => item.href === current.href);
  if (!x) {
    return acc.concat([current]);
  } else {
    return acc;
  }
}, [] as typeof combinedNavItems);


export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {uniqueNavItems.map((item) => {
        let currentItemIsActive;
        if (item.href === '/') {
          currentItemIsActive = pathname === '/';
        } else {
          // For other items, active if it's an exact match or if the path starts with the item's href (for nested routes)
          // Exclude dashboard from prefix matching to avoid highlighting it for all sub-pages
          currentItemIsActive = (pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href) && item.href !== '/'));
        }
        
        // Special handling for /comparisons/[id] to keep /comparisons active
        if (item.href === '/comparisons' && pathname.startsWith('/comparisons/')) {
            currentItemIsActive = true;
        }


        return (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref legacyBehavior>
              <SidebarMenuButton
                asChild
                className={cn(
                  currentItemIsActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : ''
                )}
                isActive={currentItemIsActive}
                tooltip={item.label}
              >
                <a>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
