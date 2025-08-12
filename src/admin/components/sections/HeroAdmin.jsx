import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { heroSchema } from '../../../data/schemas';
import usePortfolioStore from '../../store/portfolioStore';
import { useToast } from '@/hooks/use-toast';

// Import our reusable components
import FormField from '../forms/FormField';
import FileUpload from '../forms/FileUpload';

import { 
  ExternalLink, 
  Save, 
  RotateCcw, 
  Eye, 
  Upload,
  User,
  Link,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const HeroAdmin = () => {
  const { hero, updateHero, isLoading, setLoading } = usePortfolioStore();
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const form = useForm({
    resolver: zodResolver(heroSchema),
    defaultValues: hero,
    mode: 'onSubmit' // Only validate on submit, not on change
  });

  const { formState: { errors, isDirty, isValid }, watch, reset, control } = form;

  // Watch for form changes
  useEffect(() => {
    setHasChanges(isDirty);
  }, [isDirty]);

  // Update form when store data changes
  useEffect(() => {
    reset(hero);
  }, [hero, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      // If profile image was uploaded, update the URL
      if (profileImage) {
        data.personalInfo.profileImage = profileImage.url;
      }

      updateHero(data);
      
      toast({
        title: "Hero section updated!",
        description: "Your changes have been saved successfully."
      });

      setHasChanges(false);
    } catch (error) {
      toast({
        title: "Error saving changes",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    reset(hero);
    setProfileImage(null);
    setHasChanges(false);
    
    toast({
      title: "Form reset",
      description: "All changes have been discarded.",
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
            <User className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            Hero Section
          </h1>
          <p className="text-foreground/60 mt-1">
            Manage your personal information and main portfolio introduction
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
          
          {hasChanges && (
            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              Unsaved changes
            </div>
          )}
        </div>
              </div>


      
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" role="form" aria-label="Hero section configuration form" noValidate>
        {/* Personal Information Section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <Controller
                name="personalInfo.name"
                control={control}
                render={({ field }) => (
                  <FormField
                    {...field}
                    label="Full Name"
                    placeholder="Enter your full name"
                    required
                    error={errors.personalInfo?.name?.message}
                    description="This will be displayed as your main heading"
                    autoComplete="name"
                  />
                )}
              />

              <Controller
                name="personalInfo.description"
                control={control}
                render={({ field }) => (
                  <FormField
                    {...field}
                    type="textarea"
                    label="Description"
                    placeholder="Brief description about yourself..."
                    required
                    rows={4}
                    error={errors.personalInfo?.description?.message}
                    description="A short bio that appears below your name"
                    autoComplete="off"
                  />
                )}
              />

              <Controller
                name="personalInfo.resumeUrl"
                control={control}
                render={({ field }) => (
                  <FormField
                    {...field}
                    type="url"
                    label="Resume URL"
                    placeholder="https://example.com/resume.pdf"
                    error={errors.personalInfo?.resumeUrl?.message}
                    description="Link to your resume (Google Drive, PDF, etc.)"
                    autoComplete="url"
                  />
                )}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Profile Image Upload */}
              <FileUpload
                label="Profile Image"
                description="Upload a profile photo (recommended: 400x400px)"
                value={profileImage}
                onChange={setProfileImage}
                accept={{
                  'image/*': ['.jpeg', '.jpg', '.png', '.webp']
                }}
                maxSize={2 * 1024 * 1024} // 2MB
              />

              {/* Current Image Preview */}
              {hero.personalInfo.profileImage && !profileImage && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Current Profile Image
                  </label>
                  <div className="w-32 h-32 border-2 border-border rounded-lg overflow-hidden">
                    <img 
                      src={hero.personalInfo.profileImage} 
                      alt="Current profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rotating Titles */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Rotating Titles <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-foreground/60 mb-3">These titles will rotate automatically on your homepage</p>
            
            {/* Manual titles management for now */}
            <div className="space-y-2">
              {form.watch('personalInfo.titles')?.map((title, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    {...form.register(`personalInfo.titles.${index}`)}
                    placeholder={`Title ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background transition-colors"
                    autoComplete="off"
                  />
                  {form.watch('personalInfo.titles').length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const currentTitles = form.getValues('personalInfo.titles');
                        const newTitles = currentTitles.filter((_, i) => i !== index);
                        form.setValue('personalInfo.titles', newTitles);
                        form.trigger('personalInfo.titles');
                      }}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => {
                  const currentTitles = form.getValues('personalInfo.titles') || [];
                  if (currentTitles.length < 8) {
                    form.setValue('personalInfo.titles', [...currentTitles, '']);
                    form.trigger('personalInfo.titles');
                  }
                }}
                disabled={form.watch('personalInfo.titles')?.length >= 8}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border-2 border-dashed border-border hover:border-primary text-foreground/70 hover:text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                + Add Title
              </button>
            </div>
            
            {errors.personalInfo?.titles && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                {errors.personalInfo.titles.message}
              </p>
            )}
          </div>
        </div>

        {/* Social Links Section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Link className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Social Links</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="socialLinks.github"
              control={control}
              render={({ field }) => (
                <FormField
                  {...field}
                  type="url"
                  label="GitHub"
                  placeholder="https://github.com/username"
                  error={errors.socialLinks?.github?.message}
                  autoComplete="url"
                />
              )}
            />

            <Controller
              name="socialLinks.linkedin"
              control={control}
              render={({ field }) => (
                <FormField
                  {...field}
                  type="url"
                  label="LinkedIn"
                  placeholder="https://linkedin.com/in/username"
                  error={errors.socialLinks?.linkedin?.message}
                  autoComplete="url"
                />
              )}
            />

            <Controller
              name="socialLinks.leetcode"
              control={control}
              render={({ field }) => (
                <FormField
                  {...field}
                  type="url"
                  label="LeetCode"
                  placeholder="https://leetcode.com/username"
                  error={errors.socialLinks?.leetcode?.message}
                  autoComplete="url"
                />
              )}
            />

            <Controller
              name="socialLinks.email"
              control={control}
              render={({ field }) => (
                <FormField
                  {...field}
                  type="email"
                  label="Email"
                  placeholder="your.email@example.com"
                  required
                  error={errors.socialLinks?.email?.message}
                  autoComplete="email"
                />
              )}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-border">
          <div className="text-sm text-foreground/60">
            {!isValid ? (
              <span className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                Please fix validation errors
              </span>
            ) : hasChanges ? (
              <span className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                You have unsaved changes
              </span>
            ) : (
              "All changes saved"
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={!hasChanges || isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>

            <button
              type="button"
              onClick={openPreview}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>

            <button
              type="submit"
              disabled={!hasChanges || isLoading || !isValid}
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
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HeroAdmin; 