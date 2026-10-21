import React, { useState, useEffect } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';
import {
  LayoutDashboard,
  Users,
  Inbox,
  Image,
  Compass,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  ChevronRight,
  Database
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab }) => {
  const { navigate } = useRouter();
  const { admin, logout, loading } = useAuth();
  const { config } = useConfig();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !admin) {
      const timer = setTimeout(() => {
        navigate('/admin/login');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [loading, admin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Verifying Administrator Session...</span>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { id: 'inquiries', label: 'Inquiries & Leads', path: '/admin/inquiries', icon: Inbox },
    { id: 'players', label: 'Player Management', path: '/admin/players', icon: Users },
    { id: 'appearance', label: 'Logo & Hero Appearance', path: '/admin/appearance', icon: Image },
    { id: 'travel', label: 'Travel Packages', path: '/admin/travel', icon: Compass },
    { id: 'news', label: 'News & Announcements', path: '/admin/news', icon: FileText },
    { id: 'settings', label: 'Content & Settings', path: '/admin/settings', icon: Settings },
    { id: 'supabase', label: 'Supabase Database', path: '/admin/settings?tab=supabase', icon: Database }
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-slate-950 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-sm text-white">CHAMONVIN</span>
            <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">Admin</span>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-slate-300 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:overflow-y-auto flex flex-col justify-between border-r border-slate-800 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo & Title */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={config?.logoUrl || 'https://i.ibb.co/Kp7HY9pp/Whats-App-Image-2026-10-17-at-15-09-07.jpg'}
                alt="CHAMONVIN LIMITED"
                className="h-10 w-auto object-contain rounded bg-white/10 p-1"
              />
              <div>
                <h1 className="font-heading font-extrabold text-sm text-white tracking-tight">
                  CHAMONVIN
                </h1>
                <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase block">
                  Management Desk
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Profile Details */}
          <div className="px-6 py-4 bg-slate-900/60 border-b border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
              Signed in as
            </span>
            <span className="text-xs font-semibold text-white truncate block mt-0.5">
              {admin.email}
            </span>
            <span className="inline-block mt-1.5 px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-[10px] font-bold">
              {admin.role}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 lg:h-screen lg:overflow-y-auto">
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};
