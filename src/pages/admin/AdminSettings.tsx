import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';
import { useRouter } from '../../context/RouterContext';
import {
  Settings,
  Lock,
  Building,
  FileText,
  Shield,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Globe,
  Database,
  Key,
  RefreshCw,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  HelpCircle,
  Server,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';
import { WebsiteSettings, ActivityLog } from '../../types';

export const AdminSettings: React.FC = () => {
  const { authFetch, admin } = useAuth();
  const { refreshConfig } = useConfig();
  const { currentPath } = useRouter();

  const [activeTab, setActiveTab] = useState<'company' | 'content' | 'supabase' | 'security' | 'logs'>(() => {
    try {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      if (params.get('tab') === 'supabase') return 'supabase';
    } catch {
      // ignore
    }
    return 'company';
  });

  useEffect(() => {
    try {
      const search = currentPath.includes('?') ? currentPath.split('?')[1] : window.location.search;
      const params = new URLSearchParams(search);
      const tabParam = params.get('tab');
      if (
        tabParam === 'supabase' ||
        tabParam === 'company' ||
        tabParam === 'content' ||
        tabParam === 'security' ||
        tabParam === 'logs'
      ) {
        setActiveTab(tabParam as any);
      }
    } catch {
      // ignore
    }
  }, [currentPath]);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Supabase states
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState<{
    success: boolean;
    message: string;
    url?: string;
    tableCounts?: Record<string, number | null>;
    error?: string;
    details?: string;
  } | null>(null);
  const [syncingSupabase, setSyncingSupabase] = useState(false);
  const [supabaseSyncResult, setSupabaseSyncResult] = useState<{
    success: boolean;
    message: string;
    synced?: Record<string, number>;
    errors?: string[];
  } | null>(null);
  const [showAnonKey, setShowAnonKey] = useState(false);
  const [showServiceKey, setShowServiceKey] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [settingsRes, logsRes] = await Promise.all([
          authFetch('/api/admin/settings'),
          authFetch('/api/admin/logs')
        ]);

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          setSettings({
            ...data,
            supabase: data.supabase || {
              url: '',
              anonKey: '',
              serviceKey: '',
              databaseUrl: '',
              enabled: false
            }
          });
        }
        if (logsRes.ok) {
          const logData = await logsRes.json();
          setLogs(logData);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await authFetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSaveSuccess(true);
        await refreshConfig();
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error updating settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleTestSupabase = async () => {
    if (!settings?.supabase?.url) {
      setSupabaseTestResult({
        success: false,
        message: 'Please provide your Supabase Project URL (e.g. https://your-ref.supabase.co).'
      });
      return;
    }
    if (!settings?.supabase?.anonKey && !settings?.supabase?.serviceKey) {
      setSupabaseTestResult({
        success: false,
        message: 'Please provide at least one Supabase API Key (Anon Public Key or Service Role Key).'
      });
      return;
    }

    setTestingSupabase(true);
    setSupabaseTestResult(null);
    try {
      const res = await authFetch('/api/admin/supabase/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: settings.supabase.url,
          anonKey: settings.supabase.anonKey,
          serviceKey: settings.supabase.serviceKey
        })
      });
      const data = await res.json();
      setSupabaseTestResult(data);
      if (data.success) {
        setSettings((prev) =>
          prev
            ? {
                ...prev,
                supabase: {
                  ...prev.supabase!,
                  lastConnectedAt: new Date().toISOString()
                }
              }
            : null
        );
      }
    } catch (err: any) {
      setSupabaseTestResult({
        success: false,
        message: err.message || 'Failed to reach backend to test Supabase connection.'
      });
    } finally {
      setTestingSupabase(false);
    }
  };

  const handleSyncToSupabase = async () => {
    setSyncingSupabase(true);
    setSupabaseSyncResult(null);
    try {
      const res = await authFetch('/api/admin/supabase/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: settings?.supabase?.url,
          anonKey: settings?.supabase?.anonKey,
          serviceKey: settings?.supabase?.serviceKey
        })
      });
      const data = await res.json();
      setSupabaseSyncResult(data);
    } catch (err: any) {
      setSupabaseSyncResult({
        success: false,
        message: err.message || 'Network error during Supabase synchronization.'
      });
    } finally {
      setSyncingSupabase(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await authFetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordSuccess('Password successfully updated.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(data.error || 'Failed to update password');
      }
    } catch (err) {
      setPasswordError('Network error');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading || !settings) {
    return (
      <AdminLayout activeTab="settings">
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
          <span className="text-xs text-slate-500">Loading settings...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="settings">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              System Configuration
            </span>
            <h1 className="text-2xl font-heading font-extrabold text-slate-950 mt-1">
              Content, Company & Security Settings
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Update contact information, About Us company text, administrator password, and review audit logs.
            </p>
          </div>

          {saveSuccess && (
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span>Settings Saved & Live!</span>
            </span>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('company')}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              activeTab === 'company'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Company & Contact
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              activeTab === 'content'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            About Us Statements
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'supabase'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span>Supabase & Database</span>
            {settings.supabase?.url ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block ml-0.5" title="Supabase URL Configured" />
            ) : (
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded text-[9px] font-extrabold uppercase">
                Input Links
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              activeTab === 'security'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Admin Security & Password
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              activeTab === 'logs'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Audit Logs ({logs.length})
          </button>
        </div>

        {/* TAB 1: COMPANY SETTINGS */}
        {activeTab === 'company' && (
          <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <h3 className="font-heading font-bold text-base text-slate-950 pb-3 border-b border-slate-100">
              Company Identity & Public Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Registered Name</label>
                <input
                  type="text"
                  required
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Business Email Address</label>
                <input
                  type="email"
                  required
                  value={settings.contact.email}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, email: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Telephone Contact Number</label>
                <input
                  type="text"
                  required
                  value={settings.contact.phone}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, phone: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">WhatsApp Line</label>
                <input
                  type="text"
                  required
                  value={settings.contact.whatsapp}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, whatsapp: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Headquarters & Office Address</label>
                <input
                  type="text"
                  required
                  value={settings.contact.officeAddress}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, officeAddress: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Business Working Hours</label>
                <input
                  type="text"
                  required
                  value={settings.contact.businessHours}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, businessHours: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Company Details</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: CONTENT MANAGEMENT */}
        {activeTab === 'content' && (
          <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-xs">
            <h3 className="font-heading font-bold text-base text-slate-950 pb-3 border-b border-slate-100">
              About Us Statements & Company Philosophy
            </h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Overview</label>
              <textarea
                rows={5}
                value={settings.about.overview}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    about: { ...settings.about, overview: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mission Statement</label>
                <textarea
                  rows={3}
                  value={settings.about.mission}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      about: { ...settings.about, mission: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vision Statement</label>
                <textarea
                  rows={3}
                  value={settings.about.vision}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      about: { ...settings.about, vision: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sports Management Approach</label>
                <textarea
                  rows={3}
                  value={settings.about.sportsApproach}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      about: { ...settings.about, sportsApproach: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Travel & Visa Approach</label>
                <textarea
                  rows={3}
                  value={settings.about.travelApproach}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      about: { ...settings.about, travelApproach: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Commitment to Confidentiality</label>
              <textarea
                rows={2}
                value={settings.about.commitment}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    about: { ...settings.about, commitment: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save About Statements</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: SUPABASE DATABASE CONFIGURATION */}
        {activeTab === 'supabase' && (
          <div className="space-y-6">
            {/* Guide & Walkthrough Card */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-emerald-800/40 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold uppercase">
                        Supabase PostgreSQL Integration
                      </span>
                      <h3 className="font-heading font-extrabold text-xl text-white">
                        Connect Your Supabase Project
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {settings.supabase?.url ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Supabase Configured</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Awaiting Credentials</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                  Paste the project links and API keys you copied from your Supabase dashboard below.
                  This links your player directory, inquiries, tour packages, news articles, and website configuration directly with your Supabase database.
                </p>

                {/* Where to find your links guide */}
                <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 text-xs text-slate-300 space-y-2">
                  <div className="font-bold text-white flex items-center gap-1.5 mb-1 text-sm">
                    <HelpCircle className="w-4 h-4 text-emerald-400" />
                    <span>Where to find these links in your Supabase Dashboard:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
                    <li>
                      Log into your Supabase Dashboard at{' '}
                      <a
                        href="https://supabase.com/dashboard"
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 underline font-medium hover:text-emerald-300 inline-flex items-center gap-0.5"
                      >
                        <span>supabase.com/dashboard</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                    <li>
                      In the bottom of the left sidebar, click the <strong>Project Settings (gear icon)</strong>, then select <strong>API</strong> (or <strong>Data API</strong>).
                    </li>
                    <li>
                      Under <strong>Project URL</strong>, copy the link (looks like <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-300 font-mono">https://xyzcompany.supabase.co</code>) and paste it into the <strong>Supabase Project URL</strong> field below.
                    </li>
                    <li>
                      Under <strong>Project API keys</strong>, copy the key labeled <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-300 font-mono">anon public</code> (starts with <code className="text-slate-400">eyJhbGci...</code>) and paste it into the <strong>Supabase Anon / Public Key</strong> field.
                    </li>
                    <li>
                      <em>(Optional)</em> In the same section, copy <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-300 font-mono">service_role secret</code> and paste into <strong>Service Role Key</strong> to grant backend admin sync permissions.
                    </li>
                    <li>
                      <em>(Optional)</em> Under <strong>Project Settings → Database → Connection string (URI)</strong>, copy the database connection string.
                    </li>
                    <li>
                      Click <strong>Test Connection</strong> to verify your database connection in real time!
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Test Connection Banner Display */}
            {supabaseTestResult && (
              <div
                className={`p-5 rounded-2xl border text-xs leading-relaxed transition-all ${
                  supabaseTestResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-red-50 border-red-200 text-red-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  {supabaseTestResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-2 flex-1">
                    <div className="font-bold text-sm">
                      {supabaseTestResult.success
                        ? 'Supabase Connection Verified Successfully!'
                        : 'Supabase Connection Test Failed'}
                    </div>
                    <p>{supabaseTestResult.message}</p>
                    {supabaseTestResult.details && (
                      <p className="text-[11px] opacity-80">{supabaseTestResult.details}</p>
                    )}

                    {/* Discovered table breakdown */}
                    {supabaseTestResult.tableCounts && (
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                        {Object.entries(supabaseTestResult.tableCounts).map(([tbl, count]) => (
                          <div
                            key={tbl}
                            className="bg-white/80 p-2.5 rounded-lg border border-emerald-200/80 text-center"
                          >
                            <span className="block font-bold text-emerald-900 capitalize text-[11px]">
                              {tbl.replace(/([A-Z])/g, ' $1')}
                            </span>
                            <span className="text-xs font-mono font-extrabold text-slate-800">
                              {count !== null ? `${count} rows` : 'Ready'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Sync Result Banner */}
            {supabaseSyncResult && (
              <div
                className={`p-5 rounded-2xl border text-xs leading-relaxed transition-all ${
                  supabaseSyncResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  <UploadCloud className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold text-sm">
                      {supabaseSyncResult.success ? 'Data Synchronization Succeeded' : 'Data Sync Warnings'}
                    </div>
                    <p>{supabaseSyncResult.message}</p>
                    {supabaseSyncResult.synced && (
                      <div className="text-[11px] font-mono text-emerald-800 pt-1">
                        Synced: {supabaseSyncResult.synced.players} players, {supabaseSyncResult.synced.travelPackages} packages, {supabaseSyncResult.synced.newsArticles} news items, {supabaseSyncResult.synced.settings} settings.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Input Form for Supabase Credentials */}
            <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-heading font-bold text-base text-slate-950 flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-600" />
                  <span>Supabase Credentials & Connection Settings</span>
                </h3>
                <span className="text-[11px] text-slate-400">
                  Securely saved to system configuration
                </span>
              </div>

              {/* Input 1: Supabase Project URL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700 text-xs">
                    Supabase Project URL <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Found in Supabase → Project Settings → API
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Server className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    required
                    placeholder="https://your-project-id.supabase.co"
                    value={settings.supabase?.url || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        supabase: {
                          ...(settings.supabase || {
                            anonKey: '',
                            serviceKey: '',
                            databaseUrl: '',
                            enabled: true
                          }),
                          url: e.target.value.trim()
                        }
                      })
                    }
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-xs text-slate-900"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Your project REST endpoint URL (e.g.{' '}
                  <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">
                    https://abcdefghijklmn.supabase.co
                  </code>
                  ).
                </p>
              </div>

              {/* Input 2: Supabase Anon / Public API Key */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700 text-xs">
                    Supabase Anon / Public API Key <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    anon public
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type={showAnonKey ? 'text' : 'password'}
                    required
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={settings.supabase?.anonKey || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        supabase: {
                          ...(settings.supabase || {
                            url: '',
                            serviceKey: '',
                            databaseUrl: '',
                            enabled: true
                          }),
                          anonKey: e.target.value.trim()
                        }
                      })
                    }
                    className="w-full pl-9 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-xs text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAnonKey(!showAnonKey)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showAnonKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  The client-safe public anonymous token used for querying players and publicly listed services.
                </p>
              </div>

              {/* Input 3: Supabase Service Role Key (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700 text-xs">
                    Supabase Service Role Key <span className="text-slate-400 font-normal">(Optional for Admin Sync)</span>
                  </label>
                  <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded">
                    service_role secret
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <input
                    type={showServiceKey ? 'text' : 'password'}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Optional)"
                    value={settings.supabase?.serviceKey || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        supabase: {
                          ...(settings.supabase || {
                            url: '',
                            anonKey: '',
                            databaseUrl: '',
                            enabled: true
                          }),
                          serviceKey: e.target.value.trim()
                        }
                      })
                    }
                    className="w-full pl-9 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-xs text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowServiceKey(!showServiceKey)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showServiceKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Enables elevated server-side synchronization that bypasses Row Level Security when updating the catalog.
                </p>
              </div>

              {/* Input 4: Direct PostgreSQL Database URL (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700 text-xs">
                    PostgreSQL Connection String / URI <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Supabase → Database → Connection string (URI)
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Database className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
                    value={settings.supabase?.databaseUrl || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        supabase: {
                          ...(settings.supabase || {
                            url: '',
                            anonKey: '',
                            serviceKey: '',
                            enabled: true
                          }),
                          databaseUrl: e.target.value.trim()
                        }
                      })
                    }
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-xs text-slate-900"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Direct connection URL if connecting via Node-pg or direct migrations.
                </p>
              </div>

              {/* Toggle: Enable Supabase Active Connection */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900 text-xs block">
                    Enable Supabase Synchronization
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Keep local catalog and public website synced with Supabase.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.supabase?.enabled !== false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        supabase: {
                          ...(settings.supabase || {
                            url: '',
                            anonKey: '',
                            serviceKey: '',
                            databaseUrl: ''
                          }),
                          enabled: e.target.checked
                        }
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestSupabase}
                    disabled={testingSupabase}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testingSupabase ? 'animate-spin' : ''}`} />
                    <span>{testingSupabase ? 'Testing Connection...' : 'Test Connection'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSyncToSupabase}
                    disabled={syncingSupabase || !settings.supabase?.url}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200 font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <UploadCloud className={`w-3.5 h-3.5 ${syncingSupabase ? 'animate-spin' : ''}`} />
                    <span>{syncingSupabase ? 'Syncing...' : 'Sync Local Data to Supabase'}</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>

            {/* SQL Schema helper box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-xs text-slate-600 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>Database Tables & SQL Schema File</span>
                </div>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-mono px-2 py-0.5 rounded">
                  /supabase_schema.sql
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                We have generated a production-ready PostgreSQL SQL script for your project containing all the required tables (<code className="font-mono text-emerald-700 font-bold">players</code>, <code className="font-mono text-emerald-700 font-bold">travel_packages</code>, <code className="font-mono text-emerald-700 font-bold">news_articles</code>, <code className="font-mono text-emerald-700 font-bold">inquiries</code>, <code className="font-mono text-emerald-700 font-bold">settings</code>), along with Row Level Security (RLS) policies and performance indexes.
              </p>
              <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 flex items-center justify-between">
                <span>supabase_schema.sql located in project root</span>
                <span className="text-emerald-600 font-bold">Ready in Project Root</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ADMIN SECURITY & PASSWORD */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-xl">
            <h3 className="font-heading font-bold text-base text-slate-950 pb-3 border-b border-slate-100 mb-4">
              Update Administrator Password
            </h3>

            {passwordSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2 mb-4">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Password (min 8 chars) *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                >
                  {changingPassword ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>Change Password</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-950 pb-3 border-b border-slate-100">
              System Administrative Audit Trail
            </h3>
            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <strong className="text-slate-900">{log.action}</strong>
                      <span className="font-mono text-[10px] text-emerald-700">{log.adminEmail}</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
