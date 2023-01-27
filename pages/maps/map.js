
import { useRef, useState, createContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/Map.module.css'
import useWindowSize from '../../hooks/useWindowSize'
import useSWR from 'swr'
import MapBox from "../../components/mapBox";
import ContentBox from "../../components/contentBox";
import Title from "../../components/title";

const fetcher = (url) => fetch(url).then((res) => res.json());
export const ViewContext = createContext({
    currentView: 'route',
    setCurrentView: (() => { })
})


export default function MainMap() {
    const { width } = useWindowSize()
    const sideBarRef = useRef(null)
    const [currentView, setCurrentView] = useState('route')
    const viewValue = { currentView, setCurrentView }

    const { data: countries, countryError } = useSWR('/api/map/countrydata', fetcher)
    const { data: cities, error: cityError } = useSWR('/api/map/cities', fetcher)

    const { data: landRoutes, error: routeError } = useSWR('/api/map/landRoute', fetcher)
    const { data: riskItems, error: risksError } = useSWR('/api/map/risksdata', fetcher)

    if (countryError || cityError || routeError || risksError) return <div>Journey not found</div>;
    if (!countries || !cities || !landRoutes || !riskItems) return <div>loading...</div>;

    return (

        <ViewContext.Provider value={viewValue}>
            <Title />
            <div className={styles.container}>
                <div className={styles.sidebar} ref={sideBarRef}>
                    <ContentBox scrollRef={sideBarRef} narratives={riskItems.risks} />
                </div>
            </div>
            <div className={styles.mapContainer}>
                <MapBox
                    countryData={countries}
                    cityData={cities}
                    routeData={landRoutes}
                    activeSource={currentView}
                    risks={riskItems}
                />
            </div>
        </ViewContext.Provider>



    )
}