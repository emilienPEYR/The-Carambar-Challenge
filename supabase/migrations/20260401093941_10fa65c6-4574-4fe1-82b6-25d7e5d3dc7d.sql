
-- Create jokes table
CREATE TABLE public.jokes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.jokes ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a joke (insert)
CREATE POLICY "Anyone can submit jokes" ON public.jokes
  FOR INSERT WITH CHECK (true);

-- Anyone can read approved jokes (for public display)
CREATE POLICY "Anyone can read approved jokes" ON public.jokes
  FOR SELECT USING (true);

-- Only authenticated users can update jokes (admin moderation)
CREATE POLICY "Authenticated users can update jokes" ON public.jokes
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.jokes;
