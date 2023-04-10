import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl';
import styles from '../styles/MapJourney.module.css'

mapboxgl.accessToken = 'pk.eyJ1IjoibWl0Y2l2aWNkYXRhIiwiYSI6ImNpbDQ0aGR0djN3MGl1bWtzaDZrajdzb28ifQ.quOF41LsLB5FdjnGLwbrrg';
export default function MapJourney({ explorable }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(3);
    const [lat, setLat] = useState(25);
    const [zoom, setZoom] = useState(3.65);
    const [canExplore, setExplore] = useState(false)
    // console.log(explorable, 'explore')
    useEffect(() => {
        setExplore(true)

        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mitcivicdata/cleyl4exm000v01l78g7wvad4',
            center: [lng, lat],
            zoom: zoom
        });
        map.current.setProjection('mercator')
        if (canExplore) {
            map.current.setProjection('globe')
            setTimeout(() => {
                map.current.flyTo({
                    center: [4, 30],
                    zoom: 4,
                    speed: 0.02,
                    curve: 1,
                    pitch: 60,
                    bearing: -60,
                    easing(t) {
                        return t;
                    }
                })
            }, 7000)
        }
    }, [canExplore]);

    return (
        <div className={styles.container}>
            <div ref={mapContainer} className={styles.mapContainer} />
        </div>
    )
}
