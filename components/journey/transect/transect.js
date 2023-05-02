import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import useWindowSize from '../../../hooks/useWindowSize';
import PlotAllTransectLayers, { PlotCombinedTransectLayers } from './transectPlots';
import styles from '../../../styles/Transect.module.css';
import RiskWeightTextInput from './RiskWeightTextInput';
import RiskWeightSlider from './RiskWeightSlider';
import { createRoot } from 'react-dom/client';

const INITIAL_RISKS_DATA = [
  {
    id: '4mi',
    index: 0,
    label: 'Reported Violence',
    color: '#5D3435',
    weight: 100,
    normWeight: 1 / 6,
  },
  {
    id: 'acled',
    index: 1,
    label: 'Conflict Events',
    color: '#985946',
    weight: 100,
    normWeight: 1 / 6,
  },
  {
    id: 'food',
    index: 2,
    label: 'Food Insecurity',
    color: '#9A735A',
    weight: 100,
    normWeight: 1 / 6,
  },
  {
    id: 'smuggler',
    index: 3,
    label: 'Need for a Smuggler',
    color: '#F48532',
    weight: 100,
    normWeight: 1 / 6,
  },
  {
    id: 'remoteness',
    index: 4,
    label: 'Remoteness',
    color: '#624B44',
    weight: 100,
    normWeight: 1 / 6,
  },
  { id: 'heat', index: 5, label: 'Extreme Heat', color: '#3F231B', weight: 100, normWeight: 1 / 6 },
];

const margin = {
  top: 50,
  right: 25,
  bottom: 60,
  left: 15,
};

