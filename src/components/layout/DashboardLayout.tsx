import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { DashboardSidebar } from "./DashboardSidebar";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { OfficialHeader } from "./OfficialHeader";
import { OfficialFooter } from "./OfficialFooter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSwipeable } from "react-swipeable";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardContent = ({ children }: DashboardLayoutProps) => {
  const { open, setOpen, isMobile } = useSidebar();

  // Swipe handlers for mobile
  const handlers = useSwipeable({
    onSwipedRight: () => {
      if (isMobile && !open) {
        setOpen(true);
      }
    },
    onSwipedLeft: () => {
      if (isMobile && open) {
        setOpen(false);
      }
    },
    trackMouse: false,
    trackTouch: true,
    delta: 50, // Minimum swipe distance
  });

  return (
    <div {...handlers} className="min-h-screen flex flex-col w-full">
      <OfficialHeader />
      <div className="flex flex-1 w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border bg-card flex items-center px-4 md:px-6 shadow-sm">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-3 md:mr-4 lg:hidden"
              asChild
            >
              <SidebarTrigger>
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
            </Button>
            <SidebarTrigger className="hidden lg:flex mr-4" />
            <h1 className="text-sm md:text-base lg:text-lg font-semibold text-foreground truncate">
              Document Management System
            </h1>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto bg-background">{children}</main>
        </div>
      </div>
      <OfficialFooter />
    </div>
  );
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
};
