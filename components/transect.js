import React, {useEffect, useRef} from 'react';
import * as d3 from "d3";
import useWindowSize from "../hooks/useWindowSize";
import Streamgraph, {DrawTooltip, PlotTransectLayers} from "./streamgraph";
import styles from '../styles/Transect.module.css'

export default function Transect ({isOpen, journey,containerHeight}) {
  const { width, height } = useWindowSize();
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  let risks = {
    "4mi": {
        "index": 0,
        "label": "Reported Violence",
        "color": "#5D3435",
        "weight": 1/6
    },
    "acled": {
        "index": 1,
        "label": "Conflict Events",
        "color": "#985946",
        "weight": 1/6
    },
    "food": {
        "index": 2,
        "label": "Food Insecurity",
        "color": "#9A735A",
        "weight": 1/6
    },
    "smuggler": {
        "index": 3,
        "label": "Need for a Smuggler",
        "color": "#F48532",
        "weight": 1/6
    },
    "remoteness": {
        "index": 4,
        "label": "Remoteness",
        "color": "#624B44",
        "weight": 1/6
    },
    "heat": {
        "index": 5,
        "label": "Extreme Heat",
        "color": "#3F231B",
        "weight": 1/6
    }
  };

  function drawLayers(svgRef,width,height, isOpen) {
    // const svg = d3.select(svgRef.current);
    const openedTabHeight = .80*height;
    const svg = d3.select(svgRef.current)
    const margin = {
      top: 50,
      right: 25,
      bottom: 20,
      left: 15
    }

    // d3.csv('/data/transectsegment.csv').then(function (data) {
    d3.json('/data/transect_all.json').then(function (data) {
      d3.json("/data/transect.json").then(function (stackedAreaData) {
        let filteredData = data.filter(d => d.index % 50 === 0 || d.index === stackedAreaData.length - 1);
        let filteredStackedAreaData  = stackedAreaData.filter(d => d.index % 50 === 0 || d.index === stackedAreaData.length - 1);
        let yLabel = "";
        svg.selectAll("*").remove();
        // Construct data domains
        const xDomain = [filteredStackedAreaData[0].distance, filteredStackedAreaData[filteredStackedAreaData.length-1].distance];
        // Construct svg ranges
        const xRange = [margin.left, width - margin.right];
        // Construct scales and axes
        const xScale = d3.scaleLinear().domain(xDomain).range(xRange);
        if (isOpen) {
          PlotTransectLayers(filteredStackedAreaData, {
            yLabel: yLabel,
            width: width,
            height: openedTabHeight,
            svg: svg,
            risks: risks,
            xScale: xScale,
            margin: margin,
            risksData: filteredData,
            journey: journey
          })
          DrawTooltip({
            width: width,
            height: openedTabHeight,
            data: filteredStackedAreaData,
            svgRef: svgRef,
            tooltipRef: tooltipRef,
            xScale: xScale,
            risks: risks,
            risksData: filteredData
          })
        } else {
          svg
            .attr("id", "viz-transect-layers")
            .attr("class", "viz-transect")
            .attr("viewBox", [0, 0, width, containerHeight])
          Streamgraph(filteredStackedAreaData, {
            x: d => d.distance,
            y: d => d.value,
            z: d => d.risk,
            yLabel: yLabel,
            width: width,
            height: containerHeight,
            svg: svg,
            risks: risks,
            risk: "all",
            margin: margin,
            xScale: xScale,
            risksData: filteredData,
            journey: journey
          })
          DrawTooltip({
            width: width,
            height: containerHeight,
            data: filteredStackedAreaData,
            svgRef: svgRef,
            tooltipRef: tooltipRef,
            xScale: xScale,
            risks: risks,
            risksData: filteredData
          })
        }
      })
    })

  }


  useEffect(() => {
    drawLayers(svgRef,width,height,isOpen);

  }, [containerHeight,height, svgRef, width, isOpen]);
  return (
    <>
      <svg ref={svgRef} />
      {/*<svg ref={tooltipRef} />*/}
      {/* <div id="transect-tooltip" className={[styles.transectTooltip, styles.template]}>
        <h4>Combined Risk
            <span id="risk-total" className={styles.labelData}>152/360</span>
        </h4>
        <p className={styles.risk4mi}>Reported Violence
            <span id="risk-4mi" className={styles.labelData}>12</span>
        </p>
        <p className={styles.riskAcled}>Armed Conflict
            <span id="risk-acled" className={styles.labelData}>0</span>
        </p>
        <p className={styles.riskFood}>Food Insecurity
            <span id="risk-food" className={styles.labelData}>40</span>
        </p>
        <p className={styles.riskSmuggler}>Smuggler Assistance
            <span id="risk-smuggler" className={styles.labelData}>0</span>
        </p>
        <p className={styles.riskRemoteness}>Remoteness
            <span id="risk-remoteness" className={styles.labelData}>20</span>
        </p>
        <p className={styles.riskHeat}>Extreme Heat
            <span id="risk-heat" className={styles.labelData}>80</span>
        </p>
      </div> */}
    </>
  )
}
