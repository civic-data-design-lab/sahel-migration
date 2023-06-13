// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/streamgraph

import * as d3 from 'd3';
import { useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import RiskWeightSlider from './RiskWeightSlider';
import RiskWeightTextInput from './RiskWeightTextInput';

export default function Streamgraph(
  data,
  {
    x = ([x]) => x, // given d in data, returns the (ordinal) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    z = () => 1, // given d in data, returns the (categorical) z-value
    width,
    height,
    margin,
    yPlotOffset,
    xScale,
    xDomain, // [xmin, xmax]
    yDomain, // [ymin, ymax]
    zDomain, // array of z-values
    offset = d3.stackOffsetNone, // stack offset method
    order = d3.stackOrderNone, // stack order method
    yLabel, // a label for the y-axis
    svg,
    risks,
    riskId, // The ID of the risk to plot, or "all" if plotting all
    journeyFocusData,
    cities,
    borders,
    journey,
    isExpanded,
  } = {}
) {

  /** X-scale, the distance along the path. */
  const X = d3.map(data, x);

  /** The risk value (numeric, categorized by risk). */
  const Y = d3.map(data, y);

  /** The risk category (index -> risk object). */
  const Z = d3.map(data, z);

  // Compute default x- and z-domains, and unique the z-domain.
  if (xDomain === undefined) xDomain = [X[0], X[X.length - 1]];
  if (zDomain === undefined) zDomain = Z;
  zDomain = new d3.InternSet(zDomain);

  /** The risk information that is currently being displayed */
  // const riskInfo = risks.find((risk) => risk.id === riskId);

  // Omit any data not present in the z-domain.
  const I = d3.range(X.length).filter((i) => zDomain.has(Z[i]));
  // Compute a nested array of series where each series is [[y1, y2], [y1, y2],
  // [y1, y2], …] representing the y-extent of each stacked rect. In addition,
  // each tuple has an i (index) property so that we can refer back to the
  // original data point (data[i]). This code assumes that there is only one
  // data point for a given unique x- and z-value.
  const series = d3
    .stack()
    .keys(zDomain)
    .value(([x, I], z) => Y[I.get(z)]*Z[I.get(z)].normWeight)
    .order(order)
    .offset(offset)(
      d3.rollup(
        I,
        ([i]) => i,
        (i) => X[i],
        (i) => Z[i]
      )
    )
    .map((s) => s.map((d) => Object.assign(d, { i: d.data[1].get(s.key) })));

  // Compute the default y-domain. Note: diverging stacks can be negative.
  if (yDomain === undefined) yDomain = d3.extent(series.flat(2));
  // let yDomainWeighted = [0, 100 * risks.find(item => item.id == riskId).normWeight];
  const yRange = [height - margin.bottom, margin.top]; // [bottom, top]
  let yScale = d3.scaleLinear(yDomain, yRange);
  if (riskId !== 'all') console.log(`yDomain: ${yDomain}, normWeight: ${risks.find(item => item.id == riskId).normWeight}, weight: ${risks.find(item => item.id == riskId).weight}`);
  if (riskId !== 'all') yScale = d3.scaleLinear([0, 100 * risks.find(item => item.id == riskId).normWeight * 100/risks.find(item => item.id == riskId).weight], yRange)
  // define svg
  const plot = svg
    .append('g')
    .attr('id', 'viz-transect-' + riskId)
    .attr('class', 'viz-transect')
  PlotAreaCurve(data,{
    plot: plot,
    X: X,
    Z: Z,
    margin: margin,
    xDomain: xDomain,
    xScale: xScale,
    riskId: riskId,
    risks: risks,
    yLabel: yLabel,
    yScale: yScale,
    series: series,
  })
  const xAxis = d3
    .axisBottom(xScale)
    .tickValues([0, 10, 20, 30, 40, xDomain[1].toFixed(2)])
    .ticks(5)
    .tickSizeOuter(0)
    .tickFormat((d, i) => (d * 100).toLocaleString('en-US') + ' km');

  if (riskId === 'all') {

    PlotXAxis({
      plot: plot,
      height: height,
      margin: margin,
      xAxis: xAxis,
      xAxisTicks: (ticksData) => XAxisTicks(ticksData,xScale),
      borders: borders,
      cities: cities,
    });
    if (journey.id < 8) {
      // transparent rects for focus area for this journey
      focusArea(journeyFocusData, {
        svg,
        xScale,
        yScale,
        yDomain,
        margin,
      });
      bracket(journeyFocusData, {
        svg,
        xScale,
        yScale,
        yDomain,
        margin,
      });
      // label for expand & collapse journey
      journeyText(journeyFocusData, {
        svg: svg,
        journey: journey,
        xScale: xScale,
        yScale: yScale,
        yDomain: yDomain,
        isExpanded: isExpanded,
      });
    }
  }

  if (riskId !== 'all') {
    const graph = d3.select('#viz-transect-' + riskId);
    const riskIndex = risks.find((risk) => risk.id === riskId).index;
    plot.attr('transform', `translate(0,${yPlotOffset * riskIndex + 10})`);
  }
}

export function PlotAreaCurve(data,
   {
    plot,
    X,
    Z,
    margin,
    xDomain,
    xScale,
    riskId,
    risks,
    yLabel,
    yScale,
    series,
   }) {
  const area = d3
    .area()
    .x(({ i }) => xScale(X[i]))
    .y0(([y1]) => yScale(y1))
    .y1(([, y2]) => yScale(y2))
    .curve(d3.curveBasis);

  // define journey highlighed regions
  // console.log(`Setting ${riskId} ref to ${plot.node()}`);
  // getRiskContainerRefs().set(riskId, plot.node());

  // define path
  plot
    .append('g')
    .attr('class', 'combined-risk')
    .selectAll('path')
    .data(series)
    .join('path')
    .attr('id', ([{ i }]) => Z[i].id)
    .attr('fill', ([{ i }]) => Z[i].color)
    .attr('d', area)
    .append('title')
    .text(([{ i }]) => Z[i].label)
    .style('pointer-events', 'all');

  // x-axis baseline
  plot
    .append('g')
    .attr('class', 'x-axis-line')
    .append('line')
    .attr('x1', (d) => xScale(0))
    .attr('x2', (d) => xScale(xDomain[1]))
    .attr('y1', yScale(0))
    .attr('y2', yScale(0))
    .attr('stroke', '#463C35')
    .attr('stroke-width', 1);

  // labels for y-axis
  plot
    .append('g')
    .attr('class', 'label-risk')
    .attr('id', `risk-label-${riskId}`)
    .call((g) =>
      g
        .append('text')
        .attr('x', margin.left)
        .attr('y', margin.top - 5)
        .text(yLabel)
    )
    .attr('fill', '#463C35');
}

function focusArea(
  data, //journeyFocusData
  { svg, xScale, yScale, yDomain, margin } = {}
) {
  svg
    .append('g')
    .attr('class', 'journey-focus-rect')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('width', (d) => xScale(d.x2) - xScale(d.x1))
    .attr('height', yScale(yDomain[0]) - yScale(yDomain[1]))
    .attr('x', (d) => xScale(d.x1))
    .attr('y', margin.top)
    .attr('fill', '#fff')
    .attr('opacity', 0.3);
}


export function PlotXAxis({
  plot,
  height,
  margin,
  xAxis,
  xAxisTicks,
  borders,
  cities,

}) {
  plot
    .append("g")
    .attr("class", "x-axis-borders")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxisTicks(borders))
    .call((g) => g.select('.domain').remove())
    .selectAll("text")
    .attr("x", (d, i) => {
      return (i == 0) ? 20 // mali - burkina faso
        : (i == 1) ? -19 // burkina faso - niger
          : (i == 2) ? -1 // imaginary line
            : 0;
    })
    .style("text-anchor", (d, i) => {
      return (i == 2) ? "start" // imaginary line
        : "middle";
    });
  // define ticks for city names
  plot
    .append('g')
    .attr('class', 'x-axis-cities')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(xAxisTicks(cities))
    .call((g) => g.select('.domain').remove())
    .selectAll("text")
    .style("text-anchor", (d, i) => {
      return (i == 0) ? "start" // Bamako
        : (i == 7) ? "end" // Tripoli
          : "middle";
    });
  // define x-axis (distance in km)
  plot
    .append('g')
    .attr('class', 'x-axis-dist')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .call((g) => g.select('.domain').remove())
    .selectAll("text")
    .attr("x", (d, i) => {
      return (i == 0) ? 2 // 0 km
        : (i == 5) ? -2 // total dist
          : 0;
    })
    .style("text-anchor", (d, i) => {
      return (i == 0) ? "start" // 0 km
        : (i == 5) ? "end" // total dist
          : "middle";
    });

  // add white rect behind cities text labels
  plot.select(".x-axis-cities")
    .selectAll("g.tick")
    .insert("rect", "text")
    .attr("x", -35)
    .attr("y", 21)
    .attr("width", 70)
    .attr("height", 11)
    .style("fill", "white")
    .style("opacity", (d, i) => {
      return (i == 1 || i == 5) ? 0.8 // bobo dioulasso and agadez
        : 0;
    });

}
function bracket(
  data, //journeyFocusData
  { svg, xScale, yScale, yDomain, margin } = {}
) {
  const bracketGap = 5;
  const bracketLen = 5;
  const bracketList = ['top', 'bottom'];
  const bracket = svg.append('g').attr('class', 'journey-bracket');
  // vertical bracket line
  bracket
    .append('g')
    .attr('class', 'bracket-vert')
    .selectAll('line')
    .data(data)
    .enter()
    .append('line')
    .attr('x1', (d) => {
      return d.xPos == 'start' ? xScale(d.x2) : xScale(d.x1);
    })
    .attr('x2', (d) => {
      return d.xPos == 'start' ? xScale(d.x2) : xScale(d.x1);
    })
    .attr('y1', margin.top - 1)
    .attr('y2', yScale(yDomain[0]) + bracketGap + 1)
    .attr('stroke', '#463C35')
    .attr('stroke-width', 2);
  // horizontal bracket lines top and bottom
  bracketList.forEach((yPos) => {
    bracket
      .append('g')
      .attr('class', 'bracket-horiz-' + yPos)
      .selectAll('line')
      .data(data)
      .enter()
      .append('line')
      .attr('x1', (d) => {
        return d.xPos == 'start' ? xScale(d.x2) : xScale(d.x1) - bracketLen;
      })
      .attr('x2', (d) => {
        return d.xPos == 'start' ? xScale(d.x2) + bracketLen : xScale(d.x1);
      })
      .attr('y1', (d) => {
        return yPos == 'top' ? margin.top : yScale(yDomain[0]) + bracketGap;
      })
      .attr('y2', (d) => {
        return yPos == 'top' ? margin.top : yScale(yDomain[0]) + bracketGap;
      })
      .attr('stroke', '#463C35')
      .attr('stroke-width', 2);
  });
}
function journeyText(
  data, //journeyFocusData
  { svg, journey, xScale, yScale, yDomain, isExpanded } = {}
) {
  const xCenter = xScale(data[0].x2 + (data[1].x1 - data[0].x2) / 2);
  const xOffset = isExpanded ? 54 : 64;
  const yBase = yScale(yDomain[1]);
  const triSize = 10;
  const xOffsetJourney2 = 80;

  const journeyText = svg.append('g').attr('class', 'journey-text');
  // text for journey title
  journeyText
    .append('text')
    .attr('class', 'label-journey')
    .attr('x', (d) => {
      return (journey.id == 2 && !isExpanded) ? xCenter + xOffsetJourney2 : xCenter;
    })
    .attr('y', yBase - 20)
    .attr('dy', '-0.125em')
    .attr('text-anchor', 'middle')
    .attr('fill', '#463C35')
    .text(journey.title);
  // text for expand this section
  let label = isExpanded ? 'Return to entire route' : 'Expand this section';
  journeyText
    .append('text')
    .attr('class', 'text-expand')
    .attr('x', (d) => {
      return (journey.id == 2 && !isExpanded) ? xCenter + xOffsetJourney2 : xCenter;
    })
    .attr('y', yBase - 5)
    .attr('dy', '-0.125em')
    .attr('text-anchor', 'middle')
    .attr('fill', '#463C35')
    .text(label);
  // triangles for expand
  // path for left arrow
  const leftArrow = () => {
    return (journey.id == 2 && !isExpanded) ?
      'M ' + (xCenter - xOffset + triSize / 2 + xOffsetJourney2) + ' ' + (yBase - 14 + triSize / 2) +
      ' L ' + (xCenter - xOffset + triSize + xOffsetJourney2) + ' ' + (yBase - 14) +
      ' L ' + (xCenter - xOffset + triSize + xOffsetJourney2) + ' ' + (yBase - 14 + triSize) +
      ' Z' // triangle points left and offset to avoid text overlap
      : (isExpanded) ? 
      'M ' + (xCenter - xOffset - triSize / 2) + ' ' + (yBase - 14 + triSize / 2) +
      ' L ' + (xCenter - xOffset - triSize) + ' ' + (yBase - 14) +
      ' L ' + (xCenter - xOffset - triSize) + ' ' + (yBase - 14 + triSize) +
      ' Z' // triangle points right
      : 'M ' + (xCenter - xOffset + triSize / 2) + ' ' + (yBase - 14 + triSize / 2) +
      ' L ' + (xCenter - xOffset + triSize) + ' ' + (yBase - 14) +
      ' L ' + (xCenter - xOffset + triSize) + ' ' + (yBase - 14 + triSize) +
      ' Z'; // triangle points left
  }
  const rightArrow = () => {
    return (journey.id == 2 && !isExpanded) ? 
      'M ' + (xCenter + xOffset - triSize / 2 + xOffsetJourney2) + ' ' + (yBase - 14 + triSize / 2) +
      ' L ' + (xCenter + xOffset - triSize + xOffsetJourney2) + ' ' + (yBase - 14) +
      ' L ' + (xCenter + xOffset - triSize + xOffsetJourney2) + ' ' + (yBase - 14 + triSize) +
      ' Z' // triangle points right and offset to avoid text overlap
      : (isExpanded) ? 
      'M ' + (xCenter + xOffset + triSize / 2) + ' ' + (yBase - 14 + triSize / 2) +
      ' L ' + (xCenter + xOffset + triSize) + ' ' + (yBase - 14) +
      ' L ' + (xCenter + xOffset + triSize) + ' ' + (yBase - 14 + triSize) +
      ' Z' // triangle points left
      : 'M ' + (xCenter + xOffset - triSize / 2) + ' ' + (yBase - 14 + triSize / 2) +
      ' L ' + (xCenter + xOffset - triSize) + ' ' + (yBase - 14) +
      ' L ' + (xCenter + xOffset - triSize) + ' ' + (yBase - 14 + triSize) +
      ' Z'; // triangle points right
  }

  // path for left arrow
  journeyText.append('path')
    .attr('d', isExpanded? rightArrow() : leftArrow())
    .attr('fill', '#463C35');
  // path for right arrow
  journeyText.append('path')
    .attr('d', isExpanded? leftArrow(): rightArrow())
    .attr('fill', '#463C35');
}


export function XAxisTicks(ticksData,xScale) {
  let tickSize = 20; // tick size for city
  if (!ticksData[0].hasOwnProperty('city')) {
    tickSize = 35; // tick size for borders
  }
  return d3
    .axisBottom(xScale)
    .tickValues(ticksData.map((d) => d.distance))
    .tickSize(tickSize)
    .tickSizeOuter(0)
    .tickFormat((d, i) => {
      let labelData = ticksData[i];
      return labelData.hasOwnProperty('city') ? labelData.city // cities
        : (labelData.hasOwnProperty('border_2') && i == 2) ? labelData.border_2 // imaginary line
          : labelData.border_1 + ' – ' + labelData.border_2;
    });
}
