import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface SlideItem {
  id: string;
  image: string;
  alt: string;
  title: string;
  subtitle: string;
}

export interface HeroButton {
  label: string;
  path: string;
  style: 'primary' | 'secondary' | 'outline' | 'dark';
}

export interface WebsiteSettings {
  companyName: string;
  logoUrl: string;
  logoType: 'text' | 'upload' | 'url';
  heroSlider: {
    slides: SlideItem[];
    interval: number; // in seconds, default 15
    transitionStyle: 'fade' | 'slide';
  };
  heroTagline: string;
  heroButtons: HeroButton[];
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    officeAddress: string;
    businessHours: string;
    socialLinks: {
      twitter: string;
      instagram: string;
      linkedin: string;
      facebook: string;
    };
  };
  about: {
    overview: string;
    mission: string;
    vision: string;
    philosophy: string;
    sportsApproach: string;
    travelApproach: string;
    commitment: string;
  };
  supabase?: {
    url: string;
    anonKey: string;
    serviceKey?: string;
    databaseUrl?: string;
    enabled: boolean;
    lastConnectedAt?: string;
  };
}

export interface PlayerProfile {
  id: string;
  fullName: string;
  position: string;
  nationality: string;
  dateOfBirth?: string;
  age?: number;
  currentClub?: string;
  preferredFoot?: 'Left' | 'Right' | 'Both';
  playingLevel: 'Academy' | 'Amateur' | 'Semi-Professional' | 'Professional';
  shortBio: string;
  careerAchievements: string[];
  photoUrl: string;
  videoUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  internalScoutingNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TravelPackage {
  id: string;
  title: string;
  destination: string;
  coverImageUrl: string;
  description: string;
  duration: string;
  inclusions: string[];
  exclusions: string[];
  price?: string;
  currency?: string;
  datesOrAvailability?: string;
  terms: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'Sports Management' | 'Player Updates' | 'Travel & Tours' | 'Visa & Immigration' | 'Company News';
  coverImageUrl: string;
  author: string;
  content: string;
  summary: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type InquiryCategory =
  | 'player-representation'
  | 'sports-management'
  | 'travel-tours'
  | 'visa-consultation'
  | 'flight-services'
  | 'general';

export type InquiryStatus =
  | 'New'
  | 'In Progress'
  | 'Awaiting Client Response'
  | 'Completed'
  | 'Closed';

export interface InquiryRecord {
  id: string;
  referenceNo: string;
  category: InquiryCategory;
  clientName: string;
  email: string;
  phone: string;
  status: InquiryStatus;
  subject?: string;
  details: Record<string, any>;
  internalNotes: Array<{
    id: string;
    text: string;
    author: string;
    createdAt: string;
  }>;
  assignedStaff?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'Super Admin' | 'Manager';
  createdAt: string;
  lastLoginAt?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  adminEmail: string;
  details: string;
  timestamp: string;
}

export interface DatabaseSchema {
  settings: WebsiteSettings;
  players: PlayerProfile[];
  travelPackages: TravelPackage[];
  news: NewsArticle[];
  inquiries: InquiryRecord[];
  admins: AdminUser[];
  activityLogs: ActivityLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const DEFAULT_SETTINGS: WebsiteSettings = {
  companyName: 'CHAMONVIN LIMITED',
  logoUrl: 'https://i.ibb.co/Kp7HY9pp/Whats-App-Image-2026-10-17-at-15-09-07.jpg',
  logoType: 'url',
  heroSlider: {
    slides: [
      {
        id: 'slide-1',
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=2000&q=85',
        alt: 'Professional football pitch viewed from the stands',
        title: 'Professional Football Representation',
        subtitle: 'Dedicated global player management, scouting pathways, and high-level career development.'
      },
      {
        id: 'slide-2',
        image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=2000&q=85',
        alt: 'Beautifully maintained football field with goalposts',
        title: 'Strategic Career Planning & Club Connections',
        subtitle: 'Navigating domestic and international transfers with transparency, integrity, and diligence.'
      },
      {
        id: 'slide-3',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=2000&q=85',
        alt: 'High-quality football stadium featuring match atmosphere',
        title: 'International Travel & Visa Advisory',
        subtitle: 'Comprehensive travel planning, flight bookings, and legitimate visa consultation for talents and families.'
      }
    ],
    interval: 15,
    transitionStyle: 'fade'
  },
  heroTagline: 'Your vision and Goal is our Priority',
  heroButtons: [
    { label: 'Explore Our Sports Management', path: '/sports-management', style: 'primary' },
    { label: 'Explore Travel & Visa Services', path: '/travel-tours', style: 'dark' },
    { label: 'Become a Represented Player', path: '/player-representation', style: 'primary' },
    { label: 'Book a Consultation', path: '/contact#consultation', style: 'secondary' }
  ],
  contact: {
    email: 'info@chamonvin.com',
    phone: '+44 20 7946 0912',
    whatsapp: '+44 7700 900823',
    officeAddress: 'London, United Kingdom & Global Representation Hubs',
    businessHours: 'Monday – Friday: 9:00 AM – 6:00 PM GMT | Saturday: By Appointment',
    socialLinks: {
      twitter: 'https://x.com/chamonvin',
      instagram: 'https://instagram.com/chamonvin',
      linkedin: 'https://linkedin.com/company/chamonvin',
      facebook: ''
    }
  },
  about: {
    overview: "At Chamonvin Limited, our clients' priorities come first, every time.\n\nChamonvin Limited is an international/global sports management firm specializing in soccer, football, and player representation, with extended services in travel and visa consultation.\n\nWe represent amateur players, semi-professional players, professional players, managers, and teams. We continuously provide dedicated, high-quality service to our clients, whether on or off the pitch.\n\nWe understand what it takes to pursue success at the highest level. We help our clients navigate their careers, identify suitable opportunities, and make informed decisions at every stage of their journey.\n\nOur number-one priority is our clients and their success. Chamonvin Limited is committed to helping clients access suitable opportunities through professional support, communication, and personalized service.",
    mission: "To discover, develop, and represent sports talent globally while providing comprehensive travel, visa, and logistics solutions anchored in transparency, trust, and client success.",
    vision: "To be recognized globally as a premier, ethical sports management and travel consultancy that empowers athletes and travelers to fulfill their highest potential without borders.",
    philosophy: "Our clients' vision and goals stand at the center of everything we do. We offer honest evaluations, long-term career foresight, and meticulous logistical execution.",
    sportsApproach: "We take a holistic approach to player development: from technical profiling and tactical awareness to contract negotiation coordination, international network introductions, and life beyond the pitch.",
    travelApproach: "We provide seamless, lawful, and personalized guidance for international trips, tours, flights, and visa consultations tailored to athletes, business professionals, students, and families.",
    commitment: "Absolute client confidentiality, full transparency in communication, and uncompromising adherence to relevant regulatory and legal frameworks."
  },
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    databaseUrl: process.env.DATABASE_URL || '',
    enabled: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
    lastConnectedAt: undefined
  }
};

class DatabaseManager {
  private db: DatabaseSchema;

  constructor() {
    this.db = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Merge with defaults if new fields were added
        return {
          settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
          players: parsed.players || [],
          travelPackages: parsed.travelPackages || [],
          news: parsed.news || [],
          inquiries: parsed.inquiries || [],
          admins: parsed.admins || [],
          activityLogs: parsed.activityLogs || []
        };
      } catch (err) {
        console.error('Error parsing db.json, initializing fresh db:', err);
      }
    }

    // Default fresh DB with initial Admin user
    const salt = bcrypt.genSaltSync(10);
    const initialAdminPassword = 'Chamonvin2026!Admin';
    const initialAdmin: AdminUser = {
      id: 'admin-1',
      email: 'admin@chamonvin.com',
      name: 'Chamonvin Administrator',
      passwordHash: bcrypt.hashSync(initialAdminPassword, salt),
      role: 'Super Admin',
      createdAt: new Date().toISOString()
    };

    const initialData: DatabaseSchema = {
      settings: DEFAULT_SETTINGS,
      players: [], // strictly administrator-entered per prompt instructions
      travelPackages: [],
      news: [],
      inquiries: [],
      admins: [initialAdmin],
      activityLogs: [
        {
          id: 'log-1',
          action: 'System Initialized',
          adminEmail: 'system@chamonvin.com',
          details: 'CHAMONVIN LIMITED platform initialized with default settings and secure super administrator.',
          timestamp: new Date().toISOString()
        }
      ]
    };

    this.saveDatabase(initialData);
    return initialData;
  }

