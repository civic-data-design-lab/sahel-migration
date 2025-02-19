import { motion, AnimatePresence, useScroll} from 'framer-motion';
import styles from '../../styles/Card.module.css';
import { useEffect, useLayoutEffect, useState,useRef} from 'react';
import * as d3 from 'd3';
import useWindowSize from '../../hooks/useWindowSize';

export default function Card({ svgRef, entourage, width, height, scrollXProgress }) {
  const [isOpen, setIsOpen] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const previousScrollXRef = useRef(0);
  useEffect(() => {
    svgRef.current.addEventListener('load', () => {
      const svg = d3.select(svgRef.current.contentDocument.documentElement);
      const bbox = svg
        .select('#fig-' + entourage.id)
        .node()
        .getBoundingClientRect();
      setX(bbox.x);
      setY(bbox.y);
      // setbboxWidth(bbox.width)
      svg.selectAll('#outline-' + entourage.id).style('opacity', 0);

      svg
        .selectAll('#fig-' + entourage.id)
        .style('cursor', 'pointer')
        .on('mouseout', function () {
          svg.select('#outline-' + entourage.id).style('opacity', 0);
          setIsOpen(false);
        })
        .on('mouseover', function () {
          svg.select('#outline-' + entourage.id).style('opacity', 1);
          setIsOpen(true);
        })
        .on('click', function (event) {
          let scrollX = event.clientX - window.innerWidth / 2;
          if (Math.abs(scrollX-previousScrollXRef.current)> 100) {
            window.scrollTo(scrollX+100, 0);
            previousScrollXRef.current = scrollX+100;
          }
        });
    });
    if (window.innerWidth < 480) {
      scrollXProgress.on('change', setBoundingBox);
    }
  }, [entourage.id, entourage.scrollEnd, entourage.scrollStart, isOpen, scrollXProgress, svgRef]);

  useLayoutEffect(() => {
    if (svgRef.current.contentDocument != null) {
      const svg = d3.select(svgRef.current.contentDocument.documentElement);
      if (svg.select('#fig-' + entourage.id).node() != null) {
        const bbox = svg
          .select('#fig-' + entourage.id)
          .node()
          .getBoundingClientRect();
        setX(bbox.x);
        setY(bbox.y);
      }
    }
  }, [width, height, svgRef, entourage.id]);

  const setBoundingBox = (latest) => {
    const svg = d3.select(svgRef.current.contentDocument.documentElement);
    // setIsOpen(latest >= entourage.scrollStart && latest <= entourage.scrollEnd);
    svg.select('#outline-' + entourage.id).style('opacity', latest >= entourage.scrollStart && latest <= entourage.scrollEnd ? 1 : 0);
  };

  return (
    <motion.div
      className={styles.cardContainer}
      style={{
        left: width < 480 ? x + 0.5 * entourage.posX : x + entourage.posX,
        top: y + entourage.posY,
        transform: entourage.scrollStart >= .8?  'translate(-100%, -100%)': '',
      }}
    >
      <motion.div
        layout
        viewport={{ amount: 'all' }}
        transition={{ duration: 0.35 }}
        onHoverStart={() => {
          setIsOpen(true);
        }}
        onHoverEnd={() => {
          setIsOpen(false);
        }}
        className={`${styles.card} body-4`}
        style={{ border: isOpen ? 'none' : ('0.1rem #463C35 solid'), padding: isOpen ? '0.6rem' : '0.15rem' }}
      >
        <AnimatePresence>
          {isOpen && <motion.div className={styles.expandedCard}>{entourage.body}</motion.div>}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
