import Card from './card';
import styles from '../../styles/ImageBox.module.css';
import useWindowSize from '../../hooks/useWindowSize';
import Title from '../title';
import { useState, useRef, useEffect } from 'react';
import DescriptionTab from '../map/descriptionTab';
import * as d3 from 'd3';
import { motion, useTransform } from 'framer-motion';
import PolicyRecommendations from "./policyRecommendations";

function useParallax(value, distance) {
  return useTransform(value, [0, 1], [0, distance]);
}

export default function ImageBox({ journey }) {
  const { width, height } = useWindowSize();
  const ref = useRef(null);
  const svgRef = useRef(null);
  useEffect(() => {}, []);
  const entourages = journey.entourages.map((entourage) => (
    <Card
      entourage={entourage}
      key={entourage.id}
      svgRef={svgRef}
      scrollRef={ref}
      width={width}
      height={height}
    />
  ));
  const scrollToCoordinate = (posX, posY) => {
    ref.current.scrollLeft = posX;
  };
  return (
    <>
      <motion.div className="box" ref={ref} styles={{ position: 'relative' }}>
        {journey.id === 8?
          <PolicyRecommendations narrativeTexts={journey.narrativeTexts}/> :
          <DescriptionTab title={journey.title} body={journey.body} />}
        <object
          type="image/svg+xml"
          data={journey.imageUrl}
          style={{ position: 'relative', height: height }}
          // className={styles.image}
          ref={svgRef}
        ></object>
        {entourages}
      </motion.div>
    </>
  );
}
