import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState, useEffect, useRef } from 'react';
import usePortfolioStore from '../admin/store/portfolioStore';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const headerVariants = {
  hidden: {
    opacity: 0,
    y: -50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

const timelineVariants = {
  hidden: {
    height: 0,
  },
  visible: {
    height: '100%',
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      delay: 0.5,
    },
  },
};

const experienceItemVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const skillContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const dotVariants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'backOut',
      delay: 0.3,
    },
  },
};

const skillVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

// Helper function to calculate duration
const calculateDuration = (startDate, endDate = null) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const diffTime = end - start;
  const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Average days in a month
  const diffYears = Math.floor(diffMonths / 12);
  const remainingMonths = diffMonths % 12;
  
  let durationText = '';
  if (diffYears > 0) {
    durationText += `${diffYears} yr${diffYears > 1 ? 's' : ''}`;
    if (remainingMonths > 0) {
      durationText += ` ${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`;
    }
  } else {
    durationText = `${diffMonths} mo${diffMonths !== 1 ? 's' : ''}`;
  }
  
  // Format the date range
  const startMonth = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const endMonth = endDate 
    ? end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Present';
  
  return `${startMonth} - ${endMonth} • ${durationText}`;
};

export const ExperienceSection = () => {
  const { experience } = usePortfolioStore();
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef(null);

  // Filter for visible experiences and sort by order
  const experiences = experience
    .filter(exp => exp.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  
  const displayedExperiences = showAll ? experiences : experiences.slice(0, 3);

  useEffect(() => {
    if (showAll) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 300);
    }
  }, [showAll]);

  return (
    <section id="experience" ref={sectionRef} className="py-30 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-12"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-2 py-2"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Experience
          </motion.h2>
          <motion.p
            className="text-base text-foreground/80 mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Professional journey
          </motion.p>
        </motion.div>

        <div className="relative">
          {/* Animated Timeline line - responsive positioning */}
          <motion.div
            className="absolute left-6 md:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent"
            variants={timelineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-200px' }}
          />

          <motion.div
            className="space-y-8 md:space-y-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <AnimatePresence>
              {displayedExperiences.length === 0 ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-foreground/60 text-lg">
                    No experience entries available.
                  </p>
                </motion.div>
              ) : (
                displayedExperiences.map((exp, index) => (
                  <motion.div
                    key={exp.id || index}
                    className="relative flex flex-col md:flex-row"
                    variants={experienceItemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                  >
                    
                    {/* Animated Timeline dot - responsive positioning */}
                    <motion.div
                      className="absolute left-3 md:left-3 w-6 h-6 bg-background rounded-full border-4 border-gray-800 dark:border-gray-200 shadow-lg mt-1 transition-colors duration-300 z-10"
                      variants={dotVariants}
                    />

                    {/* Content with enhanced animations - responsive layout */}
                    <div className="w-full md:w-full ml-12 md:ml-12 flex-1 flex flex-col md:flex-row">
                      {/* Left side - Title with slide animation - responsive width */}
                      <motion.div
                        className="flex-shrink-0 w-full md:w-72 md:pr-12 mb-4 md:mb-0"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                      >
                        <motion.h3 className="text-xl md:text-2xl font-semibold text-foreground">
                          {exp.title}
                        </motion.h3>
                      </motion.div>

                      {/* Right side - All other details with staggered animations */}
                      <motion.div
                        className="flex-1 min-w-0"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                      >
                        {/* Company and location */}
                        <motion.div
                          className="space-y-1 mb-3"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: index * 0.2 + 0.7 }}
                        >
                          <p className="text-sm text-foreground/60">
                            {calculateDuration(exp.startDate, exp.endDate)}
                          </p>
                          <h4 className="text-lg font-medium text-primary">{exp.company}</h4>
                          <p className="text-sm text-foreground/60">
                            {exp.location} • {exp.type}
                          </p>
                        </motion.div>

                        {/* Description */}
                        <motion.p
                          className="text-base text-foreground/80 mb-4 leading-relaxed"
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.2 + 0.9 }}
                        >
                          {exp.description}
                        </motion.p>

                        {/* Skills */}
                        {exp.skills && exp.skills.length > 0 && (
                          <motion.div
                            className="flex flex-wrap justify-center gap-4"
                            variants={skillContainerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                          >
                            {exp.skills.map((skill, skillIndex) => (
                              <motion.span
                                key={skillIndex}
                                className="px-3 py-1 bg-muted text-foreground rounded-md text-sm"
                                variants={skillVariants}
                                custom={skillIndex}
                              >
                                {skill}
                              </motion.span>
                            ))}
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                ))
              )}

              {/* Show More / Show Less Button */}
              {experiences.length > 3 && (
                <motion.div
                  className="flex justify-center mt-30"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1.5 }}
                >
                  <button
                    onClick={() => {
                      setShowAll(!showAll);
                      if (!showAll) {
                        setTimeout(() => {
                          sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
                        }, 300);
                      }
                    }}
                    className="hidden lg:flex absolute bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex-col items-center animate-bounce hover:text-primary transition-colors duration-300 cursor-pointer border-none bg-transparent"
                  >
                    {showAll ? (
                      <>
                        <span className="text-xs lg:text-sm text-foreground/60 mb-1 lg:mb-2">
                          Show Less
                        </span>
                        <ArrowUp className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                      </>
                    ) : (
                      <>
                        <span className="text-xs lg:text-sm text-foreground/60 mb-1 lg:mb-2">
                          Show More
                        </span>
                        <ArrowDown className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                      </>
                    )}
                  </button>

                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          
        </div>
        
        

        <div ref={sectionRef} />

      </div>

      
    </section>
  );
};

export default ExperienceSection; 