  public sync(): void {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.db = {
          settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
          players: parsed.players || [],
          travelPackages: parsed.travelPackages || [],
          news: parsed.news || [],
          inquiries: parsed.inquiries || [],
          admins: parsed.admins || [],
          activityLogs: parsed.activityLogs || []
        };
      } catch (err) {
        console.error('Error syncing db.json:', err);
      }
    }
  }

  public save(): void {
    this.saveDatabase(this.db);
  }

  private saveDatabase(data: DatabaseSchema): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write db.json:', err);
    }
  }

  public getRawDatabase(): DatabaseSchema {
    this.sync();
    return this.db;
  }

  public getSettings(): WebsiteSettings {
    return this.db.settings;
  }

  public updateSettings(partial: Partial<WebsiteSettings>): WebsiteSettings {
    this.db.settings = { ...this.db.settings, ...partial };
    this.save();
    return this.db.settings;
  }

  // Players
  public getPlayers(onlyPublished = false): PlayerProfile[] {
    this.sync();
    if (onlyPublished) {
      return this.db.players
        .filter((p) => p.isPublished)
        .map(({ internalScoutingNotes, ...publicData }) => publicData as PlayerProfile);
    }
    return this.db.players;
  }

  public getPlayerById(id: string, onlyPublished = false): PlayerProfile | undefined {
    this.sync();
    const player = this.db.players.find((p) => p.id === id);
    if (!player) return undefined;
    if (onlyPublished) {
      if (!player.isPublished) return undefined;
      const { internalScoutingNotes, ...publicData } = player;
      return publicData as PlayerProfile;
    }
    return player;
  }

  public savePlayer(playerData: Omit<PlayerProfile, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): PlayerProfile {
    this.sync();
    const now = new Date().toISOString();
    if (playerData.id) {
      const idx = this.db.players.findIndex((p) => p.id === playerData.id);
      if (idx !== -1) {
        const updated: PlayerProfile = {
          ...this.db.players[idx],
          ...playerData,
          id: playerData.id,
          updatedAt: now
        };
        this.db.players[idx] = updated;
        this.save();
        return updated;
      }
    }

    const newPlayer: PlayerProfile = {
      ...playerData,
      id: playerData.id || `player-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: now,
      updatedAt: now
    };
    this.db.players.unshift(newPlayer);
    this.save();
    return newPlayer;
  }

  public deletePlayer(id: string): boolean {
    this.sync();
    const initialLen = this.db.players.length;
    this.db.players = this.db.players.filter((p) => p.id !== id && p.fullName.trim().toLowerCase() !== id.trim().toLowerCase());
    if (this.db.players.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Travel Packages
  public getTravelPackages(onlyPublished = false): TravelPackage[] {
    this.sync();
    if (onlyPublished) {
      return this.db.travelPackages.filter((p) => p.isPublished);
    }
    return this.db.travelPackages;
  }

  public getTravelPackageById(id: string, onlyPublished = false): TravelPackage | undefined {
    this.sync();
    const pkg = this.db.travelPackages.find((p) => p.id === id);
    if (!pkg) return undefined;
    if (onlyPublished && !pkg.isPublished) return undefined;
    return pkg;
  }

  public saveTravelPackage(pkgData: Omit<TravelPackage, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): TravelPackage {
    this.sync();
    const now = new Date().toISOString();
    if (pkgData.id) {
      const idx = this.db.travelPackages.findIndex((p) => p.id === pkgData.id);
      if (idx !== -1) {
        const updated: TravelPackage = {
          ...this.db.travelPackages[idx],
          ...pkgData,
          id: pkgData.id,
          updatedAt: now
        };
        this.db.travelPackages[idx] = updated;
        this.save();
        return updated;
      }
    }

    const newPkg: TravelPackage = {
      ...pkgData,
      id: pkgData.id || `pkg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: now,
      updatedAt: now
    };
    this.db.travelPackages.unshift(newPkg);
    this.save();
    return newPkg;
  }

  public deleteTravelPackage(id: string): boolean {
    this.sync();
    const len = this.db.travelPackages.length;
    this.db.travelPackages = this.db.travelPackages.filter((p) => p.id !== id && p.title.trim().toLowerCase() !== id.trim().toLowerCase());
    if (this.db.travelPackages.length !== len) {
      this.save();
      return true;
    }
    return false;
  }

  // News
  public getNews(onlyPublished = false): NewsArticle[] {
    this.sync();
    if (onlyPublished) {
      return this.db.news.filter((n) => n.isPublished);
    }
    return this.db.news;
  }

  public getNewsById(id: string, onlyPublished = false): NewsArticle | undefined {
    this.sync();
    const item = this.db.news.find((n) => n.id === id);
    if (!item) return undefined;
    if (onlyPublished && !item.isPublished) return undefined;
    return item;
  }

  public saveNews(newsData: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): NewsArticle {
    this.sync();
    const now = new Date().toISOString();
    if (newsData.id) {
      const idx = this.db.news.findIndex((n) => n.id === newsData.id);
      if (idx !== -1) {
        const updated: NewsArticle = {
          ...this.db.news[idx],
          ...newsData,
          id: newsData.id,
          updatedAt: now
        };
        this.db.news[idx] = updated;
        this.save();
        return updated;
      }
    }

    const newArticle: NewsArticle = {
      ...newsData,
      id: newsData.id || `news-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: now,
      updatedAt: now
    };
    this.db.news.unshift(newArticle);
    this.save();
    return newArticle;
  }

  public deleteNews(id: string): boolean {
    this.sync();
    const len = this.db.news.length;
    this.db.news = this.db.news.filter((n) => n.id !== id && n.title.trim().toLowerCase() !== id.trim().toLowerCase());
    if (this.db.news.length !== len) {
      this.save();
      return true;
    }
    return false;
  }

  // Inquiries
  public getInquiries(filter?: { category?: string; status?: string; search?: string }): InquiryRecord[] {
    let result = [...this.db.inquiries];
    if (filter?.category && filter.category !== 'all') {
      result = result.filter((i) => i.category === filter.category);
    }
    if (filter?.status && filter.status !== 'all') {
      result = result.filter((i) => i.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (i) =>
          i.referenceNo.toLowerCase().includes(q) ||
          i.clientName.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q) ||
          (i.subject && i.subject.toLowerCase().includes(q))
      );
    }
    return result;
  }

  public getInquiryById(id: string): InquiryRecord | undefined {
    return this.db.inquiries.find((i) => i.id === id || i.referenceNo === id);
  }

  public createInquiry(category: InquiryCategory, clientName: string, email: string, phone: string, details: Record<string, any>, subject?: string): InquiryRecord {
    const prefixMap: Record<InquiryCategory, string> = {
      'player-representation': 'CHM-REP',
      'sports-management': 'CHM-SPT',
      'travel-tours': 'CHM-TRV',
      'visa-consultation': 'CHM-VSA',
      'flight-services': 'CHM-FLT',
      'general': 'CHM-GEN'
    };
    const prefix = prefixMap[category] || 'CHM-INQ';
    const year = new Date().getFullYear();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const referenceNo = `${prefix}-${year}-${randomDigits}`;

    const newInquiry: InquiryRecord = {
      id: `inq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      referenceNo,
      category,
      clientName,
      email,
      phone,
      subject,
      details,
      status: 'New',
      internalNotes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.db.inquiries.unshift(newInquiry);
    this.save();
    return newInquiry;
  }

  public updateInquiryStatus(id: string, status: InquiryStatus): boolean {
    const inq = this.db.inquiries.find((i) => i.id === id);
    if (inq) {
      inq.status = status;
      inq.updatedAt = new Date().toISOString();
      this.save();
      return true;
    }
    return false;
  }

  public addInquiryNote(id: string, text: string, author: string): boolean {
    const inq = this.db.inquiries.find((i) => i.id === id);
    if (inq) {
      inq.internalNotes.push({
        id: `note-${Date.now()}`,
        text,
        author,
        createdAt: new Date().toISOString()
      });
      inq.updatedAt = new Date().toISOString();
      this.save();
      return true;
    }
    return false;
  }

  public deleteInquiry(id: string): boolean {
    this.sync();
    const len = this.db.inquiries.length;
    this.db.inquiries = this.db.inquiries.filter((i) => i.id !== id && i.referenceNo !== id);
    if (this.db.inquiries.length !== len) {
      this.save();
      return true;
    }
    return false;
  }

  // Admins
  public findAdminByEmail(email: string): AdminUser | undefined {
    return this.db.admins.find((a) => a.email.toLowerCase() === email.toLowerCase());
  }

  public updateAdminPassword(email: string, newHash: string): boolean {
    const admin = this.findAdminByEmail(email);
    if (admin) {
      admin.passwordHash = newHash;
      this.save();
      return true;
    }
    return false;
  }

  public recordAdminLogin(email: string): void {
    const admin = this.findAdminByEmail(email);
    if (admin) {
      admin.lastLoginAt = new Date().toISOString();
      this.save();
    }
  }

  // Activity Logs
  public logActivity(action: string, adminEmail: string, details: string): void {
    const log: ActivityLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      adminEmail,
      details,
      timestamp: new Date().toISOString()
    };
    this.db.activityLogs.unshift(log);
    // Keep last 200 logs
    if (this.db.activityLogs.length > 200) {
      this.db.activityLogs = this.db.activityLogs.slice(0, 200);
    }
    this.save();
  }

  public getActivityLogs(): ActivityLog[] {
    return this.db.activityLogs;
  }

  // Dashboard Stats
  public getDashboardStats() {
    const totalPlayers = this.db.players.length;
    const publishedPlayers = this.db.players.filter((p) => p.isPublished).length;
    const draftPlayers = totalPlayers - publishedPlayers;

    const representationInquiries = this.db.inquiries.filter((i) => i.category === 'player-representation' && i.status === 'New').length;
    const generalInquiriesUnread = this.db.inquiries.filter((i) => i.category === 'general' && i.status === 'New').length;
    const travelVisaInquiries = this.db.inquiries.filter((i) => (i.category === 'travel-tours' || i.category === 'visa-consultation') && i.status === 'New').length;
    const flightInquiries = this.db.inquiries.filter((i) => i.category === 'flight-services' && i.status === 'New').length;

    const publishedNews = this.db.news.filter((n) => n.isPublished).length;
    const activePackages = this.db.travelPackages.filter((p) => p.isPublished).length;

    const recentInquiries = this.db.inquiries.slice(0, 5);
    const recentLogs = this.db.activityLogs.slice(0, 5);

    return {
      totalPlayers,
      publishedPlayers,
      draftPlayers,
      representationInquiries,
      generalInquiriesUnread,
      travelVisaInquiries,
      flightInquiries,
      publishedNews,
      activePackages,
      recentInquiries,
      recentLogs
    };
  }
}

export const dbManager = new DatabaseManager();
