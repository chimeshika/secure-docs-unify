-- Create departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on departments
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Everyone can view departments
CREATE POLICY "Everyone can view departments"
ON public.departments
FOR SELECT
USING (true);

-- Only admins can manage departments
CREATE POLICY "Admins can manage departments"
ON public.departments
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create activity_logs table
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on activity_logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view all logs
CREATE POLICY "Admins can view all activity logs"
ON public.activity_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can view their own logs
CREATE POLICY "Users can view their own activity logs"
ON public.activity_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own logs
CREATE POLICY "Users can insert activity logs"
ON public.activity_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add metadata columns to documents table
ALTER TABLE public.documents
ADD COLUMN department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
ADD COLUMN date_received DATE,
ADD COLUMN reference_number TEXT,
ADD COLUMN remarks TEXT;

-- Insert default departments
INSERT INTO public.departments (name, code, description) VALUES
  ('Home Affairs', 'HA', 'Home Affairs Division'),
  ('IT Branch', 'IT', 'Information Technology Branch'),
  ('Human Resources', 'HR', 'Human Resources Division'),
  ('Finance', 'FIN', 'Finance Division'),
  ('Legal', 'LEG', 'Legal Division'),
  ('Administration', 'ADM', 'Administration Division');

-- Create index for better search performance
CREATE INDEX idx_documents_title ON public.documents USING gin(to_tsvector('english', title));
CREATE INDEX idx_documents_reference ON public.documents(reference_number);
CREATE INDEX idx_documents_date_received ON public.documents(date_received);
CREATE INDEX idx_activity_logs_user ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON public.activity_logs(created_at DESC);