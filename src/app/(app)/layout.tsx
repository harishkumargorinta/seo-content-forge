
"use client";

import * as React from 'react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { allTools, getToolBySlug } from '@/lib/tool-definitions';


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = React.useState("Dashboard"); 

  React.useEffect(() => {
    // Remove leading slash for matching with slugs
    const currentSlug = pathname.startsWith('/') ? pathname.substring(1) : pathname;
    const tool = getToolBySlug(currentSlug);

    if (tool) {
      setPageTitle(tool.pageTitle);
    } else if (pathname === "/dashboard") {
      setPageTitle("Dashboard");
    } else if (pathname.startsWith("/history")) {
      setPageTitle("Content History");
    } else if (pathname.startsWith("/comparisons")) {
        if (pathname.match(/^\/comparisons\/[^/]+$/)) { // Matches /comparisons/[id]
            setPageTitle("View Comparison Details");
        } else {
            setPageTitle("View Comparisons");
        }
    } else {
      // Fallback for any other pages or if a tool is somehow not found by slug
      // Capitalize first letter of the slug parts
      const pathParts = currentSlug.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        const title = pathParts.map(part => part.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')).join(' - ');
        setPageTitle(title);
      } else {
        setPageTitle("SEO Content Forge"); 
      }
    }
  }, [pathname]);


  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-background">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader className="p-4">
           <Link href="/" aria-label="SEO Content Forge Home">
             <Logo />
           </Link>
          </SidebarHeader>
          <SidebarContent className="flex-1 p-2">
            <SidebarNav />
          </SidebarContent>
          <SidebarFooter className="p-2">
            {/* Placeholder for user profile or logout */}
            {/* <Button variant="ghost" className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button> */}
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur px-4 md:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" /> {/* Only show on mobile */}
              <h1 className="text-xl font-semibold text-foreground">
                {pageTitle}
              </h1>
            </div>
            {/* Placeholder for header actions like notifications or user menu */}
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

// Required for the Link component
import Link from 'next/link';
