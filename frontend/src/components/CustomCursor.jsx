import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY, isVisible]);

  if (typeof window === 'undefined') return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] rounded-full mix-blend-difference"
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        opacity: isVisible ? 0.8 : 0,
      }}
      animate={{
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    />
  );
};

export default CustomCursor;