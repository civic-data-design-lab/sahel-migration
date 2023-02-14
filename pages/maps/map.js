
import { useRef, useState, createContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/Map.module.css'
import useWindowSize from '../../hooks/useWindowSize'
import useSWR from 'swr'
import MapBox from "../../components/mapBox";
import ContentBox from "../../components/contentBox";
import Title from "../../components/title";
import { animated, useSpring } from "react-spring";
import Menu from "../../components/menu";


const fetcher = (url) => fetch(url).then((res) => res.json());
export const ViewContext = createContext({
    currentView: 'overallRoutes',
    setCurrentView: (() => { })
})

export default function MainMap() {
    const { width } = useWindowSize()
    const sideBarRef = useRef(null)
    const [currentView, setCurrentView] = useState('overallRoutes')
    const viewValue = { currentView, setCurrentView }

    const { data: riskItems, error: risksError } = useSWR('/api/map/risksdata', fetcher)

    const isActive = currentView === 'selectRoute' ? true : false

    const exploreRoutes = useSpring({
        marginBottom: (isActive && width < 480) ? '0rem' : '0'
    });

    if (risksError) return <div>Journey not found</div>;
    if (!riskItems) return <div>loading...</div>;

    return (

        <ViewContext.Provider value={viewValue}>
            <Title />
            <div className={styles.boxContainer}>
                <div className={styles.contentBox} ref={sideBarRef}>
                    <ContentBox scrollRef={sideBarRef} dataItems={riskItems.risks} />
                </div>
            </div>
            <div className={styles.mapContainer}>
                <animated.div style={exploreRoutes} className={styles.mapHolder}>
                    <MapBox
                        activeSource={currentView}
                        risks={riskItems}
                    />
                </animated.div>
            </div>
        </ViewContext.Provider>



    )
}