// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/streamgraph

import * as d3 from "d3";
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
export function PlotTransectLayers(data, {
  width,
  height,
  yLabel, // a label for the y-axis
  svg,
  xScale,
  risks,
  risksData
} = {}) {

  svg
    .attr("id", "viz-transect-layers")
    .attr("viewBox", [0, 0, width, .6*height])
    .style("pointer-events", "all")
  Object.keys(risks).forEach((risk) => {
    yLabel = risks[risk].label
    let dataStackedArea  = data.filter(d => d.risk === risk)
    Streamgraph(dataStackedArea, {
      x: d => d.distance,
      y: d => d.value,
      z: d => d.risk,
      yLabel: yLabel,
      width: width,
      height: .08*height,
      svg: svg,
      xScale: xScale,
      colors: colors,
      risks: risks,
      risk: risk,
      risksData: risksData
    })
  })

}

export default function Streamgraph(data, {
  x = ([x]) => x, // given d in data, returns the (ordinal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  z = () => 1, // given d in data, returns the (categorical) z-value
  width,
  height,
  margin = {
    "top": 0,
    "right": 20,
    "left": 20,
    "bottom": 20
  },
  xType = d3.scaleLinear, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [margin.left, width - margin.right], // [left, right]
  yType = d3.scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yRange = [height - margin.right, margin.top], // [bottom, top]
  zDomain, // array of z-values
  offset = d3.stackOffsetNone, // stack offset method
  order = d3.stackOrderNone, // stack order method
  xFormat, // a format specifier string for the x-axis
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  svg,
  risks,
  risk,
  risksData
} = {}) {

  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);
  // Compute default x- and z-domains, and unique the z-domain.
  if (xDomain === undefined) xDomain = [X[0],X[X.length - 1]];
  if (zDomain === undefined) zDomain = Z;
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the z-domain.
  const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));
  // Compute a nested array of series where each series is [[y1, y2], [y1, y2],
  // [y1, y2], …] representing the y-extent of each stacked rect. In addition,
  // each tuple has an i (index) property so that we can refer back to the
  // original data point (data[i]). This code assumes that there is only one
  // data point for a given unique x- and z-value.
  const series = d3.stack()
    .keys(zDomain)
    .value(([x, I], z) => Y[I.get(z)])
    .order(order)
    .offset(offset)
    (d3.rollup(I, ([i]) => i, i => X[i], i => Z[i]))
    .map(s => s.map(d => Object.assign(d, {i: d.data[1].get(s.key)})));

  // Compute the default y-domain. Note: diverging stacks can be negative.
  if (yDomain === undefined) yDomain = d3.extent(series.flat(2));

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);

  const xAxis = d3.axisBottom(xScale).ticks(5, xFormat).tickSizeOuter(0);
  const area = d3.area()
    .x(({i}) => xScale(X[i]))
    .y0(([y1]) => yScale(y1))
    .y1(([, y2]) => yScale(y2))
    .curve(d3.curveBasis);

  // define svg
  const plot = svg.append("g")
    .attr("id", "viz-transect-"+risk)
    .attr("class", "viz-transect")
    .attr("viewBox", [0, 0, width, height]) // [x-pos, y-pos, width, height]


  // define path
  plot.append("g")
        .attr("class", "combined-risk")
    .selectAll("path")
    .data(series)
    .join("path")
        .attr("id", ([{i}]) => Z[i])
        .attr("fill", ([{i}]) => risks[Z[i]].color)
        .attr("d", area)
    .append("title")
        .text(([{i}]) => risks[Z[i]].label)
    .style("pointer-events", "all")

  // define x-axis
  plot.append("g")
    .attr("transform", `translate(0,${height - margin.right})`)
    .call(xAxis)
    .call(g => g.select(".domain").remove());

//   labels for y-axis
  plot.append("g")
    .attr("transform", `translate(${margin.left+20},0)`)
    .call(g => g.append("text")
      .attr("x", -margin.left)
      .attr("y", 20)
      .attr("font-weight", "bold")
      .attr("font-size", 18)
      .text(yLabel));
  if (risk !== "all"){
    // const graph = d3.select("#viz-transect-"+risk);
    plot.attr("transform", `translate(0,${100*risks[risk].index})`);
  }
}

