import { GraduationCap, School, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export const EducationSection = () => {
  return (
    <section id="education" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Education
        </motion.h2>
        <motion.p
          className="text-foreground/80 text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Academic background and qualifications
        </motion.p>

        {/* Mobile: Single column, Desktop: Two columns */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-12 items-start">
          {/* B.Tech Degree - Animate from left on desktop, from top on mobile */}
          <motion.div
            className="p-6 md:p-8 w-full motion-safe:md:[--initial-x:var(--desktop-x)] motion-safe:md:[--initial-y:var(--desktop-y)]"
            initial={{ opacity: 0, x: 0, y: 50 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            // Different animation for desktop
            style={{
              "--desktop-x": "-50px",
              "--desktop-y": "0px",
            }}
          >
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
              <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0 self-center sm:self-start">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h3 className="font-semibold text-lg sm:text-xl mb-2">
                  B.Tech CSE (AI/ML)
                </h3>
                <p className="text-primary font-medium mb-2 text-sm sm:text-base">
                  University of Petroleum & Energy Studies - Dehradun
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm sm:text-base">2022 - 2026</span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  CGPA: 8.59
                </p>
              </div>
            </div>
          </motion.div>

          {/* School - Animate from right on desktop, from top on mobile */}
          <motion.div
            className="p-6 md:p-8 w-full"
            initial={{ opacity: 0, x: 0, y: 50 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
              <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0 self-center sm:self-start">
                <School className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h3 className="font-semibold text-lg sm:text-xl mb-2">
                  CBSE - Class XII
                </h3>
                <p className="text-primary font-medium mb-2 text-sm sm:text-base">
                  Modern School, Barakhamba Road - New Delhi
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm sm:text-base">2014 - 2021</span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  Grade: 91%
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