export default function Transect({ isOpen, journey, dataTabHeight }) {
  const { width, height } = useWindowSize();
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [risks, setRisks] = useState([...INITIAL_RISKS_DATA]);
  const [expandedData, setExpandedData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [svgLoaded, setSvgLoaded] = useState(false);

  const updateIsExpanded = (data) => {
    setIsExpanded(!isExpanded);
    setExpandedData(data);
  }
  function drawLayers(svgRef, width, height, isOpen) {
    setSvgLoaded(false);

    // const svg = d3.select(svgRef.current);
    const openedTabHeight = 0.8 * height;
    const svg = d3.select(svgRef.current);
    const margin = {
      top: 50,
      right: 25,
      bottom: 60,
      left: 15,
    };

    // d3.json('/data/route_traffic.json').then(function (routeData) {
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
        const cities = data
          .filter((d) => !!d.city && !excludeCities.includes(d.city))
          .map((d) => {
            let item = {};
            item.distance = +d.distance;
            item.city = d.city;
            item.country = d.country;
            return item;
          });
        const borders = data
          .filter((d) => !!d.border_2)
          .map((d) => {
            let item = {};
            item.distance = +d.distance;
            item.border_1 = d.border_1;
            item.border_2 = d.border_2;
            return item;
          });
        const migrantRoutesData = data.reduce((a, d) => {
          let i = d.route_index - 1;
          if (!a[i]) {
              let item = {};
              item.route_index = d.route_index;
              item.count_index = 1;
              item.count_total = d.migrant_count;
              item.count_avg = d.migrant_count;
              item.count_min = d.migrant_count;
              item.count_max = d.migrant_count;
              item.dist_start = d.distance;
              item.dist_end = d.distance;
              item.dist_total = item.dist_end - item.dist_start;
              item.count_per_km = Math.round(item.count_avg / item.dist_total);
              a.push(item);
          }
          else {
              a[i].route_index = d.route_index;
              a[i].count_index += 1;
              a[i].count_total += d.migrant_count;
              a[i].count_avg = Math.round(a[i].count_total / a[i].count_index);
              a[i].count_min = Math.min(a[i].count_min, d.migrant_count);
              a[i].count_max = Math.max(a[i].count_max, d.migrant_count);
              a[i].dist_start = Math.min(a[i].dist_start, d.distance);
              a[i].dist_end = Math.max(a[i].dist_end, d.distance);
              a[i].dist_total = a[i].dist_end - a[i].dist_start;
              a[i].count_per_km = Math.round(a[i].count_avg / a[i].dist_total);
          }
          return a;
        }, [])
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
            migrantRoutesData: migrantRoutesData,
            updateRiskWeight,
          });
        } else {
          let data;
          let xScale = d3.scaleLinear().domain(xDomain).range(xRange);
          if (expandedData != null) {
            data = expandedData;
            let expandedXDomain = [ data[0].distance, data[data.length - 1].distance ];
            xScale = d3.scaleLinear().domain(expandedXDomain).range(xRange);
          } else {
            data = filteredStackedAreaData;
          }
          PlotCombinedTransectLayers(data, {
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
            xRange: xRange,
            cities: cities,
            borders: borders,
            journey: journey,
            risksData: filteredData,
            updateIsExpanded : updateIsExpanded,
            isExpanded : isExpanded,
          });
        }

        setSvgLoaded(true);
      });
    });
  }

  const [roots, setRoots] = useState([]);

  useEffect(() => {
    // Make sure to unmount the old roots
    console.log('Recreating roots');
    roots.forEach((r) => {
      r.root.unmount();
    });
    const newRoots = [];

    if (!svgLoaded || !isOpen) {
      console.log('Set roots to empty array');
      setRoots(newRoots);
      return;
    }

    const svg = d3.select(svgRef.current);

    risks.forEach((risk) => {
      console.log('Drawing', risk);
      const textInputElement = svg
        .append('foreignObject')
        .attr('width', 100)
        .attr('height', 100)
        .attr('x', margin.left + 200)
        .attr('y', margin.top + 100 * risk.index - 10)
        .style('z-index', 9999)
        .attr('pointer-events', 'none')
        .append('xhtml:div')
        .attr('xmlns', 'http://www.w3.org/1999/xhtml')
        .style('pointer-events', 'all')
        .node();

      newRoots.push({ type: 'text', root: createRoot(textInputElement), riskId: risk.id });

      const sliderElement = svg
        .append('foreignObject')
        .attr('width', 250)
        .attr('height', 25)
        .attr('x', margin.left)
        .attr('y', margin.top + 100 * risk.index + 15)
        .style('z-index', 9999)
        .attr('pointer-events', 'none')
        .append('xhtml:div')
        .attr('xmlns', 'http://www.w3.org/1999/xhtml')
        .style('pointer-events', 'all')
        .node();

      newRoots.push({ type: 'slider', root: createRoot(sliderElement), riskId: risk.id });
    });

    setRoots(newRoots);
    console.log('created roots', newRoots);

    return () => {
      console.log('UNMOUNTING');
      roots.forEach((rootInfo) => {
        rootInfo.root.unmount();
      });
    };
  }, [svgLoaded]);

  //TODO: optimize re-rendering for d3 plots
  useEffect(() => {
    drawLayers(svgRef, width, height, isOpen);
  }, [dataTabHeight, height, svgRef, width, isOpen, journey,isExpanded]);

  useEffect(() => {
    console.log('Rendering to', roots);

    roots.forEach(({ type, root, riskId }) => {
      const riskInfo = risks.find((risk) => risk.id === riskId);
      if (type === 'text') {
        root.render(
          <RiskWeightTextInput
            key={riskInfo.id}
            riskId={riskInfo.id}
            riskWeight={riskInfo.weight}
            onUpdate={(val) => updateRiskWeight(riskInfo.id, val)}
          />
        );
      } else {
        root.render(
          <RiskWeightSlider
            key={riskInfo.id}
            riskId={riskInfo.id}
            riskWeight={riskInfo.weight}
            onUpdate={(val) => updateRiskWeight(riskInfo.id, val)}
          />
        );
      }
    });

    console.log('Done rendering');
  }, [roots, risks]);

  const updateRiskWeight = (riskId, newWeight) => {
    // Calculate the new normalized weights based on the new weight and previous
    // weights
    const totalWeight =
      risks.filter((risk) => risk.id !== riskId).reduce((a, b) => a + b.weight, 0) + newWeight;

    setRisks((prev) =>
      prev.map((risk) => {
        if (risk.id === riskId) {
          // Make sure to update the weight properly
          return { ...risk, weight: newWeight, normWeight: newWeight / totalWeight };
        }
        return { ...risk, normWeight: risk.weight / totalWeight };
      })
    );
  };

  const componentRef = useRef(null);

  useEffect(() => {
    if (svgRef.current && componentRef.current) {
      const foreignObject = d3
        .select(svgRef.current)
        .append('foreignObject')
        .attr('x', 50)
        .attr('y', 50)
        .attr('width', 200)
        .attr('height', 100)
        .raise();

      foreignObject.append(() => componentRef.current);
    }
  }, [svgRef.current, componentRef.current]);

  return (
    <>
      <svg ref={svgRef}></svg>
    </>
  );
}
