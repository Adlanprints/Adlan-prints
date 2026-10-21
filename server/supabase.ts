import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseTestResult {
  success: boolean;
  message: string;
  url?: string;
  tableCounts?: {
    settings: number | null;
    players: number | null;
    travelPackages: number | null;
    newsArticles: number | null;
    inquiries: number | null;
  };
  error?: string;
  details?: string;
}

export function getSupabaseClient(url?: string, key?: string): SupabaseClient | null {
  const targetUrl = url || process.env.SUPABASE_URL;
  const targetKey = key || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!targetUrl || !targetKey) {
    return null;
  }

  return createClient(targetUrl.trim(), targetKey.trim(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY));
}

// ==========================================
// DATA MAPPING HELPERS
// ==========================================

export function mapSupabasePlayer(row: any): any {
  return {
    id: String(row.id),
    fullName: row.full_name || '',
    position: row.position || '',
    nationality: row.nationality || '',
    dateOfBirth: row.date_of_birth || undefined,
    preferredFoot: row.preferred_foot || 'Right',
    currentClub: row.current_club || undefined,
    playingLevel: row.playing_level || 'Professional',
    shortBio: row.short_bio || '',
    careerAchievements: Array.isArray(row.career_achievements)
      ? row.career_achievements
      : typeof row.career_achievements === 'string'
      ? JSON.parse(row.career_achievements || '[]')
      : [],
    photoUrl: row.photo_url || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    videoUrl: row.video_url || undefined,
    isFeatured: Boolean(row.is_featured),
    isPublished: Boolean(row.is_published),
    internalScoutingNotes: row.internal_scouting_notes || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString()
  };
}

export function mapSupabaseTravelPackage(row: any): any {
  return {
    id: String(row.id),
    title: row.title || '',
    destination: row.destination || '',
    duration: row.duration || '',
    price: row.price || undefined,
    currency: row.currency || 'USD',
    coverImageUrl: row.cover_image_url || 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
    description: row.description || '',
    inclusions: Array.isArray(row.inclusions)
      ? row.inclusions
      : typeof row.inclusions === 'string'
      ? JSON.parse(row.inclusions || '[]')
      : [],
    exclusions: Array.isArray(row.exclusions)
      ? row.exclusions
      : typeof row.exclusions === 'string'
      ? JSON.parse(row.exclusions || '[]')
      : [],
    datesOrAvailability: row.dates_or_availability || undefined,
    terms: row.terms || '',
    isPublished: Boolean(row.is_published),
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString()
  };
}

export function mapSupabaseNews(row: any): any {
  return {
    id: String(row.id),
    title: row.title || '',
    category: row.category || 'Sports Management',
    coverImageUrl: row.cover_image_url || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    author: row.author || 'Chamonvin Editorial Desk',
    content: row.content || '',
    summary: row.summary || '',
    isPublished: Boolean(row.is_published),
    publishedAt: row.published_date || row.created_at || new Date().toISOString(),
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString()
  };
}

export function mapSupabaseSettings(row: any, fallback: any): any {
  return {
    companyName: row.company_name || fallback.companyName,
    logoUrl: row.logo_url || fallback.logoUrl,
    logoType: row.logo_type || fallback.logoType,
    heroSlider: row.hero_slider || fallback.heroSlider,
    heroTagline: row.hero_tagline || fallback.heroTagline,
    heroButtons: row.hero_buttons || fallback.heroButtons,
    contact: row.contact || fallback.contact,
    about: row.about || fallback.about
  };
}

// ==========================================
// SUPABASE QUERY API
// ==========================================

export async function getPublishedPlayersFromSupabase(): Promise<any[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('players')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase query error (players):', error.message);
      return null;
    }
    return (data || []).map(mapSupabasePlayer);
  } catch (err) {
    console.warn('Supabase exception (players):', err);
    return null;
  }
}

export async function getPlayerByIdFromSupabase(id: string): Promise<any | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('players')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;
    return mapSupabasePlayer(data);
  } catch {
    return null;
  }
}

