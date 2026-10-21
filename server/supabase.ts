import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { dbManager } from './db.js';

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
  let targetUrl = url || process.env.SUPABASE_URL;
  let targetKey = key || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  // Fallback to settings stored in db.json if not present in process.env
  if (!targetUrl || !targetKey) {
    try {
      const s = dbManager.getSettings()?.supabase;
      if (s?.url && (s.serviceKey || s.anonKey)) {
        targetUrl = targetUrl || s.url;
        targetKey = targetKey || (s.serviceKey && s.serviceKey.trim() ? s.serviceKey : s.anonKey);
      }
    } catch {
      // ignore
    }
  }

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
  return Boolean(getSupabaseClient());
}

// Data mappers
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
    isFeatured: Boolean(row.is_featured),
    isPublished: Boolean(row.is_published),
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString()
  };
}

export function mapSupabaseNews(row: any): any {
  return {
    id: String(row.id),
    title: row.title || '',
    slug: row.slug || '',
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
    about: row.about || fallback.about,
    supabase: fallback.supabase
  };
}

// Queries
export async function getPublishedPlayersFromSupabase(): Promise<any[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('players')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    if (error) return null;
    return (data || []).map(mapSupabasePlayer);
  } catch {
    return null;
  }
}

export async function getAllPlayersFromSupabase(): Promise<any[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('players')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return null;
    return (data || []).map(mapSupabasePlayer);
  } catch {
    return null;
  }
}

export async function getPlayerByIdFromSupabase(id: string): Promise<any | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let query = client.from('players').select('*');
    if (isUUID) query = query.eq('id', id);
    else query = query.eq('full_name', id);
    const { data, error } = await query.maybeSingle();
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
    if (error) return null;
    return (data || []).map(mapSupabaseTravelPackage);
  } catch {
    return null;
  }
}

export async function getAllTravelPackagesFromSupabase(): Promise<any[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('travel_packages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return null;
    return (data || []).map(mapSupabaseTravelPackage);
  } catch {
    return null;
  }
}

export async function getTravelPackageByIdFromSupabase(id: string): Promise<any | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let query = client.from('travel_packages').select('*');
    if (isUUID) query = query.eq('id', id);
    else query = query.eq('title', id);
    const { data, error } = await query.maybeSingle();
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
    if (error) return null;
    return (data || []).map(mapSupabaseNews);
  } catch {
    return null;
  }
}

export async function getAllNewsFromSupabase(): Promise<any[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return null;
    return (data || []).map(mapSupabaseNews);
  } catch {
    return null;
  }
}

export async function getNewsByIdFromSupabase(idOrSlug: string): Promise<any | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    let query = client.from('news').select('*');
    if (isUUID) query = query.eq('id', idOrSlug);
    else query = query.or(`slug.eq.${idOrSlug},title.eq.${idOrSlug}`);
    const { data, error } = await query.maybeSingle();
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

