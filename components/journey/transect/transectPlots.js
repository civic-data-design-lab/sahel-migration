import Streamgraph, {ExpandOverlay, PlotXAxis, XAxisTicks} from './streamgraph';
import dotDensityPlot from './dotDensityPlot';
import Tooltip from './tooltip';
import { createRoot } from 'react-dom/client';
import RiskWeightTextInput from './RiskWeightTextInput';
import RiskWeightSlider from './RiskWeightSlider';
import * as d3 from "d3";

//TODO: If we need an initializer instead of rerendering everything, we can do that here
export default function PlotAllTransectLayers(
  data,
  {
    width,
    height,
    margin,
    yPlotOffset,
    yLabel, // a label for the y-axis
    svg,
    xScale,
    xDomain,
    risks,
    risksData,
    journeyData,
    journeyFocusData,
    journey,
    migrantRoutesData,
    cities,
    borders,
    svgRef,
    tooltipRef,
    updateRiskWeight,
    isOpen,
  } = {}
) {
  svg.attr('viewBox', [0, -15, width, height + 15]).style('pointer-events', 'all');
  const xAxis = d3
    .axisBottom(xScale)
    .tickValues([0, 10, 20, 30, 40, xDomain[1].toFixed(2)])
    .ticks(5)
    .tickSizeOuter(0)
    .tickFormat((d, i) => (d * 100).toLocaleString('en-US') + ' km');
  const plot = svg
    .append('g')
    .attr('id', 'viz-transect-axis')
    .attr('class', 'viz-transect')
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
      yPlotOffset: yPlotOffset,
      margin: margin,
      svg: svg,
      xScale: xScale,
      risks: risks,
      riskId: risk.id,
      risksData: risksData,
      journeyData: journeyData,
      journeyFocusData: journeyFocusData,
      journey: journey,
    });
  });
  dotDensityPlot({
    migrantRoutesData: migrantRoutesData,
    width: width,
    height: height,
    margin: margin,
    yPlotOffset: yPlotOffset,
    svg: svg,
    xScale: xScale,
  });
  PlotXAxis({
    plot: plot,
    height: height,
    margin: margin,
    xAxis: xAxis,
    xAxisTicks: (ticksData) => XAxisTicks(ticksData,xScale),
    borders: borders,
    cities: cities,
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
    journey: journey,
    journeyData: journeyData,
    journeyFocusData: journeyFocusData,
    isOpen: isOpen,
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
    yPlotOffset,
    xDomain,
    risks,
    yLabel,
    margin,
    xScale,
    xRange,
    cities,
    borders,
    journey,
    risksData, //filteredData
    updateIsExpanded,
    isExpanded,
    isOpen,
  }
) {
  svg
    .attr('id', 'viz-transect-layers')
    .attr('class', 'viz-transect')
    .attr('viewBox', [0, 0, width, height]);

  let journeyData = [];
  let journeyFocusData = [];

  if (journey.id < 8) {
    journeyData = data.filter((d) => d.segment_index == journey.id - 1);
    const journeyDistStart = journeyData[0].distance;
    const journeyDistEnd = journeyData[journeyData.length - 1].distance;
    journeyFocusData = [
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
  }

  Streamgraph(data, {
    x: (d) => d.distance,
    y: (d) => d.value,
    z: (d) => risks.find((risk) => risk.id === d.risk),
    yLabel: yLabel,
    width: width,
    height: height,
    yPlotOffset: yPlotOffset,
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
    isExpanded: isExpanded,
  });
  Tooltip({
    width: width,
    height: height,
    margin: margin,
    data: data,
    svgRef: svgRef,
    tooltipRef: tooltipRef,
    xScale: xScale,
    xRange: xRange,
    risks: risks,
    riskId: 'all',
    risksData: risksData,
    journey: journey,
    journeyData: journeyData,
    journeyFocusData: journeyFocusData,
    updateIsExpanded: updateIsExpanded,
    isExpanded: isExpanded,
    isOpen: isOpen
  });
  // rect overlay for on-click to expand trigger
}
