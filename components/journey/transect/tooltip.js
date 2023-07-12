import * as d3 from 'd3';
import {PlotAreaCurve} from './streamgraph.js';

export default function Tooltip(config) {
  const { width, height, data, svgRef, tooltipRef, xScale, xRange, margin, risks, riskId, risksData, journey, journeyData, journeyFocusData, updateIsExpanded, isExpanded, isOpen } = config;

  const tooltipLayout = isOpen ?
  "<div class='header'><h4 class='risk risk-class'>Migration Risk<span id='data-risk-text' class='labelData'>High</span></h4></div><div class='body'><p class='risk risk-4mi'>Reported Violence<span id='data-4mi' class='labelData'>12</span></p><p class='risk risk-acled'>Conflict Events<span id='data-acled' class='labelData'>0</span></p><p class='risk risk-food'>Food Insecurity<span id='data-food' class='labelData'>40</span></p><p class='risk risk-smuggler'>Reliance on Smugglers<span id='data-smuggler' class='labelData'>0</span></p><p class='risk risk-remoteness'>Remoteness<span id='data-remoteness' class='labelData'>20</span></p><p class='risk risk-heat'>Heat Exposure<span id='data-heat' class='labelData'>80</span></p><p class='risk-total'><b>Total Migration Risk<span id='data-total' class='labelData'>55</span></b></p><p class='route-traffic'><span id='data-migrants'>2,000 migrants crossed this route</span> between July 2020&ndash;June 2022</p></div>"
  : "<div class='header'><h4 class='risk risk-class'>Migration Risk<span id='data-risk-text' class='labelData'>High</span></h4></div><div class='body'><p class='risk risk-4mi'>Reported Violence<span id='data-4mi' class='labelData'>12</span></p><p class='risk risk-acled'>Conflict Events<span id='data-acled' class='labelData'>0</span></p><p class='risk risk-food'>Food Insecurity<span id='data-food' class='labelData'>40</span></p><p class='risk risk-smuggler'>Reliance on Smugglers<span id='data-smuggler' class='labelData'>0</span></p><p class='risk risk-remoteness'>Remoteness<span id='data-remoteness' class='labelData'>20</span></p><p class='risk risk-heat'>Heat Exposure<span id='data-heat' class='labelData'>80</span></p><p class='risk-total'><b>Total Migration Risk<span id='data-total' class='labelData'>55</span></b></p></div>";

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
      let allCombinedRiskValues = risksData.map(
        d => Math.round(
          d.risk_4mi * risks.find(i => i.id == '4mi').normWeight + 
          d.risk_acled * risks.find(i => i.id == 'acled').normWeight + 
          d.risk_food * risks.find(i => i.id == 'food').normWeight + 
          d.risk_smuggler * risks.find(i => i.id == 'smuggler').normWeight + 
          d.risk_remoteness * risks.find(i => i.id == 'remoteness').normWeight + 
          d.risk_heat * risks.find(i => i.id == 'heat').normWeight
        )
      ).sort((a, b) => a - b);

      let riskLevelBreaks = [8, 13, 21, 36, 47, 55]; // min = 0, median = 21, max = 55
      // redefine breakpoints based on weighting
      for (let i = 0; i < 6; i++) {
        let valueIndex = Math.round(allCombinedRiskValues.length/6 * (i + 1)) - 1;
        riskLevelBreaks[i] = allCombinedRiskValues[valueIndex];
      }
      
      // update data in tooltip for each risk
      risks.forEach((risk) => {
        let riskClass = '.risk-' + risk.id;
        let dataId = '#data-' + risk.id;
        let dataValue = Math.round(d0['risk_' + risk.id] * risk.normWeight);
        let maxDataValue = Math.round(100 * risk.normWeight);
        combinedRiskValue += dataValue;
        tooltip.select(riskClass).select(dataId).html(dataValue);
      });
      // update data in tooltip for total risks
      let riskLevel = (combinedRiskValue <= riskLevelBreaks[0]) ? 1 
        : (riskLevelBreaks[0] < combinedRiskValue && combinedRiskValue <= riskLevelBreaks[1]) ? 2
        : (riskLevelBreaks[1] < combinedRiskValue && combinedRiskValue <= riskLevelBreaks[2]) ? 3
        : (riskLevelBreaks[2] < combinedRiskValue && combinedRiskValue <= riskLevelBreaks[3]) ? 4
        : (riskLevelBreaks[3] < combinedRiskValue && combinedRiskValue <= riskLevelBreaks[4]) ? 5
        : (riskLevelBreaks[4] < combinedRiskValue) ? 6
        : null;
      console.log(riskLevel);
      let riskText = (combinedRiskValue < riskLevelBreaks[0]) ? "Low"
      : (riskLevelBreaks[0] < combinedRiskValue && combinedRiskValue < riskLevelBreaks[1]) ? "Mid-Low"
      : (riskLevelBreaks[1] < combinedRiskValue && combinedRiskValue < riskLevelBreaks[2]) ? "Mid"
      : (riskLevelBreaks[2] < combinedRiskValue && combinedRiskValue < riskLevelBreaks[3]) ? "Mid-High"
      : (riskLevelBreaks[3] < combinedRiskValue && combinedRiskValue < riskLevelBreaks[4]) ? "High"
      : (riskLevelBreaks[4] < combinedRiskValue && combinedRiskValue < riskLevelBreaks[5]) ? "Very High"
      : "";
      tooltip.select('.header').attr('class', 'header risk-class-' + riskLevel);
      tooltip.select('.risk-class').select('#data-risk-text').html(riskText);
      tooltip.select('.risk-total').select('#data-total').html(Math.round(combinedRiskValue));

      if (isOpen) {
        // update data in tooltip for route traffic / migrant counts along each segment
        tooltip.select('.route-traffic').select('#data-migrants').html(Math.round(d0.migrant_count).toLocaleString('en-US') + " migrants crossed this route");
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
