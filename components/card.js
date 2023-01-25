import {motion, AnimatePresence, useScroll} from "framer-motion"
import styles from '../styles/Card.module.css';
import {useEffect, useLayoutEffect, useState} from "react";
import * as d3 from "d3";


export default function Card({svgRef, entourage, width,height, scrollRef}) {
  const { scrollXProgress } = useScroll({ target: scrollRef });
  const [isOpen, setIsOpen] = useState(scrollXProgress.get() >= entourage.scrollStart && scrollXProgress.get() <= entourage.scrollEnd);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [bboxWidth, setbboxWidth] = useState(0);

  useEffect(() => {
    svgRef.current.addEventListener("load", () => {
      const svg = d3.select(svgRef.current.contentDocument.documentElement);
      const bbox = svg.select("#fig-"+entourage.id).node().getBoundingClientRect();
      setX(bbox.x)
      setY(bbox.y)
      setbboxWidth(bbox.width)
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
    scrollXProgress.on("change", latest =>setIsOpen(latest >= entourage.scrollStart && latest <= entourage.scrollEnd))
  }, [entourage.id, isOpen, svgRef])

  useLayoutEffect(()=> {
    let svg = d3.select(svgRef.current.contentDocument.documentElement);
    if (svg.select("#fig-"+entourage.id).node() ==null) {
      svgRef.current.addEventListener("load", () => {
        svg = d3.select(svgRef.current.contentDocument.documentElement);
      })
    } else {
      const bbox = svg.select("#fig-"+entourage.id).node().getBoundingClientRect();
      setX(bbox.x)
      setY(bbox.y)
    }


  },[width, height, svgRef, entourage.id])
  return (
    <div className={styles.cardContainer} style={{left: x+entourage.posX, top: y+entourage.posY}}>
      <motion.div layout
                  initial={{ opacity: 1}}
                  transition={{layout: {duration: .5, opacity:0 }}}
        // whileInView={{ opacity: 0.8 }}
                  viewport={{ amount: 'all' }}
                  animate={{scale: 1.05, opacity:.9}}
        // whileHover={{ scale: 1.05, opacity: 1 }}
                  exit={{opacity: 0}}
                  className={styles.card}
      >
        <AnimatePresence>
        <motion.div layout/>
        {isOpen && <motion.div
          initial={{ opacity: 1}}
          animate={{opacity:1}}
          transition={{opacity:.8}}
          exit={{opacity:0}}
          className={styles.expandedCard}
        >
          {entourage.body}
        </motion.div>}
          </AnimatePresence>
    </motion.div>
    </div>
  );
}
