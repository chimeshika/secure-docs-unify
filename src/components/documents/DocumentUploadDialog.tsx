import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/activity-logger";
import { Upload } from "lucide-react";

interface Department {
  id: string;
  name: string;
  code: string;
}

interface Folder {
  id: string;
  name: string;
}

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const DocumentUploadDialog = ({ open, onOpenChange, onSuccess }: DocumentUploadDialogProps) => {
  const [uploading, setUploading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [formData, setFormData] = useState({
    file: null as File | null,
    departmentId: "",
    folderId: "",
    dateReceived: "",
    referenceNumber: "",
    remarks: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!open) return;
      
      const [deptResult, folderResult] = await Promise.all([
        supabase.from("departments").select("*").order("name"),
        supabase.from("folders").select("id, name").order("name")
      ]);
      
      if (deptResult.data) setDepartments(deptResult.data);
      if (folderResult.data) setFolders(folderResult.data);
    };
    
    fetchData();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = formData.file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, formData.file);

      if (uploadError) throw uploadError;

      const { data: docData, error: dbError } = await supabase
        .from('documents')
        .insert({
          title: formData.file.name,
          file_path: filePath,
          file_type: formData.file.type,
          file_size: formData.file.size,
          owner_id: user.id,
          department_id: formData.departmentId || null,
          folder_id: formData.folderId || null,
          date_received: formData.dateReceived || null,
          reference_number: formData.referenceNumber || null,
          remarks: formData.remarks || null,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      await logActivity({
        action: "upload_document",
        entityType: "document",
        entityId: docData.id,
        details: {
          title: formData.file.name,
          reference_number: formData.referenceNumber,
        },
      });

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      setFormData({
        file: null,
        departmentId: "",
        folderId: "",
        dateReceived: "",
        referenceNumber: "",
        remarks: "",
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
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Fill in the document details and select a file to upload
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="file">Document File *</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
              required
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
            />
          </div>

          <div>
            <Label htmlFor="folder">Folder</Label>
            <Select
              value={formData.folderId}
              onValueChange={(value) => setFormData({ ...formData, folderId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select folder (optional)" />
              </SelectTrigger>
              <SelectContent>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.departmentId}
              onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department (optional)" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dateReceived">Date Received</Label>
            <Input
              id="dateReceived"
              type="date"
              value={formData.dateReceived}
              onChange={(e) => setFormData({ ...formData, dateReceived: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="referenceNumber">Reference Number</Label>
            <Input
              id="referenceNumber"
              type="text"
              value={formData.referenceNumber}
              onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
              placeholder="e.g., HA/2025/001"
            />
          </div>

          <div>
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Additional notes or remarks..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading || !formData.file}>
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
