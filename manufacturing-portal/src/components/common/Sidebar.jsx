import { 
  LayoutDashboard, 
  FolderKanban, 
  Factory, 
  ShieldCheck, 
  Truck, 
  Wrench, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/helpers';

const navItemsByRole = {
  admin: [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/programs', label: 'Programs & Projects', icon: FolderKanban },
    { path: '/production', label: 'Production', icon: Factory },
    { path: '/quality', label: 'Quality & Compliance', icon: ShieldCheck },
    { path: '/supply-chain', label: 'Supply Chain', icon: Truck },
    { path: '/after-sales', label: 'After-Sales Service', icon: Wrench },
    { path: '/collaboration', label: 'Collaboration', icon: Users },
    { path: '/analytics', label: 'Analytics & Reports', icon: BarChart3 },
  ],
  engineer: [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/programs', label: 'Programs & Projects', icon: FolderKanban },
    { path: '/production', label: 'Production', icon: Factory },
    { path: '/quality', label: 'Quality & Compliance', icon: ShieldCheck },
    { path: '/collaboration', label: 'Collaboration', icon: Users },
  ],
  manager: [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/programs', label: 'Programs & Projects', icon: FolderKanban },
    { path: '/production', label: 'Production', icon: Factory },
    { path: '/analytics', label: 'Analytics & Reports', icon: BarChart3 },
  ],
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Get nav items based on user role (default to admin if no role)
  const userRole = user?.role || 'admin';
  const navItems = navItemsByRole[userRole] || navItemsByRole.admin;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-secondary-200 transition-all duration-300 z-50 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-secondary-200 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Factory className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg text-secondary-900">Nexgile</h1>
              <p className="text-xs text-secondary-500">FactoryIQ Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                      isActive 
                        ? "bg-primary-50 text-primary-700 font-medium" 
                        : "text-secondary-600 hover:bg-secondary-100 hover:text-primary-600"
                    )
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User & Logout */}
      <div className="border-t border-secondary-200 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-primary-700">{user?.avatar || 'U'}</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-secondary-900 truncate">{user?.name}</p>
              <p className="text-xs text-secondary-500 capitalize">{user?.role}</p>
            </div>
          )}
        </div>
        
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-2 text-secondary-600 hover:text-danger-600 transition-colors w-full",
            collapsed ? "justify-center" : "px-3 py-2"
          )}
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-secondary-200 rounded-full flex items-center justify-center hover:bg-secondary-100 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-secondary-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-secondary-600" />
        )}
      </button>
    </aside>
  );
}
