import TextBox from './card';
import styles from '../styles/ImageBox.module.css';
import useWindowSize from '../hooks/useWindowSize';
export default function ImageBox({ journey }) {
  const { width, height } = useWindowSize();
  return (
    <>
      <div className={styles.imageContainer}>
        <TextBox posX={1000} posY={100} text={journey.body} />
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
