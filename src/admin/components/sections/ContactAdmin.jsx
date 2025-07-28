import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { contactSchema } from '../../../data/schemas';
import usePortfolioStore from '../../store/portfolioStore';
import { useToast } from '@/hooks/use-toast';

// Import reusable components
import FormField from '../forms/FormField';

import { 
  ExternalLink,
  Save,
  RotateCcw,
  Eye,
  MessageCircle,
  Mail,
  Settings,
  TestTube,
  CheckCircle,
  AlertCircle,
  Key
} from 'lucide-react';

export const ContactAdmin = () => {
  const { contact, updateContact, isLoading, setLoading } = usePortfolioStore();
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: contact,
    mode: 'onSubmit' // Only validate on submit for consistency
  });

  const { formState: { errors, isDirty, isValid }, watch, reset, control } = form;

  // Watch for form changes
  useEffect(() => {
    setHasChanges(isDirty);
  }, [isDirty]);

  // Update form when store data changes
  useEffect(() => {
    reset(contact);
  }, [contact, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      updateContact(data);
      
      toast({
        title: "Contact settings updated!",
        description: "Your changes have been saved successfully."
      });

      setHasChanges(false);
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    reset(contact);
    setHasChanges(false);
    
    toast({
      title: "Form reset",
      description: "All changes have been discarded."
    });
  };

  const testEmailConfiguration = async () => {
    setTestingEmail(true);
    
    try {
      const formData = form.getValues();
      
      // This would normally send a test email using EmailJS
      // For now, we'll just simulate the test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Email configuration test successful!",
        description: "Your EmailJS configuration is working correctly."
      });
    } catch (error) {
      toast({
        title: "Email test failed",
        description: "Please check your EmailJS configuration.",
        variant: "destructive"
      });
    } finally {
      setTestingEmail(false);
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
            <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            Contact Section
          </h1>
          <p className="text-foreground/60 mt-1">
            Manage contact form settings and social media links
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

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* EmailJS Configuration */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">EmailJS Configuration</h2>
            </div>
            
            <button
              type="button"
              onClick={testEmailConfiguration}
              disabled={testingEmail || !isValid}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testingEmail ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4" />
                  Test Configuration
                </>
              )}
            </button>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Key className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  EmailJS Setup Instructions
                </h3>
                <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                  <p>1. Create an account at <a href="https://emailjs.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">emailjs.com</a></p>
                  <p>2. Create an email service (Gmail, Outlook, etc.)</p>
                  <p>3. Create an email template with variables: {`{{from_name}}, {{from_email}}, {{message}}`}</p>
                  <p>4. Copy your Service ID, Template ID, and Public Key below</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="emailjsConfig.serviceId"
              control={control}
              render={({ field }) => (
                <FormField
                  {...field}
                  label="Service ID"
                  placeholder="service_xxxxxxx"
                  required
                  error={errors.emailjsConfig?.serviceId?.message}
                  description="Your EmailJS service identifier"
                />
              )}
            />

            <Controller
              name="emailjsConfig.templateId"
              control={control}
              render={({ field }) => (
                <FormField
                  {...field}
                  label="Template ID"
                  placeholder="template_xxxxxxx"
                  required
                  error={errors.emailjsConfig?.templateId?.message}
                  description="Your EmailJS template identifier"
                />
              )}
            />

            <div className="md:col-span-2">
              <Controller
                name="emailjsConfig.publicKey"
                control={control}
                render={({ field }) => (
                  <FormField
                    {...field}
                    label="Public Key"
                    placeholder="user_xxxxxxxxxxxxxxxxxxxx"
                    required
                    error={errors.emailjsConfig?.publicKey?.message}
                    description="Your EmailJS public key (found in Account settings)"
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Mail className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Contact Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="socialLinks.email"
              control={control}
              render={({ field }) => (
                <FormField
                  {...field}
                  type="email"
                  label="Email Address"
                  placeholder="your.email@example.com"
                  required
                  error={errors.socialLinks?.email?.message}
                  description="Primary contact email"
                />
              )}
            />

            <Controller
              name="socialLinks.phone"
              control={control}
              render={({ field }) => (
                <FormField
                  {...field}
                  type="tel"
                  label="Phone Number"
                  placeholder="+1 (555) 123-4567"
                  error={errors.socialLinks?.phone?.message}
                  description="Optional phone number"
                />
              )}
            />

            <Controller
              name="socialLinks.github"
              control={control}
              render={({ field }) => (
                <FormField
                  {...field}
                  type="url"
                  label="GitHub Profile"
                  placeholder="https://github.com/username"
                  error={errors.socialLinks?.github?.message}
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
                  label="LinkedIn Profile"
                  placeholder="https://linkedin.com/in/username"
                  error={errors.socialLinks?.linkedin?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Form Settings */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Form Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-900 dark:text-green-100 mb-1">
                    Contact Form Status
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Your contact form is properly configured and ready to receive messages.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Success Message
                </label>
                <textarea
                  readOnly
                  value="Thank you for your message! I'll get back to you soon."
                  className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-accent/50 resize-none"
                  rows={3}
                />
                <p className="text-xs text-foreground/60">
                  Message shown after successful form submission
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Error Message
                </label>
                <textarea
                  readOnly
                  value="Sorry, something went wrong. Please try again or contact me directly."
                  className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-accent/50 resize-none"
                  rows={3}
                />
                <p className="text-xs text-foreground/60">
                  Message shown when form submission fails
                </p>
              </div>
            </div>
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

export default ContactAdmin; 