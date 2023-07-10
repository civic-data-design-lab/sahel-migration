import React from 'react';
import styles from '../styles/ScrollIndicator.module.css';
import { motion } from 'framer-motion';

export default function ScrollIndicator({ onClick }) {
  return (
    <div className={styles.container}>
      <span className={styles.scrollIndicator}>Scroll to view more</span>
      <motion.span
        class="material-symbols-outlined"
        onClick={onClick}
        style={{color: '#463c35'}}
      >
        keyboard_arrow_down
      </motion.span>
    </div>
  );
}