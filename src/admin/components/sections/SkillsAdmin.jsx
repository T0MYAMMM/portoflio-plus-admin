import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { skillItemSchema } from '../../../data/schemas';
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
  Code2,
  FolderPlus,
  Search,
  GripVertical,
  Image,
  Tag
} from 'lucide-react';

export const SkillsAdmin = () => {
  const { skills, updateSkills, isLoading, setLoading } = usePortfolioStore();
  const { toast } = useToast();
  
  // Modal states
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [newCategoryName, setNewCategoryName] = useState('');

  // Form setup for skills
  const skillForm = useForm({
    resolver: zodResolver(skillItemSchema),
    mode: 'onSubmit', // Only validate on submit, not on change
    defaultValues: {
      id: '',
      name: '',
      logo: '',
      proficiencyLevel: 3,
      order: 0
    }
  });

  const categories = Object.keys(skills || {});
  const filteredCategories = selectedCategoryFilter === 'all' 
    ? categories 
    : [selectedCategoryFilter];

  // Get all skills for search
  const getAllSkills = () => {
    const allSkills = [];
    Object.entries(skills || {}).forEach(([categoryName, categorySkills]) => {
      categorySkills.forEach(skill => {
        allSkills.push({ ...skill, category: categoryName });
      });
    });
    return allSkills;
  };

  const filteredSkills = searchTerm 
    ? getAllSkills().filter(skill => 
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : null;

  // Handle create new skill
  const handleCreateSkill = (categoryName) => {
    skillForm.reset({
      id: '',
      name: '',
      logo: '',
      proficiencyLevel: 3,
      order: 0
    });
    setEditingSkill(null);
    setSelectedCategory(categoryName);
    setIsSkillModalOpen(true);
  };

  // Handle edit skill
  const handleEditSkill = (skill, categoryName) => {
    skillForm.reset(skill);
    setEditingSkill(skill);
    setSelectedCategory(categoryName);
    setIsSkillModalOpen(true);
  };

  // Handle skill form submission
  const onSkillSubmit = async (data) => {
    setLoading(true);
    
    try {
      const updatedSkills = { ...skills };
      
      if (editingSkill) {
        // Update existing skill
        const categorySkills = updatedSkills[selectedCategory] || [];
        const skillIndex = categorySkills.findIndex(s => s.id === editingSkill.id);
        if (skillIndex !== -1) {
          categorySkills[skillIndex] = { 
            ...categorySkills[skillIndex], 
            ...data,
            id: editingSkill.id // Ensure ID is preserved
          };
        }
      } else {
        // Create new skill
        const newSkill = {
          ...data,
          id: `skill_${Date.now()}`,
          order: (updatedSkills[selectedCategory] || []).length
        };
        
        if (!updatedSkills[selectedCategory]) {
          updatedSkills[selectedCategory] = [];
        }
        updatedSkills[selectedCategory].push(newSkill);
      }
      
      updateSkills(updatedSkills);
      setIsSkillModalOpen(false);
      
      toast({
        title: editingSkill ? "Skill updated!" : "Skill created!",
        description: "Your changes have been saved successfully."
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error saving skill",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle create new category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    setLoading(true);
    
    try {
      const updatedSkills = { ...skills };
      updatedSkills[newCategoryName.trim()] = [];
      
      updateSkills(updatedSkills);
      setNewCategoryName('');
      setIsCategoryModalOpen(false);
      
      toast({
        title: "Category created!",
        description: "New skill category has been added."
      });
    } catch (error) {
      toast({
        title: "Error creating category",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete skill or category
  const handleDelete = async () => {
    if (!deleteItem) return;
    
    setLoading(true);
    
    try {
      const updatedSkills = { ...skills };
      
      if (deleteItem.type === 'skill') {
        // Delete skill
        const categorySkills = updatedSkills[deleteItem.category] || [];
        updatedSkills[deleteItem.category] = categorySkills.filter(s => s.id !== deleteItem.skill.id);
      } else if (deleteItem.type === 'category') {
        // Delete entire category
        delete updatedSkills[deleteItem.category];
      }
      
      updateSkills(updatedSkills);
      setIsDeleteModalOpen(false);
      setDeleteItem(null);
      
      toast({
        title: `${deleteItem.type === 'skill' ? 'Skill' : 'Category'} deleted!`,
        description: "The item has been removed successfully."
      });
    } catch (error) {
      toast({
        title: "Error deleting item",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
            <Code2 className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            Skills Section
          </h1>
          <p className="text-foreground/60 mt-1">
            Manage your technical skills organized by categories
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
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <FolderPlus className="h-4 w-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
              <input
                type="text"
                placeholder="Search skills and categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="mt-3 text-sm text-foreground/60">
          {searchTerm ? (
            `Found ${filteredSkills?.length || 0} skills`
          ) : (
            `${categories.length} categories, ${getAllSkills().length} total skills`
          )}
        </div>
      </div>

      {/* Skills Content */}
      <div className="space-y-6">
        {searchTerm ? (
          // Search Results View
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Search Results</h2>
            {filteredSkills?.length === 0 ? (
              <p className="text-foreground/60 text-center py-8">No skills found matching your search.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSkills?.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <img src={skill.logo} alt={skill.name} className="w-8 h-8 object-contain" />
                      <div>
                        <p className="font-medium">{skill.name}</p>
                        <p className="text-sm text-foreground/60">{skill.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditSkill(skill, skill.category)}
                        className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteItem({ type: 'skill', skill, category: skill.category });
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Category View
          filteredCategories.map(categoryName => (
            <div key={categoryName} className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Tag className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">{categoryName}</h2>
                  <span className="text-sm text-foreground/60">
                    ({(skills[categoryName] || []).length} skills)
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCreateSkill(categoryName)}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Skill
                  </button>
                  
                  <button
                    onClick={() => {
                      setDeleteItem({ type: 'category', category: categoryName });
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {(skills[categoryName] || []).length === 0 ? (
                <div className="text-center py-8 text-foreground/60">
                  <Code2 className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No skills in this category yet.</p>
                  <button
                    onClick={() => handleCreateSkill(categoryName)}
                    className="mt-2 text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Add your first skill
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {(skills[categoryName] || []).map((skill) => (
                    <div
                      key={skill.id}
                      className="group flex items-center gap-3 p-3 border border-border rounded-lg hover:shadow-md transition-all"
                    >
                      <GripVertical className="h-4 w-4 text-foreground/40 cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <img 
                        src={skill.logo} 
                        alt={skill.name} 
                        className="w-8 h-8 object-contain flex-shrink-0"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzE2MTYxNiIvPgo8dGV4dCB4PSIxNiIgeT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Pz88L3RleHQ+Cjwvc3ZnPg==';
                        }}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{skill.name}</p>
                        {skill.proficiencyLevel && (
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < skill.proficiencyLevel ? 'bg-primary' : 'bg-foreground/20'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditSkill(skill, categoryName)}
                          className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                          title="Edit skill"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteItem({ type: 'skill', skill, category: categoryName });
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          title="Delete skill"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {categories.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <Code2 className="h-12 w-12 text-foreground/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground/60 mb-2">No skill categories yet</h3>
            <p className="text-foreground/40 mb-4">
              Create your first skill category to get started
            </p>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <FolderPlus className="h-4 w-4" />
              Create Category
            </button>
          </div>
        )}
      </div>

      {/* Skill Create/Edit Modal */}
      <Modal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        title={editingSkill ? "Edit Skill" : "Add New Skill"}
        description={`${editingSkill ? 'Update' : 'Add'} skill in ${selectedCategory} category`}
        size="md"
      >
        <form onSubmit={skillForm.handleSubmit(onSkillSubmit)} className="space-y-4">
          <Controller
            name="name"
            control={skillForm.control}
            render={({ field }) => (
              <FormField
                {...field}
                label="Skill Name"
                placeholder="e.g. React, Python, Docker"
                required
                error={skillForm.formState.errors.name?.message}
              />
            )}
          />

          <Controller
            name="logo"
            control={skillForm.control}
            render={({ field }) => (
              <FormField
                {...field}
                type="url"
                label="Logo URL"
                placeholder="https://example.com/logo.svg"
                required
                error={skillForm.formState.errors.logo?.message}
                description="SVG logos work best (try devicons.dev or simpleicons.org)"
              />
            )}
          />

          <Controller
            name="proficiencyLevel"
            control={skillForm.control}
            render={({ field: { onChange, value, ...field } }) => (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Proficiency Level
                </label>
                <select
                  {...field}
                  value={value}
                  onChange={(e) => onChange(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value={1}>1 - Beginner</option>
                  <option value={2}>2 - Basic</option>
                  <option value={3}>3 - Intermediate</option>
                  <option value={4}>4 - Advanced</option>
                  <option value={5}>5 - Expert</option>
                </select>
              </div>
            )}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setIsSkillModalOpen(false)}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {editingSkill ? 'Update' : 'Create'} Skill
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Category Create Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Create New Category"
        description="Add a new skill category to organize your skills"
        size="sm"
      >
        <div className="space-y-4">
          <FormField
            label="Category Name"
            placeholder="e.g. Frontend, Backend, DevOps"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(false)}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={handleCreateCategory}
              disabled={isLoading || !newCategoryName.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create Category
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={`Delete ${deleteItem?.type === 'skill' ? 'Skill' : 'Category'}`}
        description={`Are you sure you want to delete this ${deleteItem?.type}? This action cannot be undone.`}
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

export default SkillsAdmin; 