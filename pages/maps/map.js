import { useRef, useState, createContext } from 'react';
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

    const isActive = currentView === 'selectRoute' ? true : false;

    const exploreRoutes = useSpring({
        opacity: routeClicked ? 0 : 1,
        zIndex: routeClicked ? 0 : 1,
        marginBottom: isActive && width < 480 ? '0rem' : '0',
    });

    const revealJourney = useSpring({
        zIndex: routeClicked ? 3 : -1,
    });

    function hideMap() {
        setRoute(!routeClicked);
    }

    // console.log(sectionValue)

    if (risksError) return <div>Map not found</div>;
    if (!riskItems) return <div>loading...</div>;

    return (
        <ViewContext.Provider value={viewValue}>
            <div className={styles.gridContainer}>
                <div
                    style={{
                        gridArea: '1/1/1/4',
                    }}
                >
                    <Title />
                </div>
                <div className={styles.boxContainer}>
                    <div className={styles.contentBox} ref={sideBarRef}>
                        <ContentBox scrollRef={sideBarRef} dataItems={riskItems.risks} mapToggle={hideMap} />
                    </div>
                </div>
                <div className={styles.mapContainer}>
                    <animated.div style={exploreRoutes} className={styles.mapHolder}>
                        <MapBox activeSource={currentView} risks={riskItems} />
                    </animated.div>
                </div>
                <MapLegend activeSource={currentView} />
                <ScrollIndicator />
            </div>
            {/* <MapJourney
                explorable={routeClicked}
                style={revealJourney}
            /> */}
        </ViewContext.Provider>
    );
}
