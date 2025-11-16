import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Car,
  Users,
  Tag,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Wrench,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, signOut } = useAuth();

  const navigationItems: NavItem[] = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Fleet Management', path: '/admin/fleet', icon: Car },
    { name: 'Leads', path: '/admin/leads', icon: Users, badge: 5 },
    { name: 'Offers', path: '/admin/offers', icon: Tag },
    { name: 'Maintenance', path: '/admin/maintenance', icon: Wrench },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-navy text-white rounded-lg shadow-lg"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || mobileMenuOpen) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`
              fixed top-0 left-0 h-full bg-navy text-white z-40
              ${sidebarOpen ? 'lg:w-72' : 'lg:w-0'}
              ${mobileMenuOpen ? 'w-72' : 'w-0 lg:w-72'}
              overflow-hidden shadow-2xl
            `}
          >
            <div className="flex flex-col h-full">
              {/* Logo & Brand */}
              <div className="p-6 border-b border-white/10">
                <Link to="/admin" className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
                    <Car className="text-navy" size={24} />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">VELO Luxury</h1>
                    <p className="text-xs text-gray-300">Admin Portal</p>
                  </div>
                </Link>
              </div>

              {/* Admin Info */}
              {admin && (
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                      <span className="text-gold font-bold text-sm">
                        {admin.full_name?.charAt(0) || admin.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{admin.full_name || admin.email}</p>
                      <p className="text-xs text-gold capitalize">{admin.role?.replace('_', ' ')}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`
                            flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                            ${active
                              ? 'bg-gold text-navy font-semibold shadow-lg'
                              : 'text-white hover:bg-white/10'
                            }
                          `}
                        >
                          <Icon size={20} />
                          <span className="flex-1">{item.name}</span>
                          {item.badge && item.badge > 0 && (
                            <span className={`
                              px-2 py-0.5 text-xs rounded-full font-medium
                              ${active ? 'bg-navy text-gold' : 'bg-gold text-navy'}
                            `}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Footer Actions */}
              <div className="p-4 border-t border-white/10">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-red-500/20 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-0'}
        `}
      >
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Sidebar Toggle (Desktop) */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={20} className="text-navy" />
              </button>

              {/* Page Title - Will be overridden by page content if needed */}
              <div className="hidden md:block">
                <h2 className="text-xl font-bold text-navy">
                  {navigationItems.find(item => isActive(item.path))?.name || 'Dashboard'}
                </h2>
              </div>
            </div>

            {/* Top Bar Actions */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} className="text-navy" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Admin Avatar (Mobile) */}
              <div className="lg:hidden">
                <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center">
                  <span className="text-gold font-bold text-xs">
                    {admin?.full_name?.charAt(0) || admin?.email.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
