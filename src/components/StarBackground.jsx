import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const StarBackground = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    generateStars();
    const handleResize = () => {
      generateStars();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const generateStars = () => {
    const numberOfStars = Math.floor(
      (window.innerWidth * window.innerHeight) / 15000
    );
    const newStars = [];
    for (let i = 0; i < numberOfStars; i++) {
      newStars.push({
        id: i,
        size: Math.random() * 2 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.8 + 0.3,
        twinkleDuration: Math.random() * 6 + 4,
        // Movement properties for Framer Motion
        moveDistance: Math.random() * 50 + 4,
        moveDuration: Math.random() * 15 + 20,
      });
    }
    setStars(newStars);
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="star-minimal"
          initial={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity,
          }}
          animate={{
            left: [
              `${star.x}%`,
              `${star.x + (Math.random() - 0.5) * star.moveDistance}%`,
              `${star.x + (Math.random() - 0.5) * star.moveDistance}%`,
              `${star.x}%`,
            ],
            top: [
              `${star.y}%`,
              `${star.y + (Math.random() - 0.5) * star.moveDistance}%`,
              `${star.y + (Math.random() - 0.5) * star.moveDistance}%`,
              `${star.y}%`,
            ],
            opacity: [
              star.opacity,
              star.opacity * 1.2,
              star.opacity * 0.6,
              star.opacity * 1.1,
              star.opacity,
            ],
          }}
          transition={{
            duration: star.moveDuration,
            delay: 0,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
          style={{
            width: star.size + "px",
            height: star.size + "px",
            position: "absolute",
          }}
        />
      ))}
    </div>
  );
};
