import * as d3 from "d3";

const tooltipLayout = "<h4 class='risk-total'>Combined Risk<span id='data-total' class='labelData'>152</span></h4><p class='risk-4mi'>Reported Violence<span id='data-4mi' class='labelData'>12</span></p><p class='risk-acled'>Armed Conflict<span id='data-acled' class='labelData'>0</span></p><p class='risk-food'>Food Insecurity<span id='data-food' class='labelData'>40</span></p><p class='risk-smuggler'>Need for a Smuggler<span id='data-smuggler' class='labelData'>0</span></p><p class='risk-remoteness'>Remoteness<span id='data-remoteness' class='labelData'>20</span></p><p class='risk-heat'>Extreme Heat<span id='data-heat' class='labelData'>80</span></p>"

export default function Tooltip(config) {
  const { width, height, data, svgRef, tooltipRef, xScale, margin, risks, risksData } = config;
  const svg = d3.select(svgRef.current).attr('id', 'viz-transect-layers');
  //   const tooltip = d3.select(tooltipRef.current);
  const tooltip = d3.select('#transectTooltip').style('top', 0).style('left', 0);
  if (!document.getElementById('transectTooltip').hasChildNodes()) {
    tooltip
      .attr('class', 'transectTooltip')
      .html(tooltipLayout)
      .attr('class', 'hidden transectTooltip');
  }

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
    .raise()
    .on('mouseenter', mouseenter)
    // .on('mouseover', () => {
    //   // focus.style('display', null);
    // })
    .on('mouseout', mouseout)
    .on('mousemove', (event) => mousemove(event, risks, risksData));

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
      // console.log(d0);

      let combinedRiskValue = 0;
      // update data in tooltip for each risk
      for (let i = 0; i < Object.keys(risks).length; i++) {
        let risk = Object.keys(risks)[i];
        let riskClass = '.risk-' + risk;
        let dataId = '#data-' + risk;
        let dataValue = Math.round(d0['risk_' + risk] * risks[risk].weight);
        combinedRiskValue += dataValue;
        tooltip.select(riskClass).select(dataId).html(dataValue);
      }
      // update data in tooltip for total risks
      tooltip.select('.risk-total').select('#data-total').html(Math.round(d0.risks_total));
      tooltip.select('.risk-total').select('#data-total').html(Math.round(combinedRiskValue));
    }

    line.attr('x1', xPos).attr('y1', 0).attr('x2', xPos).attr('y2', height);

    tooltip
      .attr('class', 'transectTooltip')
      .style('top', (divHtml) => {
        let mouseY = event.screenY;
        // let mouseY = d3.pointer(event)[1];
        let tooltipHeight = document.getElementById('transectTooltip').offsetHeight;
        return mouseY - 1.7 * tooltipHeight + 'px';
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
}
