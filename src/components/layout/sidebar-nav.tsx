
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutList, ListChecks, Settings2, PenSquare, FileCode2, History } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navItems = [
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
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              asChild
              className={cn(
                (pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)))
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                  : ''
              )}
              isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
              tooltip={item.label}
            >
              <a>
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
