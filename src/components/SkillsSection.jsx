import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import usePortfolioStore from '../admin/store/portfolioStore';

export const SkillsSection = () => {
  const { skills } = usePortfolioStore();
  
  // Use store data, fallback to empty object if no data
  const skillsData = skills || {};
  const tabs = Object.keys(skillsData);
  
  // Set default active tab to first available tab or fallback
  const [activeTab, setActiveTab] = useState(tabs[0] || "Languages");
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Update active tab when skills data changes
  useEffect(() => {
    if (tabs.length > 0 && !tabs.includes(activeTab)) {
      setActiveTab(tabs[0]);
    }
  }, [tabs, activeTab]);

  // Don't render section if no skills data
  if (tabs.length === 0) {
    return null;
  }

  // Animation variants
  const headerVariants = {
    hidden: {
      opacity: 0,
      y: -30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const skillItemVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const skillContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const loadingVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  // Preload all images when component mounts
  useEffect(() => {
    const preloadImages = async () => {
      const allLogos = Object.values(skillsData)
        .flat()
        .map((skill) => skill.logo);
      const uniqueLogos = [...new Set(allLogos)];

      const imagePromises = uniqueLogos.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve; // Still resolve on error to not block loading
          img.src = src;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.warn("Some images failed to preload:", error);
        setImagesLoaded(true); // Still set to true to show the component
      }
    };

    preloadImages();
  }, []);

  return (
    <section
      id="skills"
      className="py-20 sm:py-30 px-4 relative overflow-hidden"
    >
      <div className="container px-4 md:px-6 mx-auto max-w-6xl text-center">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-2 py-2"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Technical Skills
          </motion.h2>
          <motion.p
            className="text-sm sm:text-base text-foreground/80 mb-6 sm:mb-8 max-w-md sm:max-w-none"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            My expertise across various technologies and tools
          </motion.p>
        </motion.div>

        <div className="mt-6 sm:mt-8 md:mt-12">
          {/* Tab Navigation with Slide Effect */}
          <motion.div
            className="flex justify-center mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <SlideTabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </motion.div>

          {/* Skills Content */}
          <div className="bg-muted/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 min-h-[180px] sm:min-h-[200px] relative">
            <AnimatePresence mode="wait">
              {!imagesLoaded ? (
                <motion.div
                  key="loading"
                  className="flex items-center justify-center py-8 absolute inset-0"
                  variants={loadingVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="animate-spin rounded-2xl h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
                  <span className="ml-3 text-muted-foreground text-xs sm:text-sm">
                    Loading skills...
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab}
                  className="flex flex-wrap gap-2 sm:gap-3 justify-center"
                  variants={skillContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {skillsData[activeTab].map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      className="bg-background border rounded-md font-medium text-xs sm:text-sm py-1.5 px-3 sm:py-2 sm:px-4 hover:bg-accent transition-all duration-300 flex items-center gap-1.5 sm:gap-2 group cursor-pointer"
                      variants={skillItemVariants}
                      whileHover={{
                        scale: 1.05,
                        y: -2,
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.img
                        alt={`${skill.name} logo`}
                        className="h-4 w-4 sm:h-5 sm:w-5 object-contain"
                        src={skill.logo}
                        loading="eager"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        whileHover={{
                          scale: 1.2,
                          rotate: 5,
                        }}
                        transition={{ duration: 0.2 }}
                      />
                      <span className="text-foreground whitespace-nowrap text-xs sm:text-sm">
                        {skill.name}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const Tab = ({ children, setPosition, isActive, onClick }) => {
  const ref = useRef(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      onClick={onClick}
      className={`relative z-10 block cursor-pointer px-2 py-1.5 text-xs font-medium transition-colors duration-200 sm:px-3 sm:py-2 md:px-4 md:py-3 md:text-sm ${
        isActive ? "text-white" : "text-foreground hover:text-foreground/80"
      }`}
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="absolute z-0 h-6 rounded-lg bg-primary sm:h-8 sm:rounded-xl md:h-11"
    />
  );
};

const SlideTabs = ({ tabs, activeTab, setActiveTab }) => {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // Set initial position for active tab
  useEffect(() => {
    const activeIndex = tabs.indexOf(activeTab);
    const activeElement = document.querySelector(
      `[data-tab-index="${activeIndex}"]`
    );
    if (activeElement) {
      const { width } = activeElement.getBoundingClientRect();
      setPosition({
        left: activeElement.offsetLeft,
        width,
        opacity: 1,
      });
    }
  }, [activeTab, tabs]);

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <ul
        onMouseLeave={() => {
          // Reset to active tab position
          const activeIndex = tabs.indexOf(activeTab);
          const activeElement = document.querySelector(
            `[data-tab-index="${activeIndex}"]`
          );
          if (activeElement) {
            const { width } = activeElement.getBoundingClientRect();
            setPosition({
              left: activeElement.offsetLeft,
              width,
              opacity: 1,
            });
          }
        }}
        className="relative mx-auto flex w-max min-w-full sm:w-fit rounded-xl sm:rounded-2xl border-2 border-border bg-card p-1 shadow-sm"
      >
        {tabs.map((tab, index) => (
          <div key={tab} data-tab-index={index}>
            <Tab
              setPosition={setPosition}
              isActive={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Tab>
          </div>
        ))}
        <Cursor position={position} />
      </ul>
    </div>
  );
};

export default SkillsSection;