export async function getPublishedTravelPackagesFromSupabase(): Promise<any[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('travel_packages')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase query error (travel_packages):', error.message);
      return null;
    }
    return (data || []).map(mapSupabaseTravelPackage);
  } catch (err) {
    console.warn('Supabase exception (travel_packages):', err);
    return null;
  }
}

export async function getTravelPackageByIdFromSupabase(id: string): Promise<any | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('travel_packages')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;
    return mapSupabaseTravelPackage(data);
  } catch {
    return null;
  }
}

export async function getPublishedNewsFromSupabase(): Promise<any[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('news')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase query error (news):', error.message);
      return null;
    }
    return (data || []).map(mapSupabaseNews);
  } catch (err) {
    console.warn('Supabase exception (news):', err);
    return null;
  }
}

export async function getNewsByIdFromSupabase(id: string): Promise<any | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('news')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;
    return mapSupabaseNews(data);
  } catch {
    return null;
  }
}

export async function getSettingsFromSupabase(fallback: any): Promise<any | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return mapSupabaseSettings(data, fallback);
  } catch {
    return null;
  }
}

export async function insertInquiryToSupabase(inq: any): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('inquiries').insert({
      reference_no: inq.referenceNo,
      category: inq.category,
      client_name: inq.clientName,
      email: inq.email,
      phone: inq.phone,
      status: inq.status || 'New',
      subject: inq.subject || null,
      details: inq.details || {},
      internal_notes: inq.internalNotes || []
    });
    return !error;
  } catch {
    return false;
  }
}

// ==========================================
// TEST CONNECTION & SYNC
// ==========================================

export async function testSupabaseConnection(url: string, key: string): Promise<SupabaseTestResult> {
  const cleanUrl = (url || '').trim();
  const cleanKey = (key || '').trim();

  if (!cleanUrl) {
    return {
      success: false,
      message: 'Supabase Project URL is missing. Please provide your Supabase URL (e.g. https://xxxx.supabase.co).',
      error: 'Missing URL'
    };
  }

  if (!cleanKey) {
    return {
      success: false,
      message: 'Supabase API Key is missing. Please provide your anon public key or service role key.',
      error: 'Missing API Key'
    };
  }

  try {
    const client = createClient(cleanUrl, cleanKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });

    const [playersRes, settingsRes, travelRes, newsRes, inqRes] = await Promise.all([
      client.from('players').select('id', { count: 'exact', head: true }),
      client.from('settings').select('id', { count: 'exact', head: true }),
      client.from('travel_packages').select('id', { count: 'exact', head: true }),
      client.from('news').select('id', { count: 'exact', head: true }),
      client.from('inquiries').select('id', { count: 'exact', head: true })
    ]);

    if (playersRes.error && settingsRes.error) {
      const err = playersRes.error.message || settingsRes.error.message;
      return {
        success: false,
        url: cleanUrl,
        message: `Connection reached Supabase, but encountered error: ${err}`,
        error: err,
        details: 'Ensure that you have executed supabase_schema.sql in the Supabase SQL Editor and that your anon/service_role API key is correct.'
      };
    }

    return {
      success: true,
      url: cleanUrl,
      message: 'Successfully connected to Supabase! Database tables are reachable and verified.',
      tableCounts: {
        players: playersRes.count ?? (playersRes.error ? null : 0),
        settings: settingsRes.count ?? (settingsRes.error ? null : 0),
        travelPackages: travelRes.count ?? (travelRes.error ? null : 0),
        newsArticles: newsRes.count ?? (newsRes.error ? null : 0),
        inquiries: inqRes.count ?? (inqRes.error ? null : 0)
      }
    };
  } catch (err: any) {
    return {
      success: false,
      url: cleanUrl,
      message: `Failed to connect to Supabase: ${err.message || 'Network error'}`,
      error: err.message || 'Unknown network error',
      details: 'Check if your Supabase Project URL is spelled correctly and the Supabase project is active.'
    };
  }
}

