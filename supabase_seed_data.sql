-- ==============================================================================
-- CHAMONVIN LIMITED: SUPABASE SEED DATA & PERMISSIONS SCRIPT
-- Run this in your Supabase SQL Editor (supabase.com/dashboard -> SQL Editor)
-- ==============================================================================

-- 1. Ensure RLS policies allow public & anon read and insert
DROP POLICY IF EXISTS "Public can view published players" ON public.players;
CREATE POLICY "Public can view published players" ON public.players FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view published travel packages" ON public.travel_packages;
CREATE POLICY "Public can view published travel packages" ON public.travel_packages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view published news" ON public.news;
CREATE POLICY "Public can view published news" ON public.news FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can submit inquiries" ON public.inquiries;
CREATE POLICY "Public can submit inquiries" ON public.inquiries FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view settings" ON public.settings;
CREATE POLICY "Public can view settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);

-- 2. Insert Represented Players into public.players
INSERT INTO public.players (full_name, position, nationality, date_of_birth, preferred_foot, current_club, playing_level, photo_url, video_url, short_bio, career_achievements, internal_scouting_notes, is_featured, is_published)
VALUES 
(
  'Kwame Mensah',
  'Center Forward / Striker',
  'Ghana',
  '2004-06-15',
  'Right',
  'Accra Lions Elite Academy',
  'Semi-Professional',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
  'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
  'Explosive center forward with blistering acceleration, instinctive movement off the ball, and clinical finishing efficiency inside the 18-yard box.',
  '["Top Goalscorer - National Youth Cup 2025 (18 goals)", "Golden Boot Winner - West Africa Showcase", "Scouted for European Spring Trials"]'::jsonb,
  'Strong physical presence, presses relentlessly from the front, high coachability rating.',
  true,
  true
),
(
  'Mateo Silva Santos',
  'Central Attacking Midfielder',
  'Brazil',
  '2003-11-20',
  'Both',
  'Santos Regional Development Squad',
  'Professional',
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
  'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
  'Visionary playmaker gifted with exceptional close control, vision under high pressure, and pinpoint set-piece delivery.',
  '["Paulista U-20 Championship Silver Medalist", "Most Key Passes & Assists in regional league (14 assists in 2025)", "Selected for International Scouting Combine"]'::jsonb,
  'Elite vision, high football IQ, excels in transition play and final-third incision.',
  true,
  true
),
(
  'Emmanuel Chukwueze Okafor',
  'Central Defender / Sweeper',
  'Nigeria',
  '2005-02-10',
  'Left',
  'Lagos Golden Stars FC',
  'Semi-Professional',
  'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&w=800&q=80',
  'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
  'Commanding modern center back featuring formidable aerial dominance, proactive defensive anticipation, and clean line-breaking progressive passes.',
  '["National Under-20 Invitational Defensive MVP", "Recorded 87% aerial duel success rate across 2024/2025 season", "Team Captain and backline organizer"]'::jsonb,
  'Rare natural left-footed ball-playing center back with commanding vocal presence and tactical maturity.',
  true,
  true
);

