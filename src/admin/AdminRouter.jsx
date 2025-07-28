import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminLayout from './components/common/AdminLayout';

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/Login'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Real Admin components
const HeroAdmin = lazy(() => import('./components/sections/HeroAdmin'));
const ExperienceAdmin = lazy(() => import('./components/sections/ExperienceAdmin'));
const EducationAdmin = lazy(() => import('./components/sections/EducationAdmin'));
const SkillsAdmin = lazy(() => import('./components/sections/SkillsAdmin'));
const ProjectsAdmin = lazy(() => import('./components/sections/ProjectsAdmin'));
const ContactAdmin = lazy(() => import('./components/sections/ContactAdmin'));

// Placeholder components for sections that will be implemented in later phases

const AnalyticsAdmin = lazy(() => Promise.resolve({
  default: () => (
    <div className="bg-card border border-border rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <p className="text-foreground/60">Analytics dashboard will be implemented in Phase 4.</p>
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          📊 Coming in Phase 4: View portfolio statistics, contact form submissions, and project analytics.
        </p>
      </div>
    </div>
  )
}));

const SettingsAdmin = lazy(() => Promise.resolve({
  default: () => (
    <div className="bg-card border border-border rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p className="text-foreground/60">Admin settings will be implemented in Phase 4.</p>
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          ⚙️ Coming in Phase 4: Admin preferences, data export/import, and backup management.
        </p>
      </div>
    </div>
  )
}));

// Loading component
const AdminLoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export const AdminRouter = () => {
  return (
    <Suspense fallback={<AdminLoadingSpinner />}>
      <Routes>
        {/* Public login route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected admin routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested routes within AdminLayout */}
          <Route index element={<AdminDashboard />} />
          <Route path="hero" element={<HeroAdmin />} />
          <Route path="experience" element={<ExperienceAdmin />} />
          <Route path="education" element={<EducationAdmin />} />
          <Route path="skills" element={<SkillsAdmin />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="contact" element={<ContactAdmin />} />
          <Route path="analytics" element={<AnalyticsAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AdminRouter; 