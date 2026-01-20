import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/activity-logger";
import { Clock, Loader2, CheckCircle, Save } from "lucide-react";
import { DocumentStatusBadge } from "./DocumentStatusBadge";

type DocumentStatus = "received" | "processing" | "completed";

interface DocumentStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    id: string;
    title: string;
    status: DocumentStatus;
    status_notes: string | null;
  } | null;
  onSuccess: () => void;
}

const statusOptions = [
  { value: "received", label: "Received", icon: Clock, description: "Document has been received" },
  { value: "processing", label: "Processing", icon: Loader2, description: "Document is being processed" },
  { value: "completed", label: "Completed", icon: CheckCircle, description: "Processing completed" },
];

export const DocumentStatusDialog = ({ open, onOpenChange, document, onSuccess }: DocumentStatusDialogProps) => {
  const [status, setStatus] = useState<DocumentStatus>(document?.status || "received");
  const [notes, setNotes] = useState(document?.status_notes || "");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!document) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("documents")
        .update({
          status,
          status_notes: notes || null,
          status_updated_at: new Date().toISOString(),
        })
        .eq("id", document.id);

      if (error) throw error;

      await logActivity({
        action: "update_document_status",
        entityType: "document",
        entityId: document.id,
        details: {
          title: document.title,
          old_status: document.status,
          new_status: status,
        },
      });

      toast({
        title: "Status Updated",
        description: `Document status changed to "${status}"`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Update local state when document changes
  if (document && status !== document.status && !saving) {
    setStatus(document.status);
    setNotes(document.status_notes || "");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Document Status</DialogTitle>
          <DialogDescription>
            {document?.title}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Current status:</span>
            {document && <DocumentStatusBadge status={document.status} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as DocumentStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Status Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this status change..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Update Status"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
