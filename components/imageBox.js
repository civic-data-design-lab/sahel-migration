import TextBox from './card';
import styles from '../styles/ImageBox.module.css';
import useWindowSize from '../hooks/useWindowSize';
import Title from './title';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import DescriptionTab from './descriptionTab';
import Entourage from "./entourage";
import * as d3 from "d3";
export default function ImageBox({ journey }) {
  const { width, height } = useWindowSize();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const svgRef = useRef(null);
  useEffect(() => {
    // console.log(journey.body);


  }, [journey]);
  const entourages = journey.entourages.map((entourage) => (
    <>
      <TextBox
        entourage={entourage}
        key={entourage.id}
        svgRef={svgRef}
        isOpen={isOpen}
      />

    </>
  ));
  const scrollToCoordinate = (posX, posY) => {
    ref.current.scrollLeft = posX;
  };
  return (
    <>
      <div ref={ref}>
        <Title />
        <DescriptionTab title={journey.title} body={journey.body} />
        <object
          type="image/svg+xml"
          data={journey.imageUrl}
          style={{ position: 'absolute', height: height }}
          // className={styles.image}
          ref={svgRef}
        ></object>
        {entourages}
      </div>
    </>
  );
}
