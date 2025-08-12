import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { projectItemSchema } from '../../../data/schemas';
import usePortfolioStore from '../../store/portfolioStore';
import { useToast } from '@/hooks/use-toast';

// Import reusable components
import FormField from '../forms/FormField';
import FileUpload from '../forms/FileUpload';
import Modal from '../forms/Modal';

import { 
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Save,
  X,
  FolderOpen,
  Calendar,
  Github,
  Globe,
  Eye,
  EyeOff,
  Star,
  Search,
  Filter,
  GripVertical,
  Image,
  Tag,
  Settings,
  Link
} from 'lucide-react';

export const ProjectsAdmin = () => {
  const { projects, updateProjects, isLoading, setLoading } = usePortfolioStore();
  const { toast } = useToast();
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('order');
  const [sortDirection, setSortDirection] = useState('asc');

  // Form setup
  const form = useForm({
    resolver: zodResolver(projectItemSchema),
    mode: 'onSubmit', // Only validate on submit, not on change
    defaultValues: {
      id: '',
      title: '',
      description: '',
      longDescription: '',
      image: '',
      gallery: [],
      tags: [],
      demoUrl: '',
      githubUrl: '',
      demoStatus: 'online',
      featured: false,
      category: '',
      technologies: [],
      startDate: '',
      endDate: '',
      visible: true,
      order: 0
    }
  });

  // Get unique categories from projects
  const categories = [...new Set(projects.map(p => p.category).filter(Boolean))];

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (project.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || project.demoStatus === statusFilter;
      const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'startDate' || sortBy === 'endDate') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Open modal for new project
  const handleCreate = () => {
    form.reset({
      id: '',
      title: '',
      description: '',
      longDescription: '',
      image: '',
      gallery: [],
      tags: [],
      demoUrl: '',
      githubUrl: '',
      demoStatus: 'online',
      featured: false,
      category: '',
      technologies: [],
      startDate: '',
      endDate: '',
      visible: true,
      order: 0
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (project) => {
    form.reset({
      ...project,
      tags: project.tags || [],
      technologies: project.technologies || [],
      gallery: project.gallery || []
    });
    setEditingId(project.id);
    setIsModalOpen(true);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const updatedProjects = [...projects];
      
      if (editingId) {
        // Update existing
        const index = updatedProjects.findIndex(p => p.id === editingId);
        if (index !== -1) {
          updatedProjects[index] = { 
            ...updatedProjects[index], 
            ...data,
            id: editingId // Ensure ID is preserved
          };
        }
      } else {
        // Create new
        const newProject = {
          ...data,
          id: `project_${Date.now()}`,
          order: updatedProjects.length,
        };
        updatedProjects.push(newProject);
      }
      
      updateProjects(updatedProjects);
      setIsModalOpen(false);
      
      toast({
        title: editingId ? "Project updated!" : "Project created!",
        description: "Your changes have been saved successfully."
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error saving project",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteId) return;
    
    setLoading(true);
    
    try {
      const updatedProjects = projects
        .filter(p => p.id !== deleteId)
        .map((p, index) => ({ ...p, order: index }));
      
      updateProjects(updatedProjects);
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      
      toast({
        title: "Project deleted!",
        description: "The project has been removed successfully."
      });
    } catch (error) {
      toast({
        title: "Error deleting project",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle visibility
  const toggleVisibility = async (id) => {
    const updatedProjects = projects.map(p =>
      p.id === id ? { ...p, visible: !p.visible } : p
    );
    updateProjects(updatedProjects);
  };

  // Toggle featured
  const toggleFeatured = async (id) => {
    const updatedProjects = projects.map(p =>
      p.id === id ? { ...p, featured: !p.featured } : p
    );
    updateProjects(updatedProjects);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const openPreview = () => {
    window.open('/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <FolderOpen className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            Projects Section
          </h1>
          <p className="text-foreground/60 mt-1">
            Manage your project portfolio and showcase your work
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openPreview}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
          </button>
          
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
              <label htmlFor="projects-search" className="sr-only">
                Search project entries
              </label>
              <input
                id="projects-search"
                name="projects-search"
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                autoComplete="off"
                aria-label="Search project entries"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <div>
              <label htmlFor="projects-status-filter" className="sr-only">
                Filter by project status
              </label>
              <select
                id="projects-status-filter"
                name="projects-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                aria-label="Filter by project status"
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div>
              <label htmlFor="projects-category-filter" className="sr-only">
                Filter by project category
              </label>
              <select
                id="projects-category-filter"
                name="projects-category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                aria-label="Filter by project category"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="projects-sort" className="sr-only">
                Sort project entries
              </label>
              <select
                id="projects-sort"
                name="projects-sort"
                value={`${sortBy}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-');
                  setSortBy(field);
                  setSortDirection(direction);
                }}
                className="px-3 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                aria-label="Sort project entries"
              >
                <option value="order-asc">Order (A-Z)</option>
                <option value="startDate-desc">Date (Newest)</option>
                <option value="startDate-asc">Date (Oldest)</option>
                <option value="title-asc">Title (A-Z)</option>
              </select>
            </div>
          </div>

        <div className="mt-3 text-sm text-foreground/60">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full bg-card border border-border rounded-lg p-8 text-center">
            <FolderOpen className="h-12 w-12 text-foreground/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground/60 mb-2">No projects found</h3>
            <p className="text-foreground/40 mb-4">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? "Try adjusting your search or filters" 
                : "Get started by adding your first project"
              }
            </p>
            {!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && (
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Project
              </button>
            )}
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`bg-card border rounded-lg overflow-hidden transition-all hover:shadow-lg group ${
                !project.visible ? 'opacity-60' : ''
              }`}
            >
              {/* Project Image */}
              <div className="relative aspect-video bg-accent">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjMTYxNjE2Ii8+Cjx0ZXh0IHg9IjE2MCIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==';
                  }}
                />
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                      title="View Demo"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                      title="View Code"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                </div>

                {/* Status badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {project.featured && (
                    <span className="px-2 py-1 bg-yellow-500 text-yellow-900 text-xs rounded-full font-medium">
                      Featured
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    project.demoStatus === 'online' 
                      ? 'bg-green-500 text-green-900'
                      : project.demoStatus === 'offline'
                      ? 'bg-red-500 text-red-900'
                      : 'bg-yellow-500 text-yellow-900'
                  }`}>
                    {project.demoStatus}
                  </span>
                </div>

                {!project.visible && (
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-gray-500 text-white text-xs rounded-full">
                      Hidden
                    </span>
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => toggleVisibility(project.id)}
                      className={`p-1 rounded transition-colors ${
                        project.visible 
                          ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' 
                          : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      title={project.visible ? 'Hide from portfolio' : 'Show in portfolio'}
                    >
                      {project.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    
                    <button
                      onClick={() => toggleFeatured(project.id)}
                      className={`p-1 rounded transition-colors ${
                        project.featured 
                          ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' 
                          : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      title={project.featured ? 'Remove from featured' : 'Mark as featured'}
                    >
                      <Star className={`h-4 w-4 ${project.featured ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <p className="text-foreground/70 text-sm line-clamp-2 mb-3">
                  {project.description}
                </p>

                {project.category && (
                  <div className="mb-3">
                    <span className="px-2 py-1 bg-accent text-foreground text-xs rounded-md">
                      {project.category}
                    </span>
                  </div>
                )}

                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-1 bg-accent text-foreground/60 text-xs rounded-md">
                        +{project.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {(project.startDate || project.endDate) && (
                  <div className="flex items-center gap-1 text-xs text-foreground/60 mb-3">
                    <Calendar className="h-3 w-3" />
                    {formatDate(project.startDate)} - {formatDate(project.endDate) || 'Present'}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-foreground/40 cursor-move" />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit project"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => {
                        setDeleteId(project.id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Project" : "Add New Project"}
        description={editingId ? "Update the project details" : "Add a new project to your portfolio"}
        size="xl"
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" role="form" aria-label="Project entry form" noValidate>
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormField
                  {...field}
                  label="Project Title"
                  placeholder="e.g. E-commerce Platform"
                  required
                  error={form.formState.errors.title?.message}
                />
              )}
            />

            <Controller
              name="category"
              control={form.control}
              render={({ field }) => (
                <FormField
                  {...field}
                  label="Category"
                  placeholder="e.g. Web App, Mobile App"
                  error={form.formState.errors.category?.message}
                />
              )}
            />
          </div>

          {/* Description */}
          <Controller
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormField
                {...field}
                type="textarea"
                label="Short Description"
                placeholder="Brief description of the project..."
                required
                rows={3}
                error={form.formState.errors.description?.message}
                description="This will be shown in the project card"
              />
            )}
          />

          {/* Long Description */}
          <Controller
            name="longDescription"
            control={form.control}
            render={({ field }) => (
              <FormField
                {...field}
                type="textarea"
                label="Detailed Description (Optional)"
                placeholder="Detailed description, features, challenges, etc..."
                rows={4}
                error={form.formState.errors.longDescription?.message}
                description="Additional details for project page or modal"
              />
            )}
          />

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="image"
              control={form.control}
              render={({ field }) => (
                <FormField
                  {...field}
                  type="url"
                  label="Main Image URL"
                  placeholder="https://example.com/project-image.jpg"
                  required
                  error={form.formState.errors.image?.message}
                  description="Main project screenshot (16:9 aspect ratio recommended)"
                />
              )}
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Demo Status <span className="text-red-500">*</span>
              </label>
              <Controller
                name="demoStatus"
                control={form.control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                )}
              />
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="demoUrl"
              control={form.control}
              render={({ field }) => (
                <FormField
                  {...field}
                  type="url"
                  label="Demo URL"
                  placeholder="https://your-project-demo.com"
                  error={form.formState.errors.demoUrl?.message}
                />
              )}
            />

            <Controller
              name="githubUrl"
              control={form.control}
              render={({ field }) => (
                <FormField
                  {...field}
                  type="url"
                  label="GitHub URL"
                  placeholder="https://github.com/username/project"
                  error={form.formState.errors.githubUrl?.message}
                />
              )}
            />
          </div>

          {/* Tags and Technologies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tags</label>
              <input
                type="text"
                placeholder="Enter tags separated by commas (e.g. React, Node.js, MongoDB)"
                className="w-full px-3 py-2 border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                defaultValue={Array.isArray(form.watch('tags')) ? form.watch('tags').join(', ') : ''}
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                  form.setValue('tags', tags);
                }}
              />
              <p className="text-xs text-foreground/60 mt-1">Used for categorization and search</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Technologies</label>
              <input
                type="text"
                placeholder="Enter technologies separated by commas"
                className="w-full px-3 py-2 border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                defaultValue={Array.isArray(form.watch('technologies')) ? form.watch('technologies').join(', ') : ''}
                onChange={(e) => {
                  const technologies = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                  form.setValue('technologies', technologies);
                }}
              />
              <p className="text-xs text-foreground/60 mt-1">Technical stack used in the project</p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="startDate"
              control={form.control}
              render={({ field }) => (
                <FormField
                  {...field}
                  type="date"
                  label="Start Date"
                  error={form.formState.errors.startDate?.message}
                />
              )}
            />

            <Controller
              name="endDate"
              control={form.control}
              render={({ field }) => (
                <FormField
                  {...field}
                  type="date"
                  label="End Date"
                  description="Leave empty if project is ongoing"
                  error={form.formState.errors.endDate?.message}
                />
              )}
            />
          </div>

          {/* Options */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <Controller
                name="featured"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={onChange}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                )}
              />
              <span className="text-sm text-foreground">Featured project</span>
            </label>

            <label className="flex items-center gap-2">
              <Controller
                name="visible"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={onChange}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                )}
              />
              <span className="text-sm text-foreground">Visible in portfolio</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {editingId ? 'Update' : 'Create'} Project
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        size="sm"
      >
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectsAdmin; 