export function DrawTooltip(config) {
  const {
    width,
    height,
    data,
    svgRef,
    tooltipRef,
    xScale,
    margin,
    risks,
    risksData
  } = config;

  const svg = d3.select(svgRef.current);
//   const tooltip = d3.select(tooltipRef.current);
  const createTooltip = d3.select('#journey')
        .append('div')
            .attr('id', 'transectTooltip');
  const tooltip = d3.select('#transectTooltip')
        .style("top", 0)
        .style("left", 0);
    if (!document.getElementById("transectTooltip").hasChildNodes()) {
        tooltip.attr('class', 'transectTooltip')
            .html("<h4 class='risk-total'>Overall Risk<span id='data-total' class='labelData'>152/360</span></h4><p class='risk-4mi'>Reported Violence<span id='data-4mi' class='labelData'>12</span></p><p class='risk-acled'>Armed Conflict<span id='data-acled' class='labelData'>0</span></p><p class='risk-food'>Food Insecurity<span id='data-food' class='labelData'>40</span></p><p class='risk-smuggler'>Smuggler Assistance<span id='data-smuggler' class='labelData'>0</span></p><p class='risk-remoteness'>Remoteness<span id='data-remoteness' class='labelData'>20</span></p><p class='risk-heat'>Extreme Heat<span id='data-heat' class='labelData'>80</span></p>")
            .attr("class", "hidden transectTooltip");
    }

  // const focus = svg
  //   .append('g')
  //   .attr('class', 'focus')
  //   .style('display', 'none');

  const line = svg.append("line")
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("opacity", 0);

  svg
    .append('rect')
    .attr('id', 'overlay')
    .attr('width', width)
    .attr('height', height)
    // .attr("zIndex", 10)
    .style('opacity', 0)
    .style("pointer-events", "all")
    .raise()
    .on('mouseover', () => {
      // focus.style('display', null);
    })
    .on('mouseout', mouseout)
    .on('mousemove', (event) => mousemove(event, risks, risksData));

  function mouseout(event) {
    line.attr("opacity", 0);
    tooltip.attr("class", "hidden transectTooltip");
  }
  function mousemove(event, risks, risksData) {
    const bisect = d3.bisector((d) => d.distance).left;
    const xPos = d3.pointer(event)[0];
    const x0 = bisect(data, xScale.invert(xPos));
    const dIndex = data[x0].index;
    const d0 = risksData.find(d => d.index === dIndex);
    // console.log(d0);

    line.attr("x1", xPos)
      .attr("y1", 0)
      .attr("x2", xPos)
      .attr("y2", height)
      .attr("opacity", 1);

    tooltip
        .attr("class", "transectTooltip")
        .style("top", (divHtml) => {
            let mouseY = event.screenY;
            // let mouseY = d3.pointer(event)[1];
            let tooltipHeight = document.getElementById("transectTooltip").offsetHeight;
            return (mouseY - 1.7*tooltipHeight) + "px"
        })
        .style("left", (divHtml) => {
            let mouseX = d3.pointer(event)[0];
            let tooltipWidth = document.getElementById("transectTooltip").offsetWidth;
            let svgWidth = +svg.style("width").split("px")[0];
            
            if (mouseX + tooltipWidth + 10 > svgWidth) {
                return (mouseX - tooltipWidth - 10) + "px"
            }
            else {
                return (mouseX + 10) + "px"
            }
        })
    tooltip.select(".risk-total").select("#data-total").html(Math.round(d0.risks_total) + "/360");
    // update data in tooltip for each risk
    for (let i = 0; i < Object.keys(risks).length; i++) {
        let risk = Object.keys(risks)[i];
        let riskClass = ".risk-" + risk;
        let dataId = "#data-" + risk;
        let dataValue = Math.round(d0["risk_" + risk]);
        tooltip.select(riskClass).select(dataId).html(dataValue);
    }
  }
}
