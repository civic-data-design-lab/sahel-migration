import { useRef, useState, createContext, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/Map.module.css'
import useWindowSize from '../../hooks/useWindowSize'
import useSWR from 'swr'

import MapBox from "../../components/map/mapBox";
import NarrativeTextBox from "../../components/map/narrativeTextBox";
import Title from "../../components/title";
import MapGlobe from '../../components/map/mapGlobe';
import MapLegend from '../../components/map/mapLegend'
import { SectionContext } from '..';
import { motion } from 'framer-motion';
import { useScroll } from 'framer-motion';
import Stepper from '../../components/stepper';
import ProgressBar from '../../components/progressBar'


const mapFetcher = (url) => fetch(url).then((res) => res.json());
export const ViewContext = createContext({
    currentView: 'overallRoutes',
    setCurrentView: () => { },
});

function disablePointerEvents(container) {
    if (container) {
        container.style.pointerEvents = 'none'
    }
}
function enablePointerEvents(container) {
    if (container) {
        container.style.pointerEvents = 'all'
    }
}


export default function MainMap({ journeys }) {
    const { width } = useWindowSize();
    const sideBarRef = useRef(null);
    const boxRef = useRef(null);
    const [currentView, setCurrentView] = useState('overallRoutes');
    const viewValue = { currentView, setCurrentView };

    const [globeVisibility, setVisibility] = useState(true);
    const { data: narrativeItems, error: narrativeError } = useSWR('/api/map/narrativedata', mapFetcher);
    const { data: cities, error: citiesError } = useSWR('/api/map/citydata', mapFetcher);
    const { currentSection, setSection } = useContext(SectionContext)
    const { scrollYProgress, scrollY } = useScroll({
        container: sideBarRef
    })
    function toggleMap() {
        setVisibility(true);
        setSection(null)
    }

    useEffect(() => {
        if (currentView === "globeView") toggleMap()
        else setVisibility(false)
        if (currentView === "vignetteTransition") window.location.href = '/journeys/beginning-journey'

    }, [currentView])

    useEffect(() => {
        if (width > 480) {
            window.addEventListener('wheel', (event) => {
                enablePointerEvents(boxRef.current)
            })
            window.addEventListener('mousewheel', (event) => {
                enablePointerEvents(boxRef.current)
            })
            if (boxRef.current) {
                window.addEventListener('mousemove', (event) => {
                    if (!globeVisibility && Math.abs(event.movementX) <= 0.5 && Math.abs(event.movementY) <= 0.5) { enablePointerEvents(boxRef.current) }
                    else disablePointerEvents(boxRef.current)
                })
                if (width < 600) {
                    window.addEventListener('click', (event) => {
                        disablePointerEvents(boxRef.current)
                    })
                }
            }
        }
    })




    if (narrativeError) return <div>Map not found</div>;
    if (!narrativeItems) return <div>loading...</div>;

    if (citiesError) return <div>Cities not found</div>;
    if (!cities) return <div>loading...</div>;

    return (
        <ViewContext.Provider value={viewValue}>
            <div
                className={styles.gridContainer}
                data-color={globeVisibility ? 'dark' : 'light'}
            >
                <div
                    style={{
                        gridArea: '1/1/1/4',
                    }}
                >
                    <Title />
                </div>
                <ProgressBar
                    narratives={narrativeItems.narratives}
                    currenNarrativeSection={currentView}

                />
                <div
                    className={styles.boxContainer}
                    ref={boxRef}
                >

                    <div className={styles.contentBox} ref={sideBarRef}>
                        <NarrativeTextBox
                            scrollRef={sideBarRef}
                            dataItems={narrativeItems.narratives}
                            journeys={journeys}
                        />
                    </div>

                </div>
                <div className={styles.mapContainer}>
                    <motion.div
                        style={{
                            opacity: 1
                        }}
                        animate={{
                            opacity: globeVisibility ? 0 : 1
                        }}
                        className={styles.mapHolder}>
                        <MapBox
                            activeSource={currentView}
                            narrativeData={narrativeItems}
                            cityData={cities}
                            toggleMap={toggleMap}
                        />
                    </motion.div>
                </div>
                <MapLegend activeSource={currentView} />
            </div>
            {globeVisibility && (
                <motion.div
                    style={{
                        opacity: 0
                    }}
                    animate={{
                        opacity: 1
                    }}
                    transition={{
                        type: 'tween',
                        delay: 1,
                        duration: 2
                    }}
                >
                    <MapGlobe
                        journeys={journeys}
                        globeVisibility={globeVisibility}
                        scrollProgress={scrollYProgress.current}
                    />
                </motion.div>
            )}
        </ViewContext.Provider>
    );
}
