import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl';
import styles from './../../styles/MapJourney.module.css'

mapboxgl.accessToken = 'pk.eyJ1IjoibWl0Y2l2aWNkYXRhIiwiYSI6ImNpbDQ0aGR0djN3MGl1bWtzaDZrajdzb28ifQ.quOF41LsLB5FdjnGLwbrrg';
export default function MapJourney({ explorable }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(3);
    const [lat, setLat] = useState(25);
    const [zoom, setZoom] = useState(3.65);
    const [canExplore, setExplore] = useState(false)
    // console.log(explorable, 'explore')
    const exploreRoute = () => {
        setExplore(!canExplore)
        console.log(canExplore)
    }
    useEffect(() => {
        if (map.current)
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mitcivicdata/cld132ji3001h01rn1jxjlyt4',
                center: [lng, lat],
                zoom: zoom
            });
        map.current.on('load', () => {
            map.current.setProjection('globe')
        })

        if (canExplore == true) {
            console.log('hello')
            setTimeout(() => {
                map.current.flyTo({
                    center: [4, 30],
                    zoom: 4,
                    speed: 0.2,
                    curve: 1,
                    pitch: 60,
                    bearing: -60,
                    easing(t) {
                        return t;
                    }
                })
            }, 2000)
        }
    }, [canExplore]);

    return (
        <div className={styles.container}>
            <button
                style={{
                    width: '10rem',
                    aspectRatio: 1 / 1,
                    position: 'absolute',
                    inset: 0,
                    zIndex: 100
                }}
                onClick={exploreRoute}>+</button>
            <div ref={mapContainer} className={styles.mapContainer} />
        </div>
    )
}
