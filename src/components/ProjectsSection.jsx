import { ArrowLeft, ArrowRight, Github } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const projects = [
  {
    id: 1,
    title: "Snap-n-Solve",
    description:
      "A real-time Sudoku puzzle solver that uses computer vision and machine learning to detect, solve, and overlay solutions on Sudoku puzzles captured through your webcam",
    image: "/projects/snap-n-solve.jpeg",
    tags: ["Python", "OpenCV", "TensorFlow", "NumPy", "Keras"],
    demoUrl: "#",
    githubUrl: "https://github.com/shubhs27/Snap-n-Solve",
    demoStatus: "offline",
  },
  {
    id: 2,
    title: "The Wild Oasis",
    description:
      "An internal hotel management application designed for hotel employees to efficiently manage bookings, cabins, guests, and more",
    image: "/projects/wildOasis.png",
    tags: [
      "React",
      "Styled-Components",
      "React-Query",
      "React-Hook-Form",
      "Recharts",
      "Supabase",
    ],
    demoUrl: "https://the-wild-oasis-shubhanan.vercel.app/",
    githubUrl: "https://github.com/shubhs27/The-wild-oasis",
    demoStatus: "online",
  },
  {
    id: 3,
    title: "PomodoLock",
    description:
      "A powerful Chrome extension that combines the Pomodoro technique with website blocking functionality to boost your productivity",
    image: "/projects/pomodoLock.png",
    tags: ["JavaScript", "Chrome Extension"],
    demoUrl:
      "https://chrome.google.com/webstore/detail/mapddbpaaaachoidpbolhpckhillhbpj",
    githubUrl: "https://github.com/shubhs27/PomodoLock",
    demoStatus: "online",
  },
  {
    id: 4,
    title: "Natours",
    description:
      "A dynamic tour booking platform which delivers a seamless travel planning experience with secure authentication, advanced tour filtering, interactive maps, and streamlined booking processes",
    image: "/projects/natours.png",
    tags: ["Node.js", "Express.js", "MongoDB", "Mongoose", "REST-API", "Pug"],
    demoUrl: "https://natours-shubhanan.onrender.com",
    githubUrl: "https://github.com/shubhs27/Natours",
    demoStatus: "online",
  },
  {
    id: 5,
    title: "The Wild Oasis (Website)",
    description:
      "A luxurious cabin booking platform for a resort located in the heart of the Italian Dolomites",
    image: "/projects/wildOasisWebsite.png",
    tags: ["Next.js", "Tailwind CSS", "Supabase", "NextAuth-Google"],
    demoUrl: "https://the-wild-oasis-website-shubhanan.vercel.app/",
    githubUrl: "https://github.com/shubhs27/The-wild-oasis-website",
    demoStatus: "online",
  },
  {
    id: 6,
    title: "NoMoRecs",
    description:
      "A lightweight Chrome extension designed to help users focus on their chosen content by blocking YouTube's recommendation algorithm",
    image: "/projects/noMoRecs.png",
    tags: ["JavaScript", "Chrome Extension"],
    demoUrl:
      "https://chrome.google.com/webstore/detail/nppghgjojmhangjjbnlmdlahncpoddbi",
    githubUrl: "https://github.com/shubhs27/NoMoRecs",
    demoStatus: "online",
  },
  {
    id: 7,
    title: "Use-Popcorn",
    description:
      "A React application for searching movies and tracking your personal watchlist with ratings",
    image: "/projects/usePopcorn.png",
    tags: ["React"],
    demoUrl: "https://use-popcorn-shubhanan.netlify.app/",
    githubUrl: "https://github.com/shubhs27/Use-Popcorn",
    demoStatus: "online",
  },
  {
    id: 8,
    title: "Fast React Pizza",
    description:
      "A fully functional pizza ordering application that allows users to browse the menu, add items to cart, place orders, and track their order status",
    image: "/projects/fastPizza.png",
    tags: ["React", "Redux", "React-Router", "Tailwind CSS"],
    demoUrl: "https://fast-react-pizza-shubhanan.netlify.app/",
    githubUrl: "https://github.com/shubhs27/Fast-react-pizza",
    demoStatus: "online",
  },
  {
    id: 9,
    title: "PureView",
    description:
      "A lightweight Chrome extension designed to give users a cleaner and distraction-free web browsing experience by blocking intrusive ads",
    image: "/projects/pureView.png",
    tags: ["JavaScript", "Chrome Extension"],
    demoUrl:
      "https://chrome.google.com/webstore/detail/dnndbeelpmgipmibcbocajpimolmoica",
    githubUrl: "https://github.com/shubhs27/PureView",
    demoStatus: "online",
  },
];

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const ProjectCard = ({ project, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.6,
      delay: index * 0.1,
      ease: [0.25, 0.4, 0.25, 1],
    }}
    className="group bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:border-primary/30 transition-all duration-300 flex flex-col h-full"
  >
    {/* Project Image */}
    <div className="h-32 sm:h-40 md:h-48 bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    {/* Project Content */}
    <motion.div
      className="p-4 sm:p-5 md:p-6 text-left flex flex-col flex-grow"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
    >
      <motion.h3
        className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-left"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
      >
        {project.title}
      </motion.h3>
      <motion.p
        className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed text-left"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
      >
        {project.description}
      </motion.p>
      {/* Tech Stack */}
      <motion.div
        className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6 justify-start"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
      >
        {project.tags.map((tag, tagIndex) => (
          <motion.span
            key={tagIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1 + 0.6 + tagIndex * 0.05,
              ease: "easeOut",
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
            className="bg-secondary text-secondary-foreground text-xs px-2 sm:px-3 py-1 rounded-full border border-border/50"
          >
            {tag}
          </motion.span>
        ))}
      </motion.div>
      {/* Action Buttons */}
      <motion.div
        className="flex gap-2 sm:gap-3 justify-start mt-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.7 }}
      >
        <motion.a
          href={project.demoUrl}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors group"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.8 }}
            className={`w-2 h-2 rounded-full ${
              project.demoStatus === "online" ? "bg-green-500" : "bg-red-500"
            }`}
          />
          Demo
        </motion.a>
        <motion.a
          href={project.githubUrl}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors group"
        >
          <Github
            size={14}
            className="sm:w-4 sm:h-4 group-hover:text-primary transition-colors"
          />
          Code
        </motion.a>
      </motion.div>
    </motion.div>
  </motion.div>
);

