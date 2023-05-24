import { motion, AnimatePresence } from 'framer-motion';
import { Carousel } from 'react-bootstrap';
import styles from '../../styles/ImageCarousel.module.css';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { wrap } from 'framer-motion';

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
  return (
    <motion.div
      onClick={onClick}
      className={styles.backdrop}
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
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export const SlideShow = ({ images, currentIndex }: any) => {
  const [[page, direction], setPage] = useState([0, 0]);

  // We only have 3 images, but we paginate them absolutely (ie 1, 2, 3, 4, 5...) and
  // then wrap that within 0-2 to find our image ID in the array below. By passing an
  // absolute page index as the `motion` component's `key` prop, `AnimatePresence` will
  // detect it as an entirely new image. So you can infinitely paginate as few as 1 images.
  const imageIndex = wrap(0, images.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div className={styles['example-container']}>
      <AnimatePresence initial={false} custom={direction}>
        <div className={styles.imgContainer}>
          <motion.img
            key={page}
            src={images[(imageIndex + currentIndex) % images.length]}
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
              <div><h4>Scene Name</h4></div>
              <div>Location: City, Country</div>
            </div>
            

            <div>
              <div>
                <p>{`A truck joins a convoy with armed military escort as it begins crossing the Sahara Desert from Niger north to Libya, overloaded with Nigerien workers and families destined for work in mines, on October 8, 2018 in Agadez, Niger. Aside from civilian convoys, National Guard patrols hunt armed Islamists in this Sahel region half the size of Texas. In a bid to stem irregular migration from Africa to Europe, the EU is spending $270 million on an "Emergency Trust Fund" for programs in Niger, part of a security-development package that has seen the number of migrants heading north drop from 334,000 in 2016 to fewer than 50,000 in 2018.`}</p>
              </div>
              
              <div className={styles.h7}>Credit:</div>

              <div className={styles.h7}>Date:</div>
              
              <div>
                <span>
                Image {((imageIndex + currentIndex) % images.length) + 1}/ {images.length}
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </AnimatePresence>
      <div className={styles.next} onClick={() => paginate(1)}>
        <span className="material-symbols-outlined">navigate_next</span>
      </div>
      <div className={styles.prev} onClick={() => paginate(-1)}>
        <span className="material-symbols-outlined">navigate_before</span>
      </div>
    </div>
  );
};

export default ImageModal;
