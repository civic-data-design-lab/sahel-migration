import { motion, AnimatePresence } from "framer-motion"
import styles from '../styles/Card.module.css';
import {useEffect, useState} from "react";
import * as d3 from "d3";

export default function Card({svgRef, entourage }) {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    // const svgElement = d3.select(document.getElementById("entourage-container-"+entourage.id).contentDocument);
    // console.log(document.getElementById("entourage-container-"+entourage.id).contentDocument)

    svgRef.current.addEventListener("load", () => {
      const svg = d3.select(svgRef.current.contentDocument.documentElement);
      svg.selectAll("#fig-"+entourage.id).style("cursor", "pointer")
        .on("mouseover", function () {
          svg.select("#outline-"+entourage.id)
            .style("opacity", 1);
          setIsOpen(true)
        })
        .on("mouseout", function () {
          svg.select("#outline-"+entourage.id)
            .style("opacity", 0);
          setIsOpen(false)
        });
    });
  }, [isOpen, svgRef])
  return (
    <span>

    <motion.div className={styles.cardContainer}>
      <AnimatePresence>
        <motion.div  initial={{ opacity: .2, x: entourage.posX, y: entourage.posY }} className={styles.card}>{entourage.body}</motion.div>
        {isOpen && <motion.div
          className={styles.card}
          initial={{ opacity: 0, x: entourage.posX, y: entourage.posY }}
          transition={{ease: "easeOut", duration: .5 }}
          // whileInView={{ opacity: 0.8 }}
          viewport={{ amount: 'all' }}
          animate={{scale: 1.05, opacity:1}}
          // whileHover={{ scale: 1.05, opacity: 1 }}
          exit={{opacity: 0}}
        >
          {entourage.body}
      </motion.div>}
      </AnimatePresence>
    </motion.div>

    </span>
  );
}
