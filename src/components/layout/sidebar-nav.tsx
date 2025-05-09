
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutList, ListChecks, Settings2, PenSquare, FileCode2, History, Globe } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Globe },
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/seo-optimizer', label: 'SEO Optimizer', icon: Settings2 },
  { href: '/content-writer', label: 'Content Writer', icon: PenSquare },
  { href: '/content-importer', label: 'Content Importer', icon: FileCode2 },
  { href: '/comparison-builder', label: 'Comparison Builder', icon: LayoutList },
  { href: '/comparisons', label: 'View Comparisons', icon: ListChecks },
  { href: '/history', label: 'Content History', icon: History },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        let currentItemIsActive;
        if (item.href === '/') {
          currentItemIsActive = pathname === '/';
        } else {
          // Original logic for other items
          currentItemIsActive = (pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)));
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
