import { Github, Linkedin, Mail, Phone, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

export const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // EmailJS configuration - from environment variables
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send email using EmailJS
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_name: "Your Name", // Replace with your name
        },
        EMAILJS_PUBLIC_KEY
      );

      console.log("Email sent successfully:", result);

      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });

      // Reset form
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Email sending failed:", error);

      toast({
        title: "Error sending message",
        description:
          "Something went wrong. Please try again or contact me directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const socialIconVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <section
      id="contact"
      className="relative flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-36 pb-8 sm:pb-12 text-foreground overflow-hidden"
    >
      <div className="container max-w-6xl mx-auto z-10 w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            Contact
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg text-foreground/70 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Let's work together
          </motion.p>
        </motion.div>

        {/* Main content - responsive grid structure */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Left side - Get in Touch */}
          <motion.div
            className="space-y-6 sm:space-y-8 text-left order-2 lg:order-1"
            variants={itemVariants}
          >
            <motion.div
              className="space-y-3 sm:space-y-4"
              variants={itemVariants}
            >
              <motion.h2
                className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground"
                transition={{ duration: 0.2 }}
              >
                Get in Touch
              </motion.h2>

              <motion.p
                className="text-base sm:text-lg text-foreground/70 max-w-xl leading-relaxed"
                variants={itemVariants}
              >
                Have a project in mind or want to discuss potential
                opportunities? I'd love to hear from you!
              </motion.p>
            </motion.div>

            {/* Social links - responsive grid */}
            <motion.div
              className="grid grid-cols-2 sm:flex gap-3 sm:gap-4"
              variants={itemVariants}
            >
              {[
                {
                  href: "https://github.com/shubhs27",
                  icon: Github,
                  label: "GitHub",
                },
                {
                  href: "https://www.linkedin.com/in/shubhs27/",
                  icon: Linkedin,
                  label: "LinkedIn",
                },
                {
                  href: "mailto:shubhanans@gmail.com",
                  icon: Mail,
                  label: "Email",
                },
                { href: "tel: +919717611259", icon: Phone, label: "Phone" },
              ].map(({ href, icon: Icon, label }, index) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  className="flex items-center justify-center p-3 sm:p-3 border border-border rounded-lg text-foreground/70 hover:text-foreground hover:border-primary transition-all duration-300 min-h-[48px] touch-manipulation"
                  variants={socialIconVariants}
                  whileHover="hover"
                  whileTap="tap"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Icon className="h-5 w-5 sm:h-5 sm:w-5" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side - Contact form */}
          <motion.div
            className="flex justify-center lg:justify-end order-1 lg:order-2"
            variants={formVariants}
          >
            <div className="w-full max-w-md space-y-6">
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-4 sm:space-y-5"
                variants={formVariants}
              >
                <motion.div variants={inputVariants}>
                  <motion.input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-3 sm:py-3 bg-transparent border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary transition-colors text-base touch-manipulation"
                    placeholder="Your Name"
                    whileFocus={{
                      scale: 1.02,
                      borderColor: "hsl(var(--primary))",
                      boxShadow: "0 0 0 3px hsla(var(--primary), 0.1)",
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>

                <motion.div variants={inputVariants}>
                  <motion.input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-3 sm:py-3 bg-transparent border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary transition-colors text-base touch-manipulation"
                    placeholder="Your Email"
                    whileFocus={{
                      scale: 1.02,
                      borderColor: "hsl(var(--primary))",
                      boxShadow: "0 0 0 3px hsla(var(--primary), 0.1)",
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>

                <motion.div variants={inputVariants}>
                  <motion.textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 sm:px-4 py-3 sm:py-3 bg-transparent border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none text-base touch-manipulation"
                    placeholder="Your Message"
                    whileFocus={{
                      scale: 1.02,
                      borderColor: "hsl(var(--primary))",
                      boxShadow: "0 0 0 3px hsla(var(--primary), 0.1)",
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex items-center justify-center gap-2 bg-foreground text-background px-5 sm:px-6 py-3 sm:py-3 rounded-lg font-medium hover:bg-foreground/90 transition-all duration-300 w-full mt-6 min-h-[48px] touch-manipulation"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <motion.span
                    animate={isSubmitting ? { opacity: [1, 0.5, 1] } : {}}
                    transition={{
                      repeat: isSubmitting ? Infinity : 0,
                      duration: 1,
                    }}
                    className="text-base sm:text-base"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </motion.span>
                  <motion.div
                    animate={isSubmitting ? { rotate: 360 } : {}}
                    transition={{
                      repeat: isSubmitting ? Infinity : 0,
                      duration: 1,
                    }}
                  >
                    <Send className="h-4 w-4 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                </motion.button>
              </motion.form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
