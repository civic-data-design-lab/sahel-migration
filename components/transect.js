import React, {useState, useEffect, useRef} from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
import * as d3 from "d3";
import useWindowSize from "../hooks/useWindowSize";


export default function Transect ({layerData, borderData, citiesData, riskColors}) {
  const { width, height } = useWindowSize();
  // const width = 600 - margin.left - margin.right;
  // const height = 400 - margin.top - margin.bottom;

  const dataTest = [
    { location_start: 0, location_end: 1693230, risk: 0, NAME_0: "North Niger to Libya Border"},
    { location_start: 1693230, location_end: 2744887, risk: 1, NAME_0: "Libya"},
    { location_start: 2744887, location_end: 4935319, risk: 2, NAME_0: "Libya 2"},
    // add more data points as needed
  ];
  const svgRef = useRef(null);

  function drawLayers(svgRef,width,height,layerData, borderData, citiesData, riskColors) {
    // const svg = d3.select(svgRef.current);

    const margin = { top: 20, right: 20, bottom: 30, left: 20 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    const svg = d3.select(svgRef.current)

    svg
      .attr("width", width)
      .attr("height", height+margin.bottom)


    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(citiesData, (d) => d.location)])
      .range([0, w]);

    //Border Data
    let borders = d3.axisBottom(xScale);
    borders.tickValues(borderData.map(d => d.location));
    borders.tickSize(-200);
    borders.tickFormat((d,i)=> `${borderData[i].city1} ${borderData[i].city2}`);
    let borderAxis = svg.append("g").call(borders)
    borderAxis.attr("transform",`translate(${margin.left},${h+2*margin.bottom})`).selectAll(".tick line")
      .style("stroke-dasharray", ("3, 3")).attr("stroke-width","3");
    borderAxis.select(".domain").remove()


    //Cities Data
    let cities = d3.axisBottom(xScale);
    cities.tickValues(citiesData.map(d => d.location));
    cities.tickFormat((d,i)=> citiesData[i].name);
    svg.append("g").call(cities).attr("transform",`translate(${margin.left},${h+margin.bottom})`);

    layerData.forEach((data,i) => {
      console.log(data)
      svg
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar"+i)
        .attr("fill", (d) => riskColors[i][d.Risk])
        .attr("opacity", 0.5)
        .attr("x", (d) => margin.left + xScale(d.location_start))
        // .attr("y", height  - margin.bottom)
        .attr("width", (d) => xScale(d.location_end) - xScale(d.location_start))
        .attr("height", h+margin.bottom);
      }
    )
  }


  useEffect(() => {
    console.log("DATA",layerData)
    if (!layerData) return;
    drawLayers(svgRef,2*width,150,layerData, borderData, citiesData,riskColors);

  }, [layerData, width, height, svgRef]);

  return (
    <div>
      {/*hello*/}
      {/*{data.map(d=> d.location_start)}*/}
      <svg ref={svgRef} width={width} height={height}  style={{margin:"10px"}}/>
    </div>
  )
}
