import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  LayoutDashboard,
  Palette,
  FolderTree,
  BarChart3,
  BookOpen,
  Settings,
  Mail,
  DollarSign,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { Button } from '../ui/Button';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser, logout } = useAdminAuth();

  const navItems = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/templates', label: 'Templates', icon: Palette, end: false },
    { to: '/admin/categories', label: 'Categories', icon: FolderTree, end: false },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3, end: false },
    { to: '/admin/blog', label: 'Blog Posts', icon: BookOpen, end: false },
    { to: '/admin/ads', label: 'Ads & Monetization', icon: DollarSign, end: false },
    { to: '/admin/messages', label: 'Messages', icon: Mail, end: false },
    { to: '/admin/settings', label: 'Settings', icon: Settings, end: false }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-stone-900 text-white h-16 px-3 sm:px-6 flex items-center justify-between border-b border-stone-800 sticky top-0 z-40 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 cursor-pointer p-2 shrink-0"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/admin" className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="font-rozha text-lg text-amber-400 shrink-0">ॐ</span>
            <span className="font-bold text-xs sm:text-base font-cinzel tracking-wide truncate max-w-[120px] xs:max-w-none">
              BiodataCraft <span className="text-amber-500 font-sans text-xs">Admin</span>
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider shrink-0">
            <ShieldCheck className="w-3 h-3" />
            <span>Admin Auth Only</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {currentUser && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-stone-800 border border-stone-700 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-stone-300 font-mono text-[11px] max-w-[180px] truncate">
                {currentUser.email}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
          )}

          <Link
            to="/"
            className="flex items-center gap-1 text-xs text-stone-300 hover:text-amber-400 transition-colors px-2 sm:px-2.5 py-1.5 rounded-lg hover:bg-stone-800 cursor-pointer min-h-[36px]"
            title="Return to Live Site"
          >
            <span className="hidden xs:inline">Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleLogout}
            className="text-stone-300 hover:text-white hover:bg-stone-800 text-xs cursor-pointer px-2 sm:px-3"
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Admin Workspace Container */}
      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed md:sticky top-16 inset-y-0 left-0 z-40 w-64 bg-white border-r border-stone-200 p-4 transition-transform md:translate-x-0 overflow-y-auto max-h-[calc(100vh-4rem)] ${
            sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-3 block mb-2">
              Management
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-800 text-white shadow-sm'
                        : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-stone-100 px-3 text-[11px] text-stone-500">
            <p className="font-semibold text-stone-700">BiodataCraft Platform</p>
            <p className="text-[10px] text-stone-400 mt-0.5">Zero customer data storage verified</p>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-stone-900/50 backdrop-blur-xs md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Content Pane */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
