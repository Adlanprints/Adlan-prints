-- ==============================================================================
-- SUPABASE POSTGRESQL SCHEMA FOR CHAMONVIN LIMITED
-- Comprehensive database schema with Row Level Security (RLS), indexes & triggers
-- ==============================================================================

-- 1. Enable UUID generator extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABLE: settings
-- Global website configuration, appearance, contact info, and hero slides
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL DEFAULT 'CHAMONVIN LIMITED',
    logo_url TEXT NOT NULL DEFAULT 'https://i.ibb.co/Kp7HY9pp/Whats-App-Image-2026-10-17-at-15-09-07.jpg',
    logo_type TEXT NOT NULL DEFAULT 'url',
    hero_slider JSONB NOT NULL DEFAULT '{
        "slides": [
            {
                "id": "slide-1",
                "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=2000&q=85",
                "alt": "Professional football pitch viewed from the stands",
                "title": "Professional Football Representation",
                "subtitle": "Dedicated global player management, scouting pathways, and high-level career development."
            },
            {
                "id": "slide-2",
                "image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=2000&q=85",
                "alt": "Beautifully maintained football field with goalposts",
                "title": "Strategic Career Planning & Club Connections",
                "subtitle": "Navigating domestic and international transfers with transparency, integrity, and diligence."
            },
            {
                "id": "slide-3",
                "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=2000&q=85",
                "alt": "High-quality football stadium featuring match atmosphere",
                "title": "International Travel & Visa Advisory",
                "subtitle": "Comprehensive travel planning, flight bookings, and legitimate visa consultation for talents and families."
            }
        ],
        "interval": 5,
        "transitionStyle": "fade"
    }'::jsonb,
    hero_tagline TEXT NOT NULL DEFAULT 'Your vision and Goal is our Priority',
    hero_buttons JSONB NOT NULL DEFAULT '[
        {"label": "Explore Our Sports Management", "path": "/sports-management", "style": "primary"},
        {"label": "Explore Travel & Visa Services", "path": "/travel-tours", "style": "dark"},
        {"label": "Become a Represented Player", "path": "/player-representation", "style": "primary"},
        {"label": "Book a Consultation", "path": "/contact#consultation", "style": "secondary"}
    ]'::jsonb,
    contact JSONB NOT NULL DEFAULT '{
        "email": "info@chamonvin.com",
        "phone": "+44 20 7946 0912",
        "whatsapp": "+44 7700 900823",
        "officeAddress": "London, United Kingdom & Global Representation Hubs",
        "businessHours": "Monday – Friday: 9:00 AM – 6:00 PM GMT | Saturday: By Appointment",
        "socialLinks": {
            "twitter": "https://x.com/chamonvin",
            "instagram": "https://instagram.com/chamonvin",
            "linkedin": "https://linkedin.com/company/chamonvin",
            "facebook": ""
        }
    }'::jsonb,
    about JSONB NOT NULL DEFAULT '{
        "overview": "At Chamonvin Limited, our clients priorities come first, every time.",
        "mission": "To discover, develop, and represent sports talent globally while providing comprehensive travel, visa, and logistics solutions anchored in transparency, trust, and client success.",
        "vision": "To be recognized globally as a premier, ethical sports management and travel consultancy that empowers athletes and travelers to fulfill their highest potential without borders.",
        "philosophy": "Our clients vision and goals stand at the center of everything we do. We offer honest evaluations, long-term career foresight, and meticulous logistical execution.",
        "sportsApproach": "We take a holistic approach to player development: from technical profiling and tactical awareness to contract negotiation coordination, international network introductions, and life beyond the pitch.",
        "travelApproach": "We provide seamless, lawful, and personalized guidance for international trips, tours, flights, and visa consultations tailored to athletes, business professionals, students, and families.",
        "commitment": "Absolute client confidentiality, full transparency in communication, and uncompromising adherence to relevant regulatory and legal frameworks."
    }'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE: players
-- Football talent directory, bio, YouTube highlight video embed, achievements
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    position TEXT NOT NULL,
    date_of_birth TEXT,
    nationality TEXT NOT NULL,
    height_cm INTEGER,
    weight_kg INTEGER,
    preferred_foot TEXT DEFAULT 'Right' CHECK (preferred_foot IN ('Left', 'Right', 'Both')),
    current_club TEXT,
    playing_level TEXT NOT NULL CHECK (playing_level IN ('Amateur', 'Semi-Professional', 'Professional')),
    photo_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    video_url TEXT, -- YouTube highlight reel link (displayed inline under PLAYER HIGHLIGHT)
    short_bio TEXT NOT NULL,
    career_achievements JSONB NOT NULL DEFAULT '[]'::jsonb,
    internal_scouting_notes TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_players_is_published ON public.players (is_published);
