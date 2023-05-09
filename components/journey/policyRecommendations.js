import { motion, AnimatePresence, useScroll } from 'framer-motion';
import styles from '../../styles/PolicyRecommendations.module.css';
import { useEffect, useLayoutEffect, useState } from 'react';

export default function PolicyRecommendations({ narrativeTexts}) {
  const slides = [
    {
      title: 'Slide 1',
      body: 'This is the first slide'
    },
    {
      title: 'Slide 2',
      body: 'This is the second slide'
    },
    {
      title: 'Slide 3',
      body: 'This is the third slide'
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    setCurrentSlide((currentSlide + 1) % narrativeTexts.length);
  };
  const handlePrev = () => {
    setCurrentSlide((currentSlide - 1 + narrativeTexts.length) % narrativeTexts.length);
  };
  useEffect(() => {
  }, []);

  return (
    <motion.div className={styles.cardContainer}>
      <motion.div  className={`${styles.card} body-4`}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0}}
            transition={{ duration: .7 }}
          >
            <motion.p className="body-5" style={{ fontWeight: 'bold', marginBottom: 0}}>{narrativeTexts[currentSlide].title}</motion.p>
            <motion.p className="body-5">{narrativeTexts[currentSlide].body}</motion.p>
          </motion.div>
        <div className={styles.buttons}>
          <button className={styles.navButton}>
          <span onClick={handlePrev} className="material-symbols-outlined" style={{ fontSize: '1.75rem'}}>
                  arrow_left
          </span></button>
          <span style={{ textAlign: 'center', verticalAlign: 'middle'}}>{currentSlide + 1} of {narrativeTexts.length}</span>
          <button className={styles.navButton}>
          <span onClick={handleNext} className="material-symbols-outlined" style={{ fontSize: '1.75rem'}}>
                  arrow_right
          </span>
          </button>

        </div>

      </motion.div>
    </motion.div>
  );
}
