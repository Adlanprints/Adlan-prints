import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { dbManager, InquiryCategory, InquiryStatus } from './server/db.js';
import { generateToken, requireAdmin, AuthenticatedRequest } from './server/auth.js';
import {
  testSupabaseConnection,
  syncLocalDataToSupabase,
  getPublishedPlayersFromSupabase,
  getAllPlayersFromSupabase,
  getPlayerByIdFromSupabase,
  upsertPlayerInSupabase,
  deletePlayerFromSupabase,
  getPublishedTravelPackagesFromSupabase,
  getAllTravelPackagesFromSupabase,
  getTravelPackageByIdFromSupabase,
  upsertTravelPackageInSupabase,
  deleteTravelPackageFromSupabase,
  getPublishedNewsFromSupabase,
  getAllNewsFromSupabase,
  getNewsByIdFromSupabase,
  upsertNewsInSupabase,
  deleteNewsFromSupabase,
  getSettingsFromSupabase,
  upsertSettingsInSupabase,
  insertInquiryToSupabase,
  updateInquiryInSupabase,
  deleteInquiryFromSupabase
} from './server/supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Body parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads directory
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Multer storage for persistent file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${Date.now()}_${cleanName}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg|gif/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mime = file.mimetype.toLowerCase();
    if (allowed.test(ext) && (mime.startsWith('image/') || mime === 'image/svg+xml')) {
      cb(null, true);
    } else {
      cb(new Error('Only valid image files (JPG, PNG, WebP, SVG, GIF) are allowed.'));
    }
  }
});

// ==========================================
// PUBLIC API ROUTES
// ==========================================

// Get public website configuration & settings
app.get('/api/public/config', async (_req: Request, res: Response) => {
  const settings = dbManager.getSettings();
  try {
    const supabaseSettings = await getSettingsFromSupabase(settings);
    if (supabaseSettings) {
      res.json(supabaseSettings);
      return;
    }
  } catch (err) {
    console.warn('Supabase settings query failed, using local:', err);
  }

  res.json({
    companyName: settings.companyName,
    logoUrl: settings.logoUrl,
    logoType: settings.logoType,
    heroSlider: settings.heroSlider,
    heroTagline: settings.heroTagline,
    heroButtons: settings.heroButtons,
    contact: settings.contact,
    about: settings.about
  });
});

// Get published players
app.get('/api/public/players', async (_req: Request, res: Response) => {
  try {
    const supabasePlayers = await getPublishedPlayersFromSupabase();
    if (supabasePlayers !== null && supabasePlayers.length > 0) {
      res.json(supabasePlayers);
      return;
    }
  } catch (err) {
    console.warn('Supabase players query failed, using local:', err);
  }
  const players = dbManager.getPlayers(true);
  res.json(players);
});

// Get single published player
app.get('/api/public/players/:id', async (req: Request, res: Response) => {
  try {
    const supabasePlayer = await getPlayerByIdFromSupabase(req.params.id);
    if (supabasePlayer) {
      res.json(supabasePlayer);
      return;
    }
  } catch (err) {
    // fallback
  }
  const player = dbManager.getPlayerById(req.params.id, true);
  if (!player) {
    res.status(404).json({ error: 'Player profile not found or currently unpublished.' });
    return;
  }
  res.json(player);
});

// Get published travel packages
app.get('/api/public/travel-packages', async (_req: Request, res: Response) => {
  try {
    const supabasePackages = await getPublishedTravelPackagesFromSupabase();
    if (supabasePackages !== null && supabasePackages.length > 0) {
      res.json(supabasePackages);
      return;
    }
  } catch (err) {
    console.warn('Supabase travel packages query failed, using local:', err);
  }
  const packages = dbManager.getTravelPackages(true);
  res.json(packages);
});

// Get single travel package
app.get('/api/public/travel-packages/:id', async (req: Request, res: Response) => {
  try {
    const supabasePkg = await getTravelPackageByIdFromSupabase(req.params.id);
    if (supabasePkg) {
      res.json(supabasePkg);
      return;
    }
  } catch (err) {
    // fallback
  }
  const pkg = dbManager.getTravelPackageById(req.params.id, true);
  if (!pkg) {
    res.status(404).json({ error: 'Travel package not found.' });
    return;
  }
  res.json(pkg);
});

