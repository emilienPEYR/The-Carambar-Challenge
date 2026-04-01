
DROP POLICY IF EXISTS "Authenticated users can update jokes" ON public.jokes;
CREATE POLICY "Anyone can update jokes" ON public.jokes FOR UPDATE USING (true) WITH CHECK (true);
