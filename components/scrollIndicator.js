import React from 'react';
import styles from '../styles/ScrollIndicator.module.css';
import { motion } from 'framer-motion';

const bounceTransition = {
  y: {
    duration: 1,
    repeat: Infinity,
    repeatType: 'reverse',
    ease: 'easeOut',
  },
};
export default function ScrollIndicator() {
  return (
    <div className={styles.container}>
      <motion.span
        class="material-symbols-outlined"
      // transition={bounceTransition}
      // animate={{
      //   y: ['50%', '-50%', '0%', '0%'],
      // }}
      >
        keyboard_arrow_down
      </motion.span>
    </div>
  );
}
