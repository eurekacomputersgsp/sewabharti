
CREATE POLICY "Public read site-uploads" ON storage.objects FOR SELECT USING (bucket_id = 'site-uploads');
CREATE POLICY "Admins upload site-uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-uploads' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update site-uploads" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-uploads' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete site-uploads" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-uploads' AND public.has_role(auth.uid(), 'admin'));
