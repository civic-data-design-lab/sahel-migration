import * as d3 from 'd3';

const tooltipLayout =
  "<h4 class='risk-total'>Combined Risk<span id='data-total' class='labelData'>152</span></h4><p class='risk-4mi'>Reported Violence<span id='data-4mi' class='labelData'>12</span></p><p class='risk-acled'>Armed Conflict<span id='data-acled' class='labelData'>0</span></p><p class='risk-food'>Food Insecurity<span id='data-food' class='labelData'>40</span></p><p class='risk-smuggler'>Need for a Smuggler<span id='data-smuggler' class='labelData'>0</span></p><p class='risk-remoteness'>Remoteness<span id='data-remoteness' class='labelData'>20</span></p><p class='risk-heat'>Extreme Heat<span id='data-heat' class='labelData'>80</span></p>";

export default function Tooltip(config) {
  const { width, height, data, svgRef, tooltipRef, xScale, xRange, margin, risks, riskId, risksData, journey, journeyData, journeyFocusData } = config;
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
      // console.log(d0);

      let combinedRiskValue = 0;
      // update data in tooltip for each risk
      risks.forEach((risk) => {
        let riskClass = '.risk-' + risk.id;
        let dataId = '#data-' + risk.id;
        let dataValue = Math.round(d0['risk_' + risk.id] * (risk.weight / 100));
        combinedRiskValue += dataValue;
        tooltip.select(riskClass).select(dataId).html(dataValue);
      });
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
  function expandSection(event, journeyData, journeyFocusData) {
    const bisect = d3.bisector((d) => d.distance).left;
    const xPos = d3.pointer(event)[0];
    const x0 = bisect(data, xScale.invert(xPos));
    if (0 <= x0 && x0 < data.length) {
      const dIndex = data[x0].index;
      const d0 = risksData.find((d) => d.index === dIndex);
      if (journeyFocusData[0].x2 <= d0.distance && d0.distance <= journeyFocusData[1].x1) {
        const xScaleJourney = d3.scaleLinear()
          .domain([journeyFocusData[0].x2, journeyFocusData[1].x1]).range(xRange);
        const plot = svg.select("g#viz-transect-all").select("g#combined-risk");

        // z: (d) => risks.find((risk) => risk.id === d.risk),
        
        // z = () => 1, // given d in data, returns the (categorical) z-value

        /** The risk category (index -> risk object). */
        // const Z = d3.map(data, z);

        // define zDomain
        // let zDomain = Z;
        // zDomain = new d3.InternSet(zDomain);

        // Compute a nested array of series where each series is [[y1, y2], [y1, y2],
        // [y1, y2], …] representing the y-extent of each stacked rect. In addition,
        // each tuple has an i (index) property so that we can refer back to the
        // original data point (data[i]). This code assumes that there is only one
        // data point for a given unique x- and z-value.
        // const series = d3
        //   .stack()
        //   .keys(zDomain)
        //   .value(([x, I], z) => Y[I.get(z)])
        //   .order(order)
        //   .offset(offset)(
        //     d3.rollup(
        //       I,
        //       ([i]) => i,
        //       (i) => X[i],
        //       (i) => Z[i]
        //     )
        //   )
        //   .map((s) => s.map((d) => Object.assign(d, { i: d.data[1].get(s.key) })));

        // define area for path
        // const area = d3
        //   .area()
        //   .x(({ i }) => xScale(X[i]))
        //   .y0(([y1]) => yScale(y1))
        //   .y1(([, y2]) => yScale(y2))
        //   .curve(d3.curveBasis);

        // TODO REPLOT WITH NEW DATA
        // plot.selectAll("path")
        //   .data(series)
        //   .join('path')
        //   // .attr('id', ([{ i }]) => Z[i].id)
        //   // .attr('fill', ([{ i }]) => Z[i].color)
        //   .attr('d', area)

        console.log('expandSection clicked');
        // console.log('journey id: ' + journey.id + ', segment_index: ' + (journey.id - 1));
        // console.log('XSCALE', xScale);
      }
      // else {
      //   console.log("not in current journey")
      // }
    }
  }
}
