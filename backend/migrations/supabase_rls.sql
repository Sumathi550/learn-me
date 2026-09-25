-- ==============================================================================
-- LEARN ME
-- SUPABASE AUTHENTICATION + ROW LEVEL SECURITY
-- PRODUCTION RLS SETUP
-- ==============================================================================


-- ==============================================================================
-- 1. PREPARE USERS TABLE
-- ==============================================================================

-- Supabase Auth handles passwords.
-- Therefore the password column in public.users is not required.

ALTER TABLE IF EXISTS public.users
ALTER COLUMN password DROP NOT NULL;

-- Safe extension of Activity enum for missing application action records
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_activities_action') THEN
        ALTER TYPE "enum_activities_action" ADD VALUE IF NOT EXISTS 'OWNER_CLAIMED';
        ALTER TYPE "enum_activities_action" ADD VALUE IF NOT EXISTS 'CERTIFICATE_GENERATED';
    END IF;
END$$;


-- ==============================================================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ==============================================================================

ALTER TABLE IF EXISTS public.users
ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.enrollments
ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.progress
ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.certificates
ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.quiz_attempts
ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.courses
ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.categories
ENABLE ROW LEVEL SECURITY;


-- ==============================================================================
-- 3. USERS POLICIES
-- ==============================================================================

DROP POLICY IF EXISTS "Users can view own profile"
ON public.users;

CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
TO authenticated
USING (
    auth.uid() = id
);


DROP POLICY IF EXISTS "Users can update own profile"
ON public.users;

CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
TO authenticated
USING (
    auth.uid() = id
)
WITH CHECK (
    auth.uid() = id
);


DROP POLICY IF EXISTS "Users can insert own profile"
ON public.users;

CREATE POLICY "Users can insert own profile"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = id
);


-- ==============================================================================
-- 4. ENROLLMENTS POLICIES
-- ==============================================================================

DROP POLICY IF EXISTS "Users can view own enrollments"
ON public.enrollments;

CREATE POLICY "Users can view own enrollments"
ON public.enrollments
FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
);


DROP POLICY IF EXISTS "Users can create own enrollments"
ON public.enrollments;

CREATE POLICY "Users can create own enrollments"
ON public.enrollments
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id
);


-- ==============================================================================
-- 5. PROGRESS POLICIES
-- ==============================================================================

DROP POLICY IF EXISTS "Users can view own progress"
ON public.progress;

CREATE POLICY "Users can view own progress"
ON public.progress
FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
);


DROP POLICY IF EXISTS "Users can update own progress"
ON public.progress;

CREATE POLICY "Users can update own progress"
ON public.progress
FOR UPDATE
TO authenticated
USING (
    auth.uid() = user_id
)
WITH CHECK (
    auth.uid() = user_id
);


DROP POLICY IF EXISTS "Users can insert own progress"
ON public.progress;

CREATE POLICY "Users can insert own progress"
ON public.progress
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id
);


-- ==============================================================================
-- 6. CERTIFICATES POLICIES
-- ==============================================================================

DROP POLICY IF EXISTS "Users can view own certificates"
ON public.certificates;

CREATE POLICY "Users can view own certificates"
ON public.certificates
FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
);


DROP POLICY IF EXISTS "Public can verify valid certificates"
ON public.certificates;

CREATE POLICY "Public can verify valid certificates"
ON public.certificates
FOR SELECT
TO anon, authenticated
USING (
    status = 'valid'
);


-- ==============================================================================
-- 7. QUIZ ATTEMPTS POLICIES
-- ==============================================================================

DROP POLICY IF EXISTS "Users can view own quiz attempts"
ON public.quiz_attempts;

CREATE POLICY "Users can view own quiz attempts"
ON public.quiz_attempts
FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
);


DROP POLICY IF EXISTS "Users can record own quiz attempts"
ON public.quiz_attempts;

CREATE POLICY "Users can record own quiz attempts"
ON public.quiz_attempts
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id
);


-- ==============================================================================
-- 8. COURSES - PUBLIC READ
-- ==============================================================================

DROP POLICY IF EXISTS "Public can view published courses"
ON public.courses;

CREATE POLICY "Public can view published courses"
ON public.courses
FOR SELECT
TO anon, authenticated
USING (
    status = 'published'
);


-- ==============================================================================
-- 9. CATEGORIES - PUBLIC READ
-- ==============================================================================

DROP POLICY IF EXISTS "Public can view categories"
ON public.categories;

CREATE POLICY "Public can view categories"
ON public.categories
FOR SELECT
TO anon, authenticated
USING (
    true
);


-- ==============================================================================
-- 10. CREATE USER PROFILE FUNCTION
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN

    INSERT INTO public.users (
        id,
        name,
        email,
        role,
        is_active
    )
    VALUES (
        NEW.id,

        COALESCE(
            NEW.raw_user_meta_data->>'name',
            NEW.raw_user_meta_data->>'full_name',
            split_part(NEW.email, '@', 1)
        ),

        NEW.email,

        COALESCE(
            NEW.raw_user_meta_data->>'role',
            'user'
        ),

        TRUE
    )

    ON CONFLICT (id)
    DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email;

    RETURN NEW;

END;
$$;


-- ==============================================================================
-- 11. AUTH USER TRIGGER
-- ==============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created
ON auth.users;

CREATE TRIGGER on_auth_user_created

AFTER INSERT
ON auth.users

FOR EACH ROW

EXECUTE FUNCTION public.handle_new_user();


-- ==============================================================================
-- 12. VERIFY RLS STATUS
-- ==============================================================================

SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
    'users',
    'enrollments',
    'progress',
    'certificates',
    'quiz_attempts',
    'courses',
    'categories'
)
ORDER BY tablename;