// Get published news
app.get('/api/public/news', async (_req: Request, res: Response) => {
  try {
    const supabaseNews = await getPublishedNewsFromSupabase();
    if (supabaseNews !== null && supabaseNews.length > 0) {
      res.json(supabaseNews);
      return;
    }
  } catch (err) {
    console.warn('Supabase news query failed, using local:', err);
  }
  const news = dbManager.getNews(true);
  res.json(news);
});

// Get single news article
app.get('/api/public/news/:id', async (req: Request, res: Response) => {
  try {
    const supabaseArticle = await getNewsByIdFromSupabase(req.params.id);
    if (supabaseArticle) {
      res.json(supabaseArticle);
      return;
    }
  } catch (err) {
    // fallback
  }
  const article = dbManager.getNewsById(req.params.id, true);
  if (!article) {
    res.status(404).json({ error: 'News article not found.' });
    return;
  }
  res.json(article);
});

// Submit client inquiry (Public)
app.post('/api/public/inquiries', async (req: Request, res: Response) => {
  try {
    const { category, clientName, email, phone, details, subject, privacyConsent } = req.body;

    if (!privacyConsent) {
      res.status(400).json({ error: 'You must consent to our privacy policy to proceed.' });
      return;
    }

    if (!clientName || !clientName.trim()) {
      res.status(400).json({ error: 'Full name is required.' });
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'A valid email address is required.' });
      return;
    }

    if (!phone || phone.trim().length < 5) {
      res.status(400).json({ error: 'A valid phone or WhatsApp number is required.' });
      return;
    }

    const validCategories: InquiryCategory[] = [
      'player-representation',
      'sports-management',
      'travel-tours',
      'visa-consultation',
      'flight-services',
      'general'
    ];
    const chosenCat: InquiryCategory = validCategories.includes(category) ? category : 'general';

    const saved = dbManager.createInquiry(
      chosenCat,
      clientName.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      details || {},
      subject ? subject.trim() : undefined
    );

    // Also forward to Supabase inquiries table asynchronously
    insertInquiryToSupabase(saved).catch((e) =>
      console.warn('Asynchronous Supabase inquiry insert failed:', e)
    );

    res.status(201).json({
      success: true,
      referenceNo: saved.referenceNo,
      message: 'Inquiry received. A representative will contact you within 24 business hours.'
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to process inquiry submission.' });
  }
});

// ==========================================
// SECURE ADMIN ROUTES
// ==========================================

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const admin = dbManager.findAdminByEmail(email);
    if (!admin) {
      res.status(401).json({ error: 'Invalid email credentials or account does not exist.' });
      return;
    }

    const isMatch = bcrypt.compareSync(password, admin.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
      return;
    }

    dbManager.recordAdminLogin(admin.email);
    dbManager.logActivity('Admin Login', admin.email, `Successful sign in from IP ${req.ip || 'local'}`);

    const token = generateToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    });

    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Authentication service unavailable.' });
  }
});

// Verify current session
app.get('/api/admin/me', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.json({ admin: req.admin });
});

// Admin change password
app.post('/api/admin/change-password', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current password and new password are required.' });
      return;
    }
    if (newPassword.length < 8) {
      res.status(400).json({ error: 'New password must be at least 8 characters long.' });
      return;
    }

    const admin = dbManager.findAdminByEmail(req.admin!.email);
    if (!admin) {
      res.status(404).json({ error: 'Administrator account not found.' });
      return;
    }

    const isMatch = bcrypt.compareSync(currentPassword, admin.passwordHash);
    if (!isMatch) {
      res.status(400).json({ error: 'Current password does not match records.' });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPassword, salt);
    dbManager.updateAdminPassword(admin.email, newHash);
    dbManager.logActivity('Password Changed', admin.email, 'Administrator updated their security credentials.');

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update password.' });
  }
});

// Admin stats overview
app.get('/api/admin/stats', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const stats = dbManager.getDashboardStats();
  res.json(stats);
});

// Image upload
app.post('/api/admin/upload', requireAdmin, upload.single('file'), (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No image file was uploaded or file type is unsupported.' });
    return;
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  dbManager.logActivity(
    'File Uploaded',
    req.admin?.email || 'admin',
    `Uploaded ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB)`
  );

  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size
  });
});

// Admin settings
app.get('/api/admin/settings', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  res.json(dbManager.getSettings());
});

app.put('/api/admin/settings', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = dbManager.updateSettings(req.body);
    dbManager.logActivity('Settings Updated', req.admin?.email || 'admin', 'Website appearance and configuration updated.');
    upsertSettingsInSupabase(updated).catch(e => console.warn('Supabase settings auto-sync warning:', e));
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save settings.' });
  }
});