-- 3. Insert Tour & Travel Packages into public.travel_packages
INSERT INTO public.travel_packages (title, destination, duration, price, cover_image_url, description, inclusions, is_featured, is_published)
VALUES 
(
  'European Elite Football Showcase & Club Trials 2026',
  'United Kingdom & Spain (London, Manchester, Madrid)',
  '14 Days / 13 Nights',
  '3,450 GBP',
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
  'An exclusive 14-day intensive showcase tour placing aspiring players in front of UEFA-licensed scouts, club sporting directors, and certified FIFA intermediaries across premier English and Spanish training complexes.',
  '["Full hotel accommodation in 4-star athletic partner facilities", "3 scheduled competitive showcase matches against certified academy opponents", "Official scouting dossier and video highlight reel delivered to attending scouts", "Nutritional meal program and licensed physiotherapy access", "Ground transportation via private team coach and airport transfers"]'::jsonb,
  true,
  true
),
(
  'Dubai High-Performance Training Camp & Winter Showcase',
  'Dubai, United Arab Emirates',
  '10 Days / 9 Nights',
  '2,850 USD',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  '10-day world-class training immersion at state-of-the-art climate-controlled facilities in Dubai, combining elite fitness benchmarking with competitive exhibition fixtures against Gulf-region teams.',
  '["Luxury athlete resort lodging with private training pitch access", "Sports science profiling: GPS telemetry, VO2 max testing & muscular readiness analysis", "2 exhibition fixtures against UAE Pro League academy squads", "Full board catering curated by accredited sports nutritionists", "Chaperoned desert cultural excursion and relaxation tour"]'::jsonb,
  true,
  true
),
(
  'Central European Scouting & Academy Tour',
  'Germany & France (Munich, Frankfurt, Strasbourg)',
  '12 Days / 11 Nights',
  '2,990 EUR',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
  'Comprehensive 12-day scouting itinerary across the footballing heartlands of Germany and France. Players experience high-level tactical sessions and direct assessments by continental scouts.',
  '["Centrally located 4-star accommodation with daily breakfast & dinner", "Training sessions led by UEFA Pro licensed guest clinicians", "Matches against premier regional club feeder academies", "All inter-city rail and private bus logistics", "Full scouting report and analytics breakdown"]'::jsonb,
  true,
  true
);

-- 4. Insert News & Announcements into public.news
INSERT INTO public.news (title, slug, category, summary, content, cover_image_url, author, is_published)
VALUES 
(
  'CHAMONVIN Expands Global Player Scouting Network for 2026/27 Season',
  'chamonvin-expands-global-player-scouting-network-2026',
  'Sports Management',
  'CHAMONVIN LIMITED announces the appointment of senior regional talent coordinators across West Africa, South America, and Central Europe.',
  'CHAMONVIN LIMITED is pleased to announce a significant strategic expansion of our international football scouting operations. With our client-first philosophy at the forefront, our newly established scouting desks in Accra, São Paulo, and Munich will provide transparent, direct pathways for exceptional young footballers aiming for international careers.\n\nOur firm provides continuous, end-to-end representation—handling technical player development, contract negotiation coordination, and comprehensive legal and immigration logistics.\n\nApplications for the 2026 international talent review are now open through our official Player Representation portal.',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
  'Chamonvin Editorial Desk',
  true
),
(
  'Navigating International Sports Visas: A Guide for Talents & Families',
  'navigating-international-sports-visas-guide-2026',
  'Visa Updates',
  'Our immigration advisory division releases key insights into UK and Schengen athletic visitor and trialist visa regulations.',
  'Securing legitimate, compliant travel authorization is often the most critical hurdle facing athletes invited for international trials. At CHAMONVIN LIMITED, our visa consultation desk works hand-in-hand with licensed immigration partners to ensure seamless, fully documented visa applications.\n\nWhether preparing standard visitor visas for European showcase matches, short-term training visas, or long-term family relocation packages, our team coordinates every requirement with absolute transparency and confidentiality.',
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
  'Chamonvin Immigration Desk',
  true
),
(
  'Registration Now Open: 2026 European Elite Football Showcase Tour',
  'registration-now-open-european-elite-football-tour-2026',
  'Travel Insights',
  'Limited spaces are available for our flagship 14-day European trial and scouting expedition across the UK and Spain.',
  'CHAMONVIN LIMITED is proud to unveil our flagship European Elite Football Showcase Tour 2026. Designed exclusively for represented and scouted talents aged 16 to 23, the 14-day program will feature competitive matches against top European academies, daily coaching with UEFA Pro staff, and direct exposure to club sporting directors.\n\nInterested players, families, and academy managers are invited to contact our travel consultation team or submit an inquiry through our website.',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
  'Chamonvin Travel Desk',
  true
);
