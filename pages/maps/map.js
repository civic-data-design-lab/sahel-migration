import { useRef, useState, createContext, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/Map.module.css'
import useWindowSize from '../../hooks/useWindowSize'
import useSWR from 'swr'
import MapBox from "../../components/map/mapBox";
import ContentBox from "../../components/map/contentBox";
import Title from "../../components/title";
import { animated, useSpring } from "react-spring";
import MapJourney from "../../components/map/mapJouney";
import MapLegend from '../../components/map/mapLegend'
import { SectionContext } from '..';


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
        setRoute(true);
        setSection(null)
    }

    useEffect(() => {
        if (currentView === "globeView") toggleMap()
        else setRoute(false)

    }, [currentView])

    useEffect(() => {
        if (width > 800) {
            window.addEventListener('wheel', (event) => {
                if (Math.abs(event.deltaY) > 0) enablePointerEvents(boxRef.current)
            })
            window.addEventListener('scroll', (event) => {
                if (Math.abs(event.deltaY) > 0) enablePointerEvents(boxRef.current)
            })
            if (boxRef.current) {
                boxRef.current.addEventListener('mousemove', () => disablePointerEvents(boxRef.current))
            }
        }
    })




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
                <div
                    className={styles.boxContainer}
                    ref={boxRef}
                >
                    {true && (
                        <div className={styles.contentBox} ref={sideBarRef}>
                            <ContentBox
                                scrollRef={sideBarRef}
                                dataItems={riskItems.risks}
                                toggleMap={toggleMap}
                            />
                        </div>
                    )}
                    {false && (
                        <>
                            <div className={styles.exploreBox}>
                                <a href={'/journeys/2'}
                                >
                                    Click to explore the experience of migrants on the move from Bamako, Mali to Tripoli, Libya →
                                </a>
                            </div>
                        </>
                    )}
                </div>
                <div className={styles.mapContainer}>
                    <animated.div style={exploreRoutes} className={styles.mapHolder}>
                        <MapBox
                            activeSource={currentView}
                            risks={riskItems}
                            cityData={cities}
                            toggleMap={toggleMap}
                        />
                    </animated.div>
                </div>
                <MapLegend activeSource={currentView} />
            </div>
            {routeClicked && (

                <MapJourney
                    style={revealJourney}
                    journeys={journeys}
                />
            )}
        </ViewContext.Provider>
    );
}
