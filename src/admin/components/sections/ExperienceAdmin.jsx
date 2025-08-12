import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { experienceItemSchema } from '../../../data/schemas';
import usePortfolioStore from '../../store/portfolioStore';
import { useToast } from '@/hooks/use-toast';

// Import reusable components
import FormField from '../forms/FormField';
import Modal from '../forms/Modal';

import { 
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Save,
  X,
  Briefcase,
  Calendar,
  MapPin,
  Building,
  GripVertical,
  Eye,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';

export const ExperienceAdmin = () => {
  const { experience, updateExperience, reorderItems, isLoading, setLoading } = usePortfolioStore();
  const { toast } = useToast();
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('order');
  const [sortDirection, setSortDirection] = useState('asc');

  // Form setup
  const form = useForm({
    resolver: zodResolver(experienceItemSchema),
    mode: 'onSubmit', // Only validate on submit, not on change
    defaultValues: {
      id: '',
      title: '',
      company: '',
      type: 'On-site',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      skills: [],
      featured: false,
      visible: true,
      order: 0
    }
  });

  // Filter and sort experiences
  const filteredExperiences = experience
    .filter(exp => {
      const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exp.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || exp.type === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'startDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Open modal for new experience
  const handleCreate = () => {
    form.reset({
      id: '',
      title: '',
      company: '',
      type: 'On-site',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      skills: [],
      featured: false,
      visible: true,
      order: 0
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (exp) => {
    form.reset({
      ...exp,
      endDate: exp.endDate || '',
      skills: exp.skills || []
    });
    setEditingId(exp.id);
    setIsModalOpen(true);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const updatedExperiences = [...experience];
      
      if (editingId) {
        // Update existing
        const index = updatedExperiences.findIndex(exp => exp.id === editingId);
        if (index !== -1) {
          updatedExperiences[index] = { 
            ...updatedExperiences[index], 
            ...data,
            id: editingId // Ensure ID is preserved
          };
        }
      } else {
        // Create new
        const newExperience = {
          ...data,
          id: `exp_${Date.now()}`,
          order: updatedExperiences.length,
        };
        updatedExperiences.push(newExperience);
      }
      
      updateExperience(updatedExperiences);
      setIsModalOpen(false);
      
      toast({
        title: editingId ? "Experience updated!" : "Experience created!",
        description: "Your changes have been saved successfully."
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error saving experience",
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
      const updatedExperiences = experience
        .filter(exp => exp.id !== deleteId)
        .map((exp, index) => ({ ...exp, order: index })); // Reorder after deletion
      
      updateExperience(updatedExperiences);
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      
      toast({
        title: "Experience deleted!",
        description: "The experience has been removed successfully."
      });
    } catch (error) {
      toast({
        title: "Error deleting experience",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle visibility
  const toggleVisibility = async (id) => {
    const updatedExperiences = experience.map(exp =>
      exp.id === id ? { ...exp, visible: !exp.visible } : exp
    );
    updateExperience(updatedExperiences);
  };

  // Toggle featured
  const toggleFeatured = async (id) => {
    const updatedExperiences = experience.map(exp =>
      exp.id === id ? { ...exp, featured: !exp.featured } : exp
    );
    updateExperience(updatedExperiences);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
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
            <Briefcase className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            Experience Section
          </h1>
          <p className="text-foreground/60 mt-1">
            Manage your work experience and professional background
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
            Add Experience
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
              <input
                type="text"
                placeholder="Search experiences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
              />
            </div>
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortDirection}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-');
              setSortBy(field);
              setSortDirection(direction);
            }}
            className="px-3 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="order-asc">Order (A-Z)</option>
            <option value="startDate-desc">Date (Newest)</option>
            <option value="startDate-asc">Date (Oldest)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="company-asc">Company (A-Z)</option>
          </select>
        </div>

        <div className="mt-3 text-sm text-foreground/60">
          Showing {filteredExperiences.length} of {experience.length} experiences
        </div>
      </div>

      {/* Experience List */}
      <div className="space-y-3">
        {filteredExperiences.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <Briefcase className="h-12 w-12 text-foreground/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground/60 mb-2">No experiences found</h3>
            <p className="text-foreground/40 mb-4">
              {searchTerm || typeFilter !== 'all' 
                ? "Try adjusting your search or filters" 
                : "Get started by adding your first work experience"
              }
            </p>
            {!searchTerm && typeFilter === 'all' && (
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Experience
              </button>
            )}
          </div>
        ) : (
          filteredExperiences.map((exp) => (
            <div
              key={exp.id}
              className={`bg-card border rounded-lg p-4 transition-all hover:shadow-md ${
                !exp.visible ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <GripVertical className="h-4 w-4 text-foreground/40 cursor-move" />
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground text-lg">{exp.title}</h3>
                      {exp.featured && (
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
                          Featured
                        </span>
                      )}
                      {!exp.visible && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                          Hidden
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/70 mb-3">
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {exp.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {exp.location} • {exp.type}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </div>
                  </div>
                  
                  <p className="text-foreground/80 text-sm mb-3 line-clamp-2">
                    {exp.description}
                  </p>
                  
                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {exp.skills.slice(0, 6).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-accent text-foreground text-xs rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                      {exp.skills.length > 6 && (
                        <span className="px-2 py-1 bg-accent/50 text-foreground/60 text-xs rounded-md">
                          +{exp.skills.length - 6} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleVisibility(exp.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      exp.visible 
                        ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' 
                        : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    title={exp.visible ? 'Hide from portfolio' : 'Show in portfolio'}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleEdit(exp)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Edit experience"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => {
                      setDeleteId(exp.id);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete experience"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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
        title={editingId ? "Edit Experience" : "Add New Experience"}
        description={editingId ? "Update the experience details" : "Add a new work experience to your portfolio"}
        size="lg"
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormField
                  {...field}
                  label="Job Title"
                  placeholder="e.g. Software Engineer"
                  required
                  error={form.formState.errors.title?.message}
                />
              )}
            />

            <Controller
              name="company"
              control={form.control}
              render={({ field }) => (
                <FormField
                  {...field}
                  label="Company"
                  placeholder="e.g. Tech Corp"
                  required
                  error={form.formState.errors.company?.message}
                />
              )}
            />

            <Controller
              name="type"
              control={form.control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Work Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                  {form.formState.errors.type && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {form.formState.errors.type?.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="location"
              control={form.control}
              render={({ field }) => (
                <FormField
                  {...field}
                  label="Location"
                  placeholder="e.g. Jakarta, Indonesia"
                  required
                  error={form.formState.errors.location?.message}
                />
              )}
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="startDate"
              control={form.control}
              render={({ field }) => (
                <FormField
                  {...field}
                  type="date"
                  label="Start Date"
                  required
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
                  description="Leave empty if currently working"
                  error={form.formState.errors.endDate?.message}
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
                label="Job Description"
                placeholder="Describe your role and responsibilities..."
                required
                rows={4}
                error={form.formState.errors.description?.message}
              />
            )}
          />

          {/* Skills Input - Simple for now */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Skills & Technologies
            </label>
            <input
              type="text"
              placeholder="Enter skills separated by commas (e.g. React, Node.js, TypeScript)"
              className="w-full px-3 py-2 border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
              defaultValue={Array.isArray(form.watch('skills')) ? form.watch('skills').join(', ') : ''}
              onChange={(e) => {
                const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                form.setValue('skills', skills);
              }}
            />
            <p className="text-xs text-foreground/60 mt-1">
              Separate multiple skills with commas
            </p>
          </div>

          {/* Options */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                {...form.register('featured')}
                type="checkbox"
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">Featured experience</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                {...form.register('visible')}
                type="checkbox"
                className="rounded border-border text-primary focus:ring-primary"
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
                  {editingId ? 'Update' : 'Create'} Experience
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
        title="Delete Experience"
        description="Are you sure you want to delete this experience? This action cannot be undone."
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

export default ExperienceAdmin; 