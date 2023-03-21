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

    d3.selectAll("svg > *").remove();
    svg
      .attr("width", width)
      .attr("height", height+margin.bottom)



    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(citiesData, (d) => d.location)])
      .range([0, w]);


    //Bar Data

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


    //Arc
    let semicircleData = [
      { x: 250000, y: 90,  radius: 30 },
      { x: 500000, y:80, radius: 40 },
      { x: 4935319, y: 20,  radius: 50 },
    ];
    let semicircleGroup = svg.append("g")
      // .attr("transform", "translate(0," + height / 2 + ")");

    let semicircleArc = d3.arc()
      .innerRadius(0)
      .outerRadius(function(d) { return d.radius; })
      .startAngle(0)
      .endAngle(Math.PI);

    // Bind the semicircle data to path elements
    let semicircles = semicircleGroup.selectAll("path")
      .data(semicircleData);

    semicircles.enter()
      .append("path")
      .attr("d", semicircleArc)
      .attr("transform", function(d) {
        let xVal = xScale(d.x)+margin.left
        let yVal = height-d.y
        return "translate(" + xVal + "," + yVal + ") rotate(-90)  ";
      })
      .attr("fill", "white");


    // Elevation Data
    let elevationData = [{x:0,y:+margin.top},{x:250000,y:90},{x:500000,y:80},{x:4935319,y:20}]

    let lineFunc = d3.line()
      .x(function(d) { return margin.left +xScale(d.x)})
      .y(function(d) { return height-d.y })

    svg.append("path").attr('d', lineFunc(elevationData))
      .attr('stroke', 'brown')
      .attr('fill', 'white');

    //Border Data
    let borders = d3.axisBottom(xScale);
    borders.tickValues(borderData.map(d => d.location));
    borders.tickSize(-200);
    borders.tickFormat((d,i)=> `${borderData[i].country1} ${borderData[i].country2}`);
    let borderAxis = svg.append("g").call(borders)
    borderAxis.attr("transform",`translate(${margin.left},${h+2*margin.bottom})`).selectAll(".tick line")
      .style("stroke-dasharray", ("3, 3")).attr("stroke-width","3");
    borderAxis.select(".domain").remove()


    //Cities Data
    let cities = d3.axisBottom(xScale);
    cities.tickValues(citiesData.map(d => d.location));
    cities.tickFormat((d,i)=> citiesData[i].name);
    let citiesAxis = svg.append("g").call(cities)
    citiesAxis.attr("transform",`translate(${margin.left},${h+1.5*margin.bottom})`).selectAll(".tick line")
    citiesAxis.select(".domain").remove()

    //Cities tickers
    citiesData[0].y = margin.top
    const lines = svg.selectAll(".line")
      .data(citiesData);
    lines.enter()
      .append("line")
      .attr("x1", (d) => margin.left + xScale(d.location))
      .attr("y1", height)
      .attr("x2", (d) => margin.left + xScale(d.location))
      .attr("y2", (d) => height -d.y)
      .style("stroke", "black")
      .style("stroke-width", 1);
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
