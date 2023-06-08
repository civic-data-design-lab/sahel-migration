import Card from './card';
import styles from '../../styles/ImageBox.module.css';
import useWindowSize from '../../hooks/useWindowSize';
import Title from '../title';
import { useState, useRef, useEffect } from 'react';
import DescriptionTab from '../map/descriptionTab';
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
  const { scrollXProgress } = useScroll({ target: ref });
  const svgRef = useRef(null);
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
    <>
      {/*<ScrollButton isForward={false} updateScrollPosition={updateScrollPosition} isAtBeginning={isAtBeginning} isAtEnd={isAtEnd}/>*/}
      {/*<ScrollButton isForward={true} updateScrollPosition={updateScrollPosition} isAtBeginning={isAtBeginning} isAtEnd={isAtEnd}/>*/}
      <motion.div className="box" ref={ref}>
        {/* {journey.id === 8 ? (
          <PolicyRecommendations narrativeTexts={journey.narrativeTexts} />
        ) : ( */}
          <DescriptionTab title={journey.title} body={journey.body} />
        {/* )} */}
        <object
          type="image/svg+xml"
          data={journey.imageUrl}
          style={{ position: 'relative', height: height }}
          ref={svgRef}
        ></object>
        {entourages}
      </motion.div>

    </>
  );
}
