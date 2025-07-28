# Quick Start Guide - Portfolio Admin Interface

## Prerequisites

Before starting development, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- Basic knowledge of **React**, **Vite**, and **Tailwind CSS**
- Understanding of the current portfolio structure

## Initial Setup

### 1. Install Required Dependencies

```bash
# Core dependencies
npm install zustand react-hook-form @hookform/resolvers zod
npm install react-router-dom react-dropzone

# UI dependencies (if not already installed)
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-select @radix-ui/react-switch
npm install lucide-react class-variance-authority

# Development dependencies
npm install -D @types/react @types/react-dom
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### 2. Create Directory Structure

Run this script to create the admin directory structure:

```bash
mkdir -p src/admin/{components/{common,forms,sections},hooks,pages,store,utils}
mkdir -p src/data
mkdir -p docs
```

Or create manually:
```
src/
├── admin/
│   ├── components/
│   │   ├── common/
│   │   ├── forms/
│   │   └── sections/
│   ├── hooks/
│   ├── pages/
│   ├── store/
│   └── utils/
├── data/
└── docs/
```

### 3. Configure Environment Variables

Create `.env.local` file in the project root:

```bash
# Admin Configuration
VITE_ADMIN_PASSWORD=admin123
VITE_ADMIN_SECRET_KEY=your-secret-key-here

# Existing EmailJS Configuration (keep existing values)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

## Step-by-Step Implementation

### Phase 1: Foundation (Days 1-3)

#### Day 1: Data Store Setup

**1. Create the main data store** (`src/admin/store/portfolioStore.js`):

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePortfolioStore = create(
  persist(
    (set, get) => ({
      // Data state
      hero: {
        personalInfo: {
          name: "Thomas Stefen Mardianto",
          titles: ["Full Stack Developer", "Passionate about AI/ML", "Tech Enthusiast", "Problem Solver"],
          description: "Information System and Technology ITB graduate...",
          profileImage: "/tsMain.png",
          resumeUrl: "https://drive.google.com/file/d/..."
        },
        socialLinks: {
          github: "https://github.com/T0MYAMMM",
          leetcode: "https://leetcode.com/u/t0myam/",
          linkedin: "https://www.linkedin.com/in/thomasstefenm/",
          email: "thomasstefenm@gmail.com"
        }
      },

      // UI state
      isLoading: false,
      error: null,
      lastModified: null,

      // Actions
      updateHero: (data) => set(state => ({
        hero: { ...state.hero, ...data },
        lastModified: new Date().toISOString()
      })),

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'portfolio-admin-storage',
      version: 1,
    }
  )
);

export default usePortfolioStore;
```

**2. Create data schemas** (`src/data/schemas.js`):

```javascript
import { z } from 'zod';

export const heroSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    titles: z.array(z.string().min(1)).min(1, "At least one title required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    profileImage: z.string().url().optional(),
    resumeUrl: z.string().url().optional(),
  }),
  socialLinks: z.object({
    github: z.string().url().optional(),
    leetcode: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    email: z.string().email("Invalid email format"),
  }),
});

// Add more schemas as you implement other sections
```

#### Day 2: Authentication & Routing

**1. Create authentication hook** (`src/admin/hooks/useAuth.js`):

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (password) => {
        if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
          set({ isAuthenticated: true });
          return { success: true };
        }
        return { success: false, error: 'Invalid password' };
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: 'admin-auth',
    }
  )
);

export const useAuth = () => {
  const { isAuthenticated, login, logout } = useAuthStore();
  return { isAuthenticated, login, logout };
};
```

**2. Create protected route component** (`src/admin/components/common/ProtectedRoute.jsx`):

```javascript
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};
```

**3. Create login page** (`src/admin/pages/Login.jsx`):

```javascript
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(password);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Admin Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-border rounded-md"
              required
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
```

#### Day 3: Admin Layout & Navigation

**1. Create admin layout** (`src/admin/components/common/AdminLayout.jsx`):

```javascript
import { Outlet } from 'react-router-dom';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';

export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
```

**2. Update main App.jsx to include admin routes**:

```javascript
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";

// Admin imports
import { AdminRouter } from "./admin/AdminRouter";

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/admin/*" element={<AdminRouter />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
```

### Phase 2: First Admin Section (Days 4-7)

#### Day 4-5: Hero Section Admin

**1. Create Hero Admin component** (`src/admin/components/sections/HeroAdmin.jsx`):

