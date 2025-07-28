# Technical Specifications - Portfolio Admin Interface

## Architecture Overview

### State Management Architecture

```javascript
// Data Store Structure using Zustand
const usePortfolioStore = create((set, get) => ({
  // Data state
  hero: { ... },
  experience: [],
  education: [],
  skills: {},
  projects: [],
  contact: { ... },
  
  // UI state
  isLoading: false,
  error: null,
  lastModified: null,
  
  // Actions
  updateSection: (section, data) => { ... },
  reorderItems: (section, fromIndex, toIndex) => { ... },
  uploadFile: (file, callback) => { ... }
}));
```

### Component Architecture

```
AdminLayout
├── AdminHeader
│   ├── UserMenu
│   └── PreviewToggle
├── AdminSidebar
│   ├── NavigationMenu
│   └── QuickActions
└── AdminContent
    ├── SectionRouter
    └── PreviewPanel
```

## Data Schemas

### 1. Hero Section Schema

```javascript
const heroSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(2).max(100),
    titles: z.array(z.string()).min(1).max(10),
    description: z.string().min(10).max(500),
    profileImage: z.string().url().optional(),
    resumeUrl: z.string().url().optional(),
  }),
  socialLinks: z.object({
    github: z.string().url().optional(),
    leetcode: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    email: z.string().email(),
  }),
  settings: z.object({
    titleRotationSpeed: z.number().min(1000).max(10000).default(3000),
    showScrollIndicator: z.boolean().default(true),
  })
});
```

### 2. Experience Section Schema

```javascript
const experienceSchema = z.object({
  experiences: z.array(z.object({
    id: z.string().uuid(),
    title: z.string().min(2).max(100),
    company: z.string().min(2).max(100),
    type: z.enum(['On-site', 'Hybrid', 'Remote']),
    location: z.string().min(2).max(100),
    startDate: z.string().datetime(),
    endDate: z.string().datetime().nullable(),
    description: z.string().min(10).max(1000),
    skills: z.array(z.string()).max(20),
    order: z.number().int().min(0),
    featured: z.boolean().default(false),
    visible: z.boolean().default(true),
  }))
});
```

### 3. Projects Section Schema

```javascript
const projectsSchema = z.object({
  projects: z.array(z.object({
    id: z.string().uuid(),
    title: z.string().min(2).max(100),
    description: z.string().min(10).max(500),
    longDescription: z.string().max(2000).optional(),
    image: z.string().url(),
    gallery: z.array(z.string().url()).max(10).optional(),
    tags: z.array(z.string()).max(15),
    demoUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    demoStatus: z.enum(['online', 'offline', 'maintenance']),
    featured: z.boolean().default(false),
    category: z.string().optional(),
    technologies: z.array(z.string()),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    order: z.number().int().min(0),
    visible: z.boolean().default(true),
  }))
});
```

## API Design (Future Backend Implementation)

### RESTful Endpoints

```javascript
// Authentication
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/verify
POST   /api/auth/refresh

// Content Management
GET    /api/content/:section
PUT    /api/content/:section
POST   /api/content/:section/items
PUT    /api/content/:section/items/:id
DELETE /api/content/:section/items/:id
POST   /api/content/:section/reorder

// File Management
POST   /api/files/upload
DELETE /api/files/:id
GET    /api/files/:id

// Analytics
GET    /api/analytics/overview
GET    /api/analytics/:section

// Backup & Export
GET    /api/export/all
POST   /api/import/all
GET    /api/backup/list
POST   /api/backup/create
POST   /api/backup/restore/:id
```

### GraphQL Schema (Alternative)

```graphql
type Query {
  getSection(name: String!): Section
  getAllSections: [Section!]!
  getAnalytics(section: String): Analytics
}

type Mutation {
  updateSection(name: String!, data: JSON!): Section
  createItem(section: String!, data: JSON!): Item
  updateItem(section: String!, id: ID!, data: JSON!): Item
  deleteItem(section: String!, id: ID!): Boolean
  reorderItems(section: String!, order: [ID!]!): Boolean
  uploadFile(file: Upload!): File
}

type Section {
  name: String!
  data: JSON!
  lastModified: DateTime!
  items: [Item!]
}
```

## Component Specifications

### 1. Generic Form Component

```javascript
// GenericForm.jsx
const GenericForm = ({ 
  schema, 
  initialData, 
  onSubmit, 
  onCancel,
  isLoading = false 
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Dynamic form fields based on schema */}
        <FormRenderer schema={schema} form={form} />
        <FormActions isLoading={isLoading} onCancel={onCancel} />
      </form>
    </Form>
  );
};
```

### 2. Data Table Component

```javascript
// DataTable.jsx
const DataTable = ({
  data,
  columns,
  onEdit,
  onDelete,
  onReorder,
  sortable = true,
  filterable = true
}) => {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState('');
  
  return (
    <div className="space-y-4">
      {filterable && <TableFilter value={filtering} onChange={setFiltering} />}
      <Table>
        <TableHeader>
          {/* Dynamic headers with sort functionality */}
        </TableHeader>
        <TableBody>
          {/* Draggable rows for reordering */}
        </TableBody>
      </Table>
    </div>
  );
};
```

### 3. File Upload Component