// REAL-TIME CRUD WRITE MUTATIONS (AUTO-SYNC)
export async function upsertPlayerInSupabase(p: any): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not configured' };

  try {
    const payload: any = {
      full_name: p.fullName,
      position: p.position,
      date_of_birth: p.dateOfBirth || null,
      nationality: p.nationality,
      preferred_foot: p.preferredFoot || 'Right',
      current_club: p.currentClub || null,
      playing_level: p.playingLevel || 'Professional',
      photo_url: p.photoUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
      video_url: p.videoUrl || null,
      short_bio: p.shortBio || '',
      career_achievements: p.careerAchievements || [],
      internal_scouting_notes: p.internalScoutingNotes || null,
      is_featured: Boolean(p.isFeatured),
      is_published: p.isPublished !== false
    };

    const isUUID = p.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p.id);
    let existingId: string | null = null;

    if (isUUID) {
      const { data } = await client.from('players').select('id').eq('id', p.id).maybeSingle();
      if (data?.id) existingId = data.id;
    }

    if (!existingId && p.fullName) {
      const { data } = await client.from('players').select('id').eq('full_name', p.fullName.trim()).maybeSingle();
      if (data?.id) existingId = data.id;
    }

    if (existingId) {
      const { error } = await client.from('players').update(payload).eq('id', existingId);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } else {
      if (isUUID) payload.id = p.id;
      const { error } = await client.from('players').insert(payload);
      if (error) return { success: false, error: error.message };
      return { success: true };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deletePlayerFromSupabase(id: string, fullName?: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUUID) {
      const { error } = await client.from('players').delete().eq('id', id);
      if (!error) return true;
    }
    if (fullName) {
      const { error } = await client.from('players').delete().eq('full_name', fullName.trim());
      if (!error) return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function upsertTravelPackageInSupabase(t: any): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not configured' };
  try {
    const payload: any = {
      title: t.title,
      destination: t.destination,
      cover_image_url: t.coverImageUrl,
      description: t.description,
      duration: t.duration,
      price: t.price || 'Inquire',
      inclusions: t.inclusions || [],
      is_featured: Boolean(t.isFeatured),
      is_published: t.isPublished !== false
    };
    const isUUID = t.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(t.id);
    let existingId: string | null = null;
    if (isUUID) {
      const { data } = await client.from('travel_packages').select('id').eq('id', t.id).maybeSingle();
      if (data?.id) existingId = data.id;
    }
    if (!existingId && t.title) {
      const { data } = await client.from('travel_packages').select('id').eq('title', t.title.trim()).maybeSingle();
      if (data?.id) existingId = data.id;
    }
    if (existingId) {
      const { error } = await client.from('travel_packages').update(payload).eq('id', existingId);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } else {
      if (isUUID) payload.id = t.id;
      const { error } = await client.from('travel_packages').insert(payload);
      if (error) return { success: false, error: error.message };
      return { success: true };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteTravelPackageFromSupabase(id: string, title?: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUUID) {
      const { error } = await client.from('travel_packages').delete().eq('id', id);
      if (!error) return true;
    }
    if (title) {
      const { error } = await client.from('travel_packages').delete().eq('title', title.trim());
      if (!error) return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function upsertNewsInSupabase(n: any): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not configured' };
  try {
    const slug = n.slug || (n.title || 'news')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const payload: any = {
      title: n.title,
      slug,
      category: n.category || 'Company News',
      cover_image_url: n.coverImageUrl,
      author: n.author || 'Chamonvin Editorial Desk',
      content: n.content,
      summary: n.summary,
      is_published: n.isPublished !== false
    };
    const isUUID = n.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(n.id);
    let existingId: string | null = null;
    if (isUUID) {
      const { data } = await client.from('news').select('id').eq('id', n.id).maybeSingle();
      if (data?.id) existingId = data.id;
    }
    if (!existingId && n.title) {
      const { data } = await client.from('news').select('id').eq('title', n.title.trim()).maybeSingle();
      if (data?.id) existingId = data.id;
    }
    if (existingId) {
      const { error } = await client.from('news').update(payload).eq('id', existingId);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } else {
      if (isUUID) payload.id = n.id;
      const { error } = await client.from('news').insert(payload);
      if (error) return { success: false, error: error.message };
      return { success: true };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteNewsFromSupabase(id: string, title?: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUUID) {
      const { error } = await client.from('news').delete().eq('id', id);
      if (!error) return true;
    }
    if (title) {
      const { error } = await client.from('news').delete().eq('title', title.trim());
      if (!error) return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function upsertSettingsInSupabase(settings: any): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not configured' };
  try {
    const payload = {
      company_name: settings.companyName,
      logo_url: settings.logoUrl,
      logo_type: settings.logoType,
      hero_slider: settings.heroSlider,
      hero_tagline: settings.heroTagline,
      hero_buttons: settings.heroButtons,
      contact: settings.contact,
      about: settings.about
    };
    const { data: existing } = await client.from('settings').select('id').limit(1).maybeSingle();
    if (existing?.id) {
      const { error } = await client.from('settings').update(payload).eq('id', existing.id);
      if (error) return { success: false, error: error.message };
    } else {
      const { error } = await client.from('settings').insert(payload);
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
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

export async function updateInquiryInSupabase(referenceNo: string, updates: any): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const { error } = await client.from('inquiries').update(updates).eq('reference_no', referenceNo);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteInquiryFromSupabase(referenceNoOrId: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(referenceNoOrId);
    if (isUUID) {
      const { error } = await client.from('inquiries').delete().eq('id', referenceNoOrId);
      if (!error) return true;
    }
    const { error } = await client.from('inquiries').delete().eq('reference_no', referenceNoOrId);
    return !error;
  } catch {
    return false;
  }
}

// Test and Sync helpers
export async function testSupabaseConnection(url: string, key: string): Promise<SupabaseTestResult> {
  const cleanUrl = (url || '').trim();
  const cleanKey = (key || '').trim();
  if (!cleanUrl) return { success: false, message: 'Supabase Project URL is missing.', error: 'Missing URL' };
  if (!cleanKey) return { success: false, message: 'Supabase API Key is missing.', error: 'Missing API Key' };

  try {
    const client = createClient(cleanUrl, cleanKey, {
      auth: { persistSession: false, autoRefreshToken: false }
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
      return { success: false, url: cleanUrl, message: `Encountered error: ${err}`, error: err };
    }

    return {
      success: true,
      url: cleanUrl,
      message: 'Successfully connected to Supabase! Database tables verified.',
      tableCounts: {
        players: playersRes.count ?? (playersRes.error ? null : 0),
        settings: settingsRes.count ?? (settingsRes.error ? null : 0),
        travelPackages: travelRes.count ?? (travelRes.error ? null : 0),
        newsArticles: newsRes.count ?? (newsRes.error ? null : 0),
        inquiries: inqRes.count ?? (inqRes.error ? null : 0)
      }
    };
  } catch (err: any) {
    return { success: false, url: cleanUrl, message: `Failed to connect: ${err.message}`, error: err.message };
  }
}

export async function syncLocalDataToSupabase(
  url: string,
  key: string,
  data: { settings: any; players: any[]; travelPackages: any[]; news: any[]; inquiries: any[] }
): Promise<{ success: boolean; message: string; synced: Record<string, number>; errors?: string[] }> {
  const synced: Record<string, number> = { settings: 0, players: 0, travelPackages: 0, newsArticles: 0, inquiries: 0 };
  const errors: string[] = [];

  // 1. Settings
  try {
    const res = await upsertSettingsInSupabase(data.settings);
    if (!res.success && res.error) errors.push(`Settings: ${res.error}`);
    else synced.settings = 1;
  } catch (e: any) {
    errors.push(`Settings: ${e.message}`);
  }

  // 2. Players
  if (data.players?.length) {
    for (const p of data.players) {
      try {
        const res = await upsertPlayerInSupabase(p);
        if (!res.success && res.error) errors.push(`Player ${p.fullName}: ${res.error}`);
        else synced.players += 1;
      } catch (e: any) {
        errors.push(`Player ${p.fullName}: ${e.message}`);
      }
    }
  }

  // 3. Travel Packages
  if (data.travelPackages?.length) {
    for (const t of data.travelPackages) {
      try {
        const res = await upsertTravelPackageInSupabase(t);
        if (!res.success && res.error) errors.push(`Travel ${t.title}: ${res.error}`);
        else synced.travelPackages += 1;
      } catch (e: any) {
        errors.push(`Travel ${t.title}: ${e.message}`);
      }
    }
  }

  // 4. News
  if (data.news?.length) {
    for (const n of data.news) {
      try {
        const res = await upsertNewsInSupabase(n);
        if (!res.success && res.error) errors.push(`News ${n.title}: ${res.error}`);
        else synced.newsArticles += 1;
      } catch (e: any) {
        errors.push(`News ${n.title}: ${e.message}`);
      }
    }
  }

  return {
    success: errors.length === 0,
    message: errors.length === 0 ? 'All local data successfully synchronized to Supabase!' : `Sync finished with ${errors.length} warnings.`,
    synced,
    errors: errors.length > 0 ? errors : undefined
  };
}