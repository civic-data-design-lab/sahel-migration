import Streamgraph, { ExpandOverlay } from './streamgraph';
import Tooltip from './tooltip';

//TODO: If we need an initializer instead of rerendering everything, we can do that here
export default function PlotAllTransectLayers(
  data,
  {
    width,
    height,
    margin,
    yLabel, // a label for the y-axis
    svg,
    xScale,
    risks,
    risksData,
    journeyFocusData,
    journey,
    svgRef,
    tooltipRef,
  } = {}
) {
  svg.attr('viewBox', [0, 0, width, height]).style('pointer-events', 'all');
  risks.forEach((risk) => {
    yLabel = risk.label;

    let dataStackedArea = data.filter((d) => d.risk === risk.id);
    Streamgraph(dataStackedArea, {
      x: (d) => d.distance,
      y: (d) => d.value,
      z: (d) => risks.find((risk) => risk.id === d.risk),
      yLabel: yLabel,
      width: width,
      height: 150,
      margin: margin,
      svg: svg,
      xScale: xScale,
      risks: risks,
      riskId: risk.id,
      risksData: risksData,
      journeyFocusData: journeyFocusData,
      journey: journey,
    });
  });
  Tooltip({
    width: width,
    height: height,
    data: data,
    svgRef: svgRef,
    tooltipRef: tooltipRef,
    xScale: xScale,
    risks: risks,
    risksData: risksData,
  });
}

export function PlotCombinedTransectLayers(
  data, //filteredStackedAreaData
  {
    svg,
    svgRef,
    tooltipRef,
    width,
    height, // dataTabHeight
    xDomain,
    risks,
    yLabel,
    margin,
    xScale,
    cities,
    borders,
    journey,
    risksData, //filteredData
  }
) {
  svg
    .attr('id', 'viz-transect-layers')
    .attr('class', 'viz-transect')
    .attr('viewBox', [0, 0, width, height]);
  const journeyData = data.filter((d) => d.segment_index == journey.id - 1);
  const journeyDistStart = journeyData[0].distance;
  const journeyDistEnd = journeyData[journeyData.length - 1].distance;
  const journeyFocusData = [
    {
      xPos: 'start',
      x1: xDomain[0],
      x2: journeyDistStart,
    },
    {
      xPos: 'end',
      x1: journeyDistEnd,
      x2: xDomain[1],
    },
  ];

  Streamgraph(data, {
    x: (d) => d.distance,
    y: (d) => d.value,
    z: (d) => risks.find((risk) => risk.id === d.risk),
    yLabel: yLabel,
    width: width,
    height: height,
    svg: svg,
    risks: risks,
    riskId: 'all',
    margin: margin,
    xScale: xScale,
    risksData: risksData,
    journeyFocusData: journeyFocusData,
    cities: cities,
    borders: borders,
    journey: journey,
  });
  Tooltip({
    width: width,
    height: height,
    data: data,
    svgRef: svgRef,
    tooltipRef: tooltipRef,
    xScale: xScale,
    risks: risks,
    risksData: risksData,
  });
  // rect overlay for on-click to expand trigger
  ExpandOverlay({
    svg,
    xScale,
    journeyFocusData,
    journey,
    height,
  });
}
