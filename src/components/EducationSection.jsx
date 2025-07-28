import { GraduationCap, School, Calendar, Award, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import usePortfolioStore from '../admin/store/portfolioStore';

export const EducationSection = () => {
  const { education } = usePortfolioStore();
  
  // Sort by order and show only visible entries
  const visibleEducation = education
    .filter(edu => edu.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric'
    });
  };

  const formatDateRange = (startDate, endDate) => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return `${start} - ${end}`;
  };

  if (visibleEducation.length === 0) {
    return null; // Hide section if no education entries
  }

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {visibleEducation.map((edu, index) => (
            <motion.div
              key={edu.id}
              className="p-6 md:p-8 w-full"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, y: 50 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 + index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
                <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0 self-center sm:self-start">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h3 className="font-semibold text-lg sm:text-xl mb-2">
                    {edu.degree}
                  </h3>
                  <p className="text-primary font-medium mb-2 text-sm sm:text-base">
                    {edu.institution}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm sm:text-base">
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </span>
                  </div>
                  
                  {edu.grade && (
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                      <Award className="h-4 w-4 text-yellow-600" />
                      <p className="text-muted-foreground text-sm sm:text-base">
                        {edu.grade}
                      </p>
                    </div>
                  )}
                  
                  {edu.description && (
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base mb-4">
                      {edu.description}
                    </p>
                  )}
                  
                  {edu.certificateUrl && (
                    <a
                      href={edu.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Certificate
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
