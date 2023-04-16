import React, {useEffect, useMemo, useRef} from 'react';
import useSWR from "swr";
import {fetcher} from "../hooks/useFetch";
import Transect from "./transect";
import {motion, AnimatePresence} from "framer-motion";
import DataTabToggle from "./dataTabToggle";
import ImageCarousel from "./imageCarousel";

export default function TransectPlots ({isOpen, toggleOpen}) {
  const { data: risks, errorRisks} = useSWR(['/api/journeys/risksdata', 'risks'], fetcher);
  const contentRef = useRef(null);
  // useEffect(() => {
  //   if (!isOpen) {
  //     contentRef.current.scrollTo(0, 0);
  //   }
  // }, [isOpen]);

  const containerStyles = {
    overflowY: isOpen ? 'auto' : 'hidden',
    overflowX:"scroll",
    scrollbarWidth:"none"
    /* Other styles */
  };
  // const TransectLayers = useMemo(() =>  {
  //   const transectTypes = ["4mi", "ACLED","food security", "smuggler", "remoteness", "heat"]
  //   return transectTypes.map((t,i) => {
  //   return (
  //     <motion.div
  //       className="accordion-content"
  //       animate={{ height: isOpen ? "auto" : 0 }}
  //       transition={{ duration: 0.1 }}
  //       key={i}
  //     >
  //       <Transect risk={t} key={i}/>
  //     </motion.div>
  //   )
  // }) },[isOpen])


  useEffect( () => {
    // console.log(risks)
    console.log(risks)
  })
  if (errorRisks) return <div>Transects not found</div>;

  return (
    <div style={containerStyles} ref={contentRef}>
      <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}} >
        <DataTabToggle isOpen={isOpen} toggleOpen={toggleOpen} />
      </div>
      <div>
        <Transect risk={"all"} data={risks}/>
      </div>

    </div>
  );
}
