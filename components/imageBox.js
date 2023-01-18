import TextBox from './card';
import styles from '../styles/ImageBox.module.css';
import useWindowSize from '../hooks/useWindowSize';
import Title from './title';
import { useState, useRef, useEffect } from 'react';

import DescriptionTab from './descriptionTab';
export default function ImageBox({ journey }) {
  const { width, height } = useWindowSize();
  useEffect(() => {
    console.log(journey.body);
  }, [journey]);
  const ref = useRef(null);

  const textBoxItems = journey.popUps.map((popUp) => (
    <TextBox
      key={popUp.id}
      posX={popUp.posX}
      posY={popUp.posY}
      text={popUp.body}
    />
  ));
  const scrollToCoordinate = (posX, posY) => {
    ref.current.scrollLeft = posX;
  };
  return (
    <>
      <div className={styles.imageContainer} ref={ref}>
        <Title />
        {textBoxItems}
        <DescriptionTab title={journey.title} body={journey.body} />
        <img
          src={journey.imageUrl}
          height={height}
          object-fit="cover"
          object-position="right top"
          className={styles.image}
        />
      </div>
    </>
  );
}
