import { useRef, useState, useEffect } from "react";
import { POSsidebar } from "./pos-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet, useMatches } from "react-router";

export default function POSLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const matches = useMatches() as unknown as Array<{
    handle: { crumb?: string; crumbModule?: string; subCrumb?: string };
    pathname: string;
  }>;

  const crumbs = matches
    .filter((match) => match.handle?.crumb)
    .map((match) => ({
      module: match.handle.crumbModule as string,
      crumb: match.handle.crumb as string,
      subcrumb: match.handle.subCrumb as string,
    }));

  // Detect click outside sidebar
  useEffect(() => {
    if (!sidebarOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen} defaultOpen={false}>
        <div ref={sidebarRef}>
          <POSsidebar />
        </div>
        <SidebarInset>
          <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-50">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink>
                    {crumbs[0]?.module ? crumbs[0].module : "Home"}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {crumbs[0]?.crumb ? crumbs[0].crumb : "Dashboard"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
                {crumbs[0]?.subcrumb && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
                {crumbs[0]?.subcrumb && (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{crumbs[0].subcrumb}</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <Outlet />
        </SidebarInset>
    </SidebarProvider>
  );
}