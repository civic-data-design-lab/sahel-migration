import React, {useEffect, useState} from 'react';
import useSWR from "swr";
import {fetcher} from "../hooks/useFetch";
import Transect from "./transect";
import {motion, AnimatePresence} from "framer-motion";

export default function TransectPlots ({isOpen}) {
  const { data: borders, errorBorders } = useSWR(['/api/journeys/risksdata', 'borders'], fetcher);
  const { data: cities, errorCities } = useSWR(['/api/journeys/risksdata', 'cities'], fetcher);
  const { data: risks, errorRisks} = useSWR(['/api/journeys/risksdata', 'risks'], fetcher);
  const policyRisksColors = {
      0: 'green',
      1: 'yellow',
      2: 'red',
  }
  const heatRisksColors = {
    0: 'blue',
    1: 'purple',
    2: 'red',
  }




  // const heatData = transects.risk.extreme_heat.map((d) => ({
  //   name: 'extreme_heat',
  //   location_start: d.location_start,
  //   location_end: d.location_end,
  //   risk: d.Risk,
  // }));
  // const allData = [...policyData, ...heatData];
  useEffect( () => {
    // console.log(risks)
    console.log(cities)
  })

  if (errorBorders) return <div>Borders data not found</div>;
  if (errorRisks) return <div>Transects not found</div>;
  if (errorCities) return <div>Cities not found</div>;
  if (!borders) return <div>loading borders...</div>;
  if (!risks) return <div>loading risks...</div>;
  if (!cities) return <div>loading cities...</div>;
  const policyData = [risks.policy]
  const heatData = [risks.extreme_heat]
  const allData = [...policyData, ...heatData];
  const allRiskColors = [policyRisksColors, heatRisksColors]
  const combinedTransects = allData.map((d,i) => {
   return (<Transect key={i} layerData={[d]} borderData={borders} citiesData={cities} riskColors={[allRiskColors[i]]}/>)
  })



  return (
    <div style={{overflowX:"scroll", scrollbarWidth:"none" }}>
      <Transect layerData={allData} borderData={borders} citiesData={cities} riskColors={allRiskColors}/>
      <AnimatePresence>
        {isOpen &&<motion.div initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}>
        {combinedTransects}
      </motion.div>}
      </AnimatePresence>
        {/*<button onClick={combinePlot}>Combine Risks</button>*/}
      {/*<button onClick={expandPlot}>Expand Risks</button>*/}
    </div>
  );
}
