-- Create table for checkout rate limiting
CREATE TABLE IF NOT EXISTS public.checkout_rate_limits (
  user_id text PRIMARY KEY,
  request_count integer NOT NULL DEFAULT 0,
  window_start timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.checkout_rate_limits ENABLE ROW LEVEL SECURITY;

-- Policy: allow authenticated users to manage only their own row
-- Note: adjust as needed for your Supabase setup
CREATE POLICY "Allow owner" ON public.checkout_rate_limits
  FOR ALL
  USING (auth.role() = 'authenticated' AND user_id = auth.uid())
  WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());
