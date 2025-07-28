import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';

export const AdminLayout = () => {
  const { extendSession } = useAuth();

  // Extend session on user activity
  useEffect(() => {
    let activityTimer;

    const resetActivityTimer = () => {
      clearTimeout(activityTimer);
      activityTimer = setTimeout(() => {
        extendSession();
      }, 5 * 60 * 1000); // Extend session every 5 minutes of activity
    };

    const handleActivity = () => {
      resetActivityTimer();
    };

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Set initial timer
    resetActivityTimer();

    return () => {
      clearTimeout(activityTimer);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [extendSession]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AdminHeader />
      
      {/* Main Content Area */}
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-full">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 