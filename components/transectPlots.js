import React, {useEffect, useRef} from 'react';
import Transect from "./transect";
import {motion,} from "framer-motion";
import DataTabToggle from "./dataTabToggle";
import ImageCarousel from "./imageCarousel";

import useWindowSize from "../hooks/useWindowSize";


export default function TransectPlots ({ isOpen, toggleOpen}) {
  const contentRef = useRef(null);
  const { width, height } = useWindowSize();
  const containerStyles = {
    overflow: "hidden",
    scrollbarWidth:"none"
    /* Other styles */
  };


  useEffect( () => {
  },[contentRef, height, width,isOpen])


  return (
    <div style={containerStyles} ref={contentRef}>
      <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}} >
        <DataTabToggle isOpen={isOpen} toggleOpen={toggleOpen} />
      </div>
        <motion.div

          style={{ height: !isOpen ? "auto" : 0, opacity: !isOpen ? 1 : 0, pointerEvents: "none" }}
          animate={{ height: !isOpen ? "auto" : 0, opacity: !isOpen ? 1 : 0}}
          transition={{ duration: 0.3 }}>
          <Transect isOpen={isOpen}/>
        </motion.div>
        <motion.div style={{paddingTop:"4rem"}}>
          <Transect isOpen={isOpen} />
          <ImageCarousel isOpen={isOpen}/>
        </motion.div>

    </div>
  );
}
