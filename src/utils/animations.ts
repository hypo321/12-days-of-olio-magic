export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const heroVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      opacity: { duration: 0.5 },
      y: { duration: 0.5 },
    },
  },
  highlight: {
    scale: [0.8, 0.2, 1.8, 0.6, 1.4, 0.8, 1.2, 0.9, 1.1, 0.95, 1],
    transition: {
      delay: 0.5,
      duration: 4,
      times: [0, 0.15, 0.3, 0.45, 0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 1],
      type: 'spring',
      stiffness: 400,
      damping: 2,
      mass: 0.4,
      restSpeed: 0.2,
      restDelta: 0.01,
      velocity: 2,
    },
  },
};

// Custom hook for hero animations
export const useHeroAnimation = () => ({
  initial: 'hidden',
  animate: 'visible',
  whileInView: 'highlight',
  viewport: { once: true },
  variants: heroVariants,
});

export const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: 0.2,
    },
  },
};