export async function syncLocalDataToSupabase(
  url: string,
  key: string,
  data: {
    settings: any;
    players: any[];
    travelPackages: any[];
    news: any[];
    inquiries: any[];
  }
): Promise<{ success: boolean; message: string; synced: Record<string, number>; errors?: string[] }> {
  const client = createClient(url.trim(), key.trim(), {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const synced: Record<string, number> = {
    settings: 0,
    players: 0,
    travelPackages: 0,
    newsArticles: 0,
    inquiries: 0
  };
  const errors: string[] = [];

  // 1. Sync Settings
  try {
    const { error } = await client.from('settings').upsert({
      company_name: data.settings.companyName,
      logo_url: data.settings.logoUrl,
      logo_type: data.settings.logoType,
      hero_slider: data.settings.heroSlider,
      hero_tagline: data.settings.heroTagline,
      hero_buttons: data.settings.heroButtons,
      contact: data.settings.contact,
      about: data.settings.about
    });
    if (error) errors.push(`Settings: ${error.message}`);
    else synced.settings = 1;
  } catch (e: any) {
    errors.push(`Settings: ${e.message}`);
  }

  // 2. Sync Players
  if (data.players && data.players.length > 0) {
    for (const p of data.players) {
      try {
        const { error } = await client.from('players').upsert({
          full_name: p.fullName,
          position: p.position,
          date_of_birth: p.dateOfBirth || null,
          nationality: p.nationality,
          preferred_foot: p.preferredFoot || 'Right',
          current_club: p.currentClub || null,
          playing_level: p.playingLevel || 'Professional',
          photo_url: p.photoUrl,
          video_url: p.videoUrl || null,
          short_bio: p.shortBio,
          career_achievements: p.careerAchievements || [],
          internal_scouting_notes: p.internalScoutingNotes || null,
          is_featured: Boolean(p.isFeatured),
          is_published: p.isPublished !== false
        });
        if (error) errors.push(`Player ${p.fullName}: ${error.message}`);
        else synced.players += 1;
      } catch (e: any) {
        errors.push(`Player ${p.fullName}: ${e.message}`);
      }
    }
  }

  // 3. Sync Travel Packages
  if (data.travelPackages && data.travelPackages.length > 0) {
    for (const t of data.travelPackages) {
      try {
        const { error } = await client.from('travel_packages').upsert({
          title: t.title,
          destination: t.destination,
          cover_image_url: t.coverImageUrl,
          description: t.description,
          duration: t.duration,
          price: t.price || 'Inquire',
          inclusions: t.inclusions || [],
          is_published: t.isPublished !== false
        });
        if (error) errors.push(`Travel ${t.title}: ${error.message}`);
        else synced.travelPackages += 1;
      } catch (e: any) {
        errors.push(`Travel ${t.title}: ${e.message}`);
      }
    }
  }

  // 4. Sync News
  if (data.news && data.news.length > 0) {
    for (const n of data.news) {
      try {
        const slug = (n.title || 'news')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
        const { error } = await client.from('news').upsert({
          title: n.title,
          slug,
          category: n.category || 'Company News',
          cover_image_url: n.coverImageUrl,
          author: n.author || 'Chamonvin Editorial Desk',
          content: n.content,
          summary: n.summary,
          is_published: n.isPublished !== false
        });
        if (error) errors.push(`News ${n.title}: ${error.message}`);
        else synced.newsArticles += 1;
      } catch (e: any) {
        errors.push(`News ${n.title}: ${e.message}`);
      }
    }
  }

  return {
    success: errors.length === 0,
    message: errors.length === 0
      ? 'All local data successfully synchronized to Supabase!'
      : `Sync completed with ${errors.length} warnings (if RLS blocked write, add SUPABASE_SERVICE_ROLE_KEY).`,
    synced,
    errors: errors.length > 0 ? errors : undefined
  };
}
