import * as d3 from 'd3';

export default function Tooltip(config) {
  const { migrantRoutesData, width, height, margin, yPlotOffset, svg, xScale } = config;

  const dotPlot = svg.append('g')
    .attr('id', 'viz-dot-density');

  // plot rectangle area for points
  dotPlot.append('g')
      .attr('class', 'rect-area')
    .selectAll('rect')
      .data(migrantRoutesData)
      .enter()
    .append('rect')
      .attr('width', (d) => xScale(d.dist_end) - xScale(d.dist_start))
      .attr('height', yPlotOffset/3)
      .attr('x', (d) => xScale(d.dist_start))
      .attr('y', height - 2/3 * yPlotOffset)
      .attr('fill-opacity', 0)
      .attr('stroke', '#000');

  // plot dots within rectangle area
  // migrantRoutesData.map(d => makeDots(
  //   {
  //     width: (d) => xScale(d.dist_end) - xScale(d.dist_start),
  //     height: yPlotOffset/3,
  //     x: (d) => xScale(d.dist_start),
  //     y: height - 2/3 * yPlotOffset,
  //   }, // rectangle geometry
  //   d.count_avg, // numPoints
  //   {distance: 1, edgeDistance: 1}));

  // Generate points at random locations inside polygon.
  // polygon: polygon (Array of points [x,y])
  // numPoints: number of points to generate
  
  // Returns an Array of points [x,y].
  // The returned Array will have a property complete, which is set to false if the
  // desired number of points could not be generated within `options.numIterations` attempts

  function makeDots(rect, numPoints, options) { 
    options = Object.assign({
      // DEFAULT OPTIONS:
      maxIterations: numPoints / 10,
      distance: null, // by default: MIN(areaWidth, areaHeight) / numPoints / 4,
      edgeDistance: options.distance
    },options);
  
    numPoints = Math.floor(numPoints)
  
    // calculate bounding box
    // let xMin = Infinity,
    //   yMin = Infinity,
    //   xMax = -Infinity,
    //   yMax = -Infinity
    
    // polygon.forEach(p => {
    //   if (p[0]<xMin) xMin = p[0]
    //   if (p[0]>xMax) xMax = p[0]
    //   if (p[1]<yMin) yMin = p[1]
    //   if (p[1]>yMax) yMax = p[1]
    // });
  
    // let areaWidth = xMax - xMin
    // let areaHeight = yMax - yMin
    let xMin = rect.x,
      yMin = rect.y,
      xMax = rect.x + rect.width,
      yMax = rect.y + rect.height,
      areaWidth = rect.width,
      areaHeight = rect.height
    
    // default options depending on bounds
    options.distance = options.distance || Math.min(areaWidth, areaHeight) / numPoints / 4
    options.edgeDistance = options.edgeDistance || options.distance
    
    // generate points
    let points = [];
    
    outer:
    for (let i=0; i<options.maxIterations; i++) {
      let p = [xMin + Math.random() * areaWidth, yMin + Math.random() * areaHeight]
      if (d3.polygonContains(polygon, p)) {
        // check distance to other points
        for (let j=0; j<points.length; j++) {
          let dx = p[0]-points[j][0],
              dy = p[1]-points[j][1]
          
          if (Math.sqrt(dx*dx+dy*dy) < options.distance) continue outer;
        }
        // check distance to polygon edge
        for (let j=0; j<polygon.length-1; j++) {
          if (distPointEdge(p, polygon[j], polygon[j+1]) < options.edgeDistance) continue outer;
        }
        points.push(p);
        if (points.length == numPoints) break;
      }
    }
    
    points.complete = (points.length >= numPoints)
    
    return points
  }

  // transform xAxis labels
  svg.select('g#viz-transect-axis')
    .attr('transform', `translate(0,${yPlotOffset/3})`);
}