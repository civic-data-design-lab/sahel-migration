import Card from './card';
import styles from '../../styles/ImageBox.module.css';
import useWindowSize from '../../hooks/useWindowSize';
import Title from '../title';
import { useState, useRef, useEffect } from 'react';
import DescriptionTab from './transect/descriptionTab';
import * as d3 from 'd3';
import { motion, useScroll, useTransform } from 'framer-motion';
import PolicyRecommendations from './policyRecommendations';
import ScrollButton from "./transect/scrollButton";

function useParallax(value, distance) {
  return useTransform(value, [0, 1], [0, distance]);
}

export default function ImageBox({ journey }) {
  const { width, height } = useWindowSize();
  const ref = useRef(null);
  const svgRef = useRef(null);
  const { scrollXProgress } = useScroll({ target: svgRef });

  useEffect(() => {}, []);
  const entourages = journey.entourages.map((entourage) => (
    <Card
      entourage={entourage}
      key={entourage.id}
      svgRef={svgRef}
      scrollXProgress={scrollXProgress}
      width={width}
      height={height}
    />
  ));

  return (
    <div style={{height:"100vh"}}>
      <ScrollButton width={width}/>
      <div className="box" ref={ref}>
        <DescriptionTab title={journey.title} body={journey.body} scrollXProgress={scrollXProgress} entourages={journey.entourages} width={width}/>
        <object
          type="image/svg+xml"
          data={journey.imageUrl}
          style={{ position: 'relative', height: '100vh' }}
          ref={svgRef}
        ></object>
        {entourages}
      </div>

    </div>
  );
}
