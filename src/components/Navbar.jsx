import { cn } from "@/lib/utils";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if (storedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      // first visit: no stored key -> default to dark
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window !== "undefined") {
      if (isDarkMode) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
        setIsDarkMode(false);
      } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        setIsDarkMode(true);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      // Check which section is currently in view
      const sections = navItems.map((item) => item.href.substring(1));
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        const sectionName = navItems.find(
          (item) => item.href === `#${currentSection}`
        )?.name;
        if (sectionName) {
          setActiveSection(sectionName);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside or on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    const handleOutsideClick = (e) => {
      if (isMenuOpen && !e.target.closest("nav")) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("click", handleOutsideClick);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleOutsideClick);
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Animation variants
  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const logoVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20,
        delay: 0.1,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const mobileItemVariants = {
    closed: {
      x: -50,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  };

  const hamburgerVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 },
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "fixed w-full z-40 transition-all duration-300",
        isScrolled
          ? "py-2 sm:py-3 bg-background/80 backdrop-blur-md shadow-xs"
          : "py-3 sm:py-5"
      )}
    >
      <div className="container flex items-center justify-between px-4 sm:px-6">
        <motion.a
          variants={logoVariants}
          whileHover="hover"
          className="text-lg sm:text-xl font-bold text-primary flex items-center"
          href="#home"
        >
          <span className="relative z-10">
            <motion.span
              className="text-glow text-foreground"
              animate={{
                textShadow: [
                  "0 0 5px rgba(59, 130, 246, 0.5)",
                  "0 0 10px rgba(59, 130, 246, 0.8)",
                  "0 0 5px rgba(59, 130, 246, 0.5)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="hidden sm:inline">Shubhanan's</span>
              <span className="sm:hidden">S.</span>
            </motion.span>
            <span className="ml-1">Portfolio</span>
          </span>
        </motion.a>

        {/* desktop nav */}
        <div className="hidden md:flex items-center space-x-8">
          <motion.div
            className="flex space-x-6 relative"
            variants={navVariants}
          >
            {navItems.map((item, key) => (
              <motion.a
                key={key}
                variants={itemVariants}
                whileHover={{
                  y: -2,
                  transition: { type: "spring", stiffness: 400, damping: 10 },
                }}
                whileTap={{ scale: 0.95 }}
                href={item.href}
                className={cn(
                  "hover:text-primary transition-colors duration-300 relative py-2",
                  activeSection === item.name
                    ? "text-foreground"
                    : "text-foreground/80"
                )}
                onClick={() => setActiveSection(item.name)}
              >
                {item.name}
                {activeSection === item.name && (
                  <motion.div
                    className="absolute bottom-1 left-0 right-0 h-0.5 bg-primary"
                    layoutId="underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 40,
                    }}
                  />
                )}
              </motion.a>
            ))}
          </motion.div>

          {/* Theme toggle component */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {isDarkMode ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* mobile nav */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Mobile theme toggle */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {isDarkMode ? (
                <motion.div
                  key="sun-mobile"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon-mobile"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            variants={hamburgerVariants}
            animate={isMenuOpen ? "open" : "closed"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="p-2 text-foreground z-50 relative focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full"
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={20} className="sm:w-6 sm:h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
                onClick={() => setIsMenuOpen(false)}
                style={{ top: 0 }}
              />

              {/* Mobile menu */}
              <motion.div
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed left-0 right-0 bottom-0 bg-background/95 backdrop-blur-md z-40 flex flex-col items-center justify-center md:hidden"
                style={{
                  top: isScrolled ? "60px" : "80px", // Adjust based on navbar height
                  minHeight: isScrolled
                    ? "calc(100vh - 60px)"
                    : "calc(100vh - 80px)",
                }}
              >
                <motion.div
                  className="flex flex-col space-y-6 sm:space-y-8 text-lg sm:text-xl"
                  variants={mobileMenuVariants}
                >
                  {navItems.map((item, key) => (
                    <motion.a
                      key={key}
                      variants={mobileItemVariants}
                      whileHover={{
                        scale: 1.05,
                        x: 5,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        },
                      }}
                      whileTap={{ scale: 0.95 }}
                      href={item.href}
                      className={cn(
                        "hover:text-primary transition-colors duration-300 relative py-2 px-4 rounded-lg text-center min-w-[120px]",
                        activeSection === item.name
                          ? "text-foreground bg-primary/10"
                          : "text-foreground/80"
                      )}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveSection(item.name);
                      }}
                    >
                      {item.name}
                      {activeSection === item.name && (
                        <motion.div
                          className="absolute -left-2 top-1/2 w-1 h-1 bg-primary rounded-full"
                          layoutId="mobileIndicator"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          }}
                        />
                      )}
                    </motion.a>
                  ))}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
