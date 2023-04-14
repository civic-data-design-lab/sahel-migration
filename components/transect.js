import React, {useEffect, useRef} from 'react';
import * as d3 from "d3";
import useWindowSize from "../hooks/useWindowSize";
import Streamgraph from "./streamgraph";

// declared in both steamgraph.js and transect.js, where should this constant be declared globally?
const risks = [
    {"risk": "4mi", "label": "Reported Violence", "color": "#5D3435"},
    {"risk": "acled", "label": "Conflict Events", "color": "#985946"},
    {"risk": "food", "label": "Food Insecurity", "color": "#9A735A"},
    {"risk": "smuggler", "label": "Smuggler Assistance", "color": "#F48532"},
    {"risk": "remoteness", "label": "Remoteness", "color": "#624B44"},
    {"risk": "heat", "label": "Extreme Heat", "color": "#5D3435"}
];

let riskWeight = {
    "4mi": 100/6,
    "acled": 100/6,
    "food": 100/6,
    "smuggler": 100/6,
    "remoteness": 100/6,
    "heat": 100/6
};

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
    d3.csv("/data/transectsegment.csv").then(function (data) {
      let yLabel = "";

    //   map data to tidy data format for stacked area chart
      let dataStackedArea = []
      for (let i=0; i < data.length; i++) {
          for (let r=0; r < risks.length; r++) {
              let item = {};
              let risk = risks[r].risk;

            //   filter data by every 50 data points (to achieve curved look)
              if (i !== data.length-1 && i % 50 == 0) {
                item.distance = +data[i].distance;
                item.risk = risk;
                item.value = +data[i]["risk_" + risk] * riskWeight[risk];
                dataStackedArea.push(item)
              }
              
          }
      }
      if (risk !== "all") {
        yLabel = title[risk]
        data = data.filter(d => d.risk === risk)
        height = height * .37

      }
    //   Streamgraph(data, {
    Streamgraph(dataStackedArea, {
        x: d => d.distance,
        y: d => d.value,
        z: d => d.risk,
        yLabel: yLabel,
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
