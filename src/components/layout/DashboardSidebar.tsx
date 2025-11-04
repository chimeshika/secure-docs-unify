import { useEffect, useState } from "react";
import { FileText, FolderOpen, Search, Settings, LogOut, Home, Users, Shield, ClipboardList, Lock } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function DashboardSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const isCollapsed = state === "collapsed";
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    setIsAdmin(roles?.some((r) => r.role === "admin") || false);
  };

  const menuItems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "My Documents", url: "/dashboard/documents", icon: FileText },
    { title: "Folders", url: "/dashboard/folders", icon: FolderOpen },
    { title: "Search", url: "/dashboard/search", icon: Search },
    { title: "Reports", url: "/dashboard/reports", icon: ClipboardList },
    { title: "Access Requests", url: "/dashboard/access-requests", icon: Lock },
    ...(isAdmin ? [{ title: "User Management", url: "/dashboard/users", icon: Users }] : []),
    { title: "Settings", url: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error logging out");
    } else {
      toast.success("Logged out successfully");
      navigate("/auth");
    }
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <div className="p-4 border-b border-sidebar-border bg-sidebar-background">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="bg-sidebar-primary/10 rounded-full p-2">
              <Shield className="h-6 w-6 text-sidebar-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-sidebar-foreground text-sm">SecureDocs</h2>
              <p className="text-xs text-sidebar-foreground/70">Document System</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Shield className="h-6 w-6 text-sidebar-primary" />
          </div>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "hover:bg-sidebar-accent/50"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  {!isCollapsed && <span>Logout</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