CREATE INDEX IF NOT EXISTS idx_players_position ON public.players (position);
CREATE INDEX IF NOT EXISTS idx_players_playing_level ON public.players (playing_level);

-- ==============================================================================
-- TABLE: travel_packages
-- Travel & tour offerings, inclusions, visas, flight itineraries
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.travel_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    duration TEXT NOT NULL,
    price TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    description TEXT NOT NULL,
    inclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_travel_packages_published ON public.travel_packages (is_published);

-- ==============================================================================
-- TABLE: news
-- Articles, company news, transfer announcements, visa updates
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('Transfers', 'Company News', 'Sports Management', 'Visa Updates', 'Travel Insights')),
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    published_date DATE NOT NULL DEFAULT CURRENT_DATE,
    author TEXT NOT NULL DEFAULT 'Chamonvin Editorial Desk',
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_news_published ON public.news (is_published);
CREATE INDEX IF NOT EXISTS idx_news_category ON public.news (category);

-- ==============================================================================
-- TABLE: inquiries
-- Client consultation leads, applications, visa consultation requests
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_no TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('sports-management', 'player-representation', 'travel-tours', 'visa-consultation', 'flight-services', 'general')),
    client_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'In Progress', 'Awaiting Client Response', 'Completed', 'Closed')),
    subject TEXT,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    internal_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
    assigned_staff TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_inquiries_category ON public.inquiries (category);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries (status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries (created_at DESC);

-- ==============================================================================
-- TABLE: activity_logs
-- Audit trail for administrator operations
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    admin_email TEXT NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs (created_at DESC);

-- ==============================================================================
-- TRIGGER FOR AUTOMATIC updated_at TIMESTAMP
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers before re-creating to prevent 42710 "already exists" errors
DROP TRIGGER IF EXISTS tr_settings_updated_at ON public.settings;
CREATE TRIGGER tr_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

DROP TRIGGER IF EXISTS tr_players_updated_at ON public.players;
CREATE TRIGGER tr_players_updated_at BEFORE UPDATE ON public.players FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

DROP TRIGGER IF EXISTS tr_travel_updated_at ON public.travel_packages;
CREATE TRIGGER tr_travel_updated_at BEFORE UPDATE ON public.travel_packages FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

DROP TRIGGER IF EXISTS tr_news_updated_at ON public.news;
CREATE TRIGGER tr_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

DROP TRIGGER IF EXISTS tr_inquiries_updated_at ON public.inquiries;
CREATE TRIGGER tr_inquiries_updated_at BEFORE UPDATE ON public.inquiries FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 1. Public read-only access to published content & settings
DROP POLICY IF EXISTS "Public can view settings" ON public.settings;
CREATE POLICY "Public can view settings" ON public.settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view published players" ON public.players;
CREATE POLICY "Public can view published players" ON public.players FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public can view published travel packages" ON public.travel_packages;
CREATE POLICY "Public can view published travel packages" ON public.travel_packages FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public can view published news" ON public.news;
CREATE POLICY "Public can view published news" ON public.news FOR SELECT USING (is_published = true);

-- 2. Public can insert new client consultation inquiries
DROP POLICY IF EXISTS "Public can submit inquiries" ON public.inquiries;
CREATE POLICY "Public can submit inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

-- 3. Authenticated staff/admins have full access to manage all records
DROP POLICY IF EXISTS "Admins full access to settings" ON public.settings;
CREATE POLICY "Admins full access to settings" ON public.settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access to players" ON public.players;
CREATE POLICY "Admins full access to players" ON public.players FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access to travel packages" ON public.travel_packages;
CREATE POLICY "Admins full access to travel packages" ON public.travel_packages FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access to news" ON public.news;
CREATE POLICY "Admins full access to news" ON public.news FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access to inquiries" ON public.inquiries;
CREATE POLICY "Admins full access to inquiries" ON public.inquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access to activity logs" ON public.activity_logs;
CREATE POLICY "Admins full access to activity logs" ON public.activity_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA (Only inserts if settings is empty)
-- ==============================================================================
INSERT INTO public.settings (company_name, logo_url, logo_type, hero_tagline)
SELECT 'CHAMONVIN LIMITED', 'https://i.ibb.co/Kp7HY9pp/Whats-App-Image-2026-10-17-at-15-09-07.jpg', 'url', 'Your vision and Goal is our Priority'
WHERE NOT EXISTS (SELECT 1 FROM public.settings);

