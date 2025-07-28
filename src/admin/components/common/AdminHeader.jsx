import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  User, 
  Settings, 
  ExternalLink,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';

export const AdminHeader = () => {
  const { user, logout, lastLogin } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Theme handling
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const openPortfolio = () => {
    window.open('/', '_blank');
  };

  const formatLastLogin = (loginTime) => {
    if (!loginTime) return 'Unknown';
    
    const date = new Date(loginTime);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 24) {
      return date.toLocaleDateString();
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <header className="bg-card border-b border-border px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Logo/Title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-foreground">
            Portfolio Admin
          </h1>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <button
            onClick={openPortfolio}
            className="hidden sm:flex items-center space-x-1 text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            <span>View Portfolio</span>
          </button>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-foreground/60" />
            ) : (
              <Moon className="h-4 w-4 text-foreground/60" />
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-3 w-3 text-primary" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-foreground">
                {user?.username || 'Admin'}
              </span>
              <ChevronDown className="h-3 w-3 text-foreground/60" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                
                {/* Menu */}
                <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-20">
                  <div className="p-3 border-b border-border">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {user?.username || 'Admin'}
                        </p>
                        <p className="text-xs text-foreground/60">
                          Last login: {formatLastLogin(lastLogin)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-1">
                    <button
                      onClick={openPortfolio}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>View Portfolio</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        // TODO: Implement settings modal
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    
                    <div className="h-px bg-border my-1" />
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 