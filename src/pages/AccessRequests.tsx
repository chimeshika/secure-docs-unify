import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Clock, CheckCircle, XCircle, Lock, User } from "lucide-react";
import { format } from "date-fns";

interface AccessRequest {
  id: string;
  user_id: string;
  folder_id: string;
  reason: string;
  status: string;
  requested_at: string;
  reviewed_at: string | null;
  expires_at: string | null;
  profiles?: { full_name: string; email: string } | null;
  folders?: { name: string } | null;
}

export default function AccessRequests() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [myRequests, setMyRequests] = useState<AccessRequest[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const [action, setAction] = useState<"approve" | "deny" | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
    fetchRequests();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      setIsAdmin(!!data);
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch all requests (for admins) with manual profile joins
      const { data: allRequests, error: allError } = await supabase
        .from("access_requests")
        .select("*")
        .order("requested_at", { ascending: false });

      if (allError) throw allError;

      // Fetch profiles for all requests
      const profileIds = [...new Set(allRequests?.map(r => r.user_id) || [])];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", profileIds);

      // Fetch folders for all requests
      const folderIds = [...new Set(allRequests?.map(r => r.folder_id) || [])];
      const { data: foldersData } = await supabase
        .from("folders")
        .select("id, name")
        .in("id", folderIds);

      // Combine data
      const enrichedRequests = allRequests?.map(req => ({
        ...req,
        profiles: profilesData?.find(p => p.id === req.user_id) || null,
        folders: foldersData?.find(f => f.id === req.folder_id) || null,
      })) || [];

      setRequests(enrichedRequests as AccessRequest[]);

      // Fetch user's own requests
      const { data: userRequests, error: userError } = await supabase
        .from("access_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("requested_at", { ascending: false });

      if (userError) throw userError;

      // Enrich user requests with folder data
      const userFolderIds = [...new Set(userRequests?.map(r => r.folder_id) || [])];
      const { data: userFoldersData } = await supabase
        .from("folders")
        .select("id, name")
        .in("id", userFolderIds);

      const enrichedUserRequests = userRequests?.map(req => ({
        ...req,
        folders: userFoldersData?.find(f => f.id === req.folder_id) || null,
      })) || [];

      setMyRequests(enrichedUserRequests as AccessRequest[]);
    } catch (error: any) {
      console.error("Error fetching requests:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load access requests.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedRequest || !action) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const updates: any = {
        status: action === "approve" ? "approved" : "denied",
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      };

      // If approving, set expiration to 2 hours from now
      if (action === "approve") {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 2);
        updates.expires_at = expiresAt.toISOString();
      }

      const { error } = await supabase
        .from("access_requests")
        .update(updates)
        .eq("id", selectedRequest.id);

      if (error) throw error;

      toast({
        title: action === "approve" ? "Access Granted! ✅" : "Request Denied",
        description: action === "approve" 
          ? `${selectedRequest.profiles?.full_name} now has access for 2 hours!`
          : "The access request has been denied.",
      });

      fetchRequests();
      setSelectedRequest(null);
      setAction(null);
    } catch (error: any) {
      console.error("Error updating request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process the request.",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case "approved":
        return <Badge variant="default" className="gap-1 bg-success"><CheckCircle className="h-3 w-3" />Approved</Badge>;
      case "denied":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Denied</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const RequestCard = ({ request, showUser = false }: { request: AccessRequest; showUser?: boolean }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="h-4 w-4" />
              {request.folders?.name || "Unknown Folder"}
            </CardTitle>
            {showUser && (
              <CardDescription className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {request.profiles?.full_name} ({request.profiles?.email})
              </CardDescription>
            )}
          </div>
          {getStatusBadge(request.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-1">Reason:</p>
          <p className="text-sm text-muted-foreground">{request.reason}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Requested:</p>
            <p className="text-muted-foreground">{format(new Date(request.requested_at), "PPp")}</p>
          </div>
          {request.reviewed_at && (
            <div>
              <p className="font-medium">Reviewed:</p>
              <p className="text-muted-foreground">{format(new Date(request.reviewed_at), "PPp")}</p>
            </div>
          )}
          {request.expires_at && request.status === "approved" && (
            <div className="col-span-2">
              <p className="font-medium">Access Expires:</p>
              <p className="text-muted-foreground">{format(new Date(request.expires_at), "PPp")}</p>
            </div>
          )}
        </div>

        {isAdmin && request.status === "pending" && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => {
                setSelectedRequest(request);
                setAction("approve");
              }}
              className="flex-1"
            >
              Approve (2 hours)
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                setSelectedRequest(request);
                setAction("deny");
              }}
              className="flex-1"
            >
              Deny
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Access Requests</h1>
          <p className="text-muted-foreground mt-2">
            Manage access requests for secret folders
          </p>
        </div>

        <Tabs defaultValue={isAdmin ? "pending" : "my-requests"}>
          <TabsList>
            <TabsTrigger value="my-requests">My Requests</TabsTrigger>
            {isAdmin && (
              <>
                <TabsTrigger value="pending">Pending Review</TabsTrigger>
                <TabsTrigger value="all">All Requests</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="my-requests" className="space-y-4">
            {loading ? (
              <p>Loading...</p>
            ) : myRequests.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">You haven't made any access requests yet.</p>
                </CardContent>
              </Card>
            ) : (
              myRequests.map((request) => <RequestCard key={request.id} request={request} />)
            )}
          </TabsContent>

          {isAdmin && (
            <>
              <TabsContent value="pending" className="space-y-4">
                {loading ? (
                  <p>Loading...</p>
                ) : requests.filter(r => r.status === "pending").length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground">No pending requests! 🎉</p>
                    </CardContent>
                  </Card>
                ) : (
                  requests.filter(r => r.status === "pending").map((request) => (
                    <RequestCard key={request.id} request={request} showUser />
                  ))
                )}
              </TabsContent>

              <TabsContent value="all" className="space-y-4">
                {loading ? (
                  <p>Loading...</p>
                ) : requests.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground">No access requests yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  requests.map((request) => <RequestCard key={request.id} request={request} showUser />)
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      <AlertDialog open={!!selectedRequest && !!action} onOpenChange={() => { setSelectedRequest(null); setAction(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {action === "approve" ? "Approve Access Request?" : "Deny Access Request?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {action === "approve" 
                ? `This will grant ${selectedRequest?.profiles?.full_name} access to "${selectedRequest?.folders?.name}" for 2 hours.`
                : `This will deny ${selectedRequest?.profiles?.full_name}'s request to access "${selectedRequest?.folders?.name}".`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>
              {action === "approve" ? "Approve" : "Deny"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
