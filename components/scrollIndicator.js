import React from 'react';
import styles from '../styles/ScrollIndicator.module.css';
import { motion } from 'framer-motion';

export default function ScrollIndicator({ onClick }) {
  return (
    <div className={styles.container}>
      <motion.span
        class="material-symbols-outlined"
        onClick={onClick}

      >
        keyboard_arrow_down
      </motion.span>
      <span>Scroll To View More</span>
    </div>
  );
}
