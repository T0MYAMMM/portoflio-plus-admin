import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { educationItemSchema } from '../../../data/schemas';
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
  GraduationCap,
  Calendar,
  MapPin,
  Building,
  GripVertical,
  Eye,
  Search,
  Award,
  FileText
} from 'lucide-react';

export const EducationAdmin = () => {
  const { education, updateEducation, isLoading, setLoading } = usePortfolioStore();
  const { toast } = useToast();
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('order');
  const [sortDirection, setSortDirection] = useState('asc');

  // Form setup
  const form = useForm({
    resolver: zodResolver(educationItemSchema),
    mode: 'onSubmit', // Only validate on submit, not on change
    defaultValues: {
      id: '',
      degree: '',
      institution: '',
      startDate: '',
      endDate: '',
      grade: '',
      description: '',
      certificateUrl: '',
      order: 0
    }
  });

  // Filter and sort education entries
  const filteredEducation = education
    .filter(edu => {
      const matchesSearch = edu.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           edu.institution.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'startDate' || sortBy === 'endDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Open modal for new education
  const handleCreate = () => {
    form.reset({
      id: '',
      degree: '',
      institution: '',
      startDate: '',
      endDate: '',
      grade: '',
      description: '',
      certificateUrl: '',
      order: 0
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (edu) => {
    form.reset(edu);
    setEditingId(edu.id);
    setIsModalOpen(true);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const updatedEducation = [...education];
      
      if (editingId) {
        // Update existing
        const index = updatedEducation.findIndex(edu => edu.id === editingId);
        if (index !== -1) {
          updatedEducation[index] = { 
            ...updatedEducation[index], 
            ...data,
            id: editingId // Ensure ID is preserved
          };
        }
      } else {
        // Create new
        const newEducation = {
          ...data,
          id: `edu_${Date.now()}`,
          order: updatedEducation.length,
        };
        updatedEducation.push(newEducation);
      }
      
      updateEducation(updatedEducation);
      setIsModalOpen(false);
      
      toast({
        title: editingId ? "Education updated!" : "Education created!",
        description: "Your changes have been saved successfully."
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error saving education",
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
      const updatedEducation = education
        .filter(edu => edu.id !== deleteId)
        .map((edu, index) => ({ ...edu, order: index })); // Reorder after deletion
      
      updateEducation(updatedEducation);
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      
      toast({
        title: "Education deleted!",
        description: "The education entry has been removed successfully."
      });
    } catch (error) {
      toast({
        title: "Error deleting education",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
            <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            Education Section
          </h1>
          <p className="text-foreground/60 mt-1">
            Manage your educational background and certifications
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
            Add Education
          </button>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
              <label htmlFor="education-search" className="sr-only">
                Search education entries
              </label>
              <input
                id="education-search"
                name="education-search"
                type="text"
                placeholder="Search education..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                autoComplete="off"
                aria-label="Search education entries"
              />
            </div>
          </div>

          {/* Sort */}
          <div>
            <label htmlFor="education-sort" className="sr-only">
              Sort education entries
            </label>
            <select
              id="education-sort"
              name="education-sort"
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSortBy(field);
                setSortDirection(direction);
              }}
              className="px-3 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              aria-label="Sort education entries"
            >
              <option value="order-asc">Order (A-Z)</option>
              <option value="endDate-desc">Graduation (Newest)</option>
              <option value="endDate-asc">Graduation (Oldest)</option>
              <option value="degree-asc">Degree (A-Z)</option>
              <option value="institution-asc">Institution (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="mt-3 text-sm text-foreground/60">
          Showing {filteredEducation.length} of {education.length} education entries
        </div>
      </div>

      {/* Education List */}
      <div className="space-y-3">
        {filteredEducation.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <GraduationCap className="h-12 w-12 text-foreground/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground/60 mb-2">No education entries found</h3>
            <p className="text-foreground/40 mb-4">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Get started by adding your educational background"
              }
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Education
              </button>
            )}
          </div>
        ) : (
          filteredEducation.map((edu) => (
            <div
              key={edu.id}
              className="bg-card border rounded-lg p-4 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <GripVertical className="h-4 w-4 text-foreground/40 cursor-move" />
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground text-lg">{edu.degree}</h3>
                      {edu.certificateUrl && (
                        <Award className="h-4 w-4 text-yellow-600" title="Has certificate" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/70 mb-3">
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {edu.institution}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </div>
                    {edu.grade && (
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        {edu.grade}
                      </div>
                    )}
                  </div>
                  
                  {edu.description && (
                    <p className="text-foreground/80 text-sm mb-3 line-clamp-2">
                      {edu.description}
                    </p>
                  )}
                  
                  {edu.certificateUrl && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <a
                        href={edu.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                      >
                        View Certificate
                      </a>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(edu)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Edit education"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => {
                      setDeleteId(edu.id);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete education"
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
        title={editingId ? "Edit Education" : "Add New Education"}
        description={editingId ? "Update the education details" : "Add a new education entry to your portfolio"}
        size="lg"
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" role="form" aria-label="Education entry form" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Controller
                name="degree"
                control={form.control}
                render={({ field }) => (
                  <FormField
                    {...field}
                    label="Degree / Program"
                    placeholder="e.g. Bachelor of Computer Science"
                    required
                    error={form.formState.errors.degree?.message}
                  />
                )}
              />
            </div>

            <div className="md:col-span-2">
              <Controller
                name="institution"
                control={form.control}
                render={({ field }) => (
                  <FormField
                    {...field}
                    label="Institution"
                    placeholder="e.g. University of Technology"
                    required
                    error={form.formState.errors.institution?.message}
                  />
                )}
              />
            </div>

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
                  label="End Date / Graduation"
                  required
                  error={form.formState.errors.endDate?.message}
                />
              )}
            />

            <Controller
              name="grade"
              control={form.control}
              render={({ field }) => (
                <FormField
                  {...field}
                  label="Grade / GPA"
                  placeholder="e.g. 3.8/4.0, Magna Cum Laude"
                  error={form.formState.errors.grade?.message}
                />
              )}
            />

            <Controller
              name="certificateUrl"
              control={form.control}
              render={({ field }) => (
                <FormField
                  {...field}
                  type="url"
                  label="Certificate URL"
                  placeholder="https://example.com/certificate.pdf"
                  error={form.formState.errors.certificateUrl?.message}
                  description="Link to diploma or certificate"
                />
              )}
            />
          </div>

          <Controller
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormField
                {...field}
                type="textarea"
                label="Description (Optional)"
                placeholder="Additional details about your education, achievements, or relevant coursework..."
                rows={3}
                error={form.formState.errors.description?.message}
              />
            )}
          />

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
                  {editingId ? 'Update' : 'Create'} Education
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
        title="Delete Education"
        description="Are you sure you want to delete this education entry? This action cannot be undone."
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

export default EducationAdmin; 