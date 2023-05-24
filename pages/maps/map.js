import { useRef, useState, createContext, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/Map.module.css'
import useWindowSize from '../../hooks/useWindowSize'
import useSWR from 'swr'
import MapBox from "../../components/map/mapBox";
import ContentBox from "../../components/map/contentBox";
import Title from "../../components/title";
import { animated, useSpring } from "react-spring";
import Menu from "../../components/menu";
import MapJourney from "../../components/map/mapJouney";
import MapLegend from '../../components/map/mapLegend'
import { SectionContext } from '..';
import Link from 'next/link';


import ScrollIndicator from '../../components/scrollIndicator';

const mapFetcher = (url) => fetch(url).then((res) => res.json());
export const ViewContext = createContext({
    currentView: 'overallRoutes',
    setCurrentView: () => { },
});

export default function MainMap() {
    const { width } = useWindowSize();
    const sideBarRef = useRef(null);
    const [currentView, setCurrentView] = useState('overallRoutes');
    const viewValue = { currentView, setCurrentView };

    const [routeClicked, setRoute] = useState(false);
    const { data: riskItems, error: risksError } = useSWR('/api/map/risksdata', mapFetcher);
    const { data: cities, error: citiesError } = useSWR('/api/map/citydata', mapFetcher);
    const { currentSection, setSection } = useContext(SectionContext)


    const isActive = currentView === 'selectRoute' ? true : false;

    const exploreRoutes = useSpring({
        opacity: routeClicked ? 0 : 1,
        zIndex: routeClicked ? 0 : 1,
        marginBottom: isActive && width < 480 ? '0rem' : '0',
    });

    const hideMapBox = useSpring({
        opacity: routeClicked ? 0 : 1
    })

    const revealJourney = useSpring({
        zIndex: routeClicked ? 3 : -1,
    });

    function toggleMap() {
        setRoute(!routeClicked);
        setSection(null)
    }

    // console.log(sectionValue)

    if (risksError) return <div>Map not found</div>;
    if (!riskItems) return <div>loading...</div>;

    if (citiesError) return <div>Map not found</div>;
    if (!cities) return <div>loading...</div>;

    return (
        <ViewContext.Provider value={viewValue}>
            <div
                className={styles.gridContainer}
                data-color={routeClicked ? 'dark' : 'light'}
            >
                <div
                    style={{
                        gridArea: '1/1/1/4',
                    }}
                >
                    <Title />
                </div>
                <div className={styles.boxContainer}>
                    {!routeClicked && (
                        <div className={styles.contentBox} ref={sideBarRef}>
                            <ContentBox scrollRef={sideBarRef} dataItems={riskItems.risks} />
                        </div>
                    )}
                    {routeClicked && (
                        <>
                            <div className={styles.exploreBox}>
                                <h2 className='header-3'>
                                Click to explore the experience of migrants on the move from Bamako, Mali to Tripoli, Libya →
                                    
                            
                                    {/* <span class="material-symbols-outlined">
                                        trending_flat
                                    </span> */}
                                    
                                </h2>
                            </div>
                        </>
                    )}
                </div>
                <div className={styles.mapContainer}>
                    <animated.div style={exploreRoutes} className={styles.mapHolder}>
                        <MapBox activeSource={currentView} risks={riskItems} tipData={cities} toggleMap={toggleMap} />
                    </animated.div>
                </div>
                <MapLegend activeSource={currentView} />
                <ScrollIndicator />
            </div>
            {
                routeClicked && (

                    <MapJourney
                        explorable={routeClicked}
                        style={revealJourney}
                    />
                )

            }
        </ViewContext.Provider>
    );
}