```javascript
// FileUpload.jsx
const FileUpload = ({
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
  onUpload,
  multiple = false,
  preview = true
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxSize,
    multiple,
    onDrop: handleDrop
  });

  return (
    <div {...getRootProps()} className="upload-zone">
      <input {...getInputProps()} />
      {preview && <PreviewGrid files={files} />}
      <UploadProgress uploads={uploads} />
    </div>
  );
};
```

## Security Implementation

### Authentication Flow

```javascript
// useAuth.js
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (credentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (response.ok) {
        const { token, user } = await response.json();
        localStorage.setItem('authToken', token);
        setUser(user);
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return { user, login, logout, isLoading };
};
```

### Protected Route Component

```javascript
// ProtectedRoute.jsx
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};
```

### Input Sanitization

```javascript
// sanitization.js
import DOMPurify from 'dompurify';

export const sanitizeInput = (input, type = 'text') => {
  switch (type) {
    case 'html':
      return DOMPurify.sanitize(input);
    case 'url':
      try {
        new URL(input);
        return input;
      } catch {
        throw new Error('Invalid URL format');
      }
    case 'text':
    default:
      return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
};
```

## Performance Optimizations

### Lazy Loading Implementation

```javascript
// Lazy load admin routes
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const HeroAdmin = lazy(() => import('./admin/components/sections/HeroAdmin'));
const ExperienceAdmin = lazy(() => import('./admin/components/sections/ExperienceAdmin'));

// Route configuration
const AdminRouter = () => (
  <Suspense fallback={<AdminLoadingSpinner />}>
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/hero" element={<HeroAdmin />} />
      <Route path="/experience" element={<ExperienceAdmin />} />
      {/* ... other routes */}
    </Routes>
  </Suspense>
);
```

### Image Optimization

```javascript
// imageOptimization.js
export const optimizeImage = async (file, options = {}) => {
  const {
    maxWidth = 800,
    maxHeight = 600,
    quality = 0.8,
    format = 'webp'
  } = options;

  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      const { width, height } = calculateDimensions(img, maxWidth, maxHeight);
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, `image/${format}`, quality);
    };

    img.src = URL.createObjectURL(file);
  });
};
```

### Data Caching Strategy

```javascript
// dataCache.js
class DataCache {
  constructor() {
    this.cache = new Map();
    this.expirationTimes = new Map();
  }

  set(key, data, ttl = 300000) { // 5 minutes default
    this.cache.set(key, data);
    this.expirationTimes.set(key, Date.now() + ttl);
  }

  get(key) {
    if (this.isExpired(key)) {
      this.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  isExpired(key) {
    const expirationTime = this.expirationTimes.get(key);
    return expirationTime && Date.now() > expirationTime;
  }

  delete(key) {
    this.cache.delete(key);
    this.expirationTimes.delete(key);
  }

  clear() {
    this.cache.clear();
    this.expirationTimes.clear();
  }
}

export const dataCache = new DataCache();
```

## Testing Specifications

### Unit Test Examples

```javascript
// GenericForm.test.jsx
describe('GenericForm', () => {
  it('should render form fields based on schema', () => {
    const schema = z.object({
      name: z.string(),
      email: z.string().email()
    });

    render(<GenericForm schema={schema} />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('should validate input according to schema', async () => {
    const schema = z.object({
      email: z.string().email()
    });

    render(<GenericForm schema={schema} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });
});
```

### Integration Test Examples

```javascript
// AdminWorkflow.test.jsx
describe('Admin Workflow', () => {
  it('should allow creating and editing experience entries', async () => {
    render(<ExperienceAdmin />);
    
    // Click add new experience
    await user.click(screen.getByText(/add experience/i));
    
    // Fill form
    await user.type(screen.getByLabelText(/title/i), 'Software Engineer');
    await user.type(screen.getByLabelText(/company/i), 'Tech Corp');
    
    // Submit
    await user.click(screen.getByText(/save/i));
    
    // Verify it appears in the list
    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });
  });
});
```

### E2E Test Examples

```javascript
// admin.e2e.js (Playwright)
test('complete admin workflow', async ({ page }) => {
  // Login
  await page.goto('/admin/login');
  await page.fill('[data-testid="password"]', 'admin123');
  await page.click('[data-testid="login-button"]');

  // Navigate to projects
  await page.click('[data-testid="projects-nav"]');
  
  // Add new project
  await page.click('[data-testid="add-project"]');
  await page.fill('[data-testid="project-title"]', 'New Project');
  await page.fill('[data-testid="project-description"]', 'Project description');
  
  // Upload image
  await page.setInputFiles('[data-testid="image-upload"]', 'test-image.jpg');
  
  // Save
  await page.click('[data-testid="save-project"]');
  
  // Verify in public portfolio
  await page.goto('/');
  await expect(page.locator('text=New Project')).toBeVisible();
});
```

## Deployment Configuration

### Environment Variables

```bash
# .env.local
VITE_ADMIN_PASSWORD=your_secure_password
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Build Configuration

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'admin': ['./src/admin/AdminRouter.jsx'],
          'vendor': ['react', 'react-dom'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-toast']
        }
      }
    }
  },
  define: {
    __ADMIN_BUILD__: JSON.stringify(process.env.NODE_ENV === 'production')
  }
});
```

This technical specification provides the detailed implementation guidelines needed to build the admin interface according to the roadmap. Each component and system is designed to be modular, testable, and scalable. 