import * as d3 from 'd3';

export default function Tooltip(config) {
  const { migrantRoutesData, width, height, margin, svg, xScale } = config;
  const yPlotOffset = 100;

  const dotPlot = svg.append('g')
    .attr('class', 'dot-density');

  dotPlot.append('g')
      .attr('class', 'rect-area')
    .selectAll('rect')
      .data(migrantRoutesData)
      .enter()
    .append('rect')
      .attr('width', (d) => xScale(d.dist_end) - xScale(d.dist_start))
      .attr('height', yPlotOffset/3)
      .attr('x', (d) => xScale(d.dist_start))
      .attr('y', margin.top + 5.75 * yPlotOffset)
      .attr('fill-opacity', 0)
      .attr('stroke', '#000');
}