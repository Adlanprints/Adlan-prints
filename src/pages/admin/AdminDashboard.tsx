import React, { useEffect, useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { AdminLayout } from './AdminLayout';
import {
  Users,
  Inbox,
  Plane,
  Compass,
  FileText,
  Image,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  UserPlus,
  PlusCircle,
  RefreshCw,
  Send,
  Database
} from 'lucide-react';
import { DashboardStats, InquiryRecord, ActivityLog } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { navigate } = useRouter();
  const { authFetch } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AdminLayout activeTab="dashboard">
      <div className="space-y-8">
        {/* Top Welcome & Actions Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Administrative Command Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-950 mt-1">
              CHAMONVIN Dashboard Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live database figures, recent client inquiries, and quick management shortcuts.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchStats}
              title="Refresh database figures"
              className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => navigate('/admin/inquiries')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Inbox className="w-4 h-4" />
              <span>Review Inquiries</span>
            </button>
          </div>
        </div>

        {/* Live Real Database Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Player Profiles */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Total Players
              </span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-950">
              {stats?.totalPlayers ?? 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
              <span className="text-emerald-600 font-semibold">{stats?.publishedPlayers ?? 0} Published</span>
              <span>•</span>
              <span className="text-slate-400">{stats?.draftPlayers ?? 0} Drafts</span>
            </div>
          </div>

          {/* Card 2: Player Representation Inquiries */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                New Player Inquiries
              </span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <UserPlus className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-950">
              {stats?.representationInquiries ?? 0}
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              Awaiting scouting evaluation
            </span>
          </div>

          {/* Card 3: Travel & Visa Inquiries */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Travel & Visa Inquiries
              </span>
              <div className="p-2 rounded-lg bg-slate-100 text-slate-800">
                <Compass className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-950">
              {stats?.travelVisaInquiries ?? 0}
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              New itinerary & visa leads
            </span>
          </div>

          {/* Card 4: Flight Inquiries */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Flight Inquiries
              </span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Plane className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-950">
              {stats?.flightInquiries ?? 0}
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              Pending routing requests
            </span>
          </div>

          {/* Card 5: Unread General Inquiries */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                General Inquiries
              </span>
              <div className="p-2 rounded-lg bg-slate-100 text-slate-800">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-950">
              {stats?.generalInquiriesUnread ?? 0}
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              Unanswered contact messages
            </span>
          </div>

          {/* Card 6: Active Travel Packages */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Active Tour Packages
              </span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Compass className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-950">
              {stats?.activePackages ?? 0}
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              Published on public site
            </span>
          </div>

          {/* Card 7: Published News Articles */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Published News
              </span>
              <div className="p-2 rounded-lg bg-slate-100 text-slate-800">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-950">
              {stats?.publishedNews ?? 0}
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              Active press releases
            </span>
          </div>

          {/* Card 8: Quick Action Shortcut */}
          <div
            onClick={() => navigate('/admin/appearance')}
            className="bg-slate-950 text-white p-5 rounded-xl border border-slate-800 shadow-xs flex flex-col justify-between hover:bg-slate-900 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-emerald-400">
                Appearance
              </span>
              <Image className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-sm font-heading font-bold text-white mt-2">
              Manage Logo & 3 Hero Slides
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1 group-hover:text-emerald-400 transition-colors">
              <span>Update banners</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Quick Action Buttons Grid */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-slate-950">
              Quick Actions & Management
            </h3>
            <button
              onClick={() => navigate('/admin/settings?tab=supabase')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Input Supabase Links & Keys</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <button
              onClick={() => navigate('/admin/settings?tab=supabase')}
              className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-left transition-colors cursor-pointer group"
            >
              <div className="text-emerald-700 font-bold text-xs uppercase mb-1 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supabase DB</span>
              </div>
              <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-950">
                Input Supabase Keys
              </span>
            </button>

            <button
              onClick={() => navigate('/admin/players')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 text-left transition-colors cursor-pointer"
            >
              <div className="text-emerald-600 font-bold text-xs uppercase mb-1 flex items-center gap-1.5">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Player Profile</span>
              </div>
              <span className="text-xs font-semibold text-slate-800">Add Football Player</span>
            </button>

            <button
              onClick={() => navigate('/admin/appearance')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 text-left transition-colors cursor-pointer"
            >
              <div className="text-emerald-600 font-bold text-xs uppercase mb-1 flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5" />
                <span>Logo & Hero</span>
              </div>
              <span className="text-xs font-semibold text-slate-800">Configure Appearance</span>
            </button>

            <button
              onClick={() => navigate('/admin/travel')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 text-left transition-colors cursor-pointer"
            >
              <div className="text-emerald-600 font-bold text-xs uppercase mb-1 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Travel Package</span>
              </div>
              <span className="text-xs font-semibold text-slate-800">Create Tour Package</span>
            </button>

            <button
              onClick={() => navigate('/admin/news')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 text-left transition-colors cursor-pointer"
            >
              <div className="text-emerald-600 font-bold text-xs uppercase mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Press Release</span>
              </div>
              <span className="text-xs font-semibold text-slate-800">Publish News Post</span>
            </button>
          </div>
        </div>

        {/* Recent Inquiries & Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Inquiries (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-950">
                  Recent Inquiries & Leads
                </h3>
                <span className="text-xs text-slate-500">Latest submissions from prospective clients</span>
              </div>
              <button
                onClick={() => navigate('/admin/inquiries')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                View All Inquiries →
              </button>
            </div>

            {stats?.recentInquiries && stats.recentInquiries.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {stats.recentInquiries.map((inq) => (
                  <div key={inq.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-xs font-bold text-emerald-700">
                          {inq.referenceNo}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-semibold text-slate-700 uppercase">
                          {inq.category.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-slate-900 truncate">
                        {inq.clientName}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {inq.email} • {inq.phone}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold ${
                        inq.status === 'New'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inq.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {inq.status}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-1">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                No inquiries submitted yet. Testing submissions on public forms will appear here instantly.
              </div>
            )}
          </div>

          {/* Activity Log Feed (1 Col) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <h3 className="font-heading font-bold text-base text-slate-950 mb-1">
              Administrative Audit Log
            </h3>
            <span className="text-xs text-slate-500 block mb-4 border-b border-slate-100 pb-3">
              Security records and administrative actions
            </span>

            {stats?.recentLogs && stats.recentLogs.length > 0 ? (
              <div className="space-y-4">
                {stats.recentLogs.map((log) => (
                  <div key={log.id} className="text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-semibold">{log.action}</strong>
                      <span className="text-[10px] text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{log.details}</p>
                    <span className="text-[10px] text-emerald-700 font-mono block">By {log.adminEmail}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                No recent activity logged.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
