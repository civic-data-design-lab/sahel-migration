import styles from '../styles/Stepper.module.css';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {useEffect} from "react";
export default function Stepper({
  totalSteps,
  stepNumber,
  journeys,
  reversed,
  isActive,
  onHoverStart,
  onHoverEnd,
}) {
  const steps = [...Array(totalSteps).keys()].reverse();
  const variants = {
    open: {
      opacity: 1,
      // transition: { staggerChildren: 1, delayChildren: 0.2 }
    },
    closed: {
      opacity: 0,
      // transition: { staggerChildren: 0.05, staggerDirection: -1 }
    },
  };
  useEffect(() => {}, [window.innerWidth]);

  function renderSteps(currentStep, stepNumber) {
    const isFilled = currentStep < stepNumber ? styles.filled : '';
    const isCurrent = currentStep === stepNumber ? styles.current : '';
    const item = journeys.find((item) => item.id === currentStep + 1);
    return (
      <Link
        key={currentStep}
        href={item.route || '/'}
        className={styles.stepContainer}
        style={{ flexDirection: reversed ? 'row-reverse' : '', pointerEvents: isActive ? 'all' : 'none'}}
      >
        <div className={`${styles.step} ${isFilled} ${isCurrent}`} />
        <small className={styles.textContainer}>{item.title}</small>
      </Link>
    );
  }
  return (
    <motion.div
      className={styles.stepperContainer}
      animate={isActive ? 'open' : 'closed'}
      variants={variants}
      onMouseEnter={isActive && onHoverStart}
      onMouseLeave={isActive && onHoverEnd}
      // onTouchStart={isActive && onHoverStart}
      // onTouchEnd={isActive && onHoverEnd}s
    >
      <div
        className={styles.stepperLine}
        style={{ transform:  window.innerWidth < 480? reversed ? 'translate(5.95rem,-69%)' : '' : reversed ? 'translate(11.7rem,-65%)' : '' }}
      />
      <motion.div
        className={styles.stepper}
        animate={isActive ? 'open' : 'closed'}
        variants={variants}
      >
        {steps.map((currentStep) => renderSteps(currentStep, stepNumber))}
      </motion.div>
    </motion.div>
  );
}
