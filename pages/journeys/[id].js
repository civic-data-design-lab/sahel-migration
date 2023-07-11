import { useRouter, withRouter } from 'next/router';
import useSWR from 'swr';
import Menu from '../../components/menu';
import DataTab from '../../components/journey/transect/dataTab';
import React, { useState, useRef, useEffect, createContext } from 'react';
import styles from '../../styles/Journeys.module.css';

import ImageBox from '../../components/journey/imageBox';
import { AnimatePresence } from 'framer-motion';
import ImageModal from '../../components/journey/transect/imageModal';
import { fetcher } from '../../hooks/useFetch';
import Navigation from '../../components/navigation';
import Title from '../../components/title';
import Link from "next/link";

export const ImagesContext = createContext({
  modalOpen: false,
  setModalOpen: (photo) => { },
  currentImageIndex: 0,
  setImageIndex: (index) => { }
})
const photosFetcher = (url) => fetch(url).then((res) => res.json());


export default function JourneysPage() {
  const router = useRouter();
  const _id = router.query.id;
  const { data: journeys, errorJourneys } = useSWR(['/api/journeys/journeysdata', 'all'], fetcher);
  const { data: journey, errorJourney } = useSWR(['/api/journeys/journeysdata', _id], fetcher);

  const { data: photos, errorPhotos } = useSWR('/api/journeys/photosdata', photosFetcher);

  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = () => setModalOpen(false);
  const [currentImageIndex, setImageIndex] = useState(0);
  const imagesContextValue = { modalOpen, setModalOpen, currentImageIndex, setImageIndex }




  if (errorJourneys) return <div>Journeys not found</div>;
  if (errorJourney) return <div>Journey not found</div>;
  if (!journeys) return <div>loading...</div>;
  if (!journey) return <div>loading...</div>;

  if (errorPhotos) return <div>Images not found</div>;
  if (!photos) return <div>loading...</div>;

  return (
    <div style={{height:'100vh'}}>
      <div id="journey" className={styles.journeyContainer}>
        <div className={styles.gridContainer}>
          <Title journey={journey}/>
          <Link  title="Go to Map" style={{color:" #463c35", textDecoration: "none"}} href="/">
          <div className={styles.mapNavigation}>
            <span className="material-symbols-outlined">
              public
          </span>
          </div>
          </Link>
          <Menu journeys={journeys} journey={journey}/>
          <Navigation journeys={journeys} journey={journey} />
          <ImagesContext.Provider value={imagesContextValue}>
            <DataTab journey={journey} />
          </ImagesContext.Provider>
          <ImageBox journey={journey} id="image-box" />
        </div>
        <div id="transectTooltip" className="transectTooltip hidden">
        </div>
      </div>
      <AnimatePresence
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
      </AnimatePresence>
    </div>
  );
}
