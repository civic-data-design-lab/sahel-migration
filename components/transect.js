import React, {useEffect, useRef} from 'react';
import * as d3 from "d3";
import useWindowSize from "../hooks/useWindowSize";


export default function Transect ({layerData, borderData, citiesData, riskColors}) {
  const { width, height } = useWindowSize();
  // const width = 600 - margin.left - margin.right;
  // const height = 400 - margin.top - margin.bottom;

  const svgRef = useRef(null);

  function drawLayers(svgRef,width,height,layerData, borderData, citiesData, riskColors) {
    // const svg = d3.select(svgRef.current);

    const margin = { top: 20, right: 20, bottom: 30, left: 20 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    const svg = d3.select(svgRef.current)

    // d3.selectAll("svg > *").remove();
    svg
      .attr("width", width)
      .attr("height", height+margin.bottom)
      .append("g")
      .attr("transform",
        `translate(${margin.left}, ${10*margin.top})`);


    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered_wide.csv").then(function(data) {
      console.log(data)
      // List of groups = header of the csv files
      const keys = data.columns.slice(1)

      // Add X axis
      const x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.year; }))
        .range([ 0, width ]);
      svg.append("g")
        .attr("transform", `translate(0, ${height*0.8})`)
        .call(d3.axisBottom(x).tickSize(-height*.7).tickValues([1900, 1925, 1975, 2000]))
        .select(".domain").remove()
      // Customization
      svg.selectAll(".tick line").attr("stroke", "#b8b8b8")

      // Add X axis label:
      svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height-30 )
        .text("Distance");

      // Add Y axis
      const y = d3.scaleLinear()
        .domain([-100000, 200000])
        .range([ height, 0]);

      // color palette
      const color = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.schemeDark2);

      //stack the data?
      const stackedData = d3.stack()
        .keys(keys)
        (data)

      // create a tooltip
      const Tooltip = svg
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .style("opacity", 0)
        .style("font-size", 17)

      // Three function that change the tooltip when user hover / move / leave a cell
      const mouseover = function(event,d) {
        Tooltip.style("opacity", 1)
        d3.selectAll(".myArea").style("opacity", .2)
        d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1)
      }
      const mousemove = function(event,d,i) {
        const grp = d.key
        Tooltip.text(grp)
      }
      const mouseleave = function(event,d) {
        Tooltip.style("opacity", 0)
        d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
      }

      // Area generator
      const area = d3.area()
        .x(function(d) { return x(d.data.year); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })

      // Show the areas
      svg
        .selectAll("mylayers")
        .data(stackedData)
        .join("path")
        .attr("class", "myArea")
        .style("fill", function(d) { return color(d.key); })
        .attr("d", area)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    })
  }


  useEffect(() => {
    console.log("DATA",layerData)
    if (!layerData) return;
    drawLayers(svgRef,2*width,150,layerData, borderData, citiesData,riskColors);

  }, [layerData, width, height, svgRef,riskColors]);

  return (
    <div style={{marginTop:"3rem"}}>
      {/*hello*/}
      {/*{data.map(d=> d.location_start)}*/}
      <svg ref={svgRef} width={width} height={height}  style={{marginTop:"10px"}}/>
    </div>
  )
}
