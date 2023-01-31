
import { useRef, useState, createContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/Map.module.css'
import useWindowSize from '../../hooks/useWindowSize'
import useSWR from 'swr'
import MapBox from "../../components/mapBox";
import ContentBox from "../../components/contentBox";
import Title from "../../components/title";
import DataTab from "../../components/dataTab";

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

    if (risksError) return <div>Journey not found</div>;
    if (!riskItems) return <div>loading...</div>;

    return (

        <ViewContext.Provider value={viewValue}>
            <Title />
            <div className={styles.container}>
                <div className={styles.sidebar} ref={sideBarRef}>
                    <ContentBox scrollRef={sideBarRef} dataItems={riskItems.risks} />
                </div>
            </div>
            <div className={styles.mapContainer}>
                <MapBox
                    activeSource={currentView}
                    risks={riskItems}
                />
            </div>
            {/* <DataTab /> */}
        </ViewContext.Provider>



    )
}