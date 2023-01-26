import Card from './card';
import styles from '../styles/ImageBox.module.css';
import useWindowSize from '../hooks/useWindowSize';
import Title from './title';
import {useState, useRef, useEffect, useCallback} from 'react';
import DescriptionTab from './descriptionTab';
import * as d3 from "d3";
import {
  motion,
  useTransform,
} from "framer-motion";

function useParallax(value, distance) {
  return useTransform(value, [0, 1], [0, distance]);
}

export default function ImageBox({ journey }) {
  const [width,setWidth] = useState(null)
  const [height,setHeight] = useState(null)
  const getWindowSize = useCallback(()=>useWindowSize,[])
  const isSSR = typeof window == "undefined";
  // const { width, height } = useWindowSize();
  const ref = useRef(null);
  const svgRef = useRef(null);
  function changeWindowSize() {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }
  const [windowSize, setWindowSize] = useState({
    width: isSSR ? 1200 : window.innerWidth,
    height: isSSR ? 800 : window.innerHeight,
  });
  useEffect(() => {
    // console.log(journey.body);
    // const {w,h} = getWindowSize()
    // console.log(w)
    window.addEventListener("resize", changeWindowSize);

  }, [windowSize, journey]);
  // const entourages =
  const scrollToCoordinate = (posX, posY) => {
    ref.current.scrollLeft = posX;
  };
  return (
    <>
      <motion.div className="box" ref={ref} styles={{position: 'relative'}}>
        <Title />
        <DescriptionTab title={journey.title} body={journey.body} />
        <object
          type="image/svg+xml"
          data={journey.imageUrl}
          style={{ position: 'relative', height: windowSize.height }}
          // className={styles.image}
          ref={svgRef}
        >
        </object>
        {journey.entourages.map((entourage) => (
          <Card
            entourage={entourage}
            key={entourage.id}
            svgRef={svgRef}
            scrollRef={ref}
            width={windowSize.width}
            height={windowSize.height}
          />

        ))}
      </motion.div>
    </>
  );
}
