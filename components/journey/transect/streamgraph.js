// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/streamgraph

import * as d3 from "d3";
import styles from "../../../styles/Transect.module.css";

export function PlotTransectLayers(data, {
  width,
  height,
  margin,
  yLabel, // a label for the y-axis
  svg,
  xScale,
  risks,
  risksData,
  journey
} = {}) {

  svg
    .attr("viewBox", [0, 0, width, height])
    .style("pointer-events", "all")
  Object.keys(risks).forEach((risk) => {
    yLabel = risks[risk].label
    //TODO: plot only changing areas
    let dataStackedArea  = data.filter(d => d.risk === risk)
    Streamgraph(dataStackedArea, {
      x: d => d.distance,
      y: d => d.value,
      z: d => d.risk,
      yLabel: yLabel,
      width: width,
      height: 150,
      margin: margin,
      svg: svg,
      xScale: xScale,
      risks: risks,
      risk: risk,
      risksData: risksData,
      journey: journey
    })
  })

}

export default function Streamgraph(data, {
  x = ([x]) => x, // given d in data, returns the (ordinal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  z = () => 1, // given d in data, returns the (categorical) z-value
  width,
  height,
  margin,
  xScale,
  xDomain, // [xmin, xmax]
  yDomain, // [ymin, ymax]
  zDomain, // array of z-values
  offset = d3.stackOffsetNone, // stack offset method
  order = d3.stackOrderNone, // stack order method
  xFormat, // a format specifier string for the x-axis
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  svg,
  risks,
  risk,
  risksData,
  journey
} = {}) {

  // Range
  const yRange = [height - margin.right, margin.top]; // [bottom, top]
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
  const yScale = d3.scaleLinear(yDomain, yRange);

  const xAxis = d3.axisBottom(xScale)
    .tickValues([0, 10, 20, 30, 40, xDomain[1].toFixed(2)])
    .ticks(5)
    .tickSizeOuter(0)
    .tickFormat((d, i) => (d*100).toLocaleString("en-US") + " km");

  const area = d3.area()
    .x(({i}) => xScale(X[i]))
    .y0(([y1]) => yScale(y1))
    .y1(([, y2]) => yScale(y2))
    .curve(d3.curveBasis);

  // define journey highlighed regions
  const journeyData = data.filter(d => d.segment_index == journey.id - 1);
  const journeyDistStart = journeyData[0].distance;
  const journeyDistEnd = journeyData[journeyData.length - 1].distance;
  const journeyFocusData = [
    {
        "xPos": "start",
        "x1": xDomain[0],
        "x2": journeyDistStart
    },
    {
        "xPos": "end",
        "x1": journeyDistEnd,
        "x2": xDomain[1]
    }
  ];

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
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height - margin.right})`)
    .call(xAxis)
    .call(g => g.select(".domain").remove());

//   labels for y-axis
  plot.append("g")
    .attr("class", "label-risk")
    .attr("transform", `translate(${margin.left},0)`)
    .call(g => g.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .text(yLabel));

  if (risk == "all") {
    // transparent rects for focus area for this journey
    svg.append("g")
            .attr("class", "journey-focus-rect")
        .selectAll("rect")
            .data(journeyFocusData)
            .enter()
        .append("rect")
            .attr("width", d => xScale(d.x2) - xScale(d.x1))
            .attr("height", yScale(yDomain[0]) - yScale(yDomain[1]))
            .attr("x", d => xScale(d.x1))
            .attr("y", margin.top)
            .attr("fill", "#fff")
            .attr("opacity", 0.3);

    const bracketGap = 5;
    const bracketLen = 5;
    const bracketList = ["top", "bottom"];
    const bracket = svg.append("g")
            .attr("class", "journey-bracket")
    // vertical bracket line
    bracket.append("g")
            .attr("class", "bracket-vert")
        .selectAll("line")
            .data(journeyFocusData)
            .enter()
        .append("line")
            .attr("x1", d => {
                return (d.xPos == "start") ? xScale(d.x2)
                : xScale(d.x1)
            })
            .attr("x2", d => {
                return (d.xPos == "start") ? xScale(d.x2)
                : xScale(d.x1)
            })
            .attr("y1", margin.top - 1)
            .attr("y2", yScale(yDomain[0]) + bracketGap + 1)
            .attr("stroke", "#000")
            .attr("stroke-width", 2)
    // horizontal bracket lines top and bottom
    bracketList.forEach(yPos => {
        bracket.append("g")
            .attr("class", "bracket-horiz-" + yPos)
        .selectAll("line")
            .data(journeyFocusData)
            .enter()
        .append("line")
            .attr("x1", d => {
                return (d.xPos == "start") ? xScale(d.x2)
                : xScale(d.x1) - bracketLen
            })
            .attr("x2", d => {
                return (d.xPos == "start") ? xScale(d.x2) + bracketLen
                : xScale(d.x1)
            })
            .attr("y1", d => {
                return (yPos == "top") ? margin.top
                : yScale(yDomain[0]) + bracketGap
            })
            .attr("y2", d => {
                return (yPos == "top") ? margin.top
                : yScale(yDomain[0]) + bracketGap
            })
            .attr("stroke", "#000")
            .attr("stroke-width", 2);
    });

    // label for expand & collapse journey
    const xCenter = xScale(journeyFocusData[0].x2 + (journeyFocusData[1].x1 - journeyFocusData[0].x2)/2);
    const xOffset = 64;
    const yBase = yScale(yDomain[1]);
    const triSize = 10;
    const xOffsetJourney2 = 80;

    const journeyText = svg.append("g")
            .attr("class", "journey-text");
    // text for journey title
    journeyText.append("text")
                .attr("class", "label-journey")
            .attr("x", d => {
                return (journey.id == 2) ? xCenter + xOffsetJourney2
                : xCenter
            })
            .attr("y", yBase - 20)
            .attr("dy", "-0.125em")
            .attr("text-anchor", "middle")
            .attr("fill", "#000")
            .text(journey.title);
    // text for expand this section
    journeyText.append("text")
                .attr("class", "text-expand")
            .attr("x", d => {
                return (journey.id == 2) ? xCenter + xOffsetJourney2
                : xCenter
            })
            .attr("y", yBase - 5)
            .attr("dy", "-0.125em")
            .attr("text-anchor", "middle")
            .attr("fill", "#000")
            .text("Expand this section");
    // triangles for expand
    // path for left arrow
    journeyText.append("path")
            .attr("d", d => {
                return (journey.id == 2) ? "M " + (xCenter - xOffset + triSize/2 + xOffsetJourney2) + " " + (yBase - 14 + triSize/2) + " L " + (xCenter - xOffset + triSize + xOffsetJourney2) + " " + (yBase - 14) + " L " + (xCenter - xOffset + triSize + xOffsetJourney2) + " " + (yBase - 14 + triSize) + " Z"
                : "M " + (xCenter - xOffset + triSize/2) + " " + (yBase - 14 + triSize/2) + " L " + (xCenter - xOffset + triSize) + " " + (yBase - 14) + " L " + (xCenter - xOffset + triSize) + " " + (yBase - 14 + triSize) + " Z"
            })
    // path for right arrow
    journeyText.append("path")
            .attr("d", d => {
                return (journey.id == 2) ? "M " + (xCenter + xOffset - triSize/2 + xOffsetJourney2) + " " + (yBase - 14 + triSize/2) + " L " + (xCenter + xOffset - triSize + xOffsetJourney2) + " " + (yBase - 14) + " L " + (xCenter + xOffset - triSize + xOffsetJourney2) + " " + (yBase - 14 + triSize) + " Z"
                : "M " + (xCenter + xOffset - triSize/2) + " " + (yBase - 14 + triSize/2) + " L " + (xCenter + xOffset - triSize) + " " + (yBase - 14) + " L " + (xCenter + xOffset - triSize) + " " + (yBase - 14 + triSize) + " Z"
            });

    // rect overlay for on-click to expand trigger
    svg.append("rect")
            .attr("class", "overlay-journey")
        .attr("width", xScale(journeyFocusData[1].x1) - xScale(journeyFocusData[0].x2))
        .attr("height", height)
        .attr("x", xScale(journeyFocusData[0].x2))
        .attr("y", 0)
        .attr("opacity", 0)
        .style("pointer-events", "all")
        .raise()
        .on("click", expandSection);

    // click to expand journey section
    function expandSection() {
        // this is not clickable yet???
        console.log("expandSection clicked");
        console.log("journey id: " + journey.id + ", segment_index: " + journey.id-1);
    };
    };

  if (risk !== "all"){
    const graph = d3.select("#viz-transect-"+risk);
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

  const svg = d3.select(svgRef.current)
                .attr("id", "viz-transect-layers");
//   const tooltip = d3.select(tooltipRef.current);
  const createTooltip = d3.select('#journey')
        .append('div')
            .attr('id', 'transectTooltip');
  const tooltip = d3.select('#transectTooltip')
        .style("top", 0)
        .style("left", 0);
    if (!document.getElementById("transectTooltip").hasChildNodes()) {
        tooltip.attr('class', 'transectTooltip')
            .html("<h4 class='risk-total'>Combined Risk<span id='data-total' class='labelData'>152</span></h4><p class='risk-4mi'>Reported Violence<span id='data-4mi' class='labelData'>12</span></p><p class='risk-acled'>Armed Conflict<span id='data-acled' class='labelData'>0</span></p><p class='risk-food'>Food Insecurity<span id='data-food' class='labelData'>40</span></p><p class='risk-smuggler'>Need for a Smuggler<span id='data-smuggler' class='labelData'>0</span></p><p class='risk-remoteness'>Remoteness<span id='data-remoteness' class='labelData'>20</span></p><p class='risk-heat'>Extreme Heat<span id='data-heat' class='labelData'>80</span></p>")
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
    .on('mouseenter', mouseenter)
    // .on('mouseover', () => {
    //   // focus.style('display', null);
    // })
    .on('mouseout', mouseout)
    .on('mousemove', (event) => mousemove(event, risks, risksData));

  function mouseenter(event) {
    line.attr("opacity", 1);
  }
  function mouseout(event) {
    line.attr("opacity", 0);
    tooltip.attr("class", "hidden transectTooltip");
  }
  function mousemove(event, risks, risksData) {
    const bisect = d3.bisector((d) => d.distance).left;
    const xPos = d3.pointer(event)[0];
    const x0 = bisect(data, xScale.invert(xPos));
    if (0 <= x0 && x0 < data.length) {
        // console.log(x0);
        const dIndex = data[x0].index;
        const d0 = risksData.find(d => d.index === dIndex);
        // console.log(d0);

        let combinedRiskValue = 0;
        // update data in tooltip for each risk
        for (let i = 0; i < Object.keys(risks).length; i++) {
            let risk = Object.keys(risks)[i];
            let riskClass = ".risk-" + risk;
            let dataId = "#data-" + risk;
            let dataValue = Math.round(d0["risk_" + risk] * risks[risk].weight);
            combinedRiskValue += dataValue;
            tooltip.select(riskClass).select(dataId).html(dataValue);
        }
        // update data in tooltip for total risks
        tooltip.select(".risk-total").select("#data-total").html(Math.round(d0.risks_total));
        tooltip.select(".risk-total").select("#data-total").html(Math.round(combinedRiskValue));
    }

    line.attr("x1", xPos)
      .attr("y1", 0)
      .attr("x2", xPos)
      .attr("y2", height);

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
  }
}
