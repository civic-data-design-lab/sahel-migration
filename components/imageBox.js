import TextBox from './card';
import styles from '../styles/ImageBox.module.css';
import useWindowSize from '../hooks/useWindowSize';
import Title from './title';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import DescriptionTab from './descriptionTab';
import Entourage from "./entourage";
import * as d3 from "d3";
import Entourages from "./entourages";
export default function ImageBox({ journey }) {
  const { width, height } = useWindowSize();

  const ref = useRef(null);
  const svgRef = useRef(null);
  useEffect(() => {
    // console.log(journey.body);
    const svg = d3.select(svgRef.current);
    // journey.entourages.forEach((entourage,i) => {
    //   d3.xml(entourage.element)
    //     .then(data => {
    //       const g = svg.append("g")
    //         .attr("transform",`translate(0, ${i*500})`)
    //         .html(data.documentElement.innerHTML);
    //
    //       g.selectAll("*")
    //         .on("mouseover", function () {
    //           d3.select(this)
    //             .style("opacity", 0.5);
    //         })
    //         .on("mouseout", function () {
    //           d3.select(this)
    //             .style("fill", "white")
    //             .style("opacity", 1);
    //         });
    //     });
    // });

  }, [journey]);
  const entourages = journey.entourages.map((entourage) => (
    <>
      <TextBox
        key={entourage.id}
        posX={entourage.posX}
        posY={entourage.posY}
        text={entourage.body}
      />
      {/* <motion.div whileHover={{ scale: 1.2 }}> */}
      {/*<object*/}
      {/*  type="image/svg+xml"*/}
      {/*  data={entourage.element}*/}
      {/*  style={{ position: 'absolute', height: height }}*/}
      {/*></object>*/}
      <Entourage entourage={entourage} width={width} height={height}/>
      {/* </motion.div> */}

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
        ></object>
        {entourages}
        {/*<div>*/}
        {/*  <svg ref={svgRef} />*/}
        {/*</div>*/}
        {/*<svg id="svg"> </svg>*/}
        {/*<Entourages svgFiles={journey.entourages}/>*/}
      </div>
    </>
  );
}
