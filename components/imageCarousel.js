import styles from '../styles/ImageCarousel.module.css'

import { animated, useSpring, motion, AnimatePresence } from "framer-motion";
import { useState } from 'react';
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid'
import ImageModal from './imageModal';

const fetcher = (url) => fetch(url).then((res) => res.json());


export default function ImageCarousel({ isOpen }) {
    const images = [1, 2, 3, 4, 5]
    const [modalOpen, setModalOpen] = useState(false)
    const [currentImageIndex, setIndex] = useState(0)
    const { data: riskItems, error: risksError } = useSWR('/api/map/risksdata', fetcher)

    const closeModal = () => setModalOpen(false);
    const openModal = (i) => {
        setIndex(i)
        setModalOpen(true)
    };


    if (risksError) return <div>Images not found</div>;
    if (!riskItems) return <div>loading...</div>;

    return (
        <>
            {isOpen && (
                <div className={styles.carousel}>
                    {
                        riskItems.transectRisks[6].imageUrls.map((url, i) => {
                            const img = new Image()
                            img.src = url
                            const height = Math.round(img.naturalHeight / 500)
                            const width = Math.round(img.naturalWidth / 500)
                            console.log(width, height)
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
                                        }
                                    }}
                                    transition={{
                                        ease: 'easeInOut'
                                    }}
                                    className={styles.image}
                                    key={uuidv4()}
                                >
                                    <img src={url}></img>
                                </motion.div>

                            )
                        })
                    }
                    <AnimatePresence
                        initial={false}
                        mode='wait'
                        onExitComplete={() => null}
                        currentIndex
                    >
                        {modalOpen &&
                            <ImageModal
                                currentIndex={currentImageIndex}
                                modalOpen={modalOpen}
                                handleClose={closeModal}
                                images={riskItems.transectRisks[6].imageUrls}
                            />
                        }
                    </AnimatePresence>
                </div>
            )
            }
        </>

    )
}