const Carousel = ({ currentIndex, setCurrentIndex, direction }) => {
  const hasPaginated = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const detectPaginationGesture = (e, { offset, velocity }) => {
    if (hasPaginated.current) return;
    const swipe = swipePower(offset.x, velocity.x);

    // For mobile, we show 1-2 cards per page, so adjust pagination logic
    const cardsPerPage =
      window.innerWidth < 640 ? 1 : window.innerWidth < 768 ? 2 : 3;
    const currentPage = Math.floor(currentIndex / cardsPerPage);
    const totalPages = Math.ceil(projects.length / cardsPerPage);

    if (swipe < -swipeConfidenceThreshold && currentPage < totalPages - 1) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold && currentPage > 0) {
      paginate(-1);
    }
  };

  const paginate = (newDirection) => {
    if (hasPaginated.current) return;
    hasPaginated.current = true;

    const cardsPerPage =
      window.innerWidth < 640 ? 1 : window.innerWidth < 768 ? 2 : 3;
    const currentPage = Math.floor(currentIndex / cardsPerPage);
    const totalPages = Math.ceil(projects.length / cardsPerPage);
    const newPage = currentPage + newDirection;

    if (newPage < 0 || newPage >= totalPages) return;
    const newIndex = newPage * cardsPerPage;
    setCurrentIndex(newIndex, newDirection);
  };

  const getCardsToShow = () => {
    const cardsPerPage =
      window.innerWidth < 640 ? 1 : window.innerWidth < 768 ? 2 : 3;
    return cardsPerPage;
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[550px] overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 100, damping: 30 },
            opacity: { duration: 0.6 },
          }}
          drag={isMobile ? "x" : false}
          dragConstraints={isMobile ? { left: 0, right: 0 } : undefined}
          dragElastic={isMobile ? 1 : 0}
          onDragStart={
            isMobile ? () => (hasPaginated.current = false) : undefined
          }
          onDragEnd={isMobile ? detectPaginationGesture : undefined}
          className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0"
        >
          {Array.from({ length: getCardsToShow() }).map((_, offset) => {
            const projectIndex = currentIndex + offset;
            if (projectIndex >= projects.length) return null;
            const project = projects[projectIndex];
            return (
              <ProjectCard
                key={`${currentIndex}-${offset}`}
                project={project}
                index={offset}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export const ProjectsSection = () => {
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);
  const [cardsPerPage, setCardsPerPage] = useState(3);

  useEffect(() => {
    const updateCardsPerPage = () => {
      const newCardsPerPage =
        window.innerWidth < 640 ? 1 : window.innerWidth < 768 ? 2 : 3;
      setCardsPerPage(newCardsPerPage);
    };

    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);
    return () => window.removeEventListener("resize", updateCardsPerPage);
  }, []);

  const totalPages = Math.ceil(projects.length / cardsPerPage);
  const currentPage = Math.floor(currentIndex / cardsPerPage);

  const paginate = (newDirection) => {
    const newPage = currentPage + newDirection;
    if (newPage < 0 || newPage >= totalPages) return;
    const newIndex = newPage * cardsPerPage;
    setCurrentIndex([newIndex, newDirection]);
  };

  const goToPage = (pageIndex) => {
    const targetIndex = pageIndex * cardsPerPage;
    const direction = pageIndex > currentPage ? 1 : -1;
    setCurrentIndex([targetIndex, direction]);
  };

  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  return (
    <motion.section
      id="projects"
      className="py-16 sm:py-20 lg:py-24 px-4 relative"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Projects
          </motion.h2>
          <motion.p
            className="text-foreground/80 text-base sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Some of my recent work
          </motion.p>
        </motion.div>

        {/* Carousel Container */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Carousel
            currentIndex={currentIndex}
            setCurrentIndex={([index, dir]) => setCurrentIndex([index, dir])}
            direction={direction}
          />
        </motion.div>

        {/* Navigation Arrows and Page Indicator */}
        <motion.div
          className="flex justify-center items-center gap-3 sm:gap-4 mt-8 sm:mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.button
            onClick={() => paginate(-1)}
            disabled={!canGoPrevious}
            whileHover={
              canGoPrevious
                ? {
                    scale: 1.1,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    transition: { duration: 0.2 },
                  }
                : {}
            }
            whileTap={canGoPrevious ? { scale: 0.95 } : {}}
            className={`p-2 sm:p-3 rounded-full border transition-all duration-300 ${
              canGoPrevious
                ? "border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                : "border-border/50 text-muted-foreground cursor-not-allowed"
            }`}
          >
            <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
          </motion.button>

          {/* Page Indicators */}
          <div className="flex gap-1.5 sm:gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <motion.button
                key={index}
                onClick={() => goToPage(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentPage
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <motion.button
            onClick={() => paginate(1)}
            disabled={!canGoNext}
            whileHover={
              canGoNext
                ? {
                    scale: 1.1,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    transition: { duration: 0.2 },
                  }
                : {}
            }
            whileTap={canGoNext ? { scale: 0.95 } : {}}
            className={`p-2 sm:p-3 rounded-full border transition-all duration-300 ${
              canGoNext
                ? "border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                : "border-border/50 text-muted-foreground cursor-not-allowed"
            }`}
          >
            <ArrowRight size={16} className="sm:w-5 sm:h-5" />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};
