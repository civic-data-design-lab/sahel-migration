// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/streamgraph

import * as d3 from "d3";

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
  risks
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

  const xAxis = d3.axisBottom(xScale).ticks(width / 100, xFormat).tickSizeOuter(0);
  const area = d3.area()
    .x(({i}) => xScale(X[i]))
    .y0(([y1]) => yScale(y1))
    .y1(([, y2]) => yScale(y2))
    .curve(d3.curveBasis);

  // define svg
  svg
    .attr("id", "viz-transect")
    .attr("viewBox", [0, 0, width, height]) // [x-pos, y-pos, width, height]

  // define path
  svg.append("g")
        .attr("class", "combined-risk")
    .selectAll("path")
    .data(series)
    .join("path")
        .attr("id", ([{i}]) => Z[i])
        .attr("fill", ([{i}]) => risks[Z[i]].color)
        .attr("d", area)
    .append("title")
        .text(([{i}]) => risks[Z[i]].label)

// define x-axis
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.right})`)
    .call(xAxis)
    .call(g => g.select(".domain").remove());

  // labels for x-axis
  svg.append("g")
    .attr("transform", `translate(${margin.left+20},0)`)
    .call(g => g.append("text")
      .attr("x", -margin.left)
      .attr("y", 20)
      .attr("font-weight", "bold")
      .attr("font-size", 18)
      .text(yLabel));
}