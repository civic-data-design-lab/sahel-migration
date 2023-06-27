import styles from '../../../styles/ImageCarousel.module.css';

import { useSpring, motion, AnimatePresence } from 'framer-motion';
import { useContext, useState } from 'react';
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid';
import ImageModal from './imageModal';
import ImageFilter from 'react-image-filter';
import { ImagesContext } from '../../../pages/journeys/[id]'

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ImageCarousel({ isOpen }) {
  const { modalOpen, setModalOpen, currentImageIndex, setImageIndex } = useContext(ImagesContext)
  // const [modalOpen, setModalOpen] = useState(false);
  // const [currentImageIndex, setIndex] = useState(0);
  const { data: photos, error: photosError } = useSWR('/api/journeys/photosdata', fetcher);


  const closeModal = () => setModalOpen(false);
  const openModal = (i) => {
    setImageIndex(i);
    setModalOpen(true);
  };

  if (photosError) return <div>Images not found</div>;
  if (!photos) return <div>loading...</div>;
  if (!isOpen) return <></>;

  return (
    <div>
      <p className={styles.labelPhotos}>Photos</p>
      <div className={styles.carousel}>
        {photos.map((url, i) => {
          return (
            <motion.div
              layout
              onClick={() => (modalOpen ? closeModal() : openModal(i))}
              whileHover={{
                // aspectRatio: `${width}/${height}`,
                transition: {
                  type: 'spring',
                  stiffness: 37.5,
                  duration: 0.75,
                },
                // ['--color' as any]: `none`,
                ['--opacity' as any]: 0,
              }}
              transition={{
                ease: 'easeInOut',
              }}
              className={styles.image}
              key={uuidv4()}
              style={{
                width: `1.25rem`,
                ['--opacity' as any]: 1,
              }}
            >
              <ImageFilter
                image={url}
                filter={'duotone'}
                preserveAspectRatio="cover"
                // colorOne={[93, 53, 53]}
                colorOne={[116, 70, 63]}
                colorTwo={[247, 245, 239]}
              />
            </motion.div>
          );
        })}
        {/* <AnimatePresence
          initial={false}
          mode="wait"
          onExitComplete={() => null}
        // currentIndex
        >
          {modalOpen && (
            <ImageModal
              currentIndex={currentImageIndex}
              // modalOpen={modalOpen}
              handleClose={closeModal}
              images={photos}
            />
          )}
        </AnimatePresence> */}
      </div>
    </div>
  );
}
