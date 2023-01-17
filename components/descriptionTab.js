// import Button from './button';
import { motion, AnimatePresence } from 'framer-motion';
import { wrap } from '@popmotion/popcorn';
import { useState } from 'react';
import styles from '../styles/DescriptionTab.module.css';
import Stepper from './stepper';
const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

export default function DescriptionTab({ descriptions, handleScroll }) {
  const [[page, direction], setPage] = useState([0, 0]);
  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
  };
  const descIndex = wrap(0, descriptions.length, page);
  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleButtonClick = (newDirection) => {
    paginate(newDirection);
    const index = (descIndex + newDirection) % descriptions.length;
    handleScroll(descriptions[index].posX, 0);
  };

  return (
    <div className={styles.main}>
      <div className={styles.stepper}>
        <Stepper
          totalSteps={descriptions.length - 1}
          stepNumber={descriptions[descIndex].id}
        />
      </div>

      <AnimatePresence
        initial={false}
        custom={direction}
        className={styles.main}
      >
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          className={styles.main}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              handleButtonClick(1);
            } else if (swipe > swipeConfidenceThreshold) {
              handleButtonClick(-1);
            }
          }}
        >
          <div className={styles.content}>
            <div>{descriptions[descIndex].body}</div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className={styles.prev} onClick={() => handleButtonClick(-1)}>
        Previous
      </div>
      <div className={styles.next} onClick={() => handleButtonClick(1)}>
        Next
      </div>
    </div>
  );
}
