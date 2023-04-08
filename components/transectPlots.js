import React, {useEffect, useState} from 'react';
import useSWR from "swr";
import {fetcher} from "../hooks/useFetch";
import Transect from "./transect";
import {motion, AnimatePresence} from "framer-motion";
import DataTabToggle from "./dataTabToggle";

export default function TransectPlots ({isOpen, toggleOpen}) {

  useEffect( () => {
  })

  const transectTypes = ["4mi", "ACLED","food security", "smuggler", "remoteness", "heat"]

  const TransectLayers = transectTypes.map((t,i) => {
    return <Transect risk={t} key={i}/>

  })





  return (
    <div style={{overflowX:"scroll", scrollbarWidth:"none" }}>
      <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
        <DataTabToggle isOpen={isOpen} toggleOpen={toggleOpen} />
      </div>
      <AnimatePresence>
      {
        isOpen
          ? TransectLayers
          : <Transect risk={"all"}/>
      }
      </AnimatePresence>

    </div>
  );
}
