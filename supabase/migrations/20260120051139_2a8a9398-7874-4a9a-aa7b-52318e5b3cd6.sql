-- Create enum for document status
CREATE TYPE public.document_status AS ENUM ('received', 'processing', 'completed');

-- Add status column to documents table
ALTER TABLE public.documents 
ADD COLUMN status public.document_status NOT NULL DEFAULT 'received';

-- Add status_updated_at to track when status changed
ALTER TABLE public.documents 
ADD COLUMN status_updated_at timestamp with time zone DEFAULT now();

-- Add status_notes for optional notes on status changes
ALTER TABLE public.documents 
ADD COLUMN status_notes text;