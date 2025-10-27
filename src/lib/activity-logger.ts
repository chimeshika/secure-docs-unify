import { supabase } from "@/integrations/supabase/client";

export type ActivityAction = 
  | "upload_document"
  | "download_document"
  | "delete_document"
  | "update_document"
  | "create_folder"
  | "delete_folder"
  | "login"
  | "logout";

export type EntityType = "document" | "folder" | "user" | "system";

interface LogActivityParams {
  action: ActivityAction;
  entityType: EntityType;
  entityId?: string;
  details?: Record<string, any>;
}

export const logActivity = async ({
  action,
  entityType,
  entityId,
  details,
}: LogActivityParams): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("activity_logs").insert({
      user_id: user.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details: details || {},
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};
