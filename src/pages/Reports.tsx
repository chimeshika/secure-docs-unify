import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportBuilder } from "@/components/reports/ReportBuilder";

interface ActivityLog {
  id: string;
  action: string;
  entity_type: string;
  details: any;
  created_at: string;
  user_id: string;
}

interface ActivityLogWithUser extends ActivityLog {
  user_name: string;
  user_email: string;
}

const Reports = () => {
  const [logs, setLogs] = useState<ActivityLogWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAndFetchLogs();
  }, []);

  const checkAdminAndFetchLogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      const adminStatus = !!roleData;
      setIsAdmin(adminStatus);

      if (adminStatus) {
        fetchAllLogs();
      } else {
        fetchUserLogs(user.id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const fetchAllLogs = async () => {
    try {
      const { data: logsData, error: logsError } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (logsError) throw logsError;

      // Fetch user profiles for all logs
      const userIds = [...new Set(logsData?.map(log => log.user_id) || [])];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

      const logsWithUsers: ActivityLogWithUser[] = (logsData || []).map(log => ({
        ...log,
        user_name: profilesMap.get(log.user_id)?.full_name || "Unknown",
        user_email: profilesMap.get(log.user_id)?.email || "",
      }));

      setLogs(logsWithUsers);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLogs = async (userId: string) => {
    try {
      const { data: logsData, error: logsError } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (logsError) throw logsError;

      // Fetch user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("id", userId)
        .maybeSingle();

      const logsWithUser: ActivityLogWithUser[] = (logsData || []).map(log => ({
        ...log,
        user_name: profile?.full_name || "Unknown",
        user_email: profile?.email || "",
      }));

      setLogs(logsWithUser);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Date", "User", "Action", "Entity Type", "Details"];
    const rows = logs.map(log => [
      format(new Date(log.created_at), "PPpp"),
      log.user_name || "Unknown",
      log.action,
      log.entity_type,
      JSON.stringify(log.details),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Activity report exported successfully",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Reports</h2>
          <p className="text-muted-foreground mt-2">
            Generate custom reports and view activity logs
          </p>
        </div>

        <Tabs defaultValue="builder" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="builder">Report Builder</TabsTrigger>
            <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="builder" className="space-y-4">
            <ReportBuilder />
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={exportToCSV} className="gap-2" disabled={logs.length === 0}>
                <Download className="h-4 w-4" />
                Export to CSV
              </Button>
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>
                  {isAdmin ? "View all system activity" : "View your activity history"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">Loading...</div>
                ) : logs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No activity logs found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Entity Type</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">
                            {format(new Date(log.created_at), "PPp")}
                          </TableCell>
                          <TableCell>
                            {log.user_name || "Unknown"}
                          </TableCell>
                          <TableCell className="capitalize">
                            {log.action.replace(/_/g, " ")}
                          </TableCell>
                          <TableCell className="capitalize">{log.entity_type}</TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                            {JSON.stringify(log.details)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
