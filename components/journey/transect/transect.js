import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import useWindowSize from '../../../hooks/useWindowSize';
import PlotAllTransectLayers, { PlotCombinedTransectLayers } from './transectPlots';
import styles from '../../../styles/Transect.module.css';

const INITIAL_RISKS_DATA = [
  { id: '4mi', index: 0, label: 'Reported Violence', color: '#5D3435', weight: 1 / 6 },
  { id: 'acled', index: 1, label: 'Conflict Events', color: '#985946', weight: 1 / 6 },
  { id: 'food', index: 2, label: 'Food Insecurity', color: '#9A735A', weight: 1 / 6 },
  { id: 'smuggler', index: 3, label: 'Need for a Smuggler', color: '#F48532', weight: 1 / 6 },
  { id: 'remoteness', index: 4, label: 'Remoteness', color: '#624B44', weight: 1 / 6 },
  { id: 'heat', index: 5, label: 'Extreme Heat', color: '#3F231B', weight: 1 / 6 },
];

export default function Transect({ isOpen, journey, dataTabHeight }) {
  const { width, height } = useWindowSize();
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [risks, setRisks] = useState(
    INITIAL_RISKS_DATA.map((risk) => ({ ...risk, containerRef: useRef(null) }))
  );

  function drawLayers(svgRef, width, height, isOpen) {
    // const svg = d3.select(svgRef.current);
    const openedTabHeight = 0.8 * height;
    const svg = d3.select(svgRef.current);
    const margin = {
      top: 50,
      right: 25,
      bottom: 50,
      left: 15,
    };

    // d3.csv('/data/transectsegment.csv').then(function (data) {
    d3.json('/data/transect_all.json').then(function (data) {
      d3.json('/data/transect.json').then(function (stackedAreaData) {
        let filteredData = data.filter(
          (d) => d.index % 50 === 0 || d.index === stackedAreaData.length - 1
        );
        let filteredStackedAreaData = stackedAreaData.filter(
          (d) => d.index % 50 === 0 || d.index === stackedAreaData.length - 1
        );
        let excludeCities = [
          'Sikasso',
          'Orodara',
          'Banfora',
          'Reo',
          'Koudougou',
          'Kombissiri',
          'Ziniare',
          'Boulsa',
          'Zorgo',
          'Koupela',
          'Tenkodogo',
          'Fada Ngourma',
          'Dosso',
          'Gharyan',
          'Az Zawiyah',
        ];
        let cities = data
          .filter((d) => !!d.city && !excludeCities.includes(d.city))
          .map((d) => {
            let item = {};
            item.distance = +d.distance;
            item.city = d.city;
            item.country = d.country;
            return item;
          });
        let borders = data
          .filter((d) => !!d.border_2)
          .map((d) => {
            let item = {};
            item.distance = +d.distance;
            item.border_1 = d.border_1;
            item.border_2 = d.border_2;
            return item;
          });
        let yLabel = '';
        svg.selectAll('*').remove();
        // Construct data domains
        const xDomain = [
          filteredStackedAreaData[0].distance,
          filteredStackedAreaData[filteredStackedAreaData.length - 1].distance,
        ];
        // Construct svg ranges
        const xRange = [margin.left, width - margin.right];
        // Construct scales and axes
        const xScale = d3.scaleLinear().domain(xDomain).range(xRange);
        if (isOpen) {
          PlotAllTransectLayers(filteredStackedAreaData, {
            yLabel: yLabel,
            width: width,
            height: openedTabHeight,
            svg: svg,
            margin: margin,
            cities: cities,
            borders: borders,
            journey: journey,
            svgRef: svgRef,
            tooltipRef: tooltipRef,
            xScale: xScale,
            risks: risks,
            risksData: filteredData,
          });
        } else {
          PlotCombinedTransectLayers(filteredStackedAreaData, {
            svg: svg,
            svgRef: svgRef,
            tooltipRef: tooltipRef,
            width: width,
            height: dataTabHeight,
            xDomain: xDomain,
            risks: risks,
            yLabel: yLabel,
            margin: margin,
            xScale: xScale,
            cities: cities,
            borders: borders,
            journey: journey,
            risksData: filteredData,
          });
        }
      });
    });
  }

  //TODO: optimize re-rendering for d3 plots
  useEffect(() => {
    drawLayers(svgRef, width, height, isOpen);
  }, [dataTabHeight, height, svgRef, width, isOpen, journey]);

  return (
    <>
      <svg ref={svgRef} />
      {/*<svg ref={tooltipRef} />*/}
    </>
  );
}
