import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import useWindowSize from '../../../hooks/useWindowSize';
import PlotAllTransectLayers, { PlotCombinedTransectLayers } from './transectPlots';
import styles from '../../../styles/Transect.module.css';
import RiskLabel from './RiskLabel';
import RiskWeightTextInput from './RiskWeightTextInput';
import RiskWeightSlider from './RiskWeightSlider';
import InfoTooltipWrapper from '../../infotooltip';
import { createRoot } from 'react-dom/client';

const INITIAL_RISKS_DATA = [
  {
    id: '4mi',
    index: 0,
    label: 'Reported Violence',
    dataDescr:
      'Migrant reported locations and incidents of death, sexual violence, kidnapping, and physical violence. This 4Mi is based on around 48,000 interviews with refugees and migrants conducted in Africa, collected by the Mixed Migration Centre between 2018-2022.',
    color: '#5D3435',
    weight: 50,
    normWeight: 1 / 6,
  },
  {
    id: 'acled',
    index: 1,
    label: 'Conflict Events',
    dataDescr:
      'Armed Conflict Location & Event Data of dates, locations, fatalities, and types of all reported political violence and protest events from 2022. Conflict events are visualized by the sum of incident counts within a 50km radius of the route.',
    color: '#985946',
    weight: 50,
    normWeight: 1 / 6,
  },
  {
    id: 'food',
    index: 2,
    label: 'Food Insecurity',
    dataDescr:
      'Integrated Food Security Phase Classification (IPC) and Cadre Harmonisé data on regional food insecurity in 2021. The IPC Classification System distinguishes acute food insecurity across five severity phases: minimal/none, stressed, crisis, emergency, catastrophe/famine.',
    color: '#9A735A',
    weight: 50,
    normWeight: 1 / 6,
  },
  {
    id: 'smuggler',
    index: 3,
    label: 'Reliance on Smugglers',
    dataDescr:
      'Irregular migrants tend to rely on smugglers more when traveling through areas that restrict freedom of movement, approaching border crossings, and traveling through areas with a perceived need for protection. This dataset is based on research to address areas along the route where migrants are more likely to rely on smugglers, using geographic boundaries.',
    color: '#F48532',
    weight: 50,
    normWeight: 1 / 6,
  },
  {
    id: 'remoteness',
    index: 4,
    label: 'Remoteness',
    dataDescr:
      'Remoteness data serves as a proxy for the lack of access to food, healthcare, and other resources. This dataset visualizes the driving time access to the nearest city based on the ESRI World Cities dataset and Travel Time tool.',
    color: '#624B44',
    weight: 50,
    normWeight: 1 / 6,
  },
  {
    id: 'heat',
    index: 5,
    label: 'Heat Exposure',
    dataDescr:
      'Many migrants encounter dehydration and exposure to extreme heat. This dataset show the average of daily maximum temperatures from the MERRA2 satellite data in 2022 in regions that are categorized as barren or sparsely vegetated in the ESRI Africa Land Cover dataset.',
    color: '#3F231B',
    weight: 50,
    normWeight: 1 / 6,
  },
];
const routeMigrants = {
  id: 'migrants',
  label: 'Migrants Along the Route',
  dataDescr:
    'Based on the Displacement Tracking Matrix Flow Monitoring Survey data collected by the International Organization for Migration in West Africa from July 2021-June 2022, this data represents the relative number of migrants that pass through a given segment along the route using the most efficient travel routes from the Open Source Routing Machine.',
};

const margin = {
  top: 50,
  right: 25,
  bottom: 60,
  left: 15,
};

