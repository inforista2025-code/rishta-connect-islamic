-- Make registration-photos bucket public so the photo URLs are accessible
UPDATE storage.buckets 
SET public = true 
WHERE id = 'registration-photos';

-- Also make registration-biodatas public for biodata URLs
UPDATE storage.buckets 
SET public = true 
WHERE id = 'registration-biodatas';