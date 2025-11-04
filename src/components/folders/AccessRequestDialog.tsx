import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

interface AccessRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string;
  folderName: string;
}

export const AccessRequestDialog = ({ open, onOpenChange, folderId, folderName }: AccessRequestDialogProps) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast({
        variant: "destructive",
        title: "Reason Required",
        description: "Please provide a reason for accessing this folder.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("access_requests").insert({
        user_id: user.id,
        folder_id: folderId,
        reason: reason.trim(),
      });

      if (error) throw error;

      toast({
        title: "Request Submitted! 🎉",
        description: "Your access request has been sent to the administrator. You'll be notified once it's reviewed!",
      });

      setReason("");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error submitting access request:", error);
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong",
        description: error.message || "Failed to submit access request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-warning/10">
              <Lock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <DialogTitle>Access Restricted 🔒</DialogTitle>
              <DialogDescription className="mt-1">
                This is a secret folder that requires approval
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 rounded-lg bg-muted/50 border">
            <p className="text-sm font-medium mb-1">Folder Name:</p>
            <p className="text-sm text-muted-foreground">{folderName}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Why do you need access? *</Label>
            <Textarea
              id="reason"
              placeholder="Please explain why you need access to this folder... (e.g., 'I need to review documents for the Q4 audit report')"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Your request will be sent to an administrator for review. You'll receive a notification once it's approved or denied.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
