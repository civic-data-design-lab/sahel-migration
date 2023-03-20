import { motion, AnimatePresence, useScroll } from "framer-motion"
import styles from '../styles/Card.module.css';
import { useEffect, useLayoutEffect, useState } from "react";
import * as d3 from "d3";
import useWindowSize from "../hooks/useWindowSize";


export default function Card({ svgRef, entourage, width, height, scrollRef }) {
  const { scrollXProgress } = useScroll({ target: scrollRef });
  const [isOpen, setIsOpen] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    svgRef.current.addEventListener("load", () => {
      const svg = d3.select(svgRef.current.contentDocument.documentElement);
      const bbox = svg.select("#fig-" + entourage.id).node().getBoundingClientRect();
      setX(bbox.x)
      setY(bbox.y)
      // setbboxWidth(bbox.width)
      svg.selectAll("#outline-" + entourage.id).style("opacity", 0);
      svg.selectAll("#fig-" + entourage.id).style("cursor", "pointer")
        .on("mouseout", function () {
          svg.select("#outline-" + entourage.id)
            .style("opacity", 0);
          setIsOpen(false)
        })
        .on("mouseover", function () {
          svg.select("#outline-" + entourage.id)
            .style("opacity", 1);
          setIsOpen(true)
        })
    });
    scrollXProgress.on("change", latest => setIsOpen(latest >= entourage.scrollStart && latest <= entourage.scrollEnd))
  }, [entourage.id, entourage.scrollEnd, entourage.scrollStart, isOpen, scrollXProgress, svgRef])

  useLayoutEffect(() => {
    if (svgRef.current.contentDocument != null) {
      const svg = d3.select(svgRef.current.contentDocument.documentElement);
      if (svg.select("#fig-" + entourage.id).node() != null) {
        const bbox = svg.select("#fig-" + entourage.id).node().getBoundingClientRect();
        setX(bbox.x)
        setY(bbox.y)
      }
    }

  }, [width, height, svgRef, entourage.id])
  return (
    <motion.div className={styles.cardContainer} style={{ left: width < 480 ? x + .5 * entourage.posX : x + entourage.posX, top: y + entourage.posY }}>
      <motion.div
        layout
        viewport={{ amount: 'all' }}
        transition={{ duration: .35 }}
        onHoverStart={() => { setIsOpen(true) }}
        onHoverEnd={() => { setIsOpen(false) }}
        className={`${styles.card} body-3`}
        style={{ border: isOpen ? 'none' : 'black solid', padding: isOpen ? '0.4rem' : '0.2rem' }}
      >
        <AnimatePresence>
          {isOpen && <motion.div
            className={styles.expandedCard}
          >
            {entourage.body}
          </motion.div>}
        </AnimatePresence>
      </motion.div>

    </motion.div>
  );
}
