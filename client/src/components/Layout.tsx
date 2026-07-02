import { type ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationsContext';
import { Footer } from './Footer';
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  PieChart,
  Target,
  FolderTree,
  Trophy,
  Users,
  Settings,
  LogOut,
  Bell,
  Lightbulb,
  MessageSquare,
  AlertTriangle,
  Split,
  Info,
  Menu,
  X,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Comptes', href: '/accounts', icon: Wallet },
    { name: 'Transactions', href: '/transactions', icon: Receipt },
    { name: 'Budgets', href: '/budgets', icon: PieChart },
    { name: 'Objectifs', href: '/goals', icon: Target },
    { name: 'Catégories', href: '/categories', icon: FolderTree },
    { name: 'Tontines', href: '/tontines', icon: Users },
    { name: 'Partage Factures', href: '/bill-splits', icon: Split },
    { name: 'Assistant IA', href: '/chatbot', icon: MessageSquare },
    { name: 'Alertes Intelligentes', href: '/smart-alerts', icon: AlertTriangle },
    { name: 'Insights & IA', href: '/insights', icon: Lightbulb },
    { name: 'Réalisations', href: '/achievements', icon: Trophy },
  ];

  const isActive = (path: string) => location.pathname === path;

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 rounded-xl glass-effect shadow-lg text-gray-700 dark:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 glass-effect shadow-2xl z-30 transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-white/20 dark:border-gray-700/50">
            <div className="p-2 rounded-xl gradient-primary shadow-glow">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gradient">BudgetWise</h1>
          </div>

          {/* User Info */}
          <div className="px-6 py-5 border-b border-white/20 dark:border-gray-700/50 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold shadow-lg">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
              <Link
                to="/notifications"
                className="relative p-2 rounded-lg hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'gradient-primary text-white shadow-lg shadow-emerald-500/30 scale-105'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:shadow-md hover:scale-102'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-white/20 dark:border-gray-700/50 space-y-2 bg-white/30 dark:bg-gray-800/30">
            <Link
              to="/about"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive('/about')
                  ? 'gradient-primary text-white shadow-lg shadow-emerald-500/30'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:shadow-md'
              }`}
            >
              <Info className="h-5 w-5" />
              À propos
            </Link>
            <Link
              to="/settings"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive('/settings')
                  ? 'gradient-primary text-white shadow-lg shadow-emerald-500/30'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:shadow-md'
              }`}
            >
              <Settings className="h-5 w-5" />
              Paramètres
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 hover:shadow-md"
            >
              <LogOut className="h-5 w-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 pt-16 lg:pt-0">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
