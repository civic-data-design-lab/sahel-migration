import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl';
import styles from '../../styles/MapJourney.module.css';
import stylesObject from './mapStyles';
mapboxgl.accessToken =
    'pk.eyJ1IjoibWl0Y2l2aWNkYXRhIiwiYSI6ImNpbDQ0aGR0djN3MGl1bWtzaDZrajdzb28ifQ.quOF41LsLB5FdjnGLwbrrg';
export default function MapJourney({ explorable }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(3);
    const [lat, setLat] = useState(25);
    const [zoom, setZoom] = useState(3.65);
    const [canExplore, setExplore] = useState(false);
    const { layersObject, highlightLayer } = stylesObject()

    useEffect(() => {
        setExplore(true);

        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mitcivicdata/cld132ji3001h01rn1jxjlyt4',
            center: [lng, lat],
            zoom: zoom,
        });

        map.current.on('load', () => {
            map.current.addSource('transect-route', {
                type: 'vector',
                url: 'mapbox://mitcivicdata.transect-segments'
            });
            map.current.addLayer(
                {
                    'id': 'terrain-data',
                    'type': 'line',
                    'source': 'transect-route',
                    'source-layer': 'transect-segments',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: layersObject["migrationRouteStyle"].paint
                }
            );
        })
        if (true) {
            map.current.setProjection('globe');
            setTimeout(() => {
                map.current.flyTo({
                    center: [10, 21],
                    zoom: 5,
                    speed: 0.5,
                    curve: 1,
                    pitch: 60,
                    bearing: -40.2,
                    easing(t) {
                        return t;
                    },
                });
            }, 3000);
        }
    }, [canExplore]);

    return (
        <div className={styles.container}>
            <div ref={mapContainer} className={styles.mapContainer} />
        </div>
    );
}
