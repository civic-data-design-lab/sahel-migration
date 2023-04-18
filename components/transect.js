import React, {useEffect, useRef} from 'react';
import * as d3 from "d3";
import useWindowSize from "../hooks/useWindowSize";
import Streamgraph, {DrawTooltip, PlotTransectLayers} from "./streamgraph";

export default function Transect ({isOpen}) {
  const { width, height } = useWindowSize();
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
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

  //TODO: refactor this to be a single object
  const colors = {
    "4mi": "#5D3435",
    "ACLED": "#985946",
    "food security": "#9A735A",
    "smuggler": "#F48532",
    "remoteness": "#624B44",
    "heat": "#3F231B",
  }


  function drawLayers(svgRef,width,height, isOpen) {
    // const svg = d3.select(svgRef.current);
    const windowWidth = width;
    const windowHeight = height;
    const svg = d3.select(svgRef.current)

    const margin = {
      top: 10,
      right: 20,
      left: 20,
      bottom: 20
    }


    d3.json("/data/transect.json").then(function (data) {
    let dataStackedArea  = data.filter(d => d.index % 50 === 0)
    let yLabel = ""
    svg.selectAll("*").remove()
    const xDomain = [dataStackedArea[0].index,dataStackedArea[dataStackedArea.length-1].index]
    const xRange = [margin.left, width - margin.right]
    const xScale = d3.scaleLinear().domain(xDomain).range(xRange)
    if (isOpen) {
      PlotTransectLayers(dataStackedArea, {
        yLabel: yLabel,
        width: width,
        height: height,
        svg: svg,
        colors: colors,
        risks: risks,
        margin: margin,
      })
      DrawTooltip({
        width: width,
        height: height,
        data: dataStackedArea,
        svgRef: svgRef,
        tooltipRef: tooltipRef,
        xScale: xScale,
      })

    } else {
      svg
        .attr("id", "viz-transect-layers")
        .attr("class", "viz-transect")
        .attr("viewBox", [0, 0, width, .33*height])
      Streamgraph(dataStackedArea, {
        x: d => d.distance,
        y: d => d.value,
        z: d => d.risk,
        yLabel: yLabel,
        width: width,
        height: .22*height,
        svg: svg,
        colors: colors,
        risks: risks,
        risk: "all",
        margin: margin,
      })
        DrawTooltip({
          width: width,
          height: height,
          data: dataStackedArea,
          svgRef: svgRef,
          tooltipRef: tooltipRef,
          xScale: xScale,

        })
    }
    })
  }


  useEffect(() => {
    drawLayers(svgRef,width,height,isOpen);

  }, [height, svgRef, width, isOpen]);
  return (
    <>
      <svg ref={svgRef} />
      {/*<svg ref={tooltipRef} />*/}
    </>

  )
}