```javascript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { heroSchema } from '../../../data/schemas';
import usePortfolioStore from '../../store/portfolioStore';

export const HeroAdmin = () => {
  const { hero, updateHero, isLoading } = usePortfolioStore();
  
  const form = useForm({
    resolver: zodResolver(heroSchema),
    defaultValues: hero,
  });

  const onSubmit = (data) => {
    updateHero(data);
    // Show success message
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Hero Section</h1>
        <button
          onClick={() => window.open('/', '_blank')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Preview
        </button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Info Section */}
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                {...form.register('personalInfo.name')}
                className="w-full px-3 py-2 border border-border rounded-md"
              />
              {form.formState.errors.personalInfo?.name && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.personalInfo.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                {...form.register('personalInfo.description')}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md"
              />
            </div>
          </div>

          {/* Titles Array Management */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Rotating Titles</label>
            {/* Add array field management here */}
          </div>
        </div>

        {/* Social Links Section */}
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Social Links</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(hero.socialLinks).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-2 capitalize">
                  {key}
                </label>
                <input
                  {...form.register(`socialLinks.${key}`)}
                  type={key === 'email' ? 'email' : 'url'}
                  className="w-full px-3 py-2 border border-border rounded-md"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => form.reset()}
            className="px-4 py-2 border border-border rounded-md"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
```

#### Day 6-7: Connect Data to Components

**1. Update HeroSection component to use store data**:

```javascript
// In src/components/HeroSection.jsx
import usePortfolioStore from '../admin/store/portfolioStore';

export const HeroSection = () => {
  const { hero } = usePortfolioStore();
  
  // Use hero.personalInfo.name instead of hardcoded name
  // Use hero.personalInfo.titles instead of hardcoded titles array
  // etc.
  
  // Rest of your existing component logic...
};
```

### Phase 3: Testing & Refinement (Days 8-10)

#### Day 8: Basic Testing Setup

**1. Create test file** (`src/admin/components/sections/HeroAdmin.test.jsx`):

```javascript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HeroAdmin } from './HeroAdmin';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('HeroAdmin', () => {
  it('renders hero admin form', () => {
    renderWithRouter(<HeroAdmin />);
    expect(screen.getByText('Hero Section')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });
});
```

#### Day 9-10: Polish & Documentation

**1. Add error boundaries**
**2. Improve loading states**
**3. Add success/error notifications**
**4. Create component documentation**

## Common Patterns & Utilities

### Generic Form Field Component

```javascript
// src/admin/components/forms/FormField.jsx
export const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  register, 
  error, 
  ...props 
}) => (
  <div>
    <label className="block text-sm font-medium mb-2">
      {label}
    </label>
    <input
      {...register(name)}
      type={type}
      className="w-full px-3 py-2 border border-border rounded-md"
      {...props}
    />
    {error && (
      <p className="text-red-500 text-sm mt-1">{error.message}</p>
    )}
  </div>
);
```

### Array Field Management

```javascript
// src/admin/components/forms/ArrayField.jsx
import { useFieldArray } from 'react-hook-form';

export const ArrayField = ({ control, name, label }) => {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2 mb-2">
          <input
            {...register(`${name}.${index}.value`)}
            className="flex-1 px-3 py-2 border border-border rounded-md"
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="px-3 py-2 bg-red-500 text-white rounded-md"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ value: '' })}
        className="px-3 py-2 bg-primary text-primary-foreground rounded-md"
      >
        Add Item
      </button>
    </div>
  );
};
```

## Next Steps

After completing the foundation:

1. **Expand to other sections**: Follow the same pattern for Experience, Projects, etc.
2. **Add file upload**: Implement image upload for profile pictures and project images
3. **Improve UI/UX**: Add better animations, loading states, and error handling
4. **Add data validation**: Implement comprehensive validation for all forms
5. **Create backup system**: Add export/import functionality

## Troubleshooting

### Common Issues

**Issue**: "Cannot read property of undefined"
**Solution**: Make sure your store is properly initialized with default data

**Issue**: Form validation not working
**Solution**: Check that your Zod schema matches your form structure exactly

**Issue**: Store data not persisting
**Solution**: Verify that the Zustand persist middleware is properly configured

### Development Tips

1. **Start small**: Implement one section at a time
2. **Test frequently**: Test each component as you build it
3. **Use TypeScript**: Consider adding TypeScript for better development experience
4. **Mobile-first**: Design admin interface to work on mobile devices
5. **Performance**: Use React.memo and useMemo for expensive operations

## Resources

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Radix UI Components](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

This quick start guide should give you everything needed to begin implementing the admin interface. Start with Phase 1 and gradually expand the functionality as outlined in the main roadmap document. 