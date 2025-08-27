import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface ScrollAnimationProps {
  children: React.ReactNode;
  animation?: 'fade-right' | 'fade-left' | 'fade-up' | 'zoom-in' | 'flip-left';
  delay?: number;
  duration?: number;
  className?: string;
}

export default function ScrollAnimation({ 
  children, 
  animation = 'fade-up', 
  delay = 0, 
  duration = 0.6,
  className = ''
}: ScrollAnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  const getAnimationVariants = () => {
    switch (animation) {
      case 'fade-right':
        return {
          hidden: { x: -50, opacity: 0 },
          visible: { x: 0, opacity: 1 }
        };
      case 'fade-left':
        return {
          hidden: { x: 50, opacity: 0 },
          visible: { x: 0, opacity: 1 }
        };
      case 'fade-up':
        return {
          hidden: { y: 50, opacity: 0 },
          visible: { y: 0, opacity: 1 }
        };
      case 'zoom-in':
        return {
          hidden: { scale: 0.8, opacity: 0 },
          visible: { scale: 1, opacity: 1 }
        };
      case 'flip-left':
        return {
          hidden: { rotateY: 90, opacity: 0 },
          visible: { rotateY: 0, opacity: 1 }
        };
      default:
        return {
          hidden: { y: 50, opacity: 0 },
          visible: { y: 0, opacity: 1 }
        };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={getAnimationVariants()}
      transition={{ 
        duration, 
        delay, 
        ease: "easeOut" 
      }}
    >
      {children}
    </motion.div>
  );
}
