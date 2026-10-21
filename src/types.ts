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
    interval: number;
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
  role: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  adminEmail: string;
  details: string;
  timestamp: string;
}

export interface DashboardStats {
  totalPlayers: number;
  publishedPlayers: number;
  draftPlayers: number;
  representationInquiries: number;
  generalInquiriesUnread: number;
  travelVisaInquiries: number;
  flightInquiries: number;
  publishedNews: number;
  activePackages: number;
  recentInquiries: InquiryRecord[];
  recentLogs: ActivityLog[];
}
