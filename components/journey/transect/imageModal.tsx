import { motion, AnimatePresence } from 'framer-motion';
import { Carousel } from 'react-bootstrap';
import styles from '../../../styles/ImageCarousel.module.css';
import { v4 as uuidv4 } from 'uuid';
import imageMetadata from '../../../json/image-metadata.json';
import { useMemo, useState } from 'react';
import { wrap } from 'framer-motion';
import useWindowSize from '../../../hooks/useWindowSize';

const dropIn = {
  hidden: {
    y: '-100vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
  },
};
const Backdrop = ({ children, onClick }) => {
  const { height } = useWindowSize()
  return (
    <motion.div
      onClick={onClick}
      className={styles.backdrop}
      style={{
        zIndex: 20
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

const ImageModal = ({ handleClose, images, currentIndex }) => {
  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className={styles.modal}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <SlideShow images={images} currentIndex={currentIndex} />
      </motion.div>
      <button className={styles.exit} onClick={handleClose}>
        <span className="material-symbols-outlined">close</span>
      </button>
    </Backdrop>
  );
};

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 1000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export const SlideShow = ({ images, currentIndex }: any) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const { width } = useWindowSize()

  // We only have 3 images, but we paginate them absolutely (ie 1, 2, 3, 4, 5...) and
  // then wrap that within 0-2 to find our image ID in the array below. By passing an
  // absolute page index as the `motion` component's `key` prop, `AnimatePresence` will
  // detect it as an entirely new image. So you can infinitely paginate as few as 1 images.
  const imageIndex = wrap(0, images.length, page);
  const imageSrc = useMemo(() => images[(imageIndex + currentIndex) % images.length], [imageIndex]);
  const imageMeta = useMemo(() => {
    const imgSrcName = imageSrc.split('/').at(-1);
    return imageMetadata.find((meta) => meta.img_src === imgSrcName);
  }, [imageSrc]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };
  let currentImageNumber = ((imageIndex + currentIndex) % images.length) + 1
  const totalImageNumber = images.length

  const nextButton = (className) =>
    <div className={styles[className]} onClick={() => paginate(1)}>
      <span className="material-symbols-outlined">navigate_next</span>
    </div>
  const prevButton = (className) =>
    <div className={styles[className]} onClick={() => paginate(-1)}>
      <span className="material-symbols-outlined">navigate_before</span>
    </div>

  const desktopImageCounter =
    <div className={styles.counter}>
      <span className={styles.counterCaption}>Image {currentImageNumber} / {totalImageNumber}</span>
    </div>
  const mobileImageCounter =
    <div className={styles.mobileCounter}>
      {prevButton("prevMobile")}
      <span className={styles.counterCaption}> {currentImageNumber} of {totalImageNumber}</span>
      {nextButton("nextMobile")}
    </div>

  return (
    <div className={styles['example-container']}>
      <AnimatePresence initial={false} custom={direction}>
        <div className={styles.imgContainer}>
          <motion.img
            key={page}
            src={imageSrc}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
          />
          <div className={styles.caption}>
            <div>
              <div>
                <h4>{imageMeta.scene}</h4>
              </div>
              <div>
                <h5>Location: {imageMeta.img_location}</h5>
              </div>
            </div>

            <div>
              <div>
                <p>{imageMeta.img_caption}</p>
              </div>

              <div className={styles.h7}>Credit: {imageMeta.img_credit}</div>

              <div className={styles.h7}>Date: {imageMeta.img_date}</div>

              <div>
                {width > 700 && (
                  desktopImageCounter
                )}
                {width <= 700 && (
                  mobileImageCounter
                )}
              </div>
            </div>
          </div>
        </div>
      </AnimatePresence>
      {width > 700 && (
        nextButton("next")
      )}
      {width > 700 && (
        prevButton("prev")
      )}
    </div>
  );
};

export default ImageModal;
