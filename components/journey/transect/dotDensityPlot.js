import * as d3 from 'd3';

export default function Tooltip(config) {
  const { migrantRoutesData, width, height, margin, yPlotOffset, svg, xScale } = config;

  const dotPlot = svg.append('g').attr('id', 'viz-dot-density');

  // plot rectangle area for points
  dotPlot
    .append('g')
    .attr('class', 'rect-area')
    .append('image')
    .attr('x', () => xScale(0))
    .attr('y', height - yPlotOffset)
    .attr('width', width - margin.left - margin.right)
    .attr('height', yPlotOffset / 3)
    .attr('preserveAspectRatio', 'none')
    .attr('xlink:href', '/images/journeys/dot-density-only.png');
  // .attr('transform', `translate(0,${-15})`)
  // .selectAll('rect')
  // .data(migrantRoutesData)
  // .enter()
  // .append('rect')
  // .attr('width', (d) => xScale(d.dist_end) - xScale(d.dist_start))
  // .attr('height', yPlotOffset / 3)
  // .attr('x', (d) => xScale(d.dist_start))
  // .attr('y', height - yPlotOffset)
  // .attr('opacity', 0);
  // .attr('fill-opacity', 0)
  // .attr('stroke', '#463C35');

  // // generate data for points within rectangle area
  // let points = migrantRoutesData.map(d => makeDots(
  //     {
  //       width: xScale(d.dist_end) - xScale(d.dist_start),
  //       height: yPlotOffset/3,
  //       x: xScale(d.dist_start),
  //       y: height - yPlotOffset,
  //     }, // rectangle geometry
  //     d.count_avg, // numPoints
  //     {distance: 0, edgeDistance: 0} // default options
  //   )).flat();

  // // plot points within rectangle area
  // dotPlot.append('g')
  //     .attr('class', 'points')
  //     // .attr('transform', `translate(0,${-15})`)
  //   .selectAll('circle')
  //     .data(points)
  //     .enter()
  //   .append('circle')
  //     .attr('cx', d => d[0])
  //     .attr('cy', d => d[1])
  //     .attr('r', 0.55)
  //     .attr('fill', '#463C35')
  //     .attr('opacity', 0.8);

  // add label
  dotPlot
    .append('text')
    .attr('id', 'label-migrants')
    .attr('x', margin.left)
    .attr('y', height - yPlotOffset - 10)
    .attr('dy', '-0.125em')
    .attr('fill', '#463C35')
    .text('Migrants Along the Route');

  // transform xAxis labels
  // svg.select('g#viz-transect-axis')
  // .attr('transform', `translate(0,${-yPlotOffset/3})`);

  // Generate points at random locations inside polygon.
  // polygon: polygon (Array of points [x,y])
  // numPoints: number of points to generate

  // Returns an Array of points [x,y].
  // The returned Array will have a property complete, which is set to false if the
  // desired number of points could not be generated within `options.numIterations` attempts
  function makeDots(rect, numPoints, options) {
    options = Object.assign(
      {
        // DEFAULT OPTIONS:
        maxIterations: numPoints,
        distance: null, // by default: MIN(areaWidth, areaHeight) / numPoints / 4,
        edgeDistance: options.distance,
        pointsMultiplier: 1 / 2,
      },
      options
    );

    numPoints = Math.round(numPoints * options.pointsMultiplier);

    // calculate bounding box
    let xMin = rect.x,
      yMin = rect.y,
      xMax = rect.x + rect.width,
      yMax = rect.y + rect.height,
      areaWidth = rect.width,
      areaHeight = rect.height;
    let rectPolygon = [
      [xMin, yMin],
      [xMin, yMax],
      [xMax, yMax],
      [xMax, yMin],
    ];

    // default options depending on bounds
    options.distance = options.distance || Math.min(areaWidth, areaHeight) / numPoints / 4;
    options.edgeDistance = options.edgeDistance || options.distance;

    // generate points
    let points = [];

    outer: for (let i = 0; i < options.maxIterations; i++) {
      let p = [xMin + Math.random() * areaWidth, yMin + Math.random() * areaHeight];
      if (d3.polygonContains(rectPolygon, p)) {
        // check distance to other points
        for (let j = 0; j < points.length; j++) {
          let dx = p[0] - points[j][0],
            dy = p[1] - points[j][1];
          if (Math.sqrt(dx * dx + dy * dy) < options.distance) continue outer;
        }
        // check distance to polygon edge
        for (let j = 0; j < rectPolygon.length - 1; j++) {
          if (distPointEdge(p, rectPolygon[j], rectPolygon[j + 1]) < options.edgeDistance)
            continue outer;
        }
        points.push(p);
        if (points.length == numPoints) break;
      }
    }
    points.complete = points.length >= numPoints;
    return points;
  }

  // ported from https://stackoverflow.com/q/30559799
  function distPointEdge(p, l1, l2) {
    let A = p[0] - l1[0],
      B = p[1] - l1[1],
      C = l2[0] - l1[0],
      D = l2[1] - l1[1];
    let dot = A * C + B * D;
    let len_sq = C * C + D * D;
    // alpha is proportion of closest point on the line between l1 and l2
    let alpha = -1;
    if (len_sq != 0)
      //in case of 0 length line
      alpha = dot / len_sq;
    // points on edge closest to p
    let X, Y;
    if (alpha < 0) {
      X = l1[0];
      Y = l1[1];
    } else if (alpha > 1) {
      X = l2[0];
      Y = l2[1];
    } else {
      X = l1[0] + alpha * C;
      Y = l1[1] + alpha * D;
    }
    let dx = p[0] - X;
    let dy = p[1] - Y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
