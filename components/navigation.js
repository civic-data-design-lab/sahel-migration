import styles from '../styles/Navigation.module.css';
import Link from 'next/link';
import Stepper from './stepper';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { color } from 'd3';
export default function Navigation({ journeys, journey }) {
  const [isActiveLeft, setIsActiveLeft] = useState(false);
  const [isActiveRight, setIsActiveRight] = useState(false);
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
            <motion.button
              className={styles.button}
              style={{ marginLeft: '1rem', alignSelf: 'flex-start' }}
              onHoverStart={() => setIsActiveLeft(true)}
              onHoverEnd={() => setIsActiveLeft(false)}
            >
              {journey.id > 2 ? (
                <Link href={'/journeys/[id]'} as={'/journeys/' + routes[journey.id - 1]}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>
                    arrow_left
                  </span>
                </Link>
              ) : (
                <Link href={'/'}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>
                    arrow_left
                  </span>
                </Link>
              )}
            </motion.button>
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
            <motion.button
              className={styles.button}
              style={{ marginRight: '1rem', alignSelf: 'flex-end' }}
              onHoverStart={() => setIsActiveRight(true)}
              onHoverEnd={() => setIsActiveRight(false)}
            >
              <Link href={'/journeys/[id]'} as={'/journeys/' + routes[journey.id + 1]}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>
                  arrow_right
                </span>
              </Link>
            </motion.button>
          </>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
