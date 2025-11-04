-- Add is_secret flag to folders table
ALTER TABLE public.folders 
ADD COLUMN is_secret boolean NOT NULL DEFAULT false;

-- Create access_requests table
CREATE TABLE public.access_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  folder_id uuid NOT NULL REFERENCES public.folders(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  requested_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamp with time zone,
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on access_requests
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view their own access requests"
ON public.access_requests
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own requests
CREATE POLICY "Users can create access requests"
ON public.access_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all requests
CREATE POLICY "Admins can view all access requests"
ON public.access_requests
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update all requests (approve/deny)
CREATE POLICY "Admins can update access requests"
ON public.access_requests
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_access_requests_updated_at
BEFORE UPDATE ON public.access_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check if user has active access to a secret folder
CREATE OR REPLACE FUNCTION public.has_folder_access(_user_id uuid, _folder_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.access_requests
    WHERE user_id = _user_id 
      AND folder_id = _folder_id
      AND status = 'approved'
      AND expires_at > now()
  )
$$;

-- Update folders RLS policy to check secret folder access
DROP POLICY IF EXISTS "Officers can view their own folders" ON public.folders;
CREATE POLICY "Officers can view their own folders or approved secret folders"
ON public.folders
FOR SELECT
USING (
  auth.uid() = owner_id 
  OR (is_secret = true AND has_folder_access(auth.uid(), id))
);

-- Update documents RLS policy to check secret folder access
DROP POLICY IF EXISTS "Officers can view their own documents" ON public.documents;
CREATE POLICY "Officers can view their own documents or documents in approved secret folders"
ON public.documents
FOR SELECT
USING (
  auth.uid() = owner_id 
  OR (folder_id IS NOT NULL AND has_folder_access(auth.uid(), folder_id))
);