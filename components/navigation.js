import styles from '../styles/Navigation.module.css'
import Link from "next/link";
import Stepper from "./stepper";
import { useState } from "react";
import { motion } from "framer-motion"
export default function Navigation({ journeys, journey }) {
  const [isActiveLeft, setIsActiveLeft] = useState(false)
  const [isActiveRight, setIsActiveRight] = useState(false)


  return (
    <div className={styles.navigationBar}>
      <div className={styles.navigationContainer}>
        {journey.id > 1 ?
          <>
            <Stepper totalSteps={8} stepNumber={journey.id} journeys={journeys} reversed={false} isActive={isActiveLeft} />
            <motion.button className={styles.button} style={{ marginLeft: ".9rem", alignSelf: "flex-start" }} onHoverStart={() => setIsActiveLeft(!isActiveLeft)}
              onHoverEnd={() => setIsActiveLeft(!isActiveLeft)}>
              <Link href={'/journeys/[id]'} as={'/journeys/' + (journey.id - 1)}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.7rem' }}>navigate_before</span>
              </Link>
            </motion.button>
          </>
          : <div></div>}
      </div>

      <h2 className={styles.title}>{journey.title}</h2>
      <div className={styles.navigationContainer}>

        {journey.id < 7 ?
          <>
            <Stepper totalSteps={8} stepNumber={journey.id} journeys={journeys} reversed={true} isActive={isActiveRight} />
            <motion.button className={styles.button} style={{ marginRight: ".9rem", alignSelf: "flex-end" }} onHoverStart={() => setIsActiveRight(!isActiveRight)}
              onHoverEnd={() => setIsActiveRight(!isActiveRight)}>
              <Link href={'/journeys/[id]'} as={'/journeys/' + (journey.id + 1)}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.7rem' }}>
                  navigate_next
                </span>
              </Link>
            </motion.button>
          </>
          : <div></div>}
      </div>

    </div>)
}
