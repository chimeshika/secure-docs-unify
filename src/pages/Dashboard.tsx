import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FolderOpen, Upload, Users, HardDrive } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [stats, setStats] = useState({
    documents: 0,
    folders: 0,
    users: 0,
    storage: 0,
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user is admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      
      const admin = roles?.some((r) => r.role === "admin") || false;
      setIsAdmin(admin);

      // Fetch documents count
      let documentsQuery = supabase.from("documents").select("*", { count: "exact", head: true });
      if (!admin) {
        documentsQuery = documentsQuery.eq("owner_id", user.id);
      }
      const { count: documentsCount } = await documentsQuery;

      // Fetch folders count
      let foldersQuery = supabase.from("folders").select("*", { count: "exact", head: true });
      if (!admin) {
        foldersQuery = foldersQuery.eq("owner_id", user.id);
      }
      const { count: foldersCount } = await foldersQuery;

      // Fetch total file size
      let sizeQuery = supabase.from("documents").select("file_size");
      if (!admin) {
        sizeQuery = sizeQuery.eq("owner_id", user.id);
      }
      const { data: documents } = await sizeQuery;
      const totalSize = documents?.reduce((sum, doc) => sum + (doc.file_size || 0), 0) || 0;

      // Only fetch user count if admin
      let usersCount = 0;
      if (admin) {
        const { count } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });
        usersCount = count || 0;
      }

      setStats({
        documents: documentsCount || 0,
        folders: foldersCount || 0,
        users: usersCount,
        storage: totalSize,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Welcome to SecureDocs</h2>
          <p className="text-muted-foreground mt-2">
            {isAdmin ? "Administrator Dashboard" : "Your secure document management system"}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading dashboard...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-card border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">
                    {isAdmin ? "Total Documents" : "My Documents"}
                  </CardTitle>
                  <FileText className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{stats.documents}</p>
                <CardDescription className="mt-1">
                  {isAdmin ? "Documents in system" : "Documents uploaded"}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-card border-l-4 border-l-secondary">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">
                    {isAdmin ? "Total Folders" : "My Folders"}
                  </CardTitle>
                  <FolderOpen className="h-5 w-5 text-secondary" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-secondary">{stats.folders}</p>
                <CardDescription className="mt-1">
                  {isAdmin ? "Folders in system" : "Folders created"}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-card border-l-4 border-l-accent">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Storage Used</CardTitle>
                  <HardDrive className="h-5 w-5 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-accent">{formatBytes(stats.storage)}</p>
                <CardDescription className="mt-1">
                  {isAdmin ? "Total storage used" : "Your storage usage"}
                </CardDescription>
              </CardContent>
            </Card>

            {isAdmin && (
              <Card className="shadow-card border-l-4 border-l-destructive">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">Total Users</CardTitle>
                    <Users className="h-5 w-5 text-destructive" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-destructive">{stats.users}</p>
                  <CardDescription className="mt-1">
                    Registered users
                  </CardDescription>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
