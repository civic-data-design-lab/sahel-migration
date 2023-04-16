import React, {useEffect, useRef} from 'react';
import * as d3 from "d3";
import useWindowSize from "../hooks/useWindowSize";
import Streamgraph from "./streamgraph";
import {fetcher} from "../hooks/useFetch";
import useSWR from "swr";

export default function Transect ({risk, data}) {
  const { width, height } = useWindowSize();
  let risks = {
    "4mi": {
        "index": 0,
        "label": "Reported Violence",
        "color": "#5D3435",
        "weight": 100/6
    },
    "acled": {
        "index": 1,
        "label": "Conflict Events",
        "color": "#985946",
        "weight": 100/6
    },
    "food": {
        "index": 2,
        "label": "Food Insecurity",
        "color": "#9A735A",
        "weight": 100/6
    },
    "smuggler": {
        "index": 3,
        "label": "Smuggler Assistance",
        "color": "#F48532",
        "weight": 100/6
    },
    "remoteness": {
        "index": 4,
        "label": "Remoteness",
        "color": "#624B44",
        "weight": 100/6
    },
    "heat": {
        "index": 5,
        "label": "Extreme Heat",
        "color": "#3F231B",
        "weight": 100/6
    }
  };

  const colors = {
    "4mi": "#5D3435",
    "ACLED": "#985946",
    "food security": "#9A735A",
    "smuggler": "#F48532",
    "remoteness": "#624B44",
    "heat": "#3F231B",
  }

  const title = {
    "4mi": "4mi",
    "ACLED": "ACLED",
    "food security": "Food Security",
    "smuggler": "Smuggler Need",
    "remoteness": "Remoteness",
    "heat": "Heat",
  }

  const svgRef = useRef(null);

  function drawLayers(svgRef,width,height) {
    // const svg = d3.select(svgRef.current);

    const svg = d3.select(svgRef.current)
    // d3.csv("/data/transect_combined.csv").then(function (data) {
    const dataStackedArea  = data.filter(d => d.index % 50 === 0)
    let yLabel = ""

    if (risk !== "all") {
      yLabel = title[risk]
      data = data.filter(d => d.risk === risk)
      height = height * .37

    }
    Streamgraph(dataStackedArea, {
      x: d => d.distance,
      y: d => d.value,
      z: d => d.risk,
      yLabel: yLabel,
      width: width,
      height: height,
      svg: svg,
      colors: colors,
      risks: risks
    })
  }

  useEffect(() => {
    console.log("DATA:", data)
    if (!data) return;
    drawLayers(svgRef,width,height*.22, risk);

  }, [data, svgRef]);
  return (
    <div style={{marginTop:"0rem"}}>
      {/*hello*/}
      {/*{data.map(d=> d.location_start)}*/}
      {/* <svg ref={svgRef} width={width} height={height}  style={{marginTop:"10px"}}/> */}
      <svg ref={svgRef} />
    </div>
  )
}
