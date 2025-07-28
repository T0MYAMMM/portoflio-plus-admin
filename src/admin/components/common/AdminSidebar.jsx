import { useState } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { 
  Home,
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderOpen,
  MessageCircle,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: Home,
    description: 'Overview and quick stats'
  },
  {
    name: 'Hero Section',
    href: '/admin/hero',
    icon: User,
    description: 'Personal info and bio'
  },
  {
    name: 'Experience',
    href: '/admin/experience',
    icon: Briefcase,
    description: 'Work history and roles'
  },
  {
    name: 'Education',
    href: '/admin/education',
    icon: GraduationCap,
    description: 'Academic background'
  },
  {
    name: 'Skills',
    href: '/admin/skills',
    icon: Code,
    description: 'Technical skills'
  },
  {
    name: 'Projects',
    href: '/admin/projects',
    icon: FolderOpen,
    description: 'Portfolio projects'
  },
  {
    name: 'Contact',
    href: '/admin/contact',
    icon: MessageCircle,
    description: 'Contact information'
  }
];

const quickActions = [
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'View site statistics'
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'Admin preferences'
  }
];

export const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (href) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside className={`bg-card border-r border-border transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-[calc(100vh-73px)] flex flex-col`}>
      
      {/* Toggle Button */}
      <div className="p-3 border-b border-border">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-accent transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-foreground/60" />
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-medium text-foreground/80">Navigation</span>
              <ChevronLeft className="h-4 w-4 text-foreground/60" />
            </div>
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <div className={`${isCollapsed ? '' : 'mb-6'}`}>
          {!isCollapsed && (
            <h3 className="px-3 mb-2 text-xs font-semibold text-foreground/50 uppercase tracking-wider">
              Content Management
            </h3>
          )}
          
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                }`}
                title={isCollapsed ? item.description : ''}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${
                  active ? 'text-primary-foreground' : 'text-foreground/50 group-hover:text-foreground'
                }`} />
                
                {!isCollapsed && (
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="truncate">{item.name}</div>
                    <div className={`text-xs mt-0.5 truncate ${
                      active 
                        ? 'text-primary-foreground/80' 
                        : 'text-foreground/50 group-hover:text-foreground/70'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                )}
                
                {active && isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-card border border-border rounded shadow-lg text-xs whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="pt-6 border-t border-border">
          {!isCollapsed && (
            <h3 className="px-3 mb-2 text-xs font-semibold text-foreground/50 uppercase tracking-wider">
              Quick Actions
            </h3>
          )}
          
          {quickActions.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                }`}
                title={isCollapsed ? item.description : ''}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${
                  active ? 'text-primary-foreground' : 'text-foreground/50 group-hover:text-foreground'
                }`} />
                
                {!isCollapsed && (
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="truncate">{item.name}</div>
                    <div className={`text-xs mt-0.5 truncate ${
                      active 
                        ? 'text-primary-foreground/80' 
                        : 'text-foreground/50 group-hover:text-foreground/70'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-3 border-t border-border">
          <div className="text-xs text-foreground/50 text-center">
            <p>Portfolio Admin Panel</p>
            <p>v1.0.0</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar; 