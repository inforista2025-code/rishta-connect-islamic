UPDATE public.profiles_data p
SET login_count = sub.c
FROM (
  SELECT profile_data_id, COUNT(*)::int AS c
  FROM public.member_otps
  WHERE consumed_at IS NOT NULL AND profile_data_id IS NOT NULL
  GROUP BY profile_data_id
) sub
WHERE p.id = sub.profile_data_id AND COALESCE(p.login_count,0) = 0;

UPDATE public.registrations r
SET login_count = sub.c
FROM (
  SELECT registration_id, COUNT(*)::int AS c
  FROM public.member_otps
  WHERE consumed_at IS NOT NULL AND registration_id IS NOT NULL
  GROUP BY registration_id
) sub
WHERE r.id = sub.registration_id AND COALESCE(r.login_count,0) = 0;