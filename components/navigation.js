import styles from '../styles/Navigation.module.css';
import Link from 'next/link';
import Stepper from './stepper';
import {useEffect, useState} from 'react';
import { motion } from 'framer-motion';
import { color } from 'd3';
export default function Navigation({ journeys, journey }) {
  const [isActiveLeft, setIsActiveLeft] = useState(false);
  const [isActiveRight, setIsActiveRight] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 480) {
      setIsActiveLeft(true);
      setIsActiveRight(true);
    }
    }, [window.innerWidth]
  );
  const routes = {};
  journeys.forEach((journey) => (routes[journey.id] = journey.route));
  return (
    <div className={styles.navigationBar}>
      <div className={styles.navigationContainer} style={{pointerEvents: isActiveLeft? 'all' : 'none'}}>
        {journey.id > 1 ? (
          <>
            <Stepper
              totalSteps={8}
              stepNumber={journey.id}
              journeys={journeys}
              reversed={false}
              isActive={isActiveLeft}
              onHoverStart={() => setIsActiveLeft(true)}
              onHoverEnd={() => setIsActiveLeft(false)}
            />
            <div className={styles.buttonContainer} style={{justifyContent: "flex-start"}}>
            <motion.button
              className={styles.button}
              style={{ marginLeft: '1rem', alignSelf: 'flex-start' }}
              onMouseEnter={() => setIsActiveLeft(true)}
              onMouseLeave={() => setIsActiveLeft(false)}
            >
              {journey.id > 2 ? (
                <Link className={styles.buttonLink} href={'/journeys/[id]'} as={'/journeys/' + routes[journey.id - 1]}>
                  <span className={`${styles.arrowIcon} material-symbols-outlined`} style={{fontSize: window.innerWidth < 480? '2.2rem': '1.75rem'}}>
                    arrow_left
                  </span>
                  <span className={`${styles.buttonText} ${styles.buttonTextPrev}`}>Previous Chapter</span>
                </Link>
              ) : (
                <Link className={styles.buttonLink} href={'/'}>
                  <span className={`${styles.arrowIcon} material-symbols-outlined`} style={{fontSize: window.innerWidth < 480? '2.2rem': '1.75rem'}}>
                    arrow_left
                  </span>
                  <span className={`${styles.buttonText} ${styles.buttonTextPrev}`}>Previous Chapter</span>
                </Link>
              )}
            </motion.button>
            </div>
          </>
        ) : (
          <div></div>
        )}
      </div>

      <div className={styles.navigationContainer} style={{pointerEvents: isActiveRight? 'all' : 'none'}}>
        {journey.id < 8 ? (
          <>
            <Stepper
              totalSteps={8}
              stepNumber={journey.id}
              journeys={journeys}
              reversed={true}
              isActive={isActiveRight}
              onHoverStart={() => setIsActiveRight(true)}
              onHoverEnd={() => setIsActiveRight(false)}
            />
            <div className={styles.buttonContainer} style={{justifyContent: "flex-end"}}>
              <motion.button
                className={styles.button}
                style={{ marginRight: '1rem', alignSelf: 'flex-end' }}
                onMouseEnter={() => setIsActiveRight(true)}
                onMouseLeave={() => setIsActiveRight(false)}
              >
                <Link className={styles.buttonLink} href={'/journeys/[id]'} as={'/journeys/' + routes[journey.id + 1]}>
                <span className={`${styles.buttonText} ${styles.buttonTextNext}`}>Next Chapter</span>
                <span className={`${styles.arrowIcon} material-symbols-outlined`} style={{fontSize: window.innerWidth < 480? '2.2rem': '1.75rem'}}>
                  arrow_right
                </span>
                </Link>
              </motion.button>
            </div>
          </>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
