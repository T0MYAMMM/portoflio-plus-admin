import { motion } from "framer-motion";

export const ExperienceSection = () => {
  const experiences = [
    {
      title: "Summer Intern",
      company: "IBM",
      type: "Internship",
      location: "Remote",
      duration: "June 2025 - Present • 2 mos",
      description: "At IBM, I worked on the project...",
      skills: ["tech1", "tech2", "tech3"],
    },
  ];

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

  const timelineVariants = {
    hidden: {
      scaleY: 0,
      originY: 0,
    },
    visible: {
      scaleY: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut",
        delay: 0.5,
      },
    },
  };

  const experienceItemVariants = {
    hidden: {
      opacity: 0,
      x: -50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
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
        ease: "backOut",
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
        ease: "easeOut",
      },
    },
  };

  const skillContainerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <section id="experience" className="py-30 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-12"
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
            Experience
          </motion.h2>
          <motion.p
            className="text-base text-foreground/80 mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            My professional journey
          </motion.p>
        </motion.div>

        <div className="relative">
          {/* Animated Timeline line - responsive positioning */}
          <motion.div
            className="absolute left-6 md:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent"
            variants={timelineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-200px" }}
          />

          <motion.div
            className="space-y-8 md:space-y-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                className="relative flex flex-col md:flex-row"
                variants={experienceItemVariants}
              >
                {/* Animated Timeline dot - responsive positioning */}
                <motion.div
                  className="absolute left-3 md:left-3 w-6 h-6 bg-background rounded-full border-4 border-gray-800 dark:border-gray-200 shadow-lg mt-1 transition-colors duration-300 z-10"
                  variants={dotVariants}
                />

                {/* Content with enhanced animations - responsive layout */}
                <div className="ml-12 md:ml-12 flex-1 flex flex-col md:flex-row">
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
                    className="flex-1"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                  >
                    <motion.div
                      className="mb-2 text-left"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.2 + 0.5 }}
                    >
                      <span className="text-sm text-muted-foreground">
                        {exp.duration}
                      </span>
                    </motion.div>

                    <motion.h4
                      className="text-lg font-semibold text-primary mb-1 text-left"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.2 + 0.6 }}
                    >
                      {exp.company}
                    </motion.h4>

                    <motion.div
                      className="text-sm text-muted-foreground mb-4 text-left"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.2 + 0.7 }}
                    >
                      {exp.type} • {exp.location}
                    </motion.div>

                    <motion.p
                      className="text-muted-foreground text-sm mb-4 leading-relaxed text-left max-w-lg"
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.8 }}
                    >
                      {exp.description}
                    </motion.p>

                    <motion.div
                      className="flex flex-wrap gap-2"
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
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
