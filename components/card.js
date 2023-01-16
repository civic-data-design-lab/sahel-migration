import { motion } from 'framer-motion';
import styles from '../styles/Card.module.css';
export default function Card({ posX, posY, text }) {
  return (
    <span>
      <motion.div className={styles.cardContainer}>
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, x: posX, y: posY }}
          transition={{ duration: 0.5 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 'all' }}
        >
          {text}
        </motion.div>
      </motion.div>
    </span>
  );
}
