import React, {useEffect, useRef} from 'react';
import * as d3 from "d3";
import useWindowSize from "../hooks/useWindowSize";
import Streamgraph from "./streamgraph";


export default function Transect ({risk}) {
  const { width, height } = useWindowSize();
  // const width = 600 - margin.left - margin.right;
  // const height = 400 - margin.top - margin.bottom;
  const colors = {
    "4mi": "#5D3435",
    "ACLED": "#985946",
    "food security": "#9A735A",
    "smuggler": "#F48532",
    "remoteness": "#624B44",
    "heat": "#3F231B",
  }

  const svgRef = useRef(null);

  function drawLayers(svgRef,width,height) {
    // const svg = d3.select(svgRef.current);

    const svg = d3.select(svgRef.current)

    d3.csv("/data/transect_combined.csv").then(function (data) {
      if (risk !== "all") {
        for (const color in colors) {
          if (color !== risk) {
            colors[color] = "white"
          }
        }
      }
      Streamgraph(data, {
        x: d => d.distance,
        y: d => d.value,
        z: d => d.risk,
        // yLabel: "Risk",
        width: width,
        height: height,
        svg: svg,
        colors: colors
      })
    })
  }

  useEffect(() => {
    drawLayers(svgRef,width,height*.22, risk);

  }, [width, height, svgRef]);

  return (
    <div style={{marginTop:"0rem"}}>
      {/*hello*/}
      {/*{data.map(d=> d.location_start)}*/}
      <svg ref={svgRef} width={width} height={height}  style={{marginTop:"10px"}}/>
    </div>
  )
}
