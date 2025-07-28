import { z } from 'zod';

// Hero Section Schema
export const heroSchema = z.object({
  personalInfo: z.object({
    name: z.string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    titles: z.array(z.string().min(1, "Title cannot be empty"))
      .min(1, "At least one title is required")
      .max(10, "Maximum 10 titles allowed"),
    description: z.string()
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description must be less than 500 characters"),
    profileImage: z.string().url().optional().or(z.literal("")),
    resumeUrl: z.string().url().optional().or(z.literal("")),
  }),
  socialLinks: z.object({
    github: z.string().url().optional().or(z.literal("")),
    leetcode: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    email: z.string().email("Invalid email format"),
  }),
});

// Experience Section Schema
export const experienceItemSchema = z.object({
  id: z.string().optional(),
  title: z.string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be less than 100 characters"),
  company: z.string()
    .min(2, "Company must be at least 2 characters")
    .max(100, "Company must be less than 100 characters"),
  type: z.enum(['On-site', 'Hybrid', 'Remote'], {
    errorMap: () => ({ message: "Type must be On-site, Hybrid, or Remote" })
  }),
  location: z.string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be less than 100 characters"),
  startDate: z.string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid start date"),
  endDate: z.string()
    .optional()
    .refine((date) => !date || date === "" || !isNaN(Date.parse(date)), "Invalid end date")
    .transform((date) => date === "" ? null : date),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  skills: z.array(z.string())
    .max(20, "Maximum 20 skills allowed"),
  order: z.number().int().min(0).optional(),
  featured: z.boolean().default(false),
  visible: z.boolean().default(true),
});

export const experienceSchema = z.object({
  experience: z.array(experienceItemSchema)
});

// Education Section Schema
export const educationItemSchema = z.object({
  id: z.string().optional(),
  degree: z.string()
    .min(2, "Degree must be at least 2 characters")
    .max(200, "Degree must be less than 200 characters"),
  institution: z.string()
    .min(2, "Institution must be at least 2 characters")
    .max(200, "Institution must be less than 200 characters"),
  startDate: z.string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid start date"),
  endDate: z.string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid end date"),
  grade: z.string()
    .max(50, "Grade must be less than 50 characters")
    .optional(),
  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  certificateUrl: z.string().url().optional().or(z.literal("")),
  order: z.number().int().min(0).optional(),
});

export const educationSchema = z.object({
  education: z.array(educationItemSchema)
});

// Skills Section Schema
export const skillItemSchema = z.object({
  id: z.string().optional(),
  name: z.string()
    .min(1, "Skill name is required")
    .max(50, "Skill name must be less than 50 characters"),
  logo: z.string().url("Invalid logo URL"),
  proficiencyLevel: z.number().min(1).max(5).optional(),
  order: z.number().int().min(0).optional(),
});

export const skillCategorySchema = z.record(
  z.string(),
  z.array(skillItemSchema)
);

export const skillsSchema = z.object({
  skills: skillCategorySchema
});

// Projects Section Schema
export const projectItemSchema = z.object({
  id: z.string().optional(),
  title: z.string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  longDescription: z.string()
    .max(2000, "Long description must be less than 2000 characters")
    .optional(),
  image: z.string().url("Invalid image URL"),
  gallery: z.array(z.string().url())
    .max(10, "Maximum 10 gallery images allowed")
    .optional(),
  tags: z.array(z.string())
    .max(15, "Maximum 15 tags allowed")
    .optional(),
  demoUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  demoStatus: z.enum(['online', 'offline', 'maintenance'], {
    errorMap: () => ({ message: "Status must be online, offline, or maintenance" })
  }),
  featured: z.boolean().default(false),
  category: z.string().optional(),
  technologies: z.array(z.string())
    .max(20, "Maximum 20 technologies allowed")
    .optional(),
  startDate: z.string()
    .refine((date) => date === "" || !isNaN(Date.parse(date)), "Invalid start date")
    .optional(),
  endDate: z.string()
    .refine((date) => date === "" || !isNaN(Date.parse(date)), "Invalid end date")
    .optional(),
  order: z.number().int().min(0).optional(),
  visible: z.boolean().default(true),
});

export const projectsSchema = z.object({
  projects: z.array(projectItemSchema)
});

// Contact Section Schema
export const contactSchema = z.object({
  emailjsConfig: z.object({
    serviceId: z.string().min(1, "Service ID is required"),
    templateId: z.string().min(1, "Template ID is required"),
    publicKey: z.string().min(1, "Public key is required"),
  }),
  socialLinks: z.object({
    github: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    email: z.string().email("Invalid email format"),
    phone: z.string().optional().or(z.literal("")),
  }),
});

// Form-specific schemas for individual operations
export const addExperienceSchema = experienceItemSchema.omit({ id: true, order: true });
export const editExperienceSchema = experienceItemSchema.partial({ id: true });

export const addEducationSchema = educationItemSchema.omit({ id: true, order: true });
export const editEducationSchema = educationItemSchema.partial({ id: true });

export const addProjectSchema = projectItemSchema.omit({ id: true, order: true });
export const editProjectSchema = projectItemSchema.partial({ id: true });

export const addSkillSchema = skillItemSchema.omit({ id: true, order: true });
export const editSkillSchema = skillItemSchema.partial({ id: true });

// Utility function to validate data
export const validateData = (schema, data) => {
  try {
    return {
      success: true,
      data: schema.parse(data),
      errors: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      errors: error.errors
    };
  }
};

// Utility function to get error messages
export const getErrorMessages = (errors) => {
  if (!errors || !Array.isArray(errors)) return [];
  
  return errors.map(error => ({
    path: error.path.join('.'),
    message: error.message
  }));
}; 