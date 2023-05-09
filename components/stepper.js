import styles from '../styles/Stepper.module.css';
import { motion } from 'framer-motion';
export default function Stepper({ totalSteps, stepNumber, journeys, reversed, isActive }) {
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
  function renderSteps(currentStep, stepNumber) {
    const isFilled = currentStep < stepNumber ? styles.filled : '';
    const isCurrent = currentStep === stepNumber ? styles.current : '';
    return (
      <div
        className={styles.stepContainer}
        style={{ flexDirection: reversed ? 'row-reverse' : '' }}
      >
        <div className={`${styles.step} ${isFilled} ${isCurrent}`} />
        <small className={styles.textContainer}>
          {journeys.find((item) => item.id === currentStep + 1).title}
        </small>
      </div>
    );
  }
  return (
    <motion.div
      className={styles.stepperContainer}
      animate={isActive ? 'open' : 'closed'}
      variants={variants}
    >
      <div
        className={styles.stepperLine}
        style={{ transform: reversed ? 'translate(11.7rem,-65%)' : '' }}
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