// Test Supabase connection
app.post('/api/admin/supabase/test', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { url, anonKey, serviceKey } = req.body;
    const targetKey = serviceKey || anonKey;
    const result = await testSupabaseConnection(url, targetKey);
    if (result.success) {
      dbManager.logActivity('Supabase Verified', req.admin?.email || 'admin', `Successfully verified connection to Supabase project.`);
    }
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to test connection' });
  }
});

// Sync local database to Supabase
app.post('/api/admin/supabase/sync', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const settings = dbManager.getSettings();
    const targetUrl = req.body.url || settings.supabase?.url || process.env.SUPABASE_URL;
    const targetKey =
      req.body.serviceKey ||
      req.body.anonKey ||
      settings.supabase?.serviceKey ||
      settings.supabase?.anonKey ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY;

    if (!targetUrl || !targetKey) {
      res.status(400).json({ error: 'Supabase Project URL and API Key are required to sync.' });
      return;
    }

    const rawDb = dbManager.getRawDatabase();
    const syncResult = await syncLocalDataToSupabase(targetUrl, targetKey, {
      settings: rawDb.settings,
      players: rawDb.players,
      travelPackages: rawDb.travelPackages,
      news: rawDb.news,
      inquiries: rawDb.inquiries
    });

    dbManager.logActivity('Supabase Data Synced', req.admin?.email || 'admin', 'Synchronized catalog and configuration data to Supabase.');
    res.json(syncResult);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to sync data' });
  }
});

// Admin players management (Synchronized with Supabase)
app.get('/api/admin/players', requireAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const supabasePlayers = await getAllPlayersFromSupabase();
    if (supabasePlayers !== null && supabasePlayers.length > 0) {
      res.json(supabasePlayers);
      return;
    }
  } catch (err) {
    console.warn('Supabase admin players fetch error, fallback to local:', err);
  }
  res.json(dbManager.getPlayers(false));
});

app.post('/api/admin/players', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const player = dbManager.savePlayer(req.body);
    dbManager.logActivity('Player Added', req.admin?.email || 'admin', `Added player profile: ${player.fullName}`);
    // Auto-sync write to Supabase immediately
    upsertPlayerInSupabase(player).catch(e => console.warn('Supabase player auto-sync warning:', e));
    res.status(201).json(player);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create player.' });
  }
});

app.put('/api/admin/players/:id', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const player = dbManager.savePlayer({ ...req.body, id: req.params.id });
    dbManager.logActivity('Player Updated', req.admin?.email || 'admin', `Updated player profile: ${player.fullName}`);
    // Auto-sync update to Supabase immediately
    upsertPlayerInSupabase(player).catch(e => console.warn('Supabase player auto-sync warning:', e));
    res.json(player);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update player.' });
  }
});

app.delete('/api/admin/players/:id', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const player = dbManager.getPlayerById(req.params.id);
  const success = dbManager.deletePlayer(req.params.id);
  if (success) {
    dbManager.logActivity('Player Deleted', req.admin?.email || 'admin', `Deleted player with ID: ${req.params.id}`);
    deletePlayerFromSupabase(req.params.id, player?.fullName).catch(e => console.warn('Supabase player delete warning:', e));
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Player not found.' });
  }
});

// Admin Travel Packages (Synchronized with Supabase)
app.get('/api/admin/travel-packages', requireAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const supabasePackages = await getAllTravelPackagesFromSupabase();
    if (supabasePackages !== null && supabasePackages.length > 0) {
      res.json(supabasePackages);
      return;
    }
  } catch (err) {
    console.warn('Supabase admin travel packages fetch error, fallback to local:', err);
  }
  res.json(dbManager.getTravelPackages(false));
});

app.post('/api/admin/travel-packages', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const pkg = dbManager.saveTravelPackage(req.body);
    dbManager.logActivity('Travel Package Created', req.admin?.email || 'admin', `Created package: ${pkg.title}`);
    upsertTravelPackageInSupabase(pkg).catch(e => console.warn('Supabase travel package sync warning:', e));
    res.status(201).json(pkg);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create travel package.' });
  }
});

app.put('/api/admin/travel-packages/:id', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const pkg = dbManager.saveTravelPackage({ ...req.body, id: req.params.id });
    dbManager.logActivity('Travel Package Updated', req.admin?.email || 'admin', `Updated package: ${pkg.title}`);
    upsertTravelPackageInSupabase(pkg).catch(e => console.warn('Supabase travel package sync warning:', e));
    res.json(pkg);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update travel package.' });
  }
});

