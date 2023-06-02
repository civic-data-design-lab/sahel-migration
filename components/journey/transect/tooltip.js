import * as d3 from 'd3';
import {PlotAreaCurve} from './streamgraph.js';

export default function Tooltip(config) {
  const { width, height, data, svgRef, tooltipRef, xScale, xRange, margin, risks, riskId, risksData, journey, journeyData, journeyFocusData, updateIsExpanded, isExpanded, isOpen } = config;

  const tooltipLayout = isOpen ?
  "<h4 class='risk risk-total'>Migration Risk<span id='data-total' class='labelData'>152</span></h4><p class='risk risk-4mi'>Reported Violence<span id='data-4mi' class='labelData'>12</span></p><p class='risk risk-acled'>Conflict Events<span id='data-acled' class='labelData'>0</span></p><p class='risk risk-food'>Food Insecurity<span id='data-food' class='labelData'>40</span></p><p class='risk risk-smuggler'>Reliance on Smugglers<span id='data-smuggler' class='labelData'>0</span></p><p class='risk risk-remoteness'>Remoteness<span id='data-remoteness' class='labelData'>20</span></p><p class='risk risk-heat'>Heat Exposure<span id='data-heat' class='labelData'>80</span></p><h4 class='route-traffic'>Migrants Along the Route</h4><p class='count-migrants'><span id='data-migrants'>2000 migrants</span> crossed this route between July 2020&ndash;June 2022</p>"
  : "<h4 class='risk risk-total'>Migration Risk<span id='data-total' class='labelData'>152</span></h4><p class='risk risk-4mi'>Reported Violence<span id='data-4mi' class='labelData'>12</span></p><p class='risk risk-acled'>Conflict Events<span id='data-acled' class='labelData'>0</span></p><p class='risk risk-food'>Food Insecurity<span id='data-food' class='labelData'>40</span></p><p class='risk risk-smuggler'>Reliance on Smugglers<span id='data-smuggler' class='labelData'>0</span></p><p class='risk risk-remoteness'>Remoteness<span id='data-remoteness' class='labelData'>20</span></p><p class='risk risk-heat'>Heat Exposure<span id='data-heat' class='labelData'>80</span></p>";

  const svg = d3.select(svgRef.current).attr('id', 'viz-transect-layers');
  //   const tooltip = d3.select(tooltipRef.current);
  const tooltip = d3.select('#transectTooltip').style('top', 0).style('left', 0);
  // if (!document.getElementById('transectTooltip').hasChildNodes()) {
  tooltip
    .attr('class', 'transectTooltip')
    .html(tooltipLayout)
    .attr('class', 'hidden transectTooltip');
  // }

  // const focus = svg
  //   .append('g')
  //   .attr('class', 'focus')
  //   .style('display', 'none');

  const line = svg
    .append('line')
    .attr('id', 'focusLine')
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('opacity', 0);

  svg
    .append('rect')
    .attr('id', 'overlay')
    .attr('width', width)
    .attr('height', height)
    .style('opacity', 0)
    .style('pointer-events', 'all')
    .on('mouseenter', mouseenter)
    .on('mouseout', mouseout)
    // Need to pass in arguments to include them in scope
    .on('mousemove', (event) => mousemove(event, risks, risksData))
    .on('click', (event) => {
      return (riskId == "all") ? expandSection(event, journeyData, journeyFocusData)
      : null;
    });

  function mouseenter(event) {
    line.attr('opacity', 1);
  }
  function mouseout(event) {
    line.attr('opacity', 0);
    tooltip.attr('class', 'hidden transectTooltip');
  }
  function mousemove(event, risks, risksData) {
    const bisect = d3.bisector((d) => d.distance).left;
    const xPos = d3.pointer(event)[0];
    const x0 = bisect(data, xScale.invert(xPos));
    if (0 <= x0 && x0 < data.length) {
      // console.log(x0);
      const dIndex = data[x0].index;
      const d0 = risksData.find((d) => d.index === dIndex);
      if (!isOpen) {
        if (isExpanded) {
          svg.style('cursor', 'pointer');
          svg.select('.journey-text')
            .transition()
            .duration(500)
            .attr('r', 10)
            .style('opacity', 1)
            .ease(d3.easeCubicOut);
        } else {
          if (journeyFocusData[0].x2 <= d0.distance && d0.distance <= journeyFocusData[1].x1) {
            svg.style('cursor', 'pointer');
            console.log('in range');
            pulse()
          } else {
            svg.style('cursor', 'default');
            svg.select('.journey-text')
              .transition()
              .duration(500)
              .attr('r', 10)
              .style('opacity', 1)
              .ease(d3.easeCubicOut);
          }
        }
      }

      let combinedRiskValue = 0;
      // update data in tooltip for each risk
      risks.forEach((risk) => {
        let riskClass = '.risk-' + risk.id;
        let dataId = '#data-' + risk.id;
        let dataValue = Math.round(d0['risk_' + risk.id] * risk.normWeight);
        combinedRiskValue += dataValue;
        tooltip.select(riskClass).select(dataId).html(dataValue);
      });
      // update data in tooltip for total risks
      tooltip.select('.risk-total').select('#data-total').html(Math.round(d0.risks_total));
      tooltip.select('.risk-total').select('#data-total').html(Math.round(combinedRiskValue));

      if (isOpen) {
        // update data in tooltip for route traffic / migrant counts along each segment
        tooltip.select('.count-migrants').select('#data-migrants').html(Math.round(d0.migrant_count).toLocaleString('en-US') + " migrants");
      }
    }

    line.attr('x1', xPos).attr('y1', 0).attr('x2', xPos).attr('y2', height);

    tooltip
      .attr('class', 'transectTooltip')
      .style('top', (divHtml) => {
        // let mouseY = event.screenY;
        let mouseY = d3.pointer(event)[1];
        let tooltipHeight = document.getElementById('transectTooltip').offsetHeight;
        let svgY = document.getElementById("viz-transect-layers").getBoundingClientRect().y;
        // console.log(svgY + mouseY < tooltipHeight + 20);
        if (svgY + mouseY < tooltipHeight + 20) {
          return svgY + mouseY + 40 + 'px';
        } else {
          return svgY + mouseY - tooltipHeight - 10 + 'px';
        }
      })
      .style('left', (divHtml) => {
        let mouseX = d3.pointer(event)[0];
        let tooltipWidth = document.getElementById('transectTooltip').offsetWidth;
        let svgWidth = +svg.style('width').split('px')[0];

        if (mouseX + tooltipWidth + 10 > svgWidth) {
          return mouseX - tooltipWidth - 10 + 'px';
        } else {
          return mouseX + 10 + 'px';
        }
      });
  }
  function expandSection(event, journeyData, journeyFocusData) {
    const bisect = d3.bisector((d) => d.distance).left;
    const xPos = d3.pointer(event)[0];
    const x0 = bisect(data, xScale.invert(xPos));
    if (0 <= x0 && x0 < data.length) {
      const dIndex = data[x0].index;
      const d0 = risksData.find((d) => d.index === dIndex);
      if (isExpanded) {
        console.log('COLLAPSE SECTION',isExpanded);
        updateIsExpanded(null)

      } else {
        if (journeyFocusData[0].x2 <= d0.distance && d0.distance <= journeyFocusData[1].x1) {
          console.log('EXPAND SECTION',isExpanded);
          //TODO: change text to collapse
          updateIsExpanded(journeyData)
        }
      }

    }
  }
}
function pulse() {
  d3.select('.journey-text')
    .transition()
    .duration(500)
    .attr('r', 20)
    .style('opacity', 0.5)
    .ease(d3.easeCubicOut)
    .transition()
    .duration(500)
    .attr('r', 10)
    .style('opacity', 1)
    .ease(d3.easeCubicOut)
    .on('end', pulse);
}
