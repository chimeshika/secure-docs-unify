import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Lock, LockOpen } from "lucide-react";

interface SecretFolderToggleProps {
  folderId: string;
  isSecret: boolean;
  onToggle: () => void;
}

export const SecretFolderToggle = ({ folderId, isSecret, onToggle }: SecretFolderToggleProps) => {
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const handleToggle = async () => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("folders")
        .update({ is_secret: !isSecret })
        .eq("id", folderId);

      if (error) throw error;

      toast({
        title: !isSecret ? "🔒 Folder Secured!" : "🔓 Folder Made Public",
        description: !isSecret 
          ? "This folder now requires approval to access."
          : "This folder is now accessible to all users.",
      });

      onToggle();
    } catch (error: any) {
      console.error("Error updating folder:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update folder settings.",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {isSecret ? (
        <Lock className="h-4 w-4 text-warning" />
      ) : (
        <LockOpen className="h-4 w-4 text-muted-foreground" />
      )}
      <Switch
        id={`secret-${folderId}`}
        checked={isSecret}
        onCheckedChange={handleToggle}
        disabled={updating}
      />
      <Label htmlFor={`secret-${folderId}`} className="cursor-pointer">
        {isSecret ? "Secret Folder" : "Public Folder"}
      </Label>
    </div>
  );
};
