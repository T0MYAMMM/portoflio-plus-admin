import { useAuth } from '../hooks/useAuth';
import usePortfolioStore from '../store/portfolioStore';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code,
  FolderOpen,
  MessageCircle,
  Clock,
  ExternalLink
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user, lastLogin } = useAuth();
  const { hero, experience, education, skills, projects, contact, lastModified } = usePortfolioStore();

  const stats = [
    {
      name: 'Experience Items',
      value: experience?.length || 0,
      icon: Briefcase,
      href: '/admin/experience',
      color: 'bg-blue-500'
    },
    {
      name: 'Education Records',
      value: education?.length || 0,
      icon: GraduationCap,
      href: '/admin/education',
      color: 'bg-green-500'
    },
    {
      name: 'Skill Categories',
      value: Object.keys(skills || {}).length,
      icon: Code,
      href: '/admin/skills',
      color: 'bg-purple-500'
    },
    {
      name: 'Projects',
      value: projects?.length || 0,
      icon: FolderOpen,
      href: '/admin/projects',
      color: 'bg-orange-500'
    }
  ];

  const quickActions = [
    {
      name: 'Edit Hero Section',
      description: 'Update personal information and bio',
      href: '/admin/hero',
      icon: User,
      color: 'border-blue-200 hover:border-blue-300'
    },
    {
      name: 'Add Experience',
      description: 'Add new work experience',
      href: '/admin/experience',
      icon: Briefcase,
      color: 'border-green-200 hover:border-green-300'
    },
    {
      name: 'Manage Projects',
      description: 'Update portfolio projects',
      href: '/admin/projects',
      icon: FolderOpen,
      color: 'border-purple-200 hover:border-purple-300'
    },
    {
      name: 'Contact Settings',
      description: 'Configure contact information',
      href: '/admin/contact',
      icon: MessageCircle,
      color: 'border-orange-200 hover:border-orange-300'
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {user?.username || 'Admin'}!
            </h1>
            <p className="text-foreground/60 mt-1">
              Manage your portfolio content from this dashboard
            </p>
          </div>
          <button
            onClick={() => window.open('/', '_blank')}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View Portfolio</span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-foreground/60">
            <Clock className="h-4 w-4" />
            <span>Last login: {formatDate(lastLogin)}</span>
          </div>
          <div className="flex items-center space-x-2 text-foreground/60">
            <User className="h-4 w-4" />
            <span>Last modified: {formatDate(lastModified)}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => window.location.href = stat.href}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground/60">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                  <Icon className="h-6 w-6 text-foreground/70" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.name}
                className={`bg-card border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${action.color}`}
                onClick={() => window.location.href = action.href}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-accent">
                    <Icon className="h-5 w-5 text-foreground/70" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">
                      {action.name}
                    </h3>
                    <p className="text-sm text-foreground/60 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity or Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Portfolio Status
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-foreground/70">Hero Section</span>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
              Complete
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-foreground/70">Experience Section</span>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
              {experience?.length || 0} items
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-foreground/70">Skills Section</span>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
              {Object.keys(skills || {}).length} categories
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-foreground/70">Projects Section</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              (projects?.length || 0) > 0 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            }`}>
              {(projects?.length || 0) > 0 ? `${projects.length} projects` : 'No projects'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 