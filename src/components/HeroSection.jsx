import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
  ArrowDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import usePortfolioStore from '../admin/store/portfolioStore';

export const HeroSection = () => {
  const { hero } = usePortfolioStore();
  const [currentTitle, setCurrentTitle] = useState(0);
  
  // Use titles from store, fallback to default if empty
  const titles = hero?.personalInfo?.titles?.length > 0 
    ? hero.personalInfo.titles 
    : [
        "Full Stack Developer",
        "Passionate about AI/ML",
        "Tech Enthusiast",
        "Problem Solver",
      ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitle((prev) => (prev + 1) % titles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-4 text-foreground"
    >
      <div className="container max-w-6xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Mobile: Profile image first */}
          <div className="flex justify-center lg:justify-end lg:order-2 opacity-0 animate-fade-in-delay-3">
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl">
              <img
                src={hero?.personalInfo?.profileImage || "/tsMain.png"}
                alt={hero?.personalInfo?.name || "Profile"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content - moved down on mobile */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left lg:order-1 mt-4 lg:mt-0">
            <div className="space-y-3 lg:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="text-primary bg-clip-text opacity-0 animate-fade-in-delay-1">
                  {hero?.personalInfo?.name || "Thomas Stefen Mardianto"}
                </span>
              </h1>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground opacity-0 animate-fade-in-delay-2 h-10 lg:h-12 flex items-center justify-center lg:justify-start">
                <span key={currentTitle} className="animate-title-change">
                  {titles[currentTitle]}
                </span>
              </h2>

              <p className="text-base lg:text-lg text-foreground/70 max-w-xl leading-relaxed opacity-0 animate-fade-in-delay-3 mx-auto lg:mx-0 px-2 lg:px-0">
                {hero?.personalInfo?.description || "Information System and Technology ITB graduate who interested in software, data, and AI engineering. Experienced in developing products, pipelines, and automations."}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 opacity-0 animate-fade-in-delay-4 px-4 sm:px-0 justify-center lg:justify-start">
              <button
                onClick={() => scrollToSection("projects")}
                className="group flex items-center justify-center gap-2 bg-foreground text-background px-5 lg:px-6 py-2.5 lg:py-3 rounded-lg font-medium hover:bg-foreground/90 transition-all duration-300 hover:scale-105"
              >
                View My Projects
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={hero?.personalInfo?.resumeUrl || "https://drive.google.com/file/d/1mIpGnOYt63MbRmYkAYR9uBeyi6XtXVEm/view"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-border text-foreground px-5 lg:px-6 py-2.5 lg:py-3 rounded-lg font-medium hover:bg-card transition-all duration-300 hover:scale-105"
              >
                <Download className="h-4 w-4" />
                Resume
              </a>
            </div>

            {/* Social links */}
            <div className="flex gap-3 lg:gap-4 opacity-0 animate-fade-in-delay-5 justify-center lg:justify-start">
              {hero?.socialLinks?.github && (
                <a
                  href={hero.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 lg:p-3 border border-border rounded-lg text-foreground/70 hover:text-foreground hover:border-primary transition-all duration-300 hover:scale-110"
                >
                  <Github className="h-4 w-4 lg:h-5 lg:w-5" />
                </a>
              )}
              {hero?.socialLinks?.leetcode && (
                <a
                  href={hero.socialLinks.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 lg:p-3 border border-border rounded-lg text-foreground/70 hover:text-foreground hover:border-primary transition-all duration-300 hover:scale-110"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png"
                    alt="LeetCode"
                    className="h-4 w-4 lg:h-5 lg:w-5 grayscale invert opacity-70 hover:opacity-100 transition-opacity duration-300"
                  />
                </a>
              )}
              {hero?.socialLinks?.linkedin && (
                <a
                  href={hero.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 lg:p-3 border border-border rounded-lg text-foreground/70 hover:text-foreground hover:border-primary transition-all duration-300 hover:scale-110"
                >
                  <Linkedin className="h-4 w-4 lg:h-5 lg:w-5" />
                </a>
              )}
              {hero?.socialLinks?.email && (
                <a
                  href={`mailto:${hero.socialLinks.email}`}
                  className="p-2.5 lg:p-3 border border-border rounded-lg text-foreground/70 hover:text-foreground hover:border-primary transition-all duration-300 hover:scale-110"
                >
                  <Mail className="h-4 w-4 lg:h-5 lg:w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollToSection("experience")}
        className="hidden lg:flex absolute bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex-col items-center animate-bounce hover:text-primary transition-colors duration-300 cursor-pointer border-none bg-transparent"
      >
        <span className="text-xs lg:text-sm text-foreground/60 mb-1 lg:mb-2">
          Scroll
        </span>
        <ArrowDown className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
      </button>

      {/* Custom styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-delay-1 {
          animation: fade-in 0.8s ease-out 0.2s forwards;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s forwards;
        }

        .animate-fade-in-delay-3 {
          animation: fade-in 0.8s ease-out 0.6s forwards;
        }

        .animate-fade-in-delay-4 {
          animation: fade-in 0.8s ease-out 0.8s forwards;
        }

        .animate-fade-in-delay-5 {
          animation: fade-in 0.8s ease-out 1s forwards;
        }

        @keyframes title-change {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          20% {
            opacity: 1;
            transform: translateY(0);
          }
          80% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(10px);
          }
        }

        .animate-title-change {
          animation: title-change 3s ease-in-out;
        }

        /* Mobile-specific adjustments */
        @media (max-width: 1023px) {
          .grid {
            gap: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};
