import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePortfolioStore = create(
  persist(
    (set, get) => ({
      // Data state - initialized with current portfolio data
      hero: {
        personalInfo: {
          name: "Thomas Stefen Mardianto",
          titles: [
            "Full Stack Developer",
            "Passionate about AI/ML", 
            "Tech Enthusiast",
            "Problem Solver"
          ],
          description: "Information System and Technology ITB graduate who interested in software, data, and AI engineering. Experienced in developing products, pipelines, and automations.",
          profileImage: "/tsMain.png",
          resumeUrl: "https://drive.google.com/file/d/1mIpGnOYt63MbRmYkAYR9uBeyi6XtXVEm/view"
        },
        socialLinks: {
          github: "https://github.com/T0MYAMMM",
          leetcode: "https://leetcode.com/u/t0myam/",
          linkedin: "https://www.linkedin.com/in/thomasstefenm/",
          email: "thomasstefenm@gmail.com"
        }
      },

      experience: [
        {
          id: "exp_1",
          title: 'Data Engineer',
          company: 'Nolimit Indonesia',
          type: 'On-site',
          location: 'Jakarta',
          startDate: '2023-12-11',
          endDate: null,
          description: 'Build automated extraction tools and data pipelines using Django, Scrapy, Celery and Kafka. Also, build monitoring tools using Grafana and Prometheus.',
          skills: ['Scrapy', 'Playwright', 'Celery', 'Kafka'],
          order: 0,
          featured: true,
          visible: true
        },
        {
          id: "exp_2",
          title: 'IT Associate Consultant Intern',
          company: 'Altha Consulting',
          type: 'Hybrid',
          location: 'Jakarta',
          startDate: '2023-08-14',
          endDate: '2023-12-08',
          description: 'Participated in infrastructure and application assessment for an ERP system audit, involved on national data center assessment.',
          skills: ['ERP', 'Data Center', 'Infrastructure', 'Security'],
          order: 1,
          featured: false,
          visible: true
        },
        {
          id: "exp_3",
          title: 'Project Manager',
          company: 'Inkubator IT Himpunan Mahasiswa Informatika',
          type: 'Remote',
          location: 'Bandung',
          startDate: '2022-03-10',
          endDate: '2023-04-18',
          description: 'Managed projects from planning to deployment.',
          skills: ['Git', 'CI/CD', 'Trello', 'Figma'],
          order: 2,
          featured: false,
          visible: true
        }
      ],

      education: [
        {
          id: "edu_1",
          degree: "B.Sc Information System and Technology (IST)",
          institution: "Institut Teknologi Bandung (ITB)",
          startDate: "2020-08-01",
          endDate: "2024-07-31",
          grade: "3.25",
          description: "",
          certificateUrl: "",
          order: 0
        },
        {
          id: "edu_2", 
          degree: "Natural Science - Class XVIII",
          institution: "Semesta Bilingual Boarding School - Semarang",
          startDate: "2017-07-01",
          endDate: "2020-06-30",
          grade: "93.85",
          description: "",
          certificateUrl: "",
          order: 1
        }
      ],

      skills: {
        "Languages": [
          { id: "lang_1", name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", order: 0 },
          { id: "lang_2", name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", order: 1 },
          { id: "lang_3", name: "Java", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", order: 2 },
          { id: "lang_4", name: "Scala", logo: "https://www.vectorlogo.zone/logos/scala-lang/scala-lang-icon.svg", order: 3 },
          { id: "lang_5", name: "C", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg", order: 4 },
          { id: "lang_6", name: "HTML", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", order: 5 },
          { id: "lang_7", name: "CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", order: 6 }
        ],
        "Backend": [
          { id: "be_1", name: "Django", logo: "https://www.vectorlogo.zone/logos/djangoproject/djangoproject-icon.svg", order: 0 },
          { id: "be_2", name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", order: 1 },
          { id: "be_3", name: "Express.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", order: 2 },
          { id: "be_4", name: "REST API", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg", order: 3 }
        ],
        "Frontend": [
          { id: "fe_1", name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", order: 0 },
          { id: "fe_2", name: "React-Native", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/reactnative/reactnative-original.svg", order: 1 },
          { id: "fe_3", name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", order: 2 },
          { id: "fe_4", name: "Redux", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg", order: 3 }
        ]
        // Add other skill categories...
      },

      projects: [],

      contact: {
        emailjsConfig: {
          serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
          templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "",
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ""
        },
        socialLinks: {
          github: "https://github.com/shubhs27",
          linkedin: "https://www.linkedin.com/in/thomasstefenm/",
          email: "thomasstefenm@gmail.com",
          phone: " +919717611259"
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

      updateExperience: (experiences) => set(state => ({
        experience: experiences,
        lastModified: new Date().toISOString()
      })),

      addExperience: (newExp) => set(state => ({
        experience: [...state.experience, { 
          ...newExp, 
          id: `exp_${Date.now()}`,
          order: state.experience.length 
        }],
        lastModified: new Date().toISOString()
      })),

      updateEducation: (education) => set(state => ({
        education: education,
        lastModified: new Date().toISOString()
      })),

      updateSkills: (skills) => set(state => ({
        skills: skills,
        lastModified: new Date().toISOString()
      })),

      updateProjects: (projects) => set(state => ({
        projects: projects,
        lastModified: new Date().toISOString()
      })),

      updateContact: (contact) => set(state => ({
        contact: { ...state.contact, ...contact },
        lastModified: new Date().toISOString()
      })),

      // Generic update for any section
      updateSection: (section, data) => set(state => ({
        [section]: typeof data === 'function' ? data(state[section]) : data,
        lastModified: new Date().toISOString()
      })),

      // Reorder items in arrays (for drag-and-drop)
      reorderItems: (section, fromIndex, toIndex) => set(state => {
        const items = [...state[section]];
        const [removed] = items.splice(fromIndex, 1);
        items.splice(toIndex, 0, removed);
        
        // Update order property
        items.forEach((item, index) => {
          item.order = index;
        });

        return {
          [section]: items,
          lastModified: new Date().toISOString()
        };
      }),

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Reset all data
      resetAll: () => set({
        hero: get().hero,
        experience: [],
        education: [],
        skills: {},
        projects: [],
        contact: get().contact,
        isLoading: false,
        error: null,
        lastModified: new Date().toISOString()
      })
    }),
    {
      name: 'portfolio-admin-storage',
      version: 1,
      // Only persist the data, not UI state
      partialize: (state) => ({
        hero: state.hero,
        experience: state.experience,
        education: state.education,
        skills: state.skills,
        projects: state.projects,
        contact: state.contact,
        lastModified: state.lastModified
      })
    }
  )
);

export default usePortfolioStore; 