app.delete('/api/admin/travel-packages/:id', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const pkg = dbManager.getTravelPackageById(req.params.id);
  const success = dbManager.deleteTravelPackage(req.params.id);
  if (success) {
    dbManager.logActivity('Travel Package Deleted', req.admin?.email || 'admin', `Deleted travel package ID: ${req.params.id}`);
    deleteTravelPackageFromSupabase(req.params.id, pkg?.title).catch(e => console.warn('Supabase travel package delete warning:', e));
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Travel package not found.' });
  }
});

// Admin News (Synchronized with Supabase)
app.get('/api/admin/news', requireAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const supabaseNews = await getAllNewsFromSupabase();
    if (supabaseNews !== null && supabaseNews.length > 0) {
      res.json(supabaseNews);
      return;
    }
  } catch (err) {
    console.warn('Supabase admin news fetch error, fallback to local:', err);
  }
  res.json(dbManager.getNews(false));
});

app.post('/api/admin/news', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const article = dbManager.saveNews(req.body);
    dbManager.logActivity('News Published/Drafted', req.admin?.email || 'admin', `Saved news article: ${article.title}`);
    upsertNewsInSupabase(article).catch(e => console.warn('Supabase news sync warning:', e));
    res.status(201).json(article);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save news article.' });
  }
});

app.put('/api/admin/news/:id', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const article = dbManager.saveNews({ ...req.body, id: req.params.id });
    dbManager.logActivity('News Updated', req.admin?.email || 'admin', `Updated news article: ${article.title}`);
    upsertNewsInSupabase(article).catch(e => console.warn('Supabase news sync warning:', e));
    res.json(article);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update news article.' });
  }
});

app.delete('/api/admin/news/:id', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const article = dbManager.getNewsById(req.params.id);
  const success = dbManager.deleteNews(req.params.id);
  if (success) {
    dbManager.logActivity('News Deleted', req.admin?.email || 'admin', `Deleted news article ID: ${req.params.id}`);
    deleteNewsFromSupabase(req.params.id, article?.title).catch(e => console.warn('Supabase news delete warning:', e));
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'News article not found.' });
  }
});

// Admin Inquiries
app.get('/api/admin/inquiries', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { category, status, search } = req.query;
  const list = dbManager.getInquiries({
    category: category as string,
    status: status as string,
    search: search as string
  });
  res.json(list);
});

app.get('/api/admin/inquiries/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const item = dbManager.getInquiryById(req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Inquiry record not found.' });
    return;
  }
  res.json(item);
});

app.patch('/api/admin/inquiries/:id/status', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.body;
  const inq = dbManager.getInquiryById(req.params.id);
  const success = dbManager.updateInquiryStatus(req.params.id, status as InquiryStatus);
  if (success) {
    dbManager.logActivity(
      'Inquiry Status Changed',
      req.admin?.email || 'admin',
      `Inquiry ${req.params.id} updated to status "${status}"`
    );
    if (inq?.referenceNo) {
      updateInquiryInSupabase(inq.referenceNo, { status }).catch(e => console.warn('Supabase inquiry update warning:', e));
    }
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Inquiry not found.' });
  }
});

app.post('/api/admin/inquiries/:id/notes', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    res.status(400).json({ error: 'Note text cannot be empty.' });
    return;
  }
  const success = dbManager.addInquiryNote(req.params.id, text.trim(), req.admin?.name || req.admin?.email || 'Admin');
  if (success) {
    dbManager.logActivity('Internal Note Added', req.admin?.email || 'admin', `Added private note on inquiry ${req.params.id}`);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Inquiry not found.' });
  }
});

app.delete('/api/admin/inquiries/:id', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const inq = dbManager.getInquiryById(req.params.id);
  const success = dbManager.deleteInquiry(req.params.id);
  if (success) {
    dbManager.logActivity('Inquiry Deleted', req.admin?.email || 'admin', `Deleted inquiry ${req.params.id}`);
    if (inq?.referenceNo) {
      deleteInquiryFromSupabase(inq.referenceNo).catch(e => console.warn('Supabase inquiry delete warning:', e));
    }
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Inquiry not found.' });
  }
});

// Admin audit logs
app.get('/api/admin/logs', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  res.json(dbManager.getActivityLogs());
});

// ==========================================
// VITE / STATIC PRODUCTION SERVING
// ==========================================
async function startServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, port: Number(PORT) },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
  });
}

startServer();