export default function Transect({ isOpen, journeys, journey, dataTabHeight }) {
  const { width, height } = useWindowSize();
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [risks, setRisks] = useState([...INITIAL_RISKS_DATA]);
  const [expandedData, setExpandedData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [svgLoaded, setSvgLoaded] = useState(false);
  const [weightsConfirmed, setWeightsConfirmed] = useState(true);

  const yPlotOffset = useMemo(() => {
    const openedTabHeight = 0.8 * height;
    return (openedTabHeight - margin.top - margin.bottom) / 7;
  }, [height]);

  const updateIsExpanded = (data) => {
    setIsExpanded(!isExpanded);
    setExpandedData(data);
  };
  function drawLayers(svgRef, width, height, isOpen) {
    setSvgLoaded(false);

    // const svg = d3.select(svgRef.current);
    const openedTabHeight = 0.75 * height;
    const svg = d3.select(svgRef.current);
    const margin = {
      top: 50,
      right: 25,
      bottom: 60,
      left: 15,
    };

    // d3.csv('/data/20km-route-traffic.csv').then(function (newRouteData) {
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
        if (width < 900) {
          cities = cities.filter((d) => d.city === 'Bamako' || d.city === 'Tripoli');
        }
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
          } else {
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
        }, []);
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
            yPlotOffset: yPlotOffset,
            svg: svg,
            margin: margin,
            cities: cities,
            borders: borders,
            journeys: journeys,
            journey: journey,
            svgRef: svgRef,
            tooltipRef: tooltipRef,
            xScale: xScale,
            xDomain: xDomain,
            risks: risks,
            risksData: filteredData,
            migrantRoutesData: migrantRoutesData,
            updateRiskWeight,
            isOpen: isOpen,
          });
        } else {
          let data;
          let xScale = d3.scaleLinear().domain(xDomain).range(xRange);
          if (expandedData != null) {
            data = expandedData;
            let expandedXDomain = [data[0].distance, data[data.length - 1].distance];
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
            yPlotOffset: yPlotOffset,
            xDomain: xDomain,
            risks: risks,
            yLabel: yLabel,
            margin: margin,
            xScale: xScale,
            xRange: xRange,
            cities: cities,
            borders: borders,
            journeys: journeys,
            journey: journey,
            risksData: filteredData,
            migrantRoutesData: migrantRoutesData,
            updateIsExpanded: updateIsExpanded,
            isExpanded: isExpanded,
            isOpen: isOpen,
          });
        }

        setSvgLoaded(true);
      });
    });
  }

  const [roots, setRoots] = useState([]);

  useEffect(() => {
    if (!svgLoaded || !isOpen) {
      console.debug('Sliders: Set roots to empty array');
      setRoots([]);
      return;
    }

    // Make sure to unmount the old roots
    console.debug('Sliders: Recreating roots');
    roots.forEach((r) => {
      console.warn(r.root._internalRoot);
      r.root.unmount();
    });
    const newRoots = [];

    const svg = d3.select(svgRef.current);

    // Create the risk weight-related elements and push them to the roots array
    risks.forEach((risk) => {
      // console.log('Drawing', risk);
      const textLabel = svg
        .append('foreignObject')
        .attr('width', 200)
        .attr('height', 20)
        .attr('x', margin.left)
        .attr('y', margin.top + yPlotOffset * risk.index - 12)
        .style('z-index', 9999)
        .attr('pointer-events', 'none')
        .append('xhtml:div')
        .attr('xmlns', 'http://www.w3.org/1999/xhtml')
        .style('pointer-events', 'all')
        .node();
      newRoots.push({ type: 'label', root: createRoot(textLabel), riskId: risk.id });

      // Don't render sliders and the weight text boxes on small screens (not
      // enough room)
      if (width <= 480) {
        return;
      }

      const textInputElement = svg
        .append('foreignObject')
        .attr('width', 100)
        .attr('height', 100)
        .attr('x', margin.left + 475)
        .attr('y', margin.top + yPlotOffset * risk.index - 12)
        .style('z-index', 9999)
        .attr('pointer-events', 'none')
        .append('xhtml:div')
        .attr('xmlns', 'http://www.w3.org/1999/xhtml')
        .style('pointer-events', 'all')
        .node();

      newRoots.push({ type: 'text', root: createRoot(textInputElement), riskId: risk.id });

      const sliderElement = svg
        .append('foreignObject')
        .attr('width', 400)
        .attr('height', 25)
        .attr('x', margin.left + 190)
        .attr('y', margin.top + yPlotOffset * risk.index - 15)
        .style('z-index', 9999)
        .attr('pointer-events', 'none')
        .append('xhtml:div')
        .attr('xmlns', 'http://www.w3.org/1999/xhtml')
        .style('pointer-events', 'all')
        .node();

      newRoots.push({ type: 'slider', root: createRoot(sliderElement), riskId: risk.id });
    });
    // create text label for 'migrants along the route'
    const migrantsTextLabel = svg
      .append('foreignObject')
      .attr('width', 200)
      .attr('height', 20)
      .attr('x', margin.left)
      .attr('y', margin.top + yPlotOffset * 6 - 12)
      .style('z-index', 9999)
      .attr('pointer-events', 'none')
      .append('xhtml:div')
      .attr('xmlns', 'http://www.w3.org/1999/xhtml')
      .style('pointer-events', 'all')
      .node();
    newRoots.push({
      type: 'label-migrants',
      root: createRoot(migrantsTextLabel),
      riskId: routeMigrants.id,
    });

    setRoots(newRoots);
    console.debug('Sliders: created roots', newRoots);

    return () => {
      console.debug('Sliders: UNMOUNTING');
      roots.forEach((rootInfo) => {
        rootInfo.root.unmount();
      });
    };
  }, [svgLoaded]);

  //TODO: optimize re-rendering for d3 plots
  useEffect(() => {
    drawLayers(svgRef, width, height, isOpen);
  }, [dataTabHeight, height, svgRef, width, isOpen, journey, isExpanded]);

  /**
   * Render the sliders
   */
  useEffect(() => {
    // console.log('Rendering roots', roots);

    roots.forEach(({ type, root, riskId }) => {
      const riskInfo = risks.find((risk) => risk.id === riskId);
      if (root._internalRoot === null) {
        console.warn('Tried updating an unmounted root');
        return;
      }
      if (type === 'label') {
        root.render(
          <RiskLabel
            key={riskInfo.id}
            riskId={riskInfo.id}
            riskDescription={riskInfo.dataDescr}
            riskLabel={riskInfo.label}
          />
        );
      } else if (type === 'label-migrants') {
        root.render(
          <RiskLabel
            key={routeMigrants.id}
            riskId={routeMigrants.id}
            riskDescription={routeMigrants.dataDescr}
            riskLabel={routeMigrants.label}
          />
        );
      } else if (type === 'text') {
        root.render(
          <RiskWeightTextInput
            key={riskInfo.id}
            riskId={riskInfo.id}
            riskWeight={riskInfo.normWeight}
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

    // console.log('Done rendering');
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

    setWeightsConfirmed(false);
  };

  const componentRef = useRef(null);

  useEffect(() => {
    if (svgRef.current && componentRef.current) {
      const foreignObject = d3
        .select(svgRef.current)
        .append('foreignObject')
        .attr('x', 80)
        .attr('y', 50)
        .attr('width', 200)
        .attr('height', 100)
        .raise();

      foreignObject.append(() => componentRef.current);
    }
  }, [svgRef.current, componentRef.current]);

  useEffect(() => {
    setWeightsConfirmed(true);
  }, [isOpen]);

  return (
    <>
      {!weightsConfirmed && (
        <button
          className={styles.confirmWeights}
          style={{
            left: `${margin.left + 360}px`,
          }}
          onClick={() => {
            drawLayers(svgRef, width, height, isOpen);
            setWeightsConfirmed(true);
          }}
        >
          Confirm weight changes
        </button>
      )}
      <svg ref={svgRef}></svg>
    </>
  